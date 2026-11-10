"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform } from "motion/react";
import { clamp01, damp } from "../../utils/math";

/** Extra scroll past the bottom (CSS px) that fills the bar and opens the next project. */
const PULL_DISTANCE = 700;
/** Input right after reaching the bottom is ignored, so a flick's momentum alone doesn't fill it. */
const ARM_DELAY = 300;
/** Once input stops for this long, the bar drains back. */
const IDLE_DELAY = 150;
/** Drain speed, as a fraction of the bar per second. */
const DRAIN_RATE = 1.2;
/** How quickly the drawn bar catches up with the input (per ms). */
const FOLLOW_RATE = 0.015;
/** Slack for subpixel scroll positions. */
const BOTTOM_EPSILON = 2;

const isAtBottom = () =>
  window.innerHeight + window.scrollY >=
  document.documentElement.scrollHeight - BOTTOM_EPSILON;

/** Wheel delta in CSS px, whatever unit the device reports. */
const wheelPixels = (event: WheelEvent) =>
  event.deltaMode === WheelEvent.DOM_DELTA_LINE
    ? event.deltaY * 16
    : event.deltaMode === WheelEvent.DOM_DELTA_PAGE
      ? event.deltaY * window.innerHeight
      : event.deltaY;

/**
 * Keep scrolling past the end of a project and a bar fills along the bottom of the screen; once
 * full, it opens the next project (clicking the "Next project" link, so it gets the same flight).
 * Stop scrolling and it drains back. Wheel and touch only: the native scroll is already at its end,
 * so this just reads the gestures that would otherwise do nothing.
 */
export default function NextProjectPull({ title }: { title: string }) {
  const progress = useMotionValue(0);
  const labelOpacity = useTransform(progress, [0, 0.15], [0, 1]);

  useEffect(() => {
    let target = 0;
    let bottomSince: number | null = isAtBottom() ? performance.now() : null;
    let lastInput = 0;
    let touchY: number | null = null;
    let frame = 0;
    let last: number | null = null;
    let done = false;

    const tick = (now: number) => {
      const dt = last === null ? 0 : Math.min(now - last, 100);
      last = now;

      if (!done && now - lastInput > IDLE_DELAY) {
        target = Math.max(0, target - (DRAIN_RATE * dt) / 1000);
      }
      const shown = damp(progress.get(), target, FOLLOW_RATE, dt);
      progress.set(target === 0 && shown < 0.001 ? 0 : shown);

      if (!done && target >= 1 && shown > 0.98) {
        done = true;
        document.querySelector<HTMLAnchorElement>("[data-next-project]")?.click();
      }

      if (done || target > 0 || progress.get() > 0) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
        last = null;
      }
    };

    const pull = (pixels: number) => {
      if (done) return;
      const now = performance.now();
      if (!isAtBottom() || bottomSince === null || now - bottomSince < ARM_DELAY) {
        // Scrolling back up while the bar shows drains it right away.
        if (pixels < 0) target = 0;
        return;
      }
      target = clamp01(target + pixels / PULL_DISTANCE);
      lastInput = now;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      const atBottom = isAtBottom();
      if (atBottom && bottomSince === null) bottomSince = performance.now();
      if (!atBottom) bottomSince = null;
    };
    const onWheel = (event: WheelEvent) => pull(wheelPixels(event));
    const onTouchStart = (event: TouchEvent) => (touchY = event.touches[0]?.clientY ?? null);
    const onTouchMove = (event: TouchEvent) => {
      const y = event.touches[0]?.clientY;
      if (y === undefined || touchY === null) return;
      pull(touchY - y);
      touchY = y;
    };
    const onTouchEnd = () => (touchY = null);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [progress]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-30">
      <motion.span
        className="block pb-3 text-center text-xs font-bold uppercase text-text-light"
        style={{ opacity: labelOpacity }}
      >
        Keep scrolling for {title}
      </motion.span>
      <motion.div className="h-1 origin-left bg-accent" style={{ scaleX: progress }} />
    </div>
  );
}
