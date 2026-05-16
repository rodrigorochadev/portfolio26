import defaults from "../defaults/defaults.json";

export const personLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: defaults.name,
  url: defaults.url,
  sameAs: [
    "https://www.linkedin.com/in/rodrigorocha101",
    "https://github.com/rodrigo-rocha",
    "https://twitter.com/rochananet",
  ],
  jobTitle: {
    "@type": "DefinedTerm",
    name: "Software Engineer II",
    description:
      "Software Engineer responsible developing web apps, from a given design to function, according to a client's specifications. Strive to create clean code following good practices.",
    // url: "https://www.rodrigorocha.pt/job/details",
    alternateName: "Software Engineer II",
  },
  worksFor: {
    "@type": "Organization",
    name: "Five9",
    url: "https://five9.com/",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Universidade de Aveiro",
    url: "https://www.ua.pt/",
  },
  description: defaults.description,
  image: defaults.metadata.pictures.profile,
  knowsAbout: defaults.technologies,
  hasOccupation: {
    "@type": "Occupation",
    name: "Software Engineer",
  },
};
