"use client";

import TitleAnimation from "../misc/titleAnimation/TitleAnimation";
import { useArrivalSettled } from "./transition/projectTransition";

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
  const ready = useArrivalSettled(slug);

  return (
    <TitleAnimation label={title} ready={ready} className={className} />
  );
}
