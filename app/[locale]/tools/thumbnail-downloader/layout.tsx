import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "YouTube Thumbnail Downloader \u2014 Free HD Image Grabber",
  description: "Download any YouTube video thumbnail in HD, full, or standard resolution \u2014 free, no signup, unlimited. Paste a video link and grab the thumbnail image instantly.",
  path: "/tools/thumbnail-downloader",
  keywords: ["thumbnail youtube", "youtube thumbnail", "youtube video thumbnail", "download youtube thumbnail", "yt thumbnail"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
