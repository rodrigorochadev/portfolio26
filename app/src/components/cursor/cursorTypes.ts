/**
 * Cursor types, as data. An element opts in with `data-cursor="<type>"`; the cursor core reads the
 * entry when the pointer enters it, so a new type is just a new entry (or a `registerCursorType`
 * call) plus any CSS for its variant. The core never needs to change.
 */
export type CursorType = {
  /** Styling hook: the element gets `data-variant="<variant>"`, matched in CSS. */
  variant: string;
  /** Diameter in CSS px. Known up front so the loop never measures the element. */
  size: number;
  /** Where the cursor's center sits relative to the pointer, in CSS px. */
  offset: { x: number; y: number };
  /** How quickly it catches up with the pointer (per ms); `Infinity` snaps. Reduced motion always snaps. */
  follow: number;
  /**
   * How long (ms) it lingers after the pointer leaves a target. Entering another target meanwhile
   * moves it there instead of hiding, so crossing the gap between cards doesn't flash it.
   */
  leaveDelay?: number;
  /** Text inside the cursor. A target's `data-cursor-label` overrides it. */
  label?: string;
  /**
   * Hide the system cursor over the target while this one is showing. Off by default: the native
   * pointer stays visible, and is only hidden once the custom one has actually rendered.
   */
  hideNative?: boolean;
  /**
   * Draws the cursor itself (e.g. WebGL), loaded the first time the type is shown. Until it's
   * ready, or if it throws, the element keeps its plain CSS look.
   */
  renderer?: () => Promise<CursorRendererFactory>;
};

/** What a renderer gets each frame. */
export type CursorFrame = {
  /** Cursor center in viewport px. */
  x: number;
  y: number;
  /** Frame time in ms. */
  dt: number;
  visible: boolean;
  pressed: boolean;
  reducedMotion: boolean;
  /** The hovered target's `data-*` attributes (the last target's, while hiding). */
  data: DOMStringMap;
};

export type CursorRenderer = {
  /** Draw one frame; return true to be called again on the next one. */
  frame: (state: CursorFrame) => boolean;
  destroy: () => void;
};

/** Mounts a renderer into the cursor element. */
export type CursorRendererFactory = (el: HTMLElement, type: CursorType) => CursorRenderer;

export const CURSOR_TYPES: Record<string, CursorType> = {
  /** A "View" pill centered on the pointer. */
  view: {
    variant: "pill",
    size: 64,
    offset: { x: 0, y: 0 },
    follow: 0.02,
    leaveDelay: 100,
    label: "View",
  },
  /**
   * Project cards: the outline of a liquid drop with a gooey trail, around the label. It replaces
   * the pointer, and lags in its trail rather than in position, so the click point stays under the
   * drop's center.
   */
  liquid: {
    variant: "liquid",
    size: 240,
    offset: { x: 0, y: 0 },
    follow: Infinity,
    leaveDelay: 100,
    label: "View",
    hideNative: true,
    renderer: () => import("./renderers/liquid").then((m) => m.createLiquidRenderer),
  },
};

export const registerCursorType = (name: string, type: CursorType) => {
  CURSOR_TYPES[name] = type;
};
