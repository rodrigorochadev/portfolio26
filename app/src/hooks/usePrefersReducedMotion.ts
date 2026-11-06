import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

const subscribe = (onChange: () => void) => {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener("change", onChange);
  return () => mediaQuery.removeEventListener("change", onChange);
};

const getSnapshot = () => window.matchMedia(QUERY).matches;

// Assume motion is fine on the server; the client corrects it on hydration
const getServerSnapshot = () => false;

/** Live `prefers-reduced-motion: reduce` value; updates if the user changes it. */
export const usePrefersReducedMotion = () =>
  useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
