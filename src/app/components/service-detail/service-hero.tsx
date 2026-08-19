"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import type { ServiceDetail } from "@/data/services/types";
import PriceTag from "./price-tag";

type Props = {
  service: ServiceDetail;
  /** Breadcrumb parent. Omit on a top-level service, which has none. */
  parent?: { slug: string; label: string };
};

export default function ServiceHero({ service, parent }: Props) {
  const crumbRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const dividerRef = useRef<HTMLDivElement>(null);
  const introRef = useRef<HTMLParagraphElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.fromTo(
      crumbRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6 }
    )
      .fromTo(
        headingRef.current,
        { y: 60, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
        { y: 0, opacity: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 1.2 },
        "-=0.3"
      )
      .fromTo(
        dividerRef.current,
        { scaleX: 0 },
        { scaleX: 1, duration: 0.8 },
        "-=0.5"
      )
      .fromTo(
        introRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8 },
        "-=0.4"
      )
      .fromTo(
        metaRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 },
        "-=0.5"
      );
  });

  return (
    <section
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(180deg, rgba(27,27,27,0.65) 0%, rgba(27,27,27,0.88) 100%), url('${service.hero.image}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Subtle grain overlay — same treatment as the category heroes */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iLjc1IiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjMwMCIgaGVpZ2h0PSIzMDAiIGZpbHRlcj0idXJsKCNhKSIgb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')]" />

      {/* Gold corner accents */}
      <div className="absolute top-[140px] left-[40px] md:left-[80px] w-[70px] h-[70px] border-t border-l border-[#ccb884]/30" />
      <div className="absolute bottom-[70px] right-[40px] md:right-[80px] w-[70px] h-[70px] border-b border-r border-[#ccb884]/30" />

      <div className="relative z-10 text-center flex flex-col items-center">
        {/* Breadcrumb — a top-level service shows only "Services". */}
        <div
          ref={crumbRef}
          className="gotham text-[12px] md:text-[13px] tracking-[4px] uppercase text-white/50 mb-10 flex items-center gap-3 flex-wrap justify-center"
        >
          <Link
            href="/services"
            className="hover:text-[#ccb884] transition-colors duration-300"
          >
            Services
          </Link>
          <span className="text-[#ccb884]/60">/</span>

          {parent && (
            <>
              <Link
                href={`/services/${parent.slug}`}
                className="hover:text-[#ccb884] transition-colors duration-300"
              >
                {parent.label}
              </Link>
              <span className="text-[#ccb884]/60">/</span>
            </>
          )}

          <span className="text-[#ccb884]">{service.cardTitle}</span>
        </div>

        <div ref={headingRef}>
          <h1 className="flex flex-col andrea text-[64px] md:text-[110px] leading-[1.4] md:leading-[1.5] text-white tracking-wide">
            {service.hero.display}
          
          <span className="valturin text-[42px] md:text-[72px] text-[#ccb884] mt-[-14px] tracking-widest">
            {service.hero.script}
          </span>
          </h1>
        </div>

        <div
          ref={dividerRef}
          className="w-[120px] h-[1px] bg-gradient-to-r from-transparent via-[#ccb884] to-transparent my-8 origin-center"
        />

        <p
          ref={introRef}
          className="gotham text-white/70 text-[17px] md:text-[20px] leading-[32px] md:leading-[36px] max-w-[620px] font-light"
        >
          {service.hero.intro}
        </p>

        <div
          ref={metaRef}
          className="mt-10 flex flex-col sm:flex-row items-center gap-6"
        >
          <div className="text-white">
            <PriceTag
              price={service.price}
              nonMemberPrice={service.nonMemberPrice}
              variant="block"
            />
          </div>

          <a
            href="/dashboard/book"
            className="flex gap-[10px] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[4px] pl-[5px] pr-[25px] justify-center text-[16px] md:text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
          >
            <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
              →
            </span>
            Book This Service
          </a>
        </div>
      </div>
    </section>
  );
}
