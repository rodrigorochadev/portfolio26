"use client";

import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { animate, inView, stagger } from "motion/react";
import { cn } from "@/app/src/utils";
import { currentFlightId } from "./transition/projectTransition";

/** Cards fade and rise in as they scroll into view; cards entering together are staggered. */
const ENTER = {
  y: 32,
  duration: 0.8,
  stagger: 0.1,
  ease: [0.22, 1, 0.36, 1],
  /** Fraction of a card that must be visible before it animates in. */
  amount: 0.2,
} as const;

/**
 * Hides the cards until they're revealed, in CSS so they're hidden from the very first paint. Only
 * with motion allowed and scripting on, so reduced motion or no JS simply shows them.
 */
const HIDDEN = "[@media(prefers-reduced-motion:no-preference)_and_(scripting:enabled)]:*:opacity-0";

/**
 * The project grid. Cards start hidden (see `HIDDEN`) and are revealed
 * with a staggered entry. Skipped when the page is a flight's destination: the landing image
 * measures its card, so the card must already be in place, and the page fade covers the entry.
 */
export default function ProjectGrid({ children }: PropsWithChildren) {
  const ref = useRef<HTMLDivElement>(null);
  // Always true on the server and on a fresh load, so it never affects hydration.
  const [staggerIn] = useState(() => currentFlightId() === null);

  useEffect(() => {
    const grid = ref.current;
    // With reduced motion `HIDDEN` never hides the cards, so there's nothing to reveal.
    if (!grid || !staggerIn || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const cards = Array.from(grid.children);

    // Collect the cards that come into view in the same frame (the first screen, or a fast scroll)
    // and reveal them as one staggered batch, in DOM order.
    let batch: Element[] = [];
    let frame = 0;
    const flush = () => {
      frame = 0;
      animate(
        batch.sort((a, b) => cards.indexOf(a) - cards.indexOf(b)),
        { opacity: [0, 1], y: [ENTER.y, 0] },
        { duration: ENTER.duration, ease: ENTER.ease, delay: stagger(ENTER.stagger) },
      );
      batch = [];
    };

    const stop = inView(
      cards,
      (card) => {
        batch.push(card);
        if (!frame) frame = requestAnimationFrame(flush);
      },
      { amount: ENTER.amount },
    );

    return () => {
      stop();
      cancelAnimationFrame(frame);
    };
  }, [staggerIn]);

  return (
    <div
      ref={ref}
      className={cn(
        "project-grid grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-10",
        staggerIn && HIDDEN,
      )}
    >
      {children}
    </div>
  );
}
