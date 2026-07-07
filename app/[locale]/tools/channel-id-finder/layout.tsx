import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "YouTube Channel ID Finder \u2014 Free ID, RSS & URL Lookup",
  description: "Find any YouTube channel ID, RSS feed, and canonical URL from a video link, @handle, or channel URL. Free channel ID finder \u2014 permanent UC identifier in seconds.",
  path: "/tools/channel-id-finder",
  keywords: ["find youtube channel", "youtube channel search", "search youtube by channel", "search for a channel on youtube", "youtube channel"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
