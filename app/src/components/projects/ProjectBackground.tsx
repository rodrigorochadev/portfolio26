"use client";

import { useEffect } from "react";
import { BackgroundTheme, useBackgroundTheme } from "../background/backgroundTheme";

/** Recolors the background while a project page is mounted (covers direct visits and browser back). */
export default function ProjectBackground({ theme }: { theme: BackgroundTheme }) {
  const { blob, hover } = theme;

  useEffect(() => {
    const { setTheme } = useBackgroundTheme.getState();
    setTheme({ blob, hover });
    return () => setTheme(null);
  }, [blob, hover]);

  return null;
}
