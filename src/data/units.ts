/**
 * October Glory Units — the custom units built for real clients, each told as
 * its own short case study at /wigs/<slug>.
 *
 * ─────────────────────────────────────────────────────────────────────────
 *  WHAT IS REAL AND WHAT IS PLACEHOLDER
 *
 *  REAL, from the client's whiteboard — do not rewrite:
 *    `name`, `spec` (length / texture / colour) for all ten units.
 *
 *  REAL, supplied by the salon:
 *    `portrait`  /images/<Name>.png
 *    `video`     /images/<Name>.mp4
 *
 *  PLACEHOLDER — still needs replacing:
 *    `journey` images                        → no before / braided / after
 *                                              frames have been supplied.
 *    `brief`, `build`, `reaction`, `quote`   → written by me as dummy copy.
 *                                              The salon has to supply the
 *                                              real version per client.
 *
 *  Drop the real assets at the paths listed in ASSET MAP below and swap the
 *  placeholder constant for the real path — nothing else has to change.
 * ─────────────────────────────────────────────────────────────────────────
 */

/**
 * ASSET MAP — where each real file should land.
 *
 *   /images/<Name>.png                   the studio portrait            DONE
 *   /images/<Name>.mp4                   the in-salon unit video        DONE
 *   /images/units/<slug>-before.webp     natural hair, before           TODO
 *   /images/units/<slug>-mid.webp        braided down                   TODO
 *   /images/units/<slug>-after.webp      finished, unit installed       TODO
 *   /images/units/poster-left.webp       poster photo, left             TODO
 *   /images/units/poster-right.webp      poster photo, right            TODO
 *   /images/units/process-*.webp         the four install-stage stills  TODO
 */

export type UnitSpec = {
  /** e.g. "22 inch" — kept as written on the whiteboard. */
  length: string;
  /** e.g. "Wavy", "Curly", "Bob". */
  texture: string;
  /** e.g. "Jet black". */
  color: string;
};

export type UnitStory = {
  slug: string;
  /** Client's first name, as the unit is known. */
  name: string;
  spec: UnitSpec;

  /** Studio portrait — the gallery card and the detail hero. */
  portrait: string;
  /** The in-salon unit video. */
  video?: string;

  /** Before / braided down / finished. */
  journey?: { before: string; mid: string; after: string };

  /** PLACEHOLDER COPY — what she came in wanting. */
  brief: string;
  /** PLACEHOLDER COPY — what was built, and why. */
  build: string;
  /** PLACEHOLDER COPY — how she wears it now. */
  reaction: string;
  /** PLACEHOLDER COPY — her words. */
  quote?: string;
};

/* ------------------------------------------------------------------ */
/*  ASSETS                                                             */
/* ------------------------------------------------------------------ */

/**
 * The portrait and the unit video are the salon's own files, named after the
 * client: /images/Tiffany.png and /images/Tiffany.mp4.
 *
 * Case matters — the deployment filesystem is case-sensitive even though
 * Windows is not, so `Tiffany.png` will 404 if it is ever written `tiffany`.
 * Both are derived from `name` rather than listed, so a new unit needs only
 * its two files dropped in beside the rest.
 */
const portraitFor = (name: string) => `/images/${name}.png`;
const videoFor = (name: string) => `/images/${name}.mp4`;

/** PLACEHOLDER. No before / braided / after frames have been supplied yet. */
const PLACEHOLDER_JOURNEY = {
  before: "/images/naturalStyle1.webp",
  mid: "/images/braiddown.jpg",
  after: "/images/SilkPress-01.webp",
};

/** PLACEHOLDER. One story, reused — the salon supplies ten real ones. */
const placeholderStory = (name: string) => ({
  brief: `PLACEHOLDER — what ${name} asked for. Two or three sentences: the length and colour she had in mind, what she had tried before that had not worked, and what the unit needed to survive day to day.`,
  build: `PLACEHOLDER — what we built for ${name}. The hair selected and why, how the cap was measured and constructed, the colour process, and the cut that finished it.`,
  reaction: `PLACEHOLDER — how ${name} wears it now. How long the install took, how she styles it week to week, and how often she is back in the chair for maintenance.`,
  quote: `PLACEHOLDER — a line in ${name}'s own words.`,
});

/* ------------------------------------------------------------------ */
/*  THE TEN UNITS — names and specs are real.                          */
/* ------------------------------------------------------------------ */

const SPECS: { slug: string; name: string; spec: UnitSpec }[] = [
  { slug: "tiffany", name: "Tiffany", spec: { length: "22 inch", texture: "Wavy", color: "Jet black" } },
  { slug: "samantha", name: "Samantha", spec: { length: "12 inch", texture: "Bob", color: "Blonde ombré" } },
  { slug: "tricia", name: "Tricia", spec: { length: "24 inch", texture: "Wavy", color: "Chocolate chestnut balayage" } },
  { slug: "kelly", name: "Kelly", spec: { length: "16 inch", texture: "Curly", color: "Natural black" } },
  { slug: "amanda", name: "Amanda", spec: { length: "16 inch", texture: "Wavy", color: "Honey blonde, twice highlighted" } },
  { slug: "amber", name: "Amber", spec: { length: "16 inch", texture: "Wavy", color: "Honey blonde balayage" } },
  { slug: "payton", name: "Payton", spec: { length: "20 inch", texture: "Wavy", color: "Teddy bear brown highlights" } },
  { slug: "sunday", name: "Sunday", spec: { length: "18 inch", texture: "Wavy", color: "Natural black" } },
  { slug: "phoebe", name: "Phoebe", spec: { length: "22 inch", texture: "Curly", color: "Jet black" } },
  { slug: "becka", name: "Becka", spec: { length: "20 inch", texture: "Wavy", color: "Chestnut ash blonde ombré" } },
];

