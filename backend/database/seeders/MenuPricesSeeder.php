<?php

namespace Database\Seeders;

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\Setting;
use App\Models\WorkerProfile;
use App\Services\PricingService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * Prices and durations from the salon's printed menus ("Service Menu" and
 * "Color, Chemical & Wigs"), applied on top of the website catalog.
 *
 *   php artisan db:seed --class=MenuPricesSeeder
 *
 * - UPDATES give existing site services the menu's name, price and duration.
 *   Slugs, pages and images stay as the site has them, so site links keep
 *   working. A menu line that covers two site services (e.g. "Flat Twists or
 *   Two-Strand Twists") prices both but names only one, so no name repeats.
 * - ADDITIONS are menu items with no site service. Each is looked up by slug
 *   and by name first, so running this any number of times never creates a
 *   second copy of a service.
 * - Prices go through the append-only ledger: an unchanged price writes
 *   nothing, a changed one closes the old row and opens a new one.
 *
 * Running it re-applies the menu, so it would undo a later dashboard price
 * change for these services. DatabaseSeeder therefore runs it only once
 * (tracked by the MENU_VERSION setting); run it with --class to re-apply.
 */
class MenuPricesSeeder extends Seeder
{
    public const SETTING_KEY = 'catalog.menu_prices_version';

    /** Bump when the menu data below changes, so DatabaseSeeder applies it again. */
    public const MENU_VERSION = '2026-10-29.2';

    /**
     * Site service slug => [price (null = by consultation), minutes, menu name
     * (null = keep the site's name)].
     */
    public const UPDATES = [
        // Color, Chemical & Wigs — Color
        'full-highlights-or-foilayage' => ['350.00', 90, 'Full Head Highlights'],
        'half-head-highlights' => ['200.00', 90, 'Half Head Highlights'],
        'color-retouch' => ['150.00', 90, 'Color Retouch'],
        // Color, Chemical & Wigs — Chemical
        'relaxer-touch-up' => ['200.00', 90, 'Relaxer Retouch'],
        'virgin-relaxer' => ['250.00', 90, 'Virgin Relaxer'],
        // Color, Chemical & Wigs — Wig Services
        'wig-wash' => ['175.00', 45, 'Wig Wash'],
        // The site's Wig Design & Consult page is this service.
        'wig-design-and-consult' => [null, 60, 'Classic Custom Unit'],

        // Service Menu — Natural Hair Styling
        'silk-press' => ['155.00', 45, 'Classic Silk Press'],
        'flat-twist' => ['130.00', 60, 'Flat Twists or Two-Strand Twists'],
        // Same menu line as flat-twist: priced the same, keeps its own name.
        '2-strand-twist' => ['130.00', 60, null],
        'ponytail-and-updo' => ['200.00', 60, 'Styled Ponytail'],
        'wash-and-go' => ['80.00', 30, 'Wash & Go'],
        // Service Menu — Weaves
        'full-weave-with-leave-out' => ['655.00', 120, 'Classic Sew-In with Leave-Out'],
        'full-head-weave' => ['755.00', 150, 'Classic Closure Sew-In or Full Weave'],
        // Service Menu — Add-Ons (added to a service, about 15 min each). $150 per track.
        'single-track' => ['150.00', 15, 'Single Tracks'],
        'new-look-haircut' => ['150.00', 15, 'New Look Cut'],
    ];

    /**
     * Menu items the site has no service for: [category slug, slug, name,
     * price (null = by consultation), minutes, image, description].
     */
    public const ADDITIONS = [
        // Color
        ['relaxers-and-colors', 'face-frame-highlights', 'Face-Frame Highlights', '150.00', 90, '/images/relaxers-colors-06.webp', 'Finish required — add a style from Natural Hair Styling.'],
        ['relaxers-and-colors', 'virgin-color', 'Virgin Color', '220.00', 90, '/images/relaxers-card-img.jpg', 'Finish required — add a style from Natural Hair Styling.'],

        // Natural Hair Styling
        ['silk-press', 'silk-press-plus', 'Silk Press Plus', '200.00', 60, '/images/SilkPress-01.webp', 'Silk press + spa treatment.'],
        ['silk-press', 'the-glorious-silk-press', 'The Glorious Silk Press', '275.00', 60, '/images/GLORIOUS-PACKAGES-02.webp', 'Silk press + trim + treatment.'],
        ['silk-press', 'roller-set', 'Roller Set', '155.00', 60, '/images/RodSet-01.webp', null],
        ['silk-press', 'trim-only', 'Trim Only', '100.00', 30, '/images/trim-after.webp', 'Includes wash.'],

        // Weaves
        ['weaves', 'the-glorious-sew-in', 'The Glorious Sew-In', '785.00', 135, '/images/Weaves-And-Extensions-02.webp', 'Sew-in + trim + treatment.'],
        ['weaves', 'the-glorious-closure-or-full-weave', 'The Glorious Closure or Full Weave', '885.00', 165, '/images/Weaves-And-Extensions-03.webp', 'Closure or full weave + trim + treatment.'],
        ['weaves', 'weave-wash', 'Weave Wash', '160.00', 45, '/images/Weaves-And-Extensions-05-06-07.webp', null],

        // Wig Services
        ['wigs', 'wig-breakdown', 'Wig Breakdown', '125.00', 90, '/images/Weaves-And-Extensions-08.webp', null],
        ['wigs', 'wig-breakdown-treatment', 'Wig Breakdown + Treatment', '175.00', 90, '/images/Weaves-And-Extensions-08.webp', null],
        ['wigs', 'classic-wig-maintenance', 'Classic Wig Maintenance', '300.00', 90, '/images/Weaves-And-Extensions-05-06-07.webp', 'Wig + natural hair care.'],
        ['wigs', 'wig-maintenance-plus', 'Wig Maintenance Plus', '355.00', 90, '/images/Weaves-And-Extensions-05-06-07.webp', 'Wig + natural hair care + treatment.'],
        ['wigs', 'the-glorious-wig-maintenance', 'The Glorious Wig Maintenance', '430.00', 90, '/images/Weaves-And-Extensions-05-06-07.webp', 'Wig + natural hair care + trim + treatment.'],
        ['wigs', 'the-glorious-custom-unit', 'The Glorious Custom Unit', null, 60, '/images/Weaves-And-Extensions-04.webp', 'Custom unit + trim + treatment. Priced at your consultation.'],

        // Add-Ons — about 15 min, added to a service
        ['haircuts-and-styles', 'trim', 'Trim', '80.00', 15, '/images/trim-after.webp', 'Add-on — added to a service.'],
        ['treatments', 'the-glory-package', 'The Glory Package', '130.00', 15, '/images/GLORIOUS-PACKAGES-03.webp', 'Add-on: trim + treatment — built into every Glorious service.'],
    ];

    public function run(PricingService $pricing): void
    {
        DB::transaction(function () use ($pricing) {
            foreach (self::UPDATES as $slug => [$price, $minutes, $name]) {
                $service = Service::query()->where('slug', $slug)->first();
                if (! $service) {
                    continue; // Not in this catalog (e.g. removed in the dashboard).
                }

                $service->update([
                    // Renamed in place (same row, same slug) — never a second copy.
                    'name' => $name ?? $service->name,
                    'duration_minutes' => $minutes,
                    'price_by_consultation' => $price === null,
                ]);
                $pricing->setPrice($service, $price ?? '0.00');
            }

            $categories = ServiceCategory::query()->pluck('id', 'slug');
            $added = [];

            foreach (self::ADDITIONS as [$category, $slug, $name, $price, $minutes, $image, $description]) {
                // By slug, then by name — so neither a re-run nor an earlier
                // hand-made copy of the service ever leads to a second one.
                $service = Service::query()->where('slug', $slug)->first()
                    ?? Service::query()->where(DB::raw('LOWER(name)'), mb_strtolower($name))->orderBy('id')->first();

                $attributes = [
                    'slug' => $slug,
                    'name' => $name,
                    'category_id' => $categories[$category] ?? null,
                    'duration_minutes' => $minutes,
                    'price_by_consultation' => $price === null,
                    'is_active' => true,
                ];

                if ($service) {
                    $service->update($attributes);
                } else {
                    $service = Service::query()->create([
                        ...$attributes,
                        'image' => $image,
                        'description' => $description,
                        'sort_order' => $this->nextPosition($categories[$category] ?? null),
                    ]);
                    $added[] = $service->id;
                }

                $pricing->setPrice($service, $price ?? '0.00');
            }

            // New services need someone to book them with.
            if ($added !== []) {
                WorkerProfile::query()->each(fn (WorkerProfile $p) => $p->services()->syncWithoutDetaching($added));
            }

            Setting::set(self::SETTING_KEY, self::MENU_VERSION);
        });
    }

    /** After the category's existing services, so site services keep their order. */
    private function nextPosition(?int $categoryId): int
    {
        return (int) Service::query()->where('category_id', $categoryId)->max('sort_order') + 1;
    }
}
