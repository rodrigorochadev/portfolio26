import { Mesh, Program, Renderer, Triangle } from "ogl";
import vertex from "./liquid.vert";
import fragment from "./liquid.frag";
import { clamp01, damp, easeOutCubic } from "@/app/src/utils/math";
import type { CursorFrame, CursorRendererFactory } from "../cursorTypes";

/** Trail length; must match POINTS in liquid.frag. */
const POINTS = 6;
/** Head radius, CSS px. Leaves room for the label (the CSS dot is 64px). */
const RADIUS = 30;
/** How quickly each trail drop chases the one ahead (per ms); later ones lag more. */
const TRAIL_RATES = [0.055, 0.047, 0.04, 0.034, 0.029];
/** Furthest the trail stretches from the head, CSS px: a squish more than a tail. */
const MAX_STRETCH = 24;
const PRESSED_SCALE = 0.82;
/**
 * Size changes, ms: hiding is a slow ease-in-out, anything else (showing, press, release) a quicker
 * ease-out. Keep in sync with `--cursor-leave-*` / `--cursor-enter-*` in globals.css (the label).
 */
const LEAVE = { duration: 600, ease: (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2) };
const ENTER = { duration: 350, ease: easeOutCubic };
/** Same cap as the background: more is invisible on something this soft. */
const MAX_DPR = 2;

/** Outline width, CSS px. */
const STROKE = 1.5;

/**
 * A liquid drop: the head sits on the pointer, a chain of smaller drops chases it and melts into it
 * (metaballs in the fragment shader), and it eases in and out. Draws into a small canvas
 * that moves with the cursor element, so the shader only ever covers that square.
 */
export const createLiquidRenderer: CursorRendererFactory = (el, type) => {
  const size = type.size;
  const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
  const renderer = new Renderer({ webgl: 2, alpha: true, premultipliedAlpha: true, antialias: false, dpr });
  const gl = renderer.gl;
  // No WebGL 2: the core catches this and keeps the CSS look.
  if (!(gl instanceof WebGL2RenderingContext)) throw new Error("WebGL 2 unavailable");
  gl.clearColor(0, 0, 0, 0);
  renderer.setSize(size, size);

  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.style.cssText = "position:absolute;inset:0;width:100%;height:100%;display:block";
  el.append(canvas);

  // Pairs rather than one flat array: OGL matches `uPoints[0]` to an Array value.
  const points = Array.from({ length: POINTS }, () => [0, 0]);
  const uniforms = {
    uSize: { value: size },
    uDpr: { value: gl.drawingBufferWidth / size },
    uPoints: { value: points },
    uRadius: { value: RADIUS },
    uScale: { value: 0 },
    uTime: { value: 0 },
    uWobble: { value: 1 },
    uStroke: { value: STROKE },
  };
  const program = new Program(gl, { vertex, fragment, uniforms, transparent: true });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  // Trail in viewport px; index 0 is the head.
  const trail = Array.from({ length: POINTS }, () => ({ x: 0, y: 0 }));
  let scale = 0;
  // The size tween: restarted from wherever it is whenever the goal changes.
  let tweenFrom = 0;
  let tweenTo = 0;
  let tween = ENTER;
  let tweenElapsed = Infinity;
  let time = 0;
  let placed = false;
  // Never past the canvas edge either.
  const reach = Math.min(MAX_STRETCH, size / 2 - RADIUS - 6);

  const frame = ({ x, y, dt, visible, pressed, reducedMotion }: CursorFrame) => {
    const goal = visible ? (pressed ? PRESSED_SCALE : 1) : 0;
    if (goal !== tweenTo) {
      tweenFrom = scale;
      tweenTo = goal;
      tween = goal === 0 ? LEAVE : ENTER;
      tweenElapsed = 0;
    }
    // Appearing from nothing: start whole at the pointer.
    const fresh = scale < 0.01 && visible;
    if (!placed || fresh) {
      placed = true;
      for (const point of trail) {
        point.x = x;
        point.y = y;
      }
    }

    trail[0].x = x;
    trail[0].y = y;
    let trailing = false;
    for (let i = 1; i < POINTS; i++) {
      const point = trail[i];
      const ahead = trail[i - 1];
      if (reducedMotion) {
        point.x = x;
        point.y = y;
        continue;
      }
      point.x = damp(point.x, ahead.x, TRAIL_RATES[i - 1], dt);
      point.y = damp(point.y, ahead.y, TRAIL_RATES[i - 1], dt);
      const dx = point.x - x;
      const dy = point.y - y;
      const distance = Math.hypot(dx, dy);
      if (distance > reach) {
        point.x = x + (dx / distance) * reach;
        point.y = y + (dy / distance) * reach;
      }
      if (distance > 0.1) trailing = true;
      // Relative to the head, y up for GL.
      points[i][0] = point.x - x;
      points[i][1] = y - point.y;
    }
    if (reducedMotion) {
      for (const point of points) point.fill(0);
      scale = goal;
      tweenElapsed = Infinity;
    } else {
      tweenElapsed += dt;
      scale = tweenFrom + (tweenTo - tweenFrom) * tween.ease(clamp01(tweenElapsed / tween.duration));
      time += dt / 1000;
    }

    uniforms.uScale.value = scale;
    uniforms.uTime.value = time;
    uniforms.uWobble.value = reducedMotion ? 0 : 1;
    renderer.render({ scene: mesh });

    if (reducedMotion) return false;
    // Keep going while shown (it idles with a wobble), mid-tween, or the trail is catching up.
    return visible || scale > 0 || tweenElapsed < tween.duration || trailing;
  };

  return {
    frame,
    destroy: () => {
      canvas.remove();
      // Free the context now; browsers cap live WebGL contexts (Strict Mode / HMR remounts add up).
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
};
