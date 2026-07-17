import type { Metadata } from "next";
import "./globals.css";
import { JsonLd, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "YTForge — Free YouTube Tools & AI Creator Toolkit",
  description:
    "YTForge is an AI-powered YouTube creator toolkit — title generators, AI script writer, thumbnail tools, SEO analyzer, channel analytics, monetization checker, and earnings calculator in one place.",
  metadataBase: new URL("https://ytforge.app"),
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/faci.png", sizes: "514x538", type: "image/png" },
    ],
    shortcut: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </head>
      <body>{children}</body>
    </html>
  );
}
