<?php

namespace Database\Seeders;

/**
 * The salon catalog exactly as the website shows it — the single source the
 * catalog migrations build from.
 *
 * Mirrored from the Next.js site's data:
 *   - Categories: one per page. Service categories are the main service pages
 *     (src/data/services/parents.ts, slug = the /services/<slug> URL) plus
 *     Wigs; package categories are the three package pages.
 *   - Services: every sub-service on those pages (src/data/services/children.ts)
 *     at the price its card shows, plus Silk Press itself, which its page
 *     prices at $100. A sub-service whose page shows no price is "by
 *     consultation". The site gives no durations, so these carry over from the
 *     previous catalog.
 *   - Packages: the Maintenance, Glorious and Bridal package pages.
 *
 * Image paths are case-exact files in public/images.
 */
class SiteCatalog
{
    /** slug => [name, kind, image, position]. */
    public const CATEGORIES = [
        // Main service pages, in the site's order.
        'silk-press' => ['Silk Press', 'services', '/images/silk-press-card-img.jpg', 1],
        'relaxers-and-colors' => ['Relaxers & Colors', 'services', '/images/relaxers-card-img.jpg', 2],
        'weaves' => ['Weaves', 'services', '/images/Weaves-And-Extensions-02.webp', 3],
        'extensions' => ['Extensions', 'services', '/images/Weaves-And-Extensions-01.webp', 4],
        'haircuts-and-styles' => ['Haircuts & Styles', 'services', '/images/haircuts1.webp', 5],
        'treatments' => ['Treatments', 'services', '/images/hairsclapimg.webp', 6],
        'wigs' => ['Wigs', 'services', '/images/waves1.webp', 7],
        // Package pages.
        'maintenance-packages' => ['Maintenance Packages', 'packages', '/images/servicce.png', 8],
        'glorious-packages' => ['Glorious Packages', 'packages', '/images/GLORIOUS-PACKAGES-01.webp', 9],
        'bridal-packages' => ['Bridal Packages', 'packages', '/images/BRIDAL-PACKAGE-010.webp', 10],
    ];

