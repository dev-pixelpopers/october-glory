<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('slug')->unique();
            // Shop grouping, e.g. "Wigs", "Hair Care", "Accessories".
            $table->string('category')->nullable();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->json('gallery')->nullable();
            $table->decimal('price', 10, 2);
            // Shop filter tags, e.g. ["wavy", "new"].
            $table->json('tags')->nullable();
            // Unit spec for wigs; null for other products.
            $table->string('length')->nullable();
            $table->string('texture')->nullable();
            $table->string('color')->nullable();
            // Featured in the full-screen menu's Shop panel.
            $table->boolean('is_featured')->default(false);
            $table->boolean('is_active')->default(true);
            $table->unsignedInteger('sort_order')->default(0);
            $table->timestamps();

            $table->index(['is_active', 'sort_order']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
