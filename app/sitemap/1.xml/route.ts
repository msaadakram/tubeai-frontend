import { generateSitemapXml, xmlResponse } from "@/lib/sitemap-shared";

export const dynamic = "force-static";

export function GET() {
  return xmlResponse(generateSitemapXml(1));
}
