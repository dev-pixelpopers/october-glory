"use client";

import React, { useState } from "react";

// TypeScript ke liye Type define ki hai taakay state mein koi aur value na ja sakay
type ActiveCard = "wigs" | "silk";

export default function OfferSection() {
  // useState mein type pass ki hai
  const [activeCard, setActiveCard] = useState<ActiveCard>("wigs");

  return (
    <section className="relative w-full min-h-screen bg-[#151515] py-24 px-[5%] flex flex-col items-center overflow-hidden">
      
      {/* Background Dim Image Layer (Optional) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('/images/bg-faint.png')] bg-cover bg-center"></div>

      {/* Header Titles */}
      <div className="relative z-10 text-center mb-16">
        <h2 className="text-white text-[70px] md:text-[90px] leading-none font-light" style={{ fontFamily: 'Brush Script MT, cursive' }}>
          What We Offer
        </h2>
        <h3 className="text-[#cda873] text-[30px] md:text-[40px] mt-2 font-serif">
          It's Your Time To Shine.
        </h3>
      </div>

      {/* Cards Container */}
      <div className="relative z-10 flex gap-6 w-full max-w-[1100px] h-[550px]">
        
        {/* =========================================
            CARD 1: WIGS EXTENSIONS 
        ========================================= */}
        <div
          onClick={() => setActiveCard("wigs")}
          className={`relative bg-[#8b5a40] rounded-[30px] overflow-hidden cursor-pointer transition-all duration-700 ease-in-out flex ${
            activeCard === "wigs" ? "flex-[2.2]" : "flex-1"
          }`}
        >
          {/* Model Image */}
          <div
            className={`absolute bottom-0 transition-all duration-700 ease-in-out ${
              activeCard === "wigs" ? "left-[-2%] w-[55%]" : "left-1/2 -translate-x-1/2 w-[90%]"
            }`}
          >
            <img
              src="/images/wigs-model.png" 
              alt="Wigs Model"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Description Text & Button */}
          <div
            className={`absolute top-[20%] right-[8%] w-[45%] flex flex-col gap-6 transition-all duration-500 ease-in-out ${
              activeCard === "wigs"
                ? "opacity-100 translate-x-0 delay-200"
                : "opacity-0 translate-x-10 pointer-events-none"
            }`}
          >
            <p className="text-white/90 text-[15px] leading-loose font-light">
              If You Want To Add Length, Thickness And Volume, Hair Extensions By Jhavuanna Will Be The Best You've Experienced In New York! Don't Forget About Our Wig Spa!
            </p>
            
            <button className="flex items-center gap-3 text-white w-max mt-2 hover:opacity-80 transition">
              <span className="flex items-center justify-center w-8 h-8 border border-white rounded-full text-xs">
                →
              </span>
              <span className="font-semibold text-sm tracking-widest">Learn More</span>
            </button>
          </div>

          {/* Titles Overlay (Wigs Extensions) */}
          <div
            className={`absolute transition-all duration-700 ease-in-out ${
              activeCard === "wigs"
                ? "bottom-12 right-12 text-right"
                : "bottom-8 left-1/2 -translate-x-1/2 text-center"
            }`}
          >
            <h4 className="text-white text-[70px] leading-[0.5]" style={{ fontFamily: 'Brush Script MT, cursive' }}>
              Wigs
            </h4>
            <h5 className="text-white text-[35px] font-serif tracking-wide mt-2">
              Extensions
            </h5>
          </div>
        </div>

        {/* =========================================
            CARD 2: SILK PRESS 
        ========================================= */}
        <div
          onClick={() => setActiveCard("silk")}
          className={`relative bg-[#8b5a40] rounded-[30px] overflow-hidden cursor-pointer transition-all duration-700 ease-in-out flex ${
            activeCard === "silk" ? "flex-[2.2]" : "flex-1"
          }`}
        >
          {/* Model Image */}
          <div
            className={`absolute bottom-0 transition-all duration-700 ease-in-out ${
              activeCard === "silk" ? "left-[-2%] w-[55%]" : "left-1/2 -translate-x-1/2 w-[95%]"
            }`}
          >
            <img
              src="/images/silk-model.png" 
              alt="Silk Press Model"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Description Text & Button */}
          <div
            className={`absolute top-[20%] right-[8%] w-[45%] flex flex-col gap-6 transition-all duration-500 ease-in-out ${
              activeCard === "silk"
                ? "opacity-100 translate-x-0 delay-200"
                : "opacity-0 translate-x-10 pointer-events-none"
            }`}
          >
            <p className="text-white/90 text-[15px] leading-loose font-light">
              Experience the ultimate sleek and shiny look with our premium Silk Press service. Perfect for natural hair, giving you that flawless straight finish.
            </p>
            
            <button className="flex items-center gap-3 text-white w-max mt-2 hover:opacity-80 transition">
              <span className="flex items-center justify-center w-8 h-8 border border-white rounded-full text-xs">
                →
              </span>
              <span className="font-semibold text-sm tracking-widest">Learn More</span>
            </button>
          </div>

          {/* Titles Overlay (Silk Press) */}
          <div
            className={`absolute transition-all duration-700 ease-in-out ${
              activeCard === "silk"
                ? "bottom-12 right-12 text-right"
                : "bottom-8 left-1/2 -translate-x-1/2 text-center"
            }`}
          >
            <h4 className="text-white text-[70px] leading-[0.5]" style={{ fontFamily: 'Brush Script MT, cursive' }}>
              Silk
            </h4>
            <h5 className="text-white text-[35px] font-serif tracking-wide mt-2">
              Press
            </h5>
          </div>
        </div>

      </div>
    </section>
  );
}