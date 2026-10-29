<?php

namespace Database\Seeders;

use App\Models\Membership;
use App\Models\Service;
use App\Models\Setting;
use App\Models\User;
use App\Services\LoyaltyService;
use App\Services\MembershipService;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

/**
 * Accounts, settings and demo staff. Safe to re-run: it only adds what is
 * missing and never undoes changes made in the dashboard.
 *
 * The catalog (categories, services, packages) is not seeded here — the
 * migrations build it from the website (see SiteCatalog), so `migrate` alone
 * gives every environment the same catalog. MenuPricesSeeder then applies the
 * printed menu's prices and durations on top.
 */
class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        // firstOrCreate: the admin may already exist (e.g. created by hand
        // before the first seed), and its password is left untouched.
        User::query()->firstOrCreate(
            ['email' => 'admin@octoberglory.com'],
            [
                'name' => 'Glory Admin',
                'password' => 'password',
                'role' => User::ROLE_ADMIN,
            ],
        );

        // Defaults only — a re-seed keeps whatever the admin has since set.
        foreach ([
            LoyaltyService::KEY_CONVERSION_RATE => '0.10',
            LoyaltyService::KEY_POINTS_PER_BOOKING => '50',
            LoyaltyService::KEY_SHOUTOUT_BONUS => '100',
            MembershipService::KEY_DISCOUNT_RATE => MembershipService::DEFAULT_DISCOUNT_RATE,
        ] as $key => $value) {
            Setting::query()->firstOrCreate(['key' => $key], ['value' => $value]);
        }

        // The plan admins assign when marking a client as a member. Price is a
        // placeholder until the salon sets one.
        Membership::query()->firstOrCreate(
            ['name' => 'Glory Membership'],
            [
                'price' => 0,
                'billing_cycle' => 'monthly',
                'benefits' => ['30% off every service', 'Priority booking', 'Loyalty points on everything'],
                'is_active' => true,
            ],
        );

        // The catalog the migrations built, in the site's order.
        $services = Service::query()->where('is_active', true)->orderBy('sort_order')->orderBy('id')->get();

        // Dynamic workers — the system supports any number the admin creates.
        $workers = [
            ['Jhavuanna Reid', 'jhavuanna@octoberglory.com', 'Master stylist & extensions artist with 12 years of experience.', ['Weaves', 'Wigs', 'Silk Press']],
            ['Maya Thompson', 'maya@octoberglory.com', 'Color specialist focused on healthy transformations.', ['Color', 'Relaxers', 'Treatments']],
            ['Simone Carter', 'simone@octoberglory.com', 'Natural hair expert; protective styling is her signature.', ['Braids', 'Twists', 'Natural Styles']],
        ];

        foreach ($workers as $i => [$name, $email, $bio, $specialties]) {
            // Existing workers (from an earlier seed, or edited in the
            // dashboard) are left exactly as they are.
            $user = User::query()->firstOrCreate(
                ['email' => $email],
                [
                    'name' => $name,
                    'password' => 'password',
                    'role' => User::ROLE_WORKER,
                ],
            );
            if (! $user->wasRecentlyCreated) {
                continue;
            }

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

        User::query()->firstOrCreate(
            ['email' => 'client@example.com'],
            [
                'name' => 'Test Client',
                'password' => 'password',
                'role' => User::ROLE_CLIENT,
            ],
        );

        // Menu prices and durations, once per menu version — a plain re-seed
        // must not undo prices changed in the dashboard since.
        if (Setting::get(MenuPricesSeeder::SETTING_KEY) !== MenuPricesSeeder::MENU_VERSION) {
            $this->call(MenuPricesSeeder::class);
        }
    }
}
