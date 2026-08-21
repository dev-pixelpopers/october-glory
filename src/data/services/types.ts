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
  /** The member price. The non-member price is derived from it — see pricing.ts. */
  price?: string;
  /** Overrides the derived non-member price, when the salon has quoted one. */
  nonMemberPrice?: string;
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
  /**
   * A before/after pair, rendered under the body as a draggable comparison.
   * Shoot both frames from the same distance and angle — the wipe only reads
   * as one head of hair if the framing matches.
   */
  compare?: {
    before: string;
    after: string;
    /** Defaults to "Before" / "After". */
    beforeLabel?: string;
    afterLabel?: string;
    /** Optional line under the frame — service used, time between shots. */
    caption?: string;
  };
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
  /**
   * Plays in the media box instead of `image`. Keep `image` set alongside it —
   * it becomes the poster frame, so the block still reads correctly before the
   * video loads and for anyone who has reduced motion turned on.
   */
  video?: string;
};

/** A priced item in a service's menu grid — the salon's actual price list. */
export type ServiceMenuItem = {
  name: string;
  /** The member price. The non-member price is derived from it — see pricing.ts. */
  price?: string;
  /** Overrides the derived non-member price, when the salon has quoted one. */
  nonMemberPrice?: string;
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

/**
 * The e-book block: the same two-panel layout as the home page's "Your Guide
 * to the Perfect Choice", carrying this service's own guide.
 */
export type ServiceEbook = {
  eyebrow?: string;
  /** Large Andrea-Bellarosa line. */
  display: string;
  /** Valturin line underneath, indented like the hero. */
  script: string;
  body: string;
  /** Cover art shown in the white card on the left. */
  image: string;
  /** Label on the download CTA. */
  cta: string;
  /** The PDF. `#` until the file exists. */
  href: string;
};

export type ServiceDetail = {
  /** URL segment: /natural-styles/<slug> */
  slug: string;
  /** Card label on the parent category page. */
  cardTitle: string;
  /** Starting member price, shown on the hero and the booking CTA. */
  price?: string;
  /** Overrides the derived non-member price, when the salon has quoted one. */
  nonMemberPrice?: string;

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

  /**
   * The downloadable guide block. Only the services that have published one
   * define this — the template renders nothing without it, and the home page's
   * guide CTAs deep-link here via `#ebook`.
   */
  ebook?: ServiceEbook;

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
  /**
   * Heading and intro for the grid of this service's children. The grid itself
   * is built from `serviceChildren` — anything listing this slug in `parents`
   * appears in it — so a service cannot be in the data and missing from the page.
   */
  childrenSection?: {
    eyebrow?: string;
    heading: string;
    intro?: string;
  };
};

/**
 * A service beneath one of the five parents.
 *
 * Every sub-service lives here whether or not anyone has written its page yet.
 * The content sections are all optional: an entry with a `hero` is a full page
 * served at /services/<parent>/<slug>; an entry without one is a box in its
 * parent's grid that links straight to booking. Writing the content later adds
 * the page without moving the entry or changing how the parent renders.
 */
export type ServiceChild = Partial<
  Omit<ServiceDetail, "slug" | "cardTitle" | "price" | "nonMemberPrice">
> & {
  slug: string;
  /** Card label wherever this service is listed. */
  cardTitle: string;
  /** Card image used wherever this service is listed. */
  cardImage: string;
  /**
   * Slugs of the parents this service belongs to. An array so one service can
   * sit in several categories, the way a product sits in several collections.
   * The first entry is canonical: it owns the URL.
   */
  parents: string[];
  /** The member price. The non-member price is derived from it — see pricing.ts. */
  price?: string;
  /** Overrides the derived non-member price, when the salon has quoted one. */
  nonMemberPrice?: string;
};

/** A sub-service that has had its content written, and so has a page. */
export type ServiceChildWithPage = ServiceChild &
  Required<Pick<ServiceDetail, "hero" | "meta">>;

/** Narrows to the sub-services that have a page of their own. */
export const hasPage = (child: ServiceChild): child is ServiceChildWithPage =>
  child.hero !== undefined && child.meta !== undefined;
