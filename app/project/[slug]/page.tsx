import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  getProjectBySlug,
  getProjects,
  projectPath,
} from "@/app/src/lib/projects";
import { createPageMetadata } from "@/app/src/lib/seo/metadata/createPageMetadata";
import PageFade from "@/app/src/components/projects/transition/PageFade";
import ProjectBackLink from "@/app/src/components/projects/ProjectBackLink";
import ProjectHeroImage from "@/app/src/components/projects/ProjectHeroImage";

// Only slugs listed in projects.json exist; anything else 404s.
export const dynamicParams = false;

export function generateStaticParams() {
  return getProjects().map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  props: PageProps<"/project/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return createPageMetadata({
    title: project.title,
    description: project.description,
    path: projectPath(slug),
  });
}

export default async function ProjectPage(props: PageProps<"/project/[slug]">) {
  const { slug } = await props.params;
  const project = getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <PageFade>
      <main className="container w-full pt-16 pb-16 flex flex-col gap-8">
        <ProjectBackLink
          slug={slug}
          className="text-xs font-bold uppercase text-hover w-fit"
        >
          ← Back
        </ProjectBackLink>

        <header className="flex flex-col gap-4">
          <h1 className="font-heading text-5xl md:text-7xl tracking-tight uppercase">
            {project.title}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase text-text-light">
            <span>{project.year}</span>
            <span>{project.role}</span>
            <span>{project.tags.join(" / ")}</span>
          </div>
        </header>

        <ProjectHeroImage project={project} />

        <div className="flex flex-col gap-4 max-w-2xl">
          <p className="text-lg">{project.description}</p>
          <p className="text-text-light">{project.content}</p>
        </div>
      </main>
    </PageFade>
  );
}
