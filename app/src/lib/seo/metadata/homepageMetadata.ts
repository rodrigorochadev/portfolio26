import { Metadata } from "next";
import defaults from "../defaults/defaults.json";

export const homeMetadata: Metadata = {
  title: `Homepage ${defaults.sitePrefix}`,
  description: defaults.description,
  keywords: ["react-three-fiber", "threejs", "javascript", "typescript", "react", "frontend", "web design"],
  openGraph: {
    url: defaults.url,
    type: "website",
    title: `Portfolio @ 2024 ${defaults.sitePrefix}`,
    description: defaults.description,
    images: [
      {
        url: defaults.metadata.pictures.og,
        width: 1200,
        height: 630,
        alt: "rodrigorocha",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `Portfolio @ 2024 ${defaults.sitePrefix}`,
    description: defaults.description,
    creator: defaults.socialMedia.twitter.handle,
    site: defaults.socialMedia.twitter.handle,
    images: [
      {
        url: defaults.metadata.pictures.og,
        width: 1200,
        height: 630,
        alt: "rodrigorocha",
      },
    ],
  },
  alternates: {
    canonical: defaults.url,
  },
};
