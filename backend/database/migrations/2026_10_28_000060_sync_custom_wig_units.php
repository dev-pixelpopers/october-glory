<?php

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Services\PricingService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * The two custom units from the "Color, Chemical & Wigs" menu, priced "by
 * consultation". Same idempotent upsert as sync_wig_services: existing rows are
 * updated in place, missing ones created. The ledger holds 0.00 so the unit
 * adds nothing to a booking total until the stylist quotes it.
 *
 * The menu gives no duration; 90 minutes matches the rest of the wig menu and
 * can be changed in the dashboard.
 */
return new class extends Migration
{
    private const CATEGORY = ['name' => 'Wigs & Extensions', 'slug' => 'wigs-extensions'];

    /** [menu name, duration minutes, menu note (new rows only), earlier names to match]. */
    private const SERVICES = [
        ['Classic Custom Unit', 90, 'A custom unit built for you. Priced at your consultation.', []],
        ['The Glorious Custom Unit', 90, 'Custom unit + trim + treatment. Priced at your consultation.', ['Glorious Custom Unit']],
    ];

    public function up(): void
    {
        $pricing = app(PricingService::class);

        DB::transaction(function () use ($pricing) {
            $category = ServiceCategory::query()->firstOrCreate(
                ['slug' => self::CATEGORY['slug']],
                ['name' => self::CATEGORY['name']],
            );

            foreach (self::SERVICES as [$name, $duration, $note, $aliases]) {
                $names = array_map('strtolower', [$name, ...$aliases]);

                $service = Service::query()
                    ->whereIn(DB::raw('LOWER(name)'), $names)
                    ->orderBy('id')
                    ->first();

                if ($service) {
                    $service->update([
                        'name' => $name,
                        'duration_minutes' => $duration,
                        'price_by_consultation' => true,
                        'category_id' => $service->category_id ?? $category->id,
                    ]);
                } else {
                    $service = Service::query()->create([
                        'category_id' => $category->id,
                        'name' => $name,
                        'description' => $note,
                        'duration_minutes' => $duration,
                        'price_by_consultation' => true,
                        'is_active' => true,
                    ]);
                }

                // No-op when already 0.00.
                $pricing->setPrice($service, '0.00');
            }
        });
    }

    /**
     * Not reversed: appointments may already reference these services.
     * Deactivate them in the dashboard instead.
     */
    public function down(): void {}
};
