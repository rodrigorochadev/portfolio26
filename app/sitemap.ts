import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const defaultPages = [
    {
      url: "https://rodrigorocha.pt",
      lastModified: new Date(),
      changeFrequency: "yearly" as "yearly",
      priority: 1,
    },

    // other pages
  ];

  const sitemap = [...defaultPages];

  return sitemap;
}
