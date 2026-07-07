import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "YouTube Earnings Calculator \u2014 Free AdSense Revenue Estimate",
  description: "Estimate YouTube AdSense earnings from your views, country mix, niche, and RPM. Free YouTube earnings and CPM calculator \u2014 instant monthly and yearly revenue projections.",
  path: "/tools/earnings-calculator",
  keywords: ["youtube channel", "youtube tags", "youtube hashtags", "youtube keywords", "youtube channel search", "find youtube channel"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
