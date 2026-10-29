<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Package;
use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\MenuPricesSeeder;
use Database\Seeders\SiteCatalog;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class SiteCatalogTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed(DatabaseSeeder::class);
    }

    private function runMigration(string $file): void
    {
        (include database_path("migrations/{$file}.php"))->up();
    }

    public function test_catalog_is_exactly_the_site_catalog_plus_menu_additions(): void
    {
        // Only the site's categories, services and packages remain, plus the
        // menu items the site has no service for (MenuPricesSeeder).
        $this->assertEqualsCanonicalizing(array_keys(SiteCatalog::CATEGORIES), ServiceCategory::query()->pluck('slug')->all());
        $this->assertEqualsCanonicalizing(
            [...array_column(SiteCatalog::SERVICES, 1), ...array_column(MenuPricesSeeder::ADDITIONS, 1)],
            Service::query()->pluck('slug')->all(),
        );
        $this->assertEqualsCanonicalizing(array_column(SiteCatalog::PACKAGES, 'slug'), Package::query()->pluck('slug')->all());
    }

    public function test_categories_are_named_after_their_pages_with_images(): void
    {
        $silk = ServiceCategory::query()->where('slug', 'silk-press')->firstOrFail();
        $this->assertSame('Silk Press', $silk->name);
        $this->assertSame('services', $silk->kind);
        $this->assertSame('/images/silk-press-card-img.jpg', $silk->image);

        $this->assertSame('Relaxers & Colors', ServiceCategory::query()->where('slug', 'relaxers-and-colors')->value('name'));
        $this->assertSame('packages', ServiceCategory::query()->where('slug', 'bridal-packages')->value('kind'));
        $this->assertSame([], ServiceCategory::query()->whereNull('image')->pluck('slug')->all());

        $this->getJson('/api/categories?kind=services')
            ->assertOk()
            ->assertJsonCount(7, 'data')
            ->assertJsonPath('data.0.slug', 'silk-press')
            ->assertJsonPath('data.0.image', '/images/silk-press-card-img.jpg');
    }

    public function test_every_service_has_its_site_page_and_the_menu_price_where_the_menu_has_one(): void
    {
        foreach (SiteCatalog::SERVICES as [$category, $slug, $name, $price, $minutes, $image]) {
            // The printed menu wins on name, price and duration; the site keeps page and image.
            [$price, $minutes, $menuName] = MenuPricesSeeder::UPDATES[$slug] ?? [$price, $minutes, null];

            $service = Service::query()->where('slug', $slug)->firstOrFail();
            $this->assertSame($menuName ?? $name, $service->name, $slug);
            $this->assertSame($category, $service->category->slug, $slug);
            $this->assertSame($image, $service->image, $slug);
            $this->assertSame($minutes, $service->duration_minutes, $slug);
            $this->assertSame($price ?? '0.00', (string) $service->currentPrice()->first()->price, $slug);
            $this->assertSame($price === null, $service->price_by_consultation, $slug);
        }
    }

    public function test_services_api_returns_one_pages_services_in_site_order(): void
    {
        $slugs = collect($this->getJson('/api/services?category=relaxers-and-colors')->assertOk()->json('data'))
            ->pluck('slug')->all();

        // Site services in page order, then the menu's additions to the page.
        $expected = [
            ...collect(SiteCatalog::SERVICES)->where(0, 'relaxers-and-colors')->pluck(1)->values()->all(),
            ...collect(MenuPricesSeeder::ADDITIONS)->where(0, 'relaxers-and-colors')->pluck(1)->values()->all(),
        ];
        $this->assertSame($expected, $slugs);

        $relaxer = $this->getJson('/api/services?category=relaxers-and-colors')->json('data.0');
        $this->assertSame('relaxer-touch-up', $relaxer['slug']);
        $this->assertSame('200.00', $relaxer['current_price']); // menu: Relaxer Retouch $200
    }

    public function test_packages_sit_in_their_pages_category_in_site_order(): void
    {
        $this->assertSame('glorious-packages', Package::query()->where('slug', 'glorious-rodset')->firstOrFail()->category->slug);
        $this->assertSame('bridal-packages', Package::query()->where('slug', 'full-day')->firstOrFail()->category->slug);

        $this->getJson('/api/packages?collection=maintenance')
            ->assertOk()
            ->assertJsonPath('data.0.slug', 'the-glorious-wig-package')
            ->assertJsonPath('data.1.slug', 'the-signature-wig-package')
            ->assertJsonPath('data.2.slug', 'the-introductory-wig-package')
            ->assertJsonPath('data.0.price', '200.00');
    }

    public function test_workers_are_qualified_for_the_new_catalog(): void
    {
        $worker = User::query()->where('email', 'jhavuanna@octoberglory.com')->firstOrFail();
        $this->assertSame(Service::query()->count(), $worker->workerProfile->services()->count());
    }

    public function test_rebuild_is_idempotent(): void
    {
        $before = [Service::query()->count(), Package::query()->count(), ServiceCategory::query()->count()];

        $this->runMigration('2026_10_29_000030_create_site_categories');
        $this->runMigration('2026_10_29_000040_create_site_services');
        $this->runMigration('2026_10_29_000050_create_site_packages');

        $after = [Service::query()->count(), Package::query()->count(), ServiceCategory::query()->count()];
        $this->assertSame($before, $after);
    }

    public function test_reset_keeps_booked_services_for_history(): void
    {
        $client = User::query()->where('email', 'client@example.com')->firstOrFail();
        $booked = Service::query()->where('slug', 'rodset')->firstOrFail();
        $this->actingAs($client)->postJson('/api/appointments', [
            'service_ids' => [$booked->id],
            'worker_id' => null,
            'start_time' => now()->next('Tuesday')->format('Y-m-d').' 11:00:00',
            'payment_method' => 'pay_upon_arrival',
        ])->assertCreated();

        $this->runMigration('2026_10_29_000020_reset_catalog');

        // The booked service survives, deactivated and detached; everything else is gone.
        $kept = Service::query()->find($booked->id);
        $this->assertNotNull($kept);
        $this->assertFalse($kept->is_active);
        $this->assertNull($kept->slug);
        $this->assertSame(1, Service::query()->count());
        $this->assertSame(0, Package::query()->count());
        $this->assertSame(0, ServiceCategory::query()->count());
        $this->assertSame(1, Appointment::query()->first()->lineItems()->count());

        // Rebuilding brings the full catalog back alongside the old booked row.
        $this->runMigration('2026_10_29_000030_create_site_categories');
        $this->runMigration('2026_10_29_000040_create_site_services');
        $this->assertSame(count(SiteCatalog::SERVICES), Service::query()->whereNotNull('slug')->count());
    }
}
