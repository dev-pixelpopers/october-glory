"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);
export default function PerfectSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const ogRef = useRef<HTMLDivElement>(null);
  const heading1Ref = useRef<HTMLHeadingElement>(null);
  const heading2Ref = useRef<HTMLHeadingElement>(null);
  const heading3Ref = useRef<HTMLHeadingElement>(null);
  const heading4Ref = useRef<HTMLParagraphElement>(null);
  const heading5Ref = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useGSAP(() => {
    gsap.set(imageRef.current, { yPercent: 150, duration: 0.5 })
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    })

    tl.to(ogRef.current, {
      xPercent: 59,
      duration: 1
    })
      .to(imageRef.current, {
        yPercent: 0,
        duration: 1
      }, "<")
      .to(heading1Ref.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1
      })
      .to(heading2Ref.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1
      }, "<")
      .to(heading3Ref.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1
      }, "<")
      .to(heading4Ref.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1
      }, "<")
      .to(heading5Ref.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1
      }, "<")
      .to(buttonRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1
      }, "<")
  })


  return (
    <section ref={containerRef} className=" min-h-[300dvh] relative">
      <div className="flex flex-col bg-[#1B1B1B] py-[clamp(20px,15.15px_+_1.294vw,40px)] px-[clamp(32px,15.5px_+_4.401vw,100px)] sticky top-0 h-dvh overflow-hidden">
        <div ref={ogRef} className="absolute inset-0 flex justify-between overflow-hidden pointer-events-none">
          <div className="valturin text-[65vw] leading-[0.75] text-white absolute top-[17%] left-[-0vw]">
            O
          </div>

          <div className="valturin text-[65vw] leading-[0.75] text-white absolute top-[17%] right-[0vw]">
            G
          </div>
        </div>
        <div className="flex gap-10 items-center">
          {/* Left column */}
          <div className="w-[40%] flex flex-col gap-10">
            <div className="w-full text-trd -mt-[clamp(51px,24.54px_+_7.055vw,160px)] ml-[8px]">
              <h3 ref={heading1Ref} className=" w-[900px] text-[12vw] leading-[1] valturin capitalize mb-[clamp(25px,18.93px_+_1.618vw,50px)] opacity-22"
                style={{
                  clipPath: "inset(0% 100% 0% 0%)",
                  backgroundImage: "linear-gradient(180deg, #000 13%, #FFF 100%)",
                  backgroundClip: "text",
                  color: "transparent"
                }}>
                october
              </h3>
            </div>
            <div className="relative w-full flex flex-col gap-0">
              <h2 ref={heading2Ref} className="text-white text-[length:clamp(26px,17.5px_+_2.265vw,61px)] valturin text-gold capitalize"
                style={{
                  clipPath: "inset(0% 100% 0% 0%)"
                }}>
                Find the wig that
              </h2>
              <h2 ref={heading3Ref} className="text-[length:clamp(29px,16.38px_+_3.366vw,81px)] andrea text-white capitalize"
                style={{
                  clipPath: "inset(0% 100% 0% 0%)"
                }}>
                perfectly matches
              </h2>
              <h2 ref={heading4Ref} className="text-gold text-[length:clamp(26px,17.5px_+_2.265vw,61px)] valturin capitalize"
                style={{
                  clipPath: "inset(0% 100% 0% 0%)"
                }}>
                your beauty.
              </h2>
            </div>

            <button ref={buttonRef} className="flex items-center gap-4 group w-max"
              style={{
                clipPath: "inset(0% 100% 0% 0%)"
              }}>
              <div className="w-15 h-15 rounded-full border border-gray-400 flex items-center justify-center transition-colors duration-300 group-hover:bg-white group-hover:text-black text-gray-300">
                {/* SVG Arrow */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </div>
              <span className="text-white gotham text-[length:clamp(17px,16.27px_+_0.194vw,20px)] group-hover:text-white transition-colors duration-300">
                Shop Now
              </span>
            </button>
          </div>

          {/* right column  */}
          <div className="w-[60%] relative flex items-center justify-left pt-[clamp(32px,15.5px_+_4.401vw,100px)] ">
            <div className="w-[64%] h-full required z-1 -ml-[clamp(13px,11.3px_+_0.453vw,20px)]">
              <img
                ref={imageRef}
                src="/images/perfect-image.png"
                alt="Woman getting hair done"
                className="w-full h-full object-cover object-top"
              />
            </div>
            <div className="w-full text-trd text-right absolute bottom-[10%] right-[-10%]">
              <h3 ref={heading5Ref} className="text-[12vw] leading-[1] valturin capitalize opacity-22"
                style={{
                  clipPath: "inset(0% 100% 0% 0%)",
                  backgroundImage: "linear-gradient(180deg, #000 13%, #FFF 100%)",
                  backgroundClip: "text",
                  color: "transparent"
                }}>
                Glory
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
