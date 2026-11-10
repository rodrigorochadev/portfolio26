import { notFound } from "next/navigation";
import type { Metadata } from "next";

import {
  getNextProject,
  getProjectBySlug,
  getProjects,
  projectPath,
} from "@/app/src/lib/projects";
import { createPageMetadata } from "@/app/src/lib/seo/metadata/createPageMetadata";
import PageFade from "@/app/src/components/projects/transition/PageFade";
import ProjectBackLink from "@/app/src/components/projects/ProjectBackLink";
import ProjectBackground from "@/app/src/components/projects/ProjectBackground";
import ProjectBlocks from "@/app/src/components/projects/blocks/ProjectBlocks";
import NextProject from "@/app/src/components/projects/NextProject";
import ProjectHeroImage from "@/app/src/components/projects/ProjectHeroImage";

// Only slugs listed in projects.json exist; anything else 404s (restart `next dev` after adding one).
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
      <ProjectBackground theme={project.background} />
      {/* Fixed to the viewport, so it's reachable from anywhere on a long case study. Inside PageFade
          (opacity only, no transform), so it still fades with the page during transitions. */}
      <ProjectBackLink
        slug={slug}
        className="fixed left-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 rounded-full border border-text/10 bg-background/60 px-4 py-2 text-xs font-bold uppercase backdrop-blur-md text-hover"
      >
        ← Back
      </ProjectBackLink>

      {/* Bottom padding keeps the last content clear of the fixed Back button. */}
      <main className="container w-full pt-28 md:pt-40 pb-28 flex flex-col gap-8">
        {/* Same position as when Back sat above it: its line (16px) + the gap (32px) added here. */}
        <header className="flex flex-col gap-4 mt-24 md:mt-32">
          <h1 className="font-heading text-5xl md:text-7xl tracking-tight uppercase">
            {project.title}
          </h1>
        </header>

        <ProjectHeroImage project={project} />

        <div className="flex flex-col gap-20 md:gap-28 pt-12 md:pt-20">
          <ProjectBlocks project={project} />
          <NextProject project={getNextProject(slug)} />
        </div>
      </main>
    </PageFade>
  );
}
