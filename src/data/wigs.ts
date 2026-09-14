import type { ServiceParent } from "./services/types";

/**
 * The Wigs page — served at /wigs, not under /services.
 *
 * It used to be one of the main services, and it still carries the same shape
 * as a `ServiceParent` so `childrenMenu()` and the service-detail section
 * components can render it unchanged. What makes it different is that it is a
 * destination rather than a service: it sits in the primary nav beneath About
 * Us, and the sub-services listed on it live at /wigs/<slug>.
 *
 * `WIGS_SLUG` is the value those sub-services carry in their `parents` array.
 * `src/data/services/index.ts` maps that slug to /wigs so every derived link —
 * the menu grid, sibling cards, `generateStaticParams` — points off /services
 * without any caller needing to special-case it.
 */
export const WIGS_SLUG = "wigs";

export const wigsPage: ServiceParent = {
  cardImage: "/images/waves1.webp",
  cardBlurb:
    "Custom units and sew-in installs built on the health of your natural hair — and finished with a cut made for your face.",
  slug: "wigs",
  cardTitle: "Wigs",
  hero: {
    display: "Custom",
    script: "Wigs",
    intro:
      "Custom units and sew-in installs built on the health of your natural hair — and finished with a cut made for your face.",
    image: "/images/shop-bg.png",
  },
  // Plays in the sticky "Naturally Woven" block below the hero.
  welcomeVideo: "/images/wig-featured.webm",
  shopProducts: [
    { title: "Braided Wigs", image: "/images/collections/wigs-1.png" },
    { title: "Glueless Wigs", image: "/images/collections/wigs-2.png" },
    { title: "Veralux Wigs", image: "/images/collections/wigs-3.png" },
    { title: "Half Wigs", image: "/images/collections/wigs-4.png" },
  ],
  instagram: {
    heading: "See",
    headingAccent: "The Glory",
    body: "Fresh installs, custom units, and real results from our Brooklyn salon.",
    videos: [
      "/images/video-01.mp4",
      "/images/video-02.mp4",
      "/images/video-03.mp4",
      "/images/video-04.mp4",
      "/images/video-05.mp4",
    ],
    showProfileLink: false,
  },
  overview: {
    eyebrow: "The Service",
    heading: "Naturally",
    headingAccent: "Woven",
    body: [
      "Whether it’s a full weave, a leave-out install, or simple track extensions, every install starts with your natural hair as the foundation, not an afterthought. Extensions are placed and blended to follow your hair’s own growth pattern and movement, so the result feels like an extension of you — not something added on top. The goal is hair that moves, parts, and falls the way yours naturally would, just longer and fuller.",
    ],
    image: "/images/Weaves-And-Extensions-02.webp",
  },
  tiers: {
    eyebrow: "Choose Your Experience",
    heading: "Weave Install Services",
    items: [
      {
        name: "Weave With Leave-Out",
        tagline: "A Seamless, Natural-Looking Finish",
        includes: [
          "A cleansing shampoo to remove buildup and prepare a healthy foundation",
          "A protein treatment to strengthen weakened strands and improve elasticity",
          "A moisture treatment to soften the hair and encourage a seamless blend",
          "A personalized hair and scalp assessment to determine the healthiest installation method",
          "Custom foundation braids created to suit your hair's density for a secure, flat finish",
          "Professional sew-in installation using your natural leave-out to completely conceal the tracks",
          "A protective net to minimize shedding and keep your natural hair protected beneath the install",
          "A customized cut and style designed to complement your face shape and desired look",
        ],
        notIncluded:
          "Hair is not included. This service is strictly labor and service based; premium bundles, closures, and frontals are available for purchase as add-ons.",
        bestFor:
          "Clients who want a versatile, natural-looking weave with added length and volume while maintaining the appearance of their own hair — with wear time extending up to 2.5 months.",
      },
      {
        name: "Full Weave With Closure",
        tagline: "Complete Protection. Beautifully Natural Results.",
        featured: true,
        includes: [
          "A cleansing shampoo to purify the scalp and create a healthy foundation for your install",
          "A protein treatment to strengthen fragile or damaged strands",
          "A moisturizing treatment to soften the hair and ensure a smooth, comfortable foundation",
          "A personalized hair and scalp assessment to determine the best installation method",
          "Custom foundation braids designed to match your hair's density for a secure, flat fit",
          "Professional lace closure installation that creates a natural-looking part",
          "A protective net to reduce shedding and keep your natural hair neatly secured beneath the weave",
          "A customized cut and finish tailored to your face shape and personal style",
        ],
        notIncluded:
          "Hair is not included. This service is strictly labor and service based; premium bundles, closures, and frontals are available for purchase as add-ons.",
        bestFor:
          "Clients who want maximum protection, versatile styling, and a natural-looking finish while allowing their natural hair time to rest and recover — with a typical wear time of 4 to 6 weeks.",
      },
    ],
  },
  note: {
    eyebrow: "Good To Know",
    heading: "Protecting Your Weave Investment",
    body: [
      "A beautiful weave doesn't end with the installation — proper aftercare is essential to keeping both your extensions and natural hair healthy. Sleep with a satin or silk bonnet, or use a satin pillowcase, to minimize friction and reduce frizz.",
      "Keep your leave-out or closure hydrated with a lightweight, water-based moisturizer, and avoid applying heavy oils directly to the roots, as they can cause buildup around your foundation braids.",
      "We also recommend scheduling a professional scalp cleanse during extended wear to remove buildup, relieve itching, and help maintain a healthy scalp throughout your installation.",
    ],
  },
  comparison: {
    eyebrow: "At A Glance",
    heading: "Leave-Out Or Closure?",
    columns: ["Weave With Leave-Out", "Full Weave With Closure"],
    rows: [
      { label: "Cleansing shampoo", values: [true, true] },
      { label: "Protein treatment", values: [true, true] },
      { label: "Moisture treatment", values: [true, true] },
      { label: "Hair and scalp assessment", values: [true, true] },
      { label: "Custom foundation braids", values: [true, true] },
      { label: "Protective net", values: [true, true] },
      { label: "Leave-out conceals the tracks", values: [true, false] },
      { label: "Lace closure simulates the part", values: [false, true] },
      { label: "Customized cut and style", values: [true, true] },
      { label: "Hair included", values: [false, false] },
      {
        label: "Typical wear time",
        values: [{ text: "Up to 2.5 months" }, { text: "4 to 6 weeks" }],
      },
    ],
    footnote:
      "Every sew-in weave in Brooklyn, NY at October Glory begins with a cleansing wash, protein-infused conditioning treatment, and a personalized hair assessment to create a healthy foundation before installation. We customize every braid pattern to your hair's density and finish each install with a precision cut that complements your face shape.",
  },
  faq: {
    eyebrow: "Questions",
    heading: "Frequently Asked",
    items: [
      {
        question: "Does the service include the hair?",
        answer:
          "No. Our weave install services in Brooklyn include the professional installation only. Hair is not included in the service price, but premium bundles, closures, and frontals are available for purchase to ensure you have everything you need for your appointment.",
      },
      {
        question: "How long does a weave install last?",
        answer:
          "A weave with leave-out typically lasts up to 2.5 months, while a weave with closure generally lasts 4 to 6 weeks. Longevity depends on factors such as your natural hair growth, scalp condition, at-home maintenance, and how well you care for your install between appointments.",
      },
      {
        question: "Will a weave install damage my natural hair?",
        answer:
          "When professionally installed and properly maintained, a sew-in weave is one of the most effective protective styles available. At October Glory, every installation begins with a personalized hair assessment, followed by protein and moisture treatments to strengthen your natural hair before it's braided. We also customize the braid foundation to your hair's density, helping minimize unnecessary tension while protecting the health of your hair.",
      },
      {
        question: "What's the difference between a leave-out and a closure install?",
        answer:
          "A weave with leave-out blends a small section of your natural hair with the extensions, creating a soft, seamless finish. A weave with closure uses a lace closure to create a realistic-looking part while keeping almost all of your natural hair protected underneath. During your consultation, we'll help you choose the option that best suits your hair goals, lifestyle, and maintenance preferences.",
      },
    ],
  },
  childrenSection: {
    eyebrow: "The Menu",
    heading: "Explore Our Wig Services",
    intro:
      "Designing a unit, and keeping it wearable once you have one — each booked individually. Prices are a starting point; your stylist confirms the final cost at consultation.",
  },
  ebook: {
    eyebrow: "Free Download",
    display: "The Wig & Weave",
    script: "Care Handbook",
    body: "Choosing a unit, protecting the hair underneath it, and making an install last — laid out step by step. Covers foundation prep, night routines, wash cycles for wigs and weaves, and how to tell when it is time to take it down.",
    image: "/images/guide-wigs.png",
    cta: "Explore The E-Book",
    href: "#",
  },
  cta: {
    display: "Reserve Your Space",
    heading: "Find the Right Weave Install for Your Hair Goals",
    body: "Not sure which option is right for you? Our stylists will recommend the installation that best suits your hair goals, texture, and lifestyle. Premium bundles, closures, and frontals are also available to complete your service.",
  },
  meta: {
    title: "Wigs | October Glory",
    description:
      "Sew-in weave installs at October Glory — leave-out and full closure, each built on a custom foundation and finished with a personalized cut.",
  },

};
