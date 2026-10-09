"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReveal } from "../service-detail/use-reveal";
import { tone as palette, type Tone } from "../service-detail/tone";
import { unitsPage } from "@/data/units";

const { install } = unitsPage;
const STEPS = install.steps.length;

/**
 * How long a stage should take to watch, in seconds.
 *
 * The stages are not equal: the clip gives forty-five seconds to the natural
 * hair and twelve to the finish. Played at normal speed the opener would
 * stall the page for the better part of a minute, so each stage is sped up
 * to land near this mark — which also evens out the pacing, so the sequence
 * does not crawl at the start and sprint at the end. Nothing is cut; the
 * clip plays in full, faster. Raise it to slow the sequence down.
 */
const TARGET_STAGE_SECONDS = 9;
const MAX_RATE = 4;

/** The scroll track: one screen per stage, plus one for the closing panel. */
const BANDS = STEPS + 1;

function Heading({ c }: { c: (typeof palette)[Tone] }) {
  return (
    <>
      <p
        className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] uppercase tracking-[6px] mb-[var(--space-20)]`}
      >
        {install.eyebrow}
      </p>
      <h2 className={`valturin text-[length:var(--fs-h2)] leading-[1.2] ${c.heading}`}>
        {install.heading}
        <span className="andrea text-[#ccb884]"> {install.headingAccent}</span>
      </h2>
      <p
        className={`gotham text-[length:var(--fs-body)] leading-[1.8] ${c.body} font-light mt-[var(--space-24)]`}
      >
        {install.intro}
      </p>
    </>
  );
}

/**
 * The install flow, told by scrolling.
 *
 * The section pins for five screens. Each of the first four advances the clip
 * by one quarter of its running time and reveals that stage's text; the video
 * then holds and asks for the next scroll. The fifth is the closing panel.
 * Nothing is cut from the file — the quarters are read off its own duration,
 * so recutting the footage recuts the chapters.
 *
 * The four-segment rail under the video is that timeline made visible: how
 * many stages there are, which is running, and how far through it is. It is
 * the progress bar and the scroll affordance at once.
 *
 * Below `lg`, and for anyone who prefers reduced motion, none of it applies:
 * the stages are listed and the video is handed over with controls. Pinning
 * five screens on a phone is a trap, and a sequence that exists only in
 * motion still needs a still version.
 */
export default function InstallFlow({ tone = "dark" }: { tone?: Tone }) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];

  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  /** Bounds of the quarter currently playing, in seconds. */
  const startAtRef = useRef(0);
  const stopAtRef = useRef(0);

  const [interactive, setInteractive] = useState(false);
  const [duration, setDuration] = useState(0);
  /** 0–3 through the stages, STEPS once the sequence is done. */
  const [stage, setStage] = useState(0);
  /**
   * The playhead, in seconds. The rail reads this rather than the scroll
   * position: the bar is the clip's progress through a stage, and tying it
   * to scroll made it fill while the video sat still.
   */
  const [playhead, setPlayhead] = useState(0);
  const [holding, setHolding] = useState(false);

  // Gate on viewport and motion preference, re-checking on change so a
  // rotated phone or a dragged window lands in the right mode.
  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1024px)");
    const still = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setInteractive(wide.matches && !still.matches);

    sync();
    wide.addEventListener("change", sync);
    still.addEventListener("change", sync);
    return () => {
      wide.removeEventListener("change", sync);
      still.removeEventListener("change", sync);
    };
  }, []);

  /**
   * Each stage's span in the clip: its own cue point, running until the next
   * stage's cue, with the last running to the end.
   */
  const ranges = install.steps.map((step, i) => {
    const from = step.at;
    const to = i + 1 < STEPS ? install.steps[i + 1].at : duration;
    return { from, to, length: Math.max(0, to - from) };
  });
  const timed = duration > 0;

  /** Start a stage's span playing, and arm the pause that ends it. */
  const playStage = useCallback(
    (index: number) => {
      const video = videoRef.current;
      const range = ranges[index];
      if (!video || !timed || !range || range.length <= 0) return;

      startAtRef.current = range.from;
      stopAtRef.current = Math.min(duration, range.to);
      video.playbackRate = Math.min(
        MAX_RATE,
        Math.max(1, range.length / TARGET_STAGE_SECONDS)
      );
      video.currentTime = range.from;
      setPlayhead(range.from);
      setHolding(false);
      // Rejection is routine — the stage can change again before the first
      // frame decodes — so it must not surface as an error.
      void video.play().catch(() => {});
    },
    // `ranges` is derived from `duration`, so that dependency covers it.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [duration, timed]
  );

  // Scroll picks the stage; the video follows the stage.
  useEffect(() => {
    if (!interactive) return;

    let current = -1;

    const onScroll = () => {
      const track = trackRef.current;
      if (!track) return;

      const distance = track.offsetHeight - window.innerHeight;
      if (distance <= 0) return;

      const travelled = window.scrollY - track.offsetTop;
      const progress = Math.min(1, Math.max(0, travelled / distance));
      const band = Math.min(BANDS - 1, Math.floor(progress * BANDS));

      if (band === current) return;
      current = band;
      setStage(band);

      if (band < STEPS) {
        playStage(band);
        return;
      }

      // The closing panel holds the last frame rather than looping.
      const video = videoRef.current;
      if (video) {
        video.pause();
        video.currentTime = Math.max(0, duration - 0.05);
      }
      setPlayhead(duration);
      setHolding(false);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [interactive, playStage, duration]);

  /** Pause the clip the moment its quarter is up. */
  const onTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || !interactive || stage >= STEPS || !stopAtRef.current) return;

    setPlayhead(video.currentTime);

    // Seeking is asynchronous, so the first timeupdate after a stage change
    // can still report the previous playhead. Scrolling back from stage four
    // to stage one would then see 92s against a 23s limit and hold the clip
    // before it had played a frame. A position behind this stage's start has
    // to be stale by definition, so wait for the seek to land.
    if (video.currentTime < startAtRef.current) return;

    if (video.currentTime >= stopAtRef.current) {
      video.pause();
      setHolding(true);
    }
  };

  const done = stage >= STEPS;

  /** How full a rail segment is: played stages are whole, the live one tracks
   *  the playhead, and the ones ahead are empty. */
  const fillOf = (i: number) => {
    if (done || i < stage) return 1;
    if (i > stage) return 0;
    const range = ranges[i];
    if (!range || range.length <= 0) return 0;
    return Math.min(1, Math.max(0, (playhead - range.from) / range.length));
  };

  /* ----------------------------- still form ----------------------------- */

  if (!interactive) {
    return (
      <section
        ref={scope}
        className={`reveal-scope relative w-full ${c.section} py-[var(--space-section-y)] px-[var(--space-section-x)] overflow-x-clip`}
      >
        <div className="relative z-10 mx-auto max-w-[760px]">
          <Heading c={c} />

          <div className="relative mt-[var(--space-40)] overflow-hidden rounded-[24px] bg-[#2a2a2a]">
            <video
              src={install.video}
              controls
              playsInline
              preload="metadata"
              className="h-full w-full"
            />
          </div>

          <ol className="mt-[var(--space-56)] flex flex-col gap-[var(--space-40)]">
            {install.steps.map((step, i) => (
              <li key={step.title} className="flex gap-[var(--space-24)]">
                <span
                  aria-hidden="true"
                  className="valturin shrink-0 leading-none text-[#ccb884] text-[length:clamp(24px,21.65px_+_0.99vw,32px)]"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3
                    className={`valturin text-[length:clamp(20px,17.65px_+_0.988vw,28px)] leading-[1.3] ${c.bodyStrong} mb-[12px]`}
                  >
                    {step.title}
                  </h3>
                  <p
                    className={`gotham text-[length:var(--fs-body)] leading-[1.8] ${c.body} font-light`}
                  >
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );
  }

  /* -------------------------- interactive form -------------------------- */

  return (
    <section
      ref={trackRef}
      className={`relative w-full ${c.section}`}
      style={{ height: `${BANDS * 100}vh` }}
      aria-label="How a unit is installed"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden px-[var(--space-section-x)] py-[var(--space-40)]">
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 items-center gap-[var(--space-64)]">
          {/* All four stages stay in the DOM — a screen reader should get the
              whole process without having to scroll it out of the page. */}
          <div>
            <Heading c={c} />

            <ol className="mt-[var(--space-40)] flex flex-col gap-[var(--space-28)]">
              {install.steps.map((step, i) => {
                const reached = i <= stage;
                const active = i === stage;

                return (
                  <li
                    key={step.title}
                    className="flex gap-[var(--space-24)] transition-opacity duration-500"
                    style={{ opacity: reached ? 1 : 0.22 }}
                  >
                    <span
                      aria-hidden="true"
                      className={`valturin shrink-0 leading-none transition-colors duration-500 text-[length:clamp(24px,21.65px_+_0.99vw,32px)] ${
                        active ? "text-[#ccb884]" : c.muted
                      }`}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>

                    <div>
                      <h3
                        className={`valturin text-[length:clamp(20px,17.65px_+_0.988vw,28px)] leading-[1.3] ${c.bodyStrong} mb-[12px]`}
                      >
                        {step.title}
                      </h3>
                      {/* Only the live stage carries its body copy. Four
                          paragraphs at once is a wall, and taking them one at
                          a time is the whole point of pinning. */}
                      <p
                        className={`gotham overflow-hidden text-[length:var(--fs-body)] leading-[1.8] ${c.body} font-light transition-all duration-500`}
                        style={{
                          maxHeight: active ? "14rem" : "0rem",
                          opacity: active ? 1 : 0,
                        }}
                      >
                        {step.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute -inset-4 translate-x-3 translate-y-3 rounded-[28px] border border-[#ccb884]/25 md:-inset-6 md:translate-x-5 md:translate-y-5" />

            <div className="relative aspect-[4/5] overflow-hidden rounded-[24px] bg-[#2a2a2a]">
              <video
                ref={videoRef}
                src={install.video}
                poster={install.steps[0]?.image}
                muted
                playsInline
                preload="auto"
                aria-hidden="true"
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
                onTimeUpdate={onTimeUpdate}
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Held between stages: the page is waiting on the reader and
                  has to say so. */}
              <div
                className="pointer-events-none absolute inset-0 flex items-end justify-center bg-gradient-to-t from-[#1B1B1B]/85 via-[#1B1B1B]/10 to-transparent pb-[var(--space-40)] transition-opacity duration-500"
                style={{ opacity: holding && !done ? 1 : 0 }}
              >
                <span className="flex flex-col items-center gap-[10px] gotham text-[length:var(--fs-small)] uppercase tracking-[4px] text-white">
                  Keep scrolling
                  <span aria-hidden="true" className="text-[#ccb884]">
                    ↓
                  </span>
                </span>
              </div>
            </div>

            {/* The clip's own timeline, in four. */}
            <div className="mt-[var(--space-24)] flex gap-[8px]" aria-hidden="true">
              {/* Segment widths are the stages' real lengths, so the rail is
                  the clip's timeline rather than four equal boxes — the
                  opening stage genuinely is half the footage. */}
              {install.steps.map((step, i) => (
                <div
                  key={step.title}
                  style={{ flexGrow: ranges[i].length || 1, flexBasis: 0 }}
                  className={`h-[2px] ${
                    tone === "light" ? "bg-[#1B1B1B]/12" : "bg-white/15"
                  }`}
                >
                  <div
                    /* timeupdate only fires a few times a second, so the
                       width is eased between readings rather than stepping. */
                    className="h-full bg-[#ccb884] transition-[width] duration-300 ease-linear"
                    style={{ width: `${fillOf(i) * 100}%` }}
                  />
                </div>
              ))}
            </div>

            <div className="mt-[12px] flex items-baseline justify-between gap-[var(--space-16)]">
              <p
                className={`gotham text-[length:var(--fs-small)] uppercase tracking-[3px] ${c.muted}`}
                aria-hidden="true"
              >
                {done ? "Complete" : `Stage ${stage + 1} of ${STEPS}`}
              </p>

              {/* The ending. The moment the whole process has just been
                  explained is the moment to ask for the appointment. */}
              <Link
                href="/dashboard/book"
                className="group inline-flex items-center gap-3 gotham text-[length:var(--fs-body)] text-[#ccb884] transition-opacity duration-500"
                style={{
                  opacity: done ? 1 : 0,
                  pointerEvents: done ? "auto" : "none",
                }}
                tabIndex={done ? undefined : -1}
              >
                <span className="border-b border-transparent transition-colors duration-300 group-hover:border-[#ccb884]">
                  Book a consultation
                </span>
                <span
                  aria-hidden="true"
                  className="transition-transform duration-300 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
