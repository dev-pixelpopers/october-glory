"use client";

import React, { useState, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

type CardId = "wigs" | "silk";

interface OfferCard {
  id: CardId;
  image: string;
  imageWidth: string;
  imageHeight: string;
  titleLeft: string;
  alt: string;
  title: string;
  subtitle: string;
  description: string;
}

const cards: OfferCard[] = [
  {
    id: "wigs",
    image: "/images/left-image.png",
    imageWidth: "511px",
    imageHeight: "684px",
    titleLeft: "55%",
    alt: "Wigs Model",
    title: "Wigs",
    subtitle: "Extensions",
    description:
      "If You Want To Add Length, Thickness And Volume, Hair Extensions By Jhavuanna Will Be The Best You've Experienced In New York! Don't Forget About Our Wig Spa!",
  },
  {
    id: "silk",
    image: "/images/silk-press-img.png",
    imageWidth: "600px",
    imageHeight: "684px",
    titleLeft: "66%",
    alt: "Silk Press Model",
    title: "Silk",
    subtitle: "Press",
    description:
      'Your hair is cleansed and conditioned with our premier spa treatments. We will then "responsibly" press your tresses for a smooth, luxurious finish.',
  },
];

export default function OfferSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardContRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [activeCard, setActiveCard] = useState<CardId>("wigs");

  useGSAP(() => {
    gsap.set(cardContRef.current, { yPercent: 50 });
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 40%",
        end: "+=600",
        scrub: 1,
        toggleActions: "play none none reverse",
      },
    });
    tl.to(cardContRef.current, { yPercent: 0, duration: 1.5 })
      .to(imageRef.current, { yPercent: -10, duration: 1 }, "<")

  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-screen bg-[#151515] pt-[250px] pb-[100px] px-[110px] flex flex-col items-center overflow-hidden"
    >
      {/* Background Dim Image Layer (Optional) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('/images/bg-faint.png')] bg-cover bg-center"></div>
      <div className="absolute inset-0 z-10">
        <img ref={imageRef} src="/images/servicce.png" alt="" className="object-contain object-top" />
      </div>

      {/* Header Titles */}
      <div className="relative z-10 text-center mb-22">
        <h2 className="text-white andrea text-[88px]">What We Offer</h2>
        <h3 className="text-[#cda873] valturin text-[66px] mt-2">
          It's Your Time To Shine.
        </h3>
      </div>

      {/* Cards Container */}
      <div ref={cardContRef} className="relative z-10 flex gap-6 w-full">
        {cards.map((card) => {
          const isActive = activeCard === card.id;

          return (
            <div
              key={card.id}
              onClick={() => setActiveCard(card.id)}
              className={`relative h-[737px] bg-gradient-to-b from-[#9C6D51] to-[#5F3A21] rounded-[30px] overflow-hidden cursor-pointer transition-all duration-700 ease-in-out ${isActive ? "flex-[1.6]" : "flex-1"
                }`}
            >
              {/* Model Image — stays left-aligned always */}
              {/* FIX applied here: moved dynamic width and height to inline styles */}
              <div
                className="absolute bottom-0 left-0"
                style={{ width: card.imageWidth, height: card.imageHeight }}
              >
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-full h-auto"
                />
              </div>

              {/* Description Text & Button — only visible when active */}
              <div
                className={`absolute top-[20%] right-[40px] w-[37%] flex flex-col gap-6 transition-all duration-500 ease-in-out ${isActive
                  ? "opacity-100 translate-x-0 delay-200"
                  : "opacity-0 translate-x-10 pointer-events-none"
                  }`}
              >
                <p className="text-white text-[20px] leading-[36px] font-light gotham">
                  {card.description}
                </p>

                <button className="flex items-center gap-3 text-white w-max mt-2 hover:opacity-80 transition">
                  <span className="flex items-center justify-center border border-white rounded-full w-[55px] h-[55px] text-[22px]">
                    →
                  </span>
                  <span className="gotham text-[20px]">Learn More</span>
                </button>
              </div>

              {/* Title — on image when inactive, translates under description when active */}
              {/* FIX applied here: moved dynamic left positioning to inline styles */}
              <div
                className="absolute bottom-[80px] transition-all duration-700 ease-in-out"
                style={{ left: isActive ? card.titleLeft : "20%" }}
              >
                <h4 className="text-white text-[88px] andrea leading-[1]">
                  {card.title}
                </h4>
                <h5 className="text-white text-[66px] leading-[60px] valturin ml-[67px] mt-[10px]">
                  {card.subtitle}
                </h5>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}