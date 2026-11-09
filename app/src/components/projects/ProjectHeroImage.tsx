"use client";

import { useState } from "react";
import Image from "next/image";
import { Project, PROJECT_CARD_IMAGE_SIZES, PROJECT_HERO_IMAGE_SIZES } from "../../lib/projects";
import { wasOpenedFromGrid } from "./openedFromGrid";
import ProjectImageTarget from "./transition/ProjectImageTarget";

type ProjectHeroImageProps = {
  project: Project;
};

/**
 * When arriving from a card, the card's (already cached) file is layered under the hero so the
 * image never lands on an empty box while the full-size file loads. It's dropped once the hero has
 * loaded; direct visits never render it, so they don't pay for a second request.
 */
export default function ProjectHeroImage({ project }: ProjectHeroImageProps) {
  const [showPlaceholder, setShowPlaceholder] = useState(() => wasOpenedFromGrid(project.slug));

  return (
    <ProjectImageTarget slug={project.slug} className="aspect-video w-full">
      {showPlaceholder && (
        <Image
          src={project.image.src}
          alt=""
          aria-hidden
          fill
          sizes={PROJECT_CARD_IMAGE_SIZES}
          className="object-cover"
        />
      )}
      <Image
        src={project.image.src}
        alt={project.image.alt}
        fill
        priority
        sizes={PROJECT_HERO_IMAGE_SIZES}
        onLoad={() => setShowPlaceholder(false)}
        className="object-cover"
      />
    </ProjectImageTarget>
  );
}
