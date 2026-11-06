import { Plus_Jakarta_Sans as MainFont } from "next/font/google";
import { PropsWithChildren } from "react";

import localFont from "next/font/local";
import { rootMetadata, rootViewport } from "./src/lib/seo/metadata/rootMetadata";
import { siteGraph } from "./src/lib/seo/ldjson/graph";
import JsonLd from "./src/lib/seo/ldjson/JsonLd";
import Layout from "./src/components/layout/Layout";

import "./globals.css";
import ReactLenis from "lenis/react";

const headingSans = localFont({
  variable: "--font-heading-sans",
  src: "./fonts/Kamino-VF.ttf",
});

const mainSans = MainFont({
  variable: "--font-main-sans",
  subsets: ["latin"],
});

export const viewport = rootViewport;

export const metadata = rootMetadata;

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      data-theme="dark"
      lang="en"
      className={`${mainSans.variable} ${headingSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ReactLenis root />
        <Layout>{children}</Layout>
        <JsonLd data={siteGraph} />
      </body>
    </html>
  );
}
