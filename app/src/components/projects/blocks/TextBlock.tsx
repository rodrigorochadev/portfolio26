import BlockSection from "./BlockSection";

type TextBlockProps = {
  label?: string;
  heading: string;
  body: string[];
};

export default function TextBlock({ label, heading, body }: TextBlockProps) {
  return (
    <BlockSection label={label}>
      <h3 className="font-heading text-3xl md:text-4xl tracking-tight max-w-3xl">{heading}</h3>
      <div className="flex flex-col gap-4 max-w-2xl text-text-light">
        {body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </BlockSection>
  );
}
