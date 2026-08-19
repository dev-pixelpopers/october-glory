"use client";

import React, { useEffect, useRef, useState } from "react";
import FullScreenMenu from "./FullScreenMenu";

export default function Header({ theme = "light", bg = "transparent" }: { theme?: "light" | "dark"; bg?: "white" | "transparent" }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  // Where the controls sit at rest. They stay pinned there for the whole page,
  // so the toggle never moves — which is what keeps the popup's close button
  // exactly on top of the menu button that opened it.
  const [controlsTop, setControlsTop] = useState(46);

  useEffect(() => {
    const measure = () => {
      const row = rowRef.current;
      if (!row) return;
      const { top } = row.getBoundingClientRect();
      const CONTROLS_OFFSET = 10;
      setControlsTop(top + window.scrollY + CONTROLS_OFFSET);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  // Freeze the page behind the overlay, and let Escape close it.
  useEffect(() => {
    if (!isMenuOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isMenuOpen]);

  return (
    <>
      {/* Elevated z-index when open so it sits on top of the popup. Goes fixed
          while the menu is open so the logo rides up to meet the pinned
          controls, giving the popup a complete header. */}
      <div className={`main-header ${isMenuOpen ? 'fixed' : 'absolute'} top-0 left-0 w-full transition-all duration-500 ${isMenuOpen ? 'z-[10000]' : 'z-2'} ${bg === 'white' ? 'bg-white' : ''}`}>
      <section className="bg-[#000] py-1">
        <div className="container mx-auto">
          <p className="text-center gotham text-[20px] text-white">
            Great News! Ask How To Get 10% Off Your Next Service
          </p>
        </div>
      </section>

      <header className="w-full bg-transparent relative overflow-hidden z-50">
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {/* Placeholder for faint gold lines */}
        </div>

        <div ref={rowRef} className="w-full px-[120px] py-[10px] grid grid-cols-3 items-center relative z-10">

          {/* --- COLUMN 1 & 3 are spacers --- the menu toggle and icons live in
              the pinned layer below, so they can stay put while the logo and
              announcement bar scroll away. These reserve the same height so the
              logo sits exactly where it always did. --- */}
          <div className="flex justify-start" aria-hidden="true">
            <div className="h-13" />
          </div>

          {/* --- COLUMN 2: Logo --- */}
          <div className="flex justify-center z-10">
            <a href="/" className="flex justify-center">
              <img
                src="/images/logo.svg"
                alt="October Glory Logo"
                // Added a filter to turn the black logo white when the menu opens
                className={`h-full w-full max-w-[68%] object-contain transition-all duration-500 ${isMenuOpen || theme === 'dark' ? 'brightness-0 invert' : ''}`}
              />
            </a>
          </div>

          {/* Spacer — the icons live in the pinned layer, but the row still
              needs their height so the logo sits exactly where it always did. */}
          <div className="flex justify-end items-center" aria-hidden="true">
            <div className="h-13" />
          </div>

        </div>
      </header>

      {/* Render the FullScreenMenu directly */}
      <FullScreenMenu isOpen={isMenuOpen} />
    </div>

      {/* The only copy of the menu toggle and the icons. Pinned at the position
          they occupy at rest, so they never move: not when the page scrolls,
          and not when the overlay opens. That is what puts the close button
          exactly on top of the menu button that opened it. */}
      <div
        className="fixed left-0 w-full px-[120px] flex items-center justify-between pointer-events-none z-[10001]"
        style={{ top: controlsTop }}
      >
        <div className="pointer-events-auto">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`flex items-center gap-4 transition-colors group cursor-pointer ${isMenuOpen
              ? 'text-white hover:opacity-70'
              : 'text-[#cba660] hover:opacity-70'
              }`}
          >
            {isMenuOpen ? (
              // 'X' Cross Icon for closing
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Original Custom Hamburger Icon
              <div className="flex flex-col gap-[6px] w-10">
                <span className="w-full h-[2px] bg-current transition-all"></span>
                <span className="w-full h-[2px] bg-current transition-all -ml-[10px]"></span>
                <span className="w-full h-[2px] bg-current transition-all"></span>
              </div>
            )}
            <span className="text-[20px] gotham">
              {isMenuOpen ? 'Close' : 'Menu'}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-3 md:gap-4 pointer-events-auto">

            {/* Heart Icon Button */}
            <button className={`w-13 h-13 rounded-full border flex items-center justify-center transition-all duration-300 bg-[#00000011] backdrop-blur-[2px] p-2 ${isMenuOpen
              ? 'border-white/50 text-white hover:bg-white/10'
              : 'border-[#cba660]/60 text-[#cba660] hover:bg-[#cba660] hover:text-white hover:border-[#cba660]'
              }`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>


            {/* Shopping Bag Icon Button */}
            <button className={`w-13 h-13 rounded-full border flex items-center justify-center transition-all duration-300 bg-[#00000011] backdrop-blur-[2px] relative p-2 ${isMenuOpen
              ? 'border-white/50 text-white hover:bg-white/10'
              : 'border-[#cba660]/60 text-[#cba660] hover:bg-[#cba660] hover:text-white hover:border-[#cba660]'
              }`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </button>
            {/* Add Account Icon with link to dashboard or login */}
            <a href="/login" className={`w-13 h-13 rounded-full border flex items-center justify-center transition-all duration-300 bg-[#00000011] backdrop-blur-[2px] p-2 ${isMenuOpen
              ? 'border-white/50 text-white hover:bg-white/10'
              : 'border-[#cba660]/60 text-[#cba660] hover:bg-[#cba660] hover:text-white hover:border-[#cba660]'
              }`}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            </a>
        </div>
      </div>
    </>
  );
}