export const units: UnitStory[] = SPECS.map((unit) => ({
  ...unit,
  portrait: portraitFor(unit.name),
  video: videoFor(unit.name),
  journey: PLACEHOLDER_JOURNEY,
  ...placeholderStory(unit.name),
}));

export const getUnit = (slug: string): UnitStory | undefined =>
  units.find((unit) => unit.slug === slug);

/**
 * "22 inch" -> 22, for setting the length as a numeral. The spec strings stay
 * exactly as the salon wrote them; nothing is re-derived from this.
 */
export const unitInches = (unit: UnitStory): number =>
  Number.parseInt(unit.spec.length, 10);

/** "22 inch · Wavy · Jet black" — the one-line spec used on cards. */
export const unitSpecLine = (unit: UnitStory): string =>
  [unit.spec.length, unit.spec.texture, unit.spec.color].join(" · ");

/* ------------------------------------------------------------------ */
/*  PAGE COPY                                                          */
/* ------------------------------------------------------------------ */

export const unitsPage = {
  meta: {
    title: "October Glory Units | October Glory",
    description:
      "Custom luxury units built for October Glory clients in Brooklyn — every unit designed, constructed and installed around one person. See the units, the process, and the women wearing them.",
  },

  hero: {
    /** PLACEHOLDER — replace with /images/units/group.webp (the three-ladies shot). */
    image: "/images/unit-bg.png",
    display: "October Glory",
    script: "Units",
  },

  /**
   * The "Custom Luxury Units" poster, rebuilt as a web section.
   *
   * INTERIM COPY — written to answer the question the page was not answering
   * at all ("what is a custom unit, and how is it different from a wig I
   * buy?"). The poster in the handoff has the salon's own wording and is too
   * low-resolution to transcribe; replace these three paragraphs with it.
   */
  poster: {
    eyebrow: "October Glory",
    heading: "Custom Luxury Units",
    body: [
      "A custom unit is not a wig you buy off a shelf and hope fits. It is built for one head: measured, constructed, coloured and cut around the person who will wear it, from hair chosen to match their own texture.",
      "That is why every unit here carries a name. Each one was designed in consultation with the client it belongs to — her length, her colour, the way she wanted to wear it — and no two are the same.",
      "What you are looking at is our work, not a catalogue of stock. Find a unit close to what you have in mind, and we will build yours from there.",
    ],
    /** PLACEHOLDER — replace with /images/units/poster-left.webp and -right.webp. */
    images: ["/images/Weaves-And-Extensions-02.webp", "/images/Weaves-And-Extensions-03.webp"],
  },

  /**
   * The installation flow, exactly as specified on the handoff deck.
   *
   * `at` is where each stage begins in `video`, in seconds, as timed by the
   * salon — the stages are not equal lengths. A stage runs until the next
   * one starts, and the last runs to the end of the clip, so re-timing the
   * sequence is a matter of editing these four numbers.
   */
  install: {
    eyebrow: "The Process",
    heading: "From Your Hair",
    headingAccent: "To The Finish",
    intro:
      "Every unit goes on the same way, and it starts with the hair underneath rather than the hair going over it.",
    /** PLACEHOLDER — replace with /images/units/install.webm if this is not already it. */
    video: "/images/unit-main.mp4",
    steps: [
      {
        title: "Big natural hair",
        at: 0,
        body: "We start with your own hair — assessed, cleansed and treated, so the foundation is healthy before anything is built on it.",
        /** PLACEHOLDER — replace with /images/units/process-natural.webp */
        image: "/images/naturalStyle1.webp",
      },
      {
        title: "Braid the hair down securely",
        at: 45,
        body: "A braid pattern matched to your density, flat and secure, so the unit sits close to the scalp and your own hair is protected underneath.",
        /** PLACEHOLDER — replace with /images/units/process-braided.webp */
        image: "/images/braiddown.jpg",
      },
      {
        title: "Install the wig",
        at: 65,
        body: "The unit goes on and is fitted to your head, not to a standard size — the reason a custom unit reads as your own hair rather than something worn.",
        /** PLACEHOLDER — replace with /images/units/process-install.webp */
        image: "/images/Weaves-And-Extensions-04.webp",
      },
      {
        title: "Style and finish",
        at: 80,
        body: "Trimmed, shaped and styled while you are wearing it, so the finished look is cut to your face rather than to a mannequin.",
        /** PLACEHOLDER — replace with /images/units/process-finish.webp */
        image: "/images/SilkPress-01.webp",
      },
    ],
  },

  gallery: {
    eyebrow: "The Units",
    heading: "Ten Women,",
    headingAccent: "Ten Units",
    intro:
      "Every unit here was built for the woman wearing it. Open one to see what she asked for, what we made, and how it turned out.",
  },

  /** The cross-link that closes the page, pointing at the services side. */
  servicesCta: {
    display: "The Other Half",
    heading: "Explore Our Wig Services",
    body: "A unit is where it starts, not where it ends. See how one is designed and fitted, and the maintenance that keeps both the unit and the hair underneath it in good condition.",
  },

  cta: {
    display: "Start Yours",
    heading: "Design A Unit Of Your Own",
    body: "Every unit on this page started as a consultation. Bring us a reference, a colour, or just an idea of how you want to wear it, and we will build the rest around your head and your hair.",
  },
};
