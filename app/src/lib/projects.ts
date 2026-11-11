import data from "@/app/data/projects.json";

type BlockImage = { src: string; alt: string };

/** Building blocks of a project page; each project composes its own sequence of them. */
export type ProjectBlock =
  | { type: "overview"; lead: string; facts: { label: string; value: string }[] }
  | { type: "text"; label?: string; heading: string; body: string[] }
  | (BlockImage & { type: "image"; caption?: string; aspect?: "wide" })
  | { type: "gallery"; images: BlockImage[]; caption?: string }
  | { type: "stats"; label?: string; items: { value: string; label: string }[] }
  | { type: "list"; label?: string; heading: string; items: { title: string; body: string }[] }
  | { type: "code"; label?: string; filename: string; language: string; code: string; caption?: string }
  | { type: "palette"; colors: { name: string; hex: string }[]; image?: BlockImage; caption?: string }
  | { type: "quote"; quote: string; author: string; role: string };

export type Project = Omit<(typeof data.projects)[number], "blocks" | "url"> & {
  blocks: ProjectBlock[];
  /** The live site, linked from the project page; omit it for work that isn't public. */
  url?: string;
};

// JSON imports widen `type` to string, so the block union can't be inferred; this is the one cast.
const projects = data.projects as Project[];

export function getProjects(): Project[] {
  return projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug);
}

/** The projects shown on the homepage; the rest are on /projects. */
export function getFeaturedProjects(): Project[] {
  return projects.slice(0, data.featuredCount);
}

/** The project after this one, wrapping around, for the "next project" link. */
export function getNextProject(slug: string): Project {
  const index = projects.findIndex((project) => project.slug === slug);
  return projects[(index + 1) % projects.length];
}

export function projectPath(slug: string) {
  return `/project/${slug}`;
}

export const PROJECTS_PATH = "/projects";

// `sizes` decide which file next/image requests. The project hero layers the card's (already cached)
// file under its own, so these must stay identical to what each <Image> renders.
export const PROJECT_CARD_IMAGE_SIZES = "(min-width: 768px) 50vw, 100vw";
export const PROJECT_HERO_IMAGE_SIZES = "100vw";
