<?php

namespace Tests\Feature;

use App\Mail\LoginOtpMail;
use App\Mail\SendRegistrationOtpMail;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class GuestAuthTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        Mail::fake();
    }

    /* ---------------------- Frictionless guest sessions ---------------------- */

    public function test_first_time_guest_gets_account_and_full_token(): void
    {
        $response = $this->postJson('/api/auth/guest-session', [
            'name' => 'Walk-In Wendy',
            'email' => 'wendy@example.com',
            'phone' => '555-0100',
        ]);

        $response->assertCreated()
            ->assertJsonStructure(['token', 'user'])
            ->assertJson(['session_scope' => 'full']);
        $this->assertTrue($response->json('user.is_guest'));

        $user = User::query()->where('email', 'wendy@example.com')->first();
        $this->assertNull($user->password);
        $this->assertTrue($user->is_guest);
    }

    public function test_returning_guest_signs_in_immediately_without_otp(): void
    {
        User::query()->create([
            'name' => 'Old Name',
            'email' => 'greta@example.com',
            'password' => null,
            'role' => 'client',
            'is_guest' => true,
        ]);

        $response = $this->postJson('/api/auth/guest-session', [
            'name' => 'Guest Greta',
            'email' => 'greta@example.com',
        ]);

        $response->assertOk()->assertJson(['session_scope' => 'full']);
        Mail::assertNothingQueued();
        $this->assertSame('Guest Greta', User::query()->where('email', 'greta@example.com')->value('name'));
    }

    public function test_full_account_email_gets_scoped_guest_session(): void
    {
        User::query()->create([
            'name' => 'Registered Rita',
            'email' => 'rita@example.com',
            'password' => 'secret-password',
            'role' => 'client',
            'email_verified_at' => now(),
        ]);

        $response = $this->postJson('/api/auth/guest-session', [
            'name' => 'Rita',
            'email' => 'rita@example.com',
        ]);

        $response->assertOk()->assertJson(['session_scope' => 'guest']);
        Mail::assertNothingQueued();
    }

    public function test_scoped_guest_session_cannot_touch_loyalty_history_or_admin(): void
    {
        $this->seed(\Database\Seeders\DatabaseSeeder::class);

        $owner = User::query()->create([
            'name' => 'Owner Olivia',
            'email' => 'olivia@example.com',
            'password' => 'secret-password',
            'role' => 'client',
            'email_verified_at' => now(),
        ]);
        $owner->loyaltyTransactions()->create([
            'amount' => 500, 'type' => 'admin_adjustment', 'description' => 'Saved points',
        ]);

        // Pre-existing appointment that must stay hidden.
        $worker = User::query()->where('role', 'worker')->first();
        $historic = $owner->appointmentsAsClient()->create([
            'booking_reference' => 'SLN-HIST01',
            'worker_id' => $worker->id,
            'start_time' => now()->subWeek(),
            'end_time' => now()->subWeek()->addHour(),
            'total_duration_minutes' => 60,
            'subtotal_amount' => 75,
            'total_amount' => 75,
            'payment_method' => 'card',
            'status' => 'completed',
        ]);
        // Booked last week — created_at must predate the guest session.
        $historic->newQuery()->whereKey($historic->id)->update(['created_at' => now()->subWeek()]);

        $token = $this->postJson('/api/auth/guest-session', [
            'name' => 'Olivia', 'email' => 'olivia@example.com',
        ])->json('token');
        $headers = ['Authorization' => "Bearer {$token}"];

        // Saved balance locked and hidden.
        $this->getJson('/api/loyalty/balance', $headers)
            ->assertOk()->assertJson(['balance' => 0, 'locked' => true]);
        $this->assertCount(0, $this->getJson('/api/loyalty/transactions', $headers)->json('data'));

        // Historical appointments hidden.
        $this->assertCount(0, $this->getJson('/api/appointments', $headers)->json('data'));

        // Redemption rejected outright.
        $service = \App\Models\Service::query()->first();
        $this->postJson('/api/appointments', [
            'service_ids' => [$service->id],
            'worker_id' => null,
            'start_time' => now()->next('Tuesday')->format('Y-m-d').' 11:00:00',
            'payment_method' => 'card',
            'loyalty_points_used' => 100,
        ], $headers)->assertStatus(422);

        // Booking without redemption works, and only that booking is visible.
        $this->postJson('/api/appointments', [
            'service_ids' => [$service->id],
            'worker_id' => null,
            'start_time' => now()->next('Tuesday')->format('Y-m-d').' 11:00:00',
            'payment_method' => 'card',
        ], $headers)->assertCreated();
        $this->assertCount(1, $this->getJson('/api/appointments', $headers)->json('data'));

        // Role-gated endpoints refuse scoped tokens even for privileged emails.
        $admin = User::query()->where('role', 'admin')->first();
        $adminScoped = $this->postJson('/api/auth/guest-session', [
            'name' => 'X', 'email' => $admin->email,
        ])->json('token');
        $this->getJson('/api/admin/audit-logs', ['Authorization' => "Bearer {$adminScoped}"])
            ->assertForbidden();
    }

    /* ---------------------- Registration OTP verification -------------------- */

    public function test_registration_creates_unverified_account_and_sends_otp(): void
    {
        $response = $this->postJson('/api/auth/register', [
            'name' => 'New Nadia',
            'email' => 'nadia@example.com',
            'password' => 'super-secret-1',
        ]);

        $response->assertCreated()
            ->assertJson(['requires_verification' => true])
            ->assertJsonMissing(['token']);

        $user = User::query()->where('email', 'nadia@example.com')->first();
        $this->assertFalse($user->is_active);
        $this->assertNull($user->email_verified_at);
        Mail::assertQueued(SendRegistrationOtpMail::class, fn ($m) => $m->hasTo('nadia@example.com'));

        // Cannot log in before verifying — a fresh code is sent instead.
        $this->postJson('/api/auth/login', [
            'email' => 'nadia@example.com',
            'password' => 'super-secret-1',
        ])->assertStatus(423)->assertJson(['requires_verification' => true]);
    }

    public function test_registration_otp_activates_account_and_issues_token(): void
    {
        $this->postJson('/api/auth/register', [
            'name' => 'New Nadia',
            'email' => 'nadia@example.com',
            'password' => 'super-secret-1',
        ])->assertCreated();

        Cache::put('otp:register:nadia@example.com', Hash::make('654321'), now()->addMinutes(15));

        $this->postJson('/api/auth/verify-otp', [
            'email' => 'nadia@example.com',
            'otp_code' => '000000',
        ])->assertStatus(422);

        $response = $this->postJson('/api/auth/verify-otp', [
            'email' => 'nadia@example.com',
            'otp_code' => '654321',
        ]);

        $response->assertOk()->assertJsonStructure(['token', 'user'])->assertJson(['session_scope' => 'full']);

        $user = User::query()->where('email', 'nadia@example.com')->first();
        $this->assertTrue($user->is_active);
        $this->assertNotNull($user->email_verified_at);
        $this->assertFalse($user->is_guest);

        // Standard login now works.
        $this->postJson('/api/auth/login', [
            'email' => 'nadia@example.com',
            'password' => 'super-secret-1',
        ])->assertOk();
    }

    public function test_registering_with_guest_email_converts_the_guest_account(): void
    {
        $guest = User::query()->create([
            'name' => 'Guest Gina',
            'email' => 'gina@example.com',
            'password' => null,
            'role' => 'client',
            'is_guest' => true,
        ]);

        $this->postJson('/api/auth/register', [
            'name' => 'Gina Grown-Up',
            'email' => 'gina@example.com',
            'password' => 'now-with-password',
        ])->assertCreated()->assertJson(['requires_verification' => true]);

        $guest->refresh();
        $this->assertSame('Gina Grown-Up', $guest->name);
        $this->assertNotNull($guest->password);

        // Registering over a FULL account is rejected.
        User::query()->create([
            'name' => 'Taken', 'email' => 'taken@example.com',
            'password' => 'password', 'role' => 'client',
        ]);
        $this->postJson('/api/auth/register', [
            'name' => 'X', 'email' => 'taken@example.com', 'password' => 'password-123',
        ])->assertStatus(422);
    }

    public function test_resend_otp_is_generic_and_requeues_code(): void
    {
        $this->postJson('/api/auth/register', [
            'name' => 'New Nadia', 'email' => 'nadia@example.com', 'password' => 'super-secret-1',
        ])->assertCreated();

        // Cooldown active right after registration; clear it to test resend.
        Cache::forget('otp:register:nadia@example.com:cooldown');

        $this->postJson('/api/auth/resend-otp', ['email' => 'nadia@example.com'])->assertOk();
        Mail::assertQueuedCount(2);

        // Unknown email gets the same generic response.
        $this->postJson('/api/auth/resend-otp', ['email' => 'nobody@example.com'])->assertOk();
    }

    /* ----------------- Passwordless guest at the login screen ---------------- */

    public function test_passwordless_guest_at_login_screen_gets_otp_prompt(): void
    {
        User::query()->create([
            'name' => 'Guest Gary',
            'email' => 'gary@example.com',
            'password' => null,
            'role' => 'client',
            'is_guest' => true,
        ]);

        $this->postJson('/api/auth/login', [
            'email' => 'gary@example.com',
            'password' => 'anything',
        ])->assertStatus(423)->assertJson(['guest_otp_sent' => true]);
        Mail::assertQueued(LoginOtpMail::class);

        Cache::put('otp:login:gary@example.com', Hash::make('123456'), now()->addMinutes(10));
        $this->postJson('/api/auth/verify-otp', [
            'email' => 'gary@example.com',
            'otp_code' => '123456',
        ])->assertOk()->assertJsonStructure(['token']);
    }

    public function test_setting_password_converts_guest_to_full_user(): void
    {
        $guest = User::query()->create([
            'name' => 'Guest Gina',
            'email' => 'gina@example.com',
            'password' => null,
            'role' => 'client',
            'is_guest' => true,
        ]);

        $this->actingAs($guest)->postJson('/api/auth/set-password', [
            'password' => 'brand-new-password',
        ])->assertOk();

        $guest->refresh();
        $this->assertFalse($guest->is_guest);
        $this->assertTrue(Hash::check('brand-new-password', $guest->password));
    }

    /* ------------------------- Shoutout screenshot upload -------------------- */

    public function test_shoutout_screenshot_upload_stores_file_and_claim(): void
    {
        Storage::fake('public');

        $client = User::query()->create([
            'name' => 'Client Cleo',
            'email' => 'cleo@example.com',
            'password' => 'password',
            'role' => 'client',
            'email_verified_at' => now(),
        ]);

        $response = $this->actingAs($client)->post('/api/shoutout-claims', [
            'platform' => 'Instagram Story',
            'proof_image' => UploadedFile::fake()->image('story.png', 800, 1200),
        ], ['Accept' => 'application/json']);

        $response->assertCreated();

        $files = Storage::disk('public')->files('shoutouts');
        $this->assertCount(1, $files);
        $this->assertStringContainsString('/storage/shoutouts/', $response->json('data.proof_url'));

        $this->actingAs($client)->post('/api/shoutout-claims', [
            'platform' => 'TikTok',
            'proof_image' => UploadedFile::fake()->create('huge.png', 6000, 'image/png'),
        ], ['Accept' => 'application/json'])->assertStatus(422);
    }
}
