"use client";

import { PropsWithChildren, useState } from "react";
import Link from "next/link";
import { isPlainClick, useStartProjectTransition } from "./transition/useStartProjectTransition";
import { useBackgroundTheme } from "../background/backgroundTheme";
import { gridPathFor } from "./openedFromGrid";
import { hasSavedScroll, requestScrollRestore } from "./transition/scrollMemory";

type ProjectBackLinkProps = PropsWithChildren<{
  slug: string;
  className?: string;
}>;

/** Back to the grid it was opened from (home or /projects), flying the hero image into its card. */
export default function ProjectBackLink({ slug, className, children }: ProjectBackLinkProps) {
  // Return to where the visitor left the grid; without a saved position (direct visit), the hash
  // scrolls the card into view so the image still has a visible place to land. Read once at mount:
  // always the hash on the server and on a fresh load, so it never affects hydration.
  const [{ href, restoreScroll }] = useState(() => {
    const gridPath = gridPathFor(slug);
    return hasSavedScroll(gridPath)
      ? { href: gridPath, restoreScroll: true }
      : { href: `${gridPath}#${slug}`, restoreScroll: false };
  });
  const startTransition = useStartProjectTransition(slug, href, { restoreScroll });

  return (
    <Link
      href={href}
      // Also covers the plain-navigation fallback (e.g. reduced motion): no scroll-to-top, restore.
      scroll={!restoreScroll}
      onClick={(event) => {
        if (isPlainClick(event)) {
          // Fade back to the default colors while the image flies home.
          useBackgroundTheme.getState().setTheme(null);
          if (restoreScroll) requestScrollRestore(href);
        }
        startTransition(event);
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
