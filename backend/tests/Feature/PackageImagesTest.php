<?php

namespace Tests\Feature;

use App\Models\Package;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Database\Seeders\PackageImages;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class PackageImagesTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    public function test_every_seeded_package_has_its_image(): void
    {
        foreach (PackageImages::MAP as $slug => $image) {
            $this->assertSame($image, Package::query()->where('slug', $slug)->value('image'), $slug);
        }
        $this->assertSame([], Package::query()->whereNull('image')->pluck('slug')->all());

        $this->getJson('/api/packages?collection=glorious')
            ->assertOk()
            ->assertJsonPath('data.0.image', fn ($image) => is_string($image) && str_starts_with($image, '/images/'));
    }

    public function test_every_mapped_image_exists_in_the_site_with_exact_case(): void
    {
        $files = scandir(base_path('../public/images'));

        foreach (array_unique(PackageImages::MAP) as $path) {
            $this->assertContains(basename($path), $files, "{$path} is missing from public/images");
        }
    }

    public function test_backfill_never_replaces_an_image_set_by_the_admin(): void
    {
        $package = Package::query()->where('slug', 'wig-prep')->firstOrFail();
        $package->update(['image' => '/images/custom.webp']);

        PackageImages::apply();

        $this->assertSame('/images/custom.webp', $package->fresh()->image);
    }

    public function test_admin_can_set_a_package_image(): void
    {
        Sanctum::actingAs(User::query()->where('role', 'admin')->first(), ['*']);
        $package = Package::query()->where('slug', 'wig-prep')->firstOrFail();

        $this->putJson("/api/admin/packages/{$package->id}", ['image' => '/images/salon-image.webp'])
            ->assertOk()
            ->assertJsonPath('data.image', '/images/salon-image.webp');
    }
}
