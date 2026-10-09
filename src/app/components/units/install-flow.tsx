"use client";

import React from "react";
import Image from "next/image";
import { useReveal } from "../service-detail/use-reveal";
import { tone as palette, type Tone } from "../service-detail/tone";
import { unitsPage } from "@/data/units";

/**
 * The installation flow: the start-to-finish video, then the four stages as a
 * numbered strip of stills.
 *
 * The deck calls the video a website requirement, so it leads — the stills
 * below are what the video shows, for anyone who will not press play.
 */
export default function InstallFlow({ tone = "dark" }: { tone?: Tone }) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];
  const { install } = unitsPage;

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-x-clip`}
    >
      <div className="relative z-10 max-w-[1400px] mx-auto">
        <div className="text-center max-w-[760px] mx-auto">
          <p
            data-reveal
            className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-20)]`}
          >
            {install.eyebrow}
          </p>

          <h2
            data-reveal
            data-reveal-delay="1"
            className={`valturin text-[length:var(--fs-h2)] leading-[1.2] ${c.heading}`}
          >
            {install.heading}
            <span className="andrea text-[#ccb884]"> {install.headingAccent}</span>
          </h2>

          <p
            data-reveal
            data-reveal-delay="2"
            className={`gotham text-[length:var(--fs-body)] leading-[1.8] ${c.body} font-light mt-[var(--space-24)]`}
          >
            {install.intro}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-[var(--space-64)]">
          <div className="w-full lg:w-1/2">
        <ol className="mt-[var(--space-56)] flex flex-col gap-[var(--space-56)]">
          {install.steps.map((step, i) => (
            <li
              key={step.title}
              data-reveal
              data-reveal-delay={String(4 + i)}
              className="flex flex-row gap-[10px] items-center"
            >
              <div className="w-[65%]">

              <h3
                className={`valturin text-[length:clamp(20px,17.65px_+_0.988vw,28px)] leading-[1.3] ${c.bodyStrong} mb-[12px]`}
              >
                {step.title}
              </h3>
              <p
                className={`gotham text-[length:var(--fs-body)] leading-[1.8] ${c.body} font-light`}
              >
                {step.body}
              </p>
              </div>
              <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden bg-[#2a2a2a] mb-[var(--space-24)] w-[35%]">
                <Image
                  src={step.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
                <span
                  aria-hidden="true"
                  className="absolute top-4 left-4 valturin text-white text-[32px] leading-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>

            </li>
          ))}
        </ol>
          </div>

          <div className="w-full lg:w-1/2">
          {install.video && (
          <div
            data-reveal
            data-reveal-delay="3"
            className="relative mt-[var(--space-56)] mx-auto max-w-[760px] lg:sticky lg:top-[var(--space-40)]"
          >
            <div className="absolute -inset-4 md:-inset-6 border border-[#ccb884]/25 rounded-[28px] pointer-events-none translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5" />
            <div className="relative aspect-[9/16] sm:aspect-[4/5] rounded-[24px] overflow-hidden bg-[#2a2a2a]">
              <video
                src={install.video}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label="A unit installed from start to finish"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        )}
        </div>

       </div> 
      </div>
    </section>
  );
}
