"use client";

import React from "react";
import Link from "next/link";
import { useReveal } from "./use-reveal";
import { tone as palette, type Tone } from "./tone";

export type RelatedItem = {
  title: string;
  image: string;
  href: string;
  price?: string;
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
      className={`reveal-scope relative w-full ${c.section} py-[100px] md:py-[130px] px-[24px] md:px-[110px]`}
    >
      <div className="text-center mb-[60px] md:mb-[80px]">
        <p
          data-reveal
          className={`gotham ${c.eyebrow} text-[13px] md:text-[15px] tracking-[6px] uppercase mb-4`}
        >
          {eyebrow}
        </p>
        <h2
          data-reveal
          data-reveal-delay="1"
          className={`andrea ${c.heading} text-[44px] md:text-[64px] leading-[1.15]`}
        >
          {heading}
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-[1500px] mx-auto">
        {items.map((item, index) => (
          <Link
            key={item.href}
            href={item.href}
            data-reveal
            data-reveal-delay={String(index)}
            className="group relative rounded-[20px] overflow-hidden"
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

            {item.price && (
              <span className="absolute top-5 right-5 bg-[#ccb884] text-[#1B1B1B] gotham font-bold text-[13px] px-4 py-2 rounded-full">
                {item.price}
              </span>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="valturin text-white text-[24px] mb-2">
                {item.title}
              </h3>
              <span className="inline-flex items-center gap-2 text-[#ccb884] gotham text-[13px] tracking-[2px] uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                View
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
