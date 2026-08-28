"use client";
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export default function ConfidenceJourneySection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const rightBoxRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const heading1Ref = useRef<HTMLHeadingElement>(null);
  const heading2Ref = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline(
      {
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      }
    )
    tl.to(imageRef.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 2,
    })
      .to(rightBoxRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 2,
      }, "<")
      .to(heading1Ref.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 2,
      })
      .to(heading2Ref.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 2,
      }, "<")
      .to(paragraphRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 2,
      }, "<")
      .to(buttonRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 2,
      }, "<")

  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="bg-white min-h-[300dvh] relative">
      
      {/* <div className="sticky top-0 h-dvh pt-[clamp(20px,17.57px_+_0.648vw,30px)] pr-[clamp(20px,17.57px_+_0.648vw,30px)] "> */}
      <div className="sticky top-0 h-dvh flex items-end] ">
        <div className="wom-des-main flex flex-col md:flex-row items-stretch w-full overflow-hidden">
          <div className="w-[45%] flex-shrink-0 relative z-2 wom-des-rig">
            <div className="wom-des-img w-[100%] min-w-[57vw] h-full absolute bottom-0 -left-20">
              <img ref={imageRef}
                src="/images/confidance-image.png"
                alt="Woman getting hair done"
                className="w-full h-full object-cover object-right wom-des-img"
                style={{
                  clipPath: "inset(100% 0% 0% 0%)"
                }}
              />
            </div>
          </div>

          <div ref={rightBoxRef}
            className="w-[55%] px-[clamp(20px,15.14px_+_1.295vw,40px)] py-[clamp(20px,15.15px_+_1.295vw,40px)] h-[90dvh] flex flex-col justify-center rounded-[20px] m-[clamp(20px,15.15px_+_1.295vw,40px)] wom-des-lef"
            style={{
              backgroundImage: "linear-gradient(270deg, #9C6D51 0%, #000 100%)",
              clipPath: "inset(50% 0% 0% 0%)"
            }}
          >
            {/* Headings */}
            <div className="women-des-pri">
              <span ref={heading1Ref} className="text-white text-[length:clamp(32px,21.66px_+_2.757vw,64px)] 2xl:text-[length:clamp(64px,6.25vw_-_32px,88px)] andrea"
                style={{
                  clipPath: "inset(0% 100% 0% 0%)"
                }}>Women Deserve</span>
            </div>
            <div className="pl-[clamp(45px,21.94px_+_6.149vw,140px)] wom-des-lef-inner">
              <div className="mb-[clamp(20px,15.15px_+_1.295vw,40px)] wom-des-lef-head">
                <h2 ref={heading2Ref} className="text-[#c1a073] text-[length:clamp(28px,21.54px_+_1.723vw,48px)] 2xl:text-[length:clamp(48px,4.688vw_-_24px,66px)] valturin " style={{
                  clipPath: "inset(0% 100% 0% 0%)"
                }}>
                  A Luxury Experience 
                </h2>
              </div>

              {/* Paragraph */}
              <div className="text-gray-200 text-[length:clamp(16px,15.03px_+_0.259vw,20px)] leading-[clamp(41px,39.3px_+_0.453vw,48px)] gotham">
                <p ref={paragraphRef} className="mb-[clamp(25px,18.93px_+_1.619vw,50px)] pr-[clamp(24px,15.26px_+_2.331vw,60px)]"
                  style={{
                    clipPath: "inset(0% 100% 0% 0%)"
                  }}>
                  October Glory was created to redefine the salon experience. We believe true luxury is personal attention, expert knowledge, healthy hair practices, and making you feel seen, valued, and confident. Proudly serving Brooklyn and surrounding New York communities, we provide professional hair care rooted in education and genuine connection to help you look and feel your absolute best.
                </p>
              </div>

              {/* CTA Button */}
              <button ref={buttonRef} className="flex items-center gap-[clamp(10px,8.54px_+_0.389vw,16px)] group w-max"
                style={{
                  clipPath: "inset(0% 100% 0% 0%)"
                }}>
                <div className="w-[clamp(44px,43.03px_+_0.259vw,48px)] h-[clamp(44px,43.03px_+_0.259vw,48px)] rounded-full border border-gray-400 flex items-center justify-center transition-colors duration-300 group-hover:bg-white group-hover:text-black text-gray-300">
                  {/* SVG Arrow */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-[clamp(18px,17.51px_+_0.13vw,20px)] h-[clamp(18px,17.51px_+_0.13vw,20px)]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                    />
                  </svg>
                </div>
                <span className="text-white gotham text-[length:clamp(17px,16.27px_+_0.194vw,20px)] group-hover:text-white transition-colors duration-300">
                  Get A Free Consultation
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
