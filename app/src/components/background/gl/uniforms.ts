import type { GrainientSettings } from "../types";
import { hexToRgb } from "@/app/src/utils/color";

/**
 * Initial uniform values. Settings-driven ones are placeholders that
 * `applySettings` overwrites; runtime ones (time, pointer, intro) are driven
 * by the animation loop. Names must match `shaders/grainient.frag`.
 */
export const createUniforms = () => ({
  // Runtime
  iTime: { value: 0 },
  iResolution: { value: new Float32Array([1, 1]) },
  uMouse: { value: new Float32Array([0.5, 0.5]) },
  uMouseStrength: { value: 0 },
  uIntro: { value: 0 },

  // Settings
  uTimeSpeed: { value: 0 },
  uColorBalance: { value: 0 },
  uWarpStrength: { value: 0 },
  uWarpFrequency: { value: 0 },
  uWarpSpeed: { value: 0 },
  uWarpAmplitude: { value: 0 },
  uBlendAngle: { value: 0 },
  uBlendSoftness: { value: 0 },
  uRotationAmount: { value: 0 },
  uNoiseScale: { value: 0 },
  uGrainAmount: { value: 0 },
  uGrainScale: { value: 0 },
  uGrainAnimated: { value: 0 },
  uContrast: { value: 0 },
  uGamma: { value: 0 },
  uSaturation: { value: 0 },
  uCenterOffset: { value: new Float32Array(2) },
  uZoom: { value: 0 },
  uColor1: { value: new Float32Array(3) },
  uColor2: { value: new Float32Array(3) },
  uColor3: { value: new Float32Array(3) },
  uHoverColor: { value: new Float32Array(3) },
  uHoverRadius: { value: 0 },
  uHoverIntensity: { value: 0 },
  uHoverWarp: { value: 0 },
});

export type Uniforms = ReturnType<typeof createUniforms>;

/** Writes settings into the uniforms in place (no allocation, no GL calls). */
export const applySettings = (u: Uniforms, s: GrainientSettings) => {
  u.uTimeSpeed.value = s.timeSpeed;
  u.uColorBalance.value = s.colorBalance;
  u.uWarpStrength.value = s.warpStrength;
  u.uWarpFrequency.value = s.warpFrequency;
  u.uWarpSpeed.value = s.warpSpeed;
  u.uWarpAmplitude.value = s.warpAmplitude;
  u.uBlendAngle.value = s.blendAngle;
  u.uBlendSoftness.value = s.blendSoftness;
  u.uRotationAmount.value = s.rotationAmount;
  u.uNoiseScale.value = s.noiseScale;
  u.uGrainAmount.value = s.grainAmount;
  u.uGrainScale.value = s.grainScale;
  u.uGrainAnimated.value = s.grainAnimated ? 1 : 0;
  u.uContrast.value = s.contrast;
  u.uGamma.value = s.gamma;
  u.uSaturation.value = s.saturation;
  u.uCenterOffset.value.set([s.centerX, s.centerY]);
  u.uZoom.value = s.zoom;
  u.uColor1.value.set(hexToRgb(s.color1));
  u.uColor2.value.set(hexToRgb(s.color2));
  u.uColor3.value.set(hexToRgb(s.color3));
  u.uHoverColor.value.set(hexToRgb(s.hoverColor));
  u.uHoverRadius.value = s.hoverRadius;
  u.uHoverIntensity.value = s.hoverIntensity;
  u.uHoverWarp.value = s.hoverWarp;
};
