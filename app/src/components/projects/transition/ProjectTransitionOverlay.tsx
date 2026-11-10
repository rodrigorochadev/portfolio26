"use client";

import { useEffect, useId, useRef } from "react";
import { usePathname } from "next/navigation";
import { animate, motion, useMotionValue, useMotionValueEvent } from "motion/react";
import { FLY_EASE, LIQUIFY, TIMING, useProjectTransition } from "./projectTransition";

// If the destination never mounts (failed navigation, missing target), don't leave the copy stuck:
// give up shortly after the route changed without a target, or after a long wait regardless.
const NO_TARGET_TIMEOUT = 300;
const LANDING_TIMEOUT = 4000;

// Click → fade out → most of the expansion. Ends before the landing, so the handoff is undistorted.
const LIQUIFY_DURATION = TIMING.leave + TIMING.fly * LIQUIFY.settle;

/**
 * The flying copy of a project image. It's a real element with the image's own styles (rounded
 * corners, `object-fit: cover`), so the crop and corners stay correct on every frame; there are no
 * snapshots to stretch or crossfade. Mounted once in the root layout.
 *
 * While it travels, the image inside "liquifies": an SVG displacement ripples it as it leaves the
 * card, peaking as the expansion starts and settling to exactly zero before it lands, so both
 * handoffs stay seamless. The box itself (size, rounded corners) never distorts.
 */
export default function ProjectTransitionOverlay() {
  const flight = useProjectTransition((s) => s.flight);
  const arrive = useProjectTransition((s) => s.arrive);
  const finish = useProjectTransition((s) => s.finish);
  const flightId = flight?.id ?? null;
  const pathname = usePathname();
  const startPath = useRef(pathname);
  const landed = flight?.landed ?? false;

  const filterId = `project-liquify-${useId().replace(/:/g, "")}`;
  const boxRef = useRef<HTMLDivElement>(null);
  const liquidRef = useRef<HTMLDivElement>(null);
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementRef = useRef<SVGFEDisplacementMapElement>(null);
  /** Seconds since the click; one continuous timeline from click to just before landing. */
  const elapsed = useMotionValue(0);

  // Drive the filter outside React. It's only attached while distorting: a filter at zero strength
  // still re-rasterizes the image, which would soften it against the crisp card / hero.
  useMotionValueEvent(elapsed, "change", (t) => {
    const box = boxRef.current;
    const liquid = liquidRef.current;
    if (!box || !liquid) return;

    // One smooth swell from the click to before landing: rises while the card waits, peaks early in
    // the expansion, eases out to exactly zero. No separate phases, so it never pauses.
    const progress = Math.min(t / LIQUIFY_DURATION, 1);
    const amount = Math.sin(Math.PI * progress) ** 2;

    if (amount <= 0.001) {
      liquid.style.filter = "";
      liquid.style.scale = "";
      return;
    }

    // The noise keeps slowly reshaping, so the image flows even while the strength barely changes.
    const [fx, fy] = LIQUIFY.frequency;
    const flow = LIQUIFY.flow;
    turbulenceRef.current?.setAttribute(
      "baseFrequency",
      `${fx * (1 + flow * Math.sin(t * 3.1))} ${fy * (1 + flow * Math.cos(t * 2.3))}`,
    );

    const displacement = amount * LIQUIFY.strength;
    displacementRef.current?.setAttribute("scale", String(displacement));

    // Pixels shift by up to half the displacement, so near the edges they'd be pulled from outside
    // the image (transparent). Enlarge the image by exactly that much so the clipped box stays full.
    const shortSide = Math.min(box.offsetWidth, box.offsetHeight) || 1;
    liquid.style.filter = `url(#${filterId})`;
    liquid.style.scale = String(1 + (displacement * 1.1) / shortSide);
  });

  useEffect(() => {
    if (flightId === null) return;
    elapsed.jump(0);
    const controls = animate(elapsed, LIQUIFY_DURATION, {
      duration: LIQUIFY_DURATION,
      ease: "linear",
    });
    return () => controls.stop();
  }, [flightId, elapsed]);

  useEffect(() => {
    if (flightId !== null) startPath.current = pathname;
    // Only when a flight starts; the pathname is read as the flight's starting page.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flightId]);

  useEffect(() => {
    if (!flight || flight.to) return;
    const arrived = pathname !== startPath.current;
    const timeout = setTimeout(finish, arrived ? NO_TARGET_TIMEOUT : LANDING_TIMEOUT);
    return () => clearTimeout(timeout);
  }, [flight, finish, pathname]);

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
    <>
      <svg aria-hidden className="pointer-events-none fixed size-0" focusable="false">
        <filter id={filterId} x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
          {/* Low-frequency noise reads as liquid rather than glitchy; stretched a little vertically. */}
          <feTurbulence
            ref={turbulenceRef}
            type="fractalNoise"
            baseFrequency={LIQUIFY.frequency.join(" ")}
            numOctaves={2}
            seed={flight.id}
            result="noise"
          />
          <feDisplacementMap
            ref={displacementRef}
            in="SourceGraphic"
            in2="noise"
            scale={0}
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <motion.div
        ref={boxRef}
        key={flight.id}
        aria-hidden
        className="pointer-events-none fixed z-50 overflow-hidden"
        style={{ borderRadius: flight.radius }}
        initial={from}
        animate={to ?? from}
        transition={transition}
        onAnimationComplete={() => to && arrive()}
      >
        {/* Only this layer liquifies; the box around it keeps its shape. */}
        <div ref={liquidRef} className="absolute inset-0">
          {/* Plain img on purpose: it reuses the exact, already-loaded file the source was showing. */}
          <motion.img
            src={flight.src}
            alt=""
            className="absolute inset-0 size-full max-w-none object-cover"
            initial={{ scale: flight.scale }}
            animate={{ scale: to ? 1 : flight.scale }}
            transition={transition}
          />
        </div>
      </motion.div>
    </>
  );
}
