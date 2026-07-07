import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AI YouTube Transcript \u2014 Free Video Transcripts & Translation",
  description: "Extract, translate, and search YouTube video transcripts into 100+ languages with AI accuracy. Free AI transcript tool \u2014 paste a link and get the full transcript instantly.",
  path: "/tools/ai-transcript",
  keywords: ["youtube video description", "description of youtube video", "video description for youtube", "youtube meta", "youtube content", "yt video description"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
