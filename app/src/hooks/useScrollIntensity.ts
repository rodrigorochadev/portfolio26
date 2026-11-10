import {
  MotionValue,
  SpringOptions,
  useInView,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { RefObject } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

interface ScrollIntensityOptions {
  /** Scroll speed (px/s) that maps to full intensity; faster is clamped */
  maxVelocity?: number;
  /** Spring that smooths velocity spikes and eases back to 0 */
  spring?: SpringOptions;
}

const DEFAULT_SPRING: SpringOptions = { damping: 40, stiffness: 300 };

/**
 * How hard the page is being scrolled, as a 0–1 motion value.
 * Velocity is zeroed while `ref` is off-screen, so it only reacts while the
 * element is visible, and it stays at 0 under `prefers-reduced-motion`.
 * Map it onto whatever property should respond, e.g. with `useTransform`.
 */
export function useScrollIntensity(
  ref: RefObject<Element | null>,
  { maxVelocity = 2200, spring = DEFAULT_SPRING }: ScrollIntensityOptions = {},
): MotionValue<number> {
  const prefersReducedMotion = usePrefersReducedMotion();
  const isInView = useInView(ref);

  const { scrollY } = useScroll();
  const scrollVelocity = useVelocity(scrollY);
  const visibleVelocity = useTransform(scrollVelocity, (v) => (isInView ? v : 0));
  const smoothVelocity = useSpring(visibleVelocity, spring);

  return useTransform(smoothVelocity, (v) =>
    prefersReducedMotion ? 0 : Math.min(Math.abs(v) / maxVelocity, 1),
  );
}
