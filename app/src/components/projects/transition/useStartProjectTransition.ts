"use client";

import { MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { TIMING, toRect, useProjectTransition } from "./projectTransition";
import { rememberScroll, requestScrollRestore } from "./scrollMemory";

/** Topmost image that has actually loaded (the hero over its placeholder, when it's ready). */
function visibleImage(container: HTMLElement) {
  const images = Array.from(container.querySelectorAll("img"));
  return images.reverse().find((img) => img.complete && img.naturalWidth > 0);
}

/** A click that navigates in place (not a new tab/window), i.e. one we may animate. */
export function isPlainClick(event: MouseEvent) {
  return event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
}

type Options = {
  /** Return to the destination's saved scroll position instead of letting Next scroll. */
  restoreScroll?: boolean;
};

/**
 * Click handler for links that fly a project image to the next page. Falls back to a normal
 * navigation for modified clicks, reduced motion, or when there's nothing to fly.
 */
export function useStartProjectTransition(slug: string, href: string, { restoreScroll = false }: Options = {}) {
  const router = useRouter();

  return (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.defaultPrevented || !isPlainClick(event)) return;

    const { flight, begin } = useProjectTransition.getState();
    const source = document.querySelector<HTMLElement>(`[data-project-image="${slug}"]`);
    const image = source && visibleImage(source);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Let <Link> navigate normally.
    if (!source || !image || reduceMotion) return;

    event.preventDefault();
    if (flight) return;

    const box = source.getBoundingClientRect();
    begin({
      slug,
      src: image.currentSrc || image.src,
      from: toRect(box),
      radius: getComputedStyle(source).borderRadius,
      scale: image.getBoundingClientRect().width / box.width,
    });

    rememberScroll();
    if (restoreScroll) requestScrollRestore(href.split("#")[0]);

    // The page fades out around the image first, then the image flies on the next page.
    setTimeout(() => router.push(href, { scroll: !restoreScroll }), TIMING.leave * 1000);
  };
}
