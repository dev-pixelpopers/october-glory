<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\Setting;
use App\Services\PricingService;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

/**
 * The three silk presses (Classic, Classic+, Glorious) as packages on the
 * Silk Press page, instead of services in its menu.
 *
 *   php artisan db:seed --class=SilkPressPackagesSeeder
 *
 * - The three services move out of the Silk Press category into their own,
 *   so the page's "Styles we do between presses" menu no longer lists them
 *   beside the cards. They stay active: booking only books services, and each
 *   package is built on its service for duration and staff.
 * - Each package matches its service's menu price at the time of writing.
 * - Idempotent: categories and packages are matched by slug, and prices go
 *   through the append-only ledger, so an unchanged price writes nothing.
 *
 * DatabaseSeeder runs it once per VERSION; run it with --class to re-apply.
 */
class SilkPressPackagesSeeder extends Seeder
{
    public const SETTING_KEY = 'catalog.silk_press_packages_version';

    /** Bump when the data below changes, so DatabaseSeeder applies it again. */
    public const VERSION = '2026-10-30.1';

    /** Where the three services go: bookable, but off the Silk Press page menu. */
    public const SERVICE_CATEGORY = ['silk-press-options', 'Silk Press Options', 'services', '/images/silk-press-card-img.jpg'];

    /** The packages' page — the Silk Press category, shown at /services/silk-press. */
    public const PAGE_CATEGORY = 'silk-press';

    public const COLLECTION = 'silk-press';

    /** In the order the page shows them. `service` is the bookable service each is built on. */
    public const PACKAGES = [
        [
            'slug' => 'the-classic-silk-press',
            'name' => 'The Classic Silk Press',
            'tagline' => 'Silk press only',
            'is_featured' => false,
            'price' => '155.00',
            'image' => '/images/silk-press-card-img.jpg',
            'includes' => ['Signature silk press'],
            'not_included' => 'The Classic Silk Press does not include a scalp and hair assessment, targeted spa treatment, steam therapy, or a precision trim. If your hair would benefit from additional moisture, repair, or maintenance, one of our upgraded silk press experiences may be a better fit.',
            'best_for' => "Clients with healthy, well-maintained hair who want a polished, low-maintenance silk press that's smooth, lightweight, and beautifully finished.",
            'service' => 'silk-press',
        ],
        [
            'slug' => 'the-classic-silk-press-plus',
            'name' => 'The Classic Silk Press+',
            'tagline' => 'Silk press + spa treatment',
            'is_featured' => false,
            'price' => '200.00',
            'image' => '/images/SilkPress-01.webp',
            'includes' => ['Signature silk press', 'Spa treatment'],
            'not_included' => 'This service does not include a precision trim. While your hair will feel healthier, softer, and more manageable, damaged or split ends will remain. If your ends need attention, we recommend upgrading to The Glorious Silk Press.',
            'best_for' => 'Clients with dry, dull, over-processed, or moisture-deprived hair who want to improve the overall health of their hair and scalp while enjoying a smooth, polished silk press.',
            'service' => 'silk-press-plus',
        ],
        [
            'slug' => 'the-glorious-silk-press-package',
            'name' => 'The Glorious Silk Press',
            'tagline' => 'Silk press + spa treatment + trim',
            'is_featured' => true,
            'price' => '275.00',
            'image' => '/images/GLORIOUS-PACKAGES-02.webp',
            'includes' => ['Signature silk press', 'Spa treatment', 'Trim'],
            'not_included' => null,
            'best_for' => 'Clients whose hair is due for a trim, those experiencing split or damaged ends, or anyone looking for a complete healthy hair reset with treatment, maintenance, and a flawless silk press, all in a single appointment.',
            'service' => 'the-glorious-silk-press',
        ],
    ];

    public function run(PricingService $pricing): void
    {
        DB::transaction(function () use ($pricing) {
            [$slug, $name, $kind, $image] = self::SERVICE_CATEGORY;
            $serviceCategory = ServiceCategory::query()->firstOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'kind' => $kind,
                    'image' => $image,
                    'sort_order' => (int) ServiceCategory::query()->max('sort_order') + 1,
                ],
            );

            $pageCategoryId = ServiceCategory::query()->where('slug', self::PAGE_CATEGORY)->value('id');

            foreach (self::PACKAGES as $position => $data) {
                $service = Service::query()->where('slug', $data['service'])->first();

                $service?->update([
                    'category_id' => $serviceCategory->id,
                    'sort_order' => $position + 1,
                ]);

                $package = Package::query()->updateOrCreate(
                    ['slug' => $data['slug']],
                    [
                        'category_id' => $pageCategoryId,
                        'collection' => self::COLLECTION,
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

                $package->services()->sync($service ? [$service->id => ['position' => 0]] : []);

                $pricing->setPackagePrice($package, $data['price']);
            }

            Setting::set(self::SETTING_KEY, self::VERSION);
        });
    }
}
