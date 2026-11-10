"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useReveal } from "../service-detail/use-reveal";
import { tone as palette, type Tone } from "../service-detail/tone";
import type { Product } from "@/lib/api/types";

/**
 * One unit: the portrait/cover image, which is also the video preview on hover.
 *
 * The portrait and the unit video are the same head of hair, so the image is
 * the video's poster. Hovering triggers in-place playback.
 *
 * `preload="none"` keeps clips off the wire until requested.
 */
function UnitFrame({ unit }: { unit: Product }) {
  const ref = React.useRef<HTMLVideoElement>(null);

  const play = () => {
    void ref.current?.play().catch(() => {});
  };

  const stop = () => {
    const video = ref.current;
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  const imgSrc = unit.image || unit.background_image || "/images/unit-bg.png";

  return (
    <div
      className="relative aspect-[4/5] w-full overflow-hidden rounded-[18px] bg-[#2a2a2a]"
      onPointerEnter={play}
      onPointerLeave={stop}
    >
      <Image
        src={imgSrc}
        alt={`The ${unit.name} unit`}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 45vw, 30vw"
        unoptimized={/^https?:\/\//.test(imgSrc)}
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
          <span className="gotham text-[11px] uppercase tracking-[3px] text-white/85 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
            Unit video
          </span>
        </span>
      )}
    </div>
  );
}

export interface UnitCatalogProps {
  products?: Product[];
  error?: string | null;
  tone?: Tone;
  heading?: { eyebrow?: string; heading: string; headingAccent?: string; intro?: string };
}

/**
 * The dynamic unit catalogue.
 *
 * Ordered and rendered from the Laravel Products API.
 * Within each card, the length leads, followed by the unit name and spec details.
 */
export default function UnitCatalog({
  products = [],
  error = null,
  tone = "light",
  heading,
}: UnitCatalogProps) {
  const scope = useReveal<HTMLElement>([products.length]);
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

        {error ? (
          <div className="mx-auto max-w-[640px] rounded-[20px] border border-[#ccb884]/30 bg-[#222222]/80 p-[var(--space-32)] text-center backdrop-blur-sm">
            <p className={`valturin text-[length:clamp(20px,18.5px_+_0.6vw,26px)] text-white`}>
              Catalog Temporarily Unavailable
            </p>
            <p className={`gotham text-[length:var(--fs-small)] text-[#999999] mt-[var(--space-12)]`}>
              We are unable to load the custom units list right now. Please check back shortly or explore our bespoke wig services below.
            </p>
            <div className="mt-[var(--space-24)] flex justify-center">
              <Link
                href="/wigs/services"
                className="gotham text-[length:var(--fs-small)] uppercase tracking-[3px] text-[#ccb884] hover:underline"
              >
                Explore Wig Services &rarr;
              </Link>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="mx-auto max-w-[640px] rounded-[20px] border border-white/10 bg-[#222222]/60 p-[var(--space-40)] text-center">
            <p className={`valturin text-[length:clamp(20px,18.5px_+_0.6vw,26px)] text-white`}>
              No Units Currently Available
            </p>
            <p className={`gotham text-[length:var(--fs-small)] text-[#999999] mt-[var(--space-12)]`}>
              Every unit is bespoke and tailored to order. Book a private consultation with our stylists to design your custom unit.
            </p>
            <div className="mt-[var(--space-32)] flex justify-center">
              <Link
                href="/dashboard/book?service=the-glorious-custom-unit"
                className="flex gap-[clamp(6px,5.03px_+_0.259vw,10px)] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[clamp(3px,2.76px_+_0.065vw,4px)] pl-[clamp(3px,2.51px_+_0.13vw,5px)] pr-[clamp(16px,13.81px_+_0.583vw,25px)] justify-center text-[16px] md:text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
              >
                <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
                  →
                </span>
                Book A Consultation
              </Link>
            </div>
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-x-[var(--space-40)] gap-y-[var(--space-80)] sm:grid-cols-2 xl:grid-cols-3">
            {products.map((unit, i) => {
              const inches = unit.length ? parseInt(unit.length, 10) : null;
              const specDetails = [unit.texture, unit.color].filter(Boolean).join(" · ");

              return (
                <li key={unit.slug} data-reveal data-reveal-delay={String(3 + (i % 3))}>
                  <Link href={`/wigs/${unit.slug}`} className="group block">
                    {/* Index number */}
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

                    {/* Length & Title */}
                    <div className="mt-[var(--space-24)] flex items-baseline gap-[var(--space-16)]">
                      {inches !== null && !isNaN(inches) ? (
                        <span
                          className={`valturin leading-none ${c.bodyStrong} text-[length:clamp(40px,30.6px_+_3.95vw,72px)]`}
                        >
                          {inches}
                          <span className="align-super text-[0.4em] text-[#ccb884]"> in</span>
                        </span>
                      ) : unit.length ? (
                        <span
                          className={`gotham leading-none ${c.bodyStrong} text-[length:var(--fs-body)]`}
                        >
                          {unit.length}
                        </span>
                      ) : null}

                      <h3
                        className={`gotham text-[length:clamp(15px,14px_+_0.26vw,17px)] uppercase tracking-[4px] ${c.bodyStrong} transition-colors duration-300 group-hover:text-[#ccb884]`}
                      >
                        {unit.name}
                      </h3>
                    </div>

                    {specDetails ? (
                      <p
                        className={`gotham text-[length:var(--fs-small)] leading-[1.7] ${c.muted} mt-[12px]`}
                      >
                        {specDetails}
                      </p>
                    ) : unit.description ? (
                      <p
                        className={`gotham text-[length:var(--fs-small)] leading-[1.7] ${c.muted} mt-[12px]`}
                      >
                        {unit.description}
                      </p>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
