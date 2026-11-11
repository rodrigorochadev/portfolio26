"use client";

import { useRef } from "react";
import { cn } from "@/app/src/utils";
import TitleAnimation, {
  TRANSPARENT,
} from "../misc/titleAnimation/TitleAnimation";

import data from "@/app/data/hero.json";

export default function Hero() {
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  return (
    <div className="container h-[calc(100dvh-28px)] w-full flex flex-col justify-end md:flex-row md:items-end md:justify-between pb-3 gap-2">
      <div className="flex items-end justify-between">
        <div className="flex flex-col gap-4">
          <div className="mix-blend-difference">
            <TitleAnimation
              label={data.title?.label ?? ""}
              fadeIn={descriptionRef}
              className={cn(
                "hero-title font-heading max-w-xl",
                data.title?.settings.uppercase && "uppercase",
              )}
            />
          </div>
          <p
            ref={descriptionRef}
            className={cn("text-text-light max-w-lg", TRANSPARENT)}
          >
            {data.subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
