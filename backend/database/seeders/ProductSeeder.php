<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Seed the products table with the 10 October Glory custom units
     * from src/data/units.ts, including showcase narrative fields, video,
     * background image, and the install stages.
     */
    public function run(): void
    {
        $defaultInstall = [
            ['image' => '/images/naturalStyle1.webp', 'tag' => 'Before'],
            ['image' => '/images/braiddown.jpg', 'tag' => 'Braided down'],
            ['image' => '/images/SilkPress-01.webp', 'tag' => 'After'],
        ];

        $units = [
            [
                'name' => 'Tiffany',
                'slug' => 'tiffany',
                'length' => '22 inch',
                'texture' => 'Wavy',
                'color' => 'Jet black',
                'price' => 1800,
                'tags' => ['wavy'],
                'is_featured' => false,
                'what_she_wanted' => 'Tiffany wanted length she could actually live in. She had worn long units before and spent the day pushing them back off her face — by the afternoon the hairline had shifted and she knew it, which meant she never quite stopped thinking about her hair.',
                'what_we_built' => 'Twenty-two inches of wavy hair in its own jet black, with no lift and no colour processing at all, so the cuticle stays intact and the length does not matt at the nape by week three. The cap was measured over her finished braid pattern rather than a bare head, because that is the shape it has to hold all day.',
                'how_she_wears_it' => 'She wears it down and parted off-centre most days, and wraps it at night to keep the wave from flattening on one side. We see her roughly every six weeks to lift it, clean underneath and reset the perimeter.',
            ],
            [
                'name' => 'Samantha',
                'slug' => 'samantha',
                'length' => '12 inch',
                'texture' => 'Bob',
                'color' => 'Blonde ombré',
                'price' => 1750,
                'tags' => ['styles'],
                'is_featured' => false,
                'what_she_wanted' => 'Samantha had worn her hair long for years and wanted to see herself with a bob before committing scissors to her own. A bob was the whole point, so it had to read as a real cut rather than as a short wig.',
                'what_we_built' => 'Twelve inches is unforgiving — there is no length to hide a cap edge behind, so the fit had to be exact and the hairline became the most careful part of the build. The blonde ombré was kept soft and low at the root, with the lift concentrated through the last few inches where the cut moves most.',
                'how_she_wears_it' => 'She wears it blunt and tucked behind one ear, and it takes her a few minutes in the morning instead of the half hour her own length used to. She still has not cut her own hair.',
            ],
            [
                'name' => 'Tricia',
                'slug' => 'tricia',
                'length' => '24 inch',
                'texture' => 'Wavy',
                'color' => 'Chocolate chestnut balayage',
                'price' => 2450,
                'tags' => ['wavy', 'hot'],
                'is_featured' => true,
                'what_she_wanted' => 'Tricia came in with a photo and one condition: long, but warm — nothing flat or one-note. She had been let down before by colour that looked rich in the salon and turned brassy a few washes later.',
                'what_we_built' => 'Twenty-four inches, the longest unit we have built, in chocolate chestnut balayage painted onto the unit before it ever went on her head. Doing it in that order lets us follow the finished cut instead of guessing at it, so the lightest pieces land where the hair actually falls.',
                'how_she_wears_it' => 'She wears it with a deep side part so the balayage catches on the heavier side. Length like that needs looking after: she keeps it braided at night, and she is back for a tone refresh before the warmth starts to drift.',
            ],
            [
                'name' => 'Kelly',
                'slug' => 'kelly',
                'length' => '16 inch',
                'texture' => 'Curly',
                'color' => 'Natural black',
                'price' => 1500,
                'tags' => ['volume'],
                'is_featured' => false,
                'what_she_wanted' => 'Kelly did not want to look like she was wearing anything. She wanted her own hair on its best day — the version she gets once in a while when the weather is right and everything behaves.',
                'what_we_built' => 'Sixteen inches of curly hair in natural black, chosen by matching the curl pattern to her own rather than by picking a number off a chart. That match is the entire job on a unit like this. The cut was done dry and on her head, so the shape sits the way her curls actually sit.',
                'how_she_wears_it' => 'She refreshes it with water and a light cream and otherwise leaves it alone, which is exactly what she asked for. Most people assume it is hers, and she has stopped correcting them.',
            ],
            [
                'name' => 'Amanda',
                'slug' => 'amanda',
                'length' => '16 inch',
                'texture' => 'Wavy',
                'color' => 'Honey blonde, twice highlighted',
                'price' => 2400,
                'tags' => ['wavy'],
                'is_featured' => true,
                'what_she_wanted' => 'Amanda wanted honey blonde and had been talked out of it twice before by stylists worried about what the lift would do to her own hair. The unit was the answer to that: the colour happens to the unit, not to her.',
                'what_we_built' => 'Sixteen inches, wavy, taken to honey across two separate highlighting passes with a rest in between. One pass would have got there faster and left the ends brittle; two gets a cleaner blonde that still has something to hold onto when it is styled.',
                'how_she_wears_it' => 'She wears it with a slight bend rather than a full wave, and uses purple shampoo sparingly — on a unit, overdoing it dulls the honey instead of brightening it. Her own hair underneath has never been near bleach.',
            ],
            [
                'name' => 'Amber',
                'slug' => 'amber',
                'length' => '16 inch',
                'texture' => 'Wavy',
                'color' => 'Honey blonde balayage',
                'price' => 1650,
                'tags' => ['wavy'],
                'is_featured' => false,
                'what_she_wanted' => 'Amber liked the same honey family as the blondes she had been shown, but not the upkeep that came with them. She wanted something that would grow out gracefully instead of announcing itself at the root every few weeks.',
                'what_we_built' => 'Sixteen inches, wavy, hand-painted as a balayage rather than foiled — the lift starts low and deliberately uneven, so there is no line to chase later. It arrives at much the same honey as a highlighted unit, by a route that softens as it grows rather than resetting.',
                'how_she_wears_it' => 'She stretches her appointments further than most of our colour clients, because on this unit the grow-out works in her favour. A tone every couple of months keeps it from going warm, and that is about the whole of it.',
            ],
            [
                'name' => 'Payton',
                'slug' => 'payton',
                'length' => '20 inch',
                'texture' => 'Wavy',
                'color' => 'Teddy bear brown highlights',
                'price' => 2350,
                'tags' => ['wavy', 'new'],
                'is_featured' => false,
                'what_she_wanted' => 'Payton asked for brown with warmth in it and used the phrase teddy bear, which turned out to be exactly right. Everything she had tried before came out either flat brown or unmistakably ginger.',
                'what_we_built' => 'Twenty inches, wavy, built on a warm brown base with highlights ribboned through in fine sections rather than in blocks. The ribboning is what keeps it reading as depth instead of as stripes once the hair moves.',
                'how_she_wears_it' => 'She wears it with a loose wave that lets the ribboning show, and it photographs far better than the solid brown she had before. She is in every six to eight weeks to keep the warmth honest.',
            ],
            [
                'name' => 'Sunday',
                'slug' => 'sunday',
                'length' => '18 inch',
                'texture' => 'Wavy',
                'color' => 'Natural black',
                'price' => 1600,
                'tags' => ['wavy'],
                'is_featured' => false,
                'what_she_wanted' => 'Sunday wanted the opposite of a project. Something she could put on, wear all week and not think about: middle length, no colour, nothing to maintain beyond the basics.',
                'what_we_built' => 'Eighteen inches, wavy, natural black — and that is deliberately the entire specification. With no colour process in it the hair keeps its strength, takes heat well on the days she wants it straighter, and goes back to its wave after a wash.',
                'how_she_wears_it' => 'She wears it straight through the week and lets the wave come back at the weekend. It is the lowest-maintenance unit on this page, which is precisely what she booked.',
            ],
            [
                'name' => 'Phoebe',
                'slug' => 'phoebe',
                'length' => '22 inch',
                'texture' => 'Curly',
                'color' => 'Jet black',
                'price' => 1850,
                'tags' => ['volume'],
                'is_featured' => false,
                'what_she_wanted' => 'Phoebe wanted long and curly together, which is the combination most people get quietly talked out of. Curls shrink, long curls tangle, and most units built to that brief have been cut short within a month.',
                'what_we_built' => 'Twenty-two inches of curly hair in jet black, with the length measured stretched rather than at rest so it still reads long once the curl pulls up. The cut was shaped in sections to take weight out of the middle, because a long curly unit gives out at the back long before it gives out at the front.',
                'how_she_wears_it' => 'She refreshes it in sections and sleeps in a bonnet without exception — at this length and this texture that is not optional. In return she has kept the full length, which is rarer than it sounds.',
            ],
            [
                'name' => 'Becka',
                'slug' => 'becka',
                'length' => '20 inch',
                'texture' => 'Wavy',
                'color' => 'Chestnut ash blonde ombré',
                'price' => 2200,
                'tags' => ['wavy', 'new'],
                'is_featured' => false,
                'what_she_wanted' => 'Becka wanted cool, not golden. She had seen enough ombrés drop warm after a few weeks and wanted to know how we would stop that happening before she booked anything.',
                'what_we_built' => 'Twenty inches, wavy, chestnut through the top falling into an ash blonde at the ends. Ash over a dark base is the hardest colour on this page to hold: it needs a cleaner lift before any toner goes near it, and that is the step that gets skipped when a result turns brassy.',
                'how_she_wears_it' => 'She tones it on a schedule instead of waiting for it to turn, which is the only thing that keeps ash looking like ash. Worn straight it shows the fall from chestnut to blonde most clearly, and straight is how she wears it.',
            ],
        ];

        foreach ($units as $position => $u) {
            $name = $u['name'];
            $slug = $u['slug'];
            $image = "/images/{$name}.png";
            $video = "/images/{$name}.mp4";

            Product::updateOrCreate(
                ['slug' => $slug],
                [
                    'name' => $name,
                    'category' => 'Wigs',
                    'description' => "Custom October Glory unit — {$u['length']}, " . strtolower($u['texture']) . ", {$u['color']}.",
                    'image' => $image,
                    'gallery' => [$image],
                    'background_image' => $image,
                    'price' => $u['price'],
                    'tags' => $u['tags'],
                    'length' => $u['length'],
                    'texture' => $u['texture'],
                    'color' => $u['color'],
                    'what_she_wanted' => $u['what_she_wanted'],
                    'what_we_built' => $u['what_we_built'],
                    'how_she_wears_it' => $u['how_she_wears_it'],
                    'video' => $video,
                    'the_install' => $defaultInstall,
                    'is_featured' => $u['is_featured'],
                    'is_active' => true,
                    'sort_order' => $position,
                ]
            );
        }
    }
}
