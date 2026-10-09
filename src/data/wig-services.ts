/**
 * Wig services — the client journey, the maintenance packages, and the
 * services bookable outside a package. Straight from slide 07 of the handoff
 * deck ("Wig Services & Client Journey").
 *
 * Served at /wigs/services, beside /wigs — the deck asks for "a distinct,
 * cohesive mini-site within the main website … and a clear path from
 * consultation to care", which is two pages under one Wig umbrella rather
 * than one page carrying everything.
 *
 * ── ON THE PACKAGES ──────────────────────────────────────────────────────
 * The deck's three packages are the three tiers that already exist in
 * `src/data/packages/wig-maintenance.ts`, driving /maintenance-packages —
 * same services, different names, and listed in the opposite order:
 *
 *   Deck "Wig Maintenance"                    = The Introductory Wig Package
 *   Deck "Wig Maintenance + Spa Treatment"    = The Signature Wig Package
 *   Deck "Full Wig + Natural Hair Maintenance" = The Glorious Wig Package
 *
 * Rather than duplicate the tier content, each card below carries the deck's
 * short description and sends people to /maintenance-packages for the full
 * breakdown — one source of truth for what is in each package.
 *
 * NOTE FOR THE SALON: the deck highlights the middle package; the existing
 * data features the top one (The Glorious). The deck wins here because it is
 * the newer direction, but the two should be reconciled.
 */

export type JourneyStep = {
  /** "01", "02" — the deck numbers them. */
  step: string;
  title: string;
  body: string;
  cta: { label: string; href: string };
};

export type WigPackage = {
  /** "Package 1" — the card's eyebrow. */
  label: string;
  title: string;
  body: string;
  /** The equivalent tier on /maintenance-packages. */
  equivalentTier: string;
  /** Drawn with the gold treatment. The deck highlights the middle one. */
  featured?: boolean;
  cta: { label: string; href: string };
};

export type WigAddOn = {
  title: string;
  body: string;
  cta: { label: string; href: string };
};

const BOOK = "/dashboard/book";
const PACKAGES_HREF = "/maintenance-packages";

export const wigServicesPage = {
  meta: {
    title: "Wig Services | October Glory",
    description:
      "Wig services at October Glory in Brooklyn — consultation and purchase, custom unit design, three wig and natural hair maintenance packages, and individual wig services.",
  },

  hero: {
    /** PLACEHOLDER — a wig-service photograph would sit better here. */
    image: "/images/Weaves-And-Extensions-04.webp",
    display: "Wig",
    script: "Services",
  },

  intro: {
    eyebrow: "From Consultation To Care",
    heading: "A Clear Path",
    headingAccent: "Start To Finish",
    body: "Everything that happens around a unit, in the order it happens: choosing or designing one, then keeping it — and the hair underneath it — in good condition for as long as you wear it.",
  },

  journey: {
    eyebrow: "Client Journey",
    heading: "How It",
    headingAccent: "Works",
    steps: [
      {
        step: "01",
        title: "Consultation & Purchase",
        body: "Choose or discuss a unit, purchase an existing unit, or begin designing a custom unit.",
        cta: { label: "Book a Consultation", href: BOOK },
      },
      {
        step: "02",
        title: "Custom Unit Design & Creation",
        body: "Design and custom-make the client's unit based on the consultation.",
        cta: { label: "Design a Custom Unit", href: BOOK },
      },
    ] satisfies JourneyStep[],
  },

  packages: {
    eyebrow: "Wig + Natural Hair Maintenance Packages",
    heading: "Three Levels",
    headingAccent: "Of Care",
    intro:
      "Every package covers both the unit and the natural hair underneath it. They build on each other — pick the level your hair needs at each visit.",
    items: [
      {
        label: "Package 1",
        title: "Wig Maintenance",
        body: "Natural hair washed, braided down, wig washed, wig styled, and wig put back on.",
        equivalentTier: "The Introductory Wig Package",
        cta: { label: "Choose a Package", href: PACKAGES_HREF },
      },
      {
        label: "Package 2",
        title: "Wig Maintenance + Spa Treatment",
        body: "Natural hair washed and treated with a spa treatment, wig washed, wig styled, and wig put back on.",
        equivalentTier: "The Signature Wig Package",
        featured: true,
        cta: { label: "Choose a Package", href: PACKAGES_HREF },
      },
      {
        label: "Package 3",
        title: "Full Wig + Natural Hair Maintenance",
        body: "Natural hair washed and treated with a spa treatment, natural hair trimmed, wig washed, wig styled, and wig put back on.",
        equivalentTier: "The Glorious Wig Package",
        cta: { label: "Choose a Package", href: PACKAGES_HREF },
      },
    ] satisfies WigPackage[],
  },

  addOns: {
    eyebrow: "Additional Services",
    heading: "Booked On",
    headingAccent: "Their Own",
    intro:
      "Not every visit needs a full maintenance appointment. These are bookable individually.",
    items: [
      {
        title: "Wig Wash & Style Drop-Off",
        body: "Drop off the wig and pick it up after it has been washed and styled.",
        cta: { label: "Book a Wig Service", href: BOOK },
      },
      {
        title: "Natural Hair Prep",
        body: "Hair washed, treated, and braided down for the week. If a wash is not needed, provide the prep service as appropriate.",
        cta: { label: "Book a Wig Service", href: BOOK },
      },
      {
        title: "Wig Repair Add-On",
        body: "Add-on service for fixing or repairing the wig when needed.",
        cta: { label: "Book a Wig Service", href: BOOK },
      },
    ] satisfies WigAddOn[],
  },

  /** The cross-link that closes the page, pointing back at the units. */
  unitsCta: {
    display: "See The Work",
    heading: "Ten Units, Ten Clients",
    body: "Every service on this page has been run on a real head of hair. Look through the units we have built — what each client came in asking for, the unit we made for her, and how she wears it now.",
  },

  cta: {
    display: "Reserve Your Space",
    heading: "Book A Wig Service",
    body: "Not sure which package fits? Book a consultation and we will look at your unit and your natural hair, then recommend the level of care each of them needs.",
  },
};
