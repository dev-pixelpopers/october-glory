"use client";

import Header from "../components/header";
import Footer from "../components/footer";
import { useEffect, useState } from "react";

export default function Covid19Page() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="main-app bg-[#111111] min-h-screen text-white overflow-hidden font-sans">
      <Header theme="dark" />

      {/* --- Dynamic Hero Section --- */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 transition-transform duration-300 ease-out"
          style={{ 
            backgroundImage: "url('/images/BRIDAL-PACKAGE-010.webp')",
            transform: `translateY(${scrollY * 0.4}px) scale(1.1)` 
          }}
        />
        {/* Dark Gradient Overlay */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[#111111]/80 via-[#111111]/50 to-[#111111]" />

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto mt-20">
          <div className="inline-block mb-6 px-6 py-2 rounded-full border border-[#d4af6e]/30 bg-[#1B1B1B]/40 backdrop-blur-md">
            <span className="text-[#d4af6e] tracking-[0.2em] text-sm uppercase font-semibold">October Glory Salon</span>
          </div>
          <h1 className="andrea text-[80px] md:text-[110px] text-white leading-none mb-4 drop-shadow-2xl">
            Keeping <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af6e] to-[#f9e596]">You Safe</span>
          </h1>
          <p className="gotham text-[18px] md:text-[22px] leading-[36px] text-gray-300 font-light mt-8">
            We are committed to your safety and diligently follow CDC guidelines as we welcome you back into our sanctuary.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 animate-bounce opacity-70">
          <div className="w-[1px] h-[60px] bg-gradient-to-b from-transparent via-[#d4af6e] to-transparent" />
        </div>
      </section>

      {/* --- At a Glance (Bento Grid) --- */}
      <section className="py-[120px] px-6 md:px-[80px] lg:px-[120px] relative z-10 bg-[#111111]">
        {/* Decorative ambient glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#d4af6e]/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="container mx-auto relative z-10">
          <div className="text-center mb-20">
            <h2 className="valturin text-[45px] md:text-[55px] text-white uppercase tracking-wider mb-4">
              Salon Requirements
            </h2>
            <div className="w-[80px] h-[2px] bg-[#d4af6e] mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
            
            {/* Box 1 - Temp */}
            <div className="group relative bg-[#1B1B1B]/60 backdrop-blur-sm border border-white/5 hover:border-[#d4af6e]/40 rounded-[2rem] p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(212,175,110,0.15)] lg:col-span-2">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#d4af6e]/10 to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-full bg-[#252525] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6 text-[#d4af6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="valturin text-[28px] text-white uppercase tracking-wide mb-3 group-hover:text-[#d4af6e] transition-colors">Temp Check</h3>
              <p className="gotham text-[16px] leading-[28px] text-gray-400 font-light max-w-xl">
                We'll check your temp with our infrared touch-less thermometer to make sure you're good and healthy before seating you.
              </p>
            </div>

            {/* Box 2 - Mask */}
            <div className="group relative bg-[#1B1B1B]/60 backdrop-blur-sm border border-white/5 hover:border-[#d4af6e]/40 rounded-[2rem] p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(212,175,110,0.15)]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#d4af6e]/10 to-transparent rounded-bl-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="w-14 h-14 rounded-full bg-[#252525] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6 text-[#d4af6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
                </svg>
              </div>
              <h3 className="valturin text-[28px] text-white uppercase tracking-wide mb-3 group-hover:text-[#d4af6e] transition-colors">Wear A Mask</h3>
              <p className="gotham text-[16px] leading-[28px] text-gray-400 font-light">
                Required at all times: before, during, and after your appointment.
              </p>
            </div>

            {/* Box 3 - Wash */}
            <div className="group relative bg-[#1B1B1B]/60 backdrop-blur-sm border border-white/5 hover:border-[#d4af6e]/40 rounded-[2rem] p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(212,175,110,0.15)]">
              <div className="w-14 h-14 rounded-full bg-[#252525] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6 text-[#d4af6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 4.5L16.5 12l-2.25 7.5M9.75 4.5L7.5 12l2.25 7.5" />
                </svg>
              </div>
              <h3 className="valturin text-[28px] text-white uppercase tracking-wide mb-3 group-hover:text-[#d4af6e] transition-colors">Wash & Sanitize</h3>
              <p className="gotham text-[16px] leading-[28px] text-gray-400 font-light">
                Please wash/sanitize your hands before seating. Sanitizers are available at all times.
              </p>
            </div>

            {/* Box 4 - Come Alone */}
            <div className="group relative bg-[#1B1B1B]/60 backdrop-blur-sm border border-white/5 hover:border-[#d4af6e]/40 rounded-[2rem] p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(212,175,110,0.15)]">
              <div className="w-14 h-14 rounded-full bg-[#252525] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                <svg className="w-6 h-6 text-[#d4af6e]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
              </div>
              <h3 className="valturin text-[28px] text-white uppercase tracking-wide mb-3 group-hover:text-[#d4af6e] transition-colors">Come Alone</h3>
              <p className="gotham text-[16px] leading-[28px] text-gray-400 font-light">
                Only those with appointments may be in the salon. Chaperons for children are permitted.
              </p>
            </div>

            {/* Box 5 - Time & BYOB & Stay Home (Combined) */}
            <div className="group relative bg-gradient-to-br from-[#1B1B1B] to-[#252525] border border-white/5 hover:border-[#d4af6e]/40 rounded-[2rem] p-8 overflow-hidden transition-all duration-500 hover:-translate-y-2 lg:col-span-1 shadow-xl">
              <div className="absolute inset-0 bg-[#d4af6e]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-center space-y-6">
                <div>
                  <h3 className="valturin text-[24px] text-white uppercase tracking-wide mb-2 group-hover:text-[#d4af6e] transition-colors">Be On Time</h3>
                  <p className="gotham text-[14px] leading-[24px] text-gray-400 font-light">Please arrive on-time so we can complete your service safely.</p>
                </div>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div>
                  <h3 className="valturin text-[24px] text-white uppercase tracking-wide mb-2 group-hover:text-[#d4af6e] transition-colors">BYOB</h3>
                  <p className="gotham text-[14px] leading-[24px] text-gray-400 font-light">Bring your own beverages in a covered container.</p>
                </div>
                <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div>
                  <h3 className="valturin text-[24px] text-white uppercase tracking-wide mb-2 group-hover:text-[#d4af6e] transition-colors">Stay Home</h3>
                  <p className="gotham text-[14px] leading-[24px] text-gray-400 font-light">If you think you might be sick, please reschedule.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* --- Detailed Precautions Timeline --- */}
      <section className="py-[120px] px-6 md:px-[120px] bg-[#151515] relative">
        <div className="container mx-auto max-w-5xl relative z-10">
          <div className="mb-20 text-center">
            <h2 className="valturin text-[45px] md:text-[55px] text-[#d4af6e] uppercase tracking-wider mb-6">
              Our Precautions
            </h2>
            <p className="gotham text-[20px] md:text-[24px] text-white font-light">
              We are taking extra steps to ensure your health and safety.
            </p>
          </div>

          <div className="relative">
            {/* Center Timeline Line for Desktop */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#d4af6e]/30 to-transparent -translate-x-1/2" />

            <div className="space-y-24">
              
              {/* Timeline Item 1 */}
              <div className="flex flex-col md:flex-row items-center justify-between w-full group">
                <div className="md:w-5/12 text-center md:text-right mb-6 md:mb-0">
                  <h3 className="valturin text-[32px] text-white mb-4 group-hover:text-[#d4af6e] transition-colors">Pre-appointment</h3>
                  <ul className="space-y-3 gotham text-[16px] text-gray-400 font-light list-none md:pr-4">
                    <li>We will confirm your appointment 48 hours in advance with a short questionnaire.</li>
                    <li>Only ONE client during each appointment.</li>
                  </ul>
                </div>
                <div className="hidden md:flex w-16 h-16 rounded-full bg-[#111111] border border-[#d4af6e] items-center justify-center shrink-0 z-10 shadow-[0_0_20px_rgba(212,175,110,0.3)] group-hover:scale-110 transition-transform duration-500">
                  <span className="valturin text-[#d4af6e] text-2xl">01</span>
                </div>
                <div className="md:w-5/12" /> {/* Empty for alignment */}
              </div>

              {/* Timeline Item 2 */}
              <div className="flex flex-col md:flex-row-reverse items-center justify-between w-full group">
                <div className="md:w-5/12 text-center md:text-left mb-6 md:mb-0">
                  <h3 className="valturin text-[32px] text-white mb-4 group-hover:text-[#d4af6e] transition-colors">During Your Service</h3>
                  <ul className="space-y-3 gotham text-[16px] text-gray-400 font-light list-none md:pl-4">
                    <li>Stylists may adjust mask around ears; please hold over nose/mouth.</li>
                    <li>Masks required for all clients at all times.</li>
                    <li>No magazines provided at this time.</li>
                    <li>Disposable masks provided if removal is necessary.</li>
                  </ul>
                </div>
                <div className="hidden md:flex w-16 h-16 rounded-full bg-[#111111] border border-[#d4af6e] items-center justify-center shrink-0 z-10 shadow-[0_0_20px_rgba(212,175,110,0.3)] group-hover:scale-110 transition-transform duration-500">
                  <span className="valturin text-[#d4af6e] text-2xl">02</span>
                </div>
                <div className="md:w-5/12" /> {/* Empty for alignment */}
              </div>

              {/* Timeline Item 3 */}
              <div className="flex flex-col md:flex-row items-center justify-between w-full group">
                <div className="md:w-5/12 text-center md:text-right mb-6 md:mb-0">
                  <h3 className="valturin text-[32px] text-white mb-4 group-hover:text-[#d4af6e] transition-colors">Our Health Routine</h3>
                  <ul className="space-y-3 gotham text-[16px] text-gray-400 font-light list-none md:pr-4">
                    <li>Daily temperature checks for our team.</li>
                    <li>We will wear masks throughout the day and gloves when possible.</li>
                    <li>Sanitizing and disinfecting tools/stations after every use.</li>
                    <li>Consistent hand washing throughout the day.</li>
                  </ul>
                </div>
                <div className="hidden md:flex w-16 h-16 rounded-full bg-[#111111] border border-[#d4af6e] items-center justify-center shrink-0 z-10 shadow-[0_0_20px_rgba(212,175,110,0.3)] group-hover:scale-110 transition-transform duration-500">
                  <span className="valturin text-[#d4af6e] text-2xl">03</span>
                </div>
                <div className="md:w-5/12" /> {/* Empty for alignment */}
              </div>

              {/* Timeline Item 4 */}
              <div className="flex flex-col md:flex-row-reverse items-center justify-between w-full group">
                <div className="md:w-5/12 text-center md:text-left mb-6 md:mb-0">
                  <h3 className="valturin text-[32px] text-white mb-4 group-hover:text-[#d4af6e] transition-colors">What To Expect</h3>
                  <ul className="space-y-3 gotham text-[16px] text-gray-400 font-light list-none md:pl-4">
                    <li>10-minute cleaning/disinfecting buffer between appointments.</li>
                    <li>6-feet social distance maintained between chairs.</li>
                    <li>Face masks and sanitizers provided if needed.</li>
                    <li>Trash bins easily accessible.</li>
                  </ul>
                </div>
                <div className="hidden md:flex w-16 h-16 rounded-full bg-[#111111] border border-[#d4af6e] items-center justify-center shrink-0 z-10 shadow-[0_0_20px_rgba(212,175,110,0.3)] group-hover:scale-110 transition-transform duration-500">
                  <span className="valturin text-[#d4af6e] text-2xl">04</span>
                </div>
                <div className="md:w-5/12" /> {/* Empty for alignment */}
              </div>

            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
