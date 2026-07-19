import type { Metadata } from "next";
import { buildLocalizedMetadata } from "@/lib/seo";

type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({ locale, routeKey: "tools.tagGenerator", path: "/tools/tag-generator" });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
