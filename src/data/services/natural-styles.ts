import type { ServiceCategory, ServiceDetail } from "./types";

/**
 * Inner services for /natural-styles.
 *
 * Silk Press used to live here; it is now a top-level service in its own
 * right — see `./silk-press`.
 *
 * `rodset` is transcribed from the salon's own service document. The
 * remaining five follow the same Classic / +Spa Treatment / +Trim tier
 * structure that document establishes, and are draft copy pending the
 * client's final wording.
 */

const rodset: ServiceDetail = {
  slug: "rodset",
  cardTitle: "Rodset",
  price: "$120",
  hero: {
    display: "Rod",
    script: "Set",
    intro:
      "A heat-conscious alternative to traditional curling — uniform, smooth definition from root to tip.",
    image: "/images/RodSet-01.webp",
  },
  overview: {
    eyebrow: "The Service",
    heading: "Curl Definition, Without The Heat",
    body: [
      "A rod set is a beautiful, heat-conscious alternative to traditional curling methods. Instead of relying on hot tools to create curl definition, hair is wrapped around flexi rods or curl rods while wet, then dried in place — resulting in a uniform, smooth curl from root to tip.",
      "It's an ideal service for clients who want to give their hair a break from heat and tension, or who are dealing with heat damage, breakage, or uneven curl patterns and want one consistent, healthy curl texture throughout.",
      "Just like our silk press, the rod set is offered in multiple tiers, so clients can choose the level of service that best matches what their hair needs.",
    ],
    image: "/images/RodSet-01.webp",
  },
  tiers: {
    eyebrow: "Choose Your Experience",
    heading: "Rod Set Tiers",
    items: [
      {
        name: "Classic Rod Set",
        tagline: "Smooth, uniform curls without the extras.",
        includes: [
          "A thorough wash and cleanse of the hair to remove product buildup and prep the hair for setting",
          "Hair combed out and carefully sectioned to ensure even, consistent results throughout the whole head",
          "Small, precise sections wrapped around each rod, with end papers used on every section so the ends dry smooth instead of frizzy or bent",
          "Time under the dryer to fully set each curl — essential, since a rod set needs to dry completely to hold its shape and shine",
          "A finish of soft, shiny, fluffy curls that run uniformly from root to tip",
        ],
        notIncluded:
          "The Classic Rod Set does not include a scalp/hair assessment or spa treatment, and it does not include a trim. If your hair needs extra moisture, scalp care, or your ends are damaged or overdue for a cut, one of our upgraded options will serve you better.",
        bestFor:
          "Clients with healthy, well-maintained hair who simply want a gorgeous, uniform curl set with minimal heat and tension — or who want a break from more manipulative styling.",
      },
      {
        name: "Rod Set + Spa Treatment",
        tagline: "Real repair and moisture alongside the style.",
        includes: [
          "A full scalp and hair assessment, so we can determine exactly what your hair needs before we begin",
          "A targeted spa treatment or deep conditioner, applied to the scalp and/or hair based on that assessment",
          "Cleansing and blow-drying of the hair to prep for an extended, longer-lasting curl",
          "Small, precise sections wrapped around each rod with end papers for smooth, root-to-tip curl definition",
          "Application of our moisturizing holding foam, which locks in moisture while giving the curl a soft, defined finish",
          "Full dryer time to set the curls completely",
          "A finish of soft, shiny, moisturized curls from root to tip",
        ],
        notIncluded:
          "This service does not include a trim. Your curls will look and feel healthier and more moisturized, but any damaged or split ends will still be present after your appointment.",
        bestFor:
          "Clients whose hair feels dry, over-processed, or lacking moisture, or anyone recovering from heat damage who wants their scalp and strands genuinely treated — not just styled.",
      },
      {
        name: "Rod Set + Trim",
        tagline: "The classic set, with your ends brought back to health.",
        includes: [
          "Everything included in the Classic Rod Set",
          "A precision trim to cut away split ends, dead hair, or any unruly, damaged strands before or after the set",
        ],
        notIncluded:
          "This service does not include a scalp/hair assessment or spa treatment. If your hair needs deep moisture or scalp care in addition to a trim, our Deluxe Rod Set covers everything.",
        bestFor:
          "Clients whose hair is otherwise healthy but whose ends are due for a cut, or anyone who wants their rod set to last longer with stronger, healthier ends.",
      },
      {
        name: "Deluxe Rod Set",
        tagline: "Spa treatment and precision trim — the complete reset.",
        featured: true,
        includes: [
          "A full scalp and hair assessment to determine your hair's specific needs",
          "A customized spa treatment or deep conditioner applied to the scalp and/or hair",
          "Cleansing and blow-drying to prep for an extended curl",
          "Small, precise sections wrapped around each rod with end papers for smooth, root-to-tip definition",
          "Application of our moisturizing holding foam for a soft, defined, moisturized finish",
          "A precision trim to remove dead or split ends",
          "Full dryer time to completely set the curls",
          "A finish of soft, shiny, healthy, uniform curls from root to tip — treated, styled, and maintained all in one appointment",
        ],
        bestFor:
          "Clients who want the full reset: a moisturizing treatment, gorgeous uniform curls, and healthy, well-maintained ends, all at once.",
      },
    ],
  },
  note: {
    eyebrow: "Good To Know",
    heading: "Why The Trim Matters",
    body: [
      "Split ends don't stay put — left untreated, that damage travels up the hair shaft over time, the same way a shoelace unravels once the plastic tip wears away.",
      "Trimming regularly stops that damage before it spreads, giving you smoother curls, healthier-looking ends, and a set that holds its shape longer.",
      "We generally recommend a trim at least once a quarter, though this can vary depending on how often you manipulate or heat-style your hair.",
    ],
  },
  comparison: {
    eyebrow: "At A Glance",
    heading: "Quick Comparison",
    columns: [
      "Classic Rod Set",
      "Rod Set + Spa Treatment",
      "Rod Set + Trim",
      "Deluxe Rod Set",
    ],
    rows: [
      { label: "Wash & cleanse", values: [true, true, true, true] },
      { label: "Scalp/hair assessment", values: [false, true, false, true] },
      { label: "Spa treatment / deep conditioner", values: [false, true, false, true] },
      { label: "Moisturizing holding foam", values: [false, true, false, true] },
      { label: "Rod set with end papers", values: [true, true, true, true] },
      { label: "Dryer time", values: [true, true, true, true] },
      { label: "Precision trim", values: [false, false, true, true] },
    ],
    footnote:
      "Each tier lets clients choose exactly how much their hair needs beyond the set itself — a simple, beautiful curl, a deeper treatment, a trim, or the full combination of both.",
  },
  meta: {
    title: "Rodset | Natural Styles | October Glory",
    description:
      "Four tiers of rod set at October Glory — Classic, + Spa Treatment, + Trim, and Deluxe. Uniform, heat-conscious curl definition from root to tip.",
  },
};

