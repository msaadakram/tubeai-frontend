import type { Metadata } from "next";
import { buildLocalizedMetadata } from "@/lib/seo";

type P = { params: Promise<{ locale: string }> };
export async function generateMetadata({ params }: P): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({ locale, routeKey: "tools.hashtagGenerator", path: "/tools/hashtag-generator" });
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
