import Image from "next/image";
import { Project } from "../../lib/projects";
import ProjectLink from "./ProjectLink";
import ProjectImageTarget from "./transition/ProjectImageTarget";

/**
 * Closing link to the following project, so a visitor can keep reading without going back. Its
 * thumbnail flies to the next project's hero, like a grid card.
 */
export default function NextProject({ project }: { project: Project }) {
  return (
    <ProjectLink
      project={project}
      fromGrid={false}
      data-next-project
      className="group grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 border-t border-text/10 pt-8"
    >
      <span className="text-xs font-bold uppercase text-text-light md:col-span-3">Next project</span>
      <div className="md:col-span-9 flex items-end justify-between gap-6">
        <div className="flex flex-col gap-2">
          <span className="font-heading text-4xl md:text-6xl tracking-tight uppercase transition-colors duration-200 ease-out group-hover:text-accent group-focus-visible:text-accent">
            {project.title}
          </span>
          <span className="text-text-light max-w-lg">{project.description}</span>
        </div>
        <ProjectImageTarget
          slug={project.slug}
          className="hidden sm:block aspect-4/3 w-40 md:w-56 shrink-0"
        >
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            sizes="224px"
            data-cursor="view"
            className="object-cover"
          />
        </ProjectImageTarget>
      </div>
    </ProjectLink>
  );
}
