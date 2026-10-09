"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

/**
 * Hero for the Units pages — the wordmark over the photograph, no breadcrumb
 * and no intro paragraph, the way the home page hero reads.
 *
 * `eyebrow` carries the spec line on a unit's own page; the index leaves it
 * off.
 */
export default function UnitHero({
  image,
  display,
  script,
  eyebrow,
  back,
  scale = "page",
}: {
  image: string;
  /** Large Andrea-Bellarosa line. */
  display: string;
  /** Valturin line underneath. */
  script: string;
  eyebrow?: string;
  /** Shown above the heading on a unit page, back to the index. */
  back?: { href: string; label: string };
  /**
   * "display" sets the title roughly half again as large as a normal page
   * heading. The Units index uses it — the handoff asks for a prominent
   * "October Glory Units" title, and at page scale it was the smallest thing
   * in a full-screen hero.
   */
  scale?: "page" | "display";
}) {
  const headingRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    gsap
      .timeline({ defaults: { ease: "power3.out" } })
      .fromTo(
        headingRef.current,
        { y: 60, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2 }
      )
      .fromTo(dividerRef.current, { scaleX: 0 }, { scaleX: 1, duration: 0.8 }, "-=0.5")
      .fromTo(
        metaRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.4"
      );
  });

  const titleSize =
    scale === "display"
      ? "text-[length:clamp(38px,19.5px_+_4.93vw,110px)]"
      : "text-[length:var(--fs-h1)]";

  return (
    <section
      className="relative w-full min-h-screen flex items-end justify-center overflow-hidden pb-[clamp(20px,17.57px_+_0.648vw,30px)]"
      style={{
        // The scrim has to carry the title, not just the bottom edge. These
        // photographs are bright and warm, and a gradient that only darkens
        // the last few percent left white script sitting on skin tones.
        // Three jobs, one gradient. The top band matches the 0.6 the other
        // inner-page heroes use, so the header's wordmark and menu bars stay
        // legible over a bright photograph. It falls away through the middle
        // so the picture is still a picture. It closes dark enough to carry
        // the title, which sits at the bottom.
        backgroundImage: `linear-gradient(180deg, rgba(27,27,27,0.62) 0%, rgba(27,27,27,0.30) 24%, rgba(27,27,27,0.22) 44%, rgba(27,27,27,0.66) 70%, rgba(27,27,27,0.95) 100%), url('${image}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Gold corner accents — the same framing the service heroes use. */}
      <div className="absolute top-[140px] left-[40px] md:left-[80px] w-[70px] h-[70px] border-t border-l border-[#ccb884]/30" />
      <div className="absolute bottom-[70px] right-[40px] md:right-[80px] w-[70px] h-[70px] border-b border-r border-[#ccb884]/30" />

      <div className="relative z-10 text-center flex flex-col items-center px-[var(--space-section-x)]">
        {back && (
          <Link
            href={back.href}
            className="gotham text-[12px] md:text-[13px] tracking-[4px] uppercase text-white/50 hover:text-[#ccb884] transition-colors duration-300 mb-[var(--space-32)]"
          >
            ← {back.label}
          </Link>
        )}

        <div ref={headingRef}>
          <h1 className={`flex flex-col andrea ${titleSize} leading-[1.3] text-white tracking-wide`}>
            {display}
            <span className={`valturin ${titleSize} text-[#ccb884] mt-[-0.12em] tracking-widest`}>
              {script}
            </span>
          </h1>
        </div>

        <div
          ref={dividerRef}
          className="w-[120px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent my-[var(--space-32)] origin-center"
        />

        <div ref={metaRef} className="flex flex-col items-center gap-[var(--space-24)]">
          {eyebrow && (
            <p className="gotham text-[#ccb884] text-[length:var(--fs-small)] tracking-[4px] uppercase">
              {eyebrow}
            </p>
          )}

          <Link
            href="/dashboard/book"
            className="flex gap-[clamp(6px,5.03px_+_0.259vw,10px)] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[clamp(3px,2.76px_+_0.065vw,4px)] pl-[clamp(3px,2.51px_+_0.13vw,5px)] pr-[clamp(16px,13.81px_+_0.583vw,25px)] justify-center text-[16px] md:text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
          >
            <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
              →
            </span>
            Book A Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
