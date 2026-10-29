<?php

namespace Database\Seeders;

use App\Models\Package;
use Illuminate\Support\Facades\Schema;

/**
 * Default photo for each seeded package, from images already in the site's
 * public/images folder. Glorious packages use the photos the Glorious
 * Packages page shows for them; the maintenance packages have no dedicated
 * photography yet, so they use the wig-care images. Used by the backfill
 * migration and the seeder.
 *
 * Paths are case-exact: production filesystems are case-sensitive.
 */
class PackageImages
{
    /** Package slug => image path. */
    public const MAP = [
        // Glorious Packages page
        'glorious-rodset' => '/images/GLORIOUS-PACKAGES-01.webp',
        'glorious-silk-press' => '/images/GLORIOUS-PACKAGES-02.webp',
        'glorious-boost' => '/images/GLORIOUS-PACKAGES-03.webp',
        'wig-prep' => '/images/GLORIOUS-PACKAGES-04.webp',

        // Maintenance Packages page
        'the-glorious-wig-package' => '/images/Weaves-And-Extensions-04.webp',
        'the-signature-wig-package' => '/images/Weaves-And-Extensions-05-06-07.webp',
        'the-introductory-wig-package' => '/images/Weaves-And-Extensions-08.webp',

        // Bridal Packages page — its slider photos
        'bride-trial-appointment' => '/images/bridal-slider-01.webp',
        'bridesmaids-trial-appointment' => '/images/bridal-slider-02.webp',
        'full-day' => '/images/BRIDAL-PACKAGE-010.webp',
        'half-day' => '/images/bridal-slider-03.webp',
    ];

    /** Fill in images only where none is set, so dashboard choices are kept. */
    public static function apply(): void
    {
        // Seeding before `php artisan migrate` has added the column: skip.
        if (! Schema::hasColumn('packages', 'image')) {
            return;
        }

        foreach (self::MAP as $slug => $image) {
            Package::query()->where('slug', $slug)->whereNull('image')->update(['image' => $image]);
        }
    }
}
