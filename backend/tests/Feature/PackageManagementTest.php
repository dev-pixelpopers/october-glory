<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\Service;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PackageManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    protected function admin(): User
    {
        return User::query()->where('email', 'admin@octoberglory.com')->first();
    }

    public function test_public_packages_endpoint_returns_active_packages_with_derived_fields(): void
    {
        $response = $this->getJson('/api/packages?collection=maintenance');

        $response->assertOk();
        $this->assertNotEmpty($response->json('data'));

        $first = $response->json('data.0');
        $this->assertArrayHasKey('services', $first);
        $this->assertArrayHasKey('duration_minutes', $first);
        $this->assertArrayHasKey('services_total', $first);
        $this->assertArrayHasKey('price', $first);
    }

    public function test_admin_can_create_package_and_duration_is_summed_from_services(): void
    {
        $services = Service::query()->take(3)->get();

        $response = $this->actingAs($this->admin())->postJson('/api/admin/packages', [
            'name' => 'Test Combo',
            'collection' => 'glorious',
            'includes' => ['Everything in the combo'],
            'service_ids' => $services->pluck('id')->all(),
            // No price → defaults to the summed service total.
        ]);

        $response->assertCreated();

        $package = Package::query()->where('name', 'Test Combo')->with('services')->first();
        $this->assertSame($services->sum('duration_minutes'), $package->duration_minutes);
        $this->assertCount(3, $package->services);

        // Omitted price stored the summed services total.
        $expected = $services->sum(fn (Service $s) => (float) $s->currentPrice->price);
        $this->assertSame(number_format($expected, 2, '.', ''), (string) $package->currentPrice->price);
    }

    public function test_changing_package_price_opens_a_new_ledger_row(): void
    {
        $services = Service::query()->take(2)->get();

        // Sanctum::actingAs sets a full-ability token for the whole test, so the
        // role-gated middleware is satisfied across the multiple requests below.
        Sanctum::actingAs($this->admin(), ['*']);

        $create = $this->postJson('/api/admin/packages', [
            'name' => 'Ledger Combo',
            'service_ids' => $services->pluck('id')->all(),
            'price' => 199,
        ])->assertCreated();

        $id = $create->json('data.id');

        $this->putJson("/api/admin/packages/{$id}", [
            'price' => 249,
        ])->assertOk()->assertJsonPath('data.price', '249.00');

        $history = $this->getJson("/api/admin/packages/{$id}/price-history")
            ->assertOk()
            ->json('data');

        // Two rows: the closed 199.00 and the active 249.00.
        $this->assertCount(2, $history);
        $active = collect($history)->firstWhere('effective_until', null);
        $this->assertSame('249.00', $active['price']);
    }

    public function test_destroy_deactivates_rather_than_deletes(): void
    {
        $package = Package::query()->first();

        $this->actingAs($this->admin())
            ->deleteJson("/api/admin/packages/{$package->id}")
            ->assertOk();

        $this->assertDatabaseHas('packages', ['id' => $package->id, 'is_active' => false]);
    }

    public function test_non_admin_cannot_create_packages(): void
    {
        $client = User::query()->where('email', 'client@example.com')->first();

        $this->actingAs($client)->postJson('/api/admin/packages', [
            'name' => 'Nope',
            'service_ids' => [Service::query()->first()->id],
        ])->assertForbidden();
    }
}
