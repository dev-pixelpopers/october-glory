<?php

namespace Tests\Feature;

use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ImageUploadTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
        Storage::fake('public');
    }

    private function actAsAdmin(): void
    {
        Sanctum::actingAs(User::query()->where('role', 'admin')->first(), ['*']);
    }

    public function test_admin_uploads_an_image_and_gets_its_public_url(): void
    {
        $this->actAsAdmin();

        $response = $this->post('/api/admin/uploads/image', [
            'image' => UploadedFile::fake()->image('rodset.jpg', 800, 600),
            'folder' => 'services',
        ], ['Accept' => 'application/json'])->assertCreated();

        $path = $response->json('path');
        $this->assertStringStartsWith('images/services/', $path);
        Storage::disk('public')->assertExists($path);
        $this->assertSame(Storage::disk('public')->url($path), $response->json('url'));
    }

    public function test_non_images_and_unknown_folders_are_rejected(): void
    {
        $this->actAsAdmin();

        $this->post('/api/admin/uploads/image', [
            'image' => UploadedFile::fake()->create('notes.pdf', 10, 'application/pdf'),
        ], ['Accept' => 'application/json'])->assertUnprocessable()->assertJsonValidationErrors(['image']);

        $this->post('/api/admin/uploads/image', [
            'image' => UploadedFile::fake()->image('a.png'),
            'folder' => '../../etc',
        ], ['Accept' => 'application/json'])->assertUnprocessable()->assertJsonValidationErrors(['folder']);
    }

    public function test_images_over_5mb_are_rejected(): void
    {
        $this->actAsAdmin();

        $this->post('/api/admin/uploads/image', [
            'image' => UploadedFile::fake()->image('big.jpg')->size(6000),
        ], ['Accept' => 'application/json'])->assertUnprocessable()->assertJsonValidationErrors(['image']);
    }

    public function test_non_admin_cannot_upload(): void
    {
        $client = User::query()->where('email', 'client@example.com')->first();

        $this->actingAs($client)->post('/api/admin/uploads/image', [
            'image' => UploadedFile::fake()->image('a.png'),
        ], ['Accept' => 'application/json'])->assertForbidden();
    }

    public function test_worker_photo_accepts_a_site_path(): void
    {
        $this->actAsAdmin();
        $worker = User::query()->where('email', 'maya@octoberglory.com')->first();

        $this->putJson("/api/admin/workers/{$worker->id}", ['avatar_url' => '/images/salon-image.webp'])
            ->assertOk()
            ->assertJsonPath('data.avatar_url', '/images/salon-image.webp');
    }
}
