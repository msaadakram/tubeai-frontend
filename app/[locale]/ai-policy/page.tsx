import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AiPolicyContent } from "./AiPolicyContent";
import { buildLocalizedMetadata, JsonLd, breadcrumbJsonLd } from "@/lib/seo";

type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({ locale, routeKey: "aiPolicy", path: "/ai-policy" });
}

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
