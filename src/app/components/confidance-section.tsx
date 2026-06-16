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
    <section ref={containerRef} className="bg-white min-h-[300vh] relative">
      <div className="sticky top-0 h-screen pt-[30px] pr-[30px] ">
        <div className="flex flex-col md:flex-row items-stretch w-full overflow-hidden">
          <div className="w-[45%] flex-shrink-0 relative z-2">
            <div className="w-[100%] min-w-[1100px] h-full absolute bottom-0 left-0">
              <img ref={imageRef}
                src="/images/confidance-image.png"
                alt="Woman getting hair done"
                className="w-full h-full object-cover object-top"
                style={{
                  clipPath: "inset(100% 0% 0% 0%)"
                }}
              />
            </div>
          </div>

          <div ref={rightBoxRef}
            className="w-[55%] px-10 py-[40px] h-[90vh] flex flex-col justify-center rounded-[20px] m-[40px]"
            style={{
              backgroundImage: "linear-gradient(270deg, #9C6D51 0%, #000 100%)",
              clipPath: "inset(50% 0% 0% 0%)"
            }}
          >
            {/* Headings */}
            <div>
              <h2 ref={heading1Ref} className="text-white text-[88px] andrea"
                style={{
                  clipPath: "inset(0% 100% 0% 0%)"
                }}>The Story</h2>
            </div>
            <div className="pl-[140px]">
              <div className="mb-[40px]">
                <h3 ref={heading2Ref} className="text-[#c1a073] text-[66px] valturin " style={{
                  clipPath: "inset(0% 100% 0% 0%)"
                }}>
                  A Confidence Journey
                </h3>
              </div>

              {/* Paragraph */}
              <div className="text-gray-200 text-[22px] leading-[48px] gotham">
                <p ref={paragraphRef} className="mb-[50px] pr-[60px]"
                  style={{
                    clipPath: "inset(0% 100% 0% 0%)"
                  }}>
                  Jhavuanna Paterson Is An Artist, Scientist, And Engineer Wrapped
                  Into A Neat Convenient Package. A Native Of Oakland, California
                  And Known For Her Blessed Hands, Jhavuanna Always Knew That She
                  Would Be A Driving Force In The Hair And Make-Up Industries.
                </p>
              </div>

              {/* CTA Button */}
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
                <span className="text-white gotham text-[20px] group-hover:text-white transition-colors duration-300">
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
