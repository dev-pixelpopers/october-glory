/**
 * Every video file the project ships, listed for the Lookbook's video wall.
 *
 * The wall is the one place all of them are reachable — most of these clips
 * play in one specific spot on one page (the home-page reel, a unit's own
 * page, the silk press process section), and several had no home at all.
 *
 * Nothing here is preloaded. Each tile shows a still from
 * /videos-posters/<name>.webp — generated once with ffmpeg at 640px wide, the
 * whole set under 1 MB — and the <video> element is not mounted until the
 * visitor clicks, so a visit to the page downloads no video at all.
 *
 * Labels: the clips that already had a caption somewhere in the project keep
 * it. The home page's decorative b-roll never had one, so those are numbered
 * rather than given invented names — replace them when the salon tells us
 * what they show.
 */

export type VideoCategory =
  | "Wigs"
  | "Extensions"
  | "Silk Press"
  | "Color"
  | "Bridal"
  | "The Salon"
  | "Shoutouts";

export type LookbookMedia = {
  /** A still renders as itself; a clip renders its poster until clicked. */
  kind: "video" | "image";
  src: string;
  /** Still frame, so the tile has something to show with nothing loaded. */
  poster: string;
  label: string;
  category: VideoCategory;
  /** Drives the tile's aspect ratio — these are mixed. */
  orientation: "portrait" | "landscape";
  /** Only the handful of curated stills carry a line of copy. */
  description?: string;
};

/** Kept as an alias: most of this file is clips. */
export type LookbookVideo = LookbookMedia;

/** Filter chips, in display order. "All" is added by the component. */
export const videoCategories: VideoCategory[] = [
  "Wigs",
  "Extensions",
  "Silk Press",
  "Color",
  "Bridal",
  "The Salon",
  "Shoutouts",
];

const v = (
  file: string,
  label: string,
  category: VideoCategory,
  orientation: LookbookMedia["orientation"] = "portrait"
): LookbookMedia => ({
  kind: "video",
  src: `/images/${file}`,
  poster: `/videos-posters/${file.replace(/\.(mp4|webm)$/, ".webp")}`,
  label,
  category,
  orientation,
});

/** A photograph. It is its own poster — there is nothing to load on click. */
const img = (
  file: string,
  label: string,
  category: VideoCategory,
  description: string,
  orientation: LookbookMedia["orientation"] = "portrait"
): LookbookMedia => ({
  kind: "image",
  src: `/images/${file}`,
  poster: `/images/${file}`,
  label,
  category,
  orientation,
  description,
});

/**
 * The handful of curated stills that used to sit in their own masonry grid
 * above the clips. The page had two galleries and two filter bars doing the
 * same job; these moved into the one wall and the grid went.
 */
export const lookbookImages: LookbookMedia[] = [
  img(
    "confidance-image.png",
    "Length & Flow",
    "Extensions",
    "Waist-length install with custom curl pattern matching.",
    "landscape"
  ),
  img(
    "about-img.png",
    "Sleek & Polished",
    "Silk Press",
    "A crisp, bouncy press with heat-protective spa treatment.",
    "landscape"
  ),
  img(
    "perfect-image.png",
    "Precision Cut Wig",
    "Wigs",
    "Customized unit with layered framing cut to complement face shape."
  ),
  img(
    "guide-image.png",
    "Burgundy Deep Tones",
    "Color",
    "Bold colour transformation with deep berry undertones."
  ),
];

