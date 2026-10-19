/**
 * The Silk Press showcase page, served at /silk-press-new.
 *
 * A second premier-service page alongside October Glory Units, built to the
 * client's own direction (her emailed section order and her page mockup) with
 * the sections the wig section established — plus the packages, which the
 * units side has no equivalent of.
 *
 * The existing service page at /services/silk-press is untouched. Nothing
 * here reads from it; when this page is approved, that one can be parked the
 * way /old-wig was.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  WHAT IS REAL AND WHAT IS PLACEHOLDER
 *
 *  REAL — the salon's own words and pictures:
 *    every heading and body paragraph below (from the client's mockup),
 *    the three package names and their contents,
 *    /images/silk-press-before.png and /images/silk-press-after.png,
 *    the e-book cover and its copy.
 *
 *  PLACEHOLDER — needs the Canva export:
 *    `process.video`   the real start-to-finish clip (1:40)
 *    `finish.video`    the ~22s finished-look clip
 *    `steps[].image`   one still per stage
 *    `hero.image`, `why.image`  the professional shoot
 *
 *  Prices are intentionally unset: the client has not confirmed them, and a
 *  guessed price on a booking page is worse than no price.
 * ─────────────────────────────────────────────────────────────────────────
 */

export type PressPillar = {
  title: string;
  body: string;
};

export type PressPackage = {
  name: string;
  /** Unset until the salon confirms pricing. */
  price?: string;
  includes: string[];
  /** The full reset — drawn as the dark card. */
  featured?: boolean;
  badge?: string;
};

