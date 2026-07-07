import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service \u2014 YouTube Creator Toolkit Rules",
  description: "YTForge terms of service: account responsibilities, acceptable use, AI-generated content rights, subscriptions, refunds, and liability for our YouTube creator toolkit.",
  path: "/terms",
  keywords: ["youtube tools", "terms of service", "creator toolkit"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
