import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "YTForge — Free YouTube Tools & AI Creator Toolkit",
  description:
    "16+ AI-powered YouTube tools for creators. Free tag generator, title generator, thumbnail downloader, SEO analyzer, and more.",
  icons: {
    icon: "/faci.png",
    apple: "/faci.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>{children}</body>
    </html>
  );
}
