import { Metadata } from "next";

export const layoutMetadata: Metadata = {
  metadataBase: new URL("https://rodrigorocha.pt"),
  openGraph: {
    siteName: "Portfolio | Rodrigo Rocha",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "https://rodrigorocha.pt/og/OG_Light.png",
        width: 1200,
        height: 630,
        alt: "rodrigorocha",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: "index, follow",
  },

  applicationName: "Portfolio | Rodrigo Rocha",
  appleWebApp: {
    title: "Portfolio | Rodrigo Rocha",
    statusBarStyle: "default",
    capable: true,
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    shortcut: [
      {
        url: "/favicon.ico",
        type: "image/x-icon",
      },
    ],
    apple: [
      {
        url: "/apple-icon-57x57.png",
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: "/apple-icon-60x60.png",
        sizes: "60x60",
        type: "image/png",
      },
    ],
  },
};
