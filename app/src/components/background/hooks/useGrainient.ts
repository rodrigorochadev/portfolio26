import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAnimationFrame } from "@/app/src/hooks/useAnimationFrame";
import { usePrefersReducedMotion } from "@/app/src/hooks/usePrefersReducedMotion";
import {
  createGrainientRenderer,
  type FrameState,
  type GrainientRenderer,
} from "../gl/createGrainientRenderer";
import { COLOR_FADE_RATE, POINTER_FADE_RATE, POINTER_FOLLOW_RATE } from "../settings";
import type { GrainientSettings } from "../types";
import { clamp01, damp, easeOutCubic } from "@/app/src/utils/math";
import { hexToRgb, type Rgb } from "@/app/src/utils/color";
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
    color2: null,
    hoverColor: null,
  });

  const color2 = useMemo(() => hexToRgb(settings.color2), [settings.color2]);
  const hoverColor = useMemo(() => hexToRgb(settings.hoverColor), [settings.hoverColor]);

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

  // Paused (reduced motion): show the settled state without hover. Colors snap to the settings
  // (written above), so drop the eased ones; if the loop resumes, it starts from the targets.
  useEffect(() => {
    if (!renderer || animating) return;
    frame.current.color2 = null;
    frame.current.hoverColor = null;
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

    // Ease color changes; the first frame starts at the target so the load never fades in a color
    f.color2 = dampColor(f.color2, color2, dt);
    f.hoverColor = dampColor(f.hoverColor, hoverColor, dt);

    renderer.setFrame(f);
    renderer.render();
  }, animating);

  return { ref, ready };
};

const dampColor = (current: Rgb | null, target: Rgb, dt: number): Rgb => {
  if (!current) return [...target];
  for (let i = 0; i < 3; i++) current[i] = damp(current[i], target[i], COLOR_FADE_RATE, dt);
  return current;
};
