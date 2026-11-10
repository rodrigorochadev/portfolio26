"use client";

import { ComponentProps, useRef } from "react";
import Link from "next/link";
import { getImageProps } from "next/image";
import { Project, PROJECT_HERO_IMAGE_SIZES, projectPath } from "../../lib/projects";
import { markOpenedFromGrid } from "./openedFromGrid";
import { isPlainClick, useStartProjectTransition } from "./transition/useStartProjectTransition";
import { useBackgroundTheme } from "../background/backgroundTheme";

type ProjectLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  project: Project;
  /** A grid card (home or /projects), so the project's Back link returns there. False for "Next project". */
  fromGrid?: boolean;
};

/**
 * Link to a project that flies its card image to the project hero, and warms the browser cache with
 * the hero-sized image on intent (hover / focus / touch) so it's usually sharp by the time it lands.
 */
export default function ProjectLink({ project, fromGrid = true, onClick, ...props }: ProjectLinkProps) {
  const preloaded = useRef(false);
  const href = projectPath(project.slug);
  const startTransition = useStartProjectTransition(project.slug, href);

  const preloadHero = () => {
    if (preloaded.current) return;
    preloaded.current = true;

    // Same props as the hero <Image>, so the browser picks the same srcset candidate it will request.
    const { props: hero } = getImageProps({
      src: project.image.src,
      alt: "",
      fill: true,
      sizes: PROJECT_HERO_IMAGE_SIZES,
    });

    const img = new window.Image();
    img.sizes = hero.sizes ?? PROJECT_HERO_IMAGE_SIZES;
    if (hero.srcSet) img.srcset = hero.srcSet;
    img.src = hero.src;
  };

  return (
    <Link
      {...props}
      href={href}
      onPointerEnter={preloadHero}
      onFocus={preloadHero}
      onTouchStart={preloadHero}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || !isPlainClick(event)) return;
        if (fromGrid) markOpenedFromGrid(project.slug, window.location.pathname);
        // Start recoloring now so the background shifts while the image flies.
        useBackgroundTheme.getState().setTheme(project.background);
        startTransition(event);
      }}
    />
  );
}
