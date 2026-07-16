import { locales, defaultLocale } from "@/lib/i18n/config";
import { posts } from "@/lib/blog/posts";
import { SITE_URL, localizedPath } from "@/lib/seo";

type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

interface Route {
  path: string;
  priority: number;
  changeFrequency: ChangeFreq;
  lastModified?: string;
}

const STATIC_PAGE_DATE = "2026-01-01";

const staticRoutes: Route[] = [
  { path: "/",           priority: 1.0, changeFrequency: "weekly",  lastModified: STATIC_PAGE_DATE },
  { path: "/pricing",    priority: 0.9, changeFrequency: "monthly", lastModified: STATIC_PAGE_DATE },
  { path: "/features",   priority: 0.8, changeFrequency: "monthly", lastModified: STATIC_PAGE_DATE },
  { path: "/blog",       priority: 0.8, changeFrequency: "weekly",  lastModified: STATIC_PAGE_DATE },
  { path: "/demo",       priority: 0.7, changeFrequency: "monthly", lastModified: STATIC_PAGE_DATE },
  { path: "/chat",       priority: 0.7, changeFrequency: "monthly", lastModified: STATIC_PAGE_DATE },
  { path: "/ai-policy",  priority: 0.3, changeFrequency: "yearly",  lastModified: STATIC_PAGE_DATE },
  { path: "/privacy",    priority: 0.3, changeFrequency: "yearly",  lastModified: STATIC_PAGE_DATE },
  { path: "/terms",      priority: 0.3, changeFrequency: "yearly",  lastModified: STATIC_PAGE_DATE },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly",  lastModified: STATIC_PAGE_DATE },
];

const toolSlugs: string[] = [
  "viral-title-generator",
  "ai-script-writer",
  "thumbnail-downloader",
  "thumbnail-preview",
  "embed-generator",
  "qr-code-generator",
  "seo-analyzer",
  "channel-analytics",
  "channel-id-finder",
  "monetization-checker",
  "ai-transcript",
  "shorts-ideas",
  "earnings-calculator",
  "ai-thumbnail-generator",
  "hashtag-generator",
  "tag-generator",
];

const toolRoutes: Route[] = toolSlugs.map((slug) => ({
  path: `/tools/${slug}`,
  priority: 0.9,
  changeFrequency: "monthly" as ChangeFreq,
  lastModified: STATIC_PAGE_DATE,
}));

function toIsoDate(dateStr: string): string {
  if (!dateStr) return STATIC_PAGE_DATE;
  try {
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime()) ? STATIC_PAGE_DATE : d.toISOString().split("T")[0];
  } catch {
    return STATIC_PAGE_DATE;
  }
}

const blogRoutes: Route[] = posts.map((post) => ({
  path: `/blog/${post.slug}`,
  priority: 0.7,
  changeFrequency: "monthly" as ChangeFreq,
  lastModified: toIsoDate(post.date),
}));

function buildAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((locale) => [locale, `${SITE_URL}${localizedPath(locale, path)}`]),
  );
  languages["x-default"] = `${SITE_URL}${localizedPath(defaultLocale, path)}`;
  return languages;
}

function expandToLocaleEntries(route: Route) {
  return locales.map((locale) => ({
    url: `${SITE_URL}${localizedPath(locale, route.path)}`,
    lastModified: route.lastModified ?? STATIC_PAGE_DATE,
    changeFrequency: route.changeFrequency,
    priority:
      locale === defaultLocale
        ? route.priority
        : parseFloat(Math.max(route.priority - 0.1, 0.1).toFixed(1)),
    alternates: { languages: buildAlternates(route.path) },
  }));
}

function toXmlUrl(entry: {
  url: string;
  lastModified: string;
  changeFrequency: string;
  priority: number;
  alternates: { languages: Record<string, string> };
}): string {
  const alts = Object.entries(entry.alternates.languages)
    .map(([hreflang, href]) => `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`)
    .join("\n");

  return `  <url>
    <loc>${entry.url}</loc>
    <lastmod>${entry.lastModified}</lastmod>
    <changefreq>${entry.changeFrequency}</changefreq>
    <priority>${entry.priority}</priority>
${alts}
  </url>`;
}

const chunks: Record<number, Route[]> = {
  0: staticRoutes,
  1: toolRoutes,
  2: blogRoutes,
};

export function generateSitemapXml(id: number): string {
  const routes = chunks[id];
  if (!routes) return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
</urlset>`;

  const entries = routes.flatMap(expandToLocaleEntries);
  const urls = entries.map(toXmlUrl).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>`;
}

export function generateSitemapIndex(): string {
  const lastmod = new Date().toISOString().split("T")[0];
  const chunks = [0, 1, 2];

  return `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/sitemap.xsl"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${chunks.map((id) => `  <sitemap>
    <loc>${SITE_URL}/sitemap/${id}.xml</loc>
    <lastmod>${lastmod}</lastmod>
  </sitemap>`).join("\n")}
</sitemapindex>`;
}

export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
