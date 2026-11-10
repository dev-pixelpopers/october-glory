<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    /**
     * Store a new e-commerce order (public / guest or authenticated client).
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array', 'min:1'],
            'items.*.product_id' => ['required', 'integer', 'exists:products,id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.variant_id' => ['nullable'],

            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:50'],

            'shipping_address_line1' => ['required', 'string', 'max:255'],
            'shipping_address_line2' => ['nullable', 'string', 'max:255'],
            'shipping_city' => ['required', 'string', 'max:100'],
            'shipping_state' => ['required', 'string', 'max:100'],
            'shipping_postal_code' => ['required', 'string', 'max:20'],
            'shipping_country' => ['nullable', 'string', 'max:100'],
            'shipping_method' => ['nullable', 'string'],

            'payment_method' => ['nullable', 'string'],
            'notes' => ['nullable', 'string'],
        ]);

        $user = $request->user();
        if (!$user && !empty($validated['customer_email'])) {
            $user = User::where('email', $validated['customer_email'])->first();
        }

        $order = DB::transaction(function () use ($validated, $user) {
            $rawItems = $validated['items'];
            $productIds = collect($rawItems)->pluck('product_id')->unique()->all();

            $products = Product::whereIn('id', $productIds)->lockForUpdate()->get()->keyBy('id');

            $orderItemsData = [];
            $subtotal = 0.0;

            foreach ($rawItems as $item) {
                $pid = (int) $item['product_id'];
                $qty = (int) $item['quantity'];

                /** @var Product|null $prod */
                $prod = $products->get($pid);

                if (!$prod || !$prod->is_active) {
                    throw ValidationException::withMessages([
                        'items' => ["The product '{$prod?->name}' is no longer available."],
                    ]);
                }

                if ($prod->stock !== null && $prod->stock < $qty) {
                    throw ValidationException::withMessages([
                        'items' => ["Only {$prod->stock} units of '{$prod->name}' are currently in stock."],
                    ]);
                }

                // Deduct inventory
                if ($prod->stock !== null) {
                    $prod->decrement('stock', $qty);
                }

                $unitPrice = (float) $prod->price;
                $lineTotal = round($unitPrice * $qty, 2);
                $subtotal += $lineTotal;

                $orderItemsData[] = [
                    'product_id' => $prod->id,
                    'product_name' => $prod->name,
                    'product_slug' => $prod->slug,
                    'product_image' => $prod->image ?? $prod->background_image,
                    'variant_id' => $item['variant_id'] ?? null,
                    'unit_price' => $unitPrice,
                    'quantity' => $qty,
                    'line_total' => $lineTotal,
                ];
            }

            $shippingCost = 0.00; // Free luxury studio shipping
            $tax = 0.00;
            $total = round($subtotal + $shippingCost + $tax, 2);

            $order = Order::create([
                'order_number' => Order::generateOrderNumber(),
                'user_id' => $user?->id,
                'status' => Order::STATUS_PENDING,
                'payment_status' => Order::PAYMENT_PAID,
                'payment_method' => $validated['payment_method'] ?? 'card',
                'customer_name' => $validated['customer_name'],
                'customer_email' => $validated['customer_email'],
                'customer_phone' => $validated['customer_phone'],
                'shipping_address_line1' => $validated['shipping_address_line1'],
                'shipping_address_line2' => $validated['shipping_address_line2'] ?? null,
                'shipping_city' => $validated['shipping_city'],
                'shipping_state' => $validated['shipping_state'],
                'shipping_postal_code' => $validated['shipping_postal_code'],
                'shipping_country' => $validated['shipping_country'] ?? 'United States',
                'shipping_method' => $validated['shipping_method'] ?? 'standard',
                'shipping_cost' => $shippingCost,
                'subtotal' => $subtotal,
                'tax' => $tax,
                'total' => $total,
                'notes' => $validated['notes'] ?? null,
            ]);

            foreach ($orderItemsData as $itemData) {
                $order->items()->create($itemData);
            }

            return $order;
        });

        // 1. Notify Admins
        try {
            NotificationService::notifyAdmins(
                'order.created',
                "New Order: #{$order->order_number}",
                "Customer {$order->customer_name} placed an order for \${$order->total}.",
                $order,
                [
                    'order_id' => $order->id,
                    'order_number' => $order->order_number,
                    'total' => $order->total,
                    'customer_name' => $order->customer_name,
                ]
            );
        } catch (\Throwable $e) {
            logger()->warning('Failed to send admin order notification: ' . $e->getMessage());
        }

        // 2. Notify Client (if user registered)
        if ($order->user_id) {
            try {
                NotificationService::notify(
                    $order->user_id,
                    'order.confirmed',
                    "Order Confirmed: #{$order->order_number}",
                    "Thank you for your order! We have received your purchase and are preparing it for delivery.",
                    $order,
                    [
                        'order_id' => $order->id,
                        'order_number' => $order->order_number,
                        'total' => $order->total,
                    ]
                );
            } catch (\Throwable $e) {
                logger()->warning('Failed to send client order notification: ' . $e->getMessage());
            }
        }

        $order->load('items');

        return response()->json([
            'message' => 'Order placed successfully',
            'order' => new OrderResource($order),
        ], 201);
    }

    /**
     * Authenticated client: list their own orders.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        $orders = Order::forUser($user)
            ->with('items')
            ->latest()
            ->paginate($request->integer('per_page', 15));

        return OrderResource::collection($orders)->response();
    }

    /**
     * Authenticated client or admin: view single order.
     */
    public function show(Request $request, int $id): JsonResponse
    {
        $user = $request->user();
        $order = Order::with('items')->findOrFail($id);

        if (!$user->isAdmin() && $order->user_id !== $user->id && strtolower($order->customer_email) !== strtolower($user->email)) {
            abort(403, 'Unauthorized access to this order.');
        }

        return response()->json([
            'data' => new OrderResource($order),
        ]);
    }

    /**
     * Public guest lookup by order number and email.
     */
    public function lookup(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'order_number' => ['required', 'string'],
            'email' => ['required', 'email'],
        ]);

        $order = Order::where('order_number', $validated['order_number'])
            ->where('customer_email', $validated['email'])
            ->with('items')
            ->firstOrFail();

        return response()->json([
            'data' => new OrderResource($order),
        ]);
    }

    /**
     * Admin: list all orders with filters and summary stats.
     */
    public function adminIndex(Request $request): JsonResponse
    {
        $query = Order::with('items')->latest();

        // Status filter
        if ($status = $request->input('status')) {
            if ($status !== 'all') {
                $query->where('status', $status);
            }
        }

        // Search query
        if ($search = $request->input('q')) {
            $query->where(function ($q) use ($search) {
                $q->where('order_number', 'like', "%{$search}%")
                  ->orWhere('customer_name', 'like', "%{$search}%")
                  ->orWhere('customer_email', 'like', "%{$search}%")
                  ->orWhere('customer_phone', 'like', "%{$search}%")
                  ->orWhere('tracking_number', 'like', "%{$search}%");
            });
        }

        $orders = $query->paginate($request->integer('per_page', 15));

        // Status summary counts
        $counts = [
            'all' => Order::count(),
            'pending' => Order::where('status', Order::STATUS_PENDING)->count(),
            'processing' => Order::where('status', Order::STATUS_PROCESSING)->count(),
            'shipped' => Order::where('status', Order::STATUS_SHIPPED)->count(),
            'delivered' => Order::where('status', Order::STATUS_DELIVERED)->count(),
            'cancelled' => Order::where('status', Order::STATUS_CANCELLED)->count(),
        ];

        return response()->json([
            'data' => OrderResource::collection($orders),
            'meta' => [
                'current_page' => $orders->currentPage(),
                'last_page' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total' => $orders->total(),
            ],
            'counts' => $counts,
        ]);
    }

    /**
     * Admin: update order status and tracking number.
     */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $order = Order::with('items')->findOrFail($id);

        $validated = $request->validate([
            'status' => ['required', 'string', 'in:pending,processing,shipped,delivered,cancelled'],
            'tracking_number' => ['nullable', 'string', 'max:100'],
            'payment_status' => ['nullable', 'string', 'in:pending,paid,failed,refunded'],
            'notes' => ['nullable', 'string'],
        ]);

        $oldStatus = $order->status;
        $newStatus = $validated['status'];

        $order->status = $newStatus;

        if (array_key_exists('tracking_number', $validated)) {
            $order->tracking_number = $validated['tracking_number'];
        }

        if (array_key_exists('payment_status', $validated)) {
            $order->payment_status = $validated['payment_status'];
        }

        if (array_key_exists('notes', $validated)) {
            $order->notes = $validated['notes'];
        }

        if ($newStatus === Order::STATUS_SHIPPED && !$order->shipped_at) {
            $order->shipped_at = now();
        }

        if ($newStatus === Order::STATUS_DELIVERED && !$order->delivered_at) {
            $order->delivered_at = now();
        }

        // If cancelled, restore stock
        if ($newStatus === Order::STATUS_CANCELLED && $oldStatus !== Order::STATUS_CANCELLED) {
            foreach ($order->items as $item) {
                if ($item->product_id) {
                    Product::where('id', $item->product_id)->increment('stock', $item->quantity);
                }
            }
        }

        $order->save();

        // Notify client about status change
        if ($oldStatus !== $newStatus && $order->user_id) {
            try {
                $statusMsg = "Your order status has been updated to: " . ucfirst($newStatus) . ".";
                if ($order->tracking_number) {
                    $statusMsg .= " Tracking Number: {$order->tracking_number}";
                }

                NotificationService::notify(
                    $order->user_id,
                    'order.status_updated',
                    "Order #{$order->order_number} Update",
                    $statusMsg,
                    $order,
                    [
                        'order_id' => $order->id,
                        'order_number' => $order->order_number,
                        'status' => $newStatus,
                        'tracking_number' => $order->tracking_number,
                    ]
                );
            } catch (\Throwable $e) {
                logger()->warning('Failed to send client order status update notification: ' . $e->getMessage());
            }
        }

        return response()->json([
            'message' => "Order #{$order->order_number} status updated to {$newStatus}.",
            'order' => new OrderResource($order),
        ]);
    }
}
