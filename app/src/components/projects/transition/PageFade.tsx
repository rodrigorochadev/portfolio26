"use client";

import { PropsWithChildren, useState } from "react";
import { motion } from "motion/react";
import { currentFlightId, TIMING, useProjectTransition } from "./projectTransition";

/**
 * Fades a page's content around a project image flight: out on the page it starts from, in on the
 * page it lands on. Opacity only, so the landing spot never moves while the image flies to it.
 */
export default function PageFade({ children }: PropsWithChildren) {
  // The flight this page mounted during, i.e. it's that flight's destination. Any *later* flight
  // starts from this page, so it should fade out. Always null on the server and on a fresh load.
  const [arrivingFlight] = useState(() => currentFlightId());
  const leaving = useProjectTransition(
    (s) => s.flight !== null && s.flight.id !== arrivingFlight && s.flight.to === null,
  );

  return (
    <motion.div
      initial={arrivingFlight !== null ? { opacity: 0 } : false}
      animate={{ opacity: leaving ? 0 : 1 }}
      transition={
        leaving
          ? { duration: TIMING.leave, ease: "easeInOut" }
          : { duration: TIMING.enter, delay: TIMING.enterDelay, ease: "easeOut" }
      }
    >
      {children}
    </motion.div>
  );
}
