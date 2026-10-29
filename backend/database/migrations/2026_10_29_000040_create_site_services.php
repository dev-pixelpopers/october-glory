<?php

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\WorkerProfile;
use App\Services\PricingService;
use Database\Seeders\SiteCatalog;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Every service the website shows, at the price its page shows (see
 * Database\Seeders\SiteCatalog). Services whose page shows no price are
 * "by consultation". Idempotent: matched by slug, so re-running updates them.
 *
 * Worker qualifications were cleared with the old services, so every worker
 * is qualified for the whole new catalog — refine per worker in the dashboard.
 */
return new class extends Migration
{
    public function up(): void
    {
        $pricing = app(PricingService::class);

        DB::transaction(function () use ($pricing) {
            $categories = ServiceCategory::query()->pluck('id', 'slug');

            foreach (SiteCatalog::SERVICES as $position => [$category, $slug, $name, $price, $minutes, $image, $description]) {
                $service = Service::query()->updateOrCreate(
                    ['slug' => $slug],
                    [
                        'category_id' => $categories[$category] ?? null,
                        'name' => $name,
                        'description' => $description,
                        'image' => $image,
                        'duration_minutes' => $minutes,
                        'price_by_consultation' => $price === null,
                        'is_active' => true,
                        'sort_order' => $position + 1,
                    ],
                );

                // No-op when already at this price; a change opens a new ledger row.
                $pricing->setPrice($service, $price ?? '0.00');
            }

            $ids = Service::query()
                ->whereIn('slug', array_column(SiteCatalog::SERVICES, 1))
                ->pluck('id')
                ->all();

            WorkerProfile::query()->each(fn (WorkerProfile $profile) => $profile->services()->syncWithoutDetaching($ids));
        });
    }

    public function down(): void
    {
        Service::query()
            ->whereIn('slug', array_column(SiteCatalog::SERVICES, 1))
            ->whereDoesntHave('appointmentLines')
            ->delete();
    }
};
