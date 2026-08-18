"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useReveal } from "./use-reveal";
import type { ServiceMenu } from "@/data/services/types";
import { tone as palette, type Tone } from "./tone";

/**
 * The salon's priced menu for a service — the grid the standalone gallery
 * components used to render, now driven by the service's own data.
 *
 * An item linking to a child page becomes a link to it; everything else goes
 * straight to booking.
 */
export default function ServiceMenuGrid({
  menu,
  tone = "dark",
}: {
  menu: ServiceMenu;
  tone?: Tone;
}) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[100px] md:py-[140px] px-[24px] md:px-[110px]`}
    >
      <div className="text-center mb-[70px] md:mb-[90px] max-w-[820px] mx-auto">
        {menu.eyebrow && (
          <p
            data-reveal
            className={`gotham ${c.eyebrow} text-[13px] md:text-[15px] tracking-[6px] uppercase mb-5`}
          >
            {menu.eyebrow}
          </p>
        )}

        <h2
          data-reveal
          data-reveal-delay="1"
          className={`andrea ${c.heading} text-[46px] md:text-[68px] leading-[1.15]`}
        >
          {menu.heading}
        </h2>

        <div
          data-reveal
          data-reveal-delay="2"
          className="w-[110px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent mx-auto mt-7"
        />

        {menu.intro && (
          <p
            data-reveal
            data-reveal-delay="3"
            className={`gotham ${c.body} text-[16px] md:text-[18px] leading-[32px] font-light mt-8`}
          >
            {menu.intro}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-[1500px] mx-auto">
        {menu.items.map((item, index) => {
          const href = item.href ?? "/dashboard/book";

          return (
            <Link
              key={item.name}
              href={href}
              data-reveal
              data-reveal-delay={String(index % 4)}
              className={`group relative rounded-[20px] overflow-hidden border ${c.cardBorder} hover:border-[#ccb884]/60 transition-colors duration-500`}
            >
              <div className="relative aspect-square overflow-hidden bg-[#2a2a2a]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              </div>

              {item.price && (
                <span className="absolute top-5 right-5 bg-[#ccb884] text-[#1B1B1B] gotham font-bold text-[14px] px-4 py-2 rounded-full">
                  {item.price}
                </span>
              )}

              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="valturin text-white text-[24px] md:text-[26px] leading-[1.2] mb-2">
                  {item.name}
                </h3>

                <span className="inline-flex items-center gap-2 text-[#ccb884] gotham text-[13px] tracking-[2px] uppercase opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 motion-reduce:transition-none motion-reduce:opacity-100">
                  {item.href ? "View Service" : "Book Now"}
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
