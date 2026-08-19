"use client";

import React from "react";
import { useReveal } from "./use-reveal";
import type { ServiceDetail } from "@/data/services/types";
import PriceTag from "./price-tag";

/**
 * Tier counts vary by service (Silk Press has 3, Rod Set has 4, Wash & Go
 * has 2), so the grid adapts rather than forcing every service into the
 * same three-up layout.
 */
function gridColumns(count: number) {
  if (count <= 1) return "grid-cols-1 max-w-[720px] mx-auto";
  if (count === 2) return "grid-cols-1 md:grid-cols-2 max-w-[1100px] mx-auto";
  if (count === 3) return "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
  return "grid-cols-1 md:grid-cols-2 xl:grid-cols-4";
}

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

export default function ServiceTiers({
  tiers,
}: {
  tiers: NonNullable<ServiceDetail["tiers"]>;
}) {
  const scope = useReveal<HTMLElement>();
  const { items } = tiers;

  return (
    <section
      ref={scope}
      className="reveal-scope relative w-full bg-white py-[100px] md:py-[140px] px-[24px] md:px-[110px]"
    >
      {/* Section header */}
      <div className="text-center mb-[70px] md:mb-[90px] max-w-[820px] mx-auto">
        {tiers.eyebrow && (
          <p
            data-reveal
            className="gotham text-[#9C6D51] text-[13px] md:text-[15px] tracking-[6px] uppercase mb-5"
          >
            {tiers.eyebrow}
          </p>
        )}

        <h2
          data-reveal
          data-reveal-delay="1"
          className="andrea text-[#1B1B1B] text-[46px] md:text-[68px] leading-[1.15]"
        >
          {tiers.heading}
        </h2>

        <div
          data-reveal
          data-reveal-delay="2"
          className="w-[110px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent mx-auto mt-7"
        />

        {tiers.intro && (
          <p
            data-reveal
            data-reveal-delay="3"
            className="gotham text-[#555] text-[16px] md:text-[18px] leading-[32px] font-light mt-8"
          >
            {tiers.intro}
          </p>
        )}
      </div>

      {/* Tier cards */}
      {/* `group/tiers` drives the focus effect: hovering any card pushes the
          others back with a blur and slight scale-down, while the hovered
          card lifts forward. */}
      <div
        className={`group/tiers grid gap-7 md:gap-8 items-stretch ${gridColumns(
          items.length
        )}`}
      >
        {items.map((tier, idx) => (
          <article
            key={tier.name}
            data-reveal
            data-reveal-delay={String(idx)}
            className={`group relative flex flex-col rounded-[24px] p-8 md:p-9 transition-all duration-500 ease-out will-change-transform
              group-hover/tiers:blur-[3px] group-hover/tiers:opacity-[0.55] group-hover/tiers:scale-[0.98]
              hover:blur-none! hover:opacity-100! hover:scale-[1.03]! hover:-translate-y-3 hover:z-10
              hover:shadow-[0_34px_70px_rgba(0,0,0,0.28)]
              motion-reduce:transition-none motion-reduce:transform-none ${
                tier.featured
                  ? "bg-[#1B1B1B] text-white border border-[#ccb884]/50 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
                  : "bg-[#FAF8F4] text-[#1B1B1B] border border-[#1B1B1B]/10 hover:border-[#ccb884]/60"
              }`}
          >
            {tier.featured && (
              <span className="absolute -top-[13px] left-8 bg-[#ccb884] text-[#1B1B1B] gotham text-[11px] tracking-[3px] uppercase font-bold px-4 py-[6px] rounded-full">
                Most Complete
              </span>
            )}

            {/* Numbered accent */}
            <div className="flex items-center gap-4 mb-6">
              <span
                className={`w-[38px] h-[38px] rounded-full border flex items-center justify-center gotham text-[13px] font-medium transition-all duration-300 ${
                  tier.featured
                    ? "border-[#ccb884] text-[#ccb884]"
                    : "border-[#ccb884] text-[#9C6D51] group-hover:bg-[#ccb884] group-hover:text-white"
                }`}
              >
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-[#ccb884]/50 to-transparent" />
            </div>

            <h3
              className={`valturin text-[26px] md:text-[30px] leading-[1.25] mb-3 ${
                tier.featured ? "text-[#ccb884]" : "text-[#1B1B1B]"
              }`}
            >
              {tier.name}
            </h3>

            {tier.tagline && (
              <p
                className={`gotham text-[15px] leading-[28px] font-light mb-6 ${
                  tier.featured ? "text-white/60" : "text-[#777]"
                }`}
              >
                {tier.tagline}
              </p>
            )}

            {(tier.price || tier.duration) && (
              <div className="flex flex-wrap items-center gap-3 mb-7">
                <PriceTag
                  price={tier.price}
                  nonMemberPrice={tier.nonMemberPrice}
                  variant="block"
                />
                {tier.duration && (
                  <span
                    className={`gotham text-[13px] tracking-[2px] uppercase ${
                      tier.featured ? "text-white/45" : "text-[#999]"
                    }`}
                  >
                    {tier.duration}
                  </span>
                )}
              </div>
            )}

            {/* What you get */}
            <p
              className={`gotham text-[11px] tracking-[3px] uppercase mb-4 ${
                tier.featured ? "text-white/45" : "text-[#9C6D51]"
              }`}
            >
              What You Get
            </p>

            <ul className="space-y-[14px] mb-8">
              {tier.includes.map((line, i) => (
                <li key={i} className="flex gap-3">
                  <span className="text-[#ccb884] mt-[7px]">
                    <CheckIcon />
                  </span>
                  <span
                    className={`gotham text-[15px] leading-[27px] font-light ${
                      tier.featured ? "text-white/75" : "text-[#555]"
                    }`}
                  >
                    {line}
                  </span>
                </li>
              ))}
            </ul>

            {/* Pushes the footer block to the bottom so cards align */}
            <div className="mt-auto space-y-5">
              {tier.notIncluded && (
                <div
                  className={`pt-6 border-t ${
                    tier.featured ? "border-white/10" : "border-[#1B1B1B]/10"
                  }`}
                >
                  <p
                    className={`gotham text-[11px] tracking-[3px] uppercase mb-3 ${
                      tier.featured ? "text-white/40" : "text-[#999]"
                    }`}
                  >
                    Not Included
                  </p>
                  <p
                    className={`gotham text-[14px] leading-[26px] font-light ${
                      tier.featured ? "text-white/55" : "text-[#777]"
                    }`}
                  >
                    {tier.notIncluded}
                  </p>
                </div>
              )}

              {tier.bestFor && (
                <div
                  className={`rounded-[16px] p-5 ${
                    tier.featured ? "bg-white/[0.06]" : "bg-[#ccb884]/10"
                  }`}
                >
                  <p className="gotham text-[11px] tracking-[3px] uppercase text-[#9C6D51] mb-2">
                    Best For
                  </p>
                  <p
                    className={`gotham text-[14px] leading-[26px] font-light ${
                      tier.featured ? "text-white/75" : "text-[#555]"
                    }`}
                  >
                    {tier.bestFor}
                  </p>
                </div>
              )}

              <a
                href="/dashboard/book"
                className={`flex gap-[10px] items-center rounded-4xl py-[4px] pl-[5px] pr-[25px] text-[16px] gotham border transition-all duration-300 w-fit ${
                  tier.featured
                    ? "border-[#d4af6e] text-[#d4af6e] hover:bg-[#d4af6e] hover:text-black"
                    : "border-[#1B1B1B] text-[#1B1B1B] hover:bg-[#d4af6e] hover:border-[#d4af6e] hover:text-black"
                }`}
              >
                <span className="bg-[#d4af6e] text-black rounded-full w-[38px] h-[38px] flex items-center justify-center font-bold">
                  →
                </span>
                Book This Tier
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
