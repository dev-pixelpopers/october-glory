import type { ServiceDetail } from "./types";

/**
 * Wigs & Extensions — a top-level service covering everything that involves
 * added hair or a unit. Transcribed from the salon's "Custom Wig Design" and
 * "Weave Installs at October Glory" documents.
 *
 * No pricing exists in either source document, so tier prices are left unset
 * rather than guessed.
 */
export const wigsAndExtensions: ServiceDetail = {
  slug: "wigs-and-extensions",
  cardTitle: "Wigs & Extensions",
  hero: {
    display: "Wigs",
    script: "& Extensions",
    intro:
      "Custom units and sew-in installs built on the health of your natural hair — and finished with a cut made for your face.",
    image: "/images/Weaves-And-Extensions-01.webp",
  },
  overview: {
    eyebrow: "The Service",
    heading: "Built Around Your Hair, Not On Top Of It",
    body: [
      "At October Glory, every sew-in weave is a custom foundation for your hair, not a one-size-fits-all service. Whether you're searching for a full weave with closure or a weave with leave out, each install starts with the health of your natural hair and ends with a cut tailored to your face shape.",
      "Our Custom Wig service is more than just a wig purchase — it's a fully personalized process where every detail, from the hair itself to the final cut and style, is designed around you. This is our premier offering, built for clients who want a unit that looks completely natural, fits flawlessly, and is constructed specifically to their vision from the ground up.",
      "Please note: hair is not included with either weave service, but bundles, closures, and frontals can be added for a separate cost so you leave with everything needed for a seamless result.",
    ],
    image: "/images/Weaves-And-Extensions-02.webp",
  },
  tiers: {
    eyebrow: "Choose Your Experience",
    heading: "Wig & Weave Services",
    items: [
      {
        name: "Custom Wig Design",
        tagline:
          "Our premier offering — a fully personalized process where every detail, from the hair itself to the final cut and style, is designed around you.",
        featured: true,
        includes: [
          "A one-on-one consultation covering length, color, cut, and texture — matching the hair to the look you want and to your own natural hair, so the unit blends seamlessly",
          "Precise head measurements, so your wig is constructed to fit your head specifically — not a generic size",
          "A price for your custom unit, with a 50% deposit securing your order and moving you into the construction process",
          "Final cut, style, and any additional customization performed on install day, while the unit is applied and installed on your head",
          "A care tutorial covering how to put it on and take it off, how to store it properly between wears, how to wash it, and how to style and maintain it at home",
          "Hair sourced from Southeast Asia — predominantly Cambodian and Filipino — chosen for its low luster, thick density, and close resemblance to our clients' natural texture",
        ],
        bestFor:
          "Anyone ready to invest in a wig that's truly their own — whether you're growing out your natural hair, exploring a new color or cut, navigating hair loss, or simply want a beautifully crafted, natural-looking protective style.",
      },
      {
        name: "Weave With Leave-Out",
        tagline:
          "A classic sew-in method designed to blend your natural hair with your extensions for the most undetectable, natural-looking weave possible.",
        includes: [
          "Cleansing wash to remove buildup and ensure a clean, healthy scalp before installation",
          "Protein-infused deep conditioning treatment to strengthen weakened strands and restore elasticity",
          "Moisture treatment for soft, malleable hair that lays flat and blends seamlessly with your extensions",
          "Full hair and scalp assessment to determine the healthiest, most natural install method for your texture",
          "Custom-sized foundation braids, built according to the density of your natural hair for a flat, secure base with no bulk",
          "Sew-in weave installation using your leave-out to conceal tracks completely, so there is zero visible weave line",
          "Protective net sewn over the foundation braids to minimize shedding and keep your hair organized as your braids grow out underneath the weave",
          "Custom cut and style to accentuate your natural face shape and complete your desired finished look",
        ],
        notIncluded:
          "Hair is not included. This service is strictly labor and service based; bundles, closures, and frontals are available as add-ons for a separate cost.",
        bestFor:
          "Clients who love the look of their natural hairline and want a slightly more flexible, blended style — with wear time extending up to 2.5 months.",
      },
      {
        name: "Full Weave With Closure",
        tagline:
          "A 100% protective style — none of your natural hair is left out, aside from a very minimal amount along the hairline.",
        includes: [
          "Cleansing wash to purify the scalp and prepare a healthy foundation for the install",
          "Protein-infused deep conditioning treatment to rebuild strength in fragile or damaged strands",
          "Moisture treatment for soft, pliable hair that lays flat under the closure",
          "Full hair and scalp assessment for the flattest, most natural-looking closure install",
          "Custom-sized foundation braids, mapped and sized based on your natural hair's density for a secure, comfortable base",
          "Closure installation designed to simulate a realistic, natural-looking part",
          "Protective net sewn over the foundation braids to minimize shedding and keep your hair organized as your braids grow out underneath the weave",
          "Custom cut and style, cut to flatter your individual face shape and finished in your desired style",
        ],
        notIncluded:
          "Hair is not included. This service is strictly labor and service based; bundles, closures, and frontals are available as add-ons for a separate cost.",
        bestFor:
          "Clients whose goal is maximum protection, length retention, and giving their natural hair a true break from daily styling — with a typical wear time of 4 to 6 weeks.",
      },
    ],
  },
  note: {
    eyebrow: "Good To Know",
    heading: "Caring For Your Install",
    body: [
      "To get the most out of your sew-in weave, proper aftercare is key. Sleep with a satin or silk bonnet or pillowcase to reduce friction and frizz.",
      "Use a light, water-based moisturizer to keep your leave-out or closure hydrated between wash days, and avoid heavy oils at the root that can cause buildup on your foundation braids.",
      "Scheduling a scalp cleanse partway through your install helps prevent itching and buildup, keeping your extensions and natural hair healthy for the full duration of wear.",
      "With proper care and maintenance, a custom wig from October Glory can last up to two years — see our Wig Maintenance packages for ongoing upkeep.",
    ],
  },
  comparison: {
    eyebrow: "At A Glance",
    heading: "Leave-Out Or Closure?",
    columns: ["Weave With Leave-Out", "Full Weave With Closure"],
    rows: [
      { label: "Cleansing wash", values: [true, true] },
      { label: "Protein-infused deep conditioning", values: [true, true] },
      { label: "Moisture treatment", values: [true, true] },
      { label: "Full hair and scalp assessment", values: [true, true] },
      { label: "Custom-sized foundation braids", values: [true, true] },
      { label: "Protective net", values: [true, true] },
      { label: "Leave-out conceals the tracks", values: [true, false] },
      { label: "Lace closure simulates the part", values: [false, true] },
      { label: "Custom cut and style", values: [true, true] },
      { label: "Hair included", values: [false, false] },
      {
        label: "Typical wear time",
        values: [{ text: "Up to 2.5 months" }, { text: "4 to 6 weeks" }],
      },
    ],
    footnote:
      "Every install at October Glory begins with a wash and protein-infused deep conditioning treatment to build your new style on a strong, healthy foundation, not just hair on top of stressed strands. And because every face is different, every install ends with a personalized cut designed to frame and flatter your features.",
  },
  cta: {
    display: "Reserve Your Space",
    heading: "Ready For Your Next Install?",
    body: "Reach out to October Glory to discuss whether a custom wig, a weave with leave-out, or a full weave with closure fits your hair goals, texture, and lifestyle.",
  },
  meta: {
    title: "Wigs & Extensions | October Glory",
    description:
      "Custom wig design and sew-in weave installs at October Glory — leave-out and full closure, each built on a custom foundation and finished with a personalized cut.",
  },
};

/** Category pages grouped under Wigs & Extensions on the Services page. */
export const wigsAndExtensionsChildren = [
  {
    title: "Weaves And Extensions",
    image: "/images/waves1.webp",
    href: "/weaves-and-extensions",
  },
];
