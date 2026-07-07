import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Disclaimer \u2014 AI YouTube Tools & No-Guarantee Policy",
  description: "YTForge disclaimer: AI-generated output accuracy, no guaranteed YouTube results, earnings estimates, analytics accuracy, third-party content, and YouTube compliance notes.",
  path: "/disclaimer",
  keywords: ["youtube tools", "disclaimer", "ai tools", "youtube content"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
