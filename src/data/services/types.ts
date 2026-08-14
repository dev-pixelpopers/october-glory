/**
 * Shape of a single "inner" service page — e.g. /natural-styles/silk-press.
 *
 * Every section below `hero` is optional. The detail template renders a
 * section only when its key is present, so one template covers a short
 * two-tier page and a full six-section page without any layout variants.
 */

/** A cell in the quick-comparison grid. */
export type ComparisonValue =
  /** Included, plain check. */
  | true
  /** Not included, em dash. */
  | false
  /** Included, with a qualifier shown beside the check — e.g. "(customized)". */
  | string
  /** Neither included nor excluded — text only, no check. e.g. "Available separately". */
  | { text: string };

export type ServiceTier = {
  /** e.g. "Classic Silk Press" */
  name: string;
  /** One-line positioning shown under the tier name. */
  tagline?: string;
  price?: string;
  duration?: string;
  /** The "What you get" bullets. */
  includes: string[];
  /** The "What's not included" paragraph. Omit when nothing is left out. */
  notIncluded?: string;
  /** The "Best for" paragraph. */
  bestFor?: string;
  /** Draws the gold highlight treatment on the card. */
  featured?: boolean;
};

export type ServiceComparison = {
  eyebrow?: string;
  heading: string;
  /** Tier names, in the same order as every row's `values`. */
  columns: string[];
  rows: { label: string; values: ComparisonValue[] }[];
  footnote?: string;
};

/**
 * A free-form editorial block — used for things like the "Why the trim
 * matters" explainer that sits between the tiers and the comparison table.
 */
export type ServiceNote = {
  eyebrow?: string;
  heading: string;
  body: string[];
  image?: string;
};

export type ServiceDetail = {
  /** URL segment: /natural-styles/<slug> */
  slug: string;
  /** Card label on the parent category page. */
  cardTitle: string;
  /** Starting price, shown on the hero and the booking CTA. */
  price?: string;

  hero: {
    /** Large Andrea-Bellarosa script word. */
    display: string;
    /** Valturin line underneath. */
    script: string;
    intro: string;
    image: string;
  };

  overview?: {
    eyebrow?: string;
    heading: string;
    body: string[];
    image?: string;
  };

  tiers?: {
    eyebrow?: string;
    heading: string;
    intro?: string;
    items: ServiceTier[];
  };

  note?: ServiceNote;

  comparison?: ServiceComparison;

  cta?: {
    display?: string;
    heading?: string;
    body?: string;
  };

  meta: {
    title: string;
    description: string;
  };
};

/** Parent category a set of inner services belongs to. */
export type ServiceCategory = {
  /** URL segment: /<slug>/... */
  slug: string;
  label: string;
  services: ServiceDetail[];
};
