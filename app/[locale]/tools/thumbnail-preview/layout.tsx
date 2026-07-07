import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "YouTube Thumbnail Preview \u2014 Test Before You Publish",
  description: "Preview how your YouTube thumbnail renders on mobile, desktop, search results, and the Shorts shelf before you publish. Free thumbnail preview and checker tool.",
  path: "/tools/thumbnail-preview",
  keywords: ["thumbnail youtube", "youtube thumbnail", "youtube video thumbnail", "thumbnail test", "thumbnail checker"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
