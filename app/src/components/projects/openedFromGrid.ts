import { getFeaturedProjects, PROJECTS_PATH } from "../../lib/projects";

// Client-only, module-level: survives client navigations but is always empty on the server and on a
// fresh page load, so reading it never causes a hydration mismatch.
let lastOpenedSlug: string | null = null;
let lastGridPath: string | null = null;

/** Called when a project card is clicked, right before navigating to the project. */
export function markOpenedFromGrid(slug: string, gridPath: string) {
  lastOpenedSlug = slug;
  lastGridPath = gridPath;
}

/**
 * The grid page the project was opened from. Otherwise (direct visit, "next project" link) home if
 * the project is featured there, else /projects: Back always has a card to land on.
 */
export function gridPathFor(slug: string) {
  if (lastOpenedSlug === slug && lastGridPath) return lastGridPath;
  return getFeaturedProjects().some((project) => project.slug === slug) ? "/" : PROJECTS_PATH;
}
