"use client";

import { PropsWithChildren, useEffect, useRef } from "react";
import { animate, inView, stagger } from "motion/react";
import { cn } from "@/app/src/utils";

/** Items fade and rise in as they scroll into view; items entering together are staggered. */
const ENTER = {
  y: 32,
  duration: 0.8,
  stagger: 0.1,
  ease: [0.22, 1, 0.36, 1],
  /** Fraction of an item that must be visible before it animates in. */
  amount: 0.2,
} as const;

/**
 * Hides the items until they're revealed, in CSS so they're hidden from the very first paint. Only
 * with motion allowed and scripting on, so reduced motion or no JS simply shows them.
 */
const HIDDEN = "[@media(prefers-reduced-motion:no-preference)_and_(scripting:enabled)]:*:opacity-0";

type StaggerRevealProps = PropsWithChildren<{
  as?: "div" | "ul";
  className?: string;
  /** Off renders the items plainly, e.g. when the page fade already covers their entry. */
  enabled?: boolean;
  /** Holds the reveal (items stay hidden) until true, e.g. until a page transition has finished. */
  ready?: boolean;
}>;

/**
 * Reveals each direct child with a staggered fade and rise as it scrolls into view. Children start
 * hidden (see `HIDDEN`), so the first screen never flashes before its entry.
 */
export default function StaggerReveal({
  as: Tag = "div",
  className,
  enabled = true,
  ready = true,
  children,
}: StaggerRevealProps) {
  const ref = useRef<HTMLDivElement & HTMLUListElement>(null);

  useEffect(() => {
    const container = ref.current;
    // With reduced motion `HIDDEN` never hides the items, so there's nothing to reveal.
    if (
      !container ||
      !enabled ||
      !ready ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const items = Array.from(container.children);

    // Collect the items that come into view in the same frame (the first screen, or a fast scroll)
    // and reveal them as one staggered batch, in DOM order.
    let batch: Element[] = [];
    let frame = 0;
    const flush = () => {
      frame = 0;
      animate(
        batch.sort((a, b) => items.indexOf(a) - items.indexOf(b)),
        { opacity: [0, 1], y: [ENTER.y, 0] },
        { duration: ENTER.duration, ease: ENTER.ease, delay: stagger(ENTER.stagger) },
      );
      batch = [];
    };

    const stop = inView(
      items,
      (item) => {
        batch.push(item);
        if (!frame) frame = requestAnimationFrame(flush);
      },
      { amount: ENTER.amount },
    );

    return () => {
      stop();
      cancelAnimationFrame(frame);
    };
  }, [enabled, ready]);

  return (
    <Tag ref={ref} className={cn(className, enabled && HIDDEN)}>
      {children}
    </Tag>
  );
}
