import data from "@/app/data/projects.json";
import { PROJECTS_PATH } from "@/app/src/lib/projects";
import { createPageMetadata } from "@/app/src/lib/seo/metadata/createPageMetadata";
import ProjectList from "@/app/src/components/projects/ProjectList";
import PageFade from "@/app/src/components/projects/transition/PageFade";
import PageTransitionLink from "@/app/src/components/projects/transition/PageTransitionLink";

export const metadata = createPageMetadata({
  title: data.allTitle,
  description: data.allDescription,
  path: PROJECTS_PATH,
});

export default function ProjectsPage() {
  return (
    <PageFade>
      <main className="container w-full pt-16 pb-16 flex flex-col gap-8">
        <PageTransitionLink
          href="/"
          restoreScroll
          className="text-xs font-bold uppercase text-hover w-fit"
        >
          ← Back
        </PageTransitionLink>

        <header className="flex flex-col gap-4">
          <h1 className="font-heading text-5xl md:text-7xl tracking-tight uppercase">
            {data.allTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs uppercase text-text-light">
            <span>{data.projects.length} projects</span>
            <span className="normal-case text-sm max-w-xl">{data.allDescription}</span>
          </div>
        </header>

        <ProjectList className="pt-8" />
      </main>
    </PageFade>
  );
}
