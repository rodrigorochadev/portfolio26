import type { Metadata, Viewport } from "next";
import { site } from "../site";

export const sharedOpenGraph = {
  siteName: site.name,
  locale: site.locale,
  type: "website",
  images: [site.ogImage],
} satisfies Metadata["openGraph"];

export const sharedTwitter = {
  card: "summary_large_image",
  site: site.twitterHandle,
  creator: site.twitterHandle,
  images: [site.ogImage],
} satisfies Metadata["twitter"];

// Applied to every route. Pages override title/description/canonical through
// `createPageMetadata`, since openGraph/twitter are shallowly merged by Next.
export const rootMetadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "technology",
  formatDetection: { email: false, address: false, telephone: false },
  openGraph: { ...sharedOpenGraph, title: site.title, description: site.description, url: "/" },
  twitter: { ...sharedTwitter, title: site.title, description: site.description },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  appleWebApp: { title: site.name },
};

export const rootViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: site.themeColor,
  colorScheme: "dark",
};
