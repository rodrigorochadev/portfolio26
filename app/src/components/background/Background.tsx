"use client";
import { cn } from "@/app/src/utils";
import { useGrainient } from "./hooks/useGrainient";
import { resolveSettings } from "./settings";
import { useBackgroundTheme } from "./backgroundTheme";
import type { BackgroundProps } from "./types";

/**
 * Full-screen animated grain gradient ("Grainient") rendered in WebGL behind
 * the page. Fades in once the first frame is ready and reacts to the pointer.
 */
export default function Background({ className, ...props }: BackgroundProps) {
  const theme = useBackgroundTheme((s) => s.theme);
  const { ref, ready } = useGrainient(
    resolveSettings({
      ...props,
      ...(theme && { color2: theme.blob, hoverColor: theme.hover }),
    }),
  );

  return (
    <div
      ref={ref}
      aria-hidden
      data-ready={ready}
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        "opacity-0 transition-opacity duration-1000 ease-out data-[ready=true]:opacity-100",
        className,
      )}
    />
  );
}
