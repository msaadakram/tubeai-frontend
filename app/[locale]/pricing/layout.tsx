import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Free & Pro YouTube Tools Pricing \u2014 Start Growing Today",
  description: "Simple pricing for every YouTube creator. Start free with title generators, tag tools, and SEO analyzer; upgrade for AI scripts, thumbnails, and channel analytics. No credit card to start.",
  path: "/pricing",
  keywords: ["youtube tools", "youtube tag extractor", "youtube hashtags", "youtube keywords", "find youtube channel"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
