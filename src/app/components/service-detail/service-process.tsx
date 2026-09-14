"use client";

import React from "react";
import Image from "next/image";
import { useReveal } from "./use-reveal";
import type { ServiceProcess } from "@/data/services/types";
import { tone as palette, type Tone } from "./tone";

/**
 * The "how it works" walkthrough: the service being performed on one side, the
 * stages it goes through numbered down the other.
 *
 * The video is decorative — every step is written out beside it — so it is
 * muted, looping and `aria-hidden`, and the poster image carries the frame for
 * anyone who never sees it play.
 */
export default function ServiceProcessSection({
  process,
  tone = "dark",
  flip = false,
}: {
  process: ServiceProcess;
  tone?: Tone;
  flip?: boolean;
}) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];

  return (
    <section
      ref={scope}
      className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-hidden`}
    >
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-[var(--space-64)] items-center max-w-[1400px] mx-auto">
        <div className={flip ? "lg:order-last" : undefined}>
          {process.eyebrow && (
            <p
              data-reveal
              className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-20)]`}
            >
              {process.eyebrow}
            </p>
          )}

          <h2
            data-reveal
            data-reveal-delay="1"
            className={`valturin text-[length:var(--fs-h2)] leading-[1.2] ${c.heading}`}
          >
            {process.heading}
            {process.headingAccent && (
              <span className="andrea text-[#ccb884]"> {process.headingAccent}</span>
            )}
          </h2>

          {process.intro && (
            <p
              data-reveal
              data-reveal-delay="2"
              className={`gotham text-[length:var(--fs-body)] leading-[1.8] ${c.body} font-light mt-[var(--space-24)]`}
            >
              {process.intro}
            </p>
          )}

          <ol className="mt-[var(--space-40)] flex flex-col">
            {process.steps.map((step, i) => (
              <li
                key={step.title}
                data-reveal
                data-reveal-delay={String(3 + i)}
                className={`flex gap-[var(--space-24)] pb-[var(--space-32)] ${
                  i === process.steps.length - 1
                    ? ""
                    : `border-b ${c.border} mb-[var(--space-32)]`
                }`}
              >
                {/* The step number doubles as the list marker, so the ordered
                    list keeps its semantics without showing a second count. */}
                <span
                  aria-hidden="true"
                  className="valturin text-[#ccb884] text-[length:clamp(28px,24.47px_+_1.482vw,40px)] leading-none shrink-0 w-[clamp(38px,33.12px_+_1.036vw,54px)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>

                <div>
                  <h3
                    className={`valturin text-[length:clamp(20px,17.65px_+_0.988vw,28px)] leading-[1.3] ${c.bodyStrong} mb-[var(--space-12)]`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`gotham text-[length:var(--fs-body)] leading-[1.8] ${c.body} font-light`}
                  >
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div
          data-reveal
          data-reveal-delay="2"
          className={`relative group ${flip ? "lg:order-first" : "order-first lg:order-last"}`}
        >
          {/* Offset gold frame — the same treatment the section blocks use. */}
          <div
            className={`absolute -inset-4 md:-inset-6 border border-[#ccb884]/25 rounded-[28px] pointer-events-none ${
              flip
                ? "-translate-x-3 translate-y-3 md:-translate-x-5 md:translate-y-5"
                : "translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5"
            }`}
          />

          <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden bg-[#2a2a2a]">
            {process.video ? (
              <video
                src={process.video}
                poster={process.image}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
              />
            ) : (
              process.image && (
                <Image
                  src={process.image}
                  alt=""
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
              )
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/45 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
}
