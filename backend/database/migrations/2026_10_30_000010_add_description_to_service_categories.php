<?php

use App\Models\ServiceCategory;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * A short blurb per category — the line under its card in the site's
 * full-screen menu. Backfilled with the copy the menu showed until now, so the
 * panel reads the same until the salon edits it in the dashboard.
 */
return new class extends Migration
{
    private const DESCRIPTIONS = [
        'silk-press' => 'Sleek, smooth and salon-fresh — achieved with heat, tension and technique instead of chemicals.',
        'relaxers-and-colors' => 'Smooth relaxers and rich color transformations tailored to your personality and style.',
        'weaves' => 'Sew-in installs built on a custom braid foundation — leave-out or closure, finished with a cut made for your face.',
        'extensions' => 'Added length and volume, placed where your hair needs it and blended into your own so the join never shows.',
        'haircuts-and-styles' => 'Precision haircuts and modern styling crafted for every face shape and vibe.',
        'treatments' => 'Deep nourishment and repair treatments that restore health, shine, and strength.',
        'wigs' => 'Custom units and sew-in installs built on the health of your natural hair — and finished with a cut made for your face.',
        'maintenance-packages' => 'Regular care and upkeep to keep your custom unit fresh and your natural hair healthy underneath.',
        'glorious-packages' => 'Luxury bundled packages combining multiple premium salon services for complete care.',
        'bridal-packages' => 'Exclusive bridal experience ensuring flawless hair styling for your special day.',
    ];

    public function up(): void
    {
        Schema::table('service_categories', function (Blueprint $table) {
            $table->text('description')->nullable()->after('name');
        });

        foreach (self::DESCRIPTIONS as $slug => $description) {
            ServiceCategory::query()->where('slug', $slug)->whereNull('description')->update(['description' => $description]);
        }
    }

    public function down(): void
    {
        Schema::table('service_categories', function (Blueprint $table) {
            $table->dropColumn('description');
        });
    }
};
