"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// SSR-safe plugin registration (no `window` access at module eval on the server).
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

// 5 source images, reused to fill 10 cards (index % 5).
const COLLECTION_IMAGES = [
  "/images/collections/wigs-1.png",
  "/images/collections/wigs-2.png",
  "/images/collections/wigs-3.png",
  "/images/collections/wigs-4.png",
  "/images/collections/wigs-5.png",
];

const PRICES = ["$60.00", "$80.00", "$80.00", "$40.00", "$70.00"];

const CARDS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  image: COLLECTION_IMAGES[i % COLLECTION_IMAGES.length],
  price: PRICES[i % PRICES.length],
  label: "Wigs",
}));

// --- Conveyor geometry ------------------------------------------------------
// Each card rides a single continuous curve parameterised by its path
// coordinate `u`. The 5 visible arc slots sit at u ∈ [0, 4] (0 = rightmost,
// 4 = leftmost); u = 2 is the center peak. Below u = 0 the curve dives off the
// bottom-right corner (entry); above u = 4 it dives off the bottom-left (exit).
// Crucially there are NO piecewise segments — x, y and rotation are smooth
// functions of u end-to-end, so cards glide in/out instead of snapping onto
// the arc. Cards are spaced one unit apart, so ~5 occupy the arc at any time.
const VISIBLE = 5; // cards visible inside the arc at once
const ARC_SPAN = VISIBLE - 1; // u distance between the outer arc slots (0..4)
const CENTER_U = ARC_SPAN / 2; // u of the center peak (2)

const SPREAD_X = 1880; // wide span: the outer slots sit at the viewport edges
const X_STEP = SPREAD_X / ARC_SPAN; // even horizontal spacing per unit of u (~470px)

const ARC_HEIGHT = 250; // drop of the outer slots below the peak (px)
const OFFSCREEN_DROP = 900; // y one unit past an edge — dives below the viewport
const BASE_Y = 0; // peak height relative to the vertical center

const ROT_STEP = 9; // gentle tilt (deg) added per unit of u away from center
const MAX_ROTATION = 25; // clamp so off-screen cards never over-rotate

// y(u) is an even quartic in p = (u - CENTER_U) / CENTER_U (p = ±1 at the edges):
//   y = BASE_Y + Q2·p² + Q4·p⁴
// Q2/Q4 are solved so the curve passes through ARC_HEIGHT at the edge (p = 1)
// and OFFSCREEN_DROP one unit beyond it (p = 1.5). The quartic stays gentle
// across the visible arc but plunges steeply past the edges to clear the screen.
const P_OFF = (CENTER_U + 1) / CENTER_U; // p one unit past the edge (1.5)
const Q4 =
  (OFFSCREEN_DROP - ARC_HEIGHT * P_OFF * P_OFF) /
  (Math.pow(P_OFF, 4) - P_OFF * P_OFF);
const Q2 = ARC_HEIGHT - Q4;

const lerp = (a: number, b: number, p: number) => a + (b - a) * p;

type CardState = { x: number; y: number; rotation: number };

// Single smooth curve for a card at path coordinate u.
const pathAt = (u: number): CardState => {
  const dx = CENTER_U - u; // + on the right, − on the left
  const p = -dx / CENTER_U; // -1 (left edge) .. +1 (right edge)
  return {
    x: dx * X_STEP, // linear → perfectly even spacing
    y: BASE_Y + Q2 * p * p + Q4 * p * p * p * p, // smooth dive off both corners
    rotation: gsap.utils.clamp(-MAX_ROTATION, MAX_ROTATION, dx * ROT_STEP),
  };
};

// Static SVG guide line that traces the arc the cards ride along. It samples
// the same curve across the visible window and sits a little below the card
// centers, so the cards appear to rest on it (matching the reference layout).
const GUIDE_OFFSET_Y = 304; // px the guide sits below the card centers
const GUIDE_PADDING = 0.45; // how far past the outer slots the line extends (u)
const GUIDE_PATH = (() => {
  const pts: string[] = [];
  for (let u = -GUIDE_PADDING; u <= ARC_SPAN + GUIDE_PADDING + 1e-6; u += 0.1) {
    const { x, y } = pathAt(u);
    pts.push(`${x.toFixed(1)},${(y + GUIDE_OFFSET_Y).toFixed(1)}`);
  }
  return "M" + pts.join(" L");
})();

// Master conveyor coordinate as a function of scroll progress (0..1).
// Cards are fully off-screen 1.5 units beyond either edge. At progress 0, card 0
// sits just off the bottom-right; at progress 1, the last card has dived off the
// bottom-left. Every other card trails by its index, so the flow is continuous.
const OFF_MARGIN = 1.5; // units beyond an edge at which a card is fully off-screen
const U_START = -OFF_MARGIN; // card 0 starts just off the bottom-right
const U_END = CARDS.length - 1 + ARC_SPAN + OFF_MARGIN; // last card fully exited

