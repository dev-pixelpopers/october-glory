"use client";

import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";

const categories = ["All", "Wigs", "Extensions", "Silk Press", "Color", "Bridal"];

const lookbookItems = [
  {
    id: 1,
    category: "Extensions",
    title: "Luxe Volume Extensions",
    description: "Full-body extensions crafted for natural movement and effortless elegance.",
    type: "video",
    src: "/images/video-01.mp4",
  },
  {
    id: 2,
    category: "Silk Press",
    title: "Mirror Silk Finish",
    description: "Silky-smooth press with a radiant, glossy finish that lasts for weeks.",
    type: "video",
    src: "/images/video-02.mp4",
  },
  {
    id: 3,
    category: "Color",
    title: "Honey Bronze Highlights",
    description: "Hand-painted dimensional highlights for a sun-kissed, natural glow.",
    type: "video",
    src: "/images/video-03.mp4",
  },
  {
    id: 4,
    category: "Wigs",
    title: "Custom Lace Front",
    description: "Invisible hairline custom wig installation with seamless blending.",
    type: "video",
    src: "/images/video-04.mp4",
  },
  {
    id: 5,
    category: "Bridal",
    title: "Bridal Elegance Updo",
    description: "Romantic updo styled for Brooklyn's most glamorous wedding days.",
    type: "video",
    src: "/images/video-05.mp4",
  },
  {
    id: 6,
    category: "Extensions",
    title: "Length & Flow",
    description: "Waist-length install with custom curl pattern matching.",
    type: "image",
    src: "/images/confidance-image.png",
  },
  {
    id: 7,
    category: "Silk Press",
    title: "Sleek & Polished",
    description: "A crisp, bouncy press with heat-protective spa treatment.",
    type: "image",
    src: "/images/about-img.png",
  },
  {
    id: 8,
    category: "Wigs",
    title: "Precision Cut Wig",
    description: "Customized unit with layered framing cut to complement face shape.",
    type: "image",
    src: "/images/perfect-image.png",
  },
  {
    id: 9,
    category: "Color",
    title: "Burgundy Deep Tones",
    description: "Bold color transformation with deep berry undertones.",
    type: "image",
    src: "/images/guide-image.png",
  },
];

