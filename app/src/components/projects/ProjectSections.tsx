"use client";

import { PropsWithChildren } from "react";
import StaggerReveal from "../misc/animation/StaggerReveal";
import { useArrivalSettled } from "./transition/projectTransition";

type ProjectSectionsProps = PropsWithChildren<{
  slug: string;
  className?: string;
}>;

/**
 * A project page's sections, each revealed with a staggered entry as it scrolls into view. When
 * arriving by a flight, the reveal waits until the image has landed, like the title.
 */
export default function ProjectSections({ slug, className, children }: ProjectSectionsProps) {
  const ready = useArrivalSettled(slug);

  return (
    <StaggerReveal ready={ready} className={className}>
      {children}
    </StaggerReveal>
  );
}
