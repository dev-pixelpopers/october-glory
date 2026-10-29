<?php

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Services\PricingService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Wig services from the salon's "Color, Chemical & Wigs" menu.
 *
 * Same idempotent upsert as sync_color_and_chemical_services: an existing
 * service (by menu name or an earlier name) is updated in place, a missing one
 * is created, and prices go through the append-only ledger.
 *
 * The two custom units (Classic / The Glorious Custom Unit) are priced "by
 * consultation" on the menu. A service needs a fixed price, so they are not
 * added here — clients book them through the existing Wig Unit Consult.
 */
return new class extends Migration
{
    private const CATEGORY = ['name' => 'Wigs & Extensions', 'slug' => 'wigs-extensions'];

    /** [menu name, duration minutes, price, menu note (new rows only), earlier names to match]. */
    private const SERVICES = [
        ['Wig Wash', 45, '175.00', null, []],
        ['Wig Breakdown', 90, '125.00', null, []],
        ['Wig Breakdown + Treatment', 90, '175.00', 'Wig breakdown with a treatment.', ['Wig Breakdown & Treatment']],
        ['Classic Wig Maintenance', 90, '300.00', 'Wig + natural hair care.', []],
        ['Wig Maintenance Plus', 90, '355.00', 'Wig + natural hair care + treatment.', []],
        ['The Glorious Wig Maintenance', 90, '430.00', 'Wig + natural hair care + trim + treatment.', ['Glorious Wig Maintenance']],
    ];

    public function up(): void
    {
        $pricing = app(PricingService::class);

        DB::transaction(function () use ($pricing) {
            $category = ServiceCategory::query()->firstOrCreate(
                ['slug' => self::CATEGORY['slug']],
                ['name' => self::CATEGORY['name']],
            );

            foreach (self::SERVICES as [$name, $duration, $price, $note, $aliases]) {
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
                        'description' => $note ?? 'Signature Wigs & Extensions experience by October Glory.',
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
