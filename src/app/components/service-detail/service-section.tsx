"use client";

import React from "react";
import Image from "next/image";
import { useReveal } from "./use-reveal";
import type { ServiceSection } from "@/data/services/types";
import { tone as palette, type Tone } from "./tone";

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[14px] h-[14px] shrink-0"
      aria-hidden="true"
    >
      <path d="M20 6L9 17l-5-5" />
    </svg>
  );
}

/**
 * The text-and-image block used for the page overview and for every editorial
 * section beneath it. `flip` puts the image on the left; the template
 * alternates it down the page so consecutive sections don't read as a stack.
 *
 * The top hairline is drawn only on the first block — repeating it between
 * every section would fence the page into strips.
 */
export default function ServiceSectionBlock({
  section,
  flip = false,
  hairline = false,
  tone = "dark",
}: {
  section: ServiceSection;
  flip?: boolean;
  hairline?: boolean;
  tone?: Tone;
}) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];
  const bulletOffset = 3 + section.body.length;
  // A section earns the two-column layout if it has any media at all — a
  // video-only section must not fall back to the centred single-column copy.
  const hasMedia = Boolean(section.image || section.video);

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[100px] md:py-[150px] px-[24px] md:px-[110px] overflow-hidden`}
    >
      {hairline && (
        <div className={`absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent ${c.hairline} to-transparent`} />
      )}

      {/* Without an image the copy centres in a readable column rather than
          sitting in half a two-column grid with nothing beside it. */}
      <div
        className={
          hasMedia
            ? "grid grid-cols-1 lg:grid-cols-2 gap-[60px] lg:gap-[90px] items-center max-w-[1400px] mx-auto"
            : "max-w-[820px] mx-auto"
        }
      >
        <div className={hasMedia && flip ? "lg:order-last" : undefined}>
          {section.eyebrow && (
            <p
              data-reveal
              className={`gotham ${c.eyebrow} text-[13px] md:text-[14px] tracking-[6px] uppercase mb-5`}
            >
              {section.eyebrow}
            </p>
          )}

          <h2
            data-reveal
            data-reveal-delay="1"
            className={`valturin text-[38px] md:text-[58px] leading-[1.15] ${c.heading}`}
          >
            {section.heading}
          </h2>

          <div
            data-reveal
            data-reveal-delay="2"
            className="w-[100px] h-[2px] bg-[#ccb884] mt-7 mb-9"
          />

          {section.tagline && (
            <p
              data-reveal
              data-reveal-delay="2"
              className="andrea text-[#ccb884] text-[26px] md:text-[32px] leading-[1.3] mb-7"
            >
              {section.tagline}
            </p>
          )}

          <div className="space-y-6">
            {section.body.map((paragraph, i) => (
              <p
                key={i}
                data-reveal
                data-reveal-delay={String(3 + i)}
                className={`gotham text-[16px] md:text-[18px] leading-[32px] md:leading-[34px] ${c.body} font-light`}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {section.bullets && (
            <ul className="space-y-[14px] mt-9">
              {section.bullets.map((line, i) => (
                <li
                  key={i}
                  data-reveal
                  data-reveal-delay={String(bulletOffset + i)}
                  className="flex gap-3"
                >
                  <span className="text-[#ccb884] mt-[7px]">
                    <CheckIcon />
                  </span>
                  <span className={`gotham text-[15px] md:text-[16px] leading-[28px] ${c.body} font-light`}>
                    {line}
                  </span>
                </li>
              ))}
            </ul>
          )}
          <a
            href="/dashboard/book"
            className="justify-self-start flex gap-[10px] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[4px] pl-[5px] pr-[25px] justify-center text-[16px] md:text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300 mt-6"
          >
            <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
              →
            </span>
            Book This Service
          </a>
        </div>

        {hasMedia && (
          <div
            data-reveal
            data-reveal-delay="2"
            className={`relative group ${
              flip ? "lg:order-first" : "order-first lg:order-last"
            }`}
          >
            {/* Offset gold frame */}
            <div
              className={`absolute -inset-4 md:-inset-6 border border-[#ccb884]/25 rounded-[28px] pointer-events-none ${
                flip
                  ? "-translate-x-3 translate-y-3 md:-translate-x-5 md:translate-y-5"
                  : "translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5"
              }`}
            />

            <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden bg-[#2a2a2a]">
              {section.video ? (
                <video
                  src={section.video}
                  poster={section.image}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-label={section.heading}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
              ) : (
                <Image
                  src={section.image!}
                  alt={section.heading}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
