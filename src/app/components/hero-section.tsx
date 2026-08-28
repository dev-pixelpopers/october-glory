"use client";
import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);

export default function HeroSection() {
  const headingTrackRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);
  useGSAP(() => {
    // Build the intro paused — it should only play once the preloader has
    // finished and lifted away (see preloader.tsx, "preloader:done" event).
    const tl = gsap.timeline({ paused: true });
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
      });

    // If the preloader already finished before this mounted (e.g. on
    // client-side navigation back to the home page), play right away.
    if ((window as Window & { __preloaderDone?: boolean }).__preloaderDone) {
      tl.play();
      return;
    }

    const play = () => tl.play();
    window.addEventListener("preloader:done", play, { once: true });
    return () => window.removeEventListener("preloader:done", play);
  });
  return (
    <section
      className="hero-wrapper pt-[clamp(59px,22.35px_+_9.774vw,210px)] pb-[clamp(20px,17.57px_+_0.648vw,30px)] h-dvh items-end"
      style={{
        backgroundImage: "url('/images/hero-bg.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="background-marquee">
        <div className="marquee-track">
          <span className="marquee-text text-center valturin text-[length:clamp(98px,49.78px_+_12.857vw,296.648px)] leading-[clamp(98px,49.78px_+_12.857vw,296.648px)] text-black">
            Glory October Glory October Glory October
          </span>
          <span className="marquee-text text-center valturin text-[length:clamp(98px,49.78px_+_12.857vw,296.648px)] leading-[clamp(98px,49.78px_+_12.857vw,296.648px)] text-black">
            Glory October Glory October Glory October
          </span>
          <span className="marquee-text text-center valturin text-[length:clamp(98px,49.78px_+_12.857vw,296.648px)] leading-[clamp(98px,49.78px_+_12.857vw,296.648px)] text-black">
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

        <div className="text-content text-center flex justify-center items-center flex-col relative mt-[1%]">
          <div className="w-full flex flex-col justify-center items-center" ref={headingTrackRef}
            style={{
              clipPath: "inset(0% 100% 0% 0%)",
              transition: "clip-path 1s ease-in-out"
            }}>
            <span className="cursive-heading text-center andrea text-[length:clamp(44px,25.12px_+_5.034vw,121.771px)] text-black -mb-[clamp(16px,13.82px_+_0.583vw,25px)]">Brooklyn<span className="text-[length:clamp(17px,9.48px_+_2.006vw,48px)] text-black leading-[0.3]">'</span>s</span>
            <h1 className="valturin text-center text-[length:clamp(26px,14.58px_+_3.046vw,73.063px)] text-black">Luxury Boutique Hair Salon</h1>
          </div>

          <Link href="/dashboard/book" ref={buttonRef} className="book-btn flex mt-[clamp(13px,11.3px_+_0.454vw,20px)] gap-[clamp(6px,5.03px_+_0.259vw,10px)] items-center border-black border-1 text-black rounded-4xl py-[clamp(3px,2.76px_+_0.065vw,4px)] pl-[clamp(3px,2.51px_+_0.13vw,5px)] pr-[clamp(16px,13.81px_+_0.583vw,25px)] justify-center text-[18px] gotham opacity-0">
            <span className="btn-icon"><img src="/images/btn-arrow.svg" width="43px" height="43px" /></span>
            Book Your Visit
          </Link>
        </div>
      </div>
    </section>
  );
}
