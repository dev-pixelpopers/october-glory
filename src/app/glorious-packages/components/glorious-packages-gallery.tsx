"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { usePackages } from "@/lib/api/hooks/catalog";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BOOKING_URL =
  "/dashboard/book";

// Cover art keyed by package slug (falls back to the ordered gallery images).
const IMAGE_BY_SLUG: Record<string, string> = {
  "glorious-rodset": "/images/glorious-packages-01.webp",
  "glorious-silk-press": "/images/glorious-packages-02.webp",
  "glorious-boost": "/images/glorious-packages-03.webp",
  "wig-prep": "/images/glorious-packages-04.webp",
};
const FALLBACK_IMAGES = [
  "/images/glorious-packages-01.webp",
  "/images/glorious-packages-02.webp",
  "/images/glorious-packages-03.webp",
  "/images/glorious-packages-04.webp",
];

const FALLBACK_SERVICES = [
  { name: "GLORIOUS RODSET", price: "$230", image: FALLBACK_IMAGES[0] },
  { name: "GLORIOUS SILK PRESS", price: "$245", image: FALLBACK_IMAGES[1] },
  { name: "GLORIOUS BOOST", price: "$120", image: FALLBACK_IMAGES[2] },
  { name: "WIG PREP", price: "$120", image: FALLBACK_IMAGES[3] },
];

/** "230.00" -> "$230". */
function priceLabel(price: string): string {
  const n = parseFloat(price);
  return Number.isFinite(n) ? `$${n.toLocaleString("en-US")}` : price;
}

export default function GloriousPackagesGallery() {
  const { data: packages } = usePackages("glorious");

  const services =
    packages && packages.length > 0
      ? packages.map((p, i) => ({
          name: p.name.toUpperCase(),
          price: priceLabel(p.price),
          image: IMAGE_BY_SLUG[p.slug] ?? FALLBACK_IMAGES[i % FALLBACK_IMAGES.length],
        }))
      : FALLBACK_SERVICES;

  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      cardsRef.current.forEach((card, i) => {
        if (!card) return;
        gsap.fromTo(
          card,
          { y: 80, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: i * 0.1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#1B1B1B] py-[var(--space-section-y)] px-[var(--space-section-x)]"
    >
      {/* Section Header */}
      <div className="text-center mb-[var(--space-64)]">
        <p className="gotham text-[#ccb884] text-[length:var(--fs-small)] tracking-[6px] uppercase mb-[var(--space-16)]">
          Our Signature Services
        </p>
        <h2 className="andrea text-white text-[length:var(--fs-h2)] leading-[1.1]">
          Curated For You
        </h2>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[var(--space-32)]">
        {services.map((service, index) => (
          <div
            key={service.name}
            ref={(el) => {
              cardsRef.current[index] = el;
            }}
            className="group relative rounded-[20px] overflow-hidden cursor-pointer"
            style={{ opacity: 0 }}
          >
            {/* Image */}
            <div className="aspect-square overflow-hidden bg-[#2a2a2a]">
              <img
                src={service.image}
                alt={service.name}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              />
            </div>

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-[var(--space-24)]">
              {/* Price Badge */}
              <span className="absolute top-5 right-5 bg-[#ccb884] text-[#1B1B1B] gotham font-bold text-[14px] px-[var(--space-16)] py-2 rounded-full">
                {service.price}
              </span>

              <h3 className="valturin text-white text-[length:var(--fs-h3)] mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {service.name}
              </h3>

              <a
                href={BOOKING_URL}
                className="inline-flex items-center gap-2 text-[#ccb884] gotham text-[14px] tracking-[2px] uppercase translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 hover:text-white"
              >
                Book Now
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </a>
            </div>

            {/* Default label bar (visible when not hovered) */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-[var(--space-20)] group-hover:opacity-0 transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <h3 className="valturin text-white text-[length:clamp(18px,15.94px_+_0.882vw,26px)]">
                  {service.name}
                </h3>
                <span className="gotham text-[#ccb884] text-[16px] font-medium">
                  {service.price}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
