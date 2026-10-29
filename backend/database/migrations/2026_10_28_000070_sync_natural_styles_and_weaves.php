<?php

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Services\PricingService;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * Natural Hair Styling and Weaves from the salon's "Service Menu".
 *
 * Same idempotent upsert as the other menu migrations: an existing service (by
 * menu name or an earlier name) is updated in place, a missing one is created,
 * and prices go through the append-only ledger. Each service is placed in the
 * category its menu section belongs to.
 *
 * The menu's Add-Ons (Glory Package, Trim, New Look Cut, Single Tracks) are
 * not part of this migration.
 */
return new class extends Migration
{
    private const CATEGORIES = [
        'natural-styles' => 'Natural Styles',
        'wigs-extensions' => 'Wigs & Extensions',
    ];

    /** [category slug, menu name, duration minutes, price, menu note (new rows only), earlier names to match]. */
    private const SERVICES = [
        // Natural Hair Styling
        ['natural-styles', 'Classic Silk Press', 45, '155.00', null, ['Silk Press']],
        ['natural-styles', 'Silk Press Plus', 60, '200.00', 'Silk press + spa treatment.', []],
        ['natural-styles', 'The Glorious Silk Press', 60, '275.00', 'Silk press + trim + treatment.', ['Glorious Silk Press']],
        ['natural-styles', 'Roller Set', 60, '155.00', null, []],
        ['natural-styles', 'Flat Twists or Two-Strand Twists', 60, '130.00', null, ['Flat Twist', 'Flat Twists']],
        ['natural-styles', 'Styled Ponytail', 60, '200.00', null, []],
        ['natural-styles', 'Wash & Go', 30, '80.00', null, ['Wash and Go']],
        ['natural-styles', 'Trim Only', 30, '100.00', 'Includes wash.', []],
        // Weaves — sew-ins & extensions
        ['wigs-extensions', 'Classic Sew-In with Leave-Out', 120, '655.00', null, ['Full Weave w/ Leave Out']],
        ['wigs-extensions', 'The Glorious Sew-In', 135, '785.00', 'Sew-in + trim + treatment.', ['Glorious Sew-In']],
        ['wigs-extensions', 'Classic Closure Sew-In or Full Weave', 150, '755.00', null, ['Full-Head Weave']],
        ['wigs-extensions', 'The Glorious Closure or Full Weave', 165, '885.00', 'Closure or full weave + trim + treatment.', ['Glorious Closure or Full Weave']],
        ['wigs-extensions', 'Weave Wash', 45, '160.00', null, []],
    ];

    public function up(): void
    {
        $pricing = app(PricingService::class);

        DB::transaction(function () use ($pricing) {
            $categories = [];
            foreach (self::CATEGORIES as $slug => $name) {
                $categories[$slug] = ServiceCategory::query()->firstOrCreate(['slug' => $slug], ['name' => $name]);
            }

            foreach (self::SERVICES as [$slug, $name, $duration, $price, $note, $aliases]) {
                $category = $categories[$slug];
                $names = array_map('strtolower', [$name, ...$aliases]);

                $service = Service::query()
                    ->whereIn(DB::raw('LOWER(name)'), $names)
                    ->orderBy('id')
                    ->first();

                if ($service) {
                    $service->update([
                        'name' => $name,
                        'duration_minutes' => $duration,
                        'category_id' => $category->id,
                    ]);
                } else {
                    $service = Service::query()->create([
                        'category_id' => $category->id,
                        'name' => $name,
                        'description' => $note ?? "Signature {$category->name} experience by October Glory.",
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
