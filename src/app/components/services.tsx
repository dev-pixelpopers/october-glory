"use client";

import React, { useState, useRef, useEffect } from "react";
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
  imageWidthMobile?: string;
  imageHeightMobile?: string;
  imageAspectMobile?: string;
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
    imageWidthMobile: "100%",
    imageHeightMobile: "auto",
    imageAspectMobile: "1 / 0.65",
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
    imageWidthMobile: "100%",
    imageHeightMobile: "auto",
    imageAspectMobile: "1 / 0.65",
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
  const [isNarrow, setIsNarrow] = useState(false); // matches SSR default — false
  


  useEffect(() => {
    const check = () => setIsNarrow(window.innerWidth < 1280);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    const build = (from: gsap.TweenVars, to: gsap.TweenVars) => {
      gsap.set(cardContRef.current, from);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 40%",
          end: "+=600",
          scrub: 1,
          toggleActions: "play none none reverse",
        },
      });
      tl.to(cardContRef.current, { ...to, duration: 1.5 })
        .to(imageRef.current, { yPercent: -10, duration: 1 }, "<");
    };

    // Desktop: the cards sit in a row, so the container is short and half its
    // height is a modest offset.
    mm.add("(min-width: 769px)", () => build({ yPercent: 50 }, { yPercent: 0 }));

    // Mobile: .offer-card-con switches to flex-direction: column, so the
    // container is ~2x taller. yPercent:50 then pushed it 437px down, past the
    // section's overflow:hidden edge, cutting off the second card entirely.
    // Only ~49px of headroom exists at rest, so use a small fixed offset
    // rather than one proportional to the container height.
    mm.add("(max-width: 768px)", () => build({ y: 40 }, { y: 0 }));
  }, { scope: containerRef })

  return (
    <section
      ref={containerRef}
      className="relative w-full min-h-dvh bg-[#151515] pt-[clamp(70px,26.31px_+_11.651vw,250px)] pb-[clamp(32px,15.5px_+_4.402vw,100px)] px-[clamp(35px,16.8px_+_4.855vw,110px)] flex flex-col items-center overflow-hidden"
    >
      <div className="absolute inset-0 z-10">
        <img ref={imageRef} src="/images/servicce.png" alt="" className="object-contain object-top" />
      </div>

      {/* Header Titles */}
      <div className="relative z-10 text-center mb-[clamp(28px,13.44px_+_3.884vw,88px)]">
        <h2 className="text-white andrea text-[length:clamp(32px,18.41px_+_3.625vw,88px)]">What We Offer</h2>
        <h3 className="text-[#cda873] valturin text-[length:clamp(28px,18.78px_+_2.46vw,66px)] mt-[clamp(5px,4.27px_+_0.195vw,8px)]">
          It's Your Time To Shine.
        </h3>
      </div>

      {/* Cards Container */}
      <div ref={cardContRef} className="offer-card-con relative z-10 flex gap-[clamp(16px,14.06px_+_0.518vw,24px)] w-full">
        {cards.map((card) => {
          const isActive = activeCard === card.id;
          const titleLeft = card.id === "wigs" && isNarrow ? "50%" : card.titleLeft;
          const imageWidth = isNarrow ? (card.imageWidthMobile ?? card.imageWidth) : card.imageWidth;
          const imageHeight = isNarrow ? (card.imageHeightMobile ?? card.imageHeight) : card.imageHeight;
          const imageAspect = isNarrow ? (card.imageAspectMobile ?? card.imageAspect) : card.imageAspect;
          const descPositionStyle = isNarrow ? { right: "10%" } : { left: isActive ? titleLeft : "20%" };

          return (
            <div
              key={card.id}
              onClick={() => setActiveCard(card.id)}
              className={`offer-card-main relative h-[68.24dvh] bg-gradient-to-b from-[#9C6D51] to-[#5F3A21] rounded-[30px] overflow-hidden cursor-pointer transition-all duration-700 ease-in-out flex-none ${isActive ? "min-[769px]:flex-[1.6]" : "min-[769px]:flex-1" }`}
            >
              {/* Model Image — stays left-aligned always */}
              {/* FIX applied here: moved dynamic width and height to inline styles */}
            <div
              className="offer-img absolute bottom-0 left-0"
              style={{ width: imageWidth, height: imageHeight, aspectRatio: imageAspect }}
            >
                <img
                  src={card.image}
                  alt={card.alt}
                  className="w-full h-auto"
                />
              </div>

              {/* Description Text & Button — only visible when active */}
              <div
                className={`offer-cards absolute top-[20%] right-[4%] w-[43%] flex flex-col gap-[clamp(16px,14.06px_+_0.518vw,24px)] transition-all duration-500 ease-in-out opacity-100 translate-x-0 pointer-events-auto ${isActive
                  ? "min-[769px]:opacity-100 min-[769px]:translate-x-0 min-[769px]:delay-200"
                  : "min-[769px]:opacity-0 min-[769px]:translate-x-10 min-[769px]:pointer-events-none"
                  }`}
              >
                <p className="text-white text-[length:clamp(16px,15.03px_+_0.259vw,20px)] leading-[clamp(31px,29.79px_+_0.324vw,36px)] font-light gotham">
                  {card.description}
                </p>

                <a href={card.link} className="flex items-center gap-[clamp(8px,7.03px_+_0.259vw,12px)] text-white w-max mt-[clamp(5px,4.27px_+_0.195vw,8px)] hover:opacity-80 transition">
                  <span className="flex items-center justify-center border border-white rounded-full w-[clamp(44px,43.03px_+_0.259vw,48px)] h-[clamp(44px,43.03px_+_0.259vw,48px)] text-[length:clamp(18px,17.51px_+_0.13vw,20px)]">
                    →
                  </span>
                  <span className="gotham text-[length:clamp(17px,16.27px_+_0.194vw,20px)]">Learn More</span>
                </a>
              </div>

              {/* Title — on image when inactive, translates under description when active */}
              {/* FIX applied here: moved dynamic left positioning to inline styles */}
              <div
                className="offer-desc absolute bottom-[6%] transition-all duration-700 ease-in-out"
                style={ descPositionStyle }
              >
                <h4 className="text-white text-[length:clamp(32px,18.41px_+_3.625vw,88px)] andrea leading-[1]">
                  {card.title}
                </h4>
                <h5 className="text-white text-[length:clamp(28px,18.78px_+_2.46vw,66px)] leading-[clamp(25px,16.5px_+_2.265vw,60px)] valturin ml-[clamp(27px,17.29px_+_2.59vw,67px)] mt-[clamp(6px,5.03px_+_0.259vw,10px)]">
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