const flatTwist: ServiceDetail = {
  slug: "flat-twist",
  cardTitle: "Flat Twist",
  price: "$125",
  hero: {
    display: "Flat",
    script: "Twist",
    intro:
      "A sculpted, low-tension protective style that lies flat to the scalp and unravels into soft, defined waves.",
    image: "/images/FlatTwist.jpg",
  },
  overview: {
    eyebrow: "The Service",
    heading: "Sculpted, Protective, Effortless",
    body: [
      "Flat twists are created by twisting two sections of hair flat against the scalp, following a pattern designed around your head shape and the look you want.",
      "It's a protective style in the truest sense — your ends are tucked away, tension stays low, and the hair underneath is left alone to grow. Worn as-is it's a clean, sculpted look; unravelled, it becomes a soft twist-out with definition through the whole length.",
    ],
    image: "/images/FlatTwist.jpg",
  },
  tiers: {
    eyebrow: "Choose Your Experience",
    heading: "Flat Twist Tiers",
    items: [
      {
        name: "Classic Flat Twist",
        tagline: "A clean, sculpted set without the extras.",
        includes: [
          "A thorough wash and cleanse to remove buildup and prep the hair",
          "Hair detangled, combed out, and sectioned for an even, symmetrical pattern",
          "Flat twists installed with consistent tension so the style lies smooth and lasts",
          "Moisturizing product applied through the length to keep the hair soft while it's set",
          "A finish of defined, sculpted twists ready to wear or unravel",
        ],
        notIncluded:
          "The Classic Flat Twist does not include a scalp/hair assessment, spa treatment, or a trim.",
        bestFor:
          "Clients with healthy hair who want a protective, low-manipulation style they can wear for days.",
      },
      {
        name: "Flat Twist + Spa Treatment",
        tagline: "Moisture and scalp care underneath the style.",
        featured: true,
        includes: [
          "A full scalp and hair assessment to determine what your hair needs before we begin",
          "A targeted spa treatment or deep conditioner applied to the scalp and/or hair",
          "Time under the steamer so the treatment penetrates the hair shaft rather than sitting on the surface",
          "Hair detangled, sectioned, and flat twisted with even tension",
          "Finishing products applied to keep the set soft and defined for its full duration",
        ],
        notIncluded: "This service does not include a trim.",
        bestFor:
          "Clients going into a protective style who want their scalp treated first — the best time to address moisture is before the hair is tucked away.",
      },
      {
        name: "Flat Twist + Trim",
        tagline: "The classic set, with healthy ends to finish.",
        includes: [
          "Everything included in the Classic Flat Twist",
          "A precision trim to remove dead or split ends before the set goes in",
        ],
        notIncluded:
          "This service does not include a scalp/hair assessment or spa treatment.",
        bestFor:
          "Clients whose hair is otherwise healthy but whose ends are due for a cut.",
      },
    ],
  },
  meta: {
    title: "Flat Twist | Natural Styles | October Glory",
    description:
      "Flat twist styling at October Glory — a sculpted, low-tension protective style, available with a spa treatment or precision trim.",
  },
};

