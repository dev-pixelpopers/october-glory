"use client";

import React, { useEffect, useState } from "react";

/**
 * Floating "Back to Top" control, pinned 2% in from the bottom-right corner.
 * Mounted once in the root layout so it rides along on every page.
 */
export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show it once the reader is a screen-height or so down the page.
    const onScroll = () => setIsVisible(window.scrollY > window.innerHeight * 0.5);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    // Respect a reduced-motion preference rather than animating the whole page.
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      title="Back to top"
      className="fixed bottom-[2%] right-[2%] z-[9998] grid place-items-center rounded-full bg-[#1B1B1B] text-[#ccb884] shadow-lg
        h-[clamp(40px,36.12px_+_1.036vw,56px)] w-[clamp(40px,36.12px_+_1.036vw,56px)]
        border border-[#ccb884]/40 cursor-pointer
        transition-[opacity,transform,background-color,color] duration-300 ease-out
        hover:bg-[#ccb884] hover:text-[#1B1B1B]
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ccb884]"
      // Tailwind's preflight resets `opacity` on buttons in a cascade layer that
      // outranks the utilities layer here, so the fade is driven inline instead.
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(12px)",
        pointerEvents: isVisible ? "auto" : "none",
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-[45%] w-[45%]"
        aria-hidden="true"
      >
        <line x1="12" y1="19" x2="12" y2="5" />
        <polyline points="5 12 12 5 19 12" />
      </svg>
    </button>
  );
}
