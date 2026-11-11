"use client";

import { useState } from "react";
import TitleAnimation from "../misc/titleAnimation/TitleAnimation";
import { currentFlightId, useProjectTransition } from "./transition/projectTransition";

type ProjectTitleProps = {
  slug: string;
  title: string;
  className?: string;
};

/**
 * The project page title, with the hero's letter intro. When arriving by a flight, the intro waits
 * until the image has landed and the flying copy is gone, so the two don't compete.
 */
export default function ProjectTitle({ slug, title, className }: ProjectTitleProps) {
  // The flight this page mounted during. Always null on the server and on a fresh load, so it
  // never affects hydration.
  const [arrivingFlight] = useState(() => currentFlightId(slug));
  const ready = useProjectTransition(
    (s) => arrivingFlight === null || s.flight?.id !== arrivingFlight,
  );

  return (
    <TitleAnimation label={title} ready={ready} restWeight={400} className={className} />
  );
}
