<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Http\Resources\ServiceCategoryResource;
use App\Models\ServiceCategory;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;
use Illuminate\Support\Str;

class ServiceCategoryController extends Controller
{
    /** In the site's page order. ?kind=services|packages narrows to one kind. */
    public function index(Request $request): AnonymousResourceCollection
    {
        return ServiceCategoryResource::collection(
            ServiceCategory::query()
                ->when($request->query('kind'), fn ($q, $kind) => $q->where('kind', $kind))
                ->orderBy('sort_order')
                ->orderBy('name')
                ->get(),
        );
    }

    public function store(StoreCategoryRequest $request): ServiceCategoryResource
    {
        $category = ServiceCategory::query()->create([
            ...$request->safe()->except('name'),
            'name' => $request->validated('name'),
            'slug' => $this->uniqueSlug($request->validated('name')),
        ]);

        return new ServiceCategoryResource($category);
    }

    /**
     * The slug is kept on rename: it is the website page's URL
     * (/services/<slug>), which looks its services up by it.
     */
    public function update(UpdateCategoryRequest $request, ServiceCategory $category): ServiceCategoryResource
    {
        $category->update($request->validated());

        return new ServiceCategoryResource($category->fresh());
    }

    /**
     * Delete the category. Services and packages that referenced it keep their
     * rows — their category_id is set to null by the foreign key (nullOnDelete).
     */
    public function destroy(ServiceCategory $category): \Illuminate\Http\Response
    {
        $category->delete();

        return response()->noContent();
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name) ?: 'category';
        $slug = $base;
        $i = 2;
        while (
            ServiceCategory::query()
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
