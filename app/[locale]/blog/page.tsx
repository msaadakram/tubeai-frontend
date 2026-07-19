import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogHomeContent } from "./BlogHomeContent";
import { buildLocalizedMetadata, JsonLd, breadcrumbJsonLd, websiteJsonLd } from "@/lib/seo";

type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({ locale, routeKey: "blog", path: "/blog" });
}

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
