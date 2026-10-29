<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\Service;
use App\Models\Setting;
use App\Services\PricingService;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class SeederIdempotencyTest extends TestCase
{
    use RefreshDatabase;

    private const TABLES = [
        'users', 'worker_profiles', 'worker_schedules', 'worker_services',
        'service_categories', 'services', 'service_price_history',
        'packages', 'package_service', 'package_price_history', 'settings',
    ];

    private function counts(): array
    {
        return collect(self::TABLES)->mapWithKeys(fn ($t) => [$t => DB::table($t)->count()])->all();
    }

    public function test_seeding_twice_creates_no_duplicates(): void
    {
        $this->seed(DatabaseSeeder::class);
        $before = $this->counts();

        $this->seed(DatabaseSeeder::class);

        $this->assertSame($before, $this->counts());
    }

    public function test_reseeding_keeps_dashboard_changes(): void
    {
        $this->seed(DatabaseSeeder::class);

        $service = Service::query()->where('name', 'Rodset')->firstOrFail();
        app(PricingService::class)->setPrice($service, '999.00');
        $package = Package::query()->where('slug', 'wig-prep')->firstOrFail();
        app(PricingService::class)->setPackagePrice($package, '555.00');
        Setting::set('loyalty.conversion_rate', '0.25');

        $this->seed(DatabaseSeeder::class);

        $this->assertSame('999.00', (string) $service->currentPrice()->first()->price);
        $this->assertSame('555.00', (string) $package->currentPrice()->first()->price);
        $this->assertSame('0.25', Setting::query()->where('key', 'loyalty.conversion_rate')->value('value'));
    }
}
