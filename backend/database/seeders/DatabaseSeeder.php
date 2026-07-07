<?php

namespace Database\Seeders;

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

        // Categories mirror the public site's service pages.
        $catalog = [
            'Natural Styles' => [
                ['Two-Strand Twists', 120, '95.00'],
                ['Protective Braids', 180, '150.00'],
            ],
            'Relaxers And Colors' => [
                ['Full Relaxer & Style', 150, '130.00'],
                ['Single-Process Color', 120, '110.00'],
            ],
            'Weaves And Extensions' => [
                ['Full Sew-In Weave', 240, '250.00'],
                ['Wig Install & Styling', 120, '140.00'],
            ],
            'Haircuts And Styles' => [
                ['Precision Cut & Finish', 60, '75.00'],
                ['Silk Press', 120, '95.00'],
            ],
            'Treatments' => [
                ['Deep Conditioning Spa', 45, '55.00'],
                ['Scalp Revival Treatment', 60, '65.00'],
            ],
        ];

        $services = collect();
        foreach ($catalog as $categoryName => $items) {
            $category = ServiceCategory::query()->create([
                'name' => $categoryName,
                'slug' => Str::slug($categoryName),
            ]);

            foreach ($items as [$name, $duration, $price]) {
                $service = Service::query()->create([
                    'category_id' => $category->id,
                    'name' => $name,
                    'description' => "Signature {$categoryName} experience by October Glory.",
                    'duration_minutes' => $duration,
                ]);
                $pricing->setPrice($service, $price, $admin);
                $services->push($service);
            }
        }

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
}