export const lookbookVideos: LookbookMedia[] = [
  // ── Units: the ten client films that run on /wigs and each unit's page.
  v("Amanda.mp4", "Amanda — Unit", "Wigs", "landscape"),
  v("Amber.mp4", "Amber — Unit", "Wigs"),
  v("Becka.mp4", "Becka — Unit", "Wigs"),
  v("Kelly.mp4", "Kelly — Unit", "Wigs", "landscape"),
  v("Payton.mp4", "Payton — Unit", "Wigs", "landscape"),
  v("Phoebe.mp4", "Phoebe — Unit", "Wigs", "landscape"),
  v("Samantha.mp4", "Samantha — Unit", "Wigs", "landscape"),
  v("Sunday.mp4", "Sunday — Unit", "Wigs", "landscape"),
  v("Tiffany.mp4", "Tiffany — Unit", "Wigs", "landscape"),
  v("Tricia.mp4", "Tricia — Unit", "Wigs", "landscape"),

  // ── Wigs, the rest.
  v("unit-main.mp4", "Install, Start To Finish", "Wigs", "landscape"),
  v("wig-featured.webm", "Naturally Woven", "Wigs"),
  v("video-04.mp4", "Custom Lace Front", "Wigs"),
  v("video-3.mp4", "Wig Fitting", "Wigs"),

  // ── Extensions.
  v("1-video.mp4", "Sew-In Install", "Extensions", "landscape"),
  v("video-01.mp4", "Luxe Volume Extensions", "Extensions", "landscape"),

  // ── Silk press.
  v("silk-press-process.mp4", "The Silk Press Process", "Silk Press", "landscape"),
  v("silk-press-intro.webm", "Silk Press, Introduced", "Silk Press", "landscape"),
  v("video-02.mp4", "Mirror Silk Finish", "Silk Press", "landscape"),
  v("video-2.mp4", "Silk Press", "Silk Press"),
  v("silk-press-finish.mp4", "The Finished Look", "Silk Press"),

  // ── Color.
  v("video-03.mp4", "Honey Bronze Highlights", "Color"),
  v("video-4.mp4", "Custom Color", "Color"),

  // ── Bridal.
  v("video-05.mp4", "Bridal Elegance Updo", "Bridal"),

  // ── The salon: the about film, and the home page's b-roll.
  v("about-video.mp4", "Inside October Glory", "The Salon", "landscape"),
  v("vid-2-1.webm", "In The Salon 01", "The Salon"),
  v("vid-2-2.webm", "In The Salon 02", "The Salon"),
  v("vid-2-3.webm", "In The Salon 03", "The Salon"),
  v("vid-2-4.webm", "In The Salon 04", "The Salon"),
  v("video-5.webm", "In The Salon 05", "The Salon"),
  v("video-6.webm", "In The Salon 06", "The Salon"),
  v("video-7.webm", "In The Salon 07", "The Salon"),
  v("video-8.webm", "In The Salon 08", "The Salon"),
  v("video-9.webm", "In The Salon 09", "The Salon"),
  v("video-10.webm", "In The Salon 10", "The Salon"),

  // ── Client shoutouts (generated — see scratchpad/gen_shoutouts.py).
  v("lookbook/lookbook01.mp4", "Client Shoutout 01", "Shoutouts", "portrait"),
  v("lookbook/lookbook02.mp4", "Client Shoutout 02", "Shoutouts", "portrait"),
  v("lookbook/lookbook03.mp4", "Client Shoutout 03", "Shoutouts", "portrait"),
  v("lookbook/lookbook04.mp4", "Client Shoutout 04", "Shoutouts", "portrait"),
  v("lookbook/lookbook05.mp4", "Client Shoutout 05", "Shoutouts", "portrait"),
  v("lookbook/lookbook06.mp4", "Client Shoutout 06", "Shoutouts", "portrait"),
  v("lookbook/lookbook07.mp4", "Client Shoutout 07", "Shoutouts", "portrait"),
  v("lookbook/lookbook08.mp4", "Client Shoutout 08", "Shoutouts", "portrait"),
  v("lookbook/lookbook09.mp4", "Client Shoutout 09", "Shoutouts", "portrait"),
  v("lookbook/lookbook10.mp4", "Client Shoutout 10", "Shoutouts", "portrait"),
  v("lookbook/lookbook11.mp4", "Client Shoutout 11", "Shoutouts", "portrait"),
  v("lookbook/lookbook12.mp4", "Client Shoutout 12", "Shoutouts", "portrait"),
  v("lookbook/lookbook13.mp4", "Client Shoutout 13", "Shoutouts", "portrait"),
  v("lookbook/lookbook14.mp4", "Client Shoutout 14", "Shoutouts", "portrait"),
  v("lookbook/lookbook15.mp4", "Client Shoutout 15", "Shoutouts", "portrait"),
  v("lookbook/lookbook16.mp4", "Client Shoutout 16", "Shoutouts", "portrait"),
  v("lookbook/lookbook17.mp4", "Client Shoutout 17", "Shoutouts", "portrait"),
  v("lookbook/lookbook18.mp4", "Client Shoutout 18", "Shoutouts", "portrait"),
  v("lookbook/lookbook19.mp4", "Client Shoutout 19", "Shoutouts", "portrait"),
  v("lookbook/lookbook20.mp4", "Client Shoutout 20", "Shoutouts", "portrait"),
  v("lookbook/lookbook21.mp4", "Client Shoutout 21", "Shoutouts", "portrait"),
  v("lookbook/lookbook22.mp4", "Client Shoutout 22", "Shoutouts", "portrait"),
  v("lookbook/lookbook23.mp4", "Client Shoutout 23", "Shoutouts", "portrait"),
  v("lookbook/lookbook24.mp4", "Client Shoutout 24", "Shoutouts", "portrait"),
  v("lookbook/lookbook25.mp4", "Client Shoutout 25", "Shoutouts", "portrait"),
  v("lookbook/lookbook26.mp4", "Client Shoutout 26", "Shoutouts", "portrait"),
  v("lookbook/lookbook27.mp4", "Client Shoutout 27", "Shoutouts", "portrait"),
  v("lookbook/lookbook28.mp4", "Client Shoutout 28", "Shoutouts", "portrait"),
  v("lookbook/lookbook29.mp4", "Client Shoutout 29", "Shoutouts", "portrait"),
  v("lookbook/lookbook30.mp4", "Client Shoutout 30", "Shoutouts", "portrait"),
  v("lookbook/lookbook31.mp4", "Client Shoutout 31", "Shoutouts", "portrait"),
  v("lookbook/lookbook32.mp4", "Client Shoutout 32", "Shoutouts", "portrait"),
  v("lookbook/lookbook33.mp4", "Client Shoutout 33", "Shoutouts", "portrait"),
  v("lookbook/lookbook34.mp4", "Client Shoutout 34", "Shoutouts", "portrait"),
  v("lookbook/lookbook35.mp4", "Client Shoutout 35", "Shoutouts", "portrait"),
  v("lookbook/lookbook36.mp4", "Client Shoutout 36", "Shoutouts", "portrait"),
  v("lookbook/lookbook37.mp4", "Client Shoutout 37", "Shoutouts", "portrait"),
  v("lookbook/lookbook38.mp4", "Client Shoutout 38", "Shoutouts", "portrait"),
  v("lookbook/lookbook39.mp4", "Client Shoutout 39", "Shoutouts", "portrait"),
  v("lookbook/lookbook40.mp4", "Client Shoutout 40", "Shoutouts", "portrait"),
  v("lookbook/lookbook41.mp4", "Client Shoutout 41", "Shoutouts", "portrait"),
  v("lookbook/lookbook42.mp4", "Client Shoutout 42", "Shoutouts", "portrait"),
  v("lookbook/lookbook43.mp4", "Client Shoutout 43", "Shoutouts", "portrait"),
  v("lookbook/lookbook44.mp4", "Client Shoutout 44", "Shoutouts", "portrait"),
  v("lookbook/lookbook45.mp4", "Client Shoutout 45", "Shoutouts", "portrait"),
  v("lookbook/lookbook46.mp4", "Client Shoutout 46", "Shoutouts", "portrait"),
  v("lookbook/lookbook47.mp4", "Client Shoutout 47", "Shoutouts", "portrait"),
  v("lookbook/lookbook48.mp4", "Client Shoutout 48", "Shoutouts", "portrait"),
  v("lookbook/lookbook49.mp4", "Client Shoutout 49", "Shoutouts", "portrait"),
  v("lookbook/lookbook50.mp4", "Client Shoutout 50", "Shoutouts", "portrait"),
  v("lookbook/lookbook51.mp4", "Client Shoutout 51", "Shoutouts", "portrait"),
  v("lookbook/lookbook52.mp4", "Client Shoutout 52", "Shoutouts", "portrait"),
  v("lookbook/lookbook53.mp4", "Client Shoutout 53", "Shoutouts", "portrait"),
  v("lookbook/lookbook54.mp4", "Client Shoutout 54", "Shoutouts", "portrait"),
  v("lookbook/lookbook55.mp4", "Client Shoutout 55", "Shoutouts", "portrait"),
  v("lookbook/lookbook56.mp4", "Client Shoutout 56", "Shoutouts", "portrait"),
  v("lookbook/lookbook57.mp4", "Client Shoutout 57", "Shoutouts", "portrait"),
  v("lookbook/lookbook58.mp4", "Client Shoutout 58", "Shoutouts", "portrait"),
  v("lookbook/lookbook59.mp4", "Client Shoutout 59", "Shoutouts", "portrait"),
  v("lookbook/lookbook60.mp4", "Client Shoutout 60", "Shoutouts", "portrait"),
  v("lookbook/lookbook61.mp4", "Client Shoutout 61", "Shoutouts", "portrait"),
  v("lookbook/lookbook62.mp4", "Client Shoutout 62", "Shoutouts", "portrait"),
  v("lookbook/lookbook63.mp4", "Client Shoutout 63", "Shoutouts", "portrait"),
  v("lookbook/lookbook64.mp4", "Client Shoutout 64", "Shoutouts", "portrait"),
  v("lookbook/lookbook65.mp4", "Client Shoutout 65", "Shoutouts", "portrait"),
  v("lookbook/lookbook66.mp4", "Client Shoutout 66", "Shoutouts", "portrait"),
  v("lookbook/lookbook67.mp4", "Client Shoutout 67", "Shoutouts", "portrait"),
  v("lookbook/lookbook68.mp4", "Client Shoutout 68", "Shoutouts", "portrait"),
  v("lookbook/lookbook69.mp4", "Client Shoutout 69", "Shoutouts", "portrait"),
  v("lookbook/lookbook70.mp4", "Client Shoutout 70", "Shoutouts", "portrait"),
  v("lookbook/lookbook71.mp4", "Client Shoutout 71", "Shoutouts", "portrait"),
  v("lookbook/lookbook72.mp4", "Client Shoutout 72", "Shoutouts", "portrait"),
  // ── end shoutouts
];

/**
 * Everything the Lookbook shows, in one list: the curated stills first, then
 * every clip. One gallery, one filter bar — the page used to have two of
 * each, which split the same material in two for no reason a visitor could
 * see.
 */
export const lookbookMedia: LookbookMedia[] = [
  ...lookbookImages,
  ...lookbookVideos,
];