export default function LookbookPage() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const filteredItems =
    activeFilter === "All"
      ? lookbookItems
      : lookbookItems.filter((item) => item.category === activeFilter);

  return (
    <div className="main-app bg-[#1B1B1B] min-h-screen text-white flex flex-col relative">
      <Header bg="white" />

      {/* ============================
          HERO SECTION
      ============================ */}
      <section
        className="relative pt-[220px] pb-[120px] px-6 md:px-[120px] bg-cover bg-center flex flex-col items-center justify-center text-center overflow-hidden"
        style={{ backgroundImage: "url('/images/hero-bg.png')" }}
      >
        <div className="absolute inset-0 bg-black/85 z-0"></div>

        <div className="relative z-10 flex flex-col items-center max-w-[900px]">
          <h1 className="andrea text-[80px] md:text-[110px] text-white mb-[-20px] tracking-wide">
            The
          </h1>
          <h2 className="valturin text-[45px] md:text-[75px] text-gold uppercase tracking-[4px] leading-tight">
            Lookbook
          </h2>
          <p className="gotham text-[18px] md:text-[22px] leading-relaxed text-gray-300 font-light mt-8 max-w-[750px]">
            A curated showcase of our finest transformations. Every style tells a story of confidence, artistry, and the October Glory touch.
          </p>
        </div>
      </section>

      {/* ============================
          FILTER BAR
      ============================ */}
      <section className="bg-[#151515] py-10 px-6 md:px-[120px] border-b border-white/5">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-center gap-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`gotham text-[16px] tracking-wider uppercase px-8 py-3 rounded-full border transition-all duration-300 cursor-pointer ${
                activeFilter === cat
                  ? "bg-[#C0A062] border-[#C0A062] text-black font-semibold"
                  : "bg-transparent border-white/20 text-gray-300 hover:border-[#C0A062] hover:text-[#C0A062]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ============================
          MASONRY GALLERY
      ============================ */}
      <section className="py-[80px] px-6 md:px-[120px] bg-[#1B1B1B]">
        <div className="max-w-[1400px] mx-auto columns-1 md:columns-2 lg:columns-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid mb-6 group relative rounded-[1.5rem] overflow-hidden cursor-pointer"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Media */}
              {item.type === "video" ? (
                <video
                  src={item.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full object-cover rounded-[1.5rem] transition-transform duration-700 group-hover:scale-105"
                  style={{ height: item.id % 2 === 0 ? "480px" : "380px" }}
                />
              ) : (
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full object-cover rounded-[1.5rem] transition-transform duration-700 group-hover:scale-105"
                  style={{ height: item.id % 3 === 0 ? "520px" : "400px" }}
                />
              )}

              {/* Overlay */}
              <div
                className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent rounded-[1.5rem] flex flex-col justify-end p-8 transition-opacity duration-500 ${
                  hoveredId === item.id ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Category Badge */}
                <span className="gotham text-[12px] uppercase tracking-[3px] text-[#C0A062] mb-2 font-semibold">
                  {item.category}
                </span>
                <h3 className="valturin text-[28px] text-white mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="gotham text-[14px] text-gray-300 font-light leading-relaxed max-w-[320px]">
                  {item.description}
                </p>
              </div>

              {/* Persistent Category Pill */}
              <div
                className={`absolute top-5 left-5 transition-opacity duration-500 ${
                  hoveredId === item.id ? "opacity-0" : "opacity-100"
                }`}
              >
                <span className="gotham text-[11px] uppercase tracking-[2px] text-white bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full font-medium">
                  {item.category}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================
          VIDEO REEL SECTION
      ============================ */}
      <section className="bg-[#151515] py-[100px] px-6 md:px-[120px] relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex justify-center overflow-hidden pointer-events-none z-0 select-none opacity-[0.04]">
          <div className="valturin text-[40vw] leading-none text-white">G</div>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="flex flex-col items-center text-center mb-16">
            <span className="andrea text-[60px] text-gold mb-[-10px]">Behind</span>
            <h2 className="valturin text-[45px] md:text-[60px] text-white uppercase tracking-widest">
              The Chair
            </h2>
            <p className="gotham text-[18px] text-gray-400 font-light mt-6 max-w-[600px]">
              Watch our stylists craft each look with precision, passion, and an artist's eye for detail.
            </p>
          </div>

          {/* Video Reel Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { src: "/images/1-video.mp4", label: "Sew-In Install" },
              { src: "/images/video-2.mp4", label: "Silk Press" },
              { src: "/images/video-3.mp4", label: "Custom Color" },
              { src: "/images/video-4.mp4", label: "Wig Fitting" },
            ].map((vid, i) => (
              <div key={i} className="relative group rounded-[1.25rem] overflow-hidden">
                <video
                  src={vid.src}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-[400px] object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8">
                  <span className="valturin text-[22px] text-white tracking-wider">{vid.label}</span>
                </div>
                {/* Gold top-border accent on hover */}
                <div className="absolute top-0 left-0 w-full h-[3px] bg-[#C0A062] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          CTA SECTION
      ============================ */}
      <section
        className="py-[120px] px-6 bg-cover bg-center text-center relative"
        style={{ backgroundImage: "url('/images/servicce.png')" }}
      >
        <div className="absolute inset-0 bg-black/90 z-0"></div>
        <div className="relative z-10 flex flex-col items-center max-w-[800px] mx-auto gap-8">
          <h2 className="andrea text-[70px] text-white mb-[-30px]">Your Look</h2>
          <h3 className="valturin text-[35px] md:text-[50px] text-gold uppercase tracking-wider">
            Awaits You
          </h3>
          <p className="gotham text-[18px] text-gray-300 max-w-[600px] font-light leading-relaxed">
            Inspired by what you see? Let us create your signature look. Book a private consultation today.
          </p>
          <a
            href="/contact"
            className="flex mt-4 gap-[10px] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[4px] pl-[5px] pr-[25px] justify-center text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
          >
            <span className="bg-[#d4af6e] text-black rounded-full w-[43px] h-[43px] flex items-center justify-center font-bold">
              →
            </span>
            Book Consultation
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
