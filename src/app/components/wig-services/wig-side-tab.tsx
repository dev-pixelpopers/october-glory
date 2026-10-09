"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

/**
 * The fixed side tab linking the two halves of the wig section.
 *
 * It replaces the horizontal tab bar that used to sit under the hero: that
 * bar cost a full strip of page on every wig page to carry two links, and
 * read as a navigation pattern borrowed from somewhere else on the site.
 * This sits in the right margin, out of the reading column. It stays out of
 * the way until the hero has been scrolled past — the hero already carries
 * its own call to action, and a second one floating over it would compete.
 *
 * `z-30` is deliberate and load-bearing. The closing CTA on each page is
 * raised above it, so scrolling to the end of the page hides the tab behind
 * that panel instead of floating it over the page's final word. The
 * back-to-top button sits far above both at z-9998 and is unaffected.
 */
export default function WigSideTab({
  href,
  label,
}: {
  href: string;
  label: string;
}) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // The hero is a full viewport tall on every page this appears on, so the
    // viewport height is the threshold. 0.85 brings the tab in just before
    // the hero fully clears, which reads as arriving with the content.
    const onScroll = () => setIsVisible(window.scrollY > window.innerHeight * 0.85);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed right-[2%] top-1/2 z-30 -translate-y-1/2 transition-opacity duration-300"
      style={{
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? "auto" : "none",
      }}
      aria-hidden={!isVisible}
    >
      <Link
        href={href}
        /* `writing-mode: vertical-rl` turns the line on its side; the 180°
           rotation flips it to read bottom-to-top, which is the convention
           for a tab on the right edge. */
        style={{ writingMode: "vertical-rl" }}
        className="group flex rotate-180 items-center gap-[var(--space-16)] rounded-full border border-[#ccb884]/40 bg-[#1B1B1B]/85 py-[var(--space-24)] px-[10px] gotham text-[length:clamp(10px,9.3px_+_0.19vw,12px)] uppercase tracking-[4px] text-[#ccb884] backdrop-blur-sm transition-colors duration-300 hover:bg-[#ccb884] hover:text-[#1B1B1B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ccb884]"
      >
        {label}
        {/* Rotated back upright so the arrow still points the way the tab
            sends you, rather than lying on its side with the text. */}
        <span
          aria-hidden="true"
          className="rotate-90 text-[14px] transition-transform duration-300 group-hover:translate-x-[-2px]"
        >
          →
        </span>
      </Link>
    </div>
  );
}
