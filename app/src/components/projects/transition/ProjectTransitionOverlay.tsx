"use client";

import { useEffect } from "react";
import { motion } from "motion/react";
import { FLY_EASE, TIMING, useProjectTransition } from "./projectTransition";

// If the destination never mounts (failed navigation, missing target), don't leave the copy stuck.
const LANDING_TIMEOUT = 4000;

/**
 * The flying copy of a project image. It's a real element with the image's own styles (rounded
 * corners, `object-fit: cover`), so the crop and corners stay correct on every frame; there are no
 * snapshots to stretch or crossfade. Mounted once in the root layout.
 */
export default function ProjectTransitionOverlay() {
  const flight = useProjectTransition((s) => s.flight);
  const arrive = useProjectTransition((s) => s.arrive);
  const finish = useProjectTransition((s) => s.finish);
  const landed = flight?.landed ?? false;

  useEffect(() => {
    if (!flight || flight.to) return;
    const timeout = setTimeout(finish, LANDING_TIMEOUT);
    return () => clearTimeout(timeout);
  }, [flight, finish]);

  // The destination was revealed underneath the (identical) copy; give it a couple of frames to
  // paint its image before removing the copy, so the handoff can never show a blank frame.
  useEffect(() => {
    if (!landed) return;
    let frame = requestAnimationFrame(() => {
      frame = requestAnimationFrame(finish);
    });
    return () => cancelAnimationFrame(frame);
  }, [landed, finish]);

  if (!flight) return null;

  const { from, to } = flight;
  const transition = { duration: to ? TIMING.fly : 0, ease: FLY_EASE };

  return (
    <motion.div
      key={flight.slug}
      aria-hidden
      className="pointer-events-none fixed z-50 overflow-hidden"
      style={{ borderRadius: flight.radius }}
      initial={from}
      animate={to ?? from}
      transition={transition}
      onAnimationComplete={() => to && arrive()}
    >
      {/* Plain img on purpose: it reuses the exact, already-loaded file the source was showing. */}
      <motion.img
        src={flight.src}
        alt=""
        className="absolute inset-0 size-full max-w-none object-cover"
        initial={{ scale: flight.scale }}
        animate={{ scale: to ? 1 : flight.scale }}
        transition={transition}
      />
    </motion.div>
  );
}
