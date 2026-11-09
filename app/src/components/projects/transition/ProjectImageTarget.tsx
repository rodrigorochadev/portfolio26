"use client";

import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { currentFlightId, toRect, useProjectTransition } from "./projectTransition";

type ProjectImageTargetProps = PropsWithChildren<{
  slug: string;
  className?: string;
}>;

/**
 * Wraps a project image (card or hero) so it can be the start or end of a flight. When it mounts
 * mid-flight (the destination) it reports where to land, and stays hidden until the copy is there.
 * The source stays visible: the copy covers it exactly while its page fades out.
 */
export default function ProjectImageTarget({ slug, className, children }: ProjectImageTargetProps) {
  const ref = useRef<HTMLDivElement>(null);
  // The flight this image mounted during (it's that flight's destination). Always null on the
  // server and on a fresh load, so it never affects hydration.
  const [arrivingFlight] = useState(() => currentFlightId(slug));
  const waiting = useProjectTransition(
    (s) => arrivingFlight !== null && s.flight?.id === arrivingFlight && !s.flight.landed,
  );

  useEffect(() => {
    const { flight, land } = useProjectTransition.getState();
    // The source mounted long before the flight began, so only the destination gets here.
    if (!flight || flight.slug !== slug || flight.to) return;

    // Wait a frame so Next's scroll (to top, or to the #hash) has been applied before measuring.
    const frame = requestAnimationFrame(() => {
      if (ref.current) land(slug, toRect(ref.current.getBoundingClientRect()));
    });
    return () => cancelAnimationFrame(frame);
  }, [slug]);

  return (
    <div
      ref={ref}
      data-project-image={slug}
      className={twMerge("relative overflow-hidden rounded-sm", className, waiting && "invisible")}
    >
      {children}
    </div>
  );
}
