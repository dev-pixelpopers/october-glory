<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ConsultationPricingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed(DatabaseSeeder::class);
    }

    protected function admin(): User
    {
        return User::query()->where('email', 'admin@octoberglory.com')->first();
    }

    public function test_services_the_site_shows_without_a_price_are_by_consultation(): void
    {
        $service = Service::query()->where('slug', 'wig-design-and-consult')->firstOrFail();
        $this->assertTrue($service->price_by_consultation);
        $this->assertSame('0.00', (string) $service->currentPrice()->first()->price);

        $listed = collect($this->getJson('/api/services?category=wigs')->json('data'))
            ->firstWhere('slug', 'wig-design-and-consult');
        $this->assertTrue($listed['price_by_consultation']);
    }

    public function test_booking_a_consultation_service_adds_nothing_to_the_total_and_flags_the_line(): void
    {
        $client = User::query()->where('email', 'client@example.com')->first();
        $unit = Service::query()->where('slug', 'wig-design-and-consult')->firstOrFail();

        $response = $this->actingAs($client)->postJson('/api/appointments', [
            'service_ids' => [$unit->id],
            'worker_id' => null,
            'start_time' => now()->next('Tuesday')->format('Y-m-d').' 11:00:00',
            'payment_method' => 'pay_upon_arrival',
        ])->assertCreated();

        $this->assertSame('0.00', $response->json('data.total_amount'));
        $this->assertTrue($response->json('data.services.0.price_by_consultation'));
    }

    public function test_admin_can_create_a_consultation_service_without_a_price(): void
    {
        Sanctum::actingAs($this->admin(), ['*']);

        $this->postJson('/api/admin/services', [
            'name' => 'Bespoke Color',
            'duration_minutes' => 60,
            'price_by_consultation' => true,
        ])
            ->assertCreated()
            ->assertJsonPath('data.price_by_consultation', true)
            ->assertJsonPath('data.current_price', '0.00');
    }

    public function test_fixed_price_service_still_requires_a_price(): void
    {
        Sanctum::actingAs($this->admin(), ['*']);

        $this->postJson('/api/admin/services', ['name' => 'No Price', 'duration_minutes' => 60])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['price']);
    }

    public function test_switching_a_service_to_consultation_zeroes_its_price_in_the_ledger(): void
    {
        Sanctum::actingAs($this->admin(), ['*']);
        $service = Service::query()->where('name', 'Wig Prep')->firstOrFail();

        $this->putJson("/api/admin/services/{$service->id}", ['price_by_consultation' => true])
            ->assertOk()
            ->assertJsonPath('data.current_price', '0.00');

        // The old fixed price was closed, not overwritten.
        $this->assertSame(1, $service->priceHistory()->whereNull('effective_until')->count());
        $this->assertSame(2, $service->priceHistory()->count());
    }
}