    /**
     * [category slug, service slug, name, price (null = by consultation), minutes, image, description].
     * Listed in the order each page shows them.
     */
    public const SERVICES = [
        // /services/silk-press — the service itself, then its sub-services.
        ['silk-press', 'silk-press', 'Silk Press', '100.00', 90, '/images/silk-press-card-img.jpg', 'Sleek, smooth, chemical-free styling — a deep cleanse, conditioning and a professional press.'],
        ['silk-press', 'rodset', 'Rodset', '120.00', 90, '/images/RodSet-01.webp', 'A heat-conscious alternative to traditional curling — uniform, smooth definition from root to tip.'],
        ['silk-press', 'flat-twist', 'Flat Twist', '125.00', 90, '/images/FlatTwist.jpg', 'A sculpted, low-tension protective style that lies flat to the scalp and unravels into soft definition.'],
        ['silk-press', 'wash-and-go', 'Wash & Go', '50.00', 45, '/images/wash&go.jpg', 'Your natural curl pattern, cleansed, defined and finished — the simplest way to wear your texture.'],
        ['silk-press', 'braid-down', 'Braid Down', '125.00', 60, '/images/braiddown.jpg', 'A neat, close braided foundation — worn on its own, or set as the base for an install.'],
        ['silk-press', '2-strand-twist', '2 Strand Twist', '125.00', 120, '/images/2-strand-twist.jpg', 'Rope twists through the full length — a protective style that doubles as a twist-out.'],
        ['silk-press', 'natural-updo', 'Natural Updo', '75.00', 60, '/images/naturalfrenchroll.jpg', 'A sculpted, occasion-ready style built entirely from your own natural texture.'],

        // /services/relaxers-and-colors
        ['relaxers-and-colors', 'relaxer-touch-up', 'Relaxer Touch Up', '100.00', 90, '/images/relaxers-colors-01.webp', null],
        ['relaxers-and-colors', 'virgin-relaxer', 'Virgin Relaxer', '225.00', 150, '/images/relaxers-colors-02.webp', null],
        ['relaxers-and-colors', 'color-retouch', 'Color Retouch', '125.00', 90, '/images/relaxers-colors-03.webp', null],
        ['relaxers-and-colors', 'single-process', 'Single Process', '120.00', 90, '/images/relaxers-colors-04.webp', null],
        ['relaxers-and-colors', 'double-process', 'Double Process', '350.00', 180, '/images/relaxers-colors-05.webp', null],
        ['relaxers-and-colors', 'half-head-highlights', 'Half-Head Highlights', '160.00', 120, '/images/relaxers-colors-06.webp', null],
        ['relaxers-and-colors', 'full-highlights-or-foilayage', 'Full Highlights Or Foilayage', '300.00', 180, '/images/relaxers-colors-07.webp', null],
        ['relaxers-and-colors', 'crown-lights', 'Crown Lights', '85.00', 90, '/images/relaxers-colors-08.webp', null],
        ['relaxers-and-colors', 'color-correction', 'Color Correction', '250.00', 240, '/images/relaxers-colors-09.webp', null],
        ['relaxers-and-colors', 'glorious-boost', 'Glorious Boost', '120.00', 60, '/images/GLORIOUS-PACKAGES-03.webp', null],

        // /services/weaves — no prices shown on the page.
        ['weaves', 'full-weave-with-leave-out', 'Full Weave w/ Leave Out', null, 210, '/images/Weaves-And-Extensions-02.webp', null],
        ['weaves', 'full-head-weave', 'Full-Head Weave', null, 240, '/images/Weaves-And-Extensions-03.webp', null],

        // /services/extensions
        ['extensions', 'single-track', 'Single Track', null, 60, '/images/Weaves-And-Extensions-01.webp', null],
        ['extensions', 'wig-prep', 'Wig Prep', '120.00', 60, '/images/GLORIOUS-PACKAGES-04.webp', null],

        // /services/haircuts-and-styles
        ['haircuts-and-styles', 'ponytail-and-updo', 'Ponytail & Updo', null, 60, '/images/Haircuts-And-Styles-02.webp', 'Updo hairstyles designed to elevate every occasion.'],
        ['haircuts-and-styles', 'glory-girl-precision-cut', 'Glory-Girl Precision Cut', '150.00', 75, '/images/Haircuts-And-Styles-03.webp', null],
        ['haircuts-and-styles', 'weave-precision-cut', 'Weave Precision Cut', '100.00', 60, '/images/Haircuts-And-Styles-04.webp', null],
        ['haircuts-and-styles', 'haircut-only', 'Haircut Only', '75.00', 45, '/images/Haircuts-And-Styles-05.webp', null],
        ['haircuts-and-styles', 'haircut-and-finish', 'Haircut & Finish', '125.00', 75, '/images/Haircuts-And-Styles-06.webp', null],
        ['haircuts-and-styles', 'new-look-haircut', 'New Look Haircut', '120.00', 75, '/images/Haircuts-And-Styles-07.webp', null],
        ['haircuts-and-styles', 'pro-consult', 'Pro Consult', '50.00', 30, '/images/salon-image.webp', null],

        // /services/treatments
        ['treatments', 'scalp-relief', 'Scalp Relief', '50.00', 45, '/images/TREATMENTS-01.webp', null],
        ['treatments', 'the-upmost-hydration', 'The Upmost Hydration', '50.00', 45, '/images/TREATMENTS-02.webp', null],
        ['treatments', 'protein-moisture-pack', 'Protein Moisture Pack', '55.00', 45, '/images/TREATMENTS-03.webp', null],
        ['treatments', 'bond-builder', 'Bond Builder', '65.00', 45, '/images/TREATMENTS-04.webp', null],

        // Wigs (/old-wig) — no prices shown.
        ['wigs', 'wig-design-and-consult', 'Wig Design & Consult', null, 60, '/images/Weaves-And-Extensions-04.webp', 'More than purchasing a wig — a personalized experience created entirely around you.'],
        ['wigs', 'wig-wash', 'Wig Wash', null, 45, '/images/Weaves-And-Extensions-05-06-07.webp', null],
        ['wigs', 'wig-tighten', 'Wig Tighten', null, 45, '/images/Weaves-And-Extensions-08.webp', null],
    ];

