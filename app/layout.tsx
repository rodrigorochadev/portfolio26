import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans as MainFont } from "next/font/google";
import { PropsWithChildren } from "react";

import localFont from "next/font/local";
import { homeMetadata } from "./src/lib/seo/metadata/homepageMetadata";
import { personLd } from "./src/lib/seo/ldjson/personLd";
import { websiteLd } from "./src/lib/seo/ldjson/website";
import Layout from "./src/components/layout/Layout";

import "./globals.css";

const headingSans = localFont({
  variable: "--font-heading-sans",
  src: "./fonts/Kamino-VF.ttf",
});

const mainSans = MainFont({
  variable: "--font-main-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = homeMetadata;

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html
      data-theme="dark"
      lang="en"
      className={`${mainSans.variable} ${headingSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Layout>{children}</Layout>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteLd) }}
        />
      </body>
    </html>
  );
}
