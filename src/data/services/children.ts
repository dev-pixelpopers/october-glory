import type { ServiceChild } from "./types";

/**
 * Every child service on the site, in one list.
 *
 * To add one: append an object here and set `parent` to the slug of the main
 * service it belongs under. Nothing else needs touching — the route, the
 * parent page's "keep exploring" strip, and the menu all read from this file.
 *
 * Served at /services/<parent>/<slug>.
 */
export const serviceChildren: ServiceChild[] = [
  {
    parent: "haircuts-and-styles",
    cardImage: "/images/RodSet-01.webp",
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
      heading: "Choose Your Rod Set Experience",
      body: [
        "A rod set in Brooklyn is a beautiful, heat-conscious alternative to traditional curling methods. Instead of using hot tools to create definition, wet hair is carefully wrapped around flexi rods or curl rods and dried in place, creating smooth, consistent curls from root to tip.",
        "This service is ideal for clients who want to reduce heat and tension or are managing heat damage, breakage, or uneven curl patterns. Each rod set is customized to support a healthier, more uniform curl texture. Like our silk press service, rod sets are available in multiple tiers, allowing you to choose the level of care that best meets your hair's needs.",
        "Healthy hair isn't one-size-fits-all. That's why every rod set in Brooklyn at October Glory is available in multiple service tiers. From our Classic Rod Set to our Deluxe Rod Set experience, each option is designed to provide the right level of treatment, maintenance, and styling based on your hair's current condition and long-term goals.",
      ],
      image: "/images/RodSet-01.webp",
    },
    tiers: {
      eyebrow: "Choose Your Experience",
      heading: "Rod Set Tiers",
      items: [
        {
          name: "Classic Rod Set",
          tagline: "Beautiful, Defined Curls; Simply & Beautifully Done",
          includes: [
            "A thorough cleanse to remove product buildup and prepare your hair for setting",
            "Hair carefully detangled and sectioned to ensure even, consistent results throughout",
            "Small, precise sections wrapped around each rod using end papers to create smooth, frizz-free ends",
            "Complete drying time to fully set each curl, an essential step for achieving long-lasting shape, shine, and definition",
            "A finish of soft, shiny, uniform curls from root to tip",
          ],
          notIncluded:
            "The Classic Rod Set does not include a scalp and hair assessment, deep conditioning treatment, or precision trim. If your hair needs additional moisture, scalp care, or your ends are damaged or overdue for a trim, one of our upgraded rod set experiences may be a better fit.",
          bestFor:
            "Clients with healthy, well-maintained hair who want beautiful, uniform curls with minimal heat and manipulation, or anyone looking for a break from frequent heat styling while maintaining a polished, defined look.",
        },
        {
          name: "Rod Set + Spa Treatment",
          tagline: "Deep Hydration for Healthier, Longer-Lasting Curls",
          includes: [
            "A personalized scalp and hair assessment to determine your hair's specific needs",
            "A customized spa treatment or deep-conditioning service applied to the scalp and/or hair",
            "A thorough cleanse and blow-dry to prepare the hair for long-lasting curl definition",
            "Small, precise sections wrapped around each rod using end papers for smooth, uniform curls from root to tip",
            "Our signature moisturizing setting foam to lock in hydration while creating soft, defined curls",
            "Complete drying time to ensure every curl is fully set for lasting shape, shine, and definition",
            "A finish of soft, shiny, moisturized curls that look healthy and feel beautifully hydrated",
          ],
          notIncluded:
            "This service does not include a precision trim. While your hair will feel healthier, softer, and more moisturized, damaged or split ends will remain. If your ends need attention, we recommend adding a trim or choosing our Deluxe Rod Set experience.",
          bestFor:
            "Clients with dry, over-processed, or moisture-deprived hair, as well as anyone recovering from heat damage who wants their hair to be treated, restored, and styled in one appointment.",
        },
        {
          name: "Rod Set + Trim",
          tagline: "Healthy Ends. Longer-Lasting Curls.",
          includes: [
            "Everything included in the Classic Rod Set",
            "A precision trim to remove split ends, damaged hair, and uneven ends before or after your rod set",
          ],
          notIncluded:
            "This service does not include a scalp and hair assessment or a deep-conditioning treatment. If your hair also needs added moisture or scalp care, our Deluxe Rod Set offers the complete healthy hair experience.",
          bestFor:
            "Clients with healthy hair whose ends are due for a trim, or anyone looking to maintain stronger, healthier hair while extending the life and shape of their rod set.",
        },
        {
          name: "Deluxe Rod Set",
          tagline: "The Complete Healthy Hair Experience",
          featured: true,
          includes: [
            "A personalized scalp and hair assessment to determine your hair's unique needs",
            "A customized spa treatment or deep-conditioning service for added moisture and nourishment",
            "A thorough cleanse and blow-dry to prepare the hair for long-lasting curl definition",
            "Small, precise sections wrapped around each rod using end papers for smooth, uniform curls from root to tip",
            "Our signature moisturizing setting foam to create soft, hydrated, and beautifully defined curls",
            "A precision trim to remove split or damaged ends for healthier-looking hair",
            "Complete drying time to ensure every curl is fully set for maximum longevity",
            "A finish of soft, shiny, healthy curls on hair that has been treated, trimmed, and professionally styled in one appointment",
          ],
          notIncluded:
            "Nothing. This is our most comprehensive rod set experience, combining healthy hair treatments, precision maintenance, and professional styling in one service.",
          bestFor:
            "Clients looking for a complete healthy hair reset, including deep moisture, defined curls, and freshly trimmed ends. It's the perfect option for anyone who wants to restore the health of their hair while enjoying long-lasting, beautifully defined curls.",
        },
      ],
    },
    note: {
      eyebrow: "Good To Know",
      heading: "Why the Trim Matters",
      body: [
        "Split ends don't stay in one place. Left untreated, they continue traveling up the hair shaft, much like a shoelace that unravels once the plastic tip wears away.",
        "Regular trims help prevent further damage, improve the overall appearance of your hair, and allow your curls to look smoother, healthier, and more defined.",
        "While we generally recommend trimming every three months, the ideal schedule depends on how often you heat-style, manipulate, or chemically process your hair.",
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
  },
  {
    parent: "haircuts-and-styles",
    cardImage: "/images/FlatTwist.jpg",
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
  },
  {
    parent: "haircuts-and-styles",
    cardImage: "/images/wash&go.jpg",
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
  },
  {
    parent: "haircuts-and-styles",
    cardImage: "/images/braiddown.jpg",
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
  },
  {
    parent: "haircuts-and-styles",
    cardImage: "/images/2-strand-twist.jpg",
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
  },
  {
    parent: "haircuts-and-styles",
    cardImage: "/images/naturalfrenchroll.jpg",
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
  },
  {
    parent: "haircuts-and-styles",
    cardImage: "/images/Haircuts-And-Styles-02.webp",
    slug: "ponytail-and-updo",
    cardTitle: "Ponytail & Updo",
    hero: {
      display: "Ponytail",
      script: "& Updo",
      intro:
        "At October Glory, our updo hairstyles in Brooklyn are designed to elevate every occasion.",
      image: "/images/Haircuts-And-Styles-02.webp",
    },
    overview: {
      heading: "Your Styling Experience",
      body: [
        "From elegant evenings and weddings to proms, graduations, and everyday glamour, each style is thoughtfully customized to complement your hair, personal style, and the event you're celebrating. Whether you prefer a sleek, polished finish or a soft, romantic look, our expert styling ensures you'll leave feeling confident, beautiful, and ready for every special moment.",
        "Every ponytail and updo appointment begins with the same priority: healthy hair. Whether you're booking a sleek ponytail in Brooklyn, NY or another elegant style, we prepare your hair to ensure beautiful, long-lasting results.",
        "Your appointment includes:",
      ],
      bullets: [
        "A thorough cleanse to remove buildup, excess oil, and product residue, creating the perfect foundation for styling.",
        "A nourishing conditioning treatment to restore moisture, softness, and manageability.",
        "Blow-drying and pressing, or styling in your natural texture, depending on the look you want. Some styles require a smooth, polished finish, while others are designed to enhance your natural curls or coils.",
        "A customized ponytail or updo, styled to suit your hair, personal style, and the occasion.",
        "Professional finishing products applied throughout the service to help maintain shine, hold, and longevity.",
      ],
      image: "/images/Haircuts-And-Styles-02.webp",
    },
    sections: [
      {
        heading: "Signature Styles We Love",
        body: [
          "Every ponytail and updo is customized to your vision, but there are a few signature styles our clients request time and time again. Whether you're looking for a timeless finish or something more modern, we create special occasion hairstyles in Brooklyn that are tailored to your hair, your features, and the moment you're celebrating.",
        ],
        image: "/images/Haircuts-And-Styles-03.webp",
      },
      {
        heading: "The Sleek Ponytail",
        body: [
          "Our sleek ponytail in Brooklyn, NY is a timeless favorite for weddings, formal events, and elegant evenings out. Achieving a truly polished finish takes more than simply pulling the hair back, it requires expert smoothing, precision styling, carefully laid edges, and a seamless wrapped base for a flawless, long-lasting look.",
        ],
        image: "/images/Haircuts-And-Styles-04.webp",
      },
      {
        heading: "The Bubble Pony",
        body: [
          "A playful take on the classic ponytail, the Bubble Pony adds volume, texture, and dimension by creating soft, rounded sections throughout the length of the ponytail. It's a stylish choice for proms, parties, birthdays, and any occasion where you want a modern look that stands out.",
          "Both styles can be fully customized in volume, finish, and overall shape to complement your personal style and the occasion.",
        ],
        image: "/images/Haircuts-And-Styles-07.webp",
      },
      {
        heading: "Bridal Updos & Special Event Styling",
        body: [
          "Your hairstyle should be just as unforgettable as the occasion itself. Our bridal updos in Brooklyn are thoughtfully designed to complement your dress, veil, face shape, and personal style while lasting beautifully throughout your celebration.",
          "If your dream look requires additional length or fullness, we can incorporate premium hair to create a seamless finish. Hair is not included with this service and is available at an additional cost. During your consultation, your stylist will recommend the ideal texture, length, and volume to ensure your bridal or special occasion style looks natural, secure, and camera-ready from every angle.",
        ],
        image: "/images/bridal-slider-02.webp",
      },
      {
        heading: "Why a Consultation Makes All the Difference",
        body: [
          "Every head of hair is unique, which means the right approach for one client's updo hairstyle in Brooklyn may not be the best choice for another. That's why we always recommend a consultation before your appointment, especially if you're considering adding hair or envisioning a more intricate style.",
          "During your consultation, we'll discuss:",
        ],
        bullets: [
          "The occasion you're preparing for and the overall look you want to achieve.",
          "Whether your natural texture, a blowout, or a silk press will create the best foundation for your style.",
          "If additional hair is needed for your desired length or volume, and which option will blend most naturally.",
          "How long you'll need your style to last, so we can recommend the right techniques and professional products.",
        ],
        image: "/images/Haircuts-And-Styles-05.webp",
      },
      {
        heading: "Professional Products, Lasting Results",
        body: [
          "Taking the time to plan ahead allows us to create a style that not only looks beautiful when you leave the salon but stays polished and secure throughout your event.",
          "The products we use are just as important as the styling itself. At October Glory, we carefully select professional-grade styling products that help smooth the hair, control frizz, and provide long-lasting hold without leaving your hair feeling stiff, sticky, or weighed down.",
          "Our product choices are designed to protect your style from humidity and everyday wear while maintaining a polished, natural-looking finish. Combined with expert styling techniques, they help your ponytail or updo look beautiful for longer and make it easier to maintain between appointments.",
        ],
        image: "/images/Haircuts-And-Styles-06.webp",
      },
      {
        heading: "Who This Service Is Perfect For",
        body: [
          "Our updo hairstyles in Brooklyn are perfect for anyone looking for a polished, confidence-boosting style without committing to a completely new look. Whether you're attending a wedding, celebrating graduation, heading to a formal event, or simply want your hair to feel elevated for the week ahead, we'll create a style that's uniquely yours.",
          "Every ponytail and updo is fully customized, from the level of sleekness and added length to the overall shape and finish. Come with a vision, or let our expert stylists guide you toward the perfect look. Either way, we'll make sure you leave feeling confident, beautiful, and ready for every occasion.",
        ],
        image: "/images/Haircuts-And-Styles-01.webp",
      },
    ],
    note: {
      heading: "Keep Your Style Looking Its Best",
      body: [
        "With the right care, your ponytail or updo from October Glory can last up to two weeks while maintaining its polished finish. To help extend the life of your style, we recommend:",
        "Wrap your hair at night with a satin or silk scarf to minimize friction and reduce frizz. Avoid excessive touching or restyling, as this can loosen the style and create flyaways.",
        "Use a lightweight edge control or smoothing product for quick touch-ups between appointments. Protect your hair from excess moisture and humidity whenever possible to help preserve your finished look.",
        "Following these simple aftercare tips will help keep your style looking fresh, polished, and event-ready for as long as possible.",
      ],
    },
    cta: {
      heading: "Book Your Ponytail & Updo Appointment",
    },
    meta: {
      title: "Ponytail & Updo Services | October Glory",
      description:
        "Updo hairstyles in Brooklyn at October Glory — sleek ponytails, the Bubble Pony, and bridal updos, customized to your hair, your style, and the occasion.",
    },
  },
  {
    parent: "wigs-and-extensions",
    cardImage: "/images/Weaves-And-Extensions-04.webp",
    slug: "custom-wig-design",
    cardTitle: "Custom Wig Design",
    hero: {
      display: "Custom Wig",
      script: "Design",
      intro:
        "More than purchasing a wig — a personalized experience created entirely around you.",
      image: "/images/Weaves-And-Extensions-04.webp",
    },
    overview: {
      heading: "Custom Wig Design",
      body: [
        "At October Glory, our Custom Wig Design service is more than purchasing a wig, it's a personalized experience created entirely around you. Every detail, from the hair selection to the final cut and style, is customized to achieve a flawless, natural-looking result.",
        "If you're looking for custom wigs in Brooklyn, we design every custom wig unit to match your style, lifestyle, and hair goals. Whether you want a protective style, a fresh new look, or a custom wig for hair loss in Brooklyn, we're here to create a unit you'll wear with confidence.",
      ],
      image: "/images/Weaves-And-Extensions-04.webp",
    },
    sections: [
      {
        heading: "The Consultation",
        body: [
          "Every custom wig unit in Brooklyn, NY begins with a one-on-one consultation because no two clients, or their hair goals, are the same. At October Glory, we believe the best custom wigs in Brooklyn start with understanding you, your lifestyle, and the look you want to achieve.",
          "During your consultation, we'll carefully discuss every detail of your custom design, including:",
        ],
        bullets: [
          "Length — The ideal length for your finished unit.",
          "Color — A shade or custom blend that complements your skin tone and personal style.",
          "Cut — The shape and finish that best suits your features.",
          "Texture — Hair selected to blend naturally with your own hair and create a seamless, realistic look.",
        ],
        image: "/images/GLORIOUS-PACKAGES-01.webp",
      },
      {
        heading: "Handcrafted To Your Measurements",
        body: [
          "Once we've finalized your vision, we take precise head measurements to ensure your wig is handcrafted specifically for you, not a standard size. This personalized fitting process is what helps every custom unit feel comfortable, secure, and naturally yours.",
          "After your consultation, you'll receive a detailed quote. A 50% deposit secures your order and allows us to begin crafting your custom wig. Once it's complete, we'll schedule your installation appointment and prepare your unit for its final customization.",
        ],
        image: "/images/GLORIOUS-PACKAGES-02.webp",
      },
      {
        heading: "Install Day",
        body: [
          "Installation day is where your vision truly comes to life.",
          "Your wig will arrive fully constructed according to your chosen length, color, and texture. During your appointment, we complete the final customization by trimming, shaping, and styling the unit while it's being worn. This allows us to personalize the finished look to your facial features and create natural movement that's unique to you.",
          "If you've chosen one of our glueless wigs in Brooklyn, we'll also show you how to achieve a secure, comfortable fit so you can confidently wear your unit every day.",
          "Before you leave, we'll also walk you through everything you need to confidently care for your new unit, including:",
        ],
        bullets: [
          "How to put your wig on and remove it properly.",
          "How to store it between wears.",
          "The best way to wash and condition it.",
          "Styling tips and ongoing maintenance to help extend its lifespan.",
        ],
        image: "/images/GLORIOUS-PACKAGES-03.webp",
      },
      {
        heading: "The Hair We Use",
        body: [
          "The quality of your wig begins with the quality of the hair.",
          "At October Glory, we source premium human hair from Southeast Asia, primarily Cambodian and Filipino hair. We carefully selected these hair types because of their low luster, fuller density, and ability to closely resemble the natural texture of many of our clients' hair. The result is a finished unit that looks realistic, blends beautifully, and never appears overly shiny or artificial.",
          "Every client is different, which is why we thoughtfully match the hair's texture and density to your individual needs. This personalized approach allows us to create a seamless, natural-looking finish.",
          "When custom color is requested, we use a luxury professional color line enriched with nourishing oils and lipids. Unlike many traditional color systems that can leave hair dry and brittle, our coloring process helps maintain softness, moisture, and shine while delivering rich, vibrant results.",
        ],
        image: "/images/Weaves-And-Extensions-03.webp",
      },
      {
        heading: "Built to Last",
        body: [
          "A custom wig is an investment, and with the right care, it should last.",
          "At October Glory, our custom wigs in Brooklyn are crafted using premium-quality human hair, expert construction techniques, and professional coloring methods to ensure exceptional longevity. With proper maintenance, your custom wig can last up to two years while maintaining its natural look, softness, and durability.",
          "To help protect your investment, we also offer dedicated Wig Maintenance services designed to keep your unit clean, refreshed, and looking its best throughout its lifespan.",
        ],
        image: "/images/GLORIOUS-PACKAGES-04.webp",
      },
      {
        heading: "Why Clients Choose a Custom Wig",
        body: [
          "Every client's story is different, which is why every custom wig is designed with their unique needs in mind. Many of our clients choose a custom wig to:",
        ],
        bullets: [
          "Give their natural hair time to rest, recover, and grow without daily manipulation.",
          "Try a new haircut or style without making permanent changes.",
          "Experiment with a new hair color while protecting their natural hair.",
          "Enjoy added versatility for work, travel, or special occasions.",
          "Restore confidence during hair loss caused by alopecia, medical treatments, or other conditions.",
        ],
        image: "/images/Weaves-And-Extensions-08.webp",
      },
      {
        heading: "A Custom Wig for Hair Loss",
        body: [
          "For clients searching for a custom wig for hair loss in Brooklyn, we understand that a wig is more than a hairstyle, it can be an important part of feeling like yourself again. Every unit is thoughtfully designed to provide comfort, confidence, and a natural appearance.",
          // From the PDF, which the rewrite dropped:
          "Many clients facing hair loss from conditions like alopecia or hair loss related to cancer treatment choose a custom wig replicated to match their natural hair, helping them feel like themselves again.",
          "Whatever your reason, our Custom Wig Design service offers the freedom to protect your natural hair while enjoying a look that's completely your own.",
        ],
      },
      {
        heading: "The Ultimate Protective Style",
        body: [
          "We believe a custom wig is one of the most versatile and effective protective styles available.",
          "Unlike many traditional installations, our glueless wigs in Brooklyn are designed without the need for glue or adhesives. Each unit features an adjustable drawstring construction that creates a secure, comfortable fit while lying flat against the head for an incredibly natural appearance.",
          "Your wig can be worn in two ways:",
        ],
        bullets: [
          "Behind your natural hairline, allowing a small portion of your own hairline to blend seamlessly with the unit.",
          "In front of the hairline, fully covering your natural hair for maximum protection.",
        ],
        image: "/images/Weaves-And-Extensions-05-06-07.webp",
      },
      {
        heading: "Versatile for Any Look",
        body: [
          // From the PDF, which the rewrite dropped:
          "Because there's no technical installation or application process involved, our custom wigs are also incredibly beginner-friendly. If you've never worn a wig before, this is the easiest possible entry point — you simply slip it on like a hat and take it off like a beanie, no glue, no gel, no complicated technique required.",
          "Your lifestyle is unique, and your wig should be too.",
          "Whether you're looking for effortless everyday wear, polished professional styling, glamorous curls, or an elegant look for special occasions, your custom wig is designed around how you plan to wear it.",
          "Every detail, from the construction to the final style, is personalized so your unit not only looks beautiful but also fits seamlessly into your daily routine.",
        ],
        image: "/images/Weaves-And-Extensions-01.webp",
      },
      {
        heading: "Who This Service Is For",
        body: [
          "Our Custom Wig Design service is for anyone looking to invest in a wig that's truly made for them.",
          "Whether you're growing out your natural hair, exploring a new cut or color, looking for custom wigs in Brooklyn, or searching for a custom wig unit in Brooklyn, NY that offers a natural-looking fit, we're here to create something uniquely yours.",
          "We also proudly work with clients experiencing hair loss due to alopecia, chemotherapy, or other medical conditions, providing thoughtfully designed units that restore confidence while protecting the scalp.",
          "Every custom wig we create is built with expert craftsmanship, premium materials, and personalized care, so you can enjoy a unit that looks natural, feels comfortable, and lasts for years to come.",
        ],
        image: "/images/Weaves-And-Extensions-02.webp",
      },
    ],
    cta: {
      heading: "Book Your Personal Consultation",
    },
    meta: {
      title: "Custom Wig Design | October Glory",
      description:
        "Custom wigs in Brooklyn, NY at October Glory — glueless drawstring units handcrafted to your measurements from premium Cambodian and Filipino hair, including custom wigs for hair loss.",
    },
  },
];
