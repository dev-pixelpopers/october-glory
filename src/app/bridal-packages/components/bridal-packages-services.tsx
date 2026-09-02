"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const serviceDetails = [
  {
    title: "Cut & Finish",
    description:
      "Whether it's time for something totally new or you just need some style maintenance our professionalism and attention to detail remains consistent.",
  },
  {
    title: "Extensions / Wigs",
    description:
      "If you want to add length, thickness and volume, hair extensions by Jhavuanna will be the best you've experienced in New York! Don't forget about our Wig Spa!",
    link: "/services",
    linkText: "Click Here",
  },
  {
    title: "Silk Press",
    description:
      'Your hair is cleansed and conditioned with our premier spa treatments. We will then "responsibly" press your tresses for a smooth, luxurious finish.',
  },
  {
    title: "Treatments",
    description:
      "All of our treatments are designed to bring out the best from your hair while maintaining your ethical beliefs. All of our products are free from parabens, synthetic fragrance, SLS and carcinogens.",
  },
  {
    title: "Glorious Coloring",
    description:
      "Get a sun-kissed look with a full head of foils. Our talented Senior Hair Stylists & Colorist understand how to blend and interconnect different highlight patterns with the base to create a spectacular finished highlights.",
  },
  {
    title: "Blow Dry",
    description:
      "Treat your hair to a professional hair styling for any occasion. Book your blow dry service and enjoy an amazing shampoo, relaxing head massage and blow dry or Wash, Finish w/ Curls.",
  },
];

export default function GloriousPackagesServices() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);
  const btnRef = useRef<HTMLAnchorElement>(null);

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

      if (btnRef.current) {
        gsap.fromTo(
          btnRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: btnRef.current,
              start: "top 92%",
              toggleActions: "play none none none",
            },
          }
        );
      }
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-[var(--space-48)] gap-y-[var(--space-64)] mb-[var(--space-64)]">
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
                {svc.link && (
                  <>
                    {" — "}
                    <a
                      href={svc.link}
                      className="text-[#9C6D51] underline underline-offset-4 hover:text-[#ccb884] transition-colors duration-300"
                    >
                      {svc.linkText}
                    </a>
                  </>
                )}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <a
            href="/dashboard/book"
            className="flex mt-[var(--space-16)] gap-[clamp(6px,5.03px_+_0.259vw,10px)] items-center border-[#000] border text-[#000] rounded-4xl py-[clamp(3px,2.76px_+_0.065vw,4px)] pl-[clamp(3px,2.51px_+_0.13vw,5px)] pr-[clamp(16px,13.81px_+_0.583vw,25px)] justify-center text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
          >
            <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
              →
            </span>
            Book Consultation
          </a>

        </div>
      </section>


    </div>

  );
}
