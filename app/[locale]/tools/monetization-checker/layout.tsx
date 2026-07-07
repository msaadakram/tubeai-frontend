import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "YouTube Monetization Checker \u2014 Is a Channel Monetized?",
  description: "Check any YouTube channel's monetization status, YPP eligibility, and estimated ad-revenue tier in seconds. Free YouTube monetization checker \u2014 paste a channel URL to start.",
  path: "/tools/monetization-checker",
  keywords: ["youtube channel", "youtube channel search", "find youtube channel", "youtube tags", "youtube hashtags"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
