"use client";

import { cn } from "@/app/src/utils";
import { usePrefersReducedMotion } from "@/app/src/hooks/usePrefersReducedMotion";
import { useScrollIntensity } from "@/app/src/hooks/useScrollIntensity";
import {
  animate,
  motion,
  MotionStyle,
  stagger,
  useTransform,
} from "motion/react";
import { CSSProperties, useEffect, useRef } from "react";

import data from "@/app/data/hero.json";

// Kamino-VF exposes a `wght` axis of 1–1000; `rest` matches `.hero-title`
const WEIGHT = { rest: 100, peak: 1000 } as const;

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
   * The description starts fading in `fadeOverlap` before the title finishes rising, and finishes
   * with the title's last weight relax, so both settle together.
   */
  fadeOverlap: 0.2,
  ease: [0.22, 1, 0.36, 1],
} as const;

// Extra weight added at full scroll intensity
const SCROLL_BOOST = WEIGHT.peak - WEIGHT.rest;

// Where letters start, below their line. Past 100% so they clear the word's bottom padding too.
const START_Y = "120%";

/**
 * Hides the letters below their line until the intro reveals them, in CSS so they're hidden from the
 * very first paint. Only with motion allowed and scripting on, so reduced motion or no JS shows them.
 * Must match `START_Y`.
 */
const HIDDEN =
  "[@media(prefers-reduced-motion:no-preference)_and_(scripting:enabled)]:[transform:translateY(120%)]";

/** Same as `HIDDEN`, for the description's fade. */
const TRANSPARENT =
  "[@media(prefers-reduced-motion:no-preference)_and_(scripting:enabled)]:opacity-0";

// Each letter's weight is its own intro weight plus the shared scroll boost, capped at the axis max.
const LETTER_STYLE = {
  "--intro-wght": WEIGHT.rest,
  fontVariationSettings: `"wght" min(calc(var(--intro-wght) + var(--scroll-wght, 0)), ${WEIGHT.peak})`,
} as CSSProperties;

export default function HeroTextAnimation() {
  const prefersReducedMotion = usePrefersReducedMotion();

  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  // Scroll intensity -> extra weight, layered on top of the intro animation
  const scrollIntensity = useScrollIntensity(titleRef);
  const scrollBoost = useTransform(scrollIntensity, (i) => i * SCROLL_BOOST);

  const label = data.title?.label ?? "";
  const words = label.split(" ");

  useEffect(() => {
    const title = titleRef.current;
    const description = descriptionRef.current;
    if (!title || !description || prefersReducedMotion) return;

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
        { "--intro-wght": [WEIGHT.rest, WEIGHT.peak, WEIGHT.rest] },
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
      [
        description,
        { opacity: [0, 1] },
        {
          at: fadeStart,
          duration: weightEnd - fadeStart,
          // Eases out like the weight's relax, so both slow to a stop together.
          ease: [0.6, 0, 0.4, 1],
        },
      ],
    ]);

    return () => controls.stop();
  }, [prefersReducedMotion]);

  return (
    <>
      <div className="mix-blend-difference">
        <motion.h1
          ref={titleRef}
          aria-label={label}
          style={{ "--scroll-wght": scrollBoost } as MotionStyle}
          className={cn(
            "hero-title font-heading max-w-xl",
            data.title?.settings.uppercase && "uppercase",
          )}
        >
          {words.map((word, w) => (
            <span key={`${word}-${w}`} aria-hidden>
              {/* Clips each word to its line so letters rise from below it; padding keeps descenders. */}
              <span className="inline-block overflow-hidden pb-[0.1em] mb-[-0.1em] align-bottom">
                {[...word].map((letter, l) => (
                  <span
                    key={l}
                    data-letter
                    className={cn("inline-block", HIDDEN)}
                    style={LETTER_STYLE}
                  >
                    {letter}
                  </span>
                ))}
              </span>
              {w < words.length - 1 && " "}
            </span>
          ))}
        </motion.h1>
      </div>
      <p
        ref={descriptionRef}
        className={cn("text-text-light max-w-lg", TRANSPARENT)}
      >
        {data.subtitle}
      </p>
    </>
  );
}
