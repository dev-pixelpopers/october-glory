"use client";

import React from "react";
import { useReveal } from "../../components/service-detail/use-reveal";
import { wigMaintenanceAlaCarte } from "@/data/packages/wig-maintenance";

/**
 * The standalone services from the wig maintenance document. Carries the same
 * hover-to-focus treatment as the package tiers — hovering one card pushes
 * the other back — so the two sections read as one system.
 */
export default function AlaCarteSection() {
  const scope = useReveal<HTMLElement>();
  const { eyebrow, heading, intro, items, bestFor } = wigMaintenanceAlaCarte;

  return (
    <section
      ref={scope}
      className="reveal-scope relative w-full bg-[#1B1B1B] text-white py-[100px] md:py-[140px] px-[24px] md:px-[110px] overflow-hidden"
    >
      {/* Decorative top hairline */}
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884]/30 to-transparent" />

      <div className="text-center mb-[60px] md:mb-[80px] max-w-[820px] mx-auto">
        <p
          data-reveal
          className="gotham text-[#ccb884] text-[13px] md:text-[14px] tracking-[6px] uppercase mb-5"
        >
          {eyebrow}
        </p>

        <h2
          data-reveal
          data-reveal-delay="1"
          className="andrea text-[44px] md:text-[64px] leading-[1.15] text-white"
        >
          {heading}
        </h2>

        <div
          data-reveal
          data-reveal-delay="2"
          className="w-[110px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent mx-auto mt-7 mb-8"
        />

        <p
          data-reveal
          data-reveal-delay="3"
          className="gotham text-[16px] md:text-[18px] leading-[32px] text-white/70 font-light"
        >
          {intro}
        </p>
      </div>

      {/* Hovering one card blurs the other, matching the package tiers */}
      <div className="group/alacarte grid grid-cols-1 md:grid-cols-2 gap-7 md:gap-8 max-w-[1100px] mx-auto items-stretch">
        {items.map((item, idx) => (
          <article
            key={item.name}
            data-reveal
            data-reveal-delay={String(idx)}
            className="group relative flex flex-col rounded-[24px] p-8 md:p-9 bg-white/[0.03] border border-white/10 transition-all duration-500 ease-out will-change-transform
              group-hover/alacarte:blur-[3px] group-hover/alacarte:opacity-[0.55] group-hover/alacarte:scale-[0.98]
              hover:blur-none! hover:opacity-100! hover:scale-[1.03]! hover:-translate-y-3 hover:z-10
              hover:border-[#ccb884]/50 hover:shadow-[0_34px_70px_rgba(0,0,0,0.45)]
              motion-reduce:transition-none motion-reduce:transform-none"
          >
            {/* Numbered accent */}
            <div className="flex items-center gap-4 mb-6">
              <span className="w-[38px] h-[38px] rounded-full border border-[#ccb884] flex items-center justify-center gotham text-[13px] font-medium text-[#ccb884]">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <div className="flex-1 h-[1px] bg-gradient-to-r from-[#ccb884]/50 to-transparent" />
            </div>

            <h3 className="valturin text-[26px] md:text-[30px] leading-[1.25] text-[#ccb884] mb-4">
              {item.name}
            </h3>

            <p className="gotham text-[15px] md:text-[16px] leading-[29px] text-white/70 font-light">
              {item.description}
            </p>
          </article>
        ))}
      </div>

      {/* Shared "Best for" — applies to both options, not to either alone */}
      <div
        data-reveal
        data-reveal-delay="2"
        className="max-w-[1100px] mx-auto mt-10 rounded-[16px] bg-white/[0.06] p-6 md:p-7"
      >
        <p className="gotham text-[11px] tracking-[3px] uppercase text-[#ccb884] mb-3">
          Best For
        </p>
        <p className="gotham text-[15px] md:text-[16px] leading-[28px] text-white/75 font-light">
          {bestFor}
        </p>
      </div>
    </section>
  );
}