const washAndGo: ServiceDetail = {
  slug: "wash-and-go",
  cardTitle: "Wash & Go",
  price: "$50",
  hero: {
    display: "Wash",
    script: "& Go",
    intro:
      "Your natural curl pattern, cleansed, defined and finished — the simplest way to wear your own texture well.",
    image: "/images/wash&go.jpg",
  },
  overview: {
    eyebrow: "The Service",
    heading: "Your Texture, At Its Best",
    body: [
      "A wash and go works with the curl pattern you already have rather than reshaping it. The hair is cleansed, conditioned, and product is applied section by section while the hair is soaking wet — which is what separates a defined wash and go from a frizzy one.",
      "It's our quickest natural style and the easiest to maintain between visits, which makes it a favourite for clients who want their own texture to do the work.",
    ],
    image: "/images/wash&go.jpg",
  },
  tiers: {
    eyebrow: "Choose Your Experience",
    heading: "Wash & Go Tiers",
    items: [
      {
        name: "Classic Wash & Go",
        tagline: "Cleanse, define, finish.",
        includes: [
          "A thorough cleanse to remove buildup, oil, and product residue",
          "A conditioning treatment to restore moisture and slip for definition",
          "Product applied in sections on soaking wet hair for even, frizz-free curl definition",
          "Diffusing or air-dry finish depending on your hair and your schedule",
        ],
        notIncluded:
          "The Classic Wash & Go does not include a scalp/hair assessment, spa treatment, or a trim.",
        bestFor:
          "Clients with a healthy, consistent curl pattern who want a fast, low-maintenance refresh.",
      },
      {
        name: "Wash & Go + Spa Treatment",
        tagline: "A deeper reset for curls that have gone quiet.",
        featured: true,
        includes: [
          "A full scalp and hair assessment to determine whether your hair needs moisture, protein, or scalp care",
          "A targeted spa treatment or deep conditioner applied based on that assessment",
          "Time under the steamer so the treatment penetrates deeply into the hair shaft",
          "Product applied in sections on wet hair for maximum definition",
          "Diffusing or air-dry finish with finishing products applied",
        ],
        notIncluded: "This service does not include a trim.",
        bestFor:
          "Clients whose curls have lost definition, feel dry, or aren't responding to product the way they used to.",
      },
    ],
  },
  meta: {
    title: "Wash & Go | Natural Styles | October Glory",
    description:
      "Wash and go styling at October Glory — your natural curl pattern cleansed, defined, and finished, with an optional steamed spa treatment.",
  },
};

