"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import ReactLenis, { useLenis } from "lenis/react";

import "lenis/dist/lenis.css";

/**
 * Lenis lives in the root layout and survives navigations, so on every route change it still
 * holds the previous page's dimensions and any in-flight smooth scroll. Without a reset, that
 * scroll keeps animating against Next's scroll-to-top / hash scroll and the new page's height.
 */
function LenisRouteSync() {
  const lenis = useLenis();
  const pathname = usePathname();

  useEffect(() => {
    if (!lenis) return;

    // stop/start both reset internal state: cancel the running animation and resync to the
    // native scroll position Next already applied.
    lenis.stop();
    lenis.start();
    lenis.resize();
  }, [lenis, pathname]);

  return null;
}

export default function SmoothScroll() {
  return (
    <>
      <ReactLenis root />
      <LenisRouteSync />
    </>
  );
}
