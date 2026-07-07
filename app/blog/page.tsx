import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BlogHomeContent } from "./BlogHomeContent";

export const metadata: Metadata = {
  title: "YTForge Blog — YouTube Growth, SEO & Monetization",
  description:
    "Viral case studies, YouTube algorithm updates, SEO playbooks, and country-wise CPM benchmarks. The exact tactics top creators use — written by the YTForge team.",
  keywords: [
    "YouTube blog",
    "YouTube SEO",
    "YouTube growth",
    "YouTube CPM",
    "YouTube algorithm",
    "creator tactics",
  ],
  openGraph: {
    title: "YTForge Blog — YouTube Growth, SEO & Monetization",
    description:
      "Viral case studies, algorithm updates, SEO playbooks, and monetization benchmarks for YouTube creators.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      <BlogHomeContent />
      <Footer />
    </div>
  );
}
