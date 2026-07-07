import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Watch the YouTube Tools Demo \u2014 AI Titles, Scripts & Thumbnails",
  description: "See YTForge's YouTube tools in action \u2014 AI title generation, script writing, thumbnail design, SEO audits, and channel analytics. Watch the full demo and start free in minutes.",
  path: "/demo",
  keywords: ["youtube tools", "youtube short", "youtube videos", "youtube tags", "thumbnail youtube", "youtube video description"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
