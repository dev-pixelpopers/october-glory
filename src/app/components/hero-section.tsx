import React from "react";

export default function HeroSection() {
  return (
    <section
      className="hero-wrapper pt-[210px] pb-[30px] h-screen items-end"
      style={{
        backgroundImage: "url('/images/hero-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Background Marquee Layer */}
      <div className="background-marquee">
        <div className="marquee-track">
          {/* Text ko duplicate kiya gaya hai taakay animation seamless lagay */}
          <span className="marquee-text text-center valturin text-[296.648px] leading-[296.648px] text-black">
            Glory October Glory October Glory October
          </span>
          <span className="marquee-text text-center valturin text-[296.648px] leading-[296.648px] text-black">
            Glory October Glory October Glory October
          </span>
        </div>
      </div>

      {/* Foreground Content Layer */}
      <div className="foreground-container">
        {/* Aapki Transparent Image Yahan Ayegi */}
        <div className="hero-image-box absolute left-0 bottom-[-100px]">
          {/* src mein apni image ka path lagayein */}
          <img src="/images/hero-girls.png" alt="Glory October Team" />
        </div>

        {/* Text aur Button (Image ke oopar overlap karega) */}
        <div className="text-content text-center flex justify-center items-center flex-col relative mt-[140px]">
          <h1 className="cursive-heading text-center andrea text-[121.771px] text-black mb-[-25px]">More Than</h1>
          <h2 className="valturin text-center text-[73.063px] text-black">a Salon Luxury Experience</h2>

          <button className="book-btn flex mt-[20px] gap-[10px] items-center border-black border-1 text-black rounded-4xl py-[4px] pl-[5px] pr-[25px] justify-center text-[18px] gotham">
            <span className="btn-icon"><img src="/images/btn-arrow.svg" width="43px" height="43px"/></span>
            Book Your Visit
          </button>
        </div>
      </div>
    </section>
  );
}
