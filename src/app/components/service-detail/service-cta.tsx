"use client";

import React from "react";
import { useReveal } from "./use-reveal";
import type { ServiceDetail } from "@/data/services/types";
import { tone as palette, type Tone } from "./tone";

export default function ServiceCta({
  cta,
  image,
  /** Defaults to booking. Cross-link CTAs pass their own destination. */
  action = { href: "/dashboard/book", label: "Book Consultation" },
  /**
   * Lifts the band above the fixed side tab, so reaching this section hides
   * the tab rather than letting it float over the page's closing panel.
   */
  elevated = false,
  /**
   * "dark" is the photograph under a near-black wash. "light" drops the
   * photograph for the page's paper tone — used for a CTA sitting between
   * two dark ones, so three closing panels don't read as one long slab.
   */
  tone = "dark",
}: {
  cta?: ServiceDetail["cta"];
  image: string;
  action?: { href: string; label: string };
  elevated?: boolean;
  tone?: Tone;
}) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];
  const isLight = tone === "light";

  return (
    <section
      ref={scope}
      className={`reveal-scope py-[var(--space-section-y)] px-[var(--space-section-x)] bg-cover bg-center text-center relative ${
        isLight ? c.section : ""
      } ${elevated ? "z-50" : ""}`}
      style={isLight ? undefined : { backgroundImage: `url('${image}')` }}
    >
      {!isLight && <div className="absolute inset-0 bg-black/90 z-0" />}

      <div className="relative z-10 flex flex-col items-center max-w-[800px] mx-auto gap-[var(--space-32)]">
        <h2
          data-reveal
          className={`andrea text-[length:var(--fs-h2)] ${c.heading} mb-[calc(var(--space-32)*-1)]`}
        >
          {cta?.display ?? "Reserve Your Space"}
        </h2>

        <h3
          data-reveal
          data-reveal-delay="1"
          className="valturin text-[length:var(--fs-h3)] text-gold uppercase tracking-wider"
        >
          {cta?.heading ?? "Ready To Transform Your Look?"}
        </h3>

        <p
          data-reveal
          data-reveal-delay="2"
          className={`gotham text-[length:var(--fs-body)] ${c.body} max-w-[600px] font-light leading-relaxed`}
        >
          {cta?.body ??
            "Let us tailor an unforgettable styling experience for you. Schedule your private appointment with Jhavuanna Paterson today."}
        </p>

        <a
          data-reveal
          data-reveal-delay="3"
          href={action.href}
          className="flex mt-[var(--space-16)] gap-[clamp(6px,5.03px_+_0.259vw,10px)] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[clamp(3px,2.76px_+_0.065vw,4px)] pl-[clamp(3px,2.51px_+_0.13vw,5px)] pr-[clamp(16px,13.81px_+_0.583vw,25px)] justify-center text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
        >
          <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
            →
          </span>
          {action.label}
        </a>
      </div>
    </section>
  );
}
