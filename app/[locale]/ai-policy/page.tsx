import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AiPolicyContent } from "./AiPolicyContent";
import { buildMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "AI Policy — How YTForge Uses AI & Your Data",
  description:
    "YTForge's AI policy: which models power our tools, how we handle your prompts and content, your rights over AI-generated output, and our safety commitments.",
  path: "/ai-policy",
  keywords: [
    "youtube tools",
    "ai policy",
    "ai transcript",
    "ai script writer",
    "ai thumbnail generator",
    "youtube content",
  ],
});

export default function AiPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      <AiPolicyContent />
      <Footer />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "AI Policy", path: "/ai-policy" },
        ])}
      />
    </div>
  );
}
