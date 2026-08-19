"use client";
import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

export default function WelcomeSection() {
  const containerRef = useRef(null);
  const ogRef = useRef(null);
  const oRef = useRef(null);
  const gRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const imageRef = useRef(null);
  const descriptionRef = useRef(null);
  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "bottom bottom",
        scrub: 1,
      },
    });

    tl.to(ogRef.current, {
      rotate: 0,
      duration: 1,
    }).to(oRef.current, {
      left: "0vw",
      duration: 1,
    }).to(gRef.current, {
      right: "0vw",
      duration: 1,
    }, "<");
    tl.to(imageRef.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1,
    }).to(title1Ref.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1,
    }).to(title2Ref.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1,
    }, "<").to(descriptionRef.current, {
      clipPath: "inset(0% 0% 0% 0%)",
      duration: 1,
    }, "<")
  }, { scope: containerRef });
  return (
    <section ref={containerRef} className="welcome-wrapper bg-[#1B1B1B] relative min-h-[300vh]">
      <div className="w-full sticky top-0 flex flex-col justify-center items-center h-screen overflow-hidden px-[100px]">
        <div ref={ogRef} className="absolute inset-0 flex justify-center pointer-events-none z-0 rotate-[180deg]">
          <div ref={oRef} className="valturin text-[64vw] leading-[1] text-white absolute rotate-[6deg]"> {/*  left-[-0vw]*/}
            O
          </div>
          <div ref={gRef} className="valturin text-[64vw] leading-[1] text-[#3C3C3C] absolute"> {/*  right-[-2vw]*/}
            G
          </div>
        </div>

        <div className="flex items-center relative z-2">
          {/* Left Column - Titles */}
          <div className="w-[33.5%]">
            <div>
              <h2 ref={title1Ref} className="andrea text-[90px] leading-[150px] text-white ml-[70px]" style={{
                clipPath: "inset(0% 100% 0% 0%)"
              }}>Welcome</h2>
              <h1 ref={title2Ref} className="valturin text-gold text-[120px] leading-[1] ml-[224px] relative z-2 w-[500px]" style={{
                clipPath: "inset(0% 100% 0% 0%)"
              }}>
                October
                <br />
                Glory
              </h1>
            </div>
          </div>

          <div className="w-[33%]">
            <div className="image-card">
              <img
                ref={imageRef}
                src="/images/about-img.png"
                alt="Model"
                className="w-full h-full"
                style={{
                  clipPath: "inset(100% 0% 0% 0%)"
                }}
              />
            </div>
          </div>

          {/* Right Column - Description & Link */}
          <div ref={descriptionRef} className="w-[33.5%] px-[31px] flex flex-col gap-10 items-start" style={{
            clipPath: "inset(0% 100% 0% 0%)"
          }}>
            <p className="gotham text-white text-[20px] leading-[40px] capitalize font-light">
              {/* <strong>October Glory</strong> Salon Is A Luxury Hair Salon Located
              In Brooklyn, Founded By The Talented Hair Artist{" "}
              <strong>Jhavuanna Paterson</strong>. We Specialize In Precision Hair
              Cutting, Expert Styling, Detailed Highlighting, And Customized Hair
              Services Designed To Elevate Your Look And Confidence. Our Mission
              Is To Provide Every Guest With A Refined, Personalized Salon
              Experience That Exceeds Expectations */}
              Finding the right stylist means finding someone who understands your hair, your lifestyle, and your goals. At October Glory, we believe every appointment should leave you feeling confident, cared for, and empowered.
              Located in the heart of Brooklyn, our salon provides a welcoming environment where luxury meets expertise. Whether you're maintaining healthy natural hair, booking a signature silk press, refreshing your color, investing in custom wigs in Brooklyn, or treating your scalp to professional care, every service is personalized to your unique hair journey.

            </p>

            <a href="/contact" className="book-btn flex gap-[10px] items-center text-white rounded-4xl py-[4px] pl-[5px] pr-[25px] justify-center text-[18px] gotham">
              <span className="btn-icon rotate-305">
                <img src="/images/btn-arrow.svg" width="53px" height="53px" />
              </span>
              <span className="underline">Start with a Consultation</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
