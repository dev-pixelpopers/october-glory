"use client";

import React, { useState } from "react";

// TypeScript ke liye Type define ki hai taakay state mein koi aur value na ja sakay
type ActiveCard = "wigs" | "silk";

export default function OfferSection() {
  // useState mein type pass ki hai
  const [activeCard, setActiveCard] = useState<ActiveCard>("wigs");

  return (
    <section
      className="relative w-full min-h-screen bg-[#151515] pt-[150px] pb-[100px] px-[110px] flex flex-col items-center overflow-hidden bg-center bg-cover bg-no-repeat"
      style={{ backgroundImage: "url('/images/servicce.png')" }}
    >
      {/* Background Dim Image Layer (Optional) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[url('/images/bg-faint.png')] bg-cover bg-center"></div>

      {/* Header Titles */}
      <div className="relative z-10 text-center mb-22">
        <h2 className="text-white andrea text-[88px]">What We Offer</h2>
        <h3 className="text-[#cda873] valturin text-[66px] mt-2">
          It's Your Time To Shine.
        </h3>
      </div>

      {/* Cards Container */}
      <div className="relative z-10 flex gap-6 w-full h-full">
        {/* =========================================
            CARD 1: WIGS EXTENSIONS 
        ========================================= */}
        <div
          onClick={() => setActiveCard("wigs")}
          className={`flex relative pt-[25px] pb-[0px] px-[40px] bg-gradient-to-b from-[#9C6D51] to-[#5F3A21] rounded-[30px] overflow-hidden cursor-pointer transition-all duration-700 ease-in-out flex ${
            activeCard === "wigs" ? "flex-[1.66]" : "flex-1"
          }`}
        >
          <div className="w-[53.9%]">
            {/* Model Image */}
            <div
              className={`relative transition-all duration-700 ease-in-out ${
                activeCard === "wigs"
                  ? "w-[100%]"
                  : "left-1/2 -translate-x-1/2 w-[80%]"
              }`}
            >
              <img
                src="/images/left-image.png"
                alt="Wigs Model"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col align-bottom justify-end gap-20 pb-[60px] w-[46.1%]">
            {/* Description Text & Button */}
            <div
              className={`flex flex-col gap-6 transition-all duration-500 ease-in-out ${
                activeCard === "wigs"
                  ? "opacity-100 translate-x-0 delay-200"
                  : "opacity-0 translate-x-10 pointer-events-none"
              }`}
            >
              <p className="text-white text-[20px] leading-[36px] font-light gotham">
                If You Want To Add Length, Thickness And Volume, Hair Extensions
                By Jhavuanna Will Be The Best You've Experienced In New York!
                Don't Forget About Our Wig Spa!
              </p>

              <button className="flex items-center gap-3 text-white w-max mt-2 hover:opacity-80 transition">
                <span className="flex items-center justify-center w-8 h-8 border border-white rounded-full w-[55px] h-[55px] text-[22px]">
                  →
                </span>
                <span className="gotham text-[20px]">Learn More</span>
              </button>
            </div>

            {/* Titles Overlay (Wigs Extensions) */}
            <div
              className={`relative transition-all duration-700 ease-in-out ${
                activeCard === "wigs"
                  ? "text-left"
                  : "-translate-x-1/2 text-left"
              }`}
            >
              <h4 className="text-white text-[88px] andrea">Wigs</h4>
              <h5 className="text-white text-[66px] leading-[60px] valturin ml-[67px] mt-[10px]">
                Extensions
              </h5>
            </div>
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
          <div className="w-[53.9%]">
            {/* Model Image */}
            <div
              className={`relative transition-all duration-700 ease-in-out ${
                activeCard === "wigs"
                  ? "w-[100%]"
                  : "left-1/2 -translate-x-1/2 w-[80%]"
              }`}
            >
              <img
                src="/images/silk-press.png"
                alt="Wigs Model"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col align-bottom justify-end gap-20 pb-[60px] w-[46.1%]">
            {/* Description Text & Button */}
            <div
              className={`flex flex-col gap-6 transition-all duration-500 ease-in-out ${
                activeCard === "wigs"
                  ? "opacity-100 translate-x-0 delay-200"
                  : "opacity-0 translate-x-10 pointer-events-none"
              }`}
            >
              <p className="text-white text-[20px] leading-[36px] font-light gotham">
                Your hair is cleansed and conditioned with our premier spa treatments. We will then “responsibly” press your tresses for a smooth, luxurious finish.
              </p>

              <button className="flex items-center gap-3 text-white w-max mt-2 hover:opacity-80 transition">
                <span className="flex items-center justify-center w-8 h-8 border border-white rounded-full w-[55px] h-[55px] text-[22px]">
                  →
                </span>
                <span className="gotham text-[20px]">Learn More</span>
              </button>
            </div>

            {/* Titles Overlay (Wigs Extensions) */}
            <div
              className={`relative transition-all duration-700 ease-in-out ${
                activeCard === "wigs"
                  ? "text-left"
                  : "-translate-x-1/2 text-left"
              }`}
            >
              <h4 className="text-white text-[88px] andrea">Silk</h4>
              <h5 className="text-white text-[66px] leading-[60px] valturin ml-[67px] mt-[10px]">
                Press
              </h5>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
