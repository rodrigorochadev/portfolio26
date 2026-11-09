import { create } from "zustand";

export type Rect = { top: number; left: number; width: number; height: number };

/** Timings in seconds. The destination page finishes fading in just before the image lands. */
export const TIMING = {
  leave: 0.5,
  fly: 1.4,
  enter: 0.7,
  get enterDelay() {
    return this.fly - this.enter - 0.1;
  },
};

/** easeInOutQuint: a soft start, a long glide, and a gentle settle. */
export const FLY_EASE = [0.83, 0, 0.17, 1] as const;

/** The "liquify" ripple on the flying image. Keep it subtle: it should read as fluid, not warped. */
export const LIQUIFY = {
  /** Peak displacement, in CSS px. */
  strength: 52,
  /** Noise frequency [x, y]; lower means broader, slower-looking waves. */
  frequency: [0.005, 0.008] as const,
  /** How much the noise reshapes over time (fraction of the frequency), so the ripple keeps flowing. */
  flow: 0.2,
  /** How far into the expansion the ripple has fully settled (must be < 1). */
  settle: 0.8,
};

type Flight = {
  /** Distinguishes flights, so a page only treats itself as the destination of the one it mounted during. */
  id: number;
  slug: string;
  /** The exact file the source image is showing, so the moving copy is already loaded. */
  src: string;
  from: Rect;
  radius: string;
  /** Source image's inner scale (hover zoom) at click time, eased back to 1 during the flight. */
  scale: number;
  /** Set once the destination image has mounted and been measured. */
  to: Rect | null;
  /** The copy has reached the destination, which can now show itself underneath it. */
  landed: boolean;
};

type ProjectTransitionState = {
  flight: Flight | null;
  begin: (flight: Omit<Flight, "id" | "to" | "landed">) => void;
  land: (slug: string, to: Rect) => void;
  arrive: () => void;
  finish: () => void;
};

let lastFlightId = 0;

/**
 * One project image flying between pages. The overlay renders it on top; the destination image
 * stays hidden until the copy has landed exactly over it, then the copy is removed.
 */
export const useProjectTransition = create<ProjectTransitionState>(
  (set, get) => ({
    flight: null,
    begin: (flight) =>
      set({
        flight: { ...flight, id: ++lastFlightId, to: null, landed: false },
      }),
    land: (slug, to) => {
      const { flight } = get();
      if (flight && flight.slug === slug && !flight.to)
        set({ flight: { ...flight, to } });
    },
    arrive: () => {
      const { flight } = get();
      if (flight?.to && !flight.landed)
        set({ flight: { ...flight, landed: true } });
    },
    finish: () => set({ flight: null }),
  }),
);

/** Id of the flight in progress, if any; read once at mount to know if this is its destination. */
export function currentFlightId(slug?: string) {
  const { flight } = useProjectTransition.getState();
  if (!flight || (slug && flight.slug !== slug)) return null;
  return flight.id;
}

export function toRect({ top, left, width, height }: DOMRect): Rect {
  return { top, left, width, height };
}
