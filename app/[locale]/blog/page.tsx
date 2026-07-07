import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogHomeContent } from "./BlogHomeContent";
import { buildMetadata, JsonLd, breadcrumbJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "YTForge Blog — YouTube Growth, SEO & Monetization Guides",
  description:
    "The YouTube blog for creators: viral case studies, algorithm updates, SEO playbooks, and country-wise CPM benchmarks. The exact tactics top creators use, written by the YTForge team.",
  path: "/blog",
  keywords: [
    "youtube blog",
    "youtube content",
    "youtube meta",
    "youtube tools",
    "youtube seo",
    "youtube growth",
    "youtube cpm",
    "youtube algorithm",
    "creator tactics",
  ],
});

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      <BlogHomeContent />
      <Footer />
      <JsonLd
        data={[
          websiteJsonLd(),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Blog", path: "/blog" },
          ]),
        ]}
      />
    </div>
  );
}
