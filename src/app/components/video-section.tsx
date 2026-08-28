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
  // Paragraph shown with the FIRST set of videos; exits with them.
  const content1Ref = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // We pass { scope: containerRef } to safely select class names locally
  useGSAP(() => {
    // 1. Initial Setup
    gsap.set([content1Ref.current, contentRef.current], {
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
    //
    // Length of the pause each set gets once it has fully arrived, in the same
    // units as the durations below. Because the timeline is scrubbed, this is
    // scroll distance where nothing moves. Nudge it up for a longer beat.
    const HOLD = 0.25;

    tl.to(heading1Ref.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1,
    })
      .to(heading2Ref.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1,
      })
      // First paragraph arrives while set 1 is still on screen
      .to(content1Ref.current, {
        yPercent: 0,
        opacity: 1,
        duration: 1,
      })
      // First set goes up and fades out. The "+=" offset is a teeny hold: a
      // sliver of scroll where set 1 and its paragraph just sit there, fully
      // arrived, before anything moves again.
      .to('.video-set-1', {
        yPercent: -106,
        opacity: 1,
        duration: 1.5,
      }, `+=${HOLD}`)
      // "<" starts this at the same moment as the tween above, and the matching
      // duration keeps them locked together, so the paragraph leaves with its
      // videos rather than trailing them.
      .to(content1Ref.current, {
        yPercent: -100,
        opacity: 0,
        duration: 1.5,
      }, "<")
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
      })
      // The matching hold for set 2 — an empty tween, so the finished
      // composition gets the same beat before the section releases.
      .to({}, { duration: HOLD });
  }, { scope: containerRef }); // Scope ensures '.video-set-1' only targets elements in this component

  return (
    <section
      ref={containerRef}
      // Increased min-height to 400dvh to give the longer timeline enough scroll room
      className="relative w-full min-h-[400dvh]"
    >
      <div
        className="vid-main w-full sticky top-0 flex flex-col gap-[clamp(32px,15.49px_+_4.402vw,100px)] items-center justify-center overflow-hidden py-[clamp(58px,28.39px_+_7.897vw,180px)] px-[clamp(51px,24.54px_+_7.056vw,160px)] bg-no-repeat bg-center bg-cover h-dvh"
        style={{ backgroundImage: "url('/images/video-bg.png')" }}
      >
        <div className="vid-head max-w-[47vw] m-auto w-full flex flex-col gap-0 z-10">
          <div className="flex flex-col">
            <h2 ref={heading1Ref} className="vid-hd-pri andrea text-[length:clamp(32px,17.92px_+_3.754vw,90px)] leading-[clamp(53px,29.46px_+_6.278vw,150px)] text-black text-left"
              style={{ clipPath: "inset(0% 100% 0% 0%)" }}>
              The October
            </h2>
            <h2 ref={heading2Ref} className="vid-hd-sec valturin text-[length:clamp(29px,19.53px_+_2.524vw,68px)] text-gold text-right -mt-[clamp(13px,11.3px_+_0.454vw,20px)]"
              style={{ clipPath: "inset(100% 0% 0% 0%)" }}>
              Glory Experience
            </h2>
          </div>
        </div>

        <div className="vid-parent flex gap-[clamp(24px,18.17px_+_1.554vw,48px)] w-full">
          {/* Column 1 */}
          <div className="w-[20%] vid-div-1">
            {/* video-div-1 */}
            <div className="relative aspect-[142/251] -mt-[16.667vw] -rotate-4 overflow-hidden">
              <video
                src="/images/video-8.webm"
                autoPlay loop muted playsInline
                className="video-set-1 absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl"
              />
              <video
                src="/images/vid-2-1.webm" // Swap with your actual 2nd set video
                autoPlay loop muted playsInline
                className="video-set-2 absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>

          {/* Column 2 */}
          <div className="vid-div-2 w-[14%]">
            {/* video-div-2 */}
            <div className="relative aspect-[199/370] mt-[clamp(13px,11.3px_+_0.454vw,20px)] -rotate-4 overflow-hidden">
              <video
                src="/images/video-2.mp4"
                autoPlay loop muted playsInline
                className="video-set-1 absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl"
              />
              <video
                src="/images/vid-2-2.webm" // Swap with your actual 2nd set video
                autoPlay loop muted playsInline
                className="video-set-2 absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>

          {/* Column 3 (Content) */}
          <div className="content-col w-[30%]">
            {/* Both paragraphs occupy the same grid cell, so the wrapper is as
                tall as the taller one and neither needs absolute positioning.
                Equal heights also mean the yPercent travel matches exactly. */}
            <div className="overflow-hidden grid">

              {/* FIRST-SET paragraph — search "Signature Hair Cutting" to edit. */}
              <div ref={content1Ref} className="col-start-1 row-start-1 flex flex-col gap-[clamp(20px,15.14px_+_1.295vw,40px)] items-center justify-center">
                <p className="text-black text-[length:clamp(16px,15.03px_+_0.259vw,20px)] leading-[clamp(34px,32.54px_+_0.388vw,40px)] gotham text-center capitalize">
                  We craft each wig specifically to your individual specifications, so every piece you receive remains one of a kind.
                </p>
                <button className="flex items-center gap-[clamp(10px,8.54px_+_0.389vw,16px)] group cursor-pointer">
                  <div className="w-[clamp(44px,43.03px_+_0.259vw,48px)] h-[clamp(44px,43.03px_+_0.259vw,48px)] flex items-center justify-center rounded-full border border-black group-hover:bg-black group-hover:border-black transition-all duration-300">
                    <svg
                      className="w-[clamp(18px,17.51px_+_0.13vw,20px)] h-[clamp(18px,17.51px_+_0.13vw,20px)] text-gray-600 group-hover:text-white transition-colors"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  <span className="gotham text-black text-[length:clamp(17px,16.27px_+_0.194vw,20px)] font-semibold">
                    Learn More
                  </span>
                </button>
              </div>

              {/* SECOND-SET paragraph — search "Precision Hair Cutting" to edit. */}
              <div ref={contentRef} className="col-start-1 row-start-1 flex flex-col gap-[clamp(20px,15.14px_+_1.295vw,40px)] items-center justify-center">
                <p className="text-black text-[length:clamp(16px,15.03px_+_0.259vw,20px)] leading-[clamp(34px,32.54px_+_0.388vw,40px)] gotham text-center capitalize">
                  We Offer Premium Silk Presses, Protective Twists, Custom Extensions, And Dedicated Care Services Designed To Keep Your Natural Hair Looking Healthy.
                </p>
                <button className="flex items-center gap-[clamp(10px,8.54px_+_0.389vw,16px)] group cursor-pointer">
                  <div className="w-[clamp(44px,43.03px_+_0.259vw,48px)] h-[clamp(44px,43.03px_+_0.259vw,48px)] flex items-center justify-center rounded-full border border-black group-hover:bg-black group-hover:border-black transition-all duration-300">
                    <svg
                      className="w-[clamp(18px,17.51px_+_0.13vw,20px)] h-[clamp(18px,17.51px_+_0.13vw,20px)] text-gray-600 group-hover:text-white transition-colors"
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </div>
                  <span className="gotham text-black text-[length:clamp(17px,16.27px_+_0.194vw,20px)] font-semibold">
                    Learn More
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Column 4 */}
          <div className="vid-div-3 w-[14%]">
            {/* vid-div-3 */}
            <div className=" relative aspect-[199/370] mt-0 rotate-4 overflow-hidden">
              <video
                src="/images/video-5.webm"
                autoPlay loop muted playsInline
                className="video-set-1 absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl"
              />
              <video
                src="/images/vid-2-3.webm" // Swap with your actual 2nd set video
                autoPlay loop muted playsInline
                className="video-set-2 absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>

          {/* Column 5 */}
          <div className="vid-div-4 w-[20%]">
            {/* vid-div-4 */}
            <div className="relative aspect-[142/251] -mt-[15.625vw] rotate-[5deg] overflow-hidden">
              <video
                src="/images/video-7.webm"
                autoPlay loop muted playsInline
                className="video-set-1 absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl"
              />
              <video
                src="/images/vid-2-4.webm" // Swap with your actual 2nd set video
                autoPlay loop muted playsInline
                className="video-set-2 absolute inset-0 w-full h-full object-cover rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}