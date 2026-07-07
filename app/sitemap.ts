import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { posts } from "@/lib/blog/posts";
import { SITE_URL, localizedPath } from "@/lib/seo";

const today = new Date().toISOString();

type Route = {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const staticRoutes: Route[] = [
  { path: "/", priority: 1.0, changeFrequency: "weekly" },
  { path: "/features", priority: 0.8, changeFrequency: "monthly" },
  { path: "/pricing", priority: 0.9, changeFrequency: "monthly" },
  { path: "/demo", priority: 0.7, changeFrequency: "monthly" },
  { path: "/chat", priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.9, changeFrequency: "weekly" },
  { path: "/ai-policy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly" },
];

const toolSlugs = [
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
  changeFrequency: "monthly" as const,
}));

const blogRoutes: Route[] = posts.map((p) => ({
  path: `/blog/${p.slug}`,
  priority: 0.7,
  changeFrequency: "monthly" as const,
}));

const allRoutes = [...staticRoutes, ...toolRoutes, ...blogRoutes];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  for (const route of allRoutes) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}${localizedPath(locale, route.path)}`,
        lastModified: today,
        changeFrequency: route.changeFrequency,
        priority: locale === defaultLocale ? route.priority : Math.max(route.priority - 0.1, 0.1),
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}${localizedPath(l, route.path)}`]),
          ),
        },
      });
    }
  }
  return entries;
}
