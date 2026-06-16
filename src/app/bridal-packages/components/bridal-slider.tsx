"use client";

import { useState, useEffect, useCallback } from "react";

const slides = [
  { src: "/images/bridal-slider-01.webp", alt: "Bridal hairstyle look 1" },
  { src: "/images/bridal-slider-02.webp", alt: "Bridal hairstyle look 2" },
  { src: "/images/bridal-slider-03.webp", alt: "Bridal hairstyle look 3" },
  { src: "/images/bridal-slider-04.webp", alt: "Bridal hairstyle look 4" },
  { src: "/images/bridal-slider-05.webp", alt: "Bridal hairstyle look 5" },
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
    <div className="relative w-full max-w-[500px]">
      {/* Slides */}
      <div className="relative border border-[#d4af6e]/30 rounded-[2rem] p-4 bg-[#1B1B1B]/40 shadow-2xl overflow-hidden">
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

      {/* Numbered Pagination */}
      <div className="flex justify-center items-center gap-3 mt-6">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`
              w-[36px] h-[36px] rounded-full flex items-center justify-center
              text-[14px] gotham font-medium transition-all duration-300 cursor-pointer
              ${
                index === current
                  ? "bg-[#d4af6e] text-black scale-110 shadow-lg shadow-[#d4af6e]/30"
                  : "bg-[#2a2a2a] text-gray-400 hover:bg-[#3a3a3a] hover:text-white"
              }
            `}
            aria-label={`Go to slide ${index + 1}`}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
