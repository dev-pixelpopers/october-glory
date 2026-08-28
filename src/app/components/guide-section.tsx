"use client";
import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

export default function GuidebookSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const heading1Ref = useRef<HTMLDivElement>(null);
  const heading2Ref = useRef<HTMLDivElement>(null);
  const ParaRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
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
      .to(ctaRef.current, {
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1
      }, "<")
  })
  return (
    <section ref={containerRef} className="bg-[#1a1a1a] relative min-h-[200dvh]">
      <div className="guide-main-con w-full flex flex-col md:flex-row items-center sticky top-0 h-dvh justify-center items-center">
        <div className="guide-lef-col w-[55%] flex justify-center items-center bg-white rounded-3xl p-[clamp(10px,8.54px_+_0.389vw,16px)] md:p-0 shadow-lg">
          <img
            src="/images/guide-image.png"
            alt="Tablet showing The Ultimate Buying Guide"
            className="w-full object-contain"
          />
        </div>

        <div
          className="guide-rig-col relative z-10 w-[50%] px-[clamp(20px,15.14px_+_1.295vw,40px)] py-[clamp(20px,15.15px_+_1.295vw,40px)] h-[80dvh] flex flex-col justify-center rounded-[20px] -ml-[clamp(32px,15.5px_+_4.402vw,100px)]"
          style={{
            backgroundImage: "linear-gradient(270deg, #93674D 0%, #2D2018 100%)",
          }}
        >
          <div ref={heading1Ref} className="guide-head" style={{
            clipPath: "inset(0% 100% 0% 0%)"
          }}>
            <h2 className="text-white text-[length:clamp(32px,18.41px_+_3.625vw,88px)] leading-[clamp(55px,31.94px_+_6.149vw,150px)] andrea capitalize">Your Guide to</h2>
          </div>
          <div className="guide-head-sec pl-[clamp(42px,20.64px_+_5.696vw,130px)]">
            <div ref={heading2Ref} className="mb-[clamp(20px,17.57px_+_0.648vw,30px)]" style={{
              clipPath: "inset(0% 100% 0% 0%)"
            }}>
              <h3 className="text-[#c1a073] text-[length:clamp(28px,18.78px_+_2.46vw,66px)] valturin capitalize">
                the Perfect Choice
              </h3>
            </div>
          </div>
          <div ref={ParaRef} className="text-gray-200 text-[length:clamp(16px,15.03px_+_0.259vw,20px)] leading-[clamp(41px,39.3px_+_0.453vw,48px)] gotham"
            style={{
              clipPath: "inset(0% 100% 0% 0%)"
            }}>
            <p className="mb-[clamp(25px,18.93px_+_1.619vw,50px)] pr-[clamp(20px,15.15px_+_1.295vw,40px)]">
              Not sure which service, treatment, or product is right for you?
              Our carefully crafted guidebook is designed to help you
              confidently choose the perfect option based on your hair goals,
              lifestyle, and beauty needs.
            </p>
          </div>
          {/* Two routes out of the guide — the copy asks "which service is
              right for you", so the answer is a choice, not one download. Both
              share the clip-path reveal, so they wipe in as a single unit. */}
          <div ref={ctaRef} className="perf-cta-div flex flex-row gap-[clamp(13px,11.3px_+_0.454vw,20px)]" style={{
            clipPath: "inset(0% 100% 0% 0%)"
          }}>
            <GuideLink href="/services/silk-press#ebook">
              Explore Silk Press
            </GuideLink>
            <GuideLink href="/services/wigs-and-extensions#ebook">
              Explore Wigs &amp; Extensions
            </GuideLink>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The circle-arrow CTA, kept in one place so both routes stay identical. */
function GuideLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link href={href} className="flex items-center gap-[clamp(10px,8.54px_+_0.389vw,16px)] group w-max">
      <div className="w-[clamp(44px,43.03px_+_0.259vw,48px)] h-[clamp(44px,43.03px_+_0.259vw,48px)] shrink-0 rounded-full border border-gray-400 flex items-center justify-center transition-colors duration-300 group-hover:bg-white group-hover:text-black text-gray-300">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-[clamp(18px,17.51px_+_0.13vw,20px)] h-[clamp(18px,17.51px_+_0.13vw,20px)]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
          />
        </svg>
      </div>
      <span className="text-white gotham text-[length:clamp(17px,16.27px_+_0.194vw,20px)] transition-colors duration-300">
        {children}
      </span>
    </Link>
  );
}
