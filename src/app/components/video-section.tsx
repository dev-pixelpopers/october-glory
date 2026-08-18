"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function GloryExperience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heading1Ref = useRef<HTMLDivElement>(null);
  const heading2Ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // We pass { scope: containerRef } to safely select class names locally
  useGSAP(() => {
    // 1. Initial Setup
    gsap.set(contentRef.current, {
      yPercent: 100,
      opacity: 0, // Added opacity for a cleaner fade-in as it moves up
    });

    gsap.set('.video-set-2', {
      yPercent: 106,     // Start lower
      opacity: 1, // Hidden initially
    });

    // 2. Timeline Configuration
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    // 3. Animation Sequence
    tl.to(heading1Ref.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1,
    })
      .to(heading2Ref.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1,
      })
      // First set goes up and fades out
      .to('.video-set-1', {
        yPercent: -106,
        opacity: 1,
        duration: 1.5,
      })
      // Second set comes up and fades in (starts immediately after the previous finishes)
      .to('.video-set-2', {
        yPercent: 0,
        opacity: 1,
        duration: 1.5,
      })
      // Finally, text content slides up
      .to(contentRef.current, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
      });
  }, { scope: containerRef }); // Scope ensures '.video-set-1' only targets elements in this component

  return (
    <section
      ref={containerRef}
      // Increased min-height to 400vh to give the longer timeline enough scroll room
      className="relative w-full min-h-[400vh]"
    >
      <div
        className="w-full sticky top-0 flex flex-col gap-25 items-center justify-center overflow-hidden py-45 px-[160px] bg-no-repeat bg-center bg-cover h-screen"
        style={{ backgroundImage: "url('/images/video-bg.png')" }}
      >
        <div className="max-w-[900px] m-auto w-full flex flex-col gap-0 z-10">
          <div className="flex flex-col">
            <h2 ref={heading1Ref} className="andrea text-[90px] leading-[150px] text-black text-left"
              style={{ clipPath: "inset(0% 100% 0% 0%)" }}>
              The October
            </h2>
            <h1 ref={heading2Ref} className="valturin text-[68px] text-gold mt-2 text-right mt-[-20px]"
              style={{ clipPath: "inset(100% 0% 0% 0%)" }}>
              Glory Experience
            </h1>
          </div>
        </div>

        <div className="flex gap-12 w-full">
          {/* Column 1 */}
          <div className="w-[20%]">
            <div className="relative h-[502px] -mt-[320px] -rotate-4 overflow-hidden">
              <video
                src="/images/video-8.webm"
                autoPlay loop muted playsInline
                className="video-set-1 absolute inset-0 w-full h-[502px] object-cover rounded-2xl shadow-xl"
              />
              <video
                src="/images/video-4.mp4" // Swap with your actual 2nd set video
                autoPlay loop muted playsInline
                className="video-set-2 absolute inset-0 w-full h-[502px] object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="w-[14%]">
            <div className="relative h-[370px] mt-5 -rotate-4 overflow-hidden">
              <video
                src="/images/video-2.mp4"
                autoPlay loop muted playsInline
                className="video-set-1 absolute inset-0 w-full h-[370px] object-cover rounded-2xl shadow-xl"
              />
              <video
                src="/images/video-3.mp4" // Swap with your actual 2nd set video
                autoPlay loop muted playsInline
                className="video-set-2 absolute inset-0 w-full h-[370px] object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>

          {/* Column 3 (Content) */}
          <div className="w-[30%]">
            <div className="overflow-hidden">
              <div ref={contentRef} className="flex flex-col gap-10 items-center justify-center">
                <p className="text-black text-[20px] leading-[40px] gotham text-center">
                  We Specialize In Precision Hair Cutting, Expert Styling, Detailed
                  Highlighting, And Customized Hair Services Designed To Elevate Your
                  Look And Confidence.
                </p>
                <button className="flex items-center gap-4 group cursor-pointer">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full border border-black group-hover:bg-black group-hover:border-black transition-all duration-300">
                    <svg
                      className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  <span className="gotham text-black text-[20px] font-semibold">
                    Learn More
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 4 */}
          <div className="w-[14%]">
            <div className="relative h-[370px] mt-0 rotate-4 overflow-hidden">
              <video
                src="/images/video-5.webm"
                autoPlay loop muted playsInline
                className="video-set-1 absolute inset-0 w-full h-[370px] object-cover rounded-2xl shadow-xl"
              />
              <video
                src="/images/video-9.webm" // Swap with your actual 2nd set video
                autoPlay loop muted playsInline
                className="video-set-2 absolute inset-0 w-full h-[370px] object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>

          {/* Column 5 */}
          <div className="w-[20%]">
            <div className="relative h-[502px] -mt-[300px] rotate-[5deg] overflow-hidden">
              <video
                src="/images/video-7.webm"
                autoPlay loop muted playsInline
                className="video-set-1 absolute inset-0 w-full h-[502px] object-cover rounded-2xl shadow-xl"
              />
              <video
                src="/images/1-video.mp4" // Swap with your actual 2nd set video
                autoPlay loop muted playsInline
                className="video-set-2 absolute inset-0 w-full h-[502px] object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}