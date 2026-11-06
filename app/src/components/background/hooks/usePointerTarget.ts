import { useEffect, useRef } from "react";

export type PointerTarget = {
  /** Pointer position in uv space: 0–1, origin bottom-left like gl_FragCoord. */
  x: number;
  y: number;
  /** Whether the pointer is currently over the page. */
  active: boolean;
};

/**
 * Tracks the pointer relative to `element` without re-rendering; read
 * `.current` from an animation loop.
 *
 * Listens on window rather than the element because a background sits behind
 * page content and never receives pointer events itself.
 */
export const usePointerTarget = (element: HTMLElement | null, enabled: boolean) => {
  const target = useRef<PointerTarget>({ x: 0.5, y: 0.5, active: false });

  useEffect(() => {
    const state = target.current;
    state.active = false;
    if (!element || !enabled) return;

    const onMove = (e: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      state.x = (e.clientX - rect.left) / rect.width;
      state.y = 1 - (e.clientY - rect.top) / rect.height;
      state.active = true;
    };
    // Mouse keeps hovering after a click; touch/pen "hover" ends with the gesture
    const onEnd = (e: PointerEvent) => {
      if (e.type === "pointerleave" || e.pointerType !== "mouse") {
        state.active = false;
      }
    };
    const onBlur = () => {
      state.active = false;
    };

    const root = document.documentElement;
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
    root.addEventListener("pointerleave", onEnd);
    window.addEventListener("blur", onBlur);

    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
      root.removeEventListener("pointerleave", onEnd);
      window.removeEventListener("blur", onBlur);
    };
  }, [element, enabled]);

  return target;
};
