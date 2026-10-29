<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            // A path served by the Next.js site (e.g. /images/GLORIOUS-PACKAGES-01.webp) or a full URL.
            $table->string('image', 2048)->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('packages', function (Blueprint $table) {
            $table->dropColumn('image');
        });
    }
};
