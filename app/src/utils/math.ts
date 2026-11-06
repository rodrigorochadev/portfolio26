export const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

export const easeOutCubic = (t: number) => 1 - (1 - t) ** 3;

/**
 * Frame-rate independent exponential approach of `current` toward `target`.
 * `rate` is per millisecond, `dt` is the frame time in milliseconds.
 */
export const damp = (current: number, target: number, rate: number, dt: number) =>
  current + (target - current) * (1 - Math.exp(-rate * dt));
