<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Database\Seeders\DatabaseSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
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

    public function test_can_fetch_single_product_by_slug(): void
    {
        $this->getJson('/api/products/tiffany')
            ->assertOk()
            ->assertJsonPath('data.name', 'Tiffany')
            ->assertJsonPath('data.slug', 'tiffany');

        $this->getJson('/api/products/non-existent-product')
            ->assertNotFound();
    }

    public function test_product_seeder_populates_showcase_fields(): void
    {
        $this->seed(\Database\Seeders\ProductSeeder::class);

        $this->getJson('/api/products/tiffany')
            ->assertOk()
            ->assertJsonPath('data.name', 'Tiffany')
            ->assertJsonPath('data.video', '/images/Tiffany.mp4')
            ->assertJsonPath('data.what_she_wanted', fn ($v) => str_contains($v, 'Tiffany wanted length'))
            ->assertJsonPath('data.what_we_built', fn ($v) => str_contains($v, 'Twenty-two inches'))
            ->assertJsonPath('data.how_she_wears_it', fn ($v) => str_contains($v, 'She wears it down'))
            ->assertJsonPath('data.the_install.0.tag', 'Before')
            ->assertJsonPath('data.the_install.1.tag', 'Braided down')
            ->assertJsonPath('data.the_install.2.tag', 'After');
    }

    public function test_admin_can_create_and_update_product_with_showcase_fields_using_urls(): void
    {
        Sanctum::actingAs($this->admin(), ['*']);

        $res = $this->postJson('/api/admin/products', [
            'name' => 'Custom Glueless Unit',
            'category' => 'Wigs',
            'price' => '2200.00',
            'background_image' => 'https://example.com/bg.jpg',
            'what_she_wanted' => 'A natural glueless everyday unit',
            'what_we_built' => '20 inch HD lace unit with bleached knots',
            'how_she_wears_it' => 'Middle part with loose waves',
            'video' => 'https://example.com/showcase.mp4',
            'the_install' => [
                ['image' => 'https://example.com/step1.jpg', 'tag' => 'Cornrows prep'],
                ['image' => 'https://example.com/step2.jpg', 'tag' => 'Lace melting'],
            ],
        ])
            ->assertCreated()
            ->assertJsonPath('data.background_image', 'https://example.com/bg.jpg')
            ->assertJsonPath('data.what_she_wanted', 'A natural glueless everyday unit')
            ->assertJsonPath('data.what_we_built', '20 inch HD lace unit with bleached knots')
            ->assertJsonPath('data.how_she_wears_it', 'Middle part with loose waves')
            ->assertJsonPath('data.video', 'https://example.com/showcase.mp4')
            ->assertJsonPath('data.the_install.0.tag', 'Cornrows prep')
            ->assertJsonPath('data.the_install.0.image', 'https://example.com/step1.jpg');

        $id = $res->json('data.id');

        $this->putJson("/api/admin/products/{$id}", [
            'what_she_wanted' => 'Updated client desire',
            'video' => 'https://example.com/updated-video.mp4',
            'the_install' => [
                ['image' => 'https://example.com/step-new.jpg', 'tag' => 'New styling'],
            ],
        ])
            ->assertOk()
            ->assertJsonPath('data.what_she_wanted', 'Updated client desire')
            ->assertJsonPath('data.video', 'https://example.com/updated-video.mp4')
            ->assertJsonPath('data.the_install.0.tag', 'New styling');
    }

    public function test_admin_can_upload_files_for_showcase_fields(): void
    {
        Storage::fake('public');
        Sanctum::actingAs($this->admin(), ['*']);

        $bg = UploadedFile::fake()->create('bg.jpg', 100, 'image/jpeg');
        $vid = UploadedFile::fake()->create('showcase.mp4', 5000, 'video/mp4');
        $installImg = UploadedFile::fake()->create('step1.jpg', 100, 'image/jpeg');

        $res = $this->post('/api/admin/products', [
            'name' => 'Uploaded Unit',
            'price' => '1500.00',
            'background_image' => $bg,
            'video' => $vid,
            'what_she_wanted' => 'Full glam look',
            'the_install' => [
                ['image' => $installImg, 'tag' => 'Step 1'],
            ],
        ], ['Accept' => 'application/json'])
            ->assertCreated();

        $bgUrl = $res->json('data.background_image');
        $vidUrl = $res->json('data.video');
        $installUrl = $res->json('data.the_install.0.image');

        $this->assertNotEmpty($bgUrl);
        $this->assertNotEmpty($vidUrl);
        $this->assertNotEmpty($installUrl);
    }

    public function test_public_can_filter_products_by_category_variations(): void
    {
        $this->seed(\Database\Seeders\ProductSeeder::class);

        $this->getJson('/api/products?category=wig')
            ->assertOk()
            ->assertJsonCount(10, 'data');

        $this->getJson('/api/products?category=Wigs')
            ->assertOk()
            ->assertJsonCount(10, 'data');
    }
}
