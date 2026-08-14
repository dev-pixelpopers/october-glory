"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * The site's standard scroll entrance, shared by every service-detail section.
 *
 * Put the returned ref on the section root, then mark anything that should
 * rise and fade in with `data-reveal`. Add `data-reveal-delay="1"`, `"2"`…
 * to stagger siblings — matching the 0.12s cascade used on the natural-styles
 * gallery and services grid.
 *
 * Elements start hidden via the `.reveal-scope [data-reveal]` rule in
 * globals.css, which also restores them under prefers-reduced-motion.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const scope = useRef<T>(null);

  useGSAP(
    () => {
      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const targets = gsap.utils.toArray<HTMLElement>(
        "[data-reveal]",
        scope.current
      );

      targets.forEach((el) => {
        if (reduced) {
          gsap.set(el, { opacity: 1, y: 0 });
          return;
        }

        gsap.fromTo(
          el,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            delay: Number(el.dataset.revealDelay ?? 0) * 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope }
  );

  return scope;
}
