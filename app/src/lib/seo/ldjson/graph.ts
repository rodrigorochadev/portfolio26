import { absoluteUrl, site } from "../site";

// Stable node ids so pages can reference the same entities across the site.
export const ids = {
  person: absoluteUrl("/#person"),
  website: absoluteUrl("/#website"),
  page: (path: string) => `${absoluteUrl(path)}#webpage`,
};

export const personLd = {
  "@type": "Person",
  "@id": ids.person,
  name: site.name,
  givenName: site.givenName,
  familyName: site.familyName,
  url: site.url,
  description: site.description,
  jobTitle: site.jobTitle,
  worksFor: { "@type": "Organization", ...site.worksFor },
  alumniOf: { "@type": "CollegeOrUniversity", ...site.alumniOf },
  homeLocation: { "@type": "Country", name: "Portugal" },
  knowsAbout: site.knowsAbout,
  sameAs: site.sameAs,
};

export const websiteLd = {
  "@type": "WebSite",
  "@id": ids.website,
  name: site.name,
  url: site.url,
  description: site.description,
  inLanguage: site.language,
  publisher: { "@id": ids.person },
};

export const siteGraph = {
  "@context": "https://schema.org",
  "@graph": [personLd, websiteLd],
};