export default function CollectionsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  const addToRefs = (el: HTMLDivElement | null) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el);
    }
  };

  useGSAP(
    () => {
      const cards = cardsRef.current;
      if (!cards.length) return;

      // Anchor cards by their center; opacity stays 1 — the stage's
      // `overflow-hidden` clips whatever sits in the off-screen corners.
      gsap.set(cards, { xPercent: -50, yPercent: -50, opacity: 1 });

      // Place every card for a 0..1 sub-progress. Card i trails the master
      // coordinate by i units, so the cards form a moving conveyor: entering
      // bottom-right, arcing across 5 slots, exiting bottom-left.
      const layout = (progress: number) => {
        const U = lerp(U_START, U_END, progress);
        cards.forEach((card, i) => {
          const { x, y, rotation } = pathAt(U - i);
          gsap.set(card, { x, y, rotation });
        });
      };

      // Initial hidden states for the sequenced reveal.
      gsap.set(headingRef.current, { clipPath: "inset(0 100% 0 0)" }); // wipes L→R
      gsap.set(imageRef.current, { clipPath: "inset(100% 0 0 0)" }); // wipes bottom→top
      layout(0); // cards parked off-screen bottom-right

      // One scrubbed timeline sequences the whole section as the user scrolls:
      //   1) heading wipes in left→right
      //   2) image wipes in bottom→top
      //   3) the card conveyor runs
      // CSS `sticky` (below) does the pinning — we avoid ScrollTrigger's `pin`.
      const proxy = { p: 0 };
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      tl.to(headingRef.current, { clipPath: "inset(0 0% 0 0)", duration: 1 })
        .to(imageRef.current, { clipPath: "inset(0% 0 0 0)", duration: 1 })
        .to(proxy, { p: 1, duration: 4, onUpdate: () => layout(proxy.p) });
    },
    { scope: sectionRef },
  );

  return (
    // Tall parent: gives the sticky stage room to scroll through.
    <section
      ref={sectionRef}
      className="relative h-[400vh] bg-[#1B1B1B]"
    >
      {/* Sticky stage: pinned via CSS while the parent scrolls past. */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#1B1B1B] bg-right bg-contain bg-no-repeat">
        <div className="absolute w-full h-[700px] -bottom-[150px] left-0 z-10">
          <img src="/images/line.png" alt="" className="object-cover" />
        </div>
        { /* Image */}
        <div ref={imageRef} className="absolute w-[600px] h-[950px] bottom-0 right-0 z-0">
          <img src="/images/baloch.png" alt="" className="object-fill" />
        </div>
        {/* Headings */}
        <div ref={headingRef} className="absolute top-[80px] left-[110px] z-20 flex flex-col">
          <h2 className="andrea text-[90px] leading-[120px] text-white text-left">
            Shop by
          </h2>
          <h2 className="valturin text-[68px] text-[#C0A062] mt-2 text-left ml-[200px]">
            Collection
          </h2>
        </div>

        {/* Arc anchor: the guide line and cards are centered here and offset by GSAP. */}
        <div className="absolute left-1/2 top-1/2 z-10 h-0 w-0">
          {/* Faint guide line tracing the arc the cards rest along. */}
          <svg
            className="absolute left-0 top-0 overflow-visible pointer-events-none"
            width="0"
            height="0"
            aria-hidden="true"
          >
            <path
              d={GUIDE_PATH}
              fill="none"
              stroke="#C0A062"
              strokeOpacity={0.28}
              strokeWidth={1.5}
            />
          </svg>

          {CARDS.map((card) => (
            <div
              key={card.id}
              ref={addToRefs}
              className="absolute left-0 top-0 w-[300px] bg-white rounded-xl p-4 shadow-[0_18px_45px_rgba(0,0,0,0.55)] will-change-transform"
            >
              <div className="w-full h-[290px] bg-gray-100 rounded-lg mb-5 overflow-hidden">
                <img
                  src={card.image}
                  alt={card.label}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="flex justify-between items-center mb-4 px-1">
                <h3 className="text-gray-500 font-medium text-base">{card.label}</h3>
                <span className="text-gray-400 text-base font-medium">{card.price}</span>
              </div>
              <div className="flex gap-2.5">
                <button className="flex-1 bg-[#C0A062] text-white text-xs uppercase tracking-wider font-semibold py-3 rounded-sm hover:bg-[#a6884f] transition-colors">
                  Try On
                </button>
                <button className="flex-1 bg-white border border-gray-300 text-gray-500 text-xs uppercase tracking-wider font-semibold py-3 rounded-sm hover:bg-gray-50 transition-colors">
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Description + CTA */}
        <div className="absolute bottom-[90px] left-1/2 z-20 -translate-x-1/2 flex flex-col items-center text-center">
          <p className="text-gray-300 gotham text-[18px] leading-[30px] max-w-[420px]">
            Explore Curated Collections Designed For Every Mood, Lifestyle, And
            Finish.
          </p>
          <a className="mt-6 flex items-center gap-4 group" href="/shop">
            <span className="w-12 h-12 rounded-full border border-gray-400 flex items-center justify-center text-gray-300 transition-colors duration-300 group-hover:bg-white group-hover:text-black">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                />
              </svg>
            </span>
            <span className="text-white gotham text-[16px] uppercase tracking-wider">
              Learn More
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
