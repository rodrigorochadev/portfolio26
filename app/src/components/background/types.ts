export type GrainientSettings = {
  // Motion
  timeSpeed: number;
  warpStrength: number;
  warpFrequency: number;
  warpSpeed: number;
  warpAmplitude: number;
  rotationAmount: number;
  noiseScale: number;

  // Color blending
  color1: string;
  color2: string;
  color3: string;
  colorBalance: number;
  blendAngle: number;
  blendSoftness: number;

  // Grain
  grainAmount: number;
  grainScale: number;
  grainAnimated: boolean;

  // Color grading
  contrast: number;
  gamma: number;
  saturation: number;

  // Framing
  centerX: number;
  centerY: number;
  zoom: number;

  // Pointer hover — only lights the color2 band
  hoverColor: string;
  /** Radius as a fraction of the viewport height. */
  hoverRadius: number;
  hoverIntensity: number;
  /** How strongly the gradient bends toward the cursor. 0 disables it. */
  hoverWarp: number;

  /** Length of the settle-in animation on first load, in ms. 0 disables it. */
  introDuration: number;
};

export type BackgroundProps = Partial<GrainientSettings> & {
  className?: string;
};
