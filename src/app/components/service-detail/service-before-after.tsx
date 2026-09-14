"use client";

import React from "react";
import { useReveal } from "./use-reveal";
import type { ServiceBeforeAfter } from "@/data/services/types";
import { tone as palette, type Tone } from "./tone";
import BeforeAfter from "./before-after";

/**
 * The before/after block as a section of its own.
 *
 * `BeforeAfter` does the wipe; this wraps it in the page's heading rhythm so
 * it sits on the page like every other section rather than as a widget dropped
 * into the middle of one.
 */
export default function ServiceBeforeAfterSection({
  beforeAfter,
  tone = "dark",
}: {
  beforeAfter: ServiceBeforeAfter;
  tone?: Tone;
}) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];
  const { eyebrow, heading, headingAccent, intro, ...compare } = beforeAfter;

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-hidden`}
    >
      <div className="relative z-10 max-w-[900px] mx-auto">
        <div className="text-center">
          {eyebrow && (
            <p
              data-reveal
              className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-20)]`}
            >
              {eyebrow}
            </p>
          )}

          {heading && (
            <h2
              data-reveal
              data-reveal-delay="1"
              className={`valturin text-[length:var(--fs-h2)] leading-[1.2] ${c.heading}`}
            >
              {heading}
              {headingAccent && (
                <span className="andrea text-[#ccb884]"> {headingAccent}</span>
              )}
            </h2>
          )}

          <div
            data-reveal
            data-reveal-delay="2"
            className="w-[110px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent mx-auto mt-[var(--space-28)] mb-[var(--space-32)]"
          />

          {intro && (
            <p
              data-reveal
              data-reveal-delay="3"
              className={`gotham text-[length:var(--fs-body)] leading-[1.8] ${c.body} font-light mb-[var(--space-56)]`}
            >
              {intro}
            </p>
          )}
        </div>

        <div data-reveal data-reveal-delay="4">
          <BeforeAfter {...compare} tone={tone} />
        </div>
      </div>
    </section>
  );
}
