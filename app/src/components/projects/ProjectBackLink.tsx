"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { isPlainClick, useStartProjectTransition } from "./transition/useStartProjectTransition";
import { useBackgroundTheme } from "../background/backgroundTheme";

type ProjectBackLinkProps = PropsWithChildren<{
  slug: string;
  className?: string;
}>;

/** Back to the grid, flying the hero image back into its card. */
export default function ProjectBackLink({ slug, className, children }: ProjectBackLinkProps) {
  // The hash scrolls the card into view, so the image has a visible place to land.
  const href = `/#${slug}`;
  const startTransition = useStartProjectTransition(slug, href);

  return (
    <Link
      href={href}
      onClick={(event) => {
        // Fade back to the default colors while the image flies home.
        if (isPlainClick(event)) useBackgroundTheme.getState().setTheme(null);
        startTransition(event);
      }}
      className={className}
    >
      {children}
    </Link>
  );
}
