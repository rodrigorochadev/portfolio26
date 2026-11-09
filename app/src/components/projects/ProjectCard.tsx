import Image from "next/image";
import { Project, PROJECT_CARD_IMAGE_SIZES } from "../../lib/projects";
import ProjectLink from "./ProjectLink";
import ProjectImageTarget from "./transition/ProjectImageTarget";

type ProjectCardProps = {
  project: Project;
  priority?: boolean;
};

export default function ProjectCard({ project, priority }: ProjectCardProps) {
  return (
    <article id={project.slug} className="project-card flex flex-col gap-3 scroll-mt-16">
      <ProjectLink project={project} aria-label={`View ${project.title}`} className="block">
        <ProjectImageTarget slug={project.slug} className="aspect-4/3">
          <Image
            src={project.image.src}
            alt={project.image.alt}
            fill
            priority={priority}
            sizes={PROJECT_CARD_IMAGE_SIZES}
            className="project-card-image object-cover"
          />
        </ProjectImageTarget>
      </ProjectLink>
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs uppercase">
          <h3 className="font-bold">{project.title}</h3>
          <span className="text-text-light">{project.year}</span>
        </div>
        <p className="text-text-light max-w-lg">{project.description}</p>
      </div>
    </article>
  );
}
