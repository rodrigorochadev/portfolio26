import { damp } from "../../utils/math";
import { CURSOR_TYPES, CursorType } from "./cursorTypes";

export type CursorController = {
  /**
   * Show a registered type now, or `null` to hide. Entering a `[data-cursor]` element sets its own
   * type, so an override lasts until the pointer moves to another target.
   */
  setType: (name: string | null) => void;
  /** Remove the element and every listener. */
  destroy: () => void;
};

type CursorOptions = {
  /** Where targets are looked for; one delegated `pointerover` listener goes here. */
  root?: Document | HTMLElement;
};

const TARGET = "[data-cursor]";
/** Above the flight overlay (z-50) so a click's fade-out isn't cut off, below the header (z-60). */
const Z_INDEX = "55";
/** Stop the loop once the cursor is this close (px) to the pointer. */
const SETTLE = 0.1;

const passive = { passive: true } as const;

/**
 * Custom cursor shown only over `[data-cursor]` targets, alongside the native one. One element, one
 * delegated `pointerover` listener while initialized; `pointermove` and the rest are attached only
 * while a target is hovered. Position is written with `translate` in a rAF loop that never reads
 * layout. Call only for a fine, hovering pointer; touch pointers are ignored regardless.
 */
export function initCursor({ root = document }: CursorOptions = {}): CursorController {
  const el = document.createElement("div");
  el.className = "custom-cursor";
  el.setAttribute("aria-hidden", "true");
  el.style.zIndex = Z_INDEX;
  document.body.append(el);

  const html = document.documentElement;
  const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  let reducedMotion = motionQuery.matches;

  let target: Element | null = null;
  let type: CursorType | null = null;
  // Pointer (goal) and drawn (current) positions, in viewport px.
  let px = 0;
  let py = 0;
  let x = 0;
  let y = 0;
  let placed = false;
  let frame = 0;
  let last = 0;
  let leaveTimer: ReturnType<typeof setTimeout> | undefined;
  // The target just clicked through. Ignored until the pointer reaches something else, so the cursor
  // doesn't come back over the old page while the transition runs.
  let dismissed: Element | null = null;

  const draw = () => {
    if (!type) return;
    const half = type.size / 2;
    // `translate`, not `transform`: CSS applies it after `scale`, so the show/press scale stays
    // centered on the cursor instead of scaling the offset from the viewport's corner too.
    el.style.translate = `${x + type.offset.x - half}px ${y + type.offset.y - half}px`;
  };

  const tick = (now: number) => {
    frame = 0;
    if (!type) return;
    // rAF timestamps are frame start times, so they can trail `last` slightly.
    const dt = Math.min(Math.max(now - last, 0), 64);
    last = now;

    if (reducedMotion || !Number.isFinite(type.follow)) {
      x = px;
      y = py;
    } else {
      x = damp(x, px, type.follow, dt);
      y = damp(y, py, type.follow, dt);
      if (Math.abs(px - x) < SETTLE && Math.abs(py - y) < SETTLE) {
        x = px;
        y = py;
      }
    }
    draw();
    if (x !== px || y !== py) frame = requestAnimationFrame(tick);
  };

  const schedule = () => {
    if (frame) return;
    last = performance.now();
    frame = requestAnimationFrame(tick);
  };

  // Hidden while the hovered card shows its own keyboard focus ring, so it never covers it.
  const focusRingShowing = () => {
    const focusable = target?.closest("a, button") ?? target;
    return !!focusable?.matches(":focus-visible");
  };

  const render = () => {
    const visible = !!type && !focusRingShowing();
    el.toggleAttribute("data-visible", visible);
    // Only hide the system cursor once ours is actually showing.
    html.toggleAttribute("data-cursor-hide-native", visible && !!type?.hideNative);
  };

  const setType = (name: string | null) => {
    const next = name ? CURSOR_TYPES[name] : undefined;
    type = next ?? null;
    if (type) {
      el.dataset.variant = type.variant;
      el.style.setProperty("--cursor-size", `${type.size}px`);
      el.textContent = target?.getAttribute("data-cursor-label") ?? type.label ?? "";
      if (placed) draw();
    }
    render();
  };

  const onMove = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    // The target can be unmounted under a still pointer (a page change), without a pointerout.
    if (target && !target.isConnected) return leave();
    px = event.clientX;
    py = event.clientY;
    if (!placed) {
      placed = true;
      x = px;
      y = py;
      draw();
    }
    schedule();
  };

  const onDown = () => el.setAttribute("data-pressed", "");
  const onUp = () => el.removeAttribute("data-pressed");
  // A plain click on a target navigates: fade out (CSS) rather than vanish under the new page.
  // Modified clicks (new tab) keep it.
  const onClick = (event: MouseEvent) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (!target?.contains(event.target as Node)) return;
    dismissed = target;
    leave();
  };
  // Pointer left the window.
  const onOut = (event: PointerEvent) => {
    if (!event.relatedTarget) leave();
  };

  const listen = (on: boolean) => {
    if (on) {
      window.addEventListener("pointermove", onMove, passive);
      window.addEventListener("pointerdown", onDown, passive);
      window.addEventListener("pointerup", onUp, passive);
      window.addEventListener("click", onClick, passive);
      document.addEventListener("pointerout", onOut, passive);
      document.addEventListener("focusin", render, passive);
      document.addEventListener("focusout", render, passive);
    } else {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("click", onClick);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("focusin", render);
      document.removeEventListener("focusout", render);
    }
  };

  const enter = (next: Element, event: PointerEvent) => {
    if (!target) listen(true);
    target = next;
    px = event.clientX;
    py = event.clientY;
    // Appear at the pointer, not flying in from wherever it was last.
    if (!placed || !el.hasAttribute("data-visible")) {
      placed = true;
      x = px;
      y = py;
    }
    setType(next.getAttribute("data-cursor"));
  };

  const cancelLeave = () => {
    clearTimeout(leaveTimer);
    leaveTimer = undefined;
  };

  function leave() {
    cancelLeave();
    if (!target) return;
    target = null;
    listen(false);
    cancelAnimationFrame(frame);
    frame = 0;
    placed = false;
    onUp();
    setType(null);
  }

  const onOver = (event: PointerEvent) => {
    if (event.pointerType === "touch") return;
    const next = (event.target as Element | null)?.closest?.(TARGET) ?? null;
    if (next && next === dismissed) return;
    dismissed = null;
    if (next) {
      cancelLeave();
      if (next !== target) enter(next, event);
    } else if (target && leaveTimer === undefined) {
      // Keep following meanwhile; `enter` cancels this if the pointer reaches another target.
      leaveTimer = setTimeout(leave, type?.leaveDelay ?? 0);
    }
  };

  const onMotionChange = () => {
    reducedMotion = motionQuery.matches;
  };

  root.addEventListener("pointerover", onOver as EventListener, passive);
  motionQuery.addEventListener("change", onMotionChange);

  return {
    setType,
    destroy: () => {
      dismissed = null;
      leave();
      root.removeEventListener("pointerover", onOver as EventListener);
      motionQuery.removeEventListener("change", onMotionChange);
      html.removeAttribute("data-cursor-hide-native");
      el.remove();
    },
  };
}
