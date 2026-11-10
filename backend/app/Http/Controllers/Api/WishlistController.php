<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /**
     * Return authenticated user's saved wishlist products.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $products = $user->wishlistProducts()
            ->where('is_active', true)
            ->ordered()
            ->get();

        return response()->json([
            'data' => ProductResource::collection($products),
            'count' => $products->count(),
        ]);
    }

    /**
     * Add or remove a product from the user's wishlist.
     */
    public function toggle(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ]);

        $user = $request->user();
        $productId = (int) $validated['product_id'];

        $existing = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($existing) {
            $existing->delete();
            $inWishlist = false;
            $message = 'Product removed from wishlist';
        } else {
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);
            $inWishlist = true;
            $message = 'Product added to wishlist';
        }

        $count = $user->wishlistItems()->count();

        return response()->json([
            'message' => $message,
            'product_id' => $productId,
            'in_wishlist' => $inWishlist,
            'count' => $count,
        ]);
    }
}
