"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useReveal } from "../service-detail/use-reveal";
import { tone as palette, type Tone } from "../service-detail/tone";

/** One stage of a filmed process. */
export type ProcessStage = {
  title: string;
  body: string;
  /** Still shown in the non-interactive form, and the video's poster. */
  image?: string;
  /**
   * Where this stage begins in `video`, in seconds. Omit them all and the
   * clip is simply divided evenly — useful before the salon has timed a new
   * video, and harmless once they have.
   */
  at?: number;
};

export type ProcessContent = {
  eyebrow: string;
  heading: string;
  headingAccent?: string;
  intro?: string;
  video?: string;
  steps: ProcessStage[];
};

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

function Heading({
  c,
  flow,
}: {
  c: (typeof palette)[Tone];
  flow: ProcessContent;
}) {
  return (
    <>
      <p
        className={`gotham ${c.eyebrow} text-[length:var(--fs-small)] uppercase tracking-[6px] mb-[var(--space-20)]`}
      >
        {flow.eyebrow}
      </p>
      <h2 className={`valturin text-[length:var(--fs-h2)] leading-[1.2] ${c.heading}`}>
        {flow.heading}
        <span className="andrea text-[#ccb884]"> {flow.headingAccent}</span>
      </h2>
      <p
        className={`gotham text-[length:var(--fs-body)] leading-[1.8] ${c.body} font-light mt-[var(--space-24)]`}
      >
        {flow.intro}
      </p>
    </>
  );
}

/**
 * A filmed process, told by the clip.
 *
 * Shared by the Units page and the Silk Press page: both are four stages and
 * one start-to-finish video, so both get the same treatment rather than two
 * near-identical components drifting apart.
 *
 * The video is the clock. It does not load or play until the section is
 * actually on screen, and from then it runs straight through — as the
 * playhead crosses each cue point the matching stage lights up on the left.
 * Nothing pauses and nothing asks to be scrolled: stand still and the whole
 * four-stage sequence plays itself out.
 *
 * Scrolling still works, and still moves forward through the stages, for
 * anyone who would rather not wait. It only ever skips ahead — scrolling
 * never rewinds the clip, because watching it jump backwards is worse than
 * waiting.
 *
 * The four-segment rail under the video is that timeline made visible, with
 * segment widths set by each stage's real length and the fill read off the
 * playhead.
 *
 * Below `lg`, and for anyone who prefers reduced motion, none of it applies:
 * the stages are listed and the video is handed over with controls. Pinning
 * five screens on a phone is a trap, and a sequence that exists only in
 * motion still needs a still version.
 */
