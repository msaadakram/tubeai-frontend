import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AiPolicyContent } from "./AiPolicyContent";

export const metadata: Metadata = {
  title: "AI Policy — YTForge",
  description:
    "How YTForge uses AI, which models power our tools, how your data is handled, and your rights around AI-generated output.",
  robots: { index: true, follow: true },
};

export default function AiPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />
      <AiPolicyContent />
      <Footer />
    </div>
  );
}
