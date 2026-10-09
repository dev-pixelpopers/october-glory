"use client";

import React from "react";
import Image from "next/image";
import { useReveal } from "../service-detail/use-reveal";
import { tone as palette, type Tone } from "../service-detail/tone";
import { unitSpecLine, type UnitStory } from "@/data/units";

/** The three frames of the install, labelled. */
function JourneyStrip({
  unit,
  c,
}: {
  unit: UnitStory;
  c: (typeof palette)[Tone];
}) {
  if (!unit.journey) return null;

  const frames = [
    { src: unit.journey.before, label: "Before" },
    { src: unit.journey.mid, label: "Braided down" },
    { src: unit.journey.after, label: "After" },
  ];

  return (
    <div className="grid grid-cols-3 gap-[var(--space-16)] md:gap-[var(--space-24)]">
      {frames.map((frame, i) => (
        <figure key={frame.label} data-reveal data-reveal-delay={String(i + 1)}>
          <div className="relative aspect-[3/4] rounded-[18px] overflow-hidden bg-[#2a2a2a]">
            <Image
              src={frame.src}
              alt={`${unit.name}, ${frame.label.toLowerCase()}`}
              fill
              sizes="(max-width: 768px) 33vw, 300px"
              className="object-cover"
            />
          </div>
          <figcaption
            className={`gotham text-[length:var(--fs-small)] tracking-[3px] uppercase ${c.muted} mt-[12px] text-center`}
          >
            {frame.label}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/**
 * One client's unit, told end to end: what she asked for, what was built, the
 * three frames of the install, her reaction, and the unit on video.
 *
 * The three prose blocks are the case study. They are placeholder copy until
 * the salon writes the real version — see the header of `src/data/units.ts`.
 */
export default function UnitStorySection({
  unit,
  tone = "light",
}: {
  unit: UnitStory;
  tone?: Tone;
}) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];

  const chapters = [
    { label: "What she wanted", body: unit.brief },
    { label: "What we built", body: unit.build },
    { label: "How she wears it", body: unit.reaction },
  ];

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-hidden`}
    >
      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Spec strip — the whiteboard's own description, verbatim. */}
        <dl
          data-reveal
          className={`grid grid-cols-3 gap-[var(--space-24)] border-y ${c.border} py-[var(--space-32)] text-center`}
        >
          {[
            ["Length", unit.spec.length],
            ["Texture", unit.spec.texture],
            ["Colour", unit.spec.color],
          ].map(([label, value]) => (
            <div key={label}>
              <dt
                className={`gotham text-[length:var(--fs-small)] tracking-[3px] uppercase ${c.muted} mb-[12px]`}
              >
                {label}
              </dt>
              <dd
                className={`valturin text-[length:clamp(18px,16.5px_+_0.63vw,24px)] ${c.bodyStrong}`}
              >
                {value}
              </dd>
            </div>
          ))}
        </dl>

        <div className="mt-[var(--space-80)] grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-64)] items-start">
          <div className="flex flex-col gap-[var(--space-40)]">
            {chapters.map((chapter, i) => (
              <div key={chapter.label} data-reveal data-reveal-delay={String(i + 1)}>
                <h3
                  className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-16)]`}
                >
                  {chapter.label}
                </h3>
                <p
                  className={`gotham text-[length:var(--fs-body)] leading-[1.9] ${c.body} font-light`}
                >
                  {chapter.body}
                </p>
              </div>
            ))}

            {unit.quote && (
              <blockquote
                data-reveal
                data-reveal-delay="4"
                className={`border-l-2 border-[#ccb884] pl-[var(--space-24)] mt-[8px]`}
              >
                {/* Gotham, not Andrea: the cursive display face is for two or
                    three words, and a full sentence in it is unreadable. */}
                <p
                  className={`gotham font-light italic text-[length:clamp(19px,17.35px_+_0.69vw,26px)] leading-[1.7] ${c.bodyStrong}`}
                >
                  &ldquo;{unit.quote}&rdquo;
                </p>
                <cite
                  className={`gotham not-italic text-[length:var(--fs-small)] tracking-[3px] uppercase ${c.muted} mt-[var(--space-16)] block`}
                >
                  {unit.name} — {unitSpecLine(unit)}
                </cite>
              </blockquote>
            )}
          </div>

          {unit.video && (
            <div data-reveal data-reveal-delay="2" className="relative lg:sticky lg:top-[var(--space-40)]">
              <div className="absolute -inset-4 md:-inset-6 border border-[#ccb884]/25 rounded-[28px] pointer-events-none translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5" />
              <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden bg-[#2a2a2a]">
                <video
                  src={unit.video}
                  poster={unit.portrait}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={`${unit.name}'s unit`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="mt-[var(--space-80)]">
          <h3
            data-reveal
            className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-32)] text-center`}
          >
            The Install
          </h3>
          <JourneyStrip unit={unit} c={c} />
        </div>
      </div>
    </section>
  );
}
