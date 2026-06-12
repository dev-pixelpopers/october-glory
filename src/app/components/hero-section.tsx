"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const headingTrackRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);
  useGSAP(() => {
    const tl = gsap.timeline();
    tl.to(imageRef.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1,
    })
      .to(headingTrackRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1,
      })
      .to(buttonRef.current, {
        opacity: 1,
        duration: 1,
      })
  });
  return (
    <section
      className="hero-wrapper pt-[210px] pb-[30px] h-screen items-end"
      style={{
        backgroundImage: "url('/images/hero-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="background-marquee">
        <div className="marquee-track">
          <span className="marquee-text text-center valturin text-[296.648px] leading-[296.648px] text-black">
            Glory October Glory October Glory October
          </span>
          <span className="marquee-text text-center valturin text-[296.648px] leading-[296.648px] text-black">
            Glory October Glory October Glory October
          </span>
          <span className="marquee-text text-center valturin text-[296.648px] leading-[296.648px] text-black">
            Glory October Glory October Glory October
          </span>
        </div>
      </div>

      <div className="foreground-container">
        <div className="hero-image-box absolute left-0 bottom-[-100px]">
          <img ref={imageRef} src="/images/hero-girls.png" alt="Glory October Team" style={{
            clipPath: "inset(100% 0% 0% 0%)",
            transition: "clip-path 1s ease-in-out"
          }} />
        </div>

        <div className="text-content text-center flex justify-center items-center flex-col relative mt-[90px]">
          <div className="w-full flex flex-col justify-center items-center" ref={headingTrackRef}
            style={{
              clipPath: "inset(0% 100% 0% 0%)",
              transition: "clip-path 1s ease-in-out"
            }}>
            <h1 className="cursive-heading text-center andrea text-[121.771px] text-black mb-[-25px]">More Than</h1>
            <h2 className="valturin text-center text-[73.063px] text-black">a Salon Luxury Experience</h2>
          </div>

          <button ref={buttonRef} className="book-btn flex mt-[20px] gap-[10px] items-center border-black border-1 text-black rounded-4xl py-[4px] pl-[5px] pr-[25px] justify-center text-[18px] gotham opacity-0">
            <span className="btn-icon"><img src="/images/btn-arrow.svg" width="43px" height="43px" /></span>
            Book Your Visit
          </button>
        </div>
      </div>
    </section>
  );
}
