import { absoluteUrl, site } from "../site";
import { ids } from "./graph";

// ProfilePage is Google's dedicated type for pages about a single person.
export const homepageLd = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": ids.page("/"),
  url: site.url,
  name: site.title,
  description: site.description,
  inLanguage: site.language,
  isPartOf: { "@id": ids.website },
  mainEntity: { "@id": ids.person },
  about: { "@id": ids.person },
  primaryImageOfPage: {
    "@type": "ImageObject",
    url: absoluteUrl(site.ogImage.url),
    width: site.ogImage.width,
    height: site.ogImage.height,
  },
};
