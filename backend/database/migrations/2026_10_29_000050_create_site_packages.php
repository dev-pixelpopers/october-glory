<?php

use App\Models\Package;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Services\PricingService;
use Database\Seeders\SiteCatalog;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * The packages on the website's Maintenance, Glorious and Bridal pages, each
 * in its page's category (see Database\Seeders\SiteCatalog). Idempotent:
 * matched by slug, so re-running updates them.
 */
return new class extends Migration
{
    public function up(): void
    {
        $pricing = app(PricingService::class);

        DB::transaction(function () use ($pricing) {
            $categories = ServiceCategory::query()->pluck('id', 'slug');
            $services = Service::query()->whereNotNull('slug')->pluck('id', 'slug');

            foreach (SiteCatalog::PACKAGES as $data) {
                $package = Package::query()->updateOrCreate(
                    ['slug' => $data['slug']],
                    [
                        'category_id' => $categories[$data['category']] ?? null,
                        'collection' => $data['collection'],
                        'name' => $data['name'],
                        'tagline' => $data['tagline'],
                        'description' => $data['tagline'],
                        'image' => $data['image'],
                        'includes' => $data['includes'],
                        'not_included' => $data['not_included'],
                        'best_for' => $data['best_for'],
                        'is_featured' => $data['is_featured'],
                        'is_active' => true,
                    ],
                );

                $pivot = [];
                foreach ($data['services'] as $position => $slug) {
                    if (isset($services[$slug])) {
                        $pivot[$services[$slug]] = ['position' => $position];
                    }
                }
                $package->services()->sync($pivot);

                $pricing->setPackagePrice($package, $data['price']);
            }
        });
    }

    public function down(): void
    {
        Package::query()->whereIn('slug', array_column(SiteCatalog::PACKAGES, 'slug'))->delete();
    }
};
