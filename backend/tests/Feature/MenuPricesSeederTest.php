<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\Setting;
use App\Models\User;
use App\Services\PricingService;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\MenuPricesSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Tests\TestCase;

class MenuPricesSeederTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    private function price(string $slug): string
    {
        return (string) Service::query()->where('slug', $slug)->firstOrFail()->currentPrice()->first()->price;
    }

    public function test_site_services_take_the_menu_price_and_duration(): void
    {
        foreach (MenuPricesSeeder::UPDATES as $slug => [$price, $minutes]) {
            $service = Service::query()->where('slug', $slug)->firstOrFail();
            $this->assertSame($price ?? '0.00', $this->price($slug), $slug);
            $this->assertSame($minutes, $service->duration_minutes, $slug);
            $this->assertSame($price === null, $service->price_by_consultation, $slug);
        }

        // Spot checks against the printed menus.
        $this->assertSame('155.00', $this->price('silk-press'));        // Classic Silk Press
        $this->assertSame('200.00', $this->price('relaxer-touch-up'));  // Relaxer Retouch
        $this->assertSame('655.00', $this->price('full-weave-with-leave-out'));
        // Renamed in place to the menu's name; the slug (site page link) is kept.
        $this->assertSame('Relaxer Retouch', Service::query()->where('slug', 'relaxer-touch-up')->value('name'));
        $this->assertSame('Classic Custom Unit', Service::query()->where('slug', 'wig-design-and-consult')->value('name'));
        // The shared menu line names only one of its two services.
        $this->assertSame('2 Strand Twist', Service::query()->where('slug', '2-strand-twist')->value('name'));
    }

    public function test_every_menu_name_exists_exactly_once(): void
    {
        $menuNames = [
            ...array_filter(array_column(MenuPricesSeeder::UPDATES, 2)),
            ...array_column(MenuPricesSeeder::ADDITIONS, 2),
        ];

        foreach ($menuNames as $name) {
            $this->assertSame(1, Service::query()->whereRaw('LOWER(name) = ?', [mb_strtolower($name)])->count(), $name);
        }
    }

    public function test_menu_only_items_are_added_once_in_their_page_category(): void
    {
        foreach (MenuPricesSeeder::ADDITIONS as [$category, $slug, $name, $price, $minutes]) {
            $matches = Service::query()->whereRaw('LOWER(name) = ?', [mb_strtolower($name)])->get();
            $this->assertCount(1, $matches, "{$name} should exist exactly once");
            $this->assertSame($slug, $matches->first()->slug);
            $this->assertSame($category, $matches->first()->category->slug, $name);
            $this->assertSame($minutes, $matches->first()->duration_minutes, $name);
            $this->assertSame($price ?? '0.00', $this->price($slug), $name);
        }
    }

    public function test_no_service_name_appears_twice(): void
    {
        $duplicates = Service::query()
            ->select(DB::raw('LOWER(name) as n'), DB::raw('COUNT(*) as c'))
            ->groupBy('n')
            ->having('c', '>', 1)
            ->pluck('n')
            ->all();

        $this->assertSame([], $duplicates);
    }

    public function test_running_again_changes_nothing(): void
    {
        $services = Service::query()->count();
        $ledger = DB::table('service_price_history')->count();

        $this->seed(MenuPricesSeeder::class);
        $this->seed(MenuPricesSeeder::class);

        $this->assertSame($services, Service::query()->count());
        $this->assertSame($ledger, DB::table('service_price_history')->count());
    }

    public function test_an_existing_service_with_a_menu_name_is_reused_not_duplicated(): void
    {
        // A hand-made "Weave Wash" without the menu slug, e.g. created in the dashboard.
        $existing = Service::query()->where('slug', 'weave-wash')->firstOrFail();
        $existing->update(['slug' => null]);
        $count = Service::query()->count();

        $this->seed(MenuPricesSeeder::class);

        $this->assertSame($count, Service::query()->count());
        $this->assertSame('weave-wash', $existing->fresh()->slug);
    }

    public function test_main_seeder_applies_the_menu_once_and_keeps_later_dashboard_prices(): void
    {
        $this->assertSame(MenuPricesSeeder::MENU_VERSION, Setting::get(MenuPricesSeeder::SETTING_KEY));

        $service = Service::query()->where('slug', 'silk-press')->firstOrFail();
        app(PricingService::class)->setPrice($service, '165.00');

        $this->seed(DatabaseSeeder::class);

        $this->assertSame('165.00', $this->price('silk-press'));
    }

    public function test_new_menu_services_are_bookable_by_every_worker(): void
    {
        $worker = User::query()->where('email', 'jhavuanna@octoberglory.com')->firstOrFail();
        $slugs = $worker->workerProfile->services()->pluck('slug')->all();

        foreach (array_column(MenuPricesSeeder::ADDITIONS, 1) as $slug) {
            $this->assertContains($slug, $slugs);
        }
    }
}
