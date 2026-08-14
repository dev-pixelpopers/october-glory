"use client";

import React from "react";
import Image from "next/image";
import { useReveal } from "./use-reveal";
import type { ServiceDetail } from "@/data/services/types";

export default function ServiceOverview({
  overview,
}: {
  overview: NonNullable<ServiceDetail["overview"]>;
}) {
  const scope = useReveal<HTMLElement>();

  return (
    <section
      ref={scope}
      className="reveal-scope relative w-full bg-[#1B1B1B] text-white py-[100px] md:py-[150px] px-[24px] md:px-[110px] overflow-hidden"
    >
      {/* Decorative top hairline */}
      <div className="absolute top-0 left-[10%] right-[10%] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884]/30 to-transparent" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[60px] lg:gap-[90px] items-center max-w-[1400px] mx-auto">
        <div>
          {overview.eyebrow && (
            <p
              data-reveal
              className="gotham text-[#ccb884] text-[13px] md:text-[14px] tracking-[6px] uppercase mb-5"
            >
              {overview.eyebrow}
            </p>
          )}

          <h2
            data-reveal
            data-reveal-delay="1"
            className="valturin text-[38px] md:text-[58px] leading-[1.15] text-white"
          >
            {overview.heading}
          </h2>

          <div
            data-reveal
            data-reveal-delay="2"
            className="w-[100px] h-[2px] bg-[#ccb884] mt-7 mb-9"
          />

          <div className="space-y-6">
            {overview.body.map((paragraph, i) => (
              <p
                key={i}
                data-reveal
                data-reveal-delay={String(3 + i)}
                className="gotham text-[16px] md:text-[18px] leading-[32px] md:leading-[34px] text-white/70 font-light"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {overview.image && (
          <div
            data-reveal
            data-reveal-delay="2"
            className="relative group order-first lg:order-last"
          >
            {/* Offset gold frame */}
            <div className="absolute -inset-4 md:-inset-6 border border-[#ccb884]/25 rounded-[28px] translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5 pointer-events-none" />

            <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden bg-[#2a2a2a]">
              <Image
                src={overview.image}
                alt={overview.heading}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
