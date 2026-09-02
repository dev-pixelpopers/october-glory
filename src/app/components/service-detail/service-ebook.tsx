"use client";

import React from "react";
import Link from "next/link";
import { useReveal } from "./use-reveal";
import { tone as palette } from "./tone";
import type { ServiceEbook } from "@/data/services/types";

/**
 * The downloadable guide block — the same two-panel composition as the home
 * page's "Your Guide to the Perfect Choice": a white cover card on the left
 * with the gradient copy panel overlapping its right edge.
 *
 * Two deliberate differences from the home version. It is not sticky, and the
 * copy rises in on entry rather than being scrubbed by scroll position, because
 * this section is an anchor target: the home page's service CTAs link straight
 * to `#ebook`, and a scrub-linked reveal would land arrivals on a panel whose
 * text is still clipped to nothing.
 *
 * Rendered only for services whose data defines `ebook`.
 */
export default function ServiceEbookSection({ ebook }: { ebook: ServiceEbook }) {
  const scope = useReveal<HTMLElement>();
  const c = palette.dark;

  return (
    <section
      ref={scope}
      id="ebook"
      // Cleared by the fixed header when arriving via the anchor.
      className={`reveal-scope scroll-mt-[100px] relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-hidden`}
    >
      <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-center">
        <div
          data-reveal
          className="w-full md:w-[55%] bg-white rounded-3xl p-[var(--space-16)] md:p-0 shadow-lg overflow-hidden"
        >
          <img
            src={ebook.image}
            alt={`${ebook.display} ${ebook.script} — downloadable guide`}
            className="w-full object-contain rounded-3xl"
          />
        </div>

        {/* Overlaps the card's right edge, so it has to paint above it. */}
        <div
          className="relative z-10 w-full md:w-[50%] px-[var(--space-32)] md:px-[var(--space-40)] py-[clamp(28px,15.15px_+_1.294vw,48px)] flex flex-col justify-center rounded-[20px] -mt-[var(--space-32)] md:mt-0 md:-ml-[clamp(32px,15.5px_+_4.401vw,100px)]"
          style={{
            backgroundImage: "linear-gradient(270deg, #93674D 0%, #2D2018 100%)",
          }}
        >
          {ebook.eyebrow && (
            <p
              data-reveal
              data-reveal-delay="1"
              className={`gotham ${c.eyebrow} text-[13px] md:text-[14px] tracking-[6px] uppercase mb-[var(--space-16)]`}
            >
              {ebook.eyebrow}
            </p>
          )}

          <h2
            data-reveal
            data-reveal-delay="2"
            className="text-white text-[length:clamp(32px,18.41px_+_3.625vw,88px)] leading-[clamp(48px,31.94px_+_6.149vw,120px)] andrea capitalize"
          >
            {ebook.display}
          </h2>

          <div className="pl-[clamp(42px,20.64px_+_5.696vw,130px)]">
            <h3
              data-reveal
              data-reveal-delay="3"
              className="text-[#c1a073] text-[length:clamp(28px,18.78px_+_2.46vw,66px)] valturin capitalize mb-[clamp(20px,17.57px_+_0.647vw,30px)]"
            >
              {ebook.script}
            </h3>
          </div>

          <p
            data-reveal
            data-reveal-delay="4"
            className="text-gray-200 text-[length:clamp(17px,18.27px_+_0.194vw,22px)] leading-[clamp(34px,39.3px_+_0.453vw,48px)] gotham mb-[clamp(25px,18.93px_+_1.618vw,50px)] pr-[clamp(0px,15.15px_+_1.294vw,40px)]"
          >
            {ebook.body}
          </p>

          <Link
            data-reveal
            data-reveal-delay="5"
            href={ebook.href}
            className="flex items-center gap-[var(--space-16)] group w-max"
          >
            <div className="w-15 h-15 shrink-0 rounded-full border border-gray-400 flex items-center justify-center transition-colors duration-300 group-hover:bg-white group-hover:text-black text-gray-300">
              {/* Download arrow — this CTA hands over a file rather than
                  moving the visitor to another page. */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v13.5m0 0l-4.5-4.5M12 16.5l4.5-4.5M3.75 20.25h16.5"
                />
              </svg>
            </div>
            <span className="text-white gotham text-[length:clamp(17px,16.27px_+_0.194vw,20px)] transition-colors duration-300">
              {ebook.cta}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
