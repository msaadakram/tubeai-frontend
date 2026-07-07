import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "YouTube Tools & AI Features Every Creator Needs in 2026",
  description: "Explore 30+ free YouTube tools and AI features \u2014 title generators, script writers, thumbnail makers, SEO analyzer, channel analytics, and monetization tools built for 2026 creators.",
  path: "/features",
  keywords: ["youtube tools", "youtube channel search", "youtube keyword extractor", "youtube meta", "video title", "youtube video description"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
