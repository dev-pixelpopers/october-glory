"use client";

import React from "react";
import { useReveal } from "../service-detail/use-reveal";
import { tone as palette, type Tone } from "../service-detail/tone";
import type { UnitStory } from "@/data/units";

export type UnitStoryData = {
  slug: string;
  name: string;
  spec?: { length: string; texture: string; color: string };
  length?: string | null;
  texture?: string | null;
  color?: string | null;
  portrait?: string;
  image?: string | null;
  background_image?: string | null;
  video?: string | null;
  journey?: { before: string; mid: string; after: string };
  the_install?: Array<{ image: string; tag: string }>;
  brief?: string;
  build?: string;
  reaction?: string;
  what_she_wanted?: string | null;
  what_we_built?: string | null;
  how_she_wears_it?: string | null;
  quote?: string;
};

/** The install frames, mapped from the_install (or fallback journey), labelled with their tags. */
function InstallGrid({
  items,
  c,
  unitName,
}: {
  items: Array<{ image: string; tag: string }>;
  c: (typeof palette)[Tone];
  unitName: string;
}) {
  if (!items || items.length === 0) return null;

  return (
    <div
      className={`grid gap-[var(--space-16)] md:gap-[var(--space-24)] ${
        items.length <= 2
          ? "grid-cols-2 max-w-[700px] mx-auto"
          : items.length === 3
          ? "grid-cols-3"
          : "grid-cols-2 md:grid-cols-4"
      }`}
    >
      {items.map((step, i) => (
        <figure key={`${step.tag}-${i}`} data-reveal data-reveal-delay={String(i + 1)}>
          <div className="relative aspect-[3/4] rounded-[18px] overflow-hidden bg-[#2a2a2a]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={step.image}
              alt={`${unitName}, ${step.tag.toLowerCase()}`}
              className="w-full h-full object-cover"
            />
          </div>
          <figcaption
            className={`gotham text-[length:var(--fs-small)] tracking-[3px] uppercase ${c.muted} mt-[12px] text-center font-medium`}
          >
            {step.tag}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

/**
 * One client's unit, told end to end: what she asked for, what was built, the
 * install stages, her reaction, and the unit on video.
 */
export default function UnitStorySection({
  unit,
  tone = "light",
}: {
  unit: UnitStoryData;
  tone?: Tone;
}) {
  const installItems =
    unit.the_install && unit.the_install.length > 0
      ? unit.the_install
      : unit.journey
      ? [
          { image: unit.journey.before, tag: "Before" },
          { image: unit.journey.mid, tag: "Braided down" },
          { image: unit.journey.after, tag: "After" },
        ]
      : [];

  const scope = useReveal<HTMLElement>([
    unit.slug,
    unit.video,
    installItems.map((s) => s.tag).join("|"),
  ]);
  const c = palette[tone];

  const whatSheWanted = unit.what_she_wanted || unit.brief;
  const whatWeBuilt = unit.what_we_built || unit.build;
  const howSheWearsIt = unit.how_she_wears_it || unit.reaction;

  const chapters = [
    { label: "What she wanted", body: whatSheWanted },
    { label: "What we built", body: whatWeBuilt },
    { label: "How she wears it", body: howSheWearsIt },
  ].filter((ch) => Boolean(ch.body));

  const lengthVal = unit.length || unit.spec?.length;
  const textureVal = unit.texture || unit.spec?.texture;
  const colorVal = unit.color || unit.spec?.color;

  const specs = [
    ["Length", lengthVal],
    ["Texture", textureVal],
    ["Colour", colorVal],
  ].filter(([, val]) => Boolean(val));

  const specSummary = [lengthVal, textureVal, colorVal].filter(Boolean).join(" · ");
  const posterImg = unit.background_image || unit.portrait || unit.image || undefined;

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-hidden`}
    >
      <div className="relative z-10 max-w-[1200px] mx-auto">
        {/* Spec strip — the whiteboard's description */}
        {specs.length > 0 && (
          <dl
            data-reveal
            className={`grid grid-cols-3 gap-[var(--space-24)] border-y ${c.border} py-[var(--space-32)] text-center`}
          >
            {specs.map(([label, value]) => (
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
        )}

        <div className="mt-[var(--space-80)] grid grid-cols-1 xl:grid-cols-2 gap-[var(--space-64)] items-start ">
          <div className="flex flex-col gap-[var(--space-40)] order-2 xl:order-1">
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
                <p
                  className={`gotham font-light italic text-[length:clamp(19px,17.35px_+_0.69vw,26px)] leading-[1.7] ${c.bodyStrong}`}
                >
                  &ldquo;{unit.quote}&rdquo;
                </p>
                <cite
                  className={`gotham not-italic text-[length:var(--fs-small)] tracking-[3px] uppercase ${c.muted} mt-[var(--space-16)] block`}
                >
                  {unit.name} {specSummary ? `— ${specSummary}` : ""}
                </cite>
              </blockquote>
            )}
          </div>

          {unit.video && (
            <div data-reveal data-reveal-delay="2" className="relative xl:sticky xl:top-[var(--space-40)] order-1 xl:order-2">
              {/* <div className="absolute -inset-4 md:-inset-6 border border-[#ccb884]/25 rounded-[28px] pointer-events-none translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5" /> */}
              <div className="relative aspect-[1] rounded-[24px] overflow-hidden bg-[#2a2a2a]">
                <video
                  src={unit.video || undefined}
                  poster={posterImg}
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

        {installItems.length > 0 && (
          <div className="mt-[var(--space-80)]">
            <h3
              data-reveal
              className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-32)] text-center`}
            >
              The Install
            </h3>
            <InstallGrid items={installItems} c={c} unitName={unit.name} />
          </div>
        )}
      </div>
    </section>
  );
}
