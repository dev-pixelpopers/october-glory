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
  /** Locks the image box to its designed proportion, so height drives width. */
  imageAspect: string;
  titleLeft: string;
  alt: string;
  title: string;
  subtitle: string;
  description: string;
  link:string;
}

const cards: OfferCard[] = [
  {
    id: "wigs",
    image: "/images/left-image.png",
    imageWidth: "auto",
    imageHeight: "92.81%",
    imageAspect: "511 / 684",
    titleLeft: "55%",
    alt: "Wigs Model",
    title: "Wigs",
    subtitle: "Extensions",
    description:"Looking for premium custom wigs in Brooklyn? We design, install, and maintain custom wigs tailored to your lifestyle and personal style.",
    link:"/services/wigs-and-extensions",
  },
  {
    id: "silk",
    image: "/images/silk-press-img.png",
    imageWidth: "auto",
    imageHeight: "92.81%",
    imageAspect: "600 / 684",
    titleLeft: "66%",
    alt: "Silk Press Model",
    title: "Silk",
    subtitle: "Press",
    description:
      "Experience smooth, sleek hair while preserving the health of your natural curls.",
    link:"/services/silk-press",
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
      className="relative w-full min-h-dvh bg-[#151515] pt-[clamp(70px,26.31px_+_11.65vw,250px)] pb-[clamp(32px,15.5px_+_4.401vw,100px)] px-[clamp(35px,16.8px_+_4.854vw,110px)] flex flex-col items-center overflow-hidden"
    >
      <div className="absolute inset-0 z-10">
        <img ref={imageRef} src="/images/servicce.png" alt="" className="object-contain object-top" />
      </div>

      {/* Header Titles */}
      <div className="relative z-10 text-center mb-22">
        <h2 className="text-white andrea text-[length:clamp(32px,18.41px_+_3.625vw,88px)]">What We Offer</h2>
        <h3 className="text-[#cda873] valturin text-[length:clamp(28px,18.78px_+_2.46vw,66px)] mt-2">
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
              className={`relative h-[68.24dvh] bg-gradient-to-b from-[#9C6D51] to-[#5F3A21] rounded-[30px] overflow-hidden cursor-pointer transition-all duration-700 ease-in-out ${isActive ? "flex-[1.6]" : "flex-1"
                }`}
            >
              {/* Model Image — stays left-aligned always */}
              {/* FIX applied here: moved dynamic width and height to inline styles */}
              <div
                className="absolute bottom-0 left-0"
                style={{ width: card.imageWidth, height: card.imageHeight, aspectRatio: card.imageAspect }}
              >
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-full h-auto"
                />
              </div>

              {/* Description Text & Button — only visible when active */}
              <div
                className={`absolute top-[20%] right-[40px] w-[43%] flex flex-col gap-6 transition-all duration-500 ease-in-out ${isActive
                  ? "opacity-100 translate-x-0 delay-200"
                  : "opacity-0 translate-x-10 pointer-events-none"
                  }`}
              >
                <p className="text-white text-[length:clamp(17px,16.27px_+_0.194vw,20px)] leading-[clamp(31px,29.79px_+_0.324vw,36px)] font-light gotham">
                  {card.description}
                </p>

                <a href={card.link} className="flex items-center gap-3 text-white w-max mt-2 hover:opacity-80 transition">
                  <span className="flex items-center justify-center border border-white rounded-full w-[55px] h-[55px] text-[length:clamp(19px,18.27px_+_0.194vw,22px)]">
                    →
                  </span>
                  <span className="gotham text-[length:clamp(17px,16.27px_+_0.194vw,20px)]">Learn More</span>
                </a>
              </div>

              {/* Title — on image when inactive, translates under description when active */}
              {/* FIX applied here: moved dynamic left positioning to inline styles */}
              <div
                className="absolute bottom-[80px] transition-all duration-700 ease-in-out"
                style={{ left: isActive ? card.titleLeft : "20%" }}
              >
                <h4 className="text-white text-[length:clamp(32px,18.41px_+_3.625vw,88px)] andrea leading-[1]">
                  {card.title}
                </h4>
                <h5 className="text-white text-[length:clamp(28px,18.78px_+_2.46vw,66px)] leading-[clamp(25px,16.5px_+_2.265vw,60px)] valturin ml-[clamp(27px,17.29px_+_2.589vw,67px)] mt-[10px]">
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