<?php

namespace Tests\Feature;

use App\Models\Appointment;
use App\Models\Service;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ServiceDeleteTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed(DatabaseSeeder::class);
    }

    private function admin(): User
    {
        return User::query()->where('role', User::ROLE_ADMIN)->firstOrFail();
    }

    public function test_a_service_never_booked_is_deleted_outright(): void
    {
        $service = Service::query()->whereHas('packages')->firstOrFail();

        Sanctum::actingAs($this->admin(), ['*']);
        $this
            ->deleteJson("/api/admin/services/{$service->id}")
            ->assertOk()
            ->assertJsonPath('data.archived', false);

        $this->assertDatabaseMissing('services', ['id' => $service->id]);
        $this->assertDatabaseMissing('package_service', ['service_id' => $service->id]);
        $this->assertDatabaseMissing('service_price_history', ['service_id' => $service->id]);
    }

    public function test_a_booked_service_is_archived_and_hidden_but_history_keeps_it(): void
    {
        $client = User::query()->where('email', 'client@example.com')->firstOrFail();
        $service = Service::query()->where('is_active', true)->firstOrFail();

        Sanctum::actingAs($client, ['*']);
        $this->postJson('/api/appointments', [
            'service_ids' => [$service->id],
            'worker_id' => null,
            'start_time' => now()->next('Tuesday')->format('Y-m-d').' 11:00:00',
            'payment_method' => 'pay_upon_arrival',
            'loyalty_points_used' => 0,
        ])->assertCreated();

        Sanctum::actingAs($this->admin(), ['*']);
        $this
            ->deleteJson("/api/admin/services/{$service->id}")
            ->assertOk()
            ->assertJsonPath('data.archived', true);

        $service->refresh();
        $this->assertNotNull($service->archived_at);
        $this->assertFalse($service->is_active);
        $this->assertNull($service->slug);
        $this->assertNull($service->category_id);
        $this->assertSame(0, $service->workers()->count());
        $this->assertSame(0, $service->packages()->count());

        // The appointment still points at it.
        $this->assertSame($service->id, Appointment::query()->firstOrFail()->lineItems()->value('service_id'));

        // Gone from the dashboard's list too, which otherwise shows inactive services.
        $this->assertNotContains($service->id, array_column($this->getJson('/api/services')->json('data'), 'id'));
    }

    public function test_only_admins_can_delete_services(): void
    {
        $client = User::query()->where('email', 'client@example.com')->firstOrFail();
        $service = Service::query()->firstOrFail();

        Sanctum::actingAs($client, ['*']);
        $this->deleteJson("/api/admin/services/{$service->id}")->assertForbidden();
        $this->assertDatabaseHas('services', ['id' => $service->id]);
    }
}
