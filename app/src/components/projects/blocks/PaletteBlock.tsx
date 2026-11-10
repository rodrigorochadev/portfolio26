import Image from "next/image";
import { isLightColor } from "@/app/src/utils/color";
import { cn } from "@/app/src/utils";

type PaletteBlockProps = {
  colors: { name: string; hex: string }[];
  /** Shown beside the swatches on desktop, below them on mobile. */
  image?: { src: string; alt: string };
  caption?: string;
};

/**
 * The project's color palette as full-height swatches: the first (primary) color takes most of the
 * width, each labeled with its hex, index and name running vertically.
 */
export default function PaletteBlock({ colors, image, caption }: PaletteBlockProps) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="flex flex-col md:flex-row gap-4">
        <ul
          aria-label="Color palette"
          className={cn("flex h-[70vw] md:h-auto md:aspect-4/3 overflow-hidden rounded-sm", image ? "md:flex-2" : "w-full md:aspect-21/9")}
        >
          {colors.map((color, index) => (
            <li
              key={color.hex}
              style={{ backgroundColor: color.hex }}
              className={cn(
                "flex justify-end p-3 md:p-5",
                index === 0 ? "flex-5" : "flex-1",
                isLightColor(color.hex) ? "text-black" : "text-white",
              )}
            >
              <div className="flex flex-col justify-between text-[0.625rem] md:text-xs uppercase [writing-mode:vertical-rl]">
                <span>{color.hex.replace("#", "")}</span>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <span>{color.name}</span>
              </div>
            </li>
          ))}
        </ul>
        {image && (
          <div className="relative aspect-4/3 md:aspect-auto md:flex-1 overflow-hidden rounded-sm">
            <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
          </div>
        )}
      </div>
      {caption && <figcaption className="text-xs text-text-light max-w-xl">{caption}</figcaption>}
    </figure>
  );
}
