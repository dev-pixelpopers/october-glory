"use client";

import React from "react";
import Link from "next/link";
import { useReveal } from "../service-detail/use-reveal";
import { tone as palette, type Tone } from "../service-detail/tone";
import { wigServicesPage } from "@/data/wig-services";

/**
 * The three maintenance packages and the services bookable on their own.
 *
 * Both blocks are card grids with the same anatomy, so one component renders
 * either — `variant` only changes whether a card can carry the featured
 * treatment and how prominent the heading is.
 *
 * The cards are deliberately comparable: same height, same order of
 * information, CTA pinned to the bottom. The deck asks for "comparable tier
 * cards", and a reader deciding between three packages is scanning across
 * them rather than reading each one through.
 */
export default function WigPackages({
  variant = "packages",
  tone = "dark",
}: {
  variant?: "packages" | "add-ons";
  tone?: Tone;
}) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];
  const block =
    variant === "packages" ? wigServicesPage.packages : wigServicesPage.addOns;

  const items =
    variant === "packages"
      ? wigServicesPage.packages.items
      : wigServicesPage.addOns.items.map((item) => ({
          ...item,
          label: undefined,
          featured: false,
          equivalentTier: undefined,
        }));

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-hidden`}
    >
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="text-center max-w-[760px] mx-auto mb-[var(--space-64)]">
          <p
            data-reveal
            className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-20)]`}
          >
            {block.eyebrow}
          </p>
          <h2
            data-reveal
            data-reveal-delay="1"
            className={`valturin text-[length:var(--fs-h2)] leading-[1.2] ${c.heading}`}
          >
            {block.heading}
            <span className="andrea text-[#ccb884]"> {block.headingAccent}</span>
          </h2>
          <p
            data-reveal
            data-reveal-delay="2"
            className={`gotham text-[length:var(--fs-body)] leading-[1.8] ${c.body} font-light mt-[var(--space-24)]`}
          >
            {block.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--space-32)] items-stretch">
          {items.map((item, i) => {
            const featured = "featured" in item && item.featured;

            return (
              <div
                key={item.title}
                data-reveal
                data-reveal-delay={String(3 + i)}
                className={`flex flex-col rounded-[20px] border p-[var(--space-40)] transition-colors duration-500 ${
                  featured
                    ? "border-[#ccb884] bg-[#ccb884]/[0.07]"
                    : `${c.cardBorder} ${c.card} hover:border-[#ccb884]/50`
                }`}
              >
                {"label" in item && item.label && (
                  <p
                    className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] tracking-[4px] uppercase mb-[var(--space-16)]`}
                  >
                    {item.label}
                  </p>
                )}

                <h3
                  className={`valturin text-[length:clamp(20px,17.65px_+_0.988vw,28px)] leading-[1.3] ${c.bodyStrong} mb-[var(--space-20)]`}
                >
                  {item.title}
                </h3>

                <p
                  className={`gotham text-[length:var(--fs-body)] leading-[1.8] ${c.body} font-light`}
                >
                  {item.body}
                </p>

                {"equivalentTier" in item && item.equivalentTier && (
                  <p
                    className={`gotham text-[length:var(--fs-small)] leading-[1.6] ${c.muted} mt-[var(--space-20)]`}
                  >
                    Listed as {item.equivalentTier} on the packages page.
                  </p>
                )}

                <Link
                  href={item.cta.href}
                  className="mt-auto pt-[var(--space-32)] inline-flex items-center gap-3 gotham text-[length:var(--fs-body)] text-[#ccb884] group"
                >
                  <span className="border-b border-transparent group-hover:border-[#ccb884] transition-colors duration-300">
                    {item.cta.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
