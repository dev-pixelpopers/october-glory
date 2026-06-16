"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [hidden, setHidden] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const progressBoxRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  // Drive the progress counter: it eases toward 90% on its own and only
  // completes once the window has actually finished loading.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const markLoaded = () => {
      loadedRef.current = true;
    };
    if (document.readyState === "complete") {
      loadedRef.current = true;
    } else {
      window.addEventListener("load", markLoaded);
    }

    const start = Date.now();
    const minDuration = 1600; // keep the intro on screen long enough to read
    let raf = 0;

    const tick = () => {
      const elapsed = Date.now() - start;
      setProgress((p) => {
        const cap = loadedRef.current && elapsed > minDuration ? 100 : 90;
        if (p >= cap) return p;
        const next = p + Math.max(0.4, (cap - p) * 0.05);
        return Math.min(next, cap);
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", markLoaded);
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  // Entrance animation for the logo / tagline / progress bar.
  // The elements render hidden (see inline styles below) so there is no
  // flash of fully-rendered content before the animation kicks in.
  useGSAP(
    () => {
      gsap
        .timeline()
        .to(logoRef.current, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
        })
        .to(
          taglineRef.current,
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.55"
        )
        .to(
          progressBoxRef.current,
          { opacity: 1, duration: 0.6, ease: "power2.out" },
          "-=0.4"
        );
    },
    { scope: rootRef }
  );

  // Exit animation once we hit 100%.
  useEffect(() => {
    if (progress < 100) return;
    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "";
        setHidden(true);
      },
    });
    tl.to(contentRef.current, {
      opacity: 0,
      y: -24,
      duration: 0.5,
      ease: "power2.in",
    })
      // Signal the rest of the page (e.g. HeroSection) that the preloader is
      // leaving, so their intro animations can start as the curtain lifts.
      .add(() => {
        (window as Window & { __preloaderDone?: boolean }).__preloaderDone =
          true;
        window.dispatchEvent(new Event("preloader:done"));
      })
      .to(
        rootRef.current,
        { yPercent: -100, duration: 1.05, ease: "power4.inOut" },
        "-=0.1"
      );
  }, [progress]);

  if (hidden) return null;

  const rounded = Math.round(progress);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[100000] flex h-full w-full flex-col items-center justify-center overflow-hidden bg-[#1B1B1B]"
    >
      {/* Soft gold glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 45%, rgba(204,184,132,0.16), rgba(27,27,27,0) 60%)",
        }}
      />

      {/* Faint brand echo behind the logo */}
      <span className="andrea pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap text-[18vw] leading-none text-[#ccb884] opacity-[0.04] select-none">
        October Glory
      </span>

      <div
        ref={contentRef}
        className="relative flex flex-col items-center justify-center px-6"
      >
        <img
          ref={logoRef}
          src="/images/logo.svg"
          alt="October Glory"
          className="w-[260px] max-w-[70vw] object-contain brightness-0 invert"
          style={{ opacity: 0, transform: "translateY(24px) scale(0.94)" }}
        />

        <p
          ref={taglineRef}
          className="gotham mt-6 text-[12px] uppercase tracking-[0.55em] text-[#ccb884] sm:text-[13px]"
          style={{ opacity: 0, transform: "translateY(14px)" }}
        >
          Luxury Experience
        </p>

        {/* Progress */}
        <div
          ref={progressBoxRef}
          className="mt-12 flex w-[240px] max-w-[70vw] flex-col items-center"
          style={{ opacity: 0 }}
        >
          <div className="relative h-[2px] w-full overflow-hidden rounded-full bg-white/15">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-[#ccb884]"
              style={{
                width: `${progress}%`,
                transition: "width 0.2s ease-out",
              }}
            />
          </div>
          <span className="gotham mt-4 text-[13px] tracking-[0.3em] text-white/70">
            {rounded.toString().padStart(2, "0")}%
          </span>
        </div>
      </div>
    </div>
  );
}
