"use client";

import { useState } from "react";
import Image from "next/image";
import { Project, PROJECT_HERO_IMAGE_SIZES } from "../../lib/projects";
import ProjectImageTarget from "./transition/ProjectImageTarget";
import { useProjectTransition } from "./transition/projectTransition";

type ProjectHeroImageProps = {
  project: Project;
};

/**
 * When arriving by a flight (from a card or "Next project"), the exact file the flying copy shows
 * (already cached) is layered under the hero so the image never lands on an empty box while the
 * full-size file loads. It's dropped once the hero has loaded; direct visits never render it.
 */
export default function ProjectHeroImage({ project }: ProjectHeroImageProps) {
  // Read once at mount: always null on the server and on a fresh load, so it never affects hydration.
  const [placeholder, setPlaceholder] = useState(() => {
    const { flight } = useProjectTransition.getState();
    return flight?.slug === project.slug ? flight.src : null;
  });

  return (
    <ProjectImageTarget slug={project.slug} className="aspect-video w-full">
      {placeholder && (
        // Plain img on purpose: it reuses the exact, already-loaded file the source was showing.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={placeholder} alt="" aria-hidden className="absolute inset-0 size-full object-cover" />
      )}
      <Image
        src={project.image.src}
        alt={project.image.alt}
        fill
        priority
        sizes={PROJECT_HERO_IMAGE_SIZES}
        onLoad={() => setPlaceholder(null)}
        className="object-cover"
      />
    </ProjectImageTarget>
  );
}
