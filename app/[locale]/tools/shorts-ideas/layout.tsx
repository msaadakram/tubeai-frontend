import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "YouTube Shorts Ideas \u2014 Free AI Viral Short Concepts",
  description: "Generate viral YouTube Shorts ideas \u2014 hooks, formats, and looped endings tuned for the Shorts algorithm in 2026. Free Shorts ideas generator for any topic or niche.",
  path: "/tools/shorts-ideas",
  keywords: ["youtube short", "youtube short tags", "shorts tag extractor", "shorts video tags", "tags for youtube short"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