const braidDown: ServiceDetail = {
  slug: "braid-down",
  cardTitle: "Braid Down",
  price: "$125",
  hero: {
    display: "Braid",
    script: "Down",
    intro:
      "A neat, close braided foundation — worn on its own, or set as the base for a install.",
    image: "/images/braiddown.jpg",
  },
  overview: {
    eyebrow: "The Service",
    heading: "The Foundation Everything Sits On",
    body: [
      "A braid down is a set of cornrows braided flat and close to the scalp. Worn on its own it's a clean, long-lasting protective style; underneath a wig or sew-in, it's the foundation that decides how flat, comfortable and natural the finished install looks.",
      "We braid with even, deliberate tension — a braid down that's too tight damages the hairline, and one that's too loose won't hold. Getting that balance right is the whole service.",
    ],
    image: "/images/braiddown.jpg",
  },
  tiers: {
    eyebrow: "Choose Your Experience",
    heading: "Braid Down Tiers",
    items: [
      {
        name: "Classic Braid Down",
        tagline: "A clean, even braided base.",
        includes: [
          "A thorough wash and cleanse to remove buildup and prep the scalp",
          "Hair detangled, blow-dried, and sectioned into an even pattern",
          "Cornrows braided flat to the scalp with consistent, hairline-safe tension",
          "Moisturizing product applied to the scalp and length before braiding",
        ],
        notIncluded:
          "The Classic Braid Down does not include a scalp/hair assessment, spa treatment, or a trim.",
        bestFor:
          "Clients with healthy hair who want a protective base — either to wear as-is or to install over.",
      },
      {
        name: "Braid Down + Spa Treatment",
        tagline: "Treat the hair before you tuck it away.",
        featured: true,
        includes: [
          "A full scalp and hair assessment to determine what your hair needs",
          "A targeted spa treatment or deep conditioner applied to the scalp and/or hair",
          "Time under the steamer so the treatment penetrates deeply before the hair is braided",
          "Hair detangled, blow-dried, and braided flat with even tension",
          "Finishing products applied to the scalp and length",
        ],
        notIncluded: "This service does not include a trim.",
        bestFor:
          "Clients heading into a long-wear protective style or install who want their hair treated first — once it's braided down, you won't reach it again for weeks.",
      },
      {
        name: "Braid Down + Trim",
        tagline: "Healthy ends before the style goes in.",
        includes: [
          "Everything included in the Classic Braid Down",
          "A precision trim to remove dead or split ends before braiding",
        ],
        notIncluded:
          "This service does not include a scalp/hair assessment or spa treatment.",
        bestFor:
          "Clients due for a trim who want it handled in the same visit as their braid down.",
      },
    ],
  },
  meta: {
    title: "Braid Down | Natural Styles | October Glory",
    description:
      "Braid downs at October Glory — a neat, hairline-safe cornrow foundation to wear on its own or install over.",
  },
};

