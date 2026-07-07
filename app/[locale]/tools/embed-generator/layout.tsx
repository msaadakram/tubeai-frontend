import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "YouTube Embed Generator \u2014 Free Responsive Embed Codes",
  description: "Generate responsive, privacy-enhanced YouTube embed codes with custom dimensions, start times, and captions. Free embed code generator for websites and blogs.",
  path: "/tools/embed-generator",
  keywords: ["youtube videos", "video youtube video", "embed youtube video", "youtube embed code", "embed video"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
