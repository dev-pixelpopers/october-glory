"use client";

import React, { useState } from "react";
import {
  lookbookMedia,
  videoCategories,
  type LookbookMedia,
  type VideoCategory,
} from "@/data/lookbook-videos";

/**
 * One video tile that loads nothing until it is clicked.
 *
 * The `<video>` element is not rendered at all while the tile is idle — a
 * `preload="none"` attribute still hands the browser a URL it may decide to
 * touch, and Safari fetches the first bytes regardless to satisfy its own
 * poster handling. Mounting the element only on click is the one approach
 * where the network stays completely quiet, which matters here: the full set
 * of clips is a little over 300 MB.
 *
 * The idle state is a `<button>`, so it is reachable by keyboard and
 * announced as a control rather than as a picture.
 */
export function ClickToPlay({
  src,
  poster,
  label,
  isPlaying,
  onPlay,
  className = "",
  style,
}: {
  src: string;
  poster: string;
  label: string;
  isPlaying: boolean;
  onPlay: () => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  if (isPlaying) {
    return (
      <video
        src={src}
        poster={poster}
        controls
        autoPlay
        playsInline
        preload="none"
        // `contain`, not `cover`: the tiles are a fixed 4:5 and much of
        // this footage is 9:16, so cropping to fill would cut the top of
        // someone's head off mid-sentence. The poster stays `cover` so the
        // grid still reads as even; only the clip being watched is shown
        // whole, letterboxed against the tile's own black.
        className={`w-full h-full object-contain bg-black ${className}`}
        style={style}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={onPlay}
      aria-label={`Play ${label}`}
      className={`group/play relative block w-full h-full overflow-hidden cursor-pointer ${className}`}
      style={style}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={poster}
        alt=""
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-700 group-hover/play:scale-105"
      />

      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />

      {/* Play affordance */}
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-[64px] h-[64px] rounded-full border border-[#d4af6e] bg-black/40 backdrop-blur-sm flex items-center justify-center transition-all duration-500 group-hover/play:bg-[#d4af6e] group-hover/play:scale-110">
          <svg
            viewBox="0 0 24 24"
            aria-hidden="true"
            className="w-[22px] h-[22px] translate-x-[2px] fill-[#d4af6e] transition-colors duration-500 group-hover/play:fill-black"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </span>

      <span className="absolute bottom-0 left-0 right-0 p-[var(--space-24)] text-left">
        <span className="valturin block text-[18px] text-white tracking-wider">
          {label}
        </span>
      </span>
    </button>
  );
}

/** A photograph. No play affordance — there is nothing to start. */
function StillTile({ item }: { item: LookbookMedia }) {
  return (
    <div className="group/still relative block w-full h-full overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={item.src}
        alt={item.label}
        loading="lazy"
        decoding="async"
        className="w-full h-full object-cover transition-transform duration-700 group-hover/still:scale-105"
      />
      <span className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-black/20" />
      <span className="absolute bottom-0 left-0 right-0 p-[var(--space-24)] text-left">
        <span className="valturin block text-[18px] text-white tracking-wider">
          {item.label}
        </span>
        {item.description && (
          <span className="gotham block text-[length:var(--fs-small)] text-gray-300 font-light leading-relaxed mt-[6px] max-w-[320px] opacity-0 group-hover/still:opacity-100 transition-opacity duration-500">
            {item.description}
          </span>
        )}
      </span>
    </div>
  );
}

/**
 * Tiles shown before "Load more". The wall runs to over a hundred clips, and
 * mounting every tile at once means a hundred poster requests on a page the
 * visitor may only scroll half of.
 */
const PAGE_SIZE = 12;

/**
 * The Lookbook gallery: every still and every clip in one filterable wall.
 *
 * One playing at a time — starting a second tile unmounts the first, so the
 * page never has more than one video stream open.
 */
export default function LookbookGallery() {
  const [filter, setFilter] = useState<VideoCategory | "All">("All");
  const [playing, setPlaying] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE_SIZE);

  const matching =
    filter === "All"
      ? lookbookMedia
      : lookbookMedia.filter((item) => item.category === filter);

  const items = matching.slice(0, shown);
  const remaining = matching.length - items.length;

  return (
    <div className="relative z-10 max-w-[1400px] mx-auto">
      <div className="flex flex-col items-center text-center mb-[var(--space-48)]">
        <span className="andrea text-[length:var(--fs-accent)] text-gold mb-[-10px]">
          Every
        </span>
        <h2 className="valturin text-[length:var(--fs-h2)] text-white uppercase tracking-widest">
          Look
        </h2>
        <p className="gotham text-[length:var(--fs-body)] text-gray-400 font-light mt-[var(--space-24)] max-w-[600px]">
          Finished looks, the process behind them, and the moments in between
          — our clients&apos; own shoutouts included.
        </p>
        <p className="gotham text-[length:var(--fs-small)] text-gray-500 font-light mt-[var(--space-16)]">
          Tap a clip to play — nothing loads until you do.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-center gap-[var(--space-16)] mb-[var(--space-48)]">
        {(["All", ...videoCategories] as const).map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => {
              setFilter(cat);
              setPlaying(null);
              setShown(PAGE_SIZE);
            }}
            aria-pressed={filter === cat}
            className={`gotham text-[14px] tracking-wider uppercase px-[var(--space-24)] py-2 rounded-full border transition-all duration-300 cursor-pointer ${
              filter === cat
                ? "bg-[#C0A062] border-[#C0A062] text-black font-semibold"
                : "bg-transparent border-white/20 text-gray-300 hover:border-[#C0A062] hover:text-[#C0A062]"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* One tile size for everything. The footage is a mix of 9:16 phone
          video and 16:9 landscape, and sizing each tile to its own aspect
          left the grid ragged with gaps down the right. Every tile is 4:5
          and the media is cropped to fill it, so the rows line up. */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[var(--space-24)]">
        {items.map((item) => (
          <div
            key={item.src}
            className="relative aspect-[4/5] rounded-[1.25rem] overflow-hidden bg-[#111]"
          >
            {item.kind === "image" ? (
              <StillTile item={item} />
            ) : (
              <ClickToPlay
                src={item.src}
                poster={item.poster}
                label={item.label}
                isPlaying={playing === item.src}
                onPlay={() => setPlaying(item.src)}
              />
            )}
            <span className="absolute top-0 left-0 w-full h-[3px] bg-[#C0A062] scale-x-0 hover:scale-x-100 transition-transform duration-500 origin-left pointer-events-none" />
          </div>
        ))}
      </div>

      {remaining > 0 && (
        <div className="flex flex-col items-center gap-[var(--space-16)] mt-[var(--space-64)]">
          <button
            type="button"
            onClick={() => setShown((count) => count + PAGE_SIZE)}
            className="gotham text-[14px] tracking-[2px] uppercase px-[var(--space-40)] py-3 rounded-full border border-[#C0A062] text-[#C0A062] hover:bg-[#C0A062] hover:text-black transition-all duration-300 cursor-pointer"
          >
            Load more
          </button>
          <p
            aria-live="polite"
            className="gotham text-[length:var(--fs-small)] text-gray-500 font-light"
          >
            Showing {items.length} of {matching.length}
          </p>
        </div>
      )}
    </div>
  );
}
