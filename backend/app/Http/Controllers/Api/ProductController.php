<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Http\Response;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /** Public shop catalog: active products, optionally one category (?category=Wigs). */
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = Product::query()
            ->where('is_active', true)
            ->when($request->query('category'), fn ($q, $c) => $q->where('category', $c))
            ->ordered()
            ->get();

        return ProductResource::collection($products);
    }

    /** Admin listing: every product including inactive ones. */
    public function adminIndex(): AnonymousResourceCollection
    {
        return ProductResource::collection(Product::query()->ordered()->get());
    }

    public function store(StoreProductRequest $request): ProductResource
    {
        $product = Product::query()->create([
            ...$request->validated(),
            'slug' => $this->uniqueSlug($request->validated('name')),
        ]);

        return new ProductResource($product);
    }

    public function update(UpdateProductRequest $request, Product $product): ProductResource
    {
        $data = $request->validated();
        if (isset($data['name']) && $data['name'] !== $product->name) {
            $data['slug'] = $this->uniqueSlug($data['name'], $product->id);
        }

        $product->update($data);

        return new ProductResource($product->fresh());
    }

    /** Nothing references products yet (no orders), so delete outright. */
    public function destroy(Product $product): Response
    {
        $product->delete();

        return response()->noContent();
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'product';
        $slug = $base;
        $i = 2;
        while (
            Product::query()
                ->where('slug', $slug)
                ->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
