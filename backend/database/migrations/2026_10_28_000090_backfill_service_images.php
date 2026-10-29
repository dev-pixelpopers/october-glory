<?php

use Database\Seeders\ServiceImages;
use Illuminate\Database\Migrations\Migration;

/**
 * Give existing services their photo from images already in public/images
 * (see Database\Seeders\ServiceImages). Only fills services with no image, so
 * it is safe to re-run and never overrides an image set in the dashboard.
 * Services created later by the seeder get theirs from the same map.
 */
return new class extends Migration
{
    public function up(): void
    {
        ServiceImages::apply();
    }

    /** Images are left in place; dropping the column (previous migration) removes them. */
    public function down(): void {}
};
