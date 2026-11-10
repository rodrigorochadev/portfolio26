import BlockSection from "./BlockSection";

type StatsBlockProps = {
  label?: string;
  items: { value: string; label: string }[];
};

export default function StatsBlock({ label, items }: StatsBlockProps) {
  return (
    <BlockSection label={label}>
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-8">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-2 border-t border-text/10 pt-4">
            <dt className="order-2 text-xs uppercase text-text-light">{item.label}</dt>
            <dd className="order-1 font-heading text-4xl md:text-5xl tracking-tight">{item.value}</dd>
          </div>
        ))}
      </dl>
    </BlockSection>
  );
}
