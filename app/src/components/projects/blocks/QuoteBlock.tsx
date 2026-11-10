import BlockSection from "./BlockSection";

type QuoteBlockProps = {
  quote: string;
  author: string;
  role: string;
};

export default function QuoteBlock({ quote, author, role }: QuoteBlockProps) {
  return (
    <BlockSection>
      <figure className="flex flex-col gap-6 max-w-4xl">
        <blockquote className="font-heading text-3xl md:text-5xl tracking-tight leading-tight">
          “{quote}”
        </blockquote>
        <figcaption className="flex flex-col text-xs uppercase">
          <span className="font-bold">{author}</span>
          <span className="text-text-light">{role}</span>
        </figcaption>
      </figure>
    </BlockSection>
  );
}
