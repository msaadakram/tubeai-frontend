import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AI Script Writer \u2014 Free YouTube Video Scripts in Seconds",
  description: "Write retention-optimized YouTube scripts with AI \u2014 hook, promise, pattern interrupts, and a single CTA. Free AI script writer for any tone, length, and language.",
  path: "/tools/ai-script-writer",
  keywords: ["youtube video description", "description youtube", "video description for youtube", "yt video description", "description of youtube video"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
