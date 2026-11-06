import { useCallback, useEffect, useRef, useState } from "react";
import { useAnimationFrame } from "@/app/src/hooks/useAnimationFrame";
import { usePrefersReducedMotion } from "@/app/src/hooks/usePrefersReducedMotion";
import {
  createGrainientRenderer,
  type FrameState,
  type GrainientRenderer,
} from "../gl/createGrainientRenderer";
import { POINTER_FADE_RATE, POINTER_FOLLOW_RATE } from "../settings";
import type { GrainientSettings } from "../types";
import { clamp01, damp, easeOutCubic } from "@/app/src/utils/math";
import { usePointerTarget } from "./usePointerTarget";

/**
 * Drives the Grainient WebGL background.
 *
 * Returns a callback `ref` for the container element and `ready`, which turns
 * true once a frame with the real settings has been drawn. Hide the container
 * until then so the first load never flashes.
 */
export const useGrainient = (settings: GrainientSettings) => {
  const [renderer, setRenderer] = useState<GrainientRenderer | null>(null);
  const [ready, setReady] = useState(false);

  // Hover and the settle-in are motion: both are skipped for reduced motion
  const reducedMotion = usePrefersReducedMotion();
  const animating = renderer !== null && !reducedMotion;
  const pointer = usePointerTarget(renderer?.element ?? null, !reducedMotion);

  // Loop-owned values. Time only advances while the loop runs, so pauses
  // don't skip ahead; mouse values are the eased (not raw) pointer.
  const frame = useRef<FrameState>({
    time: 0,
    intro: 0,
    mouseX: 0.5,
    mouseY: 0.5,
    mouseStrength: 0,
  });

  // Callback ref: the WebGL context lives exactly as long as the element
  const ref = useCallback((element: HTMLDivElement | null) => {
    if (!element) return;
    const instance = createGrainientRenderer(element);
    setRenderer(instance);
    return () => {
      instance.dispose();
      setRenderer(null);
    };
  }, []);

  // Push settings to the GPU. Cheap (in-place writes), so running it on every
  // render is fine; when the loop is paused, draw the change right away.
  useEffect(() => {
    if (!renderer) return;
    renderer.setSettings(settings);
    if (!animating) renderer.render();
  });

  // Paused (reduced motion): show the settled state without hover
  useEffect(() => {
    if (!renderer || animating) return;
    renderer.setFrame({ intro: 1, mouseStrength: 0 });
    renderer.render();
  }, [renderer, animating]);

  // Reveal on the frame after the first real draw
  useEffect(() => {
    if (!renderer || ready) return;
    const frameId = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(frameId);
  }, [renderer, ready]);

  useAnimationFrame((dt) => {
    if (!renderer) return;
    const f = frame.current;
    const target = pointer.current;

    f.time += dt / 1000;

    const { introDuration } = settings;
    f.intro =
      introDuration > 0 ? easeOutCubic(clamp01((f.time * 1000) / introDuration)) : 1;

    // Ease toward the pointer so the effect trails the cursor
    f.mouseX = damp(f.mouseX, target.x, POINTER_FOLLOW_RATE, dt);
    f.mouseY = damp(f.mouseY, target.y, POINTER_FOLLOW_RATE, dt);
    f.mouseStrength = damp(
      f.mouseStrength,
      target.active ? 1 : 0,
      POINTER_FADE_RATE,
      dt,
    );

    renderer.setFrame(f);
    renderer.render();
  }, animating);

  return { ref, ready };
};
