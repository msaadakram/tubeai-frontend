import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YTForge — Free YouTube Tools & AI Creator Toolkit",
  description:
    "16+ AI-powered YouTube tools for creators. Free tag generator, title generator, thumbnail downloader, SEO analyzer, and more.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <head>
        <link rel="icon" type="image/png" href="/icon" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon" />
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body>{children}</body>
    </html>
  );
}
