import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "YouTube Hashtag Generator \u2014 Free Trending Hashtags",
  description: "Generate relevant YouTube hashtags from any topic \u2014 tuned for reach without spam or repetition. Free YouTube hashtag generator with extractor and trending suggestions.",
  path: "/tools/hashtag-generator",
  keywords: ["youtube hashtags", "youtube hashtags extractor", "hashtags on youtube videos", "search youtube hashtags", "youtube short tags"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
