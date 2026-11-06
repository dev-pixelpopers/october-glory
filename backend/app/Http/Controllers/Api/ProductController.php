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
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    /** Public shop catalog: active products, optionally one category (?category=Wigs). */
    public function index(Request $request): AnonymousResourceCollection
    {
        $products = Product::query()
            ->where('is_active', true)
            ->when($request->query('category'), function ($q, $c) {
                $trimmed = strtolower(rtrim($c, 's'));
                $q->where(function ($sub) use ($c, $trimmed) {
                    $sub->where('category', $c)
                        ->orWhereRaw('LOWER(category) = ?', [strtolower($c)])
                        ->orWhereRaw('LOWER(category) LIKE ?', [$trimmed . '%']);
                });
            })
            ->ordered()
            ->get();

        return ProductResource::collection($products);
    }

    /** Admin listing: every product including inactive ones. */
    public function adminIndex(): AnonymousResourceCollection
    {
        return ProductResource::collection(Product::query()->ordered()->get());
    }

    /** Public single product by slug or id. */
    public function show(string $slug): ProductResource
    {
        $product = Product::query()
            ->where('is_active', true)
            ->where(function ($q) use ($slug) {
                $q->where('slug', $slug);
                if (is_numeric($slug)) {
                    $q->orWhere('id', (int) $slug);
                }
            })
            ->firstOrFail();

        return new ProductResource($product);
    }

    public function store(StoreProductRequest $request): ProductResource
    {
        $data = $request->validated();

        // Handle image (file or URL)
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images/products', 'public');
            $data['image'] = Storage::disk('public')->url($path);
        } elseif (isset($data['image']) && is_string($data['image'])) {
            $data['image'] = trim($data['image']) ?: null;
        }

        // Handle background_image (file or URL)
        if ($request->hasFile('background_image')) {
            $path = $request->file('background_image')->store('images/products', 'public');
            $data['background_image'] = Storage::disk('public')->url($path);
        } elseif (isset($data['background_image']) && is_string($data['background_image'])) {
            $data['background_image'] = trim($data['background_image']) ?: null;
        }

        // Handle video (file or URL)
        if ($request->hasFile('video')) {
            $path = $request->file('video')->store('videos/products', 'public');
            $data['video'] = Storage::disk('public')->url($path);
        } elseif (isset($data['video']) && is_string($data['video'])) {
            $data['video'] = trim($data['video']) ?: null;
        }

        // Handle the_install items (file or URL for each image, string tag)
        if (isset($data['the_install']) && is_array($data['the_install'])) {
            $data['the_install'] = $this->processInstallItems($data['the_install'], $request);
        }

        $product = Product::query()->create([
            ...$data,
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

        // Handle image (file or URL)
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('images/products', 'public');
            $data['image'] = Storage::disk('public')->url($path);
        } elseif (array_key_exists('image', $data)) {
            $data['image'] = is_string($data['image']) && trim($data['image']) !== ''
                ? trim($data['image'])
                : null;
        }

        // Handle background_image (file or URL)
        if ($request->hasFile('background_image')) {
            $path = $request->file('background_image')->store('images/products', 'public');
            $data['background_image'] = Storage::disk('public')->url($path);
        } elseif (array_key_exists('background_image', $data)) {
            $data['background_image'] = is_string($data['background_image']) && trim($data['background_image']) !== ''
                ? trim($data['background_image'])
                : null;
        }

        // Handle video (file or URL)
        if ($request->hasFile('video')) {
            $path = $request->file('video')->store('videos/products', 'public');
            $data['video'] = Storage::disk('public')->url($path);
        } elseif (array_key_exists('video', $data)) {
            $data['video'] = is_string($data['video']) && trim($data['video']) !== ''
                ? trim($data['video'])
                : null;
        }

        // Handle the_install items (file or URL for each image, string tag)
        if (array_key_exists('the_install', $data)) {
            $data['the_install'] = is_array($data['the_install'])
                ? $this->processInstallItems($data['the_install'], $request)
                : null;
        }

        $product->update($data);

        return new ProductResource($product->fresh());
    }

    /**
     * Process each item in the_install array:
     * - Handle file upload or string URL for 'image'
     * - Ensure string for 'tag'
     * Returns an array of objects: [['image' => string, 'tag' => string], ...]
     */
    private function processInstallItems(array $items, Request $request): array
    {
        $processed = [];

        foreach ($items as $idx => $item) {
            if (!is_array($item)) {
                continue;
            }

            $imageUrl = '';

            // Check if file uploaded for this install item
            if ($request->hasFile("the_install.{$idx}.image")) {
                $file = $request->file("the_install.{$idx}.image");
                $path = $file->store('images/products', 'public');
                $imageUrl = Storage::disk('public')->url($path);
            } elseif (isset($item['image']) && $item['image'] instanceof \Illuminate\Http\UploadedFile) {
                $path = $item['image']->store('images/products', 'public');
                $imageUrl = Storage::disk('public')->url($path);
            } elseif (isset($item['image']) && is_string($item['image'])) {
                $imageUrl = trim($item['image']);
            }

            $tag = isset($item['tag']) && is_string($item['tag']) ? trim($item['tag']) : '';

            if ($imageUrl !== '' || $tag !== '') {
                $processed[] = [
                    'image' => $imageUrl,
                    'tag' => $tag,
                ];
            }
        }

        return $processed;
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
