<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ProductManagementTest extends TestCase
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

    public function test_migration_adds_the_ten_wig_units_with_gallery_prices(): void
    {
        $this->getJson('/api/products')
            ->assertOk()
            ->assertJsonCount(10, 'data')
            ->assertJsonPath('data.0.name', 'Tiffany')
            ->assertJsonPath('data.0.price', '1800.00')
            ->assertJsonPath('data.0.image', '/images/Tiffany.png')
            ->assertJsonPath('data.2.name', 'Tricia')
            ->assertJsonPath('data.2.price', '2450.00')
            ->assertJsonPath('data.9.name', 'Becka')
            ->assertJsonPath('data.9.length', '20 inch');
    }

    public function test_public_listing_hides_inactive_products_but_admin_listing_shows_them(): void
    {
        Product::query()->where('slug', 'kelly')->update(['is_active' => false]);

        $this->getJson('/api/products')->assertJsonCount(9, 'data');

        Sanctum::actingAs($this->admin(), ['*']);
        $this->getJson('/api/admin/products')->assertJsonCount(10, 'data');
    }

    public function test_admin_can_create_update_and_delete_a_product(): void
    {
        Sanctum::actingAs($this->admin(), ['*']);

        $id = $this->postJson('/api/admin/products', [
            'name' => 'Satin Bonnet',
            'category' => 'Accessories',
            'price' => '20',
            'tags' => ['styles'],
        ])
            ->assertCreated()
            ->assertJsonPath('data.slug', 'satin-bonnet')
            ->assertJsonPath('data.price', '20.00')
            ->json('data.id');

        $this->putJson("/api/admin/products/{$id}", ['name' => 'Silk Bonnet', 'price' => '24.50'])
            ->assertOk()
            ->assertJsonPath('data.slug', 'silk-bonnet')
            ->assertJsonPath('data.price', '24.50');

        $this->deleteJson("/api/admin/products/{$id}")->assertNoContent();
        $this->assertDatabaseMissing('products', ['id' => $id]);
    }

    public function test_product_requires_name_and_price(): void
    {
        Sanctum::actingAs($this->admin(), ['*']);

        $this->postJson('/api/admin/products', [])
            ->assertUnprocessable()
            ->assertJsonValidationErrors(['name', 'price']);
    }

    public function test_non_admin_cannot_manage_products(): void
    {
        $client = User::query()->where('email', 'client@example.com')->first();
        $product = Product::query()->first();

        $this->actingAs($client)->postJson('/api/admin/products', ['name' => 'X', 'price' => 1])->assertForbidden();
        $this->actingAs($client)->deleteJson("/api/admin/products/{$product->id}")->assertForbidden();
    }
}
