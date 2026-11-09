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
 *  DRAFT COPY — written here, needs the salon's sign-off:
 *    `brief`, `build`, `reaction`            → one story per client, written
 *                                              from her real spec. Plausible,
 *                                              not reported: the salon should
 *                                              correct anything that did not
 *                                              happen before this goes live.
 *
 *  PLACEHOLDER — still needs replacing:
 *    `journey` images                        → no before / braided / after
 *                                              frames have been supplied.
 *
 *  DELIBERATELY EMPTY:
 *    `quote`                                 → renders as a blockquote signed
 *                                              with the client's real name. A
 *                                              sentence written here would be
 *                                              a testimonial she never gave,
 *                                              so these stay unset until the
 *                                              salon collects real ones. The
 *                                              section hides the blockquote
 *                                              when the field is absent.
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

  /** DRAFT — what she came in wanting. */
  brief: string;
  /** DRAFT — what was built, and why. */
  build: string;
  /** DRAFT — how she wears it now. */
  reaction: string;
  /**
   * Her own words, signed with her real name in the story section. Left
   * unset on every unit until the salon has a quote she actually gave.
   */
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

/* ------------------------------------------------------------------ */
/*  THE STORIES                                                        */
/* ------------------------------------------------------------------ */

type UnitCopy = { brief: string; build: string; reaction: string };

/**
 * One story per unit, written from that client's real length, texture and
 * colour — the only facts we actually have. Everything else is a reasonable
 * account of how a unit to that spec gets built, not a record of what was
 * said in the chair. The salon reads these and corrects them.
 *
 * `quote` is absent on purpose; see the note at the top of the file.
 *
 * `SPECS` below is typed against these keys, so a slug without a story here
 * will not compile.
 */
