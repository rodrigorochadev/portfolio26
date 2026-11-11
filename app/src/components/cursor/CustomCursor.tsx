"use client";

import { useEffect } from "react";
import type { CursorController } from "./cursor";

/** A mouse or pen as the primary pointer. Touch-only and coarse-pointer devices keep the native cursor. */
const FINE_POINTER = "(hover: hover) and (pointer: fine)";

/**
 * Mounts the custom cursor (see `cursor.ts`) for fine pointers only. The core is loaded on demand,
 * so where it's disabled no code, element or listener beyond this media query exists. It follows
 * the query live, e.g. a tablet docked to a mouse.
 */
export default function CustomCursor() {
  useEffect(() => {
    const query = window.matchMedia(FINE_POINTER);
    let cursor: CursorController | null = null;
    // Bumped on every change so a stale import can't mount after the query flipped or on unmount.
    let version = 0;

    const sync = () => {
      const current = ++version;
      if (!query.matches) {
        cursor?.destroy();
        cursor = null;
        return;
      }
      if (cursor) return;
      import("./cursor").then(({ initCursor }) => {
        if (current === version && !cursor) cursor = initCursor();
      });
    };

    sync();
    query.addEventListener("change", sync);
    return () => {
      version++;
      query.removeEventListener("change", sync);
      cursor?.destroy();
    };
  }, []);

  return null;
}
