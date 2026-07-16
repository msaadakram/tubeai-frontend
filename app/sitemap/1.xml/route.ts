import { generateSitemapXml, xmlResponse } from "@/lib/sitemap-shared";

export function GET() {
  return xmlResponse(generateSitemapXml(1));
}
