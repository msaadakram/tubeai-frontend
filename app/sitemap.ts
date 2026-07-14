/**
 * app/sitemap.ts  —  YTForge Production Sitemap
 * ─────────────────────────────────────────────────────────────────────────────
 * Strategy: generateSitemaps() splits entries into THREE indexed chunks so
 * Next.js emits a sitemap INDEX at /sitemap.xml plus three sub-sitemaps:
 *
 *   /sitemap/0.xml  →  static pages   (home, features, pricing, blog index …)
 *   /sitemap/1.xml  →  tool pages     (/tools/[slug])
 *   /sitemap/2.xml  →  blog posts     (/blog/[slug])
 *
 * This design stays well under Google's hard limits (50 000 URLs / 50 MB per
 * sitemap file) and lets Google crawl each content type on its own schedule.
 *
 * SEO rules applied
 * ─────────────────
 * • priority   — 1.0 home › 0.9 tools/pricing › 0.8 features/blog-index
 *                › 0.7 demo/chat/posts › 0.3 legal. Non-default locales get
 *                priority − 0.1 (min 0.1) to signal canonical variant.
 * • changeFreq — matches real update cadence: weekly (home, blog index),
 *                monthly (tools, features, pricing), yearly (legal).
 * • lastModified — blog posts use their own date; static pages use a shared
 *                STATIC_PAGE_DATE constant so every deploy doesn't flip the
 *                date and confuse crawlers.
 * • hreflang   — every URL gets full alternates (all 9 locales + x-default)
 *                so Google serves the right language variant in SERPs.
 *
 * Excluded (noindex / not listed anywhere)
 * ─────────────────────────────────────────
 *   /dashboard  /settings  /signin  /signup  /forgot-password
 *
 * To add a new tool:  append its slug to toolSlugs[] below.
 * To add a new static page: append to staticRoutes[] below.
 * Both update automatically on the next Vercel deploy.
 *
 * Ref: https://nextjs.org/docs/app/api-reference/file-conventions/sitemap
 * Ref: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
 */

import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { posts } from "@/lib/blog/posts";
import { SITE_URL, localizedPath } from "@/lib/seo";

// ─── Types ────────────────────────────────────────────────────────────────────

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

