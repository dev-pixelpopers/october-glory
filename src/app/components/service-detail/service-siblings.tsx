"use client";

import React from "react";
import Link from "next/link";
import { useReveal } from "./use-reveal";
import { tone as palette, type Tone } from "./tone";
import PriceTag from "./price-tag";

export type RelatedItem = {
  title: string;
  image: string;
  href: string;
  price?: string;
  nonMemberPrice?: string;
};

/**
 * "Keep exploring" strip — reuses the card treatment from the category
 * gallery so moving between pages feels like the same surface.
 *
 * Used two ways: on an inner service page it lists the other services in the
 * category; on a top-level service page it lists the category pages that sit
 * underneath it.
 */
export default function ServiceSiblings({
  items,
  heading,
  eyebrow = "Keep Exploring",
  tone = "dark",
}: {
  items: RelatedItem[];
  heading: string;
  eyebrow?: string;
  tone?: Tone;
}) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];

  if (items.length === 0) return null;

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)]`}
    >
      <div className="text-center mb-[var(--space-64)]">
        <p
          data-reveal
          className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-16)]`}
        >
          {eyebrow}
        </p>
        <h2
          data-reveal
          data-reveal-delay="1"
          className={`andrea ${c.heading} text-[length:var(--fs-h2)] leading-[1.15]`}
        >
          {heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[var(--space-32)] max-w-[1500px] mx-auto">
        {items.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            data-reveal
            data-reveal-delay={String(index)}
            className="group relative rounded-[20px] overflow-hidden border border-white/10 hover:border-[#ccb884]/60 transition-colors duration-500"
          >
            <div className="aspect-square overflow-hidden bg-[#2a2a2a]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

            {/* Same stack as the menu cards: prices, title, then the CTA that
                the parked 28px hides until hover. */}
            <div className="absolute inset-x-0 bottom-0 flex flex-col p-[var(--space-24)] translate-y-[28px] group-hover:translate-y-0 transition-transform duration-500 ease-out motion-reduce:transition-none motion-reduce:translate-y-0">
              <PriceTag price={item.price} nonMemberPrice={item.nonMemberPrice} />

              <h3 className="valturin text-white text-[length:clamp(20px,18.06px_+_0.518vw,28px)] leading-[1.2] mb-2">
                {item.title}
              </h3>

              <span className="inline-flex items-center gap-2 h-5 leading-5 text-[#ccb884] gotham text-[13px] tracking-[2px] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500 motion-reduce:transition-none motion-reduce:opacity-100">
                View Service
                <span aria-hidden="true">&rarr;</span>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
