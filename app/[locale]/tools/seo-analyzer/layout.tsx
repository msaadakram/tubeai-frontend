import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "YouTube SEO Analyzer \u2014 Free Video & Channel SEO Audit",
  description: "Audit any YouTube video or channel for SEO in seconds \u2014 title, description, tags, chapters, and ranking opportunities. Free YouTube SEO analyzer and checker tool.",
  path: "/tools/seo-analyzer",
  keywords: ["seo tags for youtube videos", "youtube tags", "youtube keywords", "youtube keyword extractor", "ranking tags", "youtube meta"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
