<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

/**
 * The ten October Glory units (src/data/units.ts) as shop products, priced
 * from the salon's unit gallery. A data migration rather than a seeder so
 * existing databases pick them up on `php artisan migrate`.
 */
return new class extends Migration
{
    /** [name, length, texture, color, price, tags] — in gallery order. */
    private const UNITS = [
        ['Tiffany', '22 inch', 'Wavy', 'Jet black', 1800, ['wavy']],
        ['Samantha', '12 inch', 'Bob', 'Blonde ombré', 1750, ['styles']],
        ['Tricia', '24 inch', 'Wavy', 'Chocolate chestnut balayage', 2450, ['wavy', 'hot']],
        ['Kelly', '16 inch', 'Curly', 'Natural black', 1500, ['volume']],
        ['Amanda', '16 inch', 'Wavy', 'Honey blonde, twice highlighted', 2400, ['wavy']],
        ['Amber', '16 inch', 'Wavy', 'Honey blonde balayage', 1650, ['wavy']],
        ['Payton', '20 inch', 'Wavy', 'Teddy bear brown highlights', 2350, ['wavy', 'new']],
        ['Sunday', '18 inch', 'Wavy', 'Natural black', 1600, ['wavy']],
        ['Phoebe', '22 inch', 'Curly', 'Jet black', 1850, ['volume']],
        ['Becka', '20 inch', 'Wavy', 'Chestnut ash blonde ombré', 2200, ['wavy', 'new']],
    ];

    /** The first two fill the menu's two-product Shop panel. */
    private const FEATURED = ['Tricia', 'Amanda'];

    public function up(): void
    {
        $now = now();

        foreach (self::UNITS as $position => [$name, $length, $texture, $color, $price, $tags]) {
            DB::table('products')->insert([
                'name' => $name,
                'slug' => strtolower($name),
                'category' => 'Wigs',
                'description' => "Custom October Glory unit — {$length}, ".strtolower($texture).", {$color}.",
                'image' => "/images/{$name}.png",
                'gallery' => json_encode(["/images/{$name}.png"]),
                'price' => $price,
                'tags' => json_encode($tags),
                'length' => $length,
                'texture' => $texture,
                'color' => $color,
                'is_featured' => in_array($name, self::FEATURED, true),
                'is_active' => true,
                'sort_order' => $position,
                'created_at' => $now,
                'updated_at' => $now,
            ]);
        }
    }

    public function down(): void
    {
        DB::table('products')
            ->whereIn('slug', array_map(fn ($u) => strtolower($u[0]), self::UNITS))
            ->delete();
    }
};
