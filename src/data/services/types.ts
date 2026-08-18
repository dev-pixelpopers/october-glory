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

/**
 * A text-and-image block. `overview` is the first one on every page; services
 * whose story is a process rather than a set of tiers — Custom Wig Design,
 * Ponytail & Updo — carry several more in `sections`, which alternate sides
 * automatically so the page reads as a sequence rather than a stack.
 */
export type ServiceSection = {
  eyebrow?: string;
  heading: string;
  /** Optional line under the heading, before the body copy. */
  tagline?: string;
  body: string[];
  /** Rendered as a gold-checked list beneath the body. */
  bullets?: string[];
  image?: string;
};

/** A priced item in a service's menu grid — the salon's actual price list. */
export type ServiceMenuItem = {
  name: string;
  price?: string;
  image: string;
  /** Set when this item has a child page of its own. */
  href?: string;
};

export type ServiceMenu = {
  eyebrow?: string;
  heading: string;
  intro?: string;
  items: ServiceMenuItem[];
};

export type ServiceFaq = {
  eyebrow?: string;
  heading: string;
  items: { question: string; answer: string }[];
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

  overview?: ServiceSection;

  tiers?: {
    eyebrow?: string;
    heading: string;
    intro?: string;
    items: ServiceTier[];
  };

  note?: ServiceNote;

  /** Further text-and-image blocks, rendered after `note`. */
  sections?: ServiceSection[];

  comparison?: ServiceComparison;

  /** The priced menu grid. */
  menu?: ServiceMenu;

  faq?: ServiceFaq;

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

/**
 * A main service — one of the five boxes on /services, served at
 * /services/<slug>.
 */
export type ServiceParent = ServiceDetail & {
  /** Card image on the /services index. */
  cardImage: string;
  /** One-line summary for the index card and the menu panel. */
  cardBlurb: string;
};

/**
 * A service page nested under one of the five parents, served at
 * /services/<parent>/<slug>.
 */
export type ServiceChild = ServiceDetail & {
  /** `slug` of the parent it belongs to. */
  parent: string;
  /** Card image used wherever this child is listed. */
  cardImage: string;
};
