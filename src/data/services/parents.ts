import type { ServiceParent } from "./types";

/**
 * The five main services, in the order they appear on /services.
 *
 * Each one is served at /services/<slug>. Reordering this array reorders the
 * boxes on the index, the cards in the menu panel, and everything else that
 * lists services — they all read from here.
 *
 * Child pages live in ./children.ts and point back at these by slug.
 */
export const serviceParents: ServiceParent[] = [
  {
    cardImage: "/images/SilkPress-01.webp",
    cardBlurb:
      "Sleek, smooth and salon-fresh — achieved with heat, tension and technique instead of chemicals.",
    slug: "silk-press",
    cardTitle: "Silk Press",
    price: "$100",
    hero: {
      display: "Silk",
      script: "Press",
      intro:
        "Smooth, sleek and beautifully polished — without the use of chemical relaxers.",
      image: "/images/SilkPress-01.webp",
    },
    overview: {
      eyebrow: "The Service",
      heading: "Choose Your Silk Press Experience",
      body: [
        "Experience a flawless silk press in Brooklyn designed to leave your natural hair smooth, sleek, and beautifully polished, without the use of chemical relaxers. At October Glory, every silk press is tailored to your hair's unique texture, condition, and goals, using professional techniques that prioritize healthy hair while delivering long-lasting results. Because every client's hair is different, we offer three levels of silk press services, each designed to provide the right balance of care, maintenance, and styling.",
        "Every head of hair is unique, which is why we offer more than one natural hair silk press in Brooklyn. Whether you're looking for a simple style refresh, added moisture and repair, or a complete healthy hair experience, each silk press service is tailored to your hair's condition and long-term goals.",
        "Explore the options below to find the silk press that's right for you.",
      ],
      image: "/images/SilkPress-01.webp",
    },
    tiers: {
      eyebrow: "Choose Your Experience",
      heading: "Silk Press Tiers",
      items: [
        {
          name: "Classic Silk Press",
          tagline: "Smooth, Sleek Hair — Simply & Beautifully Styled",
          includes: [
            "A deep cleanse to remove buildup, excess oil, and product residue before styling begins",
            "A nourishing conditioning treatment to restore moisture and improve manageability",
            "Customized heat settings based on your hair's texture and density to help protect the integrity of your strands while achieving a smooth finish",
            "A professional silk press for sleek, shiny, frizz-free results",
            "Finishing products to help maintain smoothness and extend the life of your style",
          ],
          notIncluded:
            "The Classic Silk Press does not include a scalp and hair assessment, targeted spa treatment, steam therapy, or a precision trim. If your hair would benefit from additional moisture, repair, or maintenance, one of our upgraded silk press experiences may be a better fit.",
          bestFor:
            "Clients with healthy, well-maintained hair who want a polished, low-maintenance silk press that's smooth, lightweight, and beautifully finished.",
        },
        {
          name: "Silk Press + Spa Treatment",
          tagline: "Healthy Hair Starts Before the Style",
          featured: true,
          includes: [
            "A personalized scalp and hair assessment to determine whether your hair needs moisture, protein, scalp care, or a combination of treatments",
            "A customized spa treatment or deep conditioner applied to the scalp and/or hair based on your assessment",
            "Steam therapy to gently open the hair cuticle, allowing the treatment to penetrate deeply into the hair shaft instead of sitting on the surface — this is what makes a steamed treatment so much more effective than a standard conditioner, since the product actually gets absorbed where your hair needs it most",
            "A professional silk press and finish once your treatment has been completed",
            "Professional finishing products to help maintain a smooth, sleek style for longer",
          ],
          notIncluded:
            "This service does not include a precision trim. While your hair will feel healthier, softer, and more manageable, damaged or split ends will remain. If your ends need attention, we recommend upgrading to our Deluxe Silk Press experience.",
          bestFor:
            "Clients with dry, dull, over-processed, or moisture-deprived hair who want to improve the overall health of their hair and scalp while enjoying a smooth, polished silk press.",
        },
        {
          name: "The Glorious Express",
          tagline: "The Complete Healthy Hair Experience",
          includes: [
            "A personalized scalp and hair assessment to determine your hair's specific needs",
            "A customized spa treatment or deep conditioner applied to the scalp and/or hair",
            "Steam therapy to gently open the hair cuticle, allowing the treatment to deeply nourish and hydrate each strand",
            "A professional silk press for smooth, sleek, and polished results",
            "A precision trim to remove split, damaged, or brittle ends",
            "Professional finishing products to help maintain shine and extend the life of your silk press",
          ],
          notIncluded:
            "Nothing. The Glorious Express is our most comprehensive silk press experience, combining customized treatment, precision maintenance, and professional styling in one service.",
          bestFor:
            "Clients whose hair is due for a trim, those experiencing split or damaged ends, or anyone looking for a complete healthy hair reset with treatment, maintenance, and a flawless silk press, all in a single appointment.",
        },
      ],
    },
    note: {
      eyebrow: "Good To Know",
      heading: "Why the Trim Matters",
      body: [
        "Healthy hair starts with healthy ends. Think of your hair like a shoelace — once the protective tip wears away, the strands begin to unravel. Hair behaves much the same way. When split ends are left untreated, the damage continues traveling up the hair shaft, often leading to more breakage and the need for a larger cut later.",
        "Regular trims help prevent this damage from spreading, keeping your hair looking healthier while allowing your silk press to appear smoother, shinier, and better maintained.",
        "Although we generally recommend a trim every three months, the ideal schedule depends on how often you heat-style or manipulate your hair between visits.",
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
    cta: {
      heading: "Book Your Silk Press Appointment",
    },
    meta: {
      title: "Silk Press | October Glory",
      description:
        "Three tiers of silk press at October Glory — Classic, Silk Press + Spa Treatment, and The Glorious Express. Sleek, smooth, chemical-free styling.",
    },
  },
  {
    cardImage: "/images/relaxes1.webp",
    cardBlurb:
      "Smooth relaxers and rich color transformations tailored to your personality and style.",
    slug: "relaxers-and-colors",
    cardTitle: "Relaxers & Colors",
    hero: {
      display: "Relaxers",
      script: "And Colors",
      intro:
        "Transform your look with our professional relaxer and coloring services — expertly formulated to deliver smooth, vibrant, and long-lasting results.",
      image: "/images/relaxers-colors-01.webp",
    },
    menu: {
      eyebrow: "The Menu",
      heading: "Relaxer & Color Menu",
      intro:
        "Every relaxer and color service is booked from the menu below. Prices are a starting point — your stylist confirms the final cost at consultation.",
      items: [
        { name: "Relaxer Touch Up", price: "$100", image: "/images/relaxers-colors-01.webp" },
        { name: "Virgin Relaxer", price: "$225", image: "/images/relaxers-colors-02.webp" },
        { name: "Color Retouch", price: "$125", image: "/images/relaxers-colors-03.webp" },
        { name: "Single Process", price: "$120", image: "/images/relaxers-colors-04.webp" },
        { name: "Double Process", price: "$350", image: "/images/relaxers-colors-05.webp" },
        { name: "Half-Head Highlights", price: "$160", image: "/images/relaxers-colors-06.webp" },
        { name: "Full Highlights Or Foilayage", price: "$300", image: "/images/relaxers-colors-07.webp" },
        { name: "Crown Lights", price: "$85", image: "/images/relaxers-colors-08.webp" },
        { name: "Color Correction", price: "$250", image: "/images/relaxers-colors-09.webp" },
        { name: "Glorious Boost", price: "$120", image: "/images/relaxers-colors-10.webp" },
      ],
    },
    cta: {
      display: "Reserve Your Space",
      heading: "Book Your Relaxer Or Color",
    },
    meta: {
      title: "Relaxers And Colors | October Glory",
      description:
        "Discover our professional relaxer and coloring services — Relaxer Touch-Up, Virgin Relaxer, Full Color, Highlights, Color Correction, Gloss Treatment and more. Book your appointment today.",
    },
  },
  {
    cardImage: "/images/waves1.webp",
    cardBlurb:
      "Custom units and sew-in installs built on the health of your natural hair — and finished with a cut made for your face.",
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
        "Looking for a flawless weave install in Brooklyn? At October Glory, every installation is customized to your hair, lifestyle, and desired look, not a one-size-fits-all service. We begin by prioritizing the health of your natural hair before creating a seamless, natural-looking finish tailored to your features. Hair is not included with this service, but premium bundles, closures, and frontals are available for purchase, ensuring you leave with everything needed for beautiful, long-lasting results.",
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
    cta: {
      display: "Reserve Your Space",
      heading: "Find the Right Weave Install for Your Hair Goals",
      body: "Not sure which option is right for you? Our stylists will recommend the installation that best suits your hair goals, texture, and lifestyle. Premium bundles, closures, and frontals are also available to complete your service.",
    },
    meta: {
      title: "Wigs & Extensions | October Glory",
      description:
        "Sew-in weave installs at October Glory — leave-out and full closure, each built on a custom foundation and finished with a personalized cut.",
    },
  },
  {
    cardImage: "/images/haircuts1.webp",
    cardBlurb:
      "Precision haircuts and modern styling crafted for every face shape and vibe.",
    slug: "haircuts-and-styles",
    cardTitle: "Haircuts & Styles",
    hero: {
      display: "Haircuts",
      script: "& Styles",
      intro:
        "From precision cuts to glamorous updos and ponytails — our expert stylists deliver flawless results tailored to your unique look.",
      image: "/images/Haircuts-And-Styles-03.webp",
    },
    menu: {
      eyebrow: "The Menu",
      heading: "Haircut & Styling Menu",
      intro:
        "Cuts, ponytails and updos, each finished to suit your face shape. Prices are a starting point — your stylist confirms the final cost at consultation.",
      items: [
        { name: "Glory-Girl Ponytail", price: "$165", image: "/images/Haircuts-And-Styles-01.webp" },
        { name: "Glory-Girl Updos", price: "$150", image: "/images/Haircuts-And-Styles-02.webp" },
        { name: "Glory-Girl Precision Cut", price: "$150", image: "/images/Haircuts-And-Styles-03.webp" },
        { name: "Weave Precision Cut", price: "$100", image: "/images/Haircuts-And-Styles-04.webp" },
        { name: "Haircut Only", price: "$75", image: "/images/Haircuts-And-Styles-05.webp" },
        { name: "Haircut & Finish", price: "$125", image: "/images/Haircuts-And-Styles-06.webp" },
        { name: "New Look Haircut", price: "$120", image: "/images/Haircuts-And-Styles-07.webp" },
        { name: "Pro Consult", price: "$50", image: "/images/salon-image.webp" },
      ],
    },
    cta: {
      display: "Reserve Your Space",
      heading: "Book Your Cut Or Style",
    },
    meta: {
      title: "Haircuts And Styles | October Glory",
      description:
        "Discover our expert haircut and styling services — Glory-Girl Ponytail, Updos, Precision Cut, Weave Precision Cut, Haircut & Finish, New Look Haircut and more. Book your appointment today.",
    },
  },
  {
    cardImage: "/images/hairsclapimg.webp",
    cardBlurb:
      "Deep nourishment and repair treatments that restore health, shine, and strength.",
    slug: "treatments",
    cardTitle: "Treatments",
    hero: {
      display: "Treat",
      script: "ments",
      intro:
        "Restore, repair, and rejuvenate your hair with our premium treatment services — designed to nourish from root to tip.",
      image: "/images/TREATMENTS-01.webp",
    },
    menu: {
      eyebrow: "The Menu",
      heading: "Treatment Menu",
      intro:
        "Each treatment is chosen for your hair after a scalp and hair assessment. Prices are a starting point — your stylist confirms the final cost at consultation.",
      items: [
        { name: "Scalp Relief", price: "$50", image: "/images/TREATMENTS-01.webp" },
        { name: "The Upmost Hydration", price: "$50", image: "/images/TREATMENTS-02.webp" },
        { name: "Protein Moisture Pack", price: "$55", image: "/images/TREATMENTS-03.webp" },
        { name: "Bond Builder", price: "$65", image: "/images/TREATMENTS-04.webp" },
      ],
    },
    cta: {
      display: "Reserve Your Space",
      heading: "Book Your Treatment",
    },
    meta: {
      title: "Treatments | October Glory",
      description:
        "Explore our premium hair treatment services — Scalp Relief, The Upmost Hydration, Protein Moisture Pack, Bond Builder and more. Book your appointment today.",
    },
  },
];
