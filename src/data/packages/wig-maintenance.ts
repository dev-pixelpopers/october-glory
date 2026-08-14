import type { ServiceComparison, ServiceDetail } from "@/data/services/types";

/**
 * Wig maintenance packages, transcribed verbatim from the salon's own
 * "Wig Maintenance Packages" document. Feeds the shared ServiceTiers
 * component used on the natural-styles detail pages.
 *
 * No pricing exists in the source document — tier `price` is intentionally
 * left unset rather than guessed.
 */
export const wigMaintenanceTiers: NonNullable<ServiceDetail["tiers"]> = {
  eyebrow: "Choose Your Package",
  heading: "Wig Maintenance Packages",
  items: [
    {
      name: "The Glorious Wig Package",
      tagline:
        "Our most comprehensive maintenance package, designed for clients who want their natural hair fully treated and trimmed at every visit. It includes:",
      featured: true,
      includes: [
        "Washing and styling of your wig, restoring it back to its original look",
        "Washing of your natural hair underneath",
        "A spa treatment for your natural hair, where we assess your scalp and hair to determine exactly what it needs — whether that's moisture, protein to strengthen and rebuild the hair shaft, or a scalp treatment to clear away buildup and debris",
        "A trim to remove any dead or split ends from your natural hair",
        "Braiding your natural hair down in preparation for reinstall",
        "Reinstalling your wig, freshly washed and styled",
      ],
      bestFor:
        "Clients who want the full treatment every visit, including a trim, to keep their natural hair as healthy as possible while wearing a wig long-term.",
    },
    {
      name: "The Signature Wig Package",
      tagline:
        "This tier includes everything from the Glorious Wig Package except the trim — ideal for clients who don't need a trim every visit but still want their natural hair thoroughly treated. It includes:",
      includes: [
        "Washing and styling of your wig, restoring it back to its original look",
        "Washing of your natural hair underneath",
        "A spa treatment for your natural hair, based on a full scalp and hair assessment to determine what your hair needs — moisture, protein, or scalp care",
        "Braiding your natural hair up in preparation for reinstall",
        "Reinstalling your wig, freshly washed and styled",
      ],
      notIncluded:
        "A trim is not included in this package. Since trims are generally recommended quarterly rather than monthly, this option is a great fit for the months in between.",
      bestFor:
        "Clients on a monthly maintenance schedule who want consistent treatment for their natural hair without a trim at every visit.",
    },
    {
      name: "The Introductory Wig Package",
      tagline:
        "Our most streamlined maintenance option, covering the essentials to keep both your wig and natural hair clean and properly maintained. It includes:",
      includes: [
        "Washing and styling of your wig",
        "Washing of your natural hair underneath",
        "Braiding your natural hair up in preparation for reinstall",
        "Reinstalling your wig",
      ],
      notIncluded:
        "This package does not include a spa treatment or trim. It's a straightforward wash-and-reinstall service for clients who don't need deeper treatment at every visit.",
      bestFor:
        "Clients who want reliable, consistent upkeep at a more accessible price point, or who supplement this package with occasional spa treatments or trims as needed.",
    },
  ],
};

/** Standalone services offered outside a full maintenance appointment. */
export const wigMaintenanceAlaCarte = {
  eyebrow: "À La Carte",
  heading: "À La Carte Options",
  intro:
    "For clients who don't need a full maintenance appointment, we also offer standalone services:",
  items: [
    {
      name: "Natural Hair Wash & Braid Down",
      description:
        "For clients whose wig doesn't need washing this visit. We wash and braid your natural hair underneath, prepping it for you to reinstall your wig yourself or return separately for install.",
    },
    {
      name: "Wig Wash & Style",
      description:
        "For clients whose natural hair doesn't need attention this visit. We wash and style your wig back to its original form, ready to wear.",
    },
  ],
  bestFor:
    "Clients who are confident managing part of their own maintenance routine, or who need a quick refresh between full maintenance visits.",
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
