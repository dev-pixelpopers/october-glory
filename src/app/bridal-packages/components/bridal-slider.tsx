"use client";

import { useState, useEffect, useCallback } from "react";

const slides = [
  { src: "/images/bride-slide-1.png", alt: "Bridal hairstyle look 1" },
  { src: "/images/bride-slide-2.png", alt: "Bridal hairstyle look 2" },
  { src: "/images/bride-slide-3.png", alt: "Bridal hairstyle look 3" },
  { src: "/images/bride-slide-4.png", alt: "Bridal hairstyle look 4" },
  { src: "/images/bride-slide-5.png", alt: "Bridal hairstyle look 5" },
];

export default function BridalSlider() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  // Autoplay
  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative w-full max-w-[500px] flex flex-row">
      {/* Slides */}
      <div className="relative border border-[#d4af6e]/30 rounded-[2rem] p-4 bg-[#1B1B1B]/40 shadow-2xl overflow-hidden w-[85%]">
        <div className="relative w-full aspect-[3/4] rounded-[1.5rem] overflow-hidden">
          {slides.map((slide, index) => (
            <img
              key={index}
              src={slide.src}
              alt={slide.alt}
              className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out"
              style={{ opacity: index === current ? 1 : 0 }}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Pagination — each slide previews itself, so the rail reads
          as a set of looks to pick from rather than an abstract counter. */}
      <div className="flex flex-col justify-center items-center gap-3 w-[15%] pl-3">
        {slides.map((slide, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`
              relative w-full aspect-[3/4] rounded-[0.75rem] overflow-hidden
              transition-all duration-300 cursor-pointer
              ${
                index === current
                  ? "ring-2 ring-[#d4af6e] scale-105 shadow-lg shadow-[#d4af6e]/30"
                  : "ring-1 ring-white/10 opacity-50 hover:opacity-100 hover:ring-[#d4af6e]/50"
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === current}
          >
            <img
              src={slide.src}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
