import data from "@/app/data/projects.json";

export type Project = (typeof data.projects)[number];

export function getProjects(): Project[] {
  return data.projects;
}

export function getProjectBySlug(slug: string): Project | undefined {
  return data.projects.find((project) => project.slug === slug);
}

export function projectPath(slug: string) {
  return `/project/${slug}`;
}

// `sizes` decide which file next/image requests. The project hero layers the card's (already cached)
// file under its own, so these must stay identical to what each <Image> renders.
export const PROJECT_CARD_IMAGE_SIZES = "(min-width: 768px) 50vw, 100vw";
export const PROJECT_HERO_IMAGE_SIZES = "100vw";
