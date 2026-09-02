"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The individual services that make up the maintenance packages above.
 * Descriptions are taken verbatim from the salon's wig maintenance document;
 * the short titles are labels for the grid.
 */
const serviceDetails = [
  {
    title: "Wig Wash & Style",
    description:
      "Washing and styling of your wig, restoring it back to its original look.",
  },
  {
    title: "Natural Hair Wash",
    description: "Washing of your natural hair underneath.",
  },
  {
    title: "Spa Treatment",
    description:
      "A spa treatment for your natural hair, where we assess your scalp and hair to determine exactly what it needs — whether that's moisture, protein to strengthen and rebuild the hair shaft, or a scalp treatment to clear away buildup and debris.",
  },
  {
    title: "Precision Trim",
    description:
      "A trim to remove any dead or split ends from your natural hair.",
  },
  {
    title: "Braid Down",
    description:
      "Braiding your natural hair down in preparation for reinstall.",
  },
  {
    title: "Wig Reinstall",
    description: "Reinstalling your wig, freshly washed and styled.",
  },
];

export default function MaintenancePackagesServices() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            delay: i * 0.12,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <div>
      <section
        ref={sectionRef}
        className="relative w-full bg-white py-[var(--space-section-y)] px-[var(--space-section-x)]"
      >
        {/* Decorative top border */}
        <div className="absolute top-0 left-[110px] right-[110px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884]/30 to-transparent" />

        {/* Section header */}
        <div className="text-center mb-[var(--space-64)]">
          <p className="gotham text-[#9C6D51] text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-16)]">
            What We Offer
          </p>
          <h2 className="andrea text-[#1B1B1B] text-[length:var(--fs-h2)] leading-[1.1]">
            Our Expertise
          </h2>
          <p className="valturin text-[#ccb884] text-[length:var(--fs-accent)] mt-2">
            It&apos;s Your Time To Shine
          </p>
        </div>

        {/* Service detail cards — 3 columns, 2 rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[var(--space-48)] gap-y-[var(--space-64)]">
          {serviceDetails.map((svc, idx) => (
            <div
              key={svc.title}
              ref={(el) => {
                cardsRef.current[idx] = el;
              }}
              className="group"
              style={{ opacity: 0 }}
            >
              {/* Gold numbered accent */}
              <div className="flex items-center gap-[var(--space-16)] mb-[var(--space-20)]">
                <span className="w-[36px] h-[36px] rounded-full border border-[#ccb884] flex items-center justify-center text-[#ccb884] gotham text-[14px] font-medium group-hover:bg-[#ccb884] group-hover:text-white transition-all duration-300">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <div className="flex-1 h-[1px] bg-gradient-to-r from-[#ccb884]/40 to-transparent" />
              </div>

              <h3 className="valturin text-[#1B1B1B] text-[length:var(--fs-h3)] mb-[var(--space-16)] group-hover:text-[#9C6D51] transition-colors duration-300">
                {svc.title}
              </h3>
              <p className="gotham text-[#555] text-[length:var(--fs-body)] leading-[1.9] font-light">
                {svc.description}
              </p>
            </div>
          ))}
        </div>

      </section>


    </div>

  );
}
