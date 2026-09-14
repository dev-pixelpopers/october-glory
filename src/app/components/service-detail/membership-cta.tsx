"use client";

import React from "react";
import Link from "next/link";
import { useReveal } from "./use-reveal";
import { tone as palette, type Tone } from "./tone";
import { MEMBERSHIP_CTA, MEMBERSHIP_HREF } from "@/data/services/defaults";
import { NON_MEMBER_MARKUP } from "@/data/services/pricing";

/**
 * The second CTA on every service page: join, rather than book.
 *
 * It sits above the booking CTA and is deliberately quieter than it — a gold
 * rule and an outlined button on the page's own ground, against the booking
 * band's full-bleed photograph. Two photo CTAs back to back would read as the
 * page ending twice. It takes a tone like every other block so it alternates
 * with whatever precedes it.
 */
export default function MembershipCta({ tone = "dark" }: { tone?: Tone }) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];
  const savingPercent = Math.round(
    (NON_MEMBER_MARKUP / (1 + NON_MEMBER_MARKUP)) * 100
  );

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-hidden`}
    >
      {/* Hairline above, so the band separates from the section before it
          without needing a second background colour. */}
      <div
        className={`absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent ${c.hairline} to-transparent`}
      />

      <div className="relative z-10 max-w-[900px] mx-auto text-center flex flex-col items-center">
        <p
          data-reveal
          className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-20)]`}
        >
          {MEMBERSHIP_CTA.eyebrow}
        </p>

        <h2
          data-reveal
          data-reveal-delay="1"
          className={`andrea text-[length:var(--fs-h2)] ${c.heading} leading-[1.2]`}
        >
          {MEMBERSHIP_CTA.display}
        </h2>

        <h3
          data-reveal
          data-reveal-delay="2"
          className="valturin text-[length:var(--fs-h3)] text-gold uppercase tracking-wider mt-[var(--space-12)]"
        >
          {MEMBERSHIP_CTA.heading}
        </h3>

        <p
          data-reveal
          data-reveal-delay="3"
          className={`gotham text-[length:var(--fs-body)] leading-[1.8] ${c.body} font-light max-w-[620px] mt-[var(--space-28)]`}
        >
          {MEMBERSHIP_CTA.body}
        </p>

        <p
          data-reveal
          data-reveal-delay="4"
          className={`gotham text-[length:var(--fs-small)] tracking-[2px] uppercase ${c.muted} mt-[var(--space-20)]`}
        >
          Members pay around {savingPercent}% less than non-members
        </p>

        <Link
          data-reveal
          data-reveal-delay="5"
          href={MEMBERSHIP_HREF}
          className="flex mt-[var(--space-40)] gap-[clamp(6px,5.03px_+_0.259vw,10px)] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[clamp(3px,2.76px_+_0.065vw,4px)] pl-[clamp(3px,2.51px_+_0.13vw,5px)] pr-[clamp(16px,13.81px_+_0.583vw,25px)] justify-center text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
        >
          <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
            →
          </span>
          {MEMBERSHIP_CTA.cta}
        </Link>
      </div>
    </section>
  );
}
