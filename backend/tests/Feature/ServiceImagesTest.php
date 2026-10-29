<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\ServiceImages;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ServiceImagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_every_seeded_service_has_an_image(): void
    {
        $this->assertSame([], Service::query()->whereNull('image')->pluck('name')->all());

        $this->getJson('/api/services')
            ->assertOk()
            ->assertJsonPath('data.0.image', fn ($image) => is_string($image) && str_starts_with($image, '/images/'));
    }

    public function test_every_mapped_image_exists_in_the_site_with_exact_case(): void
    {
        // Production filesystems are case-sensitive, so compare exact names.
        $files = scandir(base_path('../public/images'));

        foreach (array_unique(ServiceImages::MAP) as $path) {
            $this->assertContains(basename($path), $files, "{$path} is missing from public/images");
        }
    }

    public function test_backfill_never_replaces_an_image_set_by_the_admin(): void
    {
        $service = Service::query()->where('name', 'Rodset')->firstOrFail();
        $service->update(['image' => '/images/custom.webp']);

        ServiceImages::apply();

        $this->assertSame('/images/custom.webp', $service->fresh()->image);
    }

    public function test_admin_can_set_a_service_image(): void
    {
        Sanctum::actingAs(User::query()->where('role', 'admin')->first(), ['*']);
        $service = Service::query()->where('name', 'Rodset')->firstOrFail();

        $this->putJson("/api/admin/services/{$service->id}", ['image' => '/images/RodSet-01.webp'])
            ->assertOk()
            ->assertJsonPath('data.image', '/images/RodSet-01.webp');
    }
}
