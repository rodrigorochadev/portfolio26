import Image from "next/image";

type GalleryBlockProps = {
  images: { src: string; alt: string }[];
  caption?: string;
};

export default function GalleryBlock({ images, caption }: GalleryBlockProps) {
  return (
    <figure className="flex flex-col gap-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {images.map((image) => (
          <div key={image.src} className="relative aspect-4/5 overflow-hidden rounded-sm">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
      {caption && <figcaption className="text-xs text-text-light max-w-xl">{caption}</figcaption>}
    </figure>
  );
}
