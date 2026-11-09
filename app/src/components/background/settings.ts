import type { GrainientSettings } from "./types";

export const DEFAULT_SETTINGS: GrainientSettings = {
  timeSpeed: 0.25,
  warpStrength: 1.0,
  warpFrequency: 5.0,
  warpSpeed: 2.0,
  warpAmplitude: 50.0,
  rotationAmount: 500.0,
  noiseScale: 2.0,

  color1: "#FF9FFC",
  color2: "#5227FF",
  color3: "#B497CF",
  colorBalance: 0.0,
  blendAngle: 0.0,
  blendSoftness: 0.05,

  grainAmount: 0.1,
  grainScale: 2.0,
  grainAnimated: false,

  contrast: 1.5,
  gamma: 1.0,
  saturation: 1.0,

  centerX: 0.0,
  centerY: 0.0,
  zoom: 0.9,

  hoverColor: "#FFFFFF",
  hoverRadius: 0.2,
  hoverIntensity: 0.5,
  hoverWarp: 0.15,

  introDuration: 800,
};

/** Fills in defaults; an explicit `undefined` prop also falls back to its default. */
export const resolveSettings = (
  overrides: Partial<GrainientSettings>,
): GrainientSettings => ({
  ...DEFAULT_SETTINGS,
  ...(Object.fromEntries(
    Object.entries(overrides).filter(([, value]) => value !== undefined),
  ) as Partial<GrainientSettings>),
});

// Easing rates for the pointer effect, per millisecond (higher = snappier)
export const POINTER_FOLLOW_RATE = 0.008;
export const POINTER_FADE_RATE = 0.004;
// Easing rate for color changes (e.g. a page recoloring the blob), per millisecond
export const COLOR_FADE_RATE = 0.0025;

// Cap the canvas resolution; >2x is invisible on a soft gradient but costly
export const MAX_DPR = 2;
