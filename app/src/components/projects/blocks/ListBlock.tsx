import BlockSection from "./BlockSection";

type ListBlockProps = {
  label?: string;
  heading: string;
  items: { title: string; body: string }[];
};

export default function ListBlock({ label, heading, items }: ListBlockProps) {
  return (
    <BlockSection label={label}>
      <h3 className="font-heading text-3xl md:text-4xl tracking-tight max-w-3xl">{heading}</h3>
      <ol className="flex flex-col">
        {items.map((item, index) => (
          <li
            key={item.title}
            className="grid grid-cols-[3rem_1fr] gap-x-4 gap-y-2 border-t border-text/10 py-6 md:grid-cols-[4rem_1fr_1.4fr]"
          >
            <span className="text-xs font-bold text-text-light pt-1">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h4 className="font-bold">{item.title}</h4>
            <p className="col-start-2 text-text-light md:col-start-3">{item.body}</p>
          </li>
        ))}
      </ol>
    </BlockSection>
  );
}
