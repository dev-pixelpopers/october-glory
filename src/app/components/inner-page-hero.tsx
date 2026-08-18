"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export type InnerPageHeroProps = {
  /** The first line, in the Andrea script face. */
  title: string;
  /** The second line, in gold Valturin. Rendered inside the same `h1`. */
  subtitle?: string;
  /** Supporting line under the gold divider. */
  description?: string;
  /** Background photo. */
  image?: string;
  /**
   * Anything to sit below the divider instead of, or alongside, the
   * description — Shop uses this for its booking button.
   */
  children?: React.ReactNode;
};

const DEFAULT_IMAGE = "/images/servicce.png";

/**
 * The full-height banner at the top of every inner page.
 *
 * Both lines live inside a single `h1`, with the second as a `span`, so each
 * page has exactly one top-level heading — an `h2` here would compete with the
 * real section headings further down the page.
 */
export default function InnerPageHero({
  title,
  subtitle,
  description,
  image = DEFAULT_IMAGE,
  children,
}: InnerPageHeroProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      headingRef.current,
      { y: 60, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
      { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2 }
    ).fromTo(
      dividerRef.current,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.8 },
      "-=0.5"
    );

    // Pages without a description or children have nothing left to reveal.
    if (bodyRef.current) {
      tl.fromTo(
        bodyRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.4"
      );
    }
  });

  return (
    <section
      className="relative w-full h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(27,27,27,0.6) 0%, rgba(27,27,27,0.85) 100%), url('${image}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Subtle grain overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

      <div className="relative z-10 text-center flex flex-col items-center px-6">
        <h1
          ref={headingRef}
          className="andrea text-[80px] leading-[2] text-white mb-0 tracking-wide flex flex-col"
        >
          {title}
          {subtitle && (
            <span className="valturin text-[80px] text-[#ccb884] mt-[-10px] tracking-widest">
              {subtitle}
            </span>
          )}
        </h1>

        {/* Gold divider */}
        <div
          ref={dividerRef}
          className="w-[120px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent my-8 origin-center"
        />

        {(description || children) && (
          <div ref={bodyRef} className="flex flex-col items-center">
            {description && (
              <p className="gotham text-white/70 text-[20px] leading-[36px] max-w-[600px] font-light">
                {description}
              </p>
            )}
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
