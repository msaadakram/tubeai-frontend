import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Viral YouTube Title Generator \u2014 Free AI Title Ideas",
  description: "Generate viral, SEO-optimized YouTube titles in seconds. Free AI title generator with built-in CTR scoring and keyword front-loading \u2014 get click-worthy titles for any niche.",
  path: "/tools/viral-title-generator",
  keywords: ["video title", "youtube video title", "youtube video title extractor", "catchy video titles", "best youtube titles"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