const STORIES = {
  tiffany: {
    brief:
      "Tiffany wanted length she could actually live in. She had worn long units before and spent the day pushing them back off her face — by the afternoon the hairline had shifted and she knew it, which meant she never quite stopped thinking about her hair.",
    build:
      "Twenty-two inches of wavy hair in its own jet black, with no lift and no colour processing at all, so the cuticle stays intact and the length does not matt at the nape by week three. The cap was measured over her finished braid pattern rather than a bare head, because that is the shape it has to hold all day.",
    reaction:
      "She wears it down and parted off-centre most days, and wraps it at night to keep the wave from flattening on one side. We see her roughly every six weeks to lift it, clean underneath and reset the perimeter.",
  },

  samantha: {
    brief:
      "Samantha had worn her hair long for years and wanted to see herself with a bob before committing scissors to her own. A bob was the whole point, so it had to read as a real cut rather than as a short wig.",
    build:
      "Twelve inches is unforgiving — there is no length to hide a cap edge behind, so the fit had to be exact and the hairline became the most careful part of the build. The blonde ombré was kept soft and low at the root, with the lift concentrated through the last few inches where the cut moves most.",
    reaction:
      "She wears it blunt and tucked behind one ear, and it takes her a few minutes in the morning instead of the half hour her own length used to. She still has not cut her own hair.",
  },

  tricia: {
    brief:
      "Tricia came in with a photo and one condition: long, but warm — nothing flat or one-note. She had been let down before by colour that looked rich in the salon and turned brassy a few washes later.",
    build:
      "Twenty-four inches, the longest unit we have built, in chocolate chestnut balayage painted onto the unit before it ever went on her head. Doing it in that order lets us follow the finished cut instead of guessing at it, so the lightest pieces land where the hair actually falls.",
    reaction:
      "She wears it with a deep side part so the balayage catches on the heavier side. Length like that needs looking after: she keeps it braided at night, and she is back for a tone refresh before the warmth starts to drift.",
  },

  kelly: {
    brief:
      "Kelly did not want to look like she was wearing anything. She wanted her own hair on its best day — the version she gets once in a while when the weather is right and everything behaves.",
    build:
      "Sixteen inches of curly hair in natural black, chosen by matching the curl pattern to her own rather than by picking a number off a chart. That match is the entire job on a unit like this. The cut was done dry and on her head, so the shape sits the way her curls actually sit.",
    reaction:
      "She refreshes it with water and a light cream and otherwise leaves it alone, which is exactly what she asked for. Most people assume it is hers, and she has stopped correcting them.",
  },

  amanda: {
    brief:
      "Amanda wanted honey blonde and had been talked out of it twice before by stylists worried about what the lift would do to her own hair. The unit was the answer to that: the colour happens to the unit, not to her.",
    build:
      "Sixteen inches, wavy, taken to honey across two separate highlighting passes with a rest in between. One pass would have got there faster and left the ends brittle; two gets a cleaner blonde that still has something to hold onto when it is styled.",
    reaction:
      "She wears it with a slight bend rather than a full wave, and uses purple shampoo sparingly — on a unit, overdoing it dulls the honey instead of brightening it. Her own hair underneath has never been near bleach.",
  },

  amber: {
    brief:
      "Amber liked the same honey family as the blondes she had been shown, but not the upkeep that came with them. She wanted something that would grow out gracefully instead of announcing itself at the root every few weeks.",
    build:
      "Sixteen inches, wavy, hand-painted as a balayage rather than foiled — the lift starts low and deliberately uneven, so there is no line to chase later. It arrives at much the same honey as a highlighted unit, by a route that softens as it grows rather than resetting.",
    reaction:
      "She stretches her appointments further than most of our colour clients, because on this unit the grow-out works in her favour. A tone every couple of months keeps it from going warm, and that is about the whole of it.",
  },

  payton: {
    brief:
      "Payton asked for brown with warmth in it and used the phrase teddy bear, which turned out to be exactly right. Everything she had tried before came out either flat brown or unmistakably ginger.",
    build:
      "Twenty inches, wavy, built on a warm brown base with highlights ribboned through in fine sections rather than in blocks. The ribboning is what keeps it reading as depth instead of as stripes once the hair moves.",
    reaction:
      "She wears it with a loose wave that lets the ribboning show, and it photographs far better than the solid brown she had before. She is in every six to eight weeks to keep the warmth honest.",
  },

  sunday: {
    brief:
      "Sunday wanted the opposite of a project. Something she could put on, wear all week and not think about: middle length, no colour, nothing to maintain beyond the basics.",
    build:
      "Eighteen inches, wavy, natural black — and that is deliberately the entire specification. With no colour process in it the hair keeps its strength, takes heat well on the days she wants it straighter, and goes back to its wave after a wash.",
    reaction:
      "She wears it straight through the week and lets the wave come back at the weekend. It is the lowest-maintenance unit on this page, which is precisely what she booked.",
  },

  phoebe: {
    brief:
      "Phoebe wanted long and curly together, which is the combination most people get quietly talked out of. Curls shrink, long curls tangle, and most units built to that brief have been cut short within a month.",
    build:
      "Twenty-two inches of curly hair in jet black, with the length measured stretched rather than at rest so it still reads long once the curl pulls up. The cut was shaped in sections to take weight out of the middle, because a long curly unit gives out at the back long before it gives out at the front.",
    reaction:
      "She refreshes it in sections and sleeps in a bonnet without exception — at this length and this texture that is not optional. In return she has kept the full length, which is rarer than it sounds.",
  },

  becka: {
    brief:
      "Becka wanted cool, not golden. She had seen enough ombrés drop warm after a few weeks and wanted to know how we would stop that happening before she booked anything.",
    build:
      "Twenty inches, wavy, chestnut through the top falling into an ash blonde at the ends. Ash over a dark base is the hardest colour on this page to hold: it needs a cleaner lift before any toner goes near it, and that is the step that gets skipped when a result turns brassy.",
    reaction:
      "She tones it on a schedule instead of waiting for it to turn, which is the only thing that keeps ash looking like ash. Worn straight it shows the fall from chestnut to blonde most clearly, and straight is how she wears it.",
  },
} satisfies Record<string, UnitCopy>;

type UnitSlug = keyof typeof STORIES;

/* ------------------------------------------------------------------ */
/*  THE TEN UNITS — names and specs are real.                          */
/* ------------------------------------------------------------------ */

const SPECS: { slug: UnitSlug; name: string; spec: UnitSpec }[] = [
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
  ...STORIES[unit.slug],
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
    images: ["/images/wig-unit-01.webp", "/images/wig-unit-02.webp"],
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
    heading: "From Start",
    headingAccent: "To Finish",
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
