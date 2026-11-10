import data from "@/app/data/awards.json";
import { getAwards } from "../../lib/awards";
import { projectPath } from "../../lib/projects";
import PageTransitionLink from "../projects/transition/PageTransitionLink";

/** Awards as a table-like list: one row per award, linking to the awarded project's case study. */
export default function AwardList() {
  const awards = getAwards();

  return (
    <section className="container w-full py-16 flex flex-col gap-6">
      <div className="flex items-center justify-between text-xs font-bold uppercase">
        <h2>{data.title}</h2>
        <span>({awards.length})</span>
      </div>
      <ul className="border-t border-text/10">
        {awards.map((award) => (
          <li
            key={`${award.issuer}-${award.title}-${award.project?.slug}`}
            className="grid grid-cols-[1fr_auto] md:grid-cols-12 gap-x-4 gap-y-1 border-b border-text/10 py-4 text-xs uppercase"
          >
            <span className="font-bold md:col-span-5">
              {award.href ? (
                <a href={award.href} target="_blank" rel="noopener noreferrer" className="text-hover">
                  {award.title} ↗
                </a>
              ) : (
                award.title
              )}
            </span>
            <span className="text-text-light text-right md:order-last md:col-span-1">
              {award.year}
            </span>
            <span className="text-text-light md:col-span-3">{award.issuer}</span>
            <span className="text-right md:text-left md:col-span-3">
              {award.project && (
                <PageTransitionLink href={projectPath(award.project.slug)} className="text-hover">
                  {award.project.title}
                </PageTransitionLink>
              )}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
