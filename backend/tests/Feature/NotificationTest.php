<?php

namespace Tests\Feature;

use App\Events\AppointmentBooked;
use App\Events\ReviewSubmitted;
use App\Events\ShoutoutClaimSubmitted;
use App\Models\AppNotification;
use App\Models\Appointment;
use App\Models\Review;
use App\Models\Service;
use App\Models\ShoutoutClaim;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\Queue;
use Tests\TestCase;

class NotificationTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_endpoints_require_authentication(): void
    {
        $this->getJson('/api/notifications')->assertUnauthorized();
        $this->getJson('/api/notifications/unread-count')->assertUnauthorized();
        $this->patchJson('/api/notifications/read-all')->assertUnauthorized();
    }

    public function test_role_scoping_for_notifications(): void
    {
        $admin = User::query()->where('role', User::ROLE_ADMIN)->first();
        $worker = User::query()->where('role', User::ROLE_WORKER)->first();
        $client = User::query()->where('role', User::ROLE_CLIENT)->first();
        $otherClient = User::factory()->create(['role' => User::ROLE_CLIENT]);

        // 1. System-wide notification (user_id = null)
        $systemNotification = AppNotification::create([
            'user_id' => null,
            'type' => 'system_alert',
            'title' => 'System Maintenance',
            'message' => 'Salon is closed on Sunday.',
        ]);

        // 2. Client targeted notification
        $clientNotification = AppNotification::create([
            'user_id' => $client->id,
            'type' => 'appointment.booked',
            'title' => 'Booking Confirmed',
            'message' => 'Your appointment is booked.',
        ]);

        // 3. Worker targeted notification
        $workerNotification = AppNotification::create([
            'user_id' => $worker->id,
            'type' => 'appointment.assigned',
            'title' => 'New Assignment',
            'message' => 'You have a new booking.',
        ]);

        // 4. Other client notification
        $otherClientNotification = AppNotification::create([
            'user_id' => $otherClient->id,
            'type' => 'appointment.booked',
            'title' => 'Other booking',
            'message' => 'Another client booking.',
        ]);

        // Client sees ONLY their own
        $clientRes = $this->actingAs($client)->getJson('/api/notifications')->assertOk();
        $clientIds = collect($clientRes->json('data'))->pluck('id')->all();
        $this->assertContains($clientNotification->id, $clientIds);
        $this->assertNotContains($systemNotification->id, $clientIds);
        $this->assertNotContains($workerNotification->id, $clientIds);
        $this->assertNotContains($otherClientNotification->id, $clientIds);

        // Worker sees ONLY their own
        $workerRes = $this->actingAs($worker)->getJson('/api/notifications')->assertOk();
        $workerIds = collect($workerRes->json('data'))->pluck('id')->all();
        $this->assertContains($workerNotification->id, $workerIds);
        $this->assertNotContains($systemNotification->id, $workerIds);
        $this->assertNotContains($clientNotification->id, $workerIds);

        // Admin sees system-wide (null) and direct admin notifications, but NOT private client/worker notifications
        $adminRes = $this->actingAs($admin)->getJson('/api/notifications')->assertOk();
        $adminIds = collect($adminRes->json('data'))->pluck('id')->all();
        $this->assertContains($systemNotification->id, $adminIds);
        $this->assertNotContains($clientNotification->id, $adminIds);
        $this->assertNotContains($workerNotification->id, $adminIds);
    }

    public function test_unread_count_and_marking_as_read(): void
    {
        $client = User::query()->where('role', User::ROLE_CLIENT)->first();

        $n1 = AppNotification::create([
            'user_id' => $client->id,
            'type' => 'test',
            'title' => 'Test 1',
            'message' => 'Msg 1',
        ]);
        $n2 = AppNotification::create([
            'user_id' => $client->id,
            'type' => 'test',
            'title' => 'Test 2',
            'message' => 'Msg 2',
        ]);

        $res = $this->actingAs($client)->getJson('/api/notifications/unread-count')->assertOk();
        $this->assertEquals(2, $res->json('unread_count'));

        // Mark n1 as read
        $markRes = $this->actingAs($client)->patchJson("/api/notifications/{$n1->id}/read")->assertOk();
        $isRead = $markRes->json('is_read') ?? $markRes->json('data.is_read');
        $this->assertTrue($isRead);
        $this->assertNotNull($n1->fresh()->read_at);

        $resAfter = $this->actingAs($client)->getJson('/api/notifications/unread-count')->assertOk();
        $this->assertEquals(1, $resAfter->json('unread_count'));

        // Mark all as read
        $readAllRes = $this->actingAs($client)->patchJson('/api/notifications/read-all')->assertOk();
        $this->assertEquals(1, $readAllRes->json('marked_count'));

        $this->assertNotNull($n2->fresh()->read_at);
        $resFinal = $this->actingAs($client)->getJson('/api/notifications/unread-count')->assertOk();
        $this->assertEquals(0, $resFinal->json('unread_count'));
    }

    public function test_user_cannot_access_or_modify_other_users_notification(): void
    {
        $client1 = User::query()->where('role', User::ROLE_CLIENT)->first();
        $client2 = User::factory()->create(['role' => User::ROLE_CLIENT]);

        $n = AppNotification::create([
            'user_id' => $client1->id,
            'type' => 'test',
            'title' => 'Secret',
            'message' => 'For client 1 only',
        ]);

        $this->actingAs($client2)->patchJson("/api/notifications/{$n->id}/read")->assertForbidden();
        $this->actingAs($client2)->deleteJson("/api/notifications/{$n->id}")->assertForbidden();
    }

    public function test_delete_notification(): void
    {
        $client = User::query()->where('role', User::ROLE_CLIENT)->first();

        $n = AppNotification::create([
            'user_id' => $client->id,
            'type' => 'test',
            'title' => 'To be deleted',
            'message' => 'Bye',
        ]);

        $this->actingAs($client)->deleteJson("/api/notifications/{$n->id}")->assertOk();
        $this->assertDatabaseMissing('notifications', ['id' => $n->id]);
    }

    public function test_domain_event_appointment_booked_generates_notifications(): void
    {
        $admin = User::query()->where('role', User::ROLE_ADMIN)->first();
        $worker = User::query()->where('role', User::ROLE_WORKER)->first();
        $client = User::query()->where('role', User::ROLE_CLIENT)->first();

        $appointment = Appointment::query()->create([
            'booking_reference' => 'BK-TEST-1',
            'client_id' => $client->id,
            'worker_id' => $worker->id,
            'start_time' => now()->addDays(2),
            'end_time' => now()->addDays(2)->addHours(2),
            'total_duration_minutes' => 120,
            'subtotal_amount' => 150.00,
            'member_discount_amount' => 0.00,
            'loyalty_points_used' => 0,
            'discount_amount' => 0.00,
            'total_amount' => 150.00,
            'payment_method' => 'pay_upon_arrival',
            'payment_status' => 'pending',
            'status' => Appointment::STATUS_SCHEDULED,
        ]);

        event(new AppointmentBooked($appointment->load(['client', 'worker'])));

        // Client notification
        $this->assertDatabaseHas('notifications', [
            'user_id' => $client->id,
            'type' => 'appointment.booked',
        ]);

        // Worker notification
        $this->assertDatabaseHas('notifications', [
            'user_id' => $worker->id,
            'type' => 'appointment.assigned',
        ]);

        // Admin notification (system-wide)
        $this->assertDatabaseHas('notifications', [
            'user_id' => null,
            'type' => 'admin.appointment.booked',
        ]);
    }

    public function test_domain_event_shoutout_submitted_generates_admin_notification(): void
    {
        $client = User::query()->where('role', User::ROLE_CLIENT)->first();

        $claim = ShoutoutClaim::create([
            'user_id' => $client->id,
            'platform' => 'instagram',
            'proof_url' => 'shoutouts/proof.png',
            'status' => ShoutoutClaim::STATUS_PENDING,
        ]);

        event(new ShoutoutClaimSubmitted($claim));

        $this->assertDatabaseHas('notifications', [
            'user_id' => null,
            'type' => 'admin.shoutout.submitted',
        ]);
    }

    public function test_admin_creating_service_generates_notifications(): void
    {
        $admin = User::query()->where('role', User::ROLE_ADMIN)->first();
        $worker = User::query()->where('role', User::ROLE_WORKER)->first();

        $res = $this->actingAs($admin)->postJson('/api/admin/services', [
            'name' => 'Scalp Therapy Deluxe',
            'duration_minutes' => 60,
            'price' => '85.00',
            'is_active' => true,
        ]);

        $res->assertCreated();

        // System-wide admin notification (exactly 1)
        $this->assertEquals(1, AppNotification::whereNull('user_id')->where('type', 'admin.service.created')->count());

        // Worker notification
        $this->assertDatabaseHas('notifications', [
            'user_id' => $worker->id,
            'type' => 'service.created',
        ]);
    }

    public function test_admin_creating_package_generates_notifications(): void
    {
        $admin = User::query()->where('role', User::ROLE_ADMIN)->first();
        $worker = User::query()->where('role', User::ROLE_WORKER)->first();
        $services = Service::query()->take(2)->get();

        $res = $this->actingAs($admin)->postJson('/api/admin/packages', [
            'name' => 'Luxury Hair Day Package',
            'collection' => 'maintenance',
            'includes' => ['Wash', 'Styling'],
            'service_ids' => $services->pluck('id')->all(),
            'price' => '150.00',
        ]);

        $res->assertCreated();

        // System-wide admin notification (exactly 1)
        $this->assertEquals(1, AppNotification::whereNull('user_id')->where('type', 'admin.package.created')->count());

        // Worker notification
        $this->assertDatabaseHas('notifications', [
            'user_id' => $worker->id,
            'type' => 'package.created',
        ]);
    }

    public function test_admin_creating_product_generates_notification(): void
    {
        $admin = User::query()->where('role', User::ROLE_ADMIN)->first();

        $res = $this->actingAs($admin)->postJson('/api/admin/products', [
            'name' => 'Hydrating Edge Control',
            'category' => 'Wigs',
            'price' => '25.00',
            'is_active' => true,
        ]);

        $res->assertCreated();

        // System-wide admin notification
        $this->assertDatabaseHas('notifications', [
            'user_id' => null,
            'type' => 'admin.product.created',
        ]);
    }
}
