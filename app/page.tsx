import Hero from "./src/components/hero/Hero";

import { homeMetadata } from "@/app/src/lib/seo/metadata/homepageMetadata";
import { homepageLd } from "@/app/src/lib/seo/ldjson/homepageLd";
import JsonLd from "@/app/src/lib/seo/ldjson/JsonLd";

export const metadata = homeMetadata;

export default function Home() {
  return (
    <>
      <main className="relative">
        <Hero />
      </main>
      <JsonLd data={homepageLd} />
    </>
  );
}
