import type { Metadata } from "next";
import { site } from "../site";
import { sharedOpenGraph, sharedTwitter } from "./rootMetadata";

type PageMetadataOptions = {
  /** Page-specific title; run through the root `%s | Rodrigo Rocha` template unless `absoluteTitle` is set. */
  title: string;
  description?: string;
  /** Route path, e.g. "/work". Used for the canonical and og:url. */
  path: string;
  absoluteTitle?: boolean;
};

export function createPageMetadata({
  title,
  description = site.description,
  path,
  absoluteTitle = false,
}: PageMetadataOptions): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: { ...sharedOpenGraph, title: fullTitle, description, url: path },
    twitter: { ...sharedTwitter, title: fullTitle, description },
  };
}
