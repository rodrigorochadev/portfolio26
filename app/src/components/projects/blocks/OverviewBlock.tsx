import BlockSection from "./BlockSection";

type OverviewBlockProps = {
  lead: string;
  facts: { label: string; value: string }[];
};

export default function OverviewBlock({ lead, facts }: OverviewBlockProps) {
  return (
    <BlockSection label="Overview">
      <p className="text-xl md:text-2xl leading-snug max-w-3xl">{lead}</p>
      <dl className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-4 border-t border-text/10 pt-6">
        {facts.map((fact) => (
          <div key={fact.label} className="flex flex-col gap-1">
            <dt className="text-xs font-bold uppercase text-text-light">{fact.label}</dt>
            <dd className="text-sm">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </BlockSection>
  );
}
