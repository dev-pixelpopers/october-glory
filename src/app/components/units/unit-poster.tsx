"use client";

import React from "react";
import Image from "next/image";
import { useReveal } from "../service-detail/use-reveal";
import { tone as palette, type Tone } from "../service-detail/tone";
import { unitsPage } from "@/data/units";

/**
 * The "Custom Luxury Units" poster, rebuilt as a page section.
 *
 * The client asked for the poster's information and layout on the wig part of
 * the site, so this keeps the poster's own order — logo line, title, body,
 * then the pair of photographs beneath — rather than reflowing it into the
 * site's usual text-beside-image block.
 */
export default function UnitPoster({ tone = "light" }: { tone?: Tone }) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];
  const { poster } = unitsPage;

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-hidden`}
    >
      <div className="relative z-10 max-w-[98%] flex flex-row items-center gap-[20px]">

        <div className="space-y-[var(--space-24)] w-1/2">
          <p
          data-reveal
          className={`andrea ${c.eyebrow} text-[length:var(--fs-accent)] leading-none mb-[12px]`}
        >
          {poster.eyebrow}
        </p>

          <h2
          data-reveal
          data-reveal-delay="1"
          className={`valturin text-[length:var(--fs-h2)] leading-[1.2] uppercase tracking-[0.12em] ${c.heading}`}
        >
          {poster.heading}
        </h2>

          <div
          data-reveal
          data-reveal-delay="2"
          className="w-[110px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent mx-auto mt-[var(--space-28)] mb-[var(--space-40)]"
        />

          {poster.body.map((paragraph, i) => (
            <p
              key={i}
              data-reveal
              data-reveal-delay={String(3 + i)}
              className={`gotham text-[length:var(--fs-body)] leading-[1.9] ${c.body} font-light`}
            >
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-[var(--space-56)] grid grid-cols-2 gap-[var(--space-24)] w-1/2">
          {poster.images.map((src, i) => (
            <div
              key={src}
              data-reveal
              data-reveal-delay={String(3 + poster.body.length + i)}
              className="relative aspect-[3/4] rounded-[20px] overflow-hidden bg-[#2a2a2a]"
            >
              <Image
                src={src}
                alt=""
                fill
                sizes="(max-width: 768px) 50vw, 380px"
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
