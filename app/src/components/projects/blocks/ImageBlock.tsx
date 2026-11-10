import Image from "next/image";
import { twMerge } from "tailwind-merge";

type ImageBlockProps = {
  src: string;
  alt: string;
  caption?: string;
  /** "wide" for a cinematic strip; defaults to 16:9. */
  aspect?: "wide";
};

export default function ImageBlock({ src, alt, caption, aspect }: ImageBlockProps) {
  return (
    <figure className="flex flex-col gap-3">
      <div
        className={twMerge(
          "relative w-full overflow-hidden rounded-sm",
          aspect === "wide" ? "aspect-video md:aspect-21/9" : "aspect-video",
        )}
      >
        <Image src={src} alt={alt} fill sizes="100vw" className="object-cover" />
      </div>
      {caption && <figcaption className="text-xs text-text-light max-w-xl">{caption}</figcaption>}
    </figure>
  );
}