export default function ProcessFlow({
  flow,
  tone = "dark",
}: {
  flow: ProcessContent;
  tone?: Tone;
}) {
  const scope = useReveal<HTMLElement>();
  const c = palette[tone];

  const STEPS = flow.steps.length;
  /** The scroll track: one screen per stage, plus one for the closing panel. */
  const BANDS = STEPS + 1;

  /**
   * Where each stage starts. A stage with no `at` falls back to an even
   * share of the clip, so a page can carry this section before anyone has
   * sat down and timed the footage.
   */
  const cueAt = (index: number, total: number) =>
    flow.steps[index].at ?? (total / STEPS) * index;

  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [interactive, setInteractive] = useState(false);
  const [duration, setDuration] = useState(0);
  /**
   * The playhead, in seconds. Everything the section shows is derived from
   * it — which stage is lit, how full the rail is — so the clip and the copy
   * cannot drift apart.
   */
  const [playhead, setPlayhead] = useState(0);


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
  const ranges = flow.steps.map((step, i) => {
    const from = cueAt(i, duration);
    const to = i + 1 < STEPS ? cueAt(i + 1, duration) : duration;
    return { from, to, length: Math.max(0, to - from) };
  });
  const timed = duration > 0;

  /** Which stage a given moment of the clip belongs to. */
  const stageAt = (seconds: number) => {
    let found = 0;
    for (let i = 0; i < STEPS; i += 1) {
      if (seconds >= cueAt(i, duration)) found = i;
    }
    return found;
  };

  /**
   * Everything is read off the playhead, including whether the sequence is
   * over. It used to be a latch that, once set, never cleared — so after the
   * clip finished the steps stayed lit and scrolling back could not bring
   * them back, and a reload inside the section showed every step complete
   * while the video started again from the top.
   */
  const done = timed && playhead >= duration - 0.3;
  const stage = done ? STEPS : stageAt(playhead);

  // Nothing loads or plays until the section is genuinely on screen, and it
  // stops again once it leaves. This is the fix for the clip having already
  // played its first stage by the time anyone scrolled down to it: the old
  // handler ran once on mount, and a negative scroll offset clamped to the
  // first stage and started it.
  //
  // The test is geometric rather than an IntersectionObserver because the
  // same handler already has to measure the track for the skip-ahead below,
  // and one mechanism reading one source beats two that can disagree.
  const onScreenRef = useRef(false);
  const startedRef = useRef(false);
  /** The band the reader was last in, so a seek only happens on a change. */
  const bandRef = useRef(-1);

  useEffect(() => {
    if (!interactive) return;

    const sync = () => {
      const host = stageRef.current;
      const video = videoRef.current;
      const track = trackRef.current;
      if (!host || !video || !track) return;

      // The pinned panel is a screen tall, so "covers the middle of the
      // viewport" is the honest way to ask whether the reader is here.
      const rect = host.getBoundingClientRect();
      const middle = window.innerHeight / 2;
      const onScreen = rect.top <= middle && rect.bottom >= middle;

      if (onScreen !== onScreenRef.current) {
        onScreenRef.current = onScreen;
        if (onScreen) {
          startedRef.current = true;
          // Resumes where it left off; coming back does not start it over.
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      }

      if (!onScreen || !startedRef.current || !video.duration) return;

      const distance = track.offsetHeight - window.innerHeight;
      const travelled = window.scrollY - track.offsetTop;
      if (distance <= 0 || travelled <= 0) return;

      const progress = Math.min(1, travelled / distance);
      const band = Math.min(BANDS - 1, Math.floor(progress * BANDS));

      // Only a change of band moves the clip. Seeking on every scroll event
      // would drag the playhead back to the band's cue each time the reader
      // nudged the wheel, fighting the playback that is meant to carry them.
      if (band === bandRef.current) return;
      bandRef.current = band;

      // Both directions. Scrolling up rewinds to that stage's cue and the
      // copy follows it back, because the playhead is the only thing the
      // left-hand column reads.
      const cue =
        band >= STEPS ? video.duration : cueAt(band, video.duration);
      video.currentTime = cue;
      setPlayhead(cue);
      void video.play().catch(() => {});
    };

    sync();
    window.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      window.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
    // `flow` is a module-level constant on both pages that use this, so the
    // stage count and cue lookup derived from it never change for the life
    // of the component. Listing them would re-register the scroll listener
    // on every render for no gain.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [interactive]);

  // Each stage plays at its own rate, so forty-five seconds of shampoo and
  // twelve of styling take roughly the same time to watch.
  useEffect(() => {
    const video = videoRef.current;
    const range = ranges[stage];
    if (!video || !timed || stage >= STEPS || !range || range.length <= 0) return;

    video.playbackRate = Math.min(
      MAX_RATE,
      Math.max(1, range.length / TARGET_STAGE_SECONDS)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage, timed, duration]);

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
          <Heading c={c} flow={flow} />

          <div className="relative mt-[var(--space-40)] overflow-hidden rounded-[24px] bg-[#2a2a2a]">
            <video
              src={flow.video}
              controls
              playsInline
              preload="metadata"
              className="h-full w-full"
            />
          </div>

          <ol className="mt-[var(--space-56)] flex flex-col gap-[var(--space-40)]">
            {flow.steps.map((step, i) => (
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
      aria-label={`${flow.heading} ${flow.headingAccent ?? ""}`.trim()}
    >
      <div
        ref={stageRef}
        className="sticky top-0 flex h-screen items-center overflow-hidden px-[var(--space-section-x)] py-[var(--space-40)]"
      >
        <div className="mx-auto grid w-full max-w-[1400px] grid-cols-2 items-center gap-[var(--space-64)]">
          {/* All four stages stay in the DOM — a screen reader should get the
              whole process without having to scroll it out of the page. */}
          <div>
            <Heading c={c} flow={flow} />

            <ol className="mt-[var(--space-40)] flex flex-col gap-[var(--space-28)]">
              {flow.steps.map((step, i) => {
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
              {/* `preload="none"`: nothing is fetched until the reader is
                  actually here. The metadata arrives with the first play
                  rather than with the page. */}
              <video
                ref={videoRef}
                src={flow.video}
                poster={flow.steps[0]?.image}
                muted
                playsInline
                preload="none"
                aria-hidden="true"
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
                onTimeUpdate={(e) => setPlayhead(e.currentTarget.currentTime)}
                onEnded={(e) => setPlayhead(e.currentTarget.duration || 0)}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>

            {/* The clip's own timeline, in four. */}
            <div className="mt-[var(--space-24)] flex gap-[8px]" aria-hidden="true">
              {/* Segment widths are the stages' real lengths, so the rail is
                  the clip's timeline rather than four equal boxes — the
                  opening stage genuinely is half the footage. */}
              {flow.steps.map((step, i) => (
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
