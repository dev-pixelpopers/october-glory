<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('service_categories', function (Blueprint $table) {
            // 1. Drop the existing single-column unique constraint on slug
            $table->dropUnique('service_categories_slug_unique');

            // 2. Add the compound unique constraint for [kind, slug]
            $table->unique(['kind', 'slug']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('service_categories', function (Blueprint $table) {
            // 1. Drop the compound unique constraint
            $table->dropUnique(['kind', 'slug']);

            // 2. Restore the original single-column unique constraint on slug
            $table->unique('slug');
        });
    }
};
