// Client-only, module-level scroll positions of pages left through a transition, so a "Back" link
// can return to exactly where the visitor was. Empty on the server and on a fresh load.
const positions = new Map<string, number>();
let pendingRestore: string | null = null;

/** Called when a transition leaves the current page. */
export function rememberScroll() {
  positions.set(window.location.pathname, window.scrollY);
}

/** Whether `path` has a position to return to. */
export function hasSavedScroll(path: string) {
  return positions.has(path);
}

/** Ask the next mount of `path` to restore its saved position (instead of Next's scroll). */
export function requestScrollRestore(path: string) {
  pendingRestore = path;
}

/** The position to restore on arrival at `path`, once; `null` if this arrival shouldn't restore. */
export function takeScrollRestore(path: string) {
  if (pendingRestore !== path) return null;
  pendingRestore = null;
  return positions.get(path) ?? null;
}
