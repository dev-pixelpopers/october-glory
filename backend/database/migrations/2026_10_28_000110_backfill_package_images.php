<?php

use Database\Seeders\PackageImages;
use Illuminate\Database\Migrations\Migration;

/**
 * Give existing packages their photo (see Database\Seeders\PackageImages).
 * Only fills packages with no image, so it is safe to re-run and never
 * overrides an image set in the dashboard. Packages the seeder creates later
 * get theirs from the same map.
 */
return new class extends Migration
{
    public function up(): void
    {
        PackageImages::apply();
    }

    /** Images are left in place; dropping the column (previous migration) removes them. */
    public function down(): void {}
};
