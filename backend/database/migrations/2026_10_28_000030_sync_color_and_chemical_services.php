<?php

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Services\PricingService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Color & chemical services from the salon's "Color, Chemical & Wigs" menu.
 *
 * Idempotent upsert: a service that already exists (by its menu name or a
 * name it was previously stored under) is updated in place — renamed,
 * re-timed and re-priced — never duplicated. Missing services are created.
 * Prices go through the append-only ledger, so a change closes the old
 * price row rather than overwriting it.
 */
return new class extends Migration
{
    private const CATEGORY = ['name' => 'Chemical Services', 'slug' => 'chemical-services'];

    /** [menu name, duration minutes, price, earlier names to match]. */
    private const SERVICES = [
        // Color
        ['Full Head Highlights', 90, '350.00', ['Full Highlights Or Foilayage', 'Full Highlights']],
        ['Half Head Highlights', 90, '200.00', ['Half-Head Highlights']],
        ['Face-Frame Highlights', 90, '150.00', ['Face Frame Highlights']],
        ['Virgin Color', 90, '220.00', []],
        ['Color Retouch', 90, '150.00', []],
        // Chemical
        ['Relaxer Retouch', 90, '200.00', ['Relaxer Touch Up', 'Relaxer Touch-Up']],
        ['Virgin Relaxer', 90, '250.00', []],
    ];

    public function up(): void
    {
        $pricing = app(PricingService::class);

        DB::transaction(function () use ($pricing) {
            $category = ServiceCategory::query()->firstOrCreate(
                ['slug' => self::CATEGORY['slug']],
                ['name' => self::CATEGORY['name']],
            );

            foreach (self::SERVICES as [$name, $duration, $price, $aliases]) {
                $names = array_map('strtolower', [$name, ...$aliases]);

                $service = Service::query()
                    ->whereIn(DB::raw('LOWER(name)'), $names)
                    ->orderBy('id')
                    ->first();

                if ($service) {
                    $service->update([
                        'name' => $name,
                        'duration_minutes' => $duration,
                        'category_id' => $service->category_id ?? $category->id,
                    ]);
                } else {
                    $service = Service::query()->create([
                        'category_id' => $category->id,
                        'name' => $name,
                        'description' => 'Signature Chemical Services experience by October Glory.',
                        'duration_minutes' => $duration,
                        'is_active' => true,
                    ]);
                }

                // No-op when the price is already current.
                $pricing->setPrice($service, $price);
            }
        });
    }

    /**
     * Not reversed: rolling back would discard ledger history and could delete
     * services that appointments already reference. Adjust in the dashboard.
     */
    public function down(): void {}
};
