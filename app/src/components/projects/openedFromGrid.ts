// Client-only, module-level: survives client navigations but is always empty on the server and on a
// fresh page load, so reading it never causes a hydration mismatch.
let lastOpenedSlug: string | null = null;

/** Called when a project card is clicked, right before navigating to the project. */
export function markOpenedFromGrid(slug: string) {
  lastOpenedSlug = slug;
}

/** True when the current project page was reached by clicking its card in this session. */
export function wasOpenedFromGrid(slug: string) {
  return lastOpenedSlug === slug;
}
