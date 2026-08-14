"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function NaturalStylesHero() {
  const headingRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(
      headingRef.current,
      { y: 60, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
      { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2 }
    )
      .fromTo(
        dividerRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.4"
      );
  });

  return (
    <section
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage:
          "linear-gradient(180deg, rgba(27,27,27,0.6) 0%, rgba(27,27,27,0.85) 100%), url('/images/servicce.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Subtle animated grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

      {/* Decorative gold corner accents */}
      {/* <div className="absolute top-[160px] left-[80px] w-[80px] h-[80px] border-t-2 border-l-2 border-[#ccb884]/40" /> */}
      {/* <div className="absolute bottom-[80px] right-[80px] w-[80px] h-[80px] border-b-2 border-r-2 border-[#ccb884]/40" /> */}

      <div className="relative z-10 text-center flex flex-col items-center px-6">
        <div ref={headingRef}>
          <h1 className="andrea text-[80px] leading-[2] text-white mb-0 tracking-wide">
            Natural
          </h1>
          <h2 className="valturin text-[80px] text-[#ccb884] mt-[-10px] tracking-widest">
            Styles
          </h2>
        </div>

        {/* Gold divider */}
        <div
          ref={dividerRef}
          className="w-[120px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent my-8 origin-center"
        />

        <p
          ref={subtitleRef}
          className="gotham text-white/70 text-[20px] leading-[36px] max-w-[600px] font-light"
        >
          Embrace the beauty of your natural texture with our expertly crafted
          styling services — designed to celebrate, protect, and elevate every
          curl and coil.
        </p>
      </div>
    </section>
  );
}
