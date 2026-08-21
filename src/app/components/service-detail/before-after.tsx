"use client";

import React from "react";
import Image from "next/image";
import { tone as palette, type Tone } from "./tone";

/**
 * A before/after comparison — two photos of the same head stacked in one frame,
 * with a draggable divider wiping between them.
 *
 * The divider is a real `<input type="range">` laid over the frame at full size
 * and made invisible. That is deliberate: it gets pointer drag, touch drag,
 * arrow keys, Home/End, focus and a screen-reader announcement for free, none
 * of which a div with mousemove handlers would have. The gold line and knob you
 * actually see are decoration that follows the same value.
 *
 * Both photos must be shot from the same distance and angle, otherwise the wipe
 * reads as two different pictures rather than one hair before and after.
 */
export default function BeforeAfter({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  caption,
  tone = "dark",
}: {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  caption?: string;
  tone?: Tone;
}) {
  const [position, setPosition] = React.useState(50);
  const c = palette[tone];

  return (
    <figure className="w-full">
      <div className="relative group select-none">
        {/* Offset gold frame — the same treatment the section blocks use, so
            the comparison reads as part of the page rather than a widget. */}
        <div className="absolute -inset-4 md:-inset-6 border border-[#ccb884]/25 rounded-[28px] pointer-events-none translate-x-3 translate-y-3 md:translate-x-5 md:translate-y-5" />

        <div className="relative aspect-[4/3] md:aspect-[16/10] rounded-[24px] overflow-hidden bg-[#2a2a2a]">
          {/* The "after" sits underneath and is never clipped, so the frame is
              always fully covered no matter where the divider is. */}
          <Image
            src={after}
            alt={afterLabel}
            fill
            sizes="(max-width: 1024px) 100vw, 900px"
            className="object-cover"
          />

          {/* The "before" is clipped from the right, revealing the after. */}
          <div
            className="absolute inset-0"
            style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
          >
            <Image
              src={before}
              alt={beforeLabel}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
            />
          </div>

          {/* Corner labels. Each one fades out as the divider passes it, so a
              label never sits over the half it doesn't describe. */}
          <span
            className="absolute top-4 left-4 md:top-6 md:left-6 gotham text-[11px] md:text-[12px] tracking-[3px] uppercase text-white px-4 py-2 rounded-full bg-black/45 backdrop-blur-sm transition-opacity duration-300 pointer-events-none"
            style={{ opacity: position < 18 ? 0 : 1 }}
          >
            {beforeLabel}
          </span>
          <span
            className="absolute top-4 right-4 md:top-6 md:right-6 gotham text-[11px] md:text-[12px] tracking-[3px] uppercase text-white px-4 py-2 rounded-full bg-black/45 backdrop-blur-sm transition-opacity duration-300 pointer-events-none"
            style={{ opacity: position > 82 ? 0 : 1 }}
          >
            {afterLabel}
          </span>

          {/* Divider line and knob. */}
          <div
            className="absolute top-0 bottom-0 w-[2px] bg-[#ccb884] pointer-events-none"
            style={{ left: `${position}%`, transform: "translateX(-1px)" }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46px] h-[46px] md:w-[54px] md:h-[54px] rounded-full bg-[#ccb884] shadow-lg flex items-center justify-center gap-[3px] transition-transform duration-300 group-hover:scale-110">
              <Chevron className="rotate-180" />
              <Chevron />
            </div>
          </div>

          {/* The control itself. */}
          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={position}
            onChange={(e) => setPosition(Number(e.target.value))}
            aria-label={`Drag to compare ${beforeLabel.toLowerCase()} and ${afterLabel.toLowerCase()}`}
            aria-valuetext={`${Math.round(position)}% ${beforeLabel.toLowerCase()}`}
            className="ba-range absolute inset-0 w-full h-full cursor-ew-resize opacity-0 m-0 appearance-none bg-transparent"
          />
        </div>
      </div>

      {caption && (
        <figcaption
          className={`gotham ${c.muted} text-[13px] md:text-[14px] leading-[24px] mt-8 md:mt-10 text-center font-light`}
        >
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="#1B1B1B"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`w-[11px] h-[11px] ${className}`}
      aria-hidden="true"
    >
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}
