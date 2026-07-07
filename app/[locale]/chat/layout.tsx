import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AI YouTube Growth Coach \u2014 Free Creator Strategy Chat",
  description: "Chat with an AI YouTube growth coach for free. Get tailored advice on titles, thumbnails, SEO, retention, and monetization \u2014 answers tuned to the 2026 YouTube algorithm in seconds.",
  path: "/chat",
  keywords: ["youtube tools", "youtube search", "youtube content", "youtube keywords", "youtube meta", "video search for youtube"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
