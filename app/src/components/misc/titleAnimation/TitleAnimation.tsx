"use client";

import { cn } from "@/app/src/utils";
import { usePrefersReducedMotion } from "@/app/src/hooks/usePrefersReducedMotion";
import { useScrollIntensity } from "@/app/src/hooks/useScrollIntensity";
import {
  animate,
  DOMSegmentWithTransition,
  motion,
  MotionStyle,
  stagger,
  useTransform,
} from "motion/react";
import { CSSProperties, RefObject, useEffect, useMemo, useRef } from "react";

// Kamino-VF exposes a `wght` axis of 1–1000
const PEAK_WEIGHT = 1000;

// Intro timing (s): each letter rises in, then swells to peak weight and relaxes back to rest.
// Letters start `stagger` apart, so the swell runs across the title as a wave.
const INTRO = {
  delay: 0.1,
  rise: 0.7,
  /** The weight swell starts this long after each letter starts rising. */
  swellDelay: 0,
  swell: 0.65,
  relax: 1.2, //
  stagger: 0.02,
  /**
   * The `fadeIn` element starts fading in `fadeOverlap` before the title finishes rising, and
   * finishes with the title's last weight relax, so both settle together.
   */
  fadeOverlap: 0.2,
  ease: [0.22, 1, 0.36, 1],
} as const;

// Where letters start, below their line. A little past 100% so no antialiased edge peeks in.
const START_Y = "120%";

/**
 * Hides the letters below their line until the intro reveals them, in CSS so they're hidden from the
 * very first paint. Only with motion allowed and scripting on, so reduced motion or no JS shows them.
 * Must match `START_Y`.
 */
const HIDDEN =
  "[@media(prefers-reduced-motion:no-preference)_and_(scripting:enabled)]:[transform:translateY(120%)]";

/** Same as `HIDDEN`, for the `fadeIn` element: put it on that element so it's hidden from first paint. */
export const TRANSPARENT =
  "[@media(prefers-reduced-motion:no-preference)_and_(scripting:enabled)]:opacity-0";

type TitleAnimationProps = {
  label: string;
  className?: string;
  /** The title's resting weight; it swells to the axis max and relaxes back to this. */
  restWeight?: number;
  /** Holds the intro (letters stay hidden) until true, e.g. until a page transition has finished. */
  ready?: boolean;
  /** An element (e.g. a description) faded in alongside the intro. Give it the `TRANSPARENT` class. */
  fadeIn?: RefObject<HTMLElement | null>;
};

/**
 * A title whose letters rise in from below their line on a stagger, each swelling in weight as it
 * goes, so a wave runs across it. Scrolling hard adds weight on top.
 */
export default function TitleAnimation({
  label,
  className,
  restWeight = 100,
  ready = true,
  fadeIn,
}: TitleAnimationProps) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const titleRef = useRef<HTMLHeadingElement>(null);

  // Scroll intensity -> extra weight, layered on top of the intro animation
  const scrollIntensity = useScrollIntensity(titleRef);
  const scrollBoost = useTransform(
    scrollIntensity,
    (i) => i * (PEAK_WEIGHT - restWeight),
  );

  // Each letter's weight is its own intro weight plus the shared scroll boost, capped at the axis max.
  const letterStyle = useMemo(
    () =>
      ({
        "--intro-wght": restWeight,
        fontVariationSettings: `"wght" min(calc(var(--intro-wght) + var(--scroll-wght, 0)), ${PEAK_WEIGHT})`,
      }) as CSSProperties,
    [restWeight],
  );

  const words = label.split(" ");

  useEffect(() => {
    const title = titleRef.current;
    if (!title || !ready || prefersReducedMotion) return;
    const fadeTarget = fadeIn?.current;

    const letters = title.querySelectorAll<HTMLElement>("[data-letter]");
    const lastLetterStart = INTRO.delay + INTRO.stagger * (letters.length - 1);
    // When the last letter finishes rising, and when its weight settles back to rest.
    const riseEnd = lastLetterStart + INTRO.rise;
    const weightEnd =
      lastLetterStart + INTRO.swellDelay + INTRO.swell + INTRO.relax;
    const fadeStart = riseEnd - INTRO.fadeOverlap;

    // Letters rise in staggered, and each one's weight swells and relaxes on the same stagger.
    // The weight is a single keyframed tween so velocity never drops to zero mid-way.
    const controls = animate([
      [
        letters,
        { y: [START_Y, "0%"] },
        {
          at: INTRO.delay,
          duration: INTRO.rise,
          ease: INTRO.ease,
          delay: stagger(INTRO.stagger),
        },
      ],
      [
        letters,
        { "--intro-wght": [restWeight, PEAK_WEIGHT, restWeight] },
        {
          at: INTRO.delay + INTRO.swellDelay,
          duration: INTRO.swell + INTRO.relax,
          times: [0, INTRO.swell / (INTRO.swell + INTRO.relax), 1],
          ease: [
            [0.4, 0, 0.2, 1],
            [0.6, 0, 0.4, 1],
          ],
          delay: stagger(INTRO.stagger),
        },
      ],
      ...(fadeTarget
        ? [
            [
              fadeTarget,
              { opacity: [0, 1] },
              {
                at: fadeStart,
                duration: weightEnd - fadeStart,
                // Eases out like the weight's relax, so both slow to a stop together.
                ease: [0.6, 0, 0.4, 1],
              },
            ] satisfies DOMSegmentWithTransition,
          ]
        : []),
    ]);

    return () => controls.stop();
  }, [prefersReducedMotion, ready, restWeight, fadeIn]);

  return (
    <motion.h1
      ref={titleRef}
      aria-label={label}
      style={{ "--scroll-wght": scrollBoost } as MotionStyle}
      className={className}
    >
      {words.map((word, w) => (
        <span key={`${word}-${w}`} aria-hidden>
          {/* Clips each word to its line so letters rise from below it. Letters get a line-height
              equal to the font's full glyph height (ascent 1.3em + descent 0.2em), so the clip never
              cuts their tops or descenders, even on a tight `leading`; the margins give the space
              back so the title keeps its own line-height. */}
          <span className="inline-block overflow-hidden align-bottom my-[calc((1lh_-_1.5em)/2)]">
            {[...word].map((letter, l) => (
              <span
                key={l}
                data-letter
                className={cn("inline-block leading-[1.5]", HIDDEN)}
                style={letterStyle}
              >
                {letter}
              </span>
            ))}
          </span>
          {w < words.length - 1 && " "}
        </span>
      ))}
    </motion.h1>
  );
}
