import type { MetadataRoute } from "next";
import { absoluteUrl } from "./src/lib/seo/site";
import { getProjects, projectPath, PROJECTS_PATH } from "./src/lib/projects";

// Google ignores changefreq/priority; an accurate lastmod is what matters.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    { url: absoluteUrl("/"), lastModified },
    { url: absoluteUrl(PROJECTS_PATH), lastModified },
    ...getProjects().map(({ slug }) => ({ url: absoluteUrl(projectPath(slug)), lastModified })),
  ];
}
