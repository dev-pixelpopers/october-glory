<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class WorkerManagementTest extends TestCase
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

    public function test_admin_can_delete_a_worker_without_history(): void
    {
        $worker = User::query()->where('email', 'maya@octoberglory.com')->first();
        $profileId = $worker->workerProfile->id;

        Sanctum::actingAs($this->admin(), ['*']);

        $this->deleteJson("/api/admin/workers/{$worker->id}")->assertNoContent();

        $this->assertDatabaseMissing('users', ['id' => $worker->id]);
        $this->assertDatabaseMissing('worker_profiles', ['id' => $profileId]);
        $this->assertDatabaseMissing('worker_schedules', ['worker_profile_id' => $profileId]);
        $this->assertDatabaseMissing('worker_services', ['worker_profile_id' => $profileId]);
    }

    public function test_worker_with_appointments_cannot_be_deleted(): void
    {
        $client = User::query()->where('email', 'client@example.com')->first();
        $worker = User::query()->where('email', 'jhavuanna@octoberglory.com')->first();

        $this->actingAs($client)->postJson('/api/appointments', [
            'service_ids' => [Service::query()->first()->id],
            'worker_id' => $worker->id,
            'start_time' => now()->next('Tuesday')->format('Y-m-d').' 11:00:00',
            'payment_method' => 'card',
        ])->assertCreated();

        Sanctum::actingAs($this->admin(), ['*']);

        $this->deleteJson("/api/admin/workers/{$worker->id}")
            ->assertStatus(409)
            ->assertJsonPath('code', 'WORKER_HAS_HISTORY');

        $this->assertDatabaseHas('users', ['id' => $worker->id]);
    }

    public function test_delete_rejects_non_worker_users(): void
    {
        $client = User::query()->where('email', 'client@example.com')->first();

        Sanctum::actingAs($this->admin(), ['*']);

        $this->deleteJson("/api/admin/workers/{$client->id}")->assertNotFound();
        $this->assertDatabaseHas('users', ['id' => $client->id]);
    }

    public function test_non_admin_cannot_delete_workers(): void
    {
        $client = User::query()->where('email', 'client@example.com')->first();
        $worker = User::query()->where('email', 'maya@octoberglory.com')->first();

        $this->actingAs($client)->deleteJson("/api/admin/workers/{$worker->id}")->assertForbidden();
    }
}