/** Internal route definition before locale expansion. */
interface Route {
  /** Path without locale prefix and without trailing slash, e.g. "/tools/seo-analyzer". */
  path: string;
  /** SEO priority for the default-locale variant (0.0 – 1.0). */
  priority: number;
  /** How often the page is expected to change. */
  changeFrequency: ChangeFreq;
  /**
   * Explicit ISO-8601 lastModified date.
   * Omit for pages whose freshness tracks the static build date.
   */
  lastModified?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Sitemap chunk IDs — must be kept in sync with generateSitemaps().
 * Using named constants instead of magic numbers prevents off-by-one bugs.
 */
const CHUNK = {
  STATIC: 0,
  TOOLS:  1,
  BLOG:   2,
} as const;

/**
 * A fixed date for all static pages.
 * Using the build-time `new Date()` would flip lastModified on every Vercel
 * deploy even if the page content never changed, which confuses crawlers.
 * Update this string manually when you make a meaningful content change.
 */
const STATIC_PAGE_DATE = "2025-01-01";

// ─── Route Definitions ────────────────────────────────────────────────────────

/**
 * Static, hand-authored pages.
 * Priority scale used here:
 *   1.0  Home (most important page on the site)
 *   0.9  High-conversion pages (Pricing)
 *   0.8  Feature/discovery pages (Features, Blog index)
 *   0.7  Supporting pages (Demo, Chat)
 *   0.3  Legal / compliance (Privacy, Terms, Disclaimer, AI Policy)
 */
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

/**
 * All public tool slugs.
 * Each slug maps to the URL /tools/[slug].
 * Append new slugs here — the sitemap updates automatically on next deploy.
 */
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

/**
 * Tool routes — all share the same priority / changeFrequency.
 * Tools are high-value landing pages, so they sit at 0.9.
 */
const toolRoutes: Route[] = toolSlugs.map((slug) => ({
  path: `/tools/${slug}`,
  priority: 0.9,
  changeFrequency: "monthly" as ChangeFreq,
  lastModified: STATIC_PAGE_DATE,
}));

/**
 * Blog post routes — built from the posts array in lib/blog/posts.
 * Uses each post's own updatedAt or publishedAt date for accurate freshness
 * signals. Falls back to STATIC_PAGE_DATE if neither field exists.
 */
const blogRoutes: Route[] = posts.map((post) => ({
  path: `/blog/${post.slug}`,
  priority: 0.7,
  changeFrequency: "monthly" as ChangeFreq,
  lastModified:
    (post as { updatedAt?: string }).updatedAt ??
    (post as { publishedAt?: string }).publishedAt ??
    STATIC_PAGE_DATE,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Builds the `alternates.languages` object required for hreflang.
 *
 * For a given path, emits one entry per supported locale PLUS an
 * "x-default" entry pointing at the default-locale URL.
 *
 * Google uses these to serve the right language variant in search results
 * and to avoid treating locale variants as duplicate content.
 *
 * Example output for path = "/tools/seo-analyzer":
 *   { en: "https://ytforge.app/tools/seo-analyzer",
 *     es: "https://ytforge.app/es/tools/seo-analyzer",
 *     …
 *     "x-default": "https://ytforge.app/tools/seo-analyzer" }
 */
function buildAlternates(
  path: string,
): MetadataRoute.Sitemap[number]["alternates"] {
  const languages: Record<string, string> = Object.fromEntries(
    locales.map((locale) => [
      locale,
      `${SITE_URL}${localizedPath(locale, path)}`,
    ]),
  );
  // x-default should point at the default-locale canonical URL
  languages["x-default"] = `${SITE_URL}${localizedPath(defaultLocale, path)}`;
  return { languages };
}

/**
 * Expands a single Route into one sitemap entry per supported locale.
 *
 * Non-default locales receive priority − 0.1 (clamped to 0.1 minimum).
 * This is a widely used signal to help Googlebot understand which locale
 * is the primary canonical variant without fully deprioritising others.
 */
function expandToLocaleEntries(route: Route): MetadataRoute.Sitemap {
  const alternates = buildAlternates(route.path);

  return locales.map((locale) => ({
    url: `${SITE_URL}${localizedPath(locale, route.path)}`,
    lastModified: route.lastModified ?? STATIC_PAGE_DATE,
    changeFrequency: route.changeFrequency,
    priority:
      locale === defaultLocale
        ? route.priority
        : parseFloat(Math.max(route.priority - 0.1, 0.1).toFixed(1)),
    alternates,
  }));
}

// ─── Next.js Metadata Route Exports ──────────────────────────────────────────

/**
 * Declares the three sitemap chunks to Next.js.
 *
 * Next.js uses this to generate a sitemap INDEX at /sitemap.xml that
 * references each chunk:
 *   <sitemapindex>
 *     <sitemap><loc>…/sitemap/0.xml</loc></sitemap>
 *     <sitemap><loc>…/sitemap/1.xml</loc></sitemap>
 *     <sitemap><loc>…/sitemap/2.xml</loc></sitemap>
 *   </sitemapindex>
 */
export function generateSitemaps() {
  return [
    { id: CHUNK.STATIC },
    { id: CHUNK.TOOLS  },
    { id: CHUNK.BLOG   },
  ];
}

/**
 * Returns the sitemap entries for a given chunk id.
 *
 * Called by Next.js once per id declared in generateSitemaps().
 * The return value is serialised to a valid XML sitemap at build time
 * (or at runtime for ISR / on-demand revalidation).
 *
 * Total URL count estimate (9 locales × routes):
 *   Chunk 0 (static) : 9 × 10 =  90 URLs
 *   Chunk 1 (tools)  : 9 × 16 = 144 URLs
 *   Chunk 2 (blog)   : 9 × N  = scales with post count
 *   All well under Google's 50 000 URL per file limit.
 */
export default function sitemap({ id }: { id: number }): MetadataRoute.Sitemap {
  switch (id) {
    case CHUNK.STATIC:
      return staticRoutes.flatMap(expandToLocaleEntries);

    case CHUNK.TOOLS:
      return toolRoutes.flatMap(expandToLocaleEntries);

    case CHUNK.BLOG:
      return blogRoutes.flatMap(expandToLocaleEntries);

    default:
      // Defensive: unknown chunk id → return empty (should never happen)
      return [];
  }
}
