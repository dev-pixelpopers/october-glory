"use client";

import React from "react";
import Link from "next/link";
import { useReveal } from "../service-detail/use-reveal";
import { tone as palette, type Tone } from "../service-detail/tone";
import { usePackages } from "@/lib/api/hooks/catalog";
import type { Package } from "@/lib/api/types";
import { silkPressPage, type PressPackage } from "@/data/silk-press-new";

/** "200.00" -> "$200". Falls back to the raw string for non-numeric prices. */
function priceLabel(price: string): string {
  const n = parseFloat(price);
  return Number.isFinite(n) ? `${n.toLocaleString("en-US")}` : price;
}

/** A backend package as a card. The badge stays the site copy, on the featured card. */
function packageToCard(pkg: Package): PressPackage {
  const site = silkPressPage.packages.items.find((item) => item.featured);
  return {
    name: pkg.name,
    price: priceLabel(pkg.price),
    includes: pkg.includes ?? [],
    featured: pkg.is_featured,
    badge: pkg.is_featured ? site?.badge : undefined,
  };
}

/**
 * The three ways to book a silk press.
 *
 * Each tier is the one before it plus one thing, so the cards list only what
 * is in them and let the stack do the explaining — the full `includes` prose
 * the service data carries would bury that. Equal heights and a pinned
 * button, because anyone choosing between three is scanning across rather
 * than reading each one through.
 *
 * The cards are the backend's `silk-press` package collection. While that
 * request is in flight (or if it fails) the site copy stands in.
 */
export default function PressPackages({ tone = "light" }: { tone?: Tone }) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];
  const { packages } = silkPressPage;
  const { data: live } = usePackages("silk-press");
  const items = live && live.length > 0 ? live.map(packageToCard) : packages.items;

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-x-clip`}
    >
      <div className="relative z-10 mx-auto max-w-[1400px]">
        <div className="mx-auto mb-[var(--space-64)] max-w-[760px] text-center">
          <p
            data-reveal
            className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] uppercase tracking-[6px] mb-[var(--space-20)]`}
          >
            {packages.eyebrow}
          </p>
          <h2
            data-reveal
            data-reveal-delay="1"
            className={`valturin text-[length:var(--fs-h2)] leading-[1.2] ${c.heading}`}
          >
            {packages.heading}
            <span className="andrea text-[#ccb884]"> {packages.headingAccent}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-[var(--space-32)] md:grid-cols-3">
          {items.map((pack, i) => (
            <div
              key={pack.name}
              data-reveal
              data-reveal-delay={String(2 + i)}
              className={`flex flex-col rounded-[20px] border p-[var(--space-40)] transition-colors duration-500 ${
                pack.featured
                  ? "border-[#ccb884] bg-[#1B1B1B]"
                  : `${c.cardBorder} ${c.card} hover:border-[#ccb884]/50`
              }`}
            >
              {pack.badge && (
                <span className="mb-[var(--space-20)] self-start rounded-[4px] bg-[#ccb884] px-[12px] py-[6px] gotham text-[11px] uppercase tracking-[3px] text-[#1B1B1B]">
                  {pack.badge}
                </span>
              )}

              <h3
                className={`valturin text-[length:clamp(20px,17.65px_+_0.99vw,28px)] leading-[1.3] ${
                  pack.featured ? "text-[#ccb884]" : c.bodyStrong
                }`}
              >
                {pack.name}
              </h3>

              {pack.price && (
                <p
                  className={`valturin text-[length:var(--fs-h3)] mt-[var(--space-16)] ${
                    pack.featured ? "text-white" : c.bodyStrong
                  }`}
                >
                  {pack.price}
                </p>
              )}

              <ul className="mt-[var(--space-24)] flex flex-col gap-[12px]">
                {pack.includes.map((item) => (
                  <li
                    key={item}
                    className={`gotham flex gap-[12px] text-[length:var(--fs-body)] leading-[1.7] font-light ${
                      pack.featured ? "text-white/75" : c.body
                    }`}
                  >
                    <span aria-hidden="true" className="text-[#ccb884]">
                      ·
                    </span>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/dashboard/book"
                className={`mt-auto pt-[var(--space-40)] ${
                  pack.featured ? "" : ""
                }`}
              >
                <span
                  className={`flex items-center justify-center rounded-[6px] py-[14px] gotham text-[length:var(--fs-small)] uppercase tracking-[3px] transition-colors duration-300 ${
                    pack.featured
                      ? "bg-[#ccb884] text-[#1B1B1B] hover:bg-[#d8c89c]"
                      : `border ${c.cardBorder} ${c.bodyStrong} hover:border-[#ccb884] hover:text-[#ccb884]`
                  }`}
                >
                  Book Now
                </span>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
