<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('background_image')->nullable()->after('image');
            $table->text('what_she_wanted')->nullable()->after('color');
            $table->text('what_we_built')->nullable()->after('what_she_wanted');
            $table->text('how_she_wears_it')->nullable()->after('what_we_built');
            $table->string('video')->nullable()->after('how_she_wears_it');
            $table->json('the_install')->nullable()->after('video');
        });
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'background_image',
                'what_she_wanted',
                'what_we_built',
                'how_she_wears_it',
                'video',
                'the_install',
            ]);
        });
    }
};
