"use client";

import { PropsWithChildren, useEffect, useLayoutEffect, useState } from "react";
import { motion } from "motion/react";
import {
  currentFlightId,
  currentNavigationId,
  TIMING,
  useProjectTransition,
} from "./projectTransition";
import { takeScrollRestore } from "./scrollMemory";

/**
 * Fades a page's content around a transition (a project image flight or a plain page navigation):
 * out on the page it starts from, in on the page it lands on. Opacity only, so the landing spot
 * never moves while the image flies to it.
 */
export default function PageFade({ children }: PropsWithChildren) {
  // The flight this page mounted during, i.e. it's that flight's destination. Any *later* flight
  // starts from this page, so it should fade out. Always null on the server and on a fresh load.
  const [arrivingFlight] = useState(() => currentFlightId());
  // Same for a plain page navigation (e.g. "See all"), which has no image to wait for.
  const [arrivingNavigation] = useState(() => currentNavigationId());
  const leaving = useProjectTransition(
    (s) =>
      (s.flight !== null && s.flight.id !== arrivingFlight && s.flight.to === null) ||
      (s.navigation !== null && s.navigation.id !== arrivingNavigation),
  );

  // Returning via a "Back" link: put the page back where the visitor left it. A layout effect runs
  // before paint and before a landing image measures its target (it waits a frame), so the image
  // flies to the card's real position. Lenis resyncs to this on the route change (SmoothScroll).
  useLayoutEffect(() => {
    const y = takeScrollRestore(window.location.pathname);
    if (y !== null) window.scrollTo({ top: y, behavior: "instant" });
  }, []);

  // The new page has mounted; the navigation is done.
  useEffect(() => {
    if (arrivingNavigation !== null) {
      useProjectTransition.getState().endNavigation(arrivingNavigation);
    }
  }, [arrivingNavigation]);

  const arriving = arrivingFlight !== null || arrivingNavigation !== null;

  return (
    <motion.div
      initial={arriving ? { opacity: 0 } : false}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={
        leaving
          ? { duration: TIMING.leave, ease: "easeInOut" }
          : {
              duration: TIMING.enter,
              // After a flight, time the fade to the image's landing; otherwise fade straight in.
              delay: arrivingFlight !== null ? TIMING.enterDelay : 0,
              ease: "easeOut",
            }
      }
    >
      {children}
    </motion.div>
  );
}
