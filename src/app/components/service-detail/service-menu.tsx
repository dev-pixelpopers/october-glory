"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useReveal } from "./use-reveal";
import type { ServiceMenu } from "@/data/services/types";
import { tone as palette, type Tone } from "./tone";
import PriceTag from "./price-tag";

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
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)]`}
    >
      <div className="text-center mb-[var(--space-64)] max-w-[820px] mx-auto">
        {menu.eyebrow && (
          <p
            data-reveal
            className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-20)]`}
          >
            {menu.eyebrow}
          </p>
        )}

        <h2
          data-reveal
          data-reveal-delay="1"
          className={`andrea ${c.heading} text-[length:var(--fs-h2)] leading-[1.15]`}
        >
          {menu.heading}
        </h2>

        <div
          data-reveal
          data-reveal-delay="2"
          className="w-[110px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent mx-auto mt-[var(--space-28)]"
        />

        {menu.intro && (
          <p
            data-reveal
            data-reveal-delay="3"
            className={`gotham ${c.body} text-[length:var(--fs-body)] leading-[1.8] font-light mt-[var(--space-32)]`}
          >
            {menu.intro}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--space-32)] max-w-[1500px] mx-auto">
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
              {/* Parked 28px low so the hidden CTA sits below the card edge and
                  leaves no gap under the title. 28px is exact, not eyeballed:
                  the CTA's h-5 (20px) plus the title's mb-2 (8px). On hover the
                  stack rides up and the CTA fades in where the gap used to be. */}
              <div className="absolute inset-x-0 bottom-0 flex flex-col p-[var(--space-24)] translate-y-[28px] group-hover:translate-y-0 transition-transform duration-500 ease-out motion-reduce:transition-none motion-reduce:translate-y-0">
                <PriceTag price={item.price} nonMemberPrice={item.nonMemberPrice} />

                <h3 className="valturin text-white text-[length:clamp(20px,18.06px_+_0.518vw,28px)] leading-[1.2] mb-2">
                  {item.name}
                </h3>

                <span className="inline-flex items-center gap-2 h-5 leading-5 text-[#ccb884] gotham text-[13px] tracking-[2px] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 motion-reduce:transition-none motion-reduce:opacity-100">
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
