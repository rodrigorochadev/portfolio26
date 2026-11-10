import BlockSection from "./BlockSection";

type CodeBlockProps = {
  label?: string;
  filename: string;
  language: string;
  code: string;
  caption?: string;
};

export default function CodeBlock({ label, filename, language, code, caption }: CodeBlockProps) {
  return (
    <BlockSection label={label}>
      <figure className="flex flex-col gap-3">
        <div className="overflow-hidden rounded-sm border border-text/10 bg-background/60 backdrop-blur-sm">
          <div className="flex items-center justify-between border-b border-text/10 px-4 py-2 text-xs text-text-light">
            <span>{filename}</span>
            <span className="uppercase">{language}</span>
          </div>
          {/* Wide lines scroll sideways; Lenis would otherwise hijack the trackpad gesture. */}
          <pre data-lenis-prevent-horizontal className="overflow-x-auto p-4 text-xs md:text-sm leading-relaxed">
            <code>{code}</code>
          </pre>
        </div>
        {caption && <figcaption className="text-xs text-text-light max-w-xl">{caption}</figcaption>}
      </figure>
    </BlockSection>
  );
}