export const silkPressPage = {
  meta: {
    title: "The Glorious Silk Press | October Glory",
    description:
      "The Glorious Silk Press at October Glory in Brooklyn — our signature method for straight, silky hair without compromising your curls. See the process, the results, and the three ways to book it.",
  },

  hero: {
    eyebrow: "Premier Service",
    display: "The Glorious",
    script: "Silk Press",
    intro:
      "Our signature method for straight, silky hair without compromising your curls.",
    /** PLACEHOLDER — replace with the professional shoot. */
    image: "/images/SilkPress-01.webp",
  },

  /**
   * The process: the start-to-finish clip and the four stages it shows,
   * driven by the same scroll-led section as the Units page.
   *
   * No `at` cue points yet — the real clip has not been supplied, so the
   * stages divide the placeholder evenly. Add `at` in seconds to each step
   * once the footage is timed, exactly as the units steps carry theirs.
   */
  install: {
    eyebrow: "The Process",
    heading: "The October Glory",
    headingAccent: "Silk Press Process",
    intro:
      "Four stages, start to finish. Every one of them is about doing less to the hair by the time the iron comes out.",
    /** PLACEHOLDER — replace with the Canva start-to-finish clip (1:40). */
    video: "/images/silk-press-process.mp4",
    steps: [
      {
        title: "The Wash",
        body: "Laying the foundation. Scalp exfoliation, a sectioned double cleanse and conditioning focused on the hair — a clean scalp is the secret to movement and shine.",
        image: "/images/braiddown.jpg",
      },
      {
        title: "The Mold",
        body: "Setting the stage. Detangle, stretch and braid in sections, set the part and edges under the dryer. Proper molding reduces the heat needed later.",
        image: "/images/naturalStyle1.webp",
      },
      {
        title: "The Blow-Dry",
        body: "The power move. Tension and downward airflow until the hair is nearly straight before the iron comes out — the less the flat iron does, the healthier your hair.",
        image: "/images/silk-press-img.png",
      },
      {
        title: "The Press",
        body: "The signature finish. Small sections, controlled temperature, one pass, then a styling pass for bounce. Silky shine without sacrificing hair health.",
        image: "/images/silk-press-after.png",
      },
    ],
  },

  transformation: {
    eyebrow: "The Transformation",
    heading: "Transformations that speak",
    headingAccent: "for themselves",
    before: {
      image: "/images/silk-press-before.png",
      label: "Before",
      caption: "Natural texture",
    },
    after: {
      image: "/images/silk-press-after.png",
      label: "After",
      caption: "Real results from our signature technique",
    },
  },

  finish: {
    eyebrow: "The Finish",
    heading: "Soft. Bouncy.",
    headingAccent: "Full of life.",
    body: [
      "Straight, shiny and full of movement, without permanently altering your curl pattern.",
    ],
    /** PLACEHOLDER — replace with the ~22s finished-look clip. */
    video: "/images/video-5.webm",
    image: "/images/silk-press-after.png",
  },

  why: {
    eyebrow: "Why It Matters",
    heading: "We've refined the silk press",
    headingAccent: "into a science.",
    body: [
      "A silk press is a modern, non-chemical technique used to straighten natural, textured hair, especially type 3 and 4 curls, using a careful combination of heat tools and products. The goal is hair that's straight, shiny, soft and full of movement, without permanently altering your curl pattern.",
      "Unlike the “press and curl” methods, today's silk press relies on advanced products, steam treatments and precise temperature control to minimize heat damage and maximize shine.",
    ],
    /** PLACEHOLDER — replace with the professional shoot. */
    image: "/images/silk-press-img.png",
  },

  /** The four principles, from the e-book by way of the client's mockup. */
  pillars: [
    {
      title: "Scalp-First Philosophy",
      body: "Healthy hair begins at the root: careful cleansing, exfoliation and nourishment.",
    },
    {
      title: "Precision Sectioning",
      body: "Personalized to your texture, curl pattern and density for even heat and a polished finish.",
    },
    {
      title: "Minimal Heat, Maximum Results",
      body: "Thorough prep means less reliance on the flat iron and far less heat damage.",
    },
    {
      title: "Education & Empowerment",
      body: "You leave knowing how to care for your hair and preserve your style at home.",
    },
  ] satisfies PressPillar[],

  /** The e-book. Cover and copy are the salon's own. */
  ebook: {
    eyebrow: "Free Download",
    display: "The Glorious",
    script: "Silk Press",
    body: "Everything we tell our clients in the chair, written down — how to stretch your press between visits, what heat protection actually does, which products undo the work, and when a trim is overdue. Written by our stylists for hair like yours.",
    image: "/images/guide-silk.jpeg",
    cta: "Explore The E-Book",
    href: "#",
  },

  packages: {
    eyebrow: "Services & Packages",
    heading: "Choose your",
    headingAccent: "silk press",
    items: [
      {
        name: "The Classic Silk Press",
        includes: ["Signature silk press"],
      },
      {
        name: "The Classic Silk Press+",
        includes: ["Signature silk press", "Spa treatment"],
      },
      {
        name: "The Glorious Silk Press",
        badge: "The Full Reset",
        featured: true,
        includes: ["Signature silk press", "Spa treatment", "Trim"],
      },
    ] as PressPackage[],
    /** Shown under the cards while prices are outstanding. */
    note: "Pricing confirmed at booking.",
  },

  /**
   * The six natural styles currently parented to Silk Press in the service
   * data. They are not silk press variants, so they are listed as their own
   * thing rather than folded in — the equivalent of the unit catalogue on the
   * wig page, but honest about what they are. Drop this section if the client
   * would rather the page stayed on one subject.
   */
  styles: {
    eyebrow: "Also On Natural Hair",
    heading: "Styles we do",
    headingAccent: "between presses",
    intro:
      "A silk press is not the only way to wear your natural hair. These are booked on their own, and every one starts with the same wash and scalp care.",
  },

  cta: {
    display: "Reserve Your Space",
    heading: "Book Your Silk Press",
    body: "Tell us what your hair has been through and how you want to wear it, and your stylist will recommend the level of service that gets you there.",
  },

  /** The closing line from the client's mockup footer. */
  signoff: "Stay silky, stay Glorious!",
};
