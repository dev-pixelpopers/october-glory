/**
 * Service pages are built from whichever sections a service defines, so the
 * light/dark rhythm can't be baked into each component — a page with seven
 * text blocks and no tiers would render seven dark sections in a row.
 *
 * Instead the template assigns a tone per block, alternating down the page,
 * and every section reads its colours from here. Two blocks of the same tone
 * never end up adjacent regardless of which sections a service uses.
 */
export type Tone = "dark" | "light";

export const tone = {
  dark: {
    section: "bg-[#1B1B1B]",
    eyebrow: "text-[#ccb884]",
    heading: "text-white",
    body: "text-white/70",
    bodyStrong: "text-white",
    muted: "text-white/45",
    border: "border-white/10",
    card: "bg-white/[0.04]",
    cardBorder: "border-white/10",
    hairline: "via-[#ccb884]/30",
  },
  light: {
    section: "bg-[#FAF8F4]",
    eyebrow: "text-[#9C6D51]",
    heading: "text-[#1B1B1B]",
    body: "text-[#555]",
    bodyStrong: "text-[#1B1B1B]",
    muted: "text-[#999]",
    border: "border-[#1B1B1B]/10",
    card: "bg-white",
    cardBorder: "border-[#1B1B1B]/10",
    hairline: "via-[#ccb884]/40",
  },
} as const;

/** Alternates dark/light down the page from a block's position. */
export const toneAt = (index: number): Tone => (index % 2 === 0 ? "dark" : "light");

/** A block awaiting a tone. `fixed` pins blocks that only work on one tone. */
export type Block = { key: string; fixed?: Tone };

const flip = (value: Tone): Tone => (value === "dark" ? "light" : "dark");

/**
 * Walks the blocks and hands each one a tone, flipping on every step so no two
 * neighbours match. Pinned blocks keep their tone; where a pinned block would
 * collide with the block before it, the earlier one gives way instead — which
 * can cascade back up the page, so the pass repeats until it settles.
 *
 * Returns a lookup rather than an array so the JSX can ask for a block by key
 * without tracking indices.
 */
export function assignTones(blocks: Block[], startAfter: Tone = "dark") {
  const tones: Tone[] = [];

  blocks.forEach((block, i) => {
    const previous = i === 0 ? startAfter : tones[i - 1];
    tones.push(block.fixed ?? flip(previous));
  });

  // Settle collisions introduced by pinned blocks.
  for (let pass = 0; pass < blocks.length; pass += 1) {
    let collided = false;

    for (let i = 1; i < blocks.length; i += 1) {
      if (tones[i] !== tones[i - 1]) continue;
      collided = true;

      if (!blocks[i].fixed) tones[i] = flip(tones[i]);
      else if (!blocks[i - 1].fixed) tones[i - 1] = flip(tones[i - 1]);
      // Two adjacent pinned blocks can't be separated; leave them.
    }

    if (!collided) break;
  }

  const byKey = new Map(blocks.map((block, i) => [block.key, tones[i]]));
  return (key: string): Tone => byKey.get(key) ?? "dark";
}
