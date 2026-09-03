<?php

namespace Tests\Feature;

use App\Models\Service;
use App\Models\ServiceCategory;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CategoryManagementTest extends TestCase
{
    use RefreshDatabase;

    protected function setUp(): void
    {
        parent::setUp();
        $this->seed(DatabaseSeeder::class);
    }

    protected function admin(): User
    {
        return User::query()->where('email', 'admin@octoberglory.com')->first();
    }

    public function test_admin_can_create_update_and_delete_a_category(): void
    {
        Sanctum::actingAs($this->admin(), ['*']);

        // Create — slug is auto-generated.
        $create = $this->postJson('/api/admin/categories', ['name' => 'Bridal'])
            ->assertCreated()
            ->assertJsonPath('data.name', 'Bridal')
            ->assertJsonPath('data.slug', 'bridal');

        $id = $create->json('data.id');

        // Rename — slug follows the name.
        $this->putJson("/api/admin/categories/{$id}", ['name' => 'Bridal & Events'])
            ->assertOk()
            ->assertJsonPath('data.slug', 'bridal-events');

        // Delete.
        $this->deleteJson("/api/admin/categories/{$id}")->assertNoContent();
        $this->assertDatabaseMissing('service_categories', ['id' => $id]);
    }

    public function test_deleting_a_category_nulls_its_services_rather_than_deleting_them(): void
    {
        Sanctum::actingAs($this->admin(), ['*']);

        $category = ServiceCategory::query()->first();
        $service = Service::query()->where('category_id', $category->id)->firstOrFail();

        $this->deleteJson("/api/admin/categories/{$category->id}")->assertNoContent();

        $this->assertDatabaseHas('services', ['id' => $service->id, 'category_id' => null]);
    }

    public function test_non_admin_cannot_create_categories(): void
    {
        $client = User::query()->where('email', 'client@example.com')->first();

        $this->actingAs($client)->postJson('/api/admin/categories', ['name' => 'Nope'])
            ->assertForbidden();
    }
}
