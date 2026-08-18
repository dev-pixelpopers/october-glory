import type { ServiceComparison, ServiceDetail } from "@/data/services/types";

/**
 * Wig maintenance packages, following the salon's "Wig Maintenance" Word
 * document (the SEO rewrite). Feeds the shared ServiceTiers component used on
 * the natural-styles detail pages.
 *
 * No pricing exists in either source document — tier `price` is intentionally
 * left unset rather than guessed.
 */
export const wigMaintenanceTiers: NonNullable<ServiceDetail["tiers"]> = {
  eyebrow: "Choose Your Package",
  heading: "Wig Maintenance Packages",
  items: [
    {
      name: "The Glorious Wig Package",
      tagline: "Complete Care for Your Wig & Natural Hair",
      featured: true,
      includes: [
        "A professional wig wash and restyle to restore your unit's original beauty, softness, and shape",
        "A thorough cleanse of your natural hair and scalp",
        "A personalized spa treatment based on your hair's needs, including moisture, protein, or scalp therapy to promote healthier hair",
        "A precision trim to remove split or damaged ends",
        "Professional braiding to create a secure, comfortable foundation",
        "A complete wig reinstall using your freshly cleaned and styled custom unit",
      ],
      bestFor:
        "Clients who want the highest level of maintenance at every visit, including regular treatments and trims, to keep both their custom wig and natural hair in excellent condition for long-term wear.",
    },
    {
      name: "The Signature Wig Package",
      tagline: "Routine Care to Keep Your Wig Looking Its Best",
      includes: [
        "A professional wig wash and restyle to restore your unit's shape, softness, and natural appearance",
        "A thorough cleanse of your natural hair and scalp",
        "A personalized spa treatment based on a complete scalp and hair assessment, using moisture, protein, or scalp care treatments as needed",
        "Professional braiding to prepare your natural hair for reinstallation",
        "Reinstalling your freshly cleaned and styled wig",
      ],
      notIncluded:
        "A precision trim is not included with this package. Since trims are typically recommended every three months rather than at every monthly maintenance visit, this option is ideal for keeping your hair healthy between trim appointments.",
      bestFor:
        "Clients following a regular monthly maintenance routine who want professional care for both their custom wig and natural hair, without needing a trim at every visit.",
    },
    {
      name: "The Introductory Wig Package",
      tagline: "Essential Maintenance for Everyday Wig Care",
      includes: [
        "A professional wash and restyle of your wig",
        "A thorough cleanse of your natural hair and scalp",
        "Expert braiding to create a secure foundation for your reinstall",
        "A professional wig reinstall using your freshly cleaned and styled unit",
      ],
      notIncluded:
        "This package does not include a customized spa treatment or precision trim. It's designed as a straightforward maintenance service for clients who don't require deeper treatments during every appointment.",
      bestFor:
        "Clients looking for reliable, routine wig maintenance at an accessible price point, or those who alternate this package with more comprehensive maintenance services throughout the year.",
    },
  ],
};

/** Standalone services offered outside a full maintenance appointment. */
export const wigMaintenanceAlaCarte = {
  eyebrow: "À La Carte",
  heading: "Flexible Care When You Need It",
  intro:
    "Not every visit requires a full maintenance appointment. That's why we offer wig maintenance services in Brooklyn that can be booked individually, giving you the flexibility to refresh either your wig or your natural hair whenever you need it.",
  items: [
    {
      name: "Natural Hair Wash & Braid Down",
      description:
        "Perfect for clients whose wig doesn't need servicing during this visit. We'll thoroughly cleanse your natural hair, braid it down, and prepare it for you to reinstall your wig at home or return later for a professional installation.",
    },
    {
      name: "Wig Wash & Restyle",
      description:
        "Ideal for clients whose natural hair doesn't require maintenance but whose wig needs refreshing. We'll professionally wash, condition, and restyle your unit, restoring its original shape, softness, and polished finish so it's ready to wear again.",
    },
  ],
  bestFor:
    "Clients who prefer a more flexible maintenance routine, are comfortable managing part of their wig care at home, or simply need a quick refresh between full maintenance appointments.",
};

export const wigMaintenanceComparison: ServiceComparison = {
  eyebrow: "At A Glance",
  heading: "Quick Comparison",
  columns: [
    "Glorious Wig Package",
    "Signature Wig Package",
    "Introductory Wig Package",
    "À La Carte",
  ],
  rows: [
    {
      label: "Wig wash & style",
      values: [true, true, true, { text: "Available separately" }],
    },
    {
      label: "Natural hair wash",
      values: [true, true, true, { text: "Available separately" }],
    },
    {
      label: "Scalp/hair assessment + spa treatment",
      values: [true, true, false, false],
    },
    { label: "Trim", values: [true, false, false, false] },
    { label: "Braid down & reinstall", values: [true, true, true, false] },
  ],
  footnote:
    "Every package is built around one goal: keeping your custom unit looking fresh while your natural hair underneath stays healthy, protected, and growing. Clients can move between packages month to month depending on what their hair needs at the time.",
};
