import type { ServiceDetail } from "./types";

/**
 * Silk Press — a top-level service in its own right, not an inner service of
 * Natural Styles. Transcribed from the salon's own silk press document.
 *
 * `silkPressChildren` are the category pages that sit underneath it: every
 * service performed on the client's own hair.
 */

export const silkPress: ServiceDetail = {
  slug: "silk-press",
  cardTitle: "Silk Press",
  price: "$100",
  hero: {
    display: "Silk",
    script: "Press",
    intro:
      "Sleek, smooth and salon-fresh — achieved with heat, tension and technique instead of chemicals.",
    image: "/images/SilkPress-01.webp",
  },
  overview: {
    eyebrow: "The Service",
    heading: "One Press, Three Ways",
    body: [
      "A silk press is one of the most requested services at October Glory — and for good reason. It transforms natural hair into a sleek, smooth, salon-fresh style using heat, tension, and technique instead of chemicals.",
      "Because every head of hair is different, we offer three tiers of silk press service, each building on the last. Below is a breakdown of what's included in each, so you can choose the experience that fits your hair's needs — and your schedule.",
    ],
    image: "/images/SilkPress-01.webp",
  },
  tiers: {
    eyebrow: "Choose Your Experience",
    heading: "Silk Press Tiers",
    items: [
      {
        name: "Classic Silk Press",
        tagline: "This is our foundational silk press service, perfect for clients who want sleek, straight hair without the extras. It includes:",
        includes: [
          "A deep cleanse of the scalp to remove buildup, oil, and product residue before styling begins",
          "A conditioning treatment to restore moisture and manageability to the hair",
          "Custom heat temperature applied based on your hair's texture and density, so we protect the integrity of your strands while achieving maximum sleekness",
          "A full press to leave your hair smooth, shiny, and frizz-free",
          "Application of finishing products to help your style stay smooth for the duration of your press",
        ],
        notIncluded:
          "The Classic Silk Press does not include a scalp/hair assessment for a targeted spa treatment, steam processing, or a trim. If your hair needs deeper repair or your ends need attention, one of our other two options will serve you better.",
        bestFor:
          "Clients with healthy hair who want a quick, reliable, low-maintenance sleek style refresh.",
      },
      {
        name: "Silk Press + Spa Treatment",
        tagline:
          "This tier adds a customized deep-conditioning experience before the press, designed to actually treat your hair and scalp rather than simply style it. It includes:",
        featured: true,
        includes: [
          "A full scalp and hair assessment, where we determine exactly what your hair needs — extra moisture, protein, scalp care, or a combination",
          "A targeted spa treatment or deep conditioner, applied based on that assessment, to the scalp and/or hair",
          "Time under the steamer, where gentle moist heat opens the hair cuticle, allowing the treatment to penetrate deeply into the hair shaft instead of just sitting on the surface",
          "A full press and style once the treatment has been rinsed and the hair is prepped",
          "Finishing products applied to help your silk press remain smooth for its full duration",
        ],
        notIncluded:
          "This service does not include a trim. If your ends are damaged, splitting, or overdue for a cut, those issues will still be present after your appointment — this tier is about restoring moisture and health to the hair itself, not addressing length or split ends.",
        bestFor:
          "Clients whose hair feels dry, dull, over-processed, or in need of a moisture boost before styling — and who want their scalp addressed too, not just their strands.",
      },
      {
        name: "The Glorious Express",
        tagline:
          "This is our most comprehensive silk press service — everything from the Spa Treatment tier, plus a precision trim to finish. It includes:",
        includes: [
          "A full scalp and hair assessment to determine the right treatment for your hair's specific needs",
          "A customized spa treatment or deep conditioner applied to the scalp and/or hair based on that assessment",
          "Time under the steamer with moist heat to open the cuticle and allow the treatment to penetrate deeply for maximum benefit",
          "A full press to leave the hair straight, sleek, and smooth",
          "A precision trim to remove dead or split ends, cutting away any brittle, damaged, or unruly hair",
          "Finishing products applied to help your silk press remain smooth for its full duration",
        ],
        bestFor:
          "Clients due for a trim, dealing with damaged or splitting ends, or anyone who wants the complete reset — treatment, press, and length maintenance — in a single visit.",
      },
    ],
  },
  note: {
    eyebrow: "Good To Know",
    heading: "Why The Trim Matters",
    body: [
      "Think of your hair like a shoestring. If the plastic tip on the end of a shoelace wears off, the string starts to unravel and fray. Hair works the same way — once the ends split, that damage travels up the strand if it isn't cut off.",
      "The longer split ends are left untreated, the more hair eventually has to be cut to get back to a healthy point. A regular trim keeps damage from spreading, which means a smoother silk press, healthier-looking ends, and a style that holds up better over time.",
      "We generally recommend a trim at least once a quarter, though this can vary depending on how often you manipulate or heat-style your hair between visits.",
    ],
  },
  comparison: {
    eyebrow: "At A Glance",
    heading: "Quick Comparison",
    columns: ["Classic Silk Press", "Silk Press + Spa Treatment", "The Glorious Express"],
    rows: [
      { label: "Scalp cleanse", values: [true, false, false] },
      {
        label: "Conditioning treatment",
        values: ["standard", "customized", "customized"],
      },
      { label: "Scalp/hair assessment", values: [false, true, true] },
      { label: "Steam processing", values: [false, true, true] },
      { label: "Custom heat press", values: [true, true, true] },
      { label: "Precision trim", values: [false, false, true] },
    ],
    footnote:
      "Each service builds on the one before it, so clients can choose based on how much their hair needs beyond a standard press: styling alone, styling with a treatment, or the full reset with a trim included.",
  },
  meta: {
    title: "Silk Press | October Glory",
    description:
      "Three tiers of silk press at October Glory — Classic, Silk Press + Spa Treatment, and The Glorious Express. Sleek, smooth, chemical-free styling.",
  },
};

/** Category pages grouped under Silk Press on the Services page. */
export const silkPressChildren = [
  {
    title: "Natural Styles",
    image: "/images/naturalStyle1.webp",
    href: "/natural-styles",
  },
  {
    title: "Relaxers And Colors",
    image: "/images/relaxes1.webp",
    href: "/relaxers-and-colors",
  },
  {
    title: "Haircuts And Styles",
    image: "/images/haircuts1.webp",
    href: "/haircuts-and-styles",
  },
];
