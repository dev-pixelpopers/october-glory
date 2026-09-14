import type {
  ServiceBeforeAfter,
  ServiceDetail,
  ServiceProcess,
} from "./types";

/**
 * The sections every service page carries, whether or not that service has had
 * its own written yet.
 *
 * Three blocks are universal: the process walkthrough, the before/after, and
 * the membership CTA. Rather than copy them into fifty service entries, each
 * service may define its own and otherwise inherits the house version from
 * here — so adding a service gets you a complete page, and writing its real
 * content later is a matter of setting one key.
 */

/* --------------------------------- Process -------------------------------- */

/**
 * The house process. Every October Glory appointment runs through these four
 * stages regardless of the service, so it is accurate for any page it lands on
 * — but a service that has had its own filmed should override `process` with
 * the steps and footage specific to it.
 */
export const DEFAULT_PROCESS: ServiceProcess = {
  eyebrow: "How It Works",
  heading: "The",
  headingAccent: "Process",
  intro:
    "Every appointment follows the same four stages, whichever service you book. Your stylist walks you through each one before it starts, so nothing happens to your hair that you have not agreed to.",
  video: "/images/1-video.mp4",
  steps: [
    {
      title: "Consultation",
      body: "We look at your hair's density, texture and condition, talk through what you want from the visit, and agree on the approach — including anything we would not recommend today.",
    },
    {
      title: "Preparation",
      body: "A cleanse suited to your scalp, then whatever your hair needs to take the service well: protein where strands are weak, moisture where they are dry.",
    },
    {
      title: "The Service",
      body: "The work itself, done at the pace it needs rather than the pace the schedule wants. Your stylist checks in as they go and adjusts where your hair asks for it.",
    },
    {
      title: "Finish & Aftercare",
      body: "A cut or style to complete the look, then the routine that keeps it — what to use, what to avoid, and when to come back.",
    },
  ],
};

/**
 * The service's own process, or the house one.
 *
 * `image` falls back to the page hero so the frame is never empty while the
 * video loads, or for anyone browsing with reduced motion.
 */
export const serviceProcess = (service: ServiceDetail): ServiceProcess => {
  const process = service.process ?? DEFAULT_PROCESS;
  return { ...process, image: process.image ?? service.hero.image };
};

/* ------------------------------ Before / After ----------------------------- */

/**
 * PLACEHOLDER. These two frames are a trim, and they stand in on every service
 * that has not had its own pair shot yet — which is most of them.
 *
 * Replace per service by setting `beforeAfter` on that service's entry. A pair
 * must be the same client, same distance, same angle and same lighting, or the
 * wipe reads as two unrelated photographs rather than one head of hair.
 */
export const DEFAULT_BEFORE_AFTER: ServiceBeforeAfter = {
  eyebrow: "The Difference",
  heading: "Before",
  headingAccent: "& After",
  intro:
    "Drag the divider to see the same head of hair either side of a single appointment.",
  before: "/images/trim-before.webp",
  after: "/images/trim-after.webp",
  caption: "Results vary with hair type, condition and the service booked.",
};

/** The service's own before/after pair, or the placeholder. */
export const serviceBeforeAfter = (
  service: ServiceDetail
): ServiceBeforeAfter => service.beforeAfter ?? DEFAULT_BEFORE_AFTER;

/* -------------------------------- Membership ------------------------------- */

/**
 * Where the membership CTA points.
 *
 * Memberships are still "Coming Soon" in the client dashboard and have no
 * public page of their own, so this sends people to the dashboard for now.
 * Point it at the real page in one edit once that page exists.
 */
export const MEMBERSHIP_HREF = "/dashboard";

/**
 * The second CTA, carried by every service page beneath the booking one. The
 * member price shown throughout the site is the reason it is there: the copy
 * has to explain what that price is.
 */
export const MEMBERSHIP_CTA = {
  eyebrow: "Members Save On Every Visit",
  display: "Become A",
  heading: "Glory Member",
  body: "Every price on this page is the member price. Membership also brings priority booking, member-only treatments, and loyalty points on everything you book.",
  cta: "Become A Member",
};
