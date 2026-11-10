<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Package;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class PackageBookingTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed(DatabaseSeeder::class);
    }

    protected function nextTuesdayAt(string $time): string
    {
        return now()->next('Tuesday')->format('Y-m-d')." {$time}";
    }

    public function test_availability_works_with_package_id(): void
    {
        $package = Package::query()->where('is_active', true)->first();

        $response = $this->getJson('/api/availability?'.http_build_query([
            'date' => now()->next('Tuesday')->format('Y-m-d'),
            'package_id' => $package->id,
        ]));

        $response->assertOk();
        $this->assertNotEmpty($response->json('data'));
        $this->assertArrayHasKey('worker_id', $response->json('data.0'));
    }

    public function test_qualified_workers_works_with_package_id(): void
    {
        $package = Package::query()->where('is_active', true)->first();

        $response = $this->getJson('/api/workers?'.http_build_query([
            'package_id' => $package->id,
        ]));

        $response->assertOk();
        $this->assertNotEmpty($response->json('data'));
    }

    public function test_package_booking_creates_appointment_with_package_price_and_services(): void
    {
        $client = User::query()->where('email', 'client@example.com')->first();
        $package = Package::query()->with(['currentPrice', 'services'])->where('is_active', true)->first();

        $response = $this->actingAs($client)->postJson('/api/appointments', [
            'package_id' => $package->id,
            'worker_id' => null,
            'start_time' => $this->nextTuesdayAt('11:00:00'),
            'payment_method' => 'pay_upon_arrival',
            'loyalty_points_used' => 0,
        ]);

        $response->assertCreated();
        $this->assertEquals($package->id, $response->json('package_id') ?? $response->json('data.package_id'));

        $appointment = Appointment::query()->where('package_id', $package->id)->first();
        $this->assertNotNull($appointment);
        $this->assertEquals($package->id, $appointment->package_id);
        $this->assertEquals((float) $package->currentPrice->price, (float) $appointment->subtotal_amount);
        $this->assertCount($package->services->count(), $appointment->lineItems);

        // Check notification mentions the package
        $this->assertDatabaseHas('notifications', [
            'user_id' => $client->id,
            'type' => 'appointment.booked',
        ]);
    }
}
