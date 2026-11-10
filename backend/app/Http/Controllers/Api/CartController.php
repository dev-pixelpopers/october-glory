<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Validate cart items against live DB prices and stock levels.
     */
    public function validateCart(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => ['required', 'array'],
            'items.*.product_id' => ['required', 'integer'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'items.*.variant_id' => ['nullable'],
        ]);

        $rawItems = $validated['items'];
        $productIds = collect($rawItems)->pluck('product_id')->unique()->filter()->values()->all();

        $products = Product::whereIn('id', $productIds)->get()->keyBy('id');

        $validatedItems = [];
        $subtotal = 0.0;
        $totalItems = 0;
        $hasOutOfStock = false;
        $messages = [];

        foreach ($rawItems as $raw) {
            $productId = (int) $raw['product_id'];
            $qty = max(1, (int) $raw['quantity']);
            $variantId = $raw['variant_id'] ?? null;

            /** @var Product|null $product */
            $product = $products->get($productId);

            if (!$product || !$product->is_active) {
                $hasOutOfStock = true;
                $validatedItems[] = [
                    'product_id' => $productId,
                    'name' => $product?->name ?? 'Unavailable Product',
                    'slug' => $product?->slug ?? '',
                    'image' => $product?->image ?? null,
                    'unit_price' => 0.00,
                    'quantity' => $qty,
                    'line_total' => 0.00,
                    'in_stock' => false,
                    'available_stock' => 0,
                    'variant_id' => $variantId,
                    'error' => 'This product is no longer available.',
                ];
                $messages[] = ($product?->name ?? "Product #{$productId}") . ' is no longer available.';
                continue;
            }

            $currentPrice = (float) $product->price;
            $stock = $product->stock !== null ? (int) $product->stock : 10;
            $isItemInStock = $stock >= $qty;

            if (!$isItemInStock) {
                $hasOutOfStock = true;
                $messages[] = "Only {$stock} left in stock for {$product->name}.";
            }

            $lineTotal = round($currentPrice * $qty, 2);
            $subtotal += $lineTotal;
            $totalItems += $qty;

            $validatedItems[] = [
                'product_id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'image' => $product->image ?? $product->background_image,
                'unit_price' => $currentPrice,
                'quantity' => $qty,
                'line_total' => $lineTotal,
                'in_stock' => $isItemInStock,
                'available_stock' => $stock,
                'variant_id' => $variantId,
                'error' => $isItemInStock ? null : "Requested {$qty}, but only {$stock} in stock.",
            ];
        }

        $subtotal = round($subtotal, 2);
        // Free shipping on luxury orders
        $shipping = 0.00;
        $tax = 0.00;
        $total = round($subtotal + $shipping + $tax, 2);

        return response()->json([
            'valid' => !$hasOutOfStock,
            'items' => $validatedItems,
            'subtotal' => $subtotal,
            'tax' => $tax,
            'shipping' => $shipping,
            'total' => $total,
            'total_items' => $totalItems,
            'has_out_of_stock' => $hasOutOfStock,
            'messages' => $messages,
        ]);
    }
}
