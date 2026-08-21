"use client";

import React from "react";
import { useReveal } from "./use-reveal";
import type { ServiceNote } from "@/data/services/types";
import { tone as palette, type Tone } from "./tone";
import BeforeAfter from "./before-after";

/**
 * Editorial block for the "why this matters" explainers — the trim rationale
 * on Silk Press and Rod Set, and anything similar on other services.
 */
export default function ServiceNoteSection({
  note,
  tone = "dark",
}: {
  note: ServiceNote;
  tone?: Tone;
}) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[100px] md:py-[140px] px-[24px] md:px-[110px] overflow-hidden`}
    >
      {/* Oversized quote mark */}
      <span
        aria-hidden="true"
        className="valturin absolute top-[40px] left-[20px] md:left-[80px] text-[220px] md:text-[320px] leading-none text-[#ccb884]/[0.06] select-none pointer-events-none"
      >
        &ldquo;
      </span>

      <div className="relative z-10 max-w-[900px] mx-auto text-center">
        {note.eyebrow && (
          <p
            data-reveal
            className={`gotham ${c.eyebrow} text-[13px] md:text-[14px] tracking-[6px] uppercase mb-5`}
          >
            {note.eyebrow}
          </p>
        )}

        <h2
          data-reveal
          data-reveal-delay="1"
          className={`valturin text-[36px] md:text-[54px] leading-[1.2] ${c.heading}`}
        >
          {note.heading}
        </h2>

        <div
          data-reveal
          data-reveal-delay="2"
          className="w-[110px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent mx-auto mt-7 mb-10"
        />

        <div className="space-y-6">
          {note.body.map((paragraph, i) => (
            <p
              key={i}
              data-reveal
              data-reveal-delay={String(3 + i)}
              className={`gotham text-[16px] md:text-[19px] leading-[32px] md:leading-[36px] ${c.body} font-light`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        {/* The proof for the argument the copy just made, so it lands after
            the body rather than competing with it. */}
        {note.compare && (
          <div
            data-reveal
            data-reveal-delay={String(3 + note.body.length)}
            className="mt-14 md:mt-20"
          >
            <BeforeAfter {...note.compare} tone={tone} />
          </div>
        )}
      </div>
    </section>
  );
}
