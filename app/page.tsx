import Hero from "./src/components/hero/Hero";
import { Metadata } from "next";

import { homeMetadata } from "@/app/src/lib/seo/metadata/homepageMetadata";
import { homepageWebsiteLd } from "@/app/src/lib/seo/ldjson/webpage/homepage";

export const metadata: Metadata = homeMetadata;

export default function Home() {
  return (
    <>
      <main className="relative">
        <Hero />
      </main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageWebsiteLd) }}
      />
    </>
  );
}
