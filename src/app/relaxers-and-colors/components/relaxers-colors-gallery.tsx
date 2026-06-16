"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const BOOKING_URL =
  "https://www.vagaro.com//Users/BusinessWidget.aspx?enc=MMLjhIwJMcwFQhXLL7ifVL2LPHcA1MSzdjmR77PgNO89nkScgoh/XItsZiAvMSwg29GkfunPKpsn7GMKFL4WEP9ko0RiGqpIZ/KFqFgWkys767ajFMz9rJEVrHUd1u2uaqES+ew0DN8nlQRL8wZ3JvghJpwuChzDj9h0Mru8i7ww9EqwJtGj9HLr19aG1GmL+l9bDVPtK1PlVLd/yIWuOzF5DcFZ/X2vSorKvQhldHO2KJc8FTfu8fSZbDZ/fKlcLH5wt4ow87po8iF098PwIxBq4/Em9Y0XfM2mvEI4lcjdQf7q9gXkBP/8WJIKsph3EHqdmHX8syCs/lf4W6brJw==";

const services = [
  {
    name: "RELAXER TOUCH UP",
    price: "$100",
    // Replace with your own image
    image: "/images/relaxers-colors-01.webp",
  },
  {
    name: "VIRGIN RELAXER",
    price: "$225",
    image: "/images/relaxers-colors-02.webp",
  },
  {
    name: "COLOR RETOUCH",
    price: "$125",
    image: "/images/relaxers-colors-03.webp",
  },
  {
    name: "SINGLE PROCESS",
    price: "$120",
    image: "/images/relaxers-colors-04.webp",
  },
  {
    name: "DOUBLE PROCESS",
    price: "$350",
    image: "/images/relaxers-colors-05.webp",
  },
  {
    name: "HALF-HEAD HIGHLIGHTS",
    price: "$160",
    image: "/images/relaxers-colors-06.webp",
  },
  {
    name: "FULL HIGHLIGHTS OR FOILAYAGE",
    price: "$300",
    image: "/images/relaxers-colors-07.webp",
  },
  {
    name: "CROWN LIGHTS",
    price: "$85",
    image: "/images/relaxers-colors-08.webp",
  },
  {
    name: "COLOR CORRECTION",
    price: "$250",
    image: "/images/relaxers-colors-09.webp",
  },
  {
    name: "GLORIOUS BOOST",
    price: "$120",
    image: "/images/relaxers-colors-10.webp",
  },
];

export default function RelaxersColorsGallery() {
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
      className="relative w-full bg-[#1B1B1B] py-[120px] px-[60px] md:px-[110px]"
    >
      {/* Section Header */}
      <div className="text-center mb-[80px]">
        <p className="gotham text-[#ccb884] text-[16px] tracking-[6px] uppercase mb-4">
          Our Signature Services
        </p>
        <h2 className="andrea text-white text-[72px] leading-[1.1]">
          Curated For You
        </h2>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
              {/* Price Badge */}
              <span className="absolute top-5 right-5 bg-[#ccb884] text-[#1B1B1B] gotham font-bold text-[14px] px-4 py-2 rounded-full">
                {service.price}
              </span>

              <h3 className="valturin text-white text-[28px] mb-2 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                {service.name}
              </h3>

              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
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
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-5 group-hover:opacity-0 transition-opacity duration-300">
              <div className="flex items-center justify-between">
                <h3 className="valturin text-white text-[22px]">
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
