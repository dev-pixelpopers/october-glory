"use client";

import React from "react";
import Link from "next/link";
import { useReveal } from "../service-detail/use-reveal";
import { tone as palette, type Tone } from "../service-detail/tone";
import { wigServicesPage } from "@/data/wig-services";

/**
 * The two-step client journey: consultation and purchase, then design and
 * creation.
 *
 * Numbered and laid out as a sequence rather than a pair of cards, because
 * the deck's point is the order — step two only happens after step one.
 */
export default function ClientJourney({ tone = "light" }: { tone?: Tone }) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];
  const { journey } = wigServicesPage;

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-hidden`}
    >
      <div className="relative z-10 max-w-[1200px] mx-auto">
        <div className="text-center max-w-[760px] mx-auto mb-[var(--space-64)]">
          <p
            data-reveal
            className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-20)]`}
          >
            {journey.eyebrow}
          </p>
          <h2
            data-reveal
            data-reveal-delay="1"
            className={`valturin text-[length:var(--fs-h2)] leading-[1.2] ${c.heading}`}
          >
            {journey.heading}
            <span className="andrea text-[#ccb884]"> {journey.headingAccent}</span>
          </h2>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 gap-[var(--space-32)]">
          {journey.steps.map((step, i) => (
            <li
              key={step.step}
              data-reveal
              data-reveal-delay={String(2 + i)}
              className={`relative flex flex-col rounded-[20px] border ${c.cardBorder} ${c.card} p-[var(--space-40)]`}
            >
              <span
                aria-hidden="true"
                className="valturin text-[#ccb884] text-[length:clamp(32px,27.3px_+_1.976vw,48px)] leading-none mb-[var(--space-20)]"
              >
                {step.step}
              </span>

              <h3
                className={`valturin text-[length:clamp(22px,19.65px_+_0.988vw,30px)] leading-[1.25] ${c.bodyStrong} mb-[var(--space-16)]`}
              >
                {step.title}
              </h3>

              <p
                className={`gotham text-[length:var(--fs-body)] leading-[1.8] ${c.body} font-light`}
              >
                {step.body}
              </p>

              <Link
                href={step.cta.href}
                className="mt-auto pt-[var(--space-32)] inline-flex items-center gap-3 gotham text-[length:var(--fs-body)] text-[#ccb884] group"
              >
                <span className="border-b border-transparent group-hover:border-[#ccb884] transition-colors duration-300">
                  {step.cta.label}
                </span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
