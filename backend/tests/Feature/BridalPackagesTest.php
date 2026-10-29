<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class BridalPackagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    private function actAsAdmin(): void
    {
        Sanctum::actingAs(User::query()->where('role', 'admin')->first(), ['*']);
    }

    public function test_bridal_page_packages_are_seeded_with_prices_and_images(): void
    {
        $response = $this->getJson('/api/packages?collection=bridal')->assertOk()->assertJsonCount(4, 'data');

        $byName = collect($response->json('data'))->keyBy('name');
        $this->assertSame('200.00', $byName["Bride Trial Appointment"]['price']);
        $this->assertSame('150.00', $byName["Bridesmaid's Trial Appointment"]['price']);
        $this->assertSame('2400.00', $byName['Full Day']['price']);
        $this->assertSame('1200.00', $byName['Half Day']['price']);

        foreach ($byName as $package) {
            $this->assertNotNull($package['image']);
            $this->assertSame([], $package['services']);
        }
    }

    public function test_package_without_services_needs_a_price(): void
    {
        $this->actAsAdmin();

        $this->postJson('/api/admin/packages', ['name' => 'Engagement Shoot', 'service_ids' => []])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['price']);

        $this->postJson('/api/admin/packages', [
            'name' => 'Engagement Shoot',
            'collection' => 'bridal',
            'service_ids' => [],
            'price' => '500',
        ])->assertCreated()->assertJsonPath('data.price', '500.00');
    }

    public function test_editing_a_bridal_package_keeps_its_price_with_no_services(): void
    {
        $this->actAsAdmin();
        $fullDay = Package::query()->where('slug', 'full-day')->firstOrFail();

        $this->putJson("/api/admin/packages/{$fullDay->id}", [
            'tagline' => 'Updated',
            'service_ids' => [],
            'price' => null,
        ])->assertOk()->assertJsonPath('data.price', '2400.00');
    }
}
