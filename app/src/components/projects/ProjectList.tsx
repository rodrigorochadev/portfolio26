import data from "@/app/data/projects.json";
import { getProjects, Project, PROJECTS_PATH } from "../../lib/projects";
import ProjectCard from "./ProjectCard";
import ProjectGrid from "./ProjectGrid";
import PageTransitionLink from "./transition/PageTransitionLink";

type ProjectListProps = {
  /** Defaults to every project. */
  projects?: Project[];
  /** Small uppercase heading; omit when the page already has its own title. */
  title?: string;
  /** Show a link to /projects below the grid. */
  seeAll?: boolean;
  className?: string;
};

export default function ProjectList({
  projects = getProjects(),
  title,
  seeAll = false,
  className = "container w-full py-16",
}: ProjectListProps) {
  return (
    <section className={`${className} flex flex-col gap-6`}>
      {title && <h2 className="text-xs font-bold uppercase">{title}</h2>}
      <ProjectGrid>
        {projects.map((project) => (
          <ProjectCard key={`project-${project.slug}`} project={project} />
        ))}
      </ProjectGrid>
      {seeAll && (
        <PageTransitionLink
          href={PROJECTS_PATH}
          className="mt-6 flex items-center justify-between border-t border-text/10 pt-6 text-xs font-bold uppercase"
        >
          <span>{data.seeAllLabel}</span>
          <span>({getProjects().length}) →</span>
        </PageTransitionLink>
      )}
    </section>
  );
}
