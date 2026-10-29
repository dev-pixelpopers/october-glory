<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\Setting;
use App\Models\User;
use App\Services\MembershipService;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Queue;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class MemberDiscountTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Queue::fake();
        $this->seed(DatabaseSeeder::class);
    }

    private function client(): User
    {
        return User::query()->where('email', 'client@example.com')->first();
    }

    private function book(User $client, Service $service, int $points = 0)
    {
        return $this->actingAs($client)->postJson('/api/appointments', [
            'service_ids' => [$service->id],
            'worker_id' => null,
            'start_time' => now()->next('Tuesday')->format('Y-m-d').' 11:00:00',
            'payment_method' => 'pay_upon_arrival',
            'loyalty_points_used' => $points,
        ])->assertCreated();
    }

    public function test_discount_rate_defaults_to_30_percent(): void
    {
        $this->assertSame('0.30', Setting::get(MembershipService::KEY_DISCOUNT_RATE));
        $this->assertSame(0.3, app(MembershipService::class)->discountRate());
    }

    public function test_non_member_pays_the_listed_price(): void
    {
        $service = Service::query()->where('slug', 'silk-press')->firstOrFail(); // $155 (menu price)

        $response = $this->book($this->client(), $service);

        $this->assertSame('0.00', $response->json('data.member_discount_amount'));
        $this->assertSame('155.00', $response->json('data.total_amount'));
    }

    public function test_member_gets_30_percent_off(): void
    {
        $client = $this->client();
        app(MembershipService::class)->grant($client);
        $service = Service::query()->where('slug', 'silk-press')->firstOrFail(); // $155 (menu price)

        $response = $this->book($client, $service);

        $this->assertSame('155.00', $response->json('data.subtotal_amount'));
        $this->assertSame('46.50', $response->json('data.member_discount_amount'));
        $this->assertSame('108.50', $response->json('data.total_amount'));
        // The line keeps the listed price; the discount sits on the appointment.
        $this->assertSame('155.00', $response->json('data.services.0.price_at_booking'));
    }

    public function test_loyalty_points_redeem_after_the_member_discount(): void
    {
        $client = $this->client();
        app(MembershipService::class)->grant($client);
        $client->loyaltyTransactions()->create(['amount' => 500, 'type' => 'admin_adjustment', 'description' => 'Seed']);
        $service = Service::query()->where('slug', 'silk-press')->firstOrFail(); // $155 → $108.50

        // 500 pts × $0.10 = $50 off the $108.50 member price, not the listed $155.
        $response = $this->book($client, $service, 500);

        $this->assertSame('46.50', $response->json('data.member_discount_amount'));
        $this->assertSame('50.00', $response->json('data.discount_amount'));
        $this->assertSame('58.50', $response->json('data.total_amount'));
    }

    public function test_expired_or_ended_membership_gets_no_discount(): void
    {
        $client = $this->client();
        $service = Service::query()->where('slug', 'silk-press')->firstOrFail();

        app(MembershipService::class)->grant($client, now()->addDay());
        $this->travel(2)->days();
        $this->assertFalse($client->fresh()->isMember());

        app(MembershipService::class)->grant($client);
        app(MembershipService::class)->revoke($client);
        $this->assertFalse($client->fresh()->isMember());

        $this->assertSame('0.00', $this->book($client->fresh(), $service)->json('data.member_discount_amount'));
    }

    public function test_me_reports_membership_and_rate(): void
    {
        $client = $this->client();
        app(MembershipService::class)->grant($client);

        $this->actingAs($client)->getJson('/api/me')
            ->assertOk()
            ->assertJsonPath('data.is_member', true)
            ->assertJsonPath('data.member_discount_rate', 0.3);
    }

    public function test_admin_can_list_clients_and_toggle_membership(): void
    {
        Sanctum::actingAs(User::query()->where('role', 'admin')->first(), ['*']);
        $client = $this->client();

        $this->getJson('/api/admin/clients?q=client@example')
            ->assertOk()
            ->assertJsonPath('data.0.email', 'client@example.com')
            ->assertJsonPath('data.0.is_member', false);

        $endsAt = now()->addMonth()->toDateString();
        $this->putJson("/api/admin/clients/{$client->id}/membership", ['is_member' => true, 'ends_at' => $endsAt])
            ->assertOk()
            ->assertJsonPath('data.is_member', true);
        $this->assertTrue($client->fresh()->isMember());

        // Granting again replaces, never stacks, the active membership.
        $this->putJson("/api/admin/clients/{$client->id}/membership", ['is_member' => true])->assertOk();
        $this->assertSame(1, $client->memberships()->where('status', 'active')->count());

        $this->getJson('/api/admin/clients?members=1')->assertOk()->assertJsonCount(1, 'data');

        $this->putJson("/api/admin/clients/{$client->id}/membership", ['is_member' => false])
            ->assertOk()
            ->assertJsonPath('data.is_member', false);
        $this->assertFalse($client->fresh()->isMember());
    }

    public function test_only_clients_can_be_made_members_and_only_by_admins(): void
    {
        $worker = User::query()->where('email', 'maya@octoberglory.com')->first();
        $client = $this->client();

        $this->actingAs($client)->putJson("/api/admin/clients/{$client->id}/membership", ['is_member' => true])
            ->assertForbidden();

        Sanctum::actingAs(User::query()->where('role', 'admin')->first(), ['*']);
        $this->putJson("/api/admin/clients/{$worker->id}/membership", ['is_member' => true])->assertNotFound();
    }
}
