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
};

export const CURSOR_TYPES: Record<string, CursorType> = {
  /** Project cards: a "View" pill centered on the pointer. */
  view: {
    variant: "pill",
    size: 64,
    offset: { x: 0, y: 0 },
    follow: 0.02,
    leaveDelay: 100,
    label: "View",
  },
};

export const registerCursorType = (name: string, type: CursorType) => {
  CURSOR_TYPES[name] = type;
};
