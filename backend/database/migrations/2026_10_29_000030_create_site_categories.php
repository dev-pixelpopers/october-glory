<?php

use App\Models\ServiceCategory;
use Database\Seeders\SiteCatalog;
use Illuminate\Database\Migrations\Migration;

/** One category per website page, named after the page, with its image. */
return new class extends Migration
{
    public function up(): void
    {
        foreach (SiteCatalog::CATEGORIES as $slug => [$name, $kind, $image, $position]) {
            ServiceCategory::query()->updateOrCreate(
                ['slug' => $slug],
                ['name' => $name, 'kind' => $kind, 'image' => $image, 'sort_order' => $position],
            );
        }
    }

    public function down(): void
    {
        ServiceCategory::query()->whereIn('slug', array_keys(SiteCatalog::CATEGORIES))->delete();
    }
};
