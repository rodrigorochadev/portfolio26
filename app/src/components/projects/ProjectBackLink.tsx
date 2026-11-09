"use client";

import { PropsWithChildren } from "react";
import Link from "next/link";
import { useStartProjectTransition } from "./transition/useStartProjectTransition";

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
    <Link href={href} onClick={startTransition} className={className}>
      {children}
    </Link>
  );
}
