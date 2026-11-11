"use client";

import { PropsWithChildren, useState } from "react";
import StaggerReveal from "../misc/animation/StaggerReveal";
import { currentFlightId } from "./transition/projectTransition";

/**
 * The project grid, with a staggered card entry. Skipped when the page is a flight's destination:
 * the landing image measures its card, so the card must already be in place, and the page fade
 * covers the entry.
 */
export default function ProjectGrid({ children }: PropsWithChildren) {
  // Always true on the server and on a fresh load, so it never affects hydration.
  const [staggerIn] = useState(() => currentFlightId() === null);

  return (
    <StaggerReveal
      enabled={staggerIn}
      className="project-grid grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-10"
    >
      {children}
    </StaggerReveal>
  );
}
