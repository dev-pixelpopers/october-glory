<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

/**
 * Default photo for each service, drawn from images already in the site's
 * public/images folder (mostly each service page's card image in
 * src/data/services). Used by the backfill migration and the seeder.
 *
 * Paths are case-exact: production filesystems are case-sensitive, so
 * GLORIOUS-PACKAGES-04.webp must not be written glorious-packages-04.webp.
 */
class ServiceImages
{
    /** Service name => image path. */
    public const MAP = [
        // Chemical Services
        'Relaxer Retouch' => '/images/relaxers-colors-01.webp',
        'Virgin Relaxer' => '/images/relaxers-colors-02.webp',
        'Color Retouch' => '/images/relaxers-colors-03.webp',
        'Single Process' => '/images/relaxers-colors-04.webp',
        'Double Process' => '/images/relaxers-colors-05.webp',
        'Half Head Highlights' => '/images/relaxers-colors-06.webp',
        'Full Head Highlights' => '/images/relaxers-colors-07.webp',
        'Crown Lights' => '/images/relaxers-colors-08.webp',
        'Color Correction' => '/images/relaxers-colors-09.webp',
        'Face-Frame Highlights' => '/images/relaxers-colors-06.webp',
        'Virgin Color' => '/images/relaxers-card-img.jpg',

        // Natural Styles
        'Classic Silk Press' => '/images/silk-press-card-img.jpg',
        'Silk Press Plus' => '/images/SilkPress-01.webp',
        'The Glorious Silk Press' => '/images/GLORIOUS-PACKAGES-02.webp',
        'Rodset' => '/images/RodSet-01.webp',
        'Roller Set' => '/images/RodSet-01.webp',
        'Flat Twists or Two-Strand Twists' => '/images/FlatTwist.jpg',
        '2 Strand Twist' => '/images/2-strand-twist.jpg',
        'Wash & Go' => '/images/wash&go.jpg',
        'Braid Down' => '/images/braiddown.jpg',
        'Natural Updo' => '/images/naturalfrenchroll.jpg',
        'Styled Ponytail' => '/images/Haircuts-And-Styles-02.webp',
        'Trim Only' => '/images/trim-after.webp',

        // Haircuts & Styles
        'Ponytail & Updo' => '/images/Haircuts-And-Styles-02.webp',
        'Glory-Girl Precision Cut' => '/images/Haircuts-And-Styles-03.webp',
        'Weave Precision Cut' => '/images/Haircuts-And-Styles-04.webp',
        'Haircut Only' => '/images/Haircuts-And-Styles-05.webp',
        'Haircut & Finish' => '/images/Haircuts-And-Styles-06.webp',
        'New Look Haircut' => '/images/Haircuts-And-Styles-07.webp',
        'Pro Consult' => '/images/salon-image.webp',
        'Precision Trim' => '/images/trim-after.webp',

        // Treatments
        'Scalp Relief' => '/images/TREATMENTS-01.webp',
        'The Upmost Hydration' => '/images/TREATMENTS-02.webp',
        'Protein Moisture Pack' => '/images/TREATMENTS-03.webp',
        'Bond Builder' => '/images/TREATMENTS-04.webp',
        'Spa Treatment' => '/images/hairsclapimg.webp',

        // Wigs & Extensions
        'Single Track' => '/images/Weaves-And-Extensions-01.webp',
        'Classic Sew-In with Leave-Out' => '/images/Weaves-And-Extensions-02.webp',
        'The Glorious Sew-In' => '/images/Weaves-And-Extensions-02.webp',
        'Classic Closure Sew-In or Full Weave' => '/images/Weaves-And-Extensions-03.webp',
        'The Glorious Closure or Full Weave' => '/images/Weaves-And-Extensions-03.webp',
        'Weave Wash' => '/images/Weaves-And-Extensions-05-06-07.webp',
        'Custom Wig Design' => '/images/Weaves-And-Extensions-04.webp',
        'Wig Unit Consult' => '/images/Weaves-And-Extensions-04.webp',
        'Classic Custom Unit' => '/images/Weaves-And-Extensions-04.webp',
        'The Glorious Custom Unit' => '/images/Weaves-And-Extensions-04.webp',
        'Wig Prep' => '/images/GLORIOUS-PACKAGES-04.webp',
        'Wig Wash' => '/images/Weaves-And-Extensions-05-06-07.webp',
        'Wig Wash & Style' => '/images/Weaves-And-Extensions-05-06-07.webp',
        'Wig Tighten' => '/images/Weaves-And-Extensions-08.webp',
        'Wig Reinstall' => '/images/Weaves-And-Extensions-08.webp',
        'Wig Breakdown' => '/images/Weaves-And-Extensions-08.webp',
        'Wig Breakdown + Treatment' => '/images/Weaves-And-Extensions-08.webp',
        'Classic Wig Maintenance' => '/images/Weaves-And-Extensions-05-06-07.webp',
        'Wig Maintenance Plus' => '/images/Weaves-And-Extensions-05-06-07.webp',
        'The Glorious Wig Maintenance' => '/images/GLORIOUS-PACKAGES-04.webp',
        'Natural Hair Wash' => '/images/hairsclapimg.webp',
    ];

    /**
     * Give every listed service its default image — only where none is set,
     * so a photo the admin chose in the dashboard is never replaced.
     */
    public static function apply(): void
    {
        // Seeding before `php artisan migrate` has added the column: skip
        // rather than fail; the backfill migration fills them in later.
        if (! Schema::hasColumn('services', 'image')) {
            return;
        }

        foreach (self::MAP as $name => $image) {
            Service::query()
                ->where(DB::raw('LOWER(name)'), strtolower($name))
                ->whereNull('image')
                ->update(['image' => $image]);
        }
    }
}
