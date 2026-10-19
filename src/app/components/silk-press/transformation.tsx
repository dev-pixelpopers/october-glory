"use client";

import React from "react";
import Image from "next/image";
import { useReveal } from "../service-detail/use-reveal";
import { tone as palette, type Tone } from "../service-detail/tone";
import { silkPressPage } from "@/data/silk-press-new";

/**
 * Before and after, side by side.
 *
 * Side by side rather than the draggable wipe used elsewhere on the site: the
 * whole point of a silk press is the distance between the two states, and a
 * wipe only ever shows one of them at a time. Here you can hold both in view
 * at once and look back and forth, which is what anyone deciding whether to
 * book actually does.
 *
 * Both frames are the same aspect and height, because a comparison where the
 * pictures are different sizes is not a comparison.
 */
export default function Transformation({ tone = "light" }: { tone?: Tone }) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];
  const { transformation: t } = silkPressPage;

  const frames = [
    { ...t.before, accent: false },
    { ...t.after, accent: true },
  ];

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-x-clip`}
    >
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="mx-auto mb-[var(--space-64)] max-w-[860px] text-center">
          <p
            data-reveal
            className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] uppercase tracking-[6px] mb-[var(--space-20)]`}
          >
            {t.eyebrow}
          </p>
          <h2
            data-reveal
            data-reveal-delay="1"
            className={`valturin text-[length:var(--fs-h2)] leading-[1.2] ${c.heading}`}
          >
            {t.heading}
            <span className="andrea text-[#ccb884]"> {t.headingAccent}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-[var(--space-32)] sm:grid-cols-2">
          {frames.map((frame, i) => (
            <figure key={frame.label} data-reveal data-reveal-delay={String(2 + i)}>
              <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[20px] bg-[#2a2a2a]">
                <Image
                  src={frame.image}
                  alt={`${frame.label}: ${frame.caption}`}
                  fill
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              <figcaption
                className={`mt-[var(--space-24)] flex flex-wrap items-baseline justify-between gap-[var(--space-16)] border-t pt-[var(--space-16)] ${c.border}`}
              >
                <span
                  className={`valturin text-[length:clamp(22px,19.65px_+_0.99vw,30px)] ${
                    frame.accent ? "text-[#ccb884]" : c.bodyStrong
                  }`}
                >
                  {frame.label}
                </span>
                <span
                  className={`gotham text-[length:var(--fs-small)] leading-[1.6] ${c.muted}`}
                >
                  {frame.caption}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
