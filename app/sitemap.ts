import type { MetadataRoute } from "next";
import { absoluteUrl } from "./src/lib/seo/site";

// Google ignores changefreq/priority; an accurate lastmod is what matters.
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: absoluteUrl("/"), lastModified: new Date() }];
}
