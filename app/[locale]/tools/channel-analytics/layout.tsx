import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "YouTube Channel Analytics \u2014 Free Stats for Any Channel",
  description: "Pull live YouTube channel analytics \u2014 subscribers, views, watch time, top videos, and growth velocity \u2014 from any channel URL. Free channel analytics tool, no signup.",
  path: "/tools/channel-analytics",
  keywords: ["youtube channel search", "find youtube channel", "search youtube by channel", "search for a channel on youtube", "youtube channel"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
