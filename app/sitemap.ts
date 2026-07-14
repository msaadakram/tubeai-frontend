/**
 * app/sitemap.ts
 *
 * Next.js 14+ App Router sitemap using the Metadata Route API.
 *
 * Strategy: generateSitemaps() splits entries into three indexed chunks
 * (id: 0 = static, 1 = tools, 2 = blog) so the sitemap index stays fast
 * and each chunk remains well under Google's 50 000-URL limit.
 *
 * Excluded (must never be indexed):
 *   /dashboard, /settings, /signin, /signup, /forgot-password
 *
 * Ref: https://nextjs.org/docs/app/api-reference/file-conventions/sitemap
 */

import type { MetadataRoute } from "next";
import { locales, defaultLocale } from "@/lib/i18n/config";
import { posts } from "@/lib/blog/posts";
import { SITE_URL, localizedPath } from "@/lib/seo";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ChangeFreq = MetadataRoute.Sitemap[number]["changeFrequency"];

interface Route {
  path: string;
  priority: number;
  changeFrequency: ChangeFreq;
  /** Optional explicit lastModified (ISO string). Falls back to build time. */
  lastModified?: string;
}

// ---------------------------------------------------------------------------
// Chunk identifiers  (must match generateSitemaps)
// ---------------------------------------------------------------------------

const CHUNK_STATIC = 0;
const CHUNK_TOOLS  = 1;
const CHUNK_BLOG   = 2;

// ---------------------------------------------------------------------------
// Route definitions
// ---------------------------------------------------------------------------

const staticRoutes: Route[] = [
  { path: "/",           priority: 1.0, changeFrequency: "weekly"  },
  { path: "/features",   priority: 0.8, changeFrequency: "monthly" },
  { path: "/pricing",    priority: 0.9, changeFrequency: "monthly" },
  { path: "/demo",       priority: 0.7, changeFrequency: "monthly" },
  { path: "/chat",       priority: 0.7, changeFrequency: "monthly" },
  { path: "/blog",       priority: 0.8, changeFrequency: "weekly"  },
  { path: "/ai-policy",  priority: 0.3, changeFrequency: "yearly"  },
  { path: "/privacy",    priority: 0.3, changeFrequency: "yearly"  },
  { path: "/terms",      priority: 0.3, changeFrequency: "yearly"  },
  { path: "/disclaimer", priority: 0.3, changeFrequency: "yearly"  },
];

/**
 * All public tool slugs served under /tools/[slug].
 * Add new tools here — the sitemap updates automatically on next deploy.
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

const toolRoutes: Route[] = toolSlugs.map((slug) => ({
  path: `/tools/${slug}`,
  priority: 0.9,
  changeFrequency: "monthly" as const,
}));

const blogRoutes: Route[] = posts.map((post) => ({
  path: `/blog/${post.slug}`,
  priority: 0.7,
  changeFrequency: "monthly" as const,
  // Use the post's own publish/update date when available for accurate freshness
  lastModified:
    (post as { updatedAt?: string; publishedAt?: string }).updatedAt ??
    (post as { publishedAt?: string }).publishedAt ??
    undefined,
}));

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build hreflang alternate entries for every supported locale.
 * Google uses these to serve the right language variant in search results.
 */
function buildAlternates(
  path: string,
): MetadataRoute.Sitemap[number]["alternates"] {
  return {
    languages: Object.fromEntries(
      locales.map((locale) => [
        locale,
        `${SITE_URL}${localizedPath(locale, path)}`,
      ]),
    ),
  };
}

/**
 * Expand a single Route into one sitemap entry per locale.
 * Non-default locales receive a slight priority reduction so Google
 * understands which variant is canonical.
 */
function expandToLocaleEntries(route: Route): MetadataRoute.Sitemap {
  const lastMod = route.lastModified ?? new Date().toISOString();
  const alternates = buildAlternates(route.path);

  return locales.map((locale) => ({
    url: `${SITE_URL}${localizedPath(locale, route.path)}`,
    lastModified: lastMod,
    changeFrequency: route.changeFrequency,
    priority:
      locale === defaultLocale
        ? route.priority
        : parseFloat(Math.max(route.priority - 0.1, 0.1).toFixed(1)),
    alternates,
  }));
}

// ---------------------------------------------------------------------------
// Next.js Metadata Route exports
// ---------------------------------------------------------------------------

/**
 * Declare the three sitemap chunks.
 * Next.js generates:
 *   /sitemap/0.xml  — static pages
 *   /sitemap/1.xml  — tools
 *   /sitemap/2.xml  — blog posts
 * with a /sitemap.xml index linking all three.
 */
export function generateSitemaps() {
  return [
    { id: CHUNK_STATIC },
    { id: CHUNK_TOOLS  },
    { id: CHUNK_BLOG   },
  ];
}

/**
 * Called once per chunk id declared above.
 */
export default function sitemap({
  id,
}: {
  id: number;
}): MetadataRoute.Sitemap {
  switch (id) {
    case CHUNK_STATIC:
      return staticRoutes.flatMap(expandToLocaleEntries);

    case CHUNK_TOOLS:
      return toolRoutes.flatMap(expandToLocaleEntries);

    case CHUNK_BLOG:
      return blogRoutes.flatMap(expandToLocaleEntries);

    default:
      return [];
  }
}
