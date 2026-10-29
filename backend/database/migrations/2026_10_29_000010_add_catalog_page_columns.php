<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Lets the catalog mirror the website's pages:
 * - categories get an image, a kind (a service page or a package page) and
 *   the order the site lists them in;
 * - services get a slug matching the site's page URL (/services/<category>/<slug>)
 *   and the order their page lists them in.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('service_categories', function (Blueprint $table) {
            $table->string('image', 2048)->nullable()->after('slug');
            $table->string('kind', 20)->default('services')->after('image'); // services | packages
            $table->unsignedInteger('sort_order')->default(0)->after('kind');
        });

        Schema::table('services', function (Blueprint $table) {
            $table->string('slug')->nullable()->unique()->after('name');
            $table->unsignedInteger('sort_order')->default(0)->after('is_active');
        });
    }

    public function down(): void
    {
        Schema::table('services', function (Blueprint $table) {
            $table->dropUnique(['slug']);
            $table->dropColumn(['slug', 'sort_order']);
        });

        Schema::table('service_categories', function (Blueprint $table) {
            $table->dropColumn(['image', 'kind', 'sort_order']);
        });
    }
};
