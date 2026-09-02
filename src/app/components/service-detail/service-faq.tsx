"use client";

import React from "react";
import { useReveal } from "./use-reveal";
import type { ServiceFaq } from "@/data/services/types";
import { tone as palette, type Tone } from "./tone";

/**
 * Native <details> accordion — the questions stay in the DOM and remain
 * findable by search engines and in-page search whether or not they're open,
 * which a JS-toggled panel would cost us.
 */
export default function ServiceFaqSection({
  faq,
  tone = "light",
}: {
  faq: ServiceFaq;
  tone?: Tone;
}) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)]`}
    >
      <div className="max-w-[900px] mx-auto">
        <div className="text-center mb-[var(--space-64)]">
          {faq.eyebrow && (
            <p
              data-reveal
              className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-20)]`}
            >
              {faq.eyebrow}
            </p>
          )}

          <h2
            data-reveal
            data-reveal-delay="1"
            className={`andrea ${c.heading} text-[length:var(--fs-h2)] leading-[1.15]`}
          >
            {faq.heading}
          </h2>

          <div
            data-reveal
            data-reveal-delay="2"
            className="w-[110px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent mx-auto mt-[var(--space-28)]"
          />
        </div>

        <div className="space-y-[var(--space-16)]">
          {faq.items.map((item, i) => (
            <details
              key={item.question}
              data-reveal
              data-reveal-delay={String(i)}
              className={`group rounded-[18px] border ${c.cardBorder} ${c.card} px-[var(--space-24)] md:px-[var(--space-32)] py-1 transition-colors duration-300 hover:border-[#ccb884]/60 open:border-[#ccb884]/60`}
            >
              <summary className="flex items-start gap-[var(--space-20)] cursor-pointer list-none py-[var(--space-24)] [&::-webkit-details-marker]:hidden">
                <span className={`gotham text-[length:var(--fs-body)] leading-[1.7] font-medium flex-1 ${c.bodyStrong}`}>
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className="shrink-0 w-[32px] h-[32px] rounded-full border border-[#ccb884] text-[#9C6D51] flex items-center justify-center text-[18px] leading-none transition-transform duration-300 group-open:rotate-45 motion-reduce:transition-none"
                >
                  <svg width="10" height="10" viewBox="0 0 14 14" className="transition-transform duration-300 group-open:rotate-45">
  <path d="M7 0v14M0 7h14" stroke="currentColor" strokeWidth="1.5"/>
</svg>
                </span> 
              </summary>

              <p className={`gotham text-[length:var(--fs-body)] leading-[1.7] ${c.body} font-light pb-[var(--space-28)] pr-[var(--space-48)]`}>
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