const twoStrandTwist: ServiceDetail = {
  slug: "2-strand-twist",
  cardTitle: "2 Strand Twist",
  price: "$125",
  hero: {
    display: "Two Strand",
    script: "Twist",
    intro:
      "Rope twists through the full length — a protective style that doubles as a twist-out when you're ready.",
    image: "/images/2-strand-twist.jpg",
  },
  overview: {
    eyebrow: "The Service",
    heading: "Two Styles In One",
    body: [
      "Two strand twists are made by twisting two sections of hair around each other through the full length. They protect the ends, hold their shape for days, and stretch the hair gently without heat.",
      "Wear them twisted for a defined, uniform look — then unravel them for a soft twist-out with body and definition through every strand. One appointment, two very different finishes.",
    ],
    image: "/images/2-strand-twist.jpg",
  },
  tiers: {
    eyebrow: "Choose Your Experience",
    heading: "2 Strand Twist Tiers",
    items: [
      {
        name: "Classic 2 Strand Twist",
        tagline: "Defined twists from root to tip.",
        includes: [
          "A thorough wash and cleanse to remove buildup and prep the hair",
          "Hair detangled, sectioned, and prepped for an even, uniform set",
          "Two strand twists installed through the full length with smooth, sealed ends",
          "Moisturizing product applied through the length for softness and hold",
        ],
        notIncluded:
          "The Classic 2 Strand Twist does not include a scalp/hair assessment, spa treatment, or a trim.",
        bestFor:
          "Clients with healthy hair who want a protective style they can wear twisted, then unravel into a twist-out.",
      },
      {
        name: "2 Strand Twist + Spa Treatment",
        tagline: "Moisture that lasts the whole wear.",
        featured: true,
        includes: [
          "A full scalp and hair assessment to determine what your hair needs",
          "A targeted spa treatment or deep conditioner applied to the scalp and/or hair",
          "Time under the steamer so the treatment penetrates the hair shaft",
          "Two strand twists installed through the full length with sealed ends",
          "Finishing products applied to keep the set soft and defined",
        ],
        notIncluded: "This service does not include a trim.",
        bestFor:
          "Clients whose hair feels dry or over-processed and who want it genuinely treated before it's tucked away.",
      },
      {
        name: "2 Strand Twist + Trim",
        tagline: "The classic set, with your ends brought back to health.",
        includes: [
          "Everything included in the Classic 2 Strand Twist",
          "A precision trim to remove dead or split ends before the set",
        ],
        notIncluded:
          "This service does not include a scalp/hair assessment or spa treatment.",
        bestFor:
          "Clients whose ends are due for a cut and who want smoother, longer-lasting twists.",
      },
    ],
  },
  meta: {
    title: "2 Strand Twist | Natural Styles | October Glory",
    description:
      "Two strand twists at October Glory — a protective style that unravels into a defined twist-out, with optional spa treatment or trim.",
  },
};

const naturalUpdo: ServiceDetail = {
  slug: "natural-updo",
  cardTitle: "Natural Updo",
  price: "$75",
  hero: {
    display: "Natural",
    script: "Updo",
    intro:
      "A sculpted, occasion-ready style built entirely from your own natural texture.",
    image: "/images/naturalfrenchroll.jpg",
  },
  overview: {
    eyebrow: "The Service",
    heading: "Styled For The Occasion",
    body: [
      "A natural updo is designed around your face, your texture, and the event you're dressing for — a french roll, a sculpted bun, a pinned and tucked shape, or something built on the day.",
      "Because it works with your own hair rather than added pieces, it stays comfortable through a long evening and comes down easily at the end of the night. Tell us the occasion and we'll build the shape around it.",
    ],
    image: "/images/naturalfrenchroll.jpg",
  },
  tiers: {
    eyebrow: "Choose Your Experience",
    heading: "Natural Updo Tiers",
    items: [
      {
        name: "Classic Natural Updo",
        tagline: "A sculpted style on prepped hair.",
        includes: [
          "Hair prepped, stretched, and smoothed to hold the shape",
          "A custom updo sculpted around your face shape and the occasion",
          "Edges laid and the shape secured for all-day and all-evening hold",
          "Finishing products applied for shine and hold",
        ],
        notIncluded:
          "The Classic Natural Updo does not include a wash, scalp/hair assessment, spa treatment, or a trim.",
        bestFor:
          "Clients coming in with recently washed hair who need a polished style for an event.",
      },
      {
        name: "Natural Updo + Wash & Prep",
        tagline: "Cleansed, conditioned, then styled.",
        featured: true,
        includes: [
          "A thorough wash and cleanse to remove buildup and product residue",
          "A conditioning treatment to restore moisture and manageability",
          "Hair stretched and smoothed to take the shape cleanly",
          "A custom updo sculpted around your face shape and the occasion",
          "Edges laid, shape secured, and finishing products applied",
        ],
        notIncluded: "This service does not include a trim.",
        bestFor:
          "Clients who want the whole thing handled in one visit — arrive as you are, leave event-ready.",
      },
    ],
  },
  meta: {
    title: "Natural Updo | Natural Styles | October Glory",
    description:
      "Natural updos at October Glory — french rolls, sculpted buns, and custom occasion styling built from your own texture.",
  },
};

export const naturalStyles: ServiceCategory = {
  slug: "natural-styles",
  label: "Natural Styles",
  services: [
    rodset,
    flatTwist,
    washAndGo,
    braidDown,
    twoStrandTwist,
    naturalUpdo,
  ],
};
