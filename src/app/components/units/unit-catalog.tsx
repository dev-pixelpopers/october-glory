"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useReveal } from "../service-detail/use-reveal";
import { tone as palette, type Tone } from "../service-detail/tone";
import { unitInches, units, type UnitStory } from "@/data/units";

/**
 * One unit: the portrait, which is also the video.
 *
 * The portrait and the unit video are the same head of hair, so showing both
 * as separate thumbnails spent twice the space to say one thing and left each
 * too small to read. The portrait is the video's poster now — point at it and
 * it plays in place.
 *
 * `preload="none"` keeps ten clips off the wire until one is actually asked
 * for. Touch has no hover, so the card's link carries those visitors to the
 * unit's own page, where the video plays on its own.
 */
function UnitFrame({ unit }: { unit: UnitStory }) {
  const ref = React.useRef<HTMLVideoElement>(null);

  const play = () => {
    // A rejected play() is normal — the pointer can leave before the first
    // frame decodes — so it must not surface as an unhandled rejection.
    void ref.current?.play().catch(() => {});
  };

  const stop = () => {
    const video = ref.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-[#2a2a2a]"
      onPointerEnter={play}
      onPointerLeave={stop}
    >
      <Image
        src={unit.portrait}
        alt={`The ${unit.name} unit`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 45vw, 30vw"
        className="object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
      />

      {unit.video && (
        <video
          ref={ref}
          src={unit.video}
          loop
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
      )}

      {unit.video && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-4 left-4 right-4 flex items-center gap-[10px] transition-opacity duration-300 group-hover:opacity-0"
        >
          <span className="grid h-[34px] w-[34px] shrink-0 place-items-center rounded-full bg-[#1B1B1B]/70 text-[11px] text-[#ccb884] backdrop-blur-sm">
            ▶
          </span>
          {/* The deck labels each clip "Unit video". It sat on a separate
              thumbnail there; here the portrait is the poster, so the label
              rides with the play badge instead of captioning a second image. */}
          <span className="gotham text-[11px] uppercase tracking-[3px] text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            Unit video
          </span>
        </span>
      )}
    </div>
  );
}

/**
 * The unit catalogue.
 *
 * Order and numbering follow the handoff deck exactly — 01 to 10, Tiffany
 * first — because those numbers are how the salon refers to its own units,
 * and renumbering them on the site would break that reference.
 *
 * Within each card the length leads, set large. It is the first thing anyone
 * asks about a unit and the one spec value that compares at a glance, and in
 * the deck's own layout it was the smallest type on the page.
 */
export default function UnitCatalog({
  tone = "light",
  heading,
}: {
  tone?: Tone;
  heading?: { eyebrow?: string; heading: string; headingAccent?: string; intro?: string };
}) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];
  const copy = heading ?? {
    eyebrow: "The Units",
    heading: "The Unit",
    headingAccent: "Catalog",
    intro:
      "Every unit was built for the client it is named after, from a 12-inch bob to 24 inches of balayage. Point at any one to see it move; open it to see how it was made.",
  };

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-x-clip`}
    >
      <div className="relative z-10 mx-auto max-w-[1500px]">
        <div className="mx-auto mb-[var(--space-80)] max-w-[760px] text-center">
          {copy.eyebrow && (
            <p
              data-reveal
              className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] uppercase tracking-[6px] mb-[var(--space-20)]`}
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

        <ul className="grid grid-cols-1 gap-x-[var(--space-40)] gap-y-[var(--space-80)] sm:grid-cols-2 xl:grid-cols-3">
          {units.map((unit, i) => {
            const inches = unitInches(unit);

            return (
              <li key={unit.slug} data-reveal data-reveal-delay={String(3 + (i % 3))}>
                <Link href={`/wigs/${unit.slug}`} className="group block">
                  {/* The deck's reference number, kept so the site and the
                      salon's own list speak about the same unit. */}
                  <div className="mb-[12px] flex items-center gap-[var(--space-16)]">
                    <span
                      className={`gotham text-[length:var(--fs-small)] tracking-[4px] ${c.eyebrow}`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span
                      aria-hidden="true"
                      className={`h-[1px] flex-1 ${
                        tone === "light" ? "bg-[#1B1B1B]/10" : "bg-white/10"
                      }`}
                    />
                  </div>

                  <UnitFrame unit={unit} />

                  {/* Length first, at size: the number is the comparison. */}
                  <div className="mt-[var(--space-24)] flex items-baseline gap-[var(--space-16)]">
                    <span
                      className={`valturin leading-none ${c.bodyStrong} text-[length:clamp(40px,30.6px_+_3.95vw,72px)]`}
                    >
                      {inches}
                      <span className="align-super text-[0.4em] text-[#ccb884]"> in</span>
                    </span>

                    <h3
                      className={`gotham text-[length:clamp(15px,14px_+_0.26vw,17px)] uppercase tracking-[4px] ${c.bodyStrong} transition-colors duration-300 group-hover:text-[#ccb884]`}
                    >
                      {unit.name}
                    </h3>
                  </div>

                  <p
                    className={`gotham text-[length:var(--fs-small)] leading-[1.7] ${c.muted} mt-[12px]`}
                  >
                    {unit.spec.texture} · {unit.spec.color}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
