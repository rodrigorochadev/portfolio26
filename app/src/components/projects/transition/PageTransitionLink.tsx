"use client";

import { ComponentProps } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { TIMING, useProjectTransition } from "./projectTransition";
import { isPlainClick } from "./useStartProjectTransition";
import { hasSavedScroll, rememberScroll, requestScrollRestore } from "./scrollMemory";

type PageTransitionLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  href: string;
  /** For "Back" links: return to the scroll position the visitor left `href` at, if known. */
  restoreScroll?: boolean;
};

// If the next page never takes over the navigation (e.g. it has no PageFade), clear it anyway.
const NAVIGATION_TIMEOUT = 3000;

/**
 * A link that fades the current page out before navigating; the next page fades in on arrival.
 * Modified clicks, reduced motion and in-progress transitions fall back to a normal <Link>.
 */
export default function PageTransitionLink({
  href,
  restoreScroll = false,
  onClick,
  ...props
}: PageTransitionLinkProps) {
  const router = useRouter();

  return (
    <Link
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (event.defaultPrevented || !isPlainClick(event)) return;
        // Already on this page (e.g. the header logo on the homepage): the page wouldn't remount to
        // fade back in, so let <Link> handle it normally (scroll to top).
        if (new URL(href, window.location.href).pathname === window.location.pathname) return;

        // Decided at click time: a saved position only exists after leaving `href` this session.
        const restore = restoreScroll && hasSavedScroll(href);
        rememberScroll();
        if (restore) requestScrollRestore(href);

        const { flight, navigation, beginNavigation, endNavigation } =
          useProjectTransition.getState();
        event.preventDefault();
        if (flight || navigation) return;

        // Reduced motion: same navigation (and restore), just without the fade.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          router.push(href, { scroll: !restore });
          return;
        }

        beginNavigation();
        const id = useProjectTransition.getState().navigation?.id;
        setTimeout(() => router.push(href, { scroll: !restore }), TIMING.leave * 1000);
        setTimeout(() => id !== undefined && endNavigation(id), NAVIGATION_TIMEOUT);
      }}
    />
  );
}
