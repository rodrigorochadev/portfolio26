import Hero from "./src/components/hero/Hero";
import ProjectList from "./src/components/projects/ProjectList";
import PageFade from "./src/components/projects/transition/PageFade";

import { homeMetadata } from "@/app/src/lib/seo/metadata/homepageMetadata";
import { homepageLd } from "@/app/src/lib/seo/ldjson/homepageLd";
import JsonLd from "@/app/src/lib/seo/ldjson/JsonLd";

export const metadata = homeMetadata;

export default function Home() {
  return (
    <>
      <PageFade>
        <main className="relative">
          <Hero />
          <ProjectList />
        </main>
      </PageFade>
      <JsonLd data={homepageLd} />
    </>
  );
}
