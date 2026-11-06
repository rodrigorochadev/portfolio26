import { useEffect, useEffectEvent } from "react";

// Longest frame step passed to the callback. Browsers pause rAF in background
// tabs; without a cap, coming back would hand over one huge step and make
// time-based animations jump ahead.
const MAX_FRAME_MS = 100;

/**
 * Calls `onFrame(dt)` on every animation frame while `active` is true, with
 * `dt` in milliseconds (0 on the first frame after (re)starting). The callback
 * always sees the latest props/state without restarting the loop.
 */
export const useAnimationFrame = (
  onFrame: (dt: number) => void,
  active = true,
) => {
  const handleFrame = useEffectEvent(onFrame);

  useEffect(() => {
    if (!active) return;

    let frameId = 0;
    let last: number | null = null;
    const tick = (now: number) => {
      const dt = last === null ? 0 : Math.min(now - last, MAX_FRAME_MS);
      last = now;
      handleFrame(dt);
      frameId = requestAnimationFrame(tick);
    };
    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, [active]);
};