    /**
     * Packages, by the page that shows them. `services` are the site services
     * a package is built on (slugs above); `price` is the package's own price.
     */
    public const PACKAGES = [
        // /maintenance-packages
        [
            'category' => 'maintenance-packages',
            'collection' => 'maintenance',
            'slug' => 'the-glorious-wig-package',
            'name' => 'The Glorious Wig Package',
            'tagline' => 'Complete Care for Your Wig & Natural Hair',
            'is_featured' => true,
            'price' => '200.00',
            'image' => '/images/Weaves-And-Extensions-04.webp',
            'includes' => [
                "A professional wig wash and restyle to restore your unit's original beauty, softness, and shape",
                'A thorough cleanse of your natural hair and scalp',
                "A personalized spa treatment based on your hair's needs, including moisture, protein, or scalp therapy to promote healthier hair",
                'A precision trim to remove split or damaged ends',
                'Professional braiding to create a secure, comfortable foundation',
                'A complete wig reinstall using your freshly cleaned and styled custom unit',
            ],
            'not_included' => null,
            'best_for' => 'Clients who want the highest level of maintenance at every visit, including regular treatments and trims, to keep both their custom wig and natural hair in excellent condition for long-term wear.',
            'services' => ['wig-wash', 'braid-down'],
        ],
        [
            'category' => 'maintenance-packages',
            'collection' => 'maintenance',
            'slug' => 'the-signature-wig-package',
            'name' => 'The Signature Wig Package',
            'tagline' => 'Routine Care to Keep Your Wig Looking Its Best',
            'is_featured' => false,
            'price' => '150.00',
            'image' => '/images/Weaves-And-Extensions-05-06-07.webp',
            'includes' => [
                "A professional wig wash and restyle to restore your unit's shape, softness, and natural appearance",
                'A thorough cleanse of your natural hair and scalp',
                'A personalized spa treatment based on a complete scalp and hair assessment, using moisture, protein, or scalp care treatments as needed',
                'Professional braiding to prepare your natural hair for reinstallation',
                'Reinstalling your freshly cleaned and styled wig',
            ],
            'not_included' => 'A precision trim is not included with this package. Since trims are typically recommended every three months rather than at every monthly maintenance visit, this option is ideal for keeping your hair healthy between trim appointments.',
            'best_for' => 'Clients following a regular monthly maintenance routine who want professional care for both their custom wig and natural hair, without needing a trim at every visit.',
            'services' => ['wig-wash', 'braid-down'],
        ],
        [
            'category' => 'maintenance-packages',
            'collection' => 'maintenance',
            'slug' => 'the-introductory-wig-package',
            'name' => 'The Introductory Wig Package',
            'tagline' => 'Essential Maintenance for Everyday Wig Care',
            'is_featured' => false,
            'price' => '120.00',
            'image' => '/images/Weaves-And-Extensions-08.webp',
            'includes' => [
                'A professional wash and restyle of your wig',
                'A thorough cleanse of your natural hair and scalp',
                'Expert braiding to create a secure foundation for your reinstall',
                'A professional wig reinstall using your freshly cleaned and styled unit',
            ],
            'not_included' => "This package does not include a customized spa treatment or precision trim. It's designed as a straightforward maintenance service for clients who don't require deeper treatments during every appointment.",
            'best_for' => 'Clients looking for reliable, routine wig maintenance at an accessible price point, or those who alternate this package with more comprehensive maintenance services throughout the year.',
            'services' => ['wig-wash', 'braid-down'],
        ],

        // /glorious-packages
        [
            'category' => 'glorious-packages', 'collection' => 'glorious',
            'slug' => 'glorious-rodset', 'name' => 'Glorious Rodset',
            'tagline' => 'A luxury rodset, spa-treated end to end.', 'is_featured' => false,
            'price' => '230.00', 'image' => '/images/GLORIOUS-PACKAGES-01.webp',
            'includes' => [], 'not_included' => null, 'best_for' => null,
            'services' => ['rodset'],
        ],
        [
            'category' => 'glorious-packages', 'collection' => 'glorious',
            'slug' => 'glorious-silk-press', 'name' => 'Glorious Silk Press',
            'tagline' => 'Silk press with the full spa treatment and a trim.', 'is_featured' => false,
            'price' => '245.00', 'image' => '/images/GLORIOUS-PACKAGES-02.webp',
            'includes' => [], 'not_included' => null, 'best_for' => null,
            'services' => ['silk-press'],
        ],
        [
            'category' => 'glorious-packages', 'collection' => 'glorious',
            'slug' => 'glorious-boost', 'name' => 'Glorious Boost',
            'tagline' => 'A restorative treatment duo for stressed strands.', 'is_featured' => false,
            'price' => '120.00', 'image' => '/images/GLORIOUS-PACKAGES-03.webp',
            'includes' => [], 'not_included' => null, 'best_for' => null,
            'services' => ['protein-moisture-pack', 'bond-builder'],
        ],
        [
            'category' => 'glorious-packages', 'collection' => 'glorious',
            'slug' => 'wig-prep', 'name' => 'Wig Prep',
            'tagline' => 'Braid-down and prep, ready for your unit.', 'is_featured' => false,
            'price' => '120.00', 'image' => '/images/GLORIOUS-PACKAGES-04.webp',
            'includes' => [], 'not_included' => null, 'best_for' => null,
            'services' => ['wig-prep'],
        ],

        // /bridal-packages — flat prices, not built from services.
        [
            'category' => 'bridal-packages', 'collection' => 'bridal',
            'slug' => 'bride-trial-appointment', 'name' => 'Bride Trial Appointment',
            'tagline' => 'A trial run of your wedding day look.', 'is_featured' => false,
            'price' => '200.00', 'image' => '/images/bridal-slider-01.webp',
            'includes' => [], 'not_included' => null, 'best_for' => null, 'services' => [],
        ],
        [
            'category' => 'bridal-packages', 'collection' => 'bridal',
            'slug' => 'bridesmaids-trial-appointment', 'name' => "Bridesmaid's Trial Appointment",
            'tagline' => 'A trial run of the bridal party look.', 'is_featured' => false,
            'price' => '150.00', 'image' => '/images/bridal-slider-02.webp',
            'includes' => [], 'not_included' => null, 'best_for' => null, 'services' => [],
        ],
        [
            'category' => 'bridal-packages', 'collection' => 'bridal',
            'slug' => 'full-day', 'name' => 'Full Day',
            'tagline' => 'Bridal hair styling for the full wedding day.', 'is_featured' => false,
            'price' => '2400.00', 'image' => '/images/BRIDAL-PACKAGE-010.webp',
            'includes' => [], 'not_included' => null, 'best_for' => null, 'services' => [],
        ],
        [
            'category' => 'bridal-packages', 'collection' => 'bridal',
            'slug' => 'half-day', 'name' => 'Half Day',
            'tagline' => 'Bridal hair styling for half of the wedding day.', 'is_featured' => false,
            'price' => '1200.00', 'image' => '/images/bridal-slider-03.webp',
            'includes' => [], 'not_included' => null, 'best_for' => null, 'services' => [],
        ],
    ];
}
