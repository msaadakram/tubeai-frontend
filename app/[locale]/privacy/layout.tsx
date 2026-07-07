import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy \u2014 How We Protect Your Creator Data",
  description: "YTForge privacy policy: what data we collect, how we use it, encryption in transit and at rest, AI training commitments, your rights, and how to contact our DPO.",
  path: "/privacy",
  keywords: ["youtube tools", "privacy policy", "creator data", "ai policy"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
