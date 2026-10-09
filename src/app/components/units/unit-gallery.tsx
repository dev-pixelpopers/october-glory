"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useReveal } from "../service-detail/use-reveal";
import { tone as palette, type Tone } from "../service-detail/tone";
import { units, unitSpecLine, unitsPage } from "@/data/units";

/**
 * The browsable unit gallery. Every card opens that client's page — the
 * "clickable or expandable unit details" the handoff checklist asks for.
 *
 * Name and spec sit under the photo rather than over it: the deck asks for
 * the exact description beside or below each image, and laying it over the
 * portrait would make the colour unreadable against ten different heads
 * of hair.
 */
export default function UnitGallery({
  tone = "dark",
  /** Omit to show every unit — a unit's own page passes its siblings. */
  items = units,
  heading,
}: {
  tone?: Tone;
  items?: typeof units;
  heading?: { eyebrow?: string; heading: string; headingAccent?: string; intro?: string };
}) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];
  const copy = heading ?? unitsPage.gallery;

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-hidden`}
    >
      <div className="relative z-10 max-w-[1500px] mx-auto">
        <div className="text-center max-w-[760px] mx-auto mb-[var(--space-64)]">
          {copy.eyebrow && (
            <p
              data-reveal
              className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-20)]`}
            >
              {copy.eyebrow}
            </p>
          )}

          <h2
            data-reveal
            data-reveal-delay="1"
            className={`valturin text-[length:var(--fs-h2)] leading-[1.2] ${c.heading}`}
          >
            {copy.heading}
            {copy.headingAccent && (
              <span className="andrea text-[#ccb884]"> {copy.headingAccent}</span>
            )}
          </h2>

          {copy.intro && (
            <p
              data-reveal
              data-reveal-delay="2"
              className={`gotham text-[length:var(--fs-body)] leading-[1.8] ${c.body} font-light mt-[var(--space-24)]`}
            >
              {copy.intro}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-[var(--space-32)]">
          {items.map((unit, i) => (
            <Link
              key={unit.slug}
              href={`/wigs/${unit.slug}`}
              data-reveal
              data-reveal-delay={String(3 + (i % 5))}
              className="group flex flex-col"
            >
              <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[#2a2a2a]">
                <Image
                  src={unit.portrait}
                  alt={`${unit.name} unit`}
                  fill
                  sizes="(max-width: 1024px) 50vw, 20vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <h3
                className={`valturin text-[length:clamp(18px,16.5px_+_0.63vw,24px)] uppercase tracking-wider ${c.bodyStrong} mt-[var(--space-20)] group-hover:text-[#ccb884] transition-colors duration-300`}
              >
                {unit.name}
              </h3>
              <p
                className={`gotham text-[length:var(--fs-small)] leading-[1.7] ${c.muted} mt-[8px]`}
              >
                {unitSpecLine(unit)}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
