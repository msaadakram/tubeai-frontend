import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AI YouTube Thumbnail Generator \u2014 Free High-CTR Designs",
  description: "Generate click-magnet YouTube thumbnails with AI \u2014 4 high-CTR variants per prompt, HD PNG export at 1280x720. AI thumbnail generator with style transfer and layered exports.",
  path: "/tools/ai-thumbnail-generator",
  keywords: ["thumbnail youtube", "youtube thumbnail", "youtube video thumbnail", "thumbnail maker", "thumbnail creator", "ai thumbnail"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
