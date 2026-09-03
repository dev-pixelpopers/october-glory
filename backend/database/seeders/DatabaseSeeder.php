<?php

namespace Database\Seeders;

use App\Models\Package;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\Setting;
use App\Models\User;
use App\Services\LoyaltyService;
use App\Services\PricingService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $pricing = app(PricingService::class);

        $admin = User::query()->create([
            'name' => 'Glory Admin',
            'email' => 'admin@octoberglory.com',
            'password' => 'password',
            'role' => User::ROLE_ADMIN,
        ]);

        Setting::set(LoyaltyService::KEY_CONVERSION_RATE, '0.10');
        Setting::set(LoyaltyService::KEY_POINTS_PER_BOOKING, '50');
        Setting::set(LoyaltyService::KEY_SHOUTOUT_BONUS, '100');

        /*
         * The real service catalog, mirrored from the public site's service data
         * (src/data/services/{parents,children}.ts). Prices are the salon's quoted
         * member prices; durations are representative — the site data omits them,
         * so the admin can fine-tune per service in the dashboard.
         *
         * Each item: [slug key, display name, duration minutes, price].
         */
        $catalog = [
            'Natural Styles' => [
                ['silk-press', 'Silk Press', 90, '100.00'],
                ['rodset', 'Rodset', 90, '120.00'],
                ['flat-twist', 'Flat Twist', 90, '125.00'],
                ['wash-and-go', 'Wash & Go', 45, '50.00'],
                ['braid-down', 'Braid Down', 60, '125.00'],
                ['2-strand-twist', '2 Strand Twist', 120, '125.00'],
                ['natural-updo', 'Natural Updo', 60, '75.00'],
            ],
            'Chemical Services' => [
                ['relaxer-touch-up', 'Relaxer Touch Up', 90, '100.00'],
                ['virgin-relaxer', 'Virgin Relaxer', 150, '225.00'],
                ['color-retouch', 'Color Retouch', 90, '125.00'],
                ['single-process', 'Single Process', 90, '120.00'],
                ['double-process', 'Double Process', 180, '350.00'],
                ['half-head-highlights', 'Half-Head Highlights', 120, '160.00'],
                ['full-highlights', 'Full Highlights Or Foilayage', 180, '300.00'],
                ['crown-lights', 'Crown Lights', 90, '85.00'],
                ['color-correction', 'Color Correction', 240, '250.00'],
            ],
            'Wigs & Extensions' => [
                ['custom-wig-design', 'Custom Wig Design', 180, '250.00'],
                ['single-track', 'Single Track', 60, '60.00'],
                ['full-weave-leave-out', 'Full Weave w/ Leave Out', 210, '220.00'],
                ['full-head-weave', 'Full-Head Weave', 240, '250.00'],
                ['wig-unit-consult', 'Wig Unit Consult', 30, '50.00'],
                ['wig-prep', 'Wig Prep', 60, '120.00'],
                ['wig-wash', 'Wig Wash', 45, '60.00'],
                ['wig-tighten', 'Wig Tighten', 45, '70.00'],
                // Wig-maintenance building blocks (from the maintenance package pages).
                ['wig-wash-style', 'Wig Wash & Style', 45, '60.00'],
                ['natural-hair-wash', 'Natural Hair Wash', 30, '40.00'],
                ['wig-reinstall', 'Wig Reinstall', 45, '75.00'],
            ],
            'Haircuts & Styles' => [
                ['ponytail-and-updo', 'Ponytail & Updo', 60, '85.00'],
                ['glory-girl-precision-cut', 'Glory-Girl Precision Cut', 75, '150.00'],
                ['weave-precision-cut', 'Weave Precision Cut', 60, '100.00'],
                ['haircut-only', 'Haircut Only', 45, '75.00'],
                ['haircut-and-finish', 'Haircut & Finish', 75, '125.00'],
                ['new-look-haircut', 'New Look Haircut', 75, '120.00'],
                ['pro-consult', 'Pro Consult', 30, '50.00'],
                ['precision-trim', 'Precision Trim', 20, '35.00'],
            ],
            'Treatments' => [
                ['scalp-relief', 'Scalp Relief', 45, '50.00'],
                ['upmost-hydration', 'The Upmost Hydration', 45, '50.00'],
                ['protein-moisture-pack', 'Protein Moisture Pack', 45, '55.00'],
                ['bond-builder', 'Bond Builder', 45, '65.00'],
                ['spa-treatment', 'Spa Treatment', 45, '65.00'],
            ],
        ];

        // Keyed by slug so packages can reference the exact services they bundle.
        $svc = collect();
        foreach ($catalog as $categoryName => $items) {
            $category = ServiceCategory::query()->create([
                'name' => $categoryName,
                'slug' => Str::slug($categoryName),
            ]);

            foreach ($items as [$key, $name, $duration, $price]) {
                $service = Service::query()->create([
                    'category_id' => $category->id,
                    'name' => $name,
                    'description' => "Signature {$categoryName} experience by October Glory.",
                    'duration_minutes' => $duration,
                ]);
                $pricing->setPrice($service, $price, $admin);
                $svc->put($key, $service);
            }
        }

        $this->seedPackages($svc, $pricing, $admin);

        $services = $svc->values();

        // Dynamic workers — the system supports any number the admin creates.
        $workers = [
            ['Jhavuanna Reid', 'jhavuanna@octoberglory.com', 'Master stylist & extensions artist with 12 years of experience.', ['Weaves', 'Wigs', 'Silk Press']],
            ['Maya Thompson', 'maya@octoberglory.com', 'Color specialist focused on healthy transformations.', ['Color', 'Relaxers', 'Treatments']],
            ['Simone Carter', 'simone@octoberglory.com', 'Natural hair expert; protective styling is her signature.', ['Braids', 'Twists', 'Natural Styles']],
        ];

        foreach ($workers as $i => [$name, $email, $bio, $specialties]) {
            $user = User::query()->create([
                'name' => $name,
                'email' => $email,
                'password' => 'password',
                'role' => User::ROLE_WORKER,
            ]);

            $profile = $user->workerProfile()->create([
                'bio' => $bio,
                'specialties' => $specialties,
            ]);

            // Tue–Sat 9:00–19:00 (Sun/Mon off), staggered so coverage varies.
            foreach (range(0, 6) as $day) {
                $isOff = in_array($day, [0, 1], true);
                $profile->schedules()->create([
                    'day_of_week' => $day,
                    'start_time' => $isOff ? '00:00:00' : ($i === 1 ? '10:00:00' : '09:00:00'),
                    'end_time' => $isOff ? '00:00:00' : '19:00:00',
                    'is_day_off' => $isOff,
                ]);
            }

            // Every worker covers most of the catalog; vary it slightly.
            $profile->services()->sync(
                $services->skip($i % 2)->pluck('id')->all(),
            );
        }

        User::query()->create([
            'name' => 'Test Client',
            'email' => 'client@example.com',
            'password' => 'password',
            'role' => User::ROLE_CLIENT,
        ]);
    }

    /**
     * Packages bundle several services. The displayed total is the sum of the
     * bundled services, but the salon sets one adjustable price per package —
     * seeded here through the append-only package price ledger.
     *
     * @param  \Illuminate\Support\Collection<string, Service>  $svc
     */
    private function seedPackages($svc, PricingService $pricing, User $admin): void
    {
        $packages = [
            [
                'collection' => 'maintenance',
                'name' => 'The Glorious Wig Package',
                'tagline' => 'Complete Care for Your Wig & Natural Hair',
                'is_featured' => true,
                'price' => '200.00',
                'includes' => [
                    "A professional wig wash and restyle to restore your unit's original beauty, softness, and shape",
                    'A thorough cleanse of your natural hair and scalp',
                    "A personalized spa treatment based on your hair's needs, including moisture, protein, or scalp therapy to promote healthier hair",
                    'A precision trim to remove split or damaged ends',
                    'Professional braiding to create a secure, comfortable foundation',
                    'A complete wig reinstall using your freshly cleaned and styled custom unit',
                ],
                'best_for' => 'Clients who want the highest level of maintenance at every visit, including regular treatments and trims, to keep both their custom wig and natural hair in excellent condition for long-term wear.',
                'services' => ['wig-wash-style', 'natural-hair-wash', 'spa-treatment', 'precision-trim', 'braid-down', 'wig-reinstall'],
            ],
            [
                'collection' => 'maintenance',
                'name' => 'The Signature Wig Package',
                'tagline' => 'Routine Care to Keep Your Wig Looking Its Best',
                'price' => '150.00',
                'includes' => [
                    "A professional wig wash and restyle to restore your unit's shape, softness, and natural appearance",
                    'A thorough cleanse of your natural hair and scalp',
                    'A personalized spa treatment based on a complete scalp and hair assessment, using moisture, protein, or scalp care treatments as needed',
                    'Professional braiding to prepare your natural hair for reinstallation',
                    'Reinstalling your freshly cleaned and styled wig',
                ],
                'not_included' => 'A precision trim is not included with this package. Since trims are typically recommended every three months rather than at every monthly maintenance visit, this option is ideal for keeping your hair healthy between trim appointments.',
                'best_for' => 'Clients following a regular monthly maintenance routine who want professional care for both their custom wig and natural hair, without needing a trim at every visit.',
                'services' => ['wig-wash-style', 'natural-hair-wash', 'spa-treatment', 'braid-down', 'wig-reinstall'],
            ],
            [
                'collection' => 'maintenance',
                'name' => 'The Introductory Wig Package',
                'tagline' => 'Essential Maintenance for Everyday Wig Care',
                // NOTE: the marketing page shows "$2400" — an apparent typo next to
                // the $200 / $150 tiers. Seeded as $120 pending confirmation.
                'price' => '120.00',
                'includes' => [
                    'A professional wash and restyle of your wig',
                    'A thorough cleanse of your natural hair and scalp',
                    'Expert braiding to create a secure foundation for your reinstall',
                    'A professional wig reinstall using your freshly cleaned and styled unit',
                ],
                'not_included' => "This package does not include a customized spa treatment or precision trim. It's designed as a straightforward maintenance service for clients who don't require deeper treatments during every appointment.",
                'best_for' => 'Clients looking for reliable, routine wig maintenance at an accessible price point, or those who alternate this package with more comprehensive maintenance services throughout the year.',
                'services' => ['wig-wash-style', 'natural-hair-wash', 'braid-down', 'wig-reinstall'],
            ],
            [
                'collection' => 'glorious',
                'name' => 'Glorious Rodset',
                'tagline' => 'A luxury rodset, spa-treated end to end.',
                'price' => '230.00',
                'services' => ['rodset', 'spa-treatment'],
            ],
            [
                'collection' => 'glorious',
                'name' => 'Glorious Silk Press',
                'tagline' => 'Silk press with the full spa treatment and a trim.',
                'price' => '245.00',
                'services' => ['silk-press', 'spa-treatment', 'precision-trim'],
            ],
            [
                'collection' => 'glorious',
                'name' => 'Glorious Boost',
                'tagline' => 'A restorative treatment duo for stressed strands.',
                'price' => '120.00',
                'services' => ['protein-moisture-pack', 'bond-builder'],
            ],
            [
                'collection' => 'glorious',
                'name' => 'Wig Prep',
                'tagline' => 'Braid-down and prep, ready for your unit.',
                'price' => '120.00',
                'services' => ['natural-hair-wash', 'braid-down'],
            ],
        ];

        foreach ($packages as $data) {
            $serviceKeys = $data['services'];
            $price = $data['price'];
            unset($data['services'], $data['price']);

            $package = Package::query()->create([
                ...$data,
                'slug' => Str::slug($data['name']),
                'description' => $data['tagline'] ?? null,
            ]);

            $pivot = [];
            foreach (array_values($serviceKeys) as $position => $key) {
                if ($svc->has($key)) {
                    $pivot[$svc->get($key)->id] = ['position' => $position];
                }
            }
            $package->services()->sync($pivot);

            $pricing->setPackagePrice($package, $price, $admin);
        }
    }
}
