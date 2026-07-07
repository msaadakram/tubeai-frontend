import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "YouTube Tag Generator \u2014 Free SEO Tags for Every Video",
  description: "Generate SEO-optimized YouTube tags from any topic \u2014 exact, broad, and long-tail, within the 500-character limit. Free YouTube tag generator and extractor, no signup.",
  path: "/tools/tag-generator",
  keywords: ["youtube tags", "youtube tag extractor", "tag finder", "youtube tag finder", "tags for youtube videos", "yt tags"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
