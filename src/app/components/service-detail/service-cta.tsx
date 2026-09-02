"use client";

import React from "react";
import { useReveal } from "./use-reveal";
import type { ServiceDetail } from "@/data/services/types";

export default function ServiceCta({
  cta,
  image,
}: {
  cta?: ServiceDetail["cta"];
  image: string;
}) {
  const scope = useReveal<HTMLElement>();

  return (
    <section
      ref={scope}
      className="reveal-scope py-[var(--space-section-y)] px-[var(--space-section-x)] bg-cover bg-center text-center relative"
      style={{ backgroundImage: `url('${image}')` }}
    >
      <div className="absolute inset-0 bg-black/90 z-0" />

      <div className="relative z-10 flex flex-col items-center max-w-[800px] mx-auto gap-[var(--space-32)]">
        <h2
          data-reveal
          className="andrea text-[length:var(--fs-h2)] text-white mb-[calc(var(--space-32)*-1)]"
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
          className="gotham text-[length:var(--fs-body)] text-gray-300 max-w-[600px] font-light leading-relaxed"
        >
          {cta?.body ??
            "Let us tailor an unforgettable styling experience for you. Schedule your private appointment with Jhavuanna Paterson today."}
        </p>

        <a
          data-reveal
          data-reveal-delay="3"
          href="/dashboard/book"
          className="flex mt-[var(--space-16)] gap-[clamp(6px,5.03px_+_0.259vw,10px)] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[clamp(3px,2.76px_+_0.065vw,4px)] pl-[clamp(3px,2.51px_+_0.13vw,5px)] pr-[clamp(16px,13.81px_+_0.583vw,25px)] justify-center text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
        >
          <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
            →
          </span>
          Book Consultation
        </a>
      </div>
    </section>
  );
}
