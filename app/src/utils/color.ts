export type Rgb = [r: number, g: number, b: number];

const HEX_PATTERN = /^([a-f\d]{3,4}|[a-f\d]{6}|[a-f\d]{8})$/i;

/**
 * Converts a hex color to normalized (0–1) RGB, e.g. for WebGL uniforms.
 * Accepts #rgb, #rgba, #rrggbb and #rrggbbaa (alpha is ignored); anything
 * else falls back to white.
 */
export const hexToRgb = (hex: string): Rgb => {
  let h = hex.replace(/^#/, "");
  if (!HEX_PATTERN.test(h)) return [1, 1, 1];
  if (h.length <= 4) h = [...h].map((c) => c + c).join("");
  return [
    parseInt(h.slice(0, 2), 16) / 255,
    parseInt(h.slice(2, 4), 16) / 255,
    parseInt(h.slice(4, 6), 16) / 255,
  ];
};

/** Whether dark text reads better than light text on this color (WCAG relative luminance). */
export const isLightColor = (hex: string): boolean => {
  const [r, g, b] = hexToRgb(hex).map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b > 0.179;
};
