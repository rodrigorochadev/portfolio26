import { Mesh, Program, Renderer, Triangle } from "ogl";
import vertex from "../shaders/grainient.vert";
import fragment from "../shaders/grainient.frag";
import { MAX_DPR } from "../settings";
import type { GrainientSettings } from "../types";
import { applySettings, createUniforms } from "./uniforms";

/** Per-frame values driven by the animation loop. */
export type FrameState = {
  /** Seconds of animation time. */
  time: number;
  /** Settle-in progress, 0 → 1. */
  intro: number;
  /** Pointer position in uv space (origin bottom-left). */
  mouseX: number;
  mouseY: number;
  /** Hover effect strength, 0 → 1. */
  mouseStrength: number;
};

/**
 * Framework-agnostic WebGL setup: mounts a full-size canvas into `container`,
 * keeps it sized to the container, and draws on demand. Animation, input and
 * settings are driven from the outside through `setSettings` / `setFrame`.
 */
export const createGrainientRenderer = (container: HTMLElement) => {
  const renderer = new Renderer({
    webgl: 2,
    alpha: true,
    antialias: false,
    dpr: Math.min(window.devicePixelRatio || 1, MAX_DPR),
  });
  const gl = renderer.gl;
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.style.width = "100%";
  canvas.style.height = "100%";
  canvas.style.display = "block";
  container.appendChild(canvas);

  // A single oversized triangle covers the screen; the fragment shader does the rest
  const uniforms = createUniforms();
  const program = new Program(gl, { vertex, fragment, uniforms });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  const render = () => renderer.render({ scene: mesh });

  const resize = () => {
    const rect = container.getBoundingClientRect();
    renderer.setSize(
      Math.max(1, Math.floor(rect.width)),
      Math.max(1, Math.floor(rect.height)),
    );
    // gl_FragCoord is in device pixels, so match the drawing buffer, not CSS px
    uniforms.iResolution.value.set([gl.drawingBufferWidth, gl.drawingBufferHeight]);
    render();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  const dispose = () => {
    resizeObserver.disconnect();
    canvas.remove();
    // Free the GPU context now instead of waiting for GC; browsers cap the
    // number of live WebGL contexts (Strict Mode / HMR remounts add up).
    gl.getExtension("WEBGL_lose_context")?.loseContext();
  };

  const setSettings = (settings: GrainientSettings) =>
    applySettings(uniforms, settings);

  const setFrame = (frame: Partial<FrameState>) => {
    if (frame.time !== undefined) uniforms.iTime.value = frame.time;
    if (frame.intro !== undefined) uniforms.uIntro.value = frame.intro;
    if (frame.mouseX !== undefined) uniforms.uMouse.value[0] = frame.mouseX;
    if (frame.mouseY !== undefined) uniforms.uMouse.value[1] = frame.mouseY;
    if (frame.mouseStrength !== undefined) {
      uniforms.uMouseStrength.value = frame.mouseStrength;
    }
  };

  return { element: container, setSettings, setFrame, render, dispose };
};

export type GrainientRenderer = ReturnType<typeof createGrainientRenderer>;
