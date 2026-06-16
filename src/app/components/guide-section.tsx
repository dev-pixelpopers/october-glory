"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
export default function GuidebookSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heading1Ref = useRef<HTMLDivElement>(null);
  const heading2Ref = useRef<HTMLDivElement>(null);
  const ParaRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      }
    })

    tl.to(heading1Ref.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1
    })
      .to(heading2Ref.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1
      }, "<")
      .to(ParaRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1
      }, "<")
      .to(buttonRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1
      }, "<")
  })
  return (
    <section ref={containerRef} className="bg-[#1a1a1a] relative min-h-[200vh]">
      <div className="w-full flex flex-col md:flex-row items-center sticky top-0 h-screen justify-center items-center">
        <div className="w-[55%] flex justify-center items-center bg-white rounded-3xl p-4 md:p-0 shadow-lg">
          <img
            src="/images/guide-image.png"
            alt="Tablet showing The Ultimate Buying Guide"
            className="w-full object-contain"
          />
        </div>

        <div
          className="w-[50%] px-10 py-[40px] h-[80vh] flex flex-col justify-center rounded-[20px] -ml-[100px]"
          style={{
            backgroundImage: "linear-gradient(270deg, #93674D 0%, #2D2018 100%)",
          }}
        >
          <div ref={heading1Ref} style={{
            clipPath: "inset(0% 100% 0% 0%)"
          }}>
            <h2 className="text-white text-[88px] leading-[150px] andrea capitalize">Your Guide to</h2>
          </div>
          <div className="pl-[130px]">
            <div ref={heading2Ref} className="mb-[30px]" style={{
              clipPath: "inset(0% 100% 0% 0%)"
            }}>
              <h3 className="text-[#c1a073] text-[66px] valturin capitalize">
                the Perfect Choice
              </h3>
            </div>
          </div>
          <div ref={ParaRef} className="text-gray-200 text-[22px] leading-[48px] gotham"
            style={{
              clipPath: "inset(0% 100% 0% 0%)"
            }}>
            <p className="mb-[50px] pr-[40px]">
              Not sure which service, treatment, or product is right for you?
              Our carefully crafted guidebook is designed to help you
              confidently choose the perfect option based on your hair goals,
              lifestyle, and beauty needs.
            </p>
          </div>
          <button ref={buttonRef} className="flex items-center gap-4 group w-max" style={{
            clipPath: "inset(0% 100% 0% 0%)"
          }}>
            <div className="w-15 h-15 rounded-full border border-gray-400 flex items-center justify-center transition-colors duration-300 group-hover:bg-white group-hover:text-black text-gray-300">
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
              Get Instant Access
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
