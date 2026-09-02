"use client";

import React, { useState } from "react";
import Header from "../components/header";
import Footer from "../components/footer";
import InnerPageHero from "../components/inner-page-hero";

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
      <Header theme="dark" />

      {/* --- About Us Page Hero --- */}
      <InnerPageHero
        title="The"
        subtitle="Lookbook"
        description="A curated showcase of our finest transformations. Every style tells a story of confidence, artistry, and the October Glory touch."
      />

      {/* ============================
          FILTER BAR
      ============================ */}
      <section className="bg-[#151515] py-[var(--space-40)] px-[var(--space-section-x)] border-b border-white/5">
        <div className="max-w-[1400px] mx-auto flex flex-wrap items-center justify-center gap-[var(--space-16)]">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`gotham text-[16px] tracking-wider uppercase px-[var(--space-32)] py-3 rounded-full border transition-all duration-300 cursor-pointer ${activeFilter === cat
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
      <section className="py-[var(--space-section-y)] px-[var(--space-section-x)] bg-[#1B1B1B]">
        <div className="max-w-[1400px] mx-auto columns-1 md:columns-2 lg:columns-3 gap-[var(--space-32)]">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="break-inside-avoid mb-[var(--space-24)] group relative rounded-[1.5rem] overflow-hidden cursor-pointer"
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
                className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent rounded-[1.5rem] flex flex-col justify-end p-[var(--space-32)] transition-opacity duration-500 ${hoveredId === item.id ? "opacity-100" : "opacity-0"
                  }`}
              >
                {/* Category Badge */}
                <span className="gotham text-[12px] uppercase tracking-[3px] text-[#C0A062] mb-2 font-semibold">
                  {item.category}
                </span>
                <h3 className="valturin text-[length:clamp(20px,17.65px_+_0.988vw,28px)] text-white mb-2 leading-tight">
                  {item.title}
                </h3>
                <p className="gotham text-[length:var(--fs-small)] text-gray-300 font-light leading-relaxed max-w-[320px]">
                  {item.description}
                </p>
              </div>

              {/* Persistent Category Pill */}
              <div
                className={`absolute top-5 left-5 transition-opacity duration-500 ${hoveredId === item.id ? "opacity-0" : "opacity-100"
                  }`}
              >
                <span className="gotham text-[11px] uppercase tracking-[2px] text-white bg-black/50 backdrop-blur-sm px-[var(--space-16)] py-2 rounded-full font-medium">
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
      <section className="bg-[#151515] py-[var(--space-section-y)] px-[var(--space-section-x)] relative overflow-hidden">
        {/* Watermark */}
        <div className="absolute inset-0 flex justify-center overflow-hidden pointer-events-none z-0 select-none opacity-[0.04]">
          <div className="valturin text-[40vw] leading-none text-white">G</div>
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto">
          <div className="flex flex-col items-center text-center mb-[var(--space-64)]">
            <span className="andrea text-[length:var(--fs-accent)] text-gold mb-[-10px]">Behind</span>
            <h2 className="valturin text-[length:var(--fs-h2)] text-white uppercase tracking-widest">
              The Chair
            </h2>
            <p className="gotham text-[length:var(--fs-body)] text-gray-400 font-light mt-[var(--space-24)] max-w-[600px]">
              Watch our stylists craft each look with precision, passion, and an artist's eye for detail.
            </p>
          </div>

          {/* Video Reel Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-[var(--space-32)]">
            {[
              { src: "/images/1-video.mp4", label: "Sew-In Install" },
              { src: "/images/video-2.mp4", label: "Silk Press" },
              { src: "/images/video-3.mp4", label: "Wig Fitting" },
              { src: "/images/video-4.mp4", label: "Custom Color" },
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-[var(--space-32)]">
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
        className="py-[var(--space-section-y)] px-[var(--space-section-x)] bg-cover bg-center text-center relative"
        style={{ backgroundImage: "url('/images/servicce.png')" }}
      >
        <div className="absolute inset-0 bg-black/90 z-0"></div>
        <div className="relative z-10 flex flex-col items-center max-w-[800px] mx-auto gap-[var(--space-32)]">
          <h2 className="andrea text-[length:var(--fs-h2)] text-white mb-[calc(var(--space-32)*-1)]">Your Look</h2>
          <h3 className="valturin text-[length:var(--fs-h3)] text-gold uppercase tracking-wider">
            Awaits You
          </h3>
          <p className="gotham text-[length:var(--fs-body)] text-gray-300 max-w-[600px] font-light leading-relaxed">
            Inspired by what you see? Let us create your signature look. Book a private consultation today.
          </p>
          <a
            href="/dashboard/book"
            className="flex mt-[var(--space-16)] gap-[clamp(6px,5.03px_+_0.259vw,10px)] items-center border-[#d4af6e] border text-[#d4af6e] rounded-4xl py-[clamp(3px,2.76px_+_0.065vw,4px)] pl-[clamp(3px,2.51px_+_0.13vw,5px)] pr-[clamp(16px,13.81px_+_0.583vw,25px)] justify-center text-[18px] gotham hover:bg-[#d4af6e] hover:text-black transition-all duration-300"
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
