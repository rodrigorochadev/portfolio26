import { PropsWithChildren } from "react";
import { twMerge } from "tailwind-merge";

type BlockSectionProps = PropsWithChildren<{
  /** Small uppercase label in the left column, e.g. "The problem". */
  label?: string;
  className?: string;
}>;

/** Shared editorial layout for text-like blocks: a label column and a content column. */
export default function BlockSection({ label, className, children }: BlockSectionProps) {
  return (
    <section className={twMerge("grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-8", className)}>
      {label ? (
        <h2 className="text-xs font-bold uppercase text-text-light md:col-span-3 md:pt-1">{label}</h2>
      ) : (
        <div aria-hidden className="hidden md:block md:col-span-3" />
      )}
      <div className="md:col-span-9 flex flex-col gap-6">{children}</div>
    </section>
  );
}
