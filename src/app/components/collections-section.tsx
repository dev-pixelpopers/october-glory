"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

// Next.js mein SSR ki wajah se window check zaroori hai
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CollectionsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  // Har card ka reference array mein save karne ke liye
  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useEffect(() => {
    // gsap.context use karna React mein best practice hai (cleanup ke liye)
    const ctx = gsap.context(() => {
      cardsRef.current.forEach((card) => {
        gsap.to(card, {
          rotation: "+=25", 
          y: "-=20",        
          ease: "none",
          scrollTrigger: {
            trigger: card,
            scroller: containerRef.current, 
            horizontal: true,               
            start: "left right",            
            end: "right left",              
            scrub: 1,                       
          }
        });
      });
    }, containerRef);

    return () => ctx.revert(); // Component unmount par animations clean karega
  }, []);

  return (
    <section 
      className="flex flex-col gap-0 bg-[#1B1B1B] pt-[150px] pb-[100px] px-0 bg-no-repeat bg-right bg-contain"
      style={{ backgroundImage: "url('/images/baloch.png')" }}
    >
      <div>
        {/* Headings Section */}
        <div className="w-full flex flex-col gap-0">
          <div className="flex flex-col px-[110px]">
            <h2 className="andrea text-[90px] text-white text-left">
             Shop by
            </h2>
            <h2 className="valturin text-[68px] text-[#C0A062] mt-2 text-left ml-[200px]">
                Collection
            </h2>
          </div>
        </div>

        {/* Horizontal Scroll Cards Section */}
        <div 
          ref={containerRef} 
          className="w-full overflow-x-auto pb-20 pt-24 px-[110px] snap-x snap-mandatory flex gap-8 items-center justify-start [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {/* Card 1 */}
          <div 
            ref={addToRefs} 
            className="min-w-[260px] snap-center shrink-0 bg-white rounded-lg p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:z-10 translate-y-12 -rotate-[15deg]"
          >
            <div className="w-full h-[240px] bg-gray-100 rounded-md mb-4 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1595476108010-b4d1f10d5e42?w=400&q=80" alt="Wigs" className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-gray-500 font-medium text-sm">Wigs</h3>
              <span className="text-gray-400 text-sm font-medium">$60.00</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-[#C0A062] text-white text-[11px] uppercase tracking-wider font-semibold py-2.5 rounded-sm hover:bg-[#a6884f] transition-colors">Try On</button>
              <button className="flex-1 bg-white border border-gray-300 text-gray-500 text-[11px] uppercase tracking-wider font-semibold py-2.5 rounded-sm hover:bg-gray-50 transition-colors">Add To Cart</button>
            </div>
          </div>

          {/* Card 2 */}
          <div 
            ref={addToRefs} 
            className="min-w-[260px] snap-center shrink-0 bg-white rounded-lg p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:z-10 translate-y-0 -rotate-3"
          >
            <div className="w-full h-[240px] bg-gray-100 rounded-md mb-4 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=400&q=80" alt="Wigs" className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-gray-500 font-medium text-sm">Wigs</h3>
              <span className="text-gray-400 text-sm font-medium">$80.00</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-[#C0A062] text-white text-[11px] uppercase tracking-wider font-semibold py-2.5 rounded-sm hover:bg-[#a6884f] transition-colors">Try On</button>
              <button className="flex-1 bg-white border border-gray-300 text-gray-500 text-[11px] uppercase tracking-wider font-semibold py-2.5 rounded-sm hover:bg-gray-50 transition-colors">Add To Cart</button>
            </div>
          </div>

          {/* Card 3 */}
          <div 
            ref={addToRefs} 
            className="min-w-[260px] snap-center shrink-0 bg-white rounded-lg p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:z-10 translate-y-6 rotate-[10deg]"
          >
            <div className="w-full h-[240px] bg-gray-100 rounded-md mb-4 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&q=80" alt="Wigs" className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-gray-500 font-medium text-sm">Wigs</h3>
              <span className="text-gray-400 text-sm font-medium">$80.00</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-[#C0A062] text-white text-[11px] uppercase tracking-wider font-semibold py-2.5 rounded-sm hover:bg-[#a6884f] transition-colors">Try On</button>
              <button className="flex-1 bg-white border border-gray-300 text-gray-500 text-[11px] uppercase tracking-wider font-semibold py-2.5 rounded-sm hover:bg-gray-50 transition-colors">Add To Cart</button>
            </div>
          </div>

          {/* Card 4 */}
          <div 
            ref={addToRefs} 
            className="min-w-[260px] snap-center shrink-0 bg-white rounded-lg p-3 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-transform duration-300 hover:z-10 translate-y-20 rotate-[25deg]"
          >
            <div className="w-full h-[240px] bg-gray-100 rounded-md mb-4 overflow-hidden">
              <img src="https://images.unsplash.com/photo-1605980776566-0486c3ac7617?w=400&q=80" alt="Wigs" className="w-full h-full object-cover object-top" />
            </div>
            <div className="flex justify-between items-center mb-4 px-1">
              <h3 className="text-gray-500 font-medium text-sm">Wigs</h3>
              <span className="text-gray-400 text-sm font-medium">$40.00</span>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 bg-[#C0A062] text-white text-[11px] uppercase tracking-wider font-semibold py-2.5 rounded-sm hover:bg-[#a6884f] transition-colors">Try On</button>
              <button className="flex-1 bg-white border border-gray-300 text-gray-500 text-[11px] uppercase tracking-wider font-semibold py-2.5 rounded-sm hover:bg-gray-50 transition-colors">Add To Cart</button>
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
}