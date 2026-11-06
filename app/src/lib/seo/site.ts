import socials from "@/app/data/socials.json";

/**
 * Single source of truth for everything search engines and social
 * platforms read. Canonical origin is the apex domain — www 301s to it.
 */
export const site = {
  url: "https://rodrigorocha.pt",
  name: "Rodrigo Rocha",
  givenName: "Rodrigo",
  familyName: "Rocha",
  jobTitle: "Software Engineer",
  locale: "en_US",
  language: "en",
  country: "PT",
  title: "Rodrigo Rocha — Software Engineer",
  description:
    "Rodrigo Rocha is a software engineer based in Portugal, passionate about motion and design, crafting high-performance, stunning web experiences.",
  themeColor: "#000000",
  ogImage: {
    url: "/og/OG_Light.png",
    width: 1200,
    height: 630,
    alt: "Rodrigo Rocha — Software Engineer",
  },
  twitterHandle: "@rochananet",
  worksFor: { name: "Five9", url: "https://www.five9.com" },
  alumniOf: { name: "Universidade de Aveiro", url: "https://www.ua.pt" },
  knowsAbout: [
    "HTML",
    "CSS",
    "SCSS",
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Gatsby",
    "Node.js",
    "GSAP",
    "Framer Motion",
    "Three.js",
    "React Three Fiber",
    "WebGL",
    "GLSL",
    "Shopify Liquid",
    "Shopify Apps",
    "Search Engine Optimization",
  ],
  sameAs: socials.map((social) => social.href),
} as const;

export const absoluteUrl = (path = "/") => new URL(path, site.url).toString();
