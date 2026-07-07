<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class BookingFlowTest extends TestCase
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

    public function test_availability_endpoint_returns_slots_for_multi_service_selection(): void
    {
        $services = Service::query()->take(2)->get();

        $response = $this->getJson('/api/availability?'.http_build_query([
            'date' => now()->next('Tuesday')->format('Y-m-d'),
            'service_ids' => $services->pluck('id')->all(),
        ]));

        $response->assertOk();
        $this->assertNotEmpty($response->json('data'));
        $this->assertArrayHasKey('worker_id', $response->json('data.0'));
    }

    public function test_booking_creates_appointment_with_price_snapshots_and_loyalty_reward(): void
    {
        $client = User::query()->where('email', 'client@example.com')->first();
        $services = Service::query()->take(2)->get();

        $response = $this->actingAs($client)->postJson('/api/appointments', [
            'service_ids' => $services->pluck('id')->all(),
            'worker_id' => null,
            'start_time' => $this->nextTuesdayAt('11:00:00'),
            'payment_method' => 'pay_upon_arrival',
            'loyalty_points_used' => 0,
        ]);

        $response->assertCreated();

        $appointment = Appointment::query()->first();
        $this->assertSame($services->sum('duration_minutes'), $appointment->total_duration_minutes);
        $this->assertCount(2, $appointment->lineItems);
        $this->assertStringStartsWith('SLN-', $appointment->booking_reference);

        // Booking reward credited to the ledger (50 points seeded).
        $this->assertSame(50, $client->fresh()->loyaltyBalance());

        // Audit trail captured the insert.
        $this->assertDatabaseHas('audit_logs', [
            'log_name' => 'appointment',
            'subject_id' => $appointment->id,
        ]);
    }

    public function test_worker_cannot_be_double_booked(): void
    {
        $client = User::query()->where('email', 'client@example.com')->first();
        $service = Service::query()->first();
        $worker = User::query()->where('email', 'jhavuanna@octoberglory.com')->first();

        $payload = [
            'service_ids' => [$service->id],
            'worker_id' => $worker->id,
            'start_time' => $this->nextTuesdayAt('11:00:00'),
            'payment_method' => 'card',
        ];

        $this->actingAs($client)->postJson('/api/appointments', $payload)->assertCreated();
        $this->actingAs($client)->postJson('/api/appointments', $payload)->assertStatus(409);
    }

    public function test_loyalty_redemption_discounts_total_and_debits_ledger(): void
    {
        $client = User::query()->where('email', 'client@example.com')->first();
        $service = Service::query()->first();

        // Give the client a redeemable balance.
        $client->loyaltyTransactions()->create([
            'amount' => 200,
            'type' => 'admin_adjustment',
            'description' => 'Seed balance',
        ]);

        $response = $this->actingAs($client)->postJson('/api/appointments', [
            'service_ids' => [$service->id],
            'worker_id' => null,
            'start_time' => $this->nextTuesdayAt('14:00:00'),
            'payment_method' => 'card',
            'loyalty_points_used' => 100, // × $0.10 = $10 off
        ]);

        $response->assertCreated();
        $this->assertSame('10.00', $response->json('data.discount_amount'));

        // 200 seeded − 100 redeemed + 50 booking reward.
        $this->assertSame(150, $client->fresh()->loyaltyBalance());
    }

    public function test_price_change_opens_new_history_row_and_closes_old(): void
    {
        $admin = User::query()->where('role', 'admin')->first();
        $service = Service::query()->first();

        $this->actingAs($admin)->putJson("/api/admin/services/{$service->id}", [
            'price' => '199.99',
        ])->assertOk();

        $history = $service->priceHistory()->get();
        $this->assertCount(2, $history);
        $this->assertSame('199.99', (string) $service->currentPrice()->first()->price);
        // Exactly one active row; the previous one was closed, never overwritten.
        $this->assertCount(1, $history->whereNull('effective_until'));
        $this->assertCount(1, $history->whereNotNull('effective_until'));
    }

    public function test_role_middleware_blocks_clients_from_admin_endpoints(): void
    {
        $client = User::query()->where('email', 'client@example.com')->first();

        $this->actingAs($client)->getJson('/api/admin/audit-logs')->assertForbidden();
    }
}
