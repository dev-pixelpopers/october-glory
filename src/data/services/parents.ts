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
    cardImage: "/images/silk-press-card-img.jpg",
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
        "Experience a flawless silk press in Brooklyn designed to leave your natural hair smooth, sleek, and beautifully polished, without the use of chemical relaxers. At October Glory, every silk press is tailored to your hair's unique texture, condition, and goals, using professional techniques that prioritize healthy hair while delivering long-lasting results. Whether you want a quick silk press that still respects your hair’s integrity, or the full spa treatment where you get the works, we offer three levels of silk press service — each one designed with your hair in mind, but offering something different. Choose a classic Silk Press for a smooth, polished finish, add a Trim to keep your ends healthy, or go all in with a Treatment and Trim for the complete restorative experience.",
        "A silk press isn’t just for one type of natural hair journey. Maybe you’ve committed to going natural to keep your hair strong, but you still love to wear it straight — a silk press gets you there with zero chemicals. Or maybe you wear your curls proudly and only reach for a silk press once a quarter, as a way to check in on your hair’s health and length. Either way, there’s no wrong way to wear a silk press — it’s simply always in season.",
        "Explore the options below to find the silk press that's right for you.",
      ],
      image: "/images/SilkPress-01.webp",
      video: "/images/silk-press-intro.webm",
    },
    tiers: {
      eyebrow: "Choose Your Experience",
      heading: "Silk Press Tiers",
      items: [
        {
          name: "The Classic Silk Press",
          tagline: "Silk press only",
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
          name: "The Classic Silk Press+",
          tagline: "Silk press + Spa treatment",
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
          name: "The Glorious Silk Press",
          tagline: "Silk press + spa treatment + trim (full reset / most complete tier)",
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
      compare: {
        before: "/images/silk-press-before.png",
        after: "/images/silk-press-after.png",
        caption: "Split, thinning ends before — a clean, blunt perimeter after a precision trim.",
      },
    },
    comparison: {
      eyebrow: "At A Glance",
      heading: "Quick Comparison",
      columns: ["The Classic Silk Press", "The Classic Silk Press+", "The Glorious Silk Press"],
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
    childrenSection: {
      eyebrow: "The Menu",
      heading: "Other Natural Styles",
    },
    ebook: {
      eyebrow: "The Glorious",
      display: "Silk Press",
      script: "Guidebook",
      body: "Everything we tell our clients in the chair, written down — how to stretch your press between visits, what heat protection actually does, which products undo the work, and when a trim is overdue. Written by our stylists for hair like yours.",
      image: "/images/guide-silk.jpeg",
      cta: "Explore The E-Book",
      href: "#",
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
    cardImage: "/images/relaxers-card-img.jpg",
    cardBlurb:
      "Smooth relaxers and rich color transformations tailored to your personality and style.",
    slug: "relaxers-and-colors",
    cardTitle: "Color & Other Chemical Services",
    hero: {
      display: "Relaxers",
      script: "And Colors",
      intro:
        "Transform your look with our professional relaxer and coloring services — expertly formulated to deliver smooth, vibrant, and long-lasting results.",
      image: "/images/relaxers-colors-01.webp",
    },
    overview: {
      eyebrow: "The Service",
      heading: "Choose Your Relaxer Or Color Experience",
      body: [
        "Chemical relaxing and hair coloring are among the most transforming services at October Glory, and with good reason. They allow clients to overhaul their texture or express their personal style using expert formulas, precise timing, and custom care techniques instead of off-the-shelf treatments.",
        "Because every client's hair integrity and history are unique, we offer three tiers of relaxer and color services, each building on the last. Below is a breakdown of what is included in each tier so you can select the perfect service for your hair care goals (and your timeline).",
      ],
      image: "/images/relaxers-colors-01.webp",
    },
    tiers: {
      eyebrow: "Choose Your Experience",
      heading: "Relaxer & Color Tiers",
      items: [
        {
          name: "Essential Retouch & Tone",
          includes: [
            "A comprehensive scalp protective shield application to prevent irritation, dryness, and sensitivity prior to chemical processing",
            "A targeted root application or tonal refresher formulation applied strictly to new growth to preserve previously processed strands",
            "Custom processing timing monitored continuously based on your hair density and strength, protecting structural integrity while ensuring optimal chemical development",
            "A full neutralizing and balancing wash to restore scalp pH, remove chemical residues, and seal the hair cuticle smoothly",
            "Application of finishing leave-in formulas to help your relaxed or colored style maintain softness and shine throughout your daily routine",
          ],
          notIncluded:
            "The Essential Retouch & Tone does not include an in-depth elasticity assessment for a full bond-building spa treatment, steam infusion, or a precision trim. If your hair requires structural bond reconstruction or your ends need reshaping, one of our elevated options will serve you better.",
          bestFor:
            "Clients with healthy hair regrowth who seek a prompt, dependable, maintenance-focused chemical touch-up.",
        },
        {
          name: "Chemical Silk & Bond Treatment",
          featured: true,
          includes: [
            "A complete hair history and strand elasticity assessment, where we evaluate your cuticle porosity, structural strength, and scalp health",
            "A custom bond-building treatment or deep moisture repair mask, formulated specifically according to that detailed evaluation",
            "Dedicated steam processing, where moist warmth opens cuticle scales to let intensive protein and moisture complexes penetrate deep into the cortex rather than resting on top. This is what renders a steamed bond treatment far superior to a routine conditioner, as key nutrients reach the inner matrix where strands need reinforcement most",
            "A full chemical application, precision neutralize, and custom finish once the restorative complex has been thoroughly absorbed and rinsed",
            "Nourishing finishing products applied to seal cuticles and preserve your hair's vibrancy and smoothness for weeks to come",
          ],
          notIncluded:
            "This service does not include a haircut or split-end trim. If your perimeter ends are weathered, split, or uneven, those areas will still remain after your service, as this tier focuses on internal fiber repair and chemical balance, not altering length or shaping.",
          bestFor:
            "Clients whose hair feels porous, fragile, chemically treated, or in need of deep structural fortification alongside color or relaxing, with dedicated care for scalp wellness.",
        },
        {
          name: "The Glorious Transformation",
          includes: [
            "A thorough hair and scalp diagnosis to craft the exact chemical, color, and restorative formula tailored to your needs",
            "A custom bond-building or deep hydration spa treatment applied across the scalp and hair according to your individual assessment",
            "Time under the professional steamer using moist heat to open cuticle layers for complete, deep-level fiber conditioning",
            "A full master relaxer or custom dimensional color application processed and neutralized to perfection",
            "A precision haircut or custom trim to eliminate damaged ends, removing split, brittle, or chemically worn hair",
            "Finishing styling products applied to maintain color luster, silkiness, and humidity protection for your style",
          ],
          notIncluded:
            "Nothing is omitted from this package; it represents our ultimate all-in-one experience, uniting custom chemical work, intensive treatment, and precise perimeter shaping in a single session.",
          bestFor:
            "Clients due for a complete makeover, handling split or over-processed ends, or anyone wanting the absolute complete reset, combining chemical service, deep reconstruction, and shape maintenance in one appointment.",
        },
      ],
    },
    note: {
      eyebrow: "Good To Know",
      heading: "Why the Trim Matters",
      body: [
        "Think of your hair strand like a woven ribbon. If the tip of a ribbon begins to fray, that separation steadily travels upward along the fibers until the entire ribbon is compromised. Hair behaves identically; once ends split or suffer chemical wear, that damage advances up the shaft unless cut cleanly.",
        "The longer split ends remain unattended, the more length must eventually be removed to restore health. A regular precision trim stops damage from creeping upward, ensuring a smoother chemical finish, fuller perimeter ends, and a style that holds structure over time.",
        "We generally recommend a trim with chemical services every 8 to 12 weeks depending on how frequently you heat-style between salon appointments.",
      ],
    },
    comparison: {
      eyebrow: "At A Glance",
      heading: "Quick Comparison",
      columns: ["Essential Retouch & Tone", "Chemical Silk & Bond Treatment", "The Glorious Transformation"],
      rows: [
        { label: "Scalp protective shield", values: [true, true, true] },
        { label: "Restorative treatment", values: ["standard", "customized", "customized"] },
        { label: "Strand/hair assessment", values: [false, true, true] },
        { label: "Steam processing", values: [false, true, true] },
        { label: "Custom chemical process", values: [true, true, true] },
        { label: "Precision trim / cut", values: [false, false, true] },
      ],
      footnote:
        "Each service builds on the one before it, so clients can choose based on how much their hair needs beyond basic root touch-ups: chemical work alone, chemical work with structural treatment, or the complete transformation with a precision cut included.",
    },
    childrenSection: {
      eyebrow: "The Menu",
      heading: "Explore Our Services",
      intro:
        "Every relaxer and color service is booked from the menu below. Prices are a starting point — your stylist confirms the final cost at consultation.",
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
      heading: "Woven into your hair’s natural flow — never sitting on top of it.",
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
      heading: "Explore Our Services",
      intro:
        "Installs, consultations and unit care, each booked individually. Prices are a starting point — your stylist confirms the final cost at consultation.",
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
    overview: {
      eyebrow: "The Service",
      heading: "Choose Your Cut & Style Experience",
      body: [
        "A custom haircut and professional style is one of the most expressive services at October Glory, and for good reason. It reshapes your natural silhouette, frames your facial features, and breathes fresh life into your look using precision sectioning, elevation, and tailored technique instead of standard cuts.",
        "Because every client's curl pattern, density, and lifestyle are unique, we offer three tiers of haircutting and styling services, each building on the last. Below is a breakdown of what is included in each so you can select the ideal styling experience for your hair's needs (and your schedule).",
      ],
      image: "/images/Haircuts-And-Styles-03.webp",
    },
    tiers: {
      eyebrow: "Choose Your Experience",
      heading: "Haircut & Style Tiers",
      items: [
        {
          name: "Essential Cut & Blowout",
          includes: [
            "A cleansing shampoo session to remove excess oils, ambient buildup, and styling residue before cutting begins",
            "A light conditioning rinse to smooth cuticles and improve strand glide during sectioning and cutting",
            "Custom texturizing and sectioning applied based on your hair density and growth direction, ensuring balanced movement and weight distribution",
            "A complete blow-dry and classic style finish to leave your hair smooth, voluminous, and free of tangles",
            "Application of lightweight styling serums to help your cut hold shape and maintain shine through daily wear",
          ],
          notIncluded:
            "The Essential Cut & Blowout does not include an in-depth scalp analysis for a targeted spa treatment, steam processing, or complex thermal styling. If your hair requires intense hydration recovery or specialized heat styling, one of our higher tiers will serve you better.",
          bestFor:
            "Clients with manageable hair who want a swift, high-quality, routine haircut and classic blowout refresh.",
        },
        {
          name: "Designer Cut + Spa Treatment",
          featured: true,
          includes: [
            "A complete scalp and hair texture evaluation, where we establish exact moisture balance, fiber elasticity, and scalp requirements",
            "A targeted spa treatment or restorative mask, chosen specifically according to your diagnostic evaluation",
            "Dedicated steam processing, where moist therapeutic heat opens the hair cuticle, enabling deep penetration of nourishing lipids into the inner shaft rather than sitting on the outer layer. This is what renders a steamed treatment so superior to basic conditioning, as ingredients reach directly where damage exists",
            "A full customized haircut and master blowout once the treatment is thoroughly absorbed and rinsed",
            "Finishing polishes applied to protect your newly shaped style against humidity and ambient environmental friction",
          ],
          notIncluded:
            "This service does not include elaborate multi-step thermal styling or intricate updos. If you require advanced hot tool work or intricate event styling, our top tier addresses these needs in full.",
          bestFor:
            "Clients whose hair feels brittle, stressed, or lacks bounce before receiving a cut, and who want both scalp revitalizing and structural shape perfection.",
        },
        {
          name: "The Glorious Crown Cut & Style",
          includes: [
            "A comprehensive hair and scalp assessment to craft both the ideal therapeutic formula and your custom haircut silhouette",
            "A customized deep conditioning spa treatment applied across the hair and scalp based on your diagnostic results",
            "Time under the steamer using moist heat to open cuticles for maximum product absorption and fiber softening",
            "A full designer haircut tailored precisely to your head shape, facial contours, and natural hair movement",
            "A signature thermal style finish or precision hot-tool styling to create long-lasting waves, curls, or sleek elegance",
            "Luxury finishing products applied to lock in humidity resistance, brilliant shine, and body for your finished style",
          ],
          notIncluded:
            "Nothing is left out here; this is the complete signature haircut and style package, uniting structural care, expert cutting, and luxury thermal finishing in one appointment.",
          bestFor:
            "Clients due for a dramatic style change, dealing with uneven perimeter growth, or anyone who wants the complete luxury experience, treatment, cut, and high-end thermal styling in a single salon visit.",
        },
      ],
    },
    note: {
      eyebrow: "Good To Know",
      heading: "Why Precision Shaping Matters",
      body: [
        "Think of your hairstyle like a tailored garment. If the seams of a garment are uneven, the entire silhouette pulls and loses its structure over time. Hair functions in the exact same manner; when split ends and uneven lengths are left unchecked, weight distribution shifts and styling becomes difficult.",
        "Unmaintained ends cause tangling that pulls healthy strands down. Precision cutting removes dead weight, balances density, prevents split ends from climbing up the strand, and allows your style to hold its shape effortlessly between visits.",
        "We generally suggest a detailed trim or shape-up every 6 to 10 weeks depending on your growth rate and heat usage.",
      ],
    },
    comparison: {
      eyebrow: "At A Glance",
      heading: "Quick Comparison",
      columns: ["Essential Cut & Blowout", "Designer Cut + Spa Treatment", "The Glorious Crown Cut & Style"],
      rows: [
        { label: "Cleansing shampoo", values: [true, true, true] },
        { label: "Conditioning treatment", values: ["standard", "customized", "customized"] },
        { label: "Scalp/hair assessment", values: [false, true, true] },
        { label: "Steam processing", values: [false, true, true] },
        { label: "Designer haircut", values: [true, true, true] },
        { label: "Signature thermal styling", values: [false, false, true] },
      ],
      footnote:
        "Each service builds on the one before it, so clients can choose based on how much attention their hair needs beyond a simple trim: basic cutting, cut with deep spa care, or the total luxury transformation with advanced thermal styling included.",
    },
    childrenSection: {
      eyebrow: "The Menu",
      heading: "Explore Our Services",
      intro:
        "Cuts, ponytails and updos, each finished to suit your face shape. Prices are a starting point — your stylist confirms the final cost at consultation.",
    },
    cta: {
      display: "Reserve Your Space",
      heading: "Book Your Cut Or Style",
    },
    meta: {
      title: "Haircuts And Styles | October Glory",
      description:
        "Discover our expert haircut and styling services — Ponytail & Updo, Glory-Girl Precision Cut, Weave Precision Cut, Haircut Only, Haircut & Finish, New Look Haircut and Pro Consult. Book your appointment today.",
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
    overview: {
      eyebrow: "The Service",
      heading: "Choose Your Treatment Experience",
      body: [
        "An intensive restorative treatment is one of the foundational wellness offerings at October Glory, and for good reason. It revitalizes compromised strands, rebalances scalp health, and restores elasticity using clinical-grade nutrients and moisture systems instead of temporary surface silicones.",
        "Because every head of hair faces unique stressors, we offer three tiers of specialized treatment services, each building on the last. Below is a breakdown of what is included in each tier so you can choose the restorative care that fits your hair's requirements (and your schedule).",
      ],
      image: "/images/TREATMENTS-01.webp",
    },
    tiers: {
      eyebrow: "Choose Your Experience",
      heading: "Treatment Tiers",
      items: [
        {
          name: "Essential Moisture Therapy",
          includes: [
            "A gentle clarifying wash to clear product residue, hard water minerals, and environmental buildup prior to treatment",
            "A rich moisturizing therapy mask applied evenly from mid-shaft to ends to replenish essential hydration",
            "Controlled warm towel encapsulation to relax hair cuticles and promote soft product absorption",
            "A thorough cold-water rinse to lock in hydration, seal cuticle layers, and enhance natural shine",
            "Application of lightweight leave-in protectants to preserve moisture balance during natural or blow-dry drying",
          ],
          notIncluded:
            "The Essential Moisture Therapy does not include a comprehensive micro-scalp analysis for a fully customized mask, active steam processing, or an end-shaping trim. If your hair suffers from severe breakage or damaged ends, one of our elevated tiers will suit you better.",
          bestFor:
            "Clients with relatively healthy hair who need a quick, effective, routine moisture boost between major appointments.",
        },
        {
          name: "Advanced Steam Spa Therapy",
          featured: true,
          includes: [
            "A detailed scalp and strand diagnostic evaluation, where we identify whether your hair needs lipid moisture, amino acid protein, scalp soothing, or a custom blend",
            "A bespoke therapeutic compound mixed specifically based on your diagnostic results to target weakened areas",
            "Extended time under the hair steamer, where warm vapor opens the outer hair cuticle and expands pores. This allows therapeutic ingredients to enter deep into the inner cortex rather than resting on top. This is why steamed therapy is far more effective than standard conditioning, as nutrients reach the core where elasticity is restored",
            "A thorough scalp massage and cool rinse once the treatment has fully infused into the hair shaft",
            "Protective styling serums applied to lock in deep hydration and guard against thermal or environmental stress",
          ],
          notIncluded:
            "This service does not include a perimeter trim or cut. If your ends are frayed, split, or damaged, those ends will remain after treatment, as this tier focuses purely on moisture restoration and follicle health, not length maintenance.",
          bestFor:
            "Clients whose hair is severely dry, chemically damaged, prone to breakage, or suffering from scalp dryness, and who require targeted deep-steam therapy.",
        },
        {
          name: "The Glorious Renewal Experience",
          includes: [
            "A comprehensive scalp and strand diagnostic assessment to determine your ideal customized formulation",
            "A bespoke therapeutic treatment compound mixed and applied directly across the scalp and hair strands",
            "Dedicated steam processing with therapeutic moist heat to open cuticle scales and infuse active ingredients deep into the shaft",
            "A thorough scalp massage and refreshing rinse to stimulate circulation and seal cuticles",
            "A precision trim to remove dead, frayed, or split ends, eliminating brittle sections that compromise hair health",
            "Finishing luxury serums applied to lock in deep nutrition and maintain smooth, brilliant shine",
          ],
          notIncluded:
            "Nothing is omitted from this package; it is our complete therapeutic reset, uniting scalp therapy, steam repair, and split-end elimination in one restful session.",
          bestFor:
            "Clients needing a total hair reset, recovering from protective styling, dealing with split ends, or wanting complete therapeutic care and maintenance in a single visit.",
        },
      ],
    },
    note: {
      eyebrow: "Good To Know",
      heading: "Why the Trim Matters",
      body: [
        "Think of a hair strand like a tightly spun rope. If the tip of a rope begins to unlay, the unravelling slowly progresses up the entire line until the rope loses its integrity. Hair functions the same way; once an end splits, that tear travels up the strand if not removed.",
        "The longer split ends are left alone, the more length must eventually be cut to restore vitality. A regular trim stops damage from spreading, ensuring your treatments yield maximum strength, fuller ends, and styles that last longer.",
        "We generally recommend pairing a trim with your treatment every 8 to 12 weeks to keep your hair growing long and strong.",
      ],
    },
    comparison: {
      eyebrow: "At A Glance",
      heading: "Quick Comparison",
      columns: ["Essential Moisture Therapy", "Advanced Steam Spa Therapy", "The Glorious Renewal Experience"],
      rows: [
        { label: "Clarifying wash", values: [true, true, true] },
        { label: "Therapeutic mask", values: ["standard", "customized", "customized"] },
        { label: "Scalp/hair assessment", values: [false, true, true] },
        { label: "Steam processing", values: [false, true, true] },
        { label: "Scalp massage", values: [false, true, true] },
        { label: "Precision trim", values: [false, false, true] },
      ],
      footnote:
        "Each service builds on the one before it, so clients can choose based on how much attention their hair needs beyond basic conditioning: surface moisture, deep steam restoration, or the complete renewal with split-end maintenance included.",
    },
    childrenSection: {
      eyebrow: "The Menu",
      heading: "Explore Our Services",
      intro:
        "Each treatment is chosen for your hair after a scalp and hair assessment. Prices are a starting point — your stylist confirms the final cost at consultation.",
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
