import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";

/** One localized route's metadata: title + description + keyword list. */
type MetaRoute = { title: string; description: string; keywords: string[] };

export const SITE_NAME = "YTForge";
export const SITE_ALTERNATE_NAME = "YTForge — YouTube Tools";
export const SITE_URL = "https://ytforge.app";
export const SITE_TAGLINE = "AI-Powered YouTube Creator Toolkit";
export const SITE_DESCRIPTION =
  "YTForge is an AI-powered YouTube creator toolkit — title generators, AI script writer, thumbnail tools, SEO analyzer, channel analytics, monetization checker, and earnings calculator in one place.";

export const ORG_LOGO = "/logo.png";
export const ORG_LOGO_WIDTH = 512;
export const ORG_LOGO_HEIGHT = 512;

export type PageType = "website" | "article" | "product" | "app";

export type BuildMetadataInput = {
  title: string;
  description: string;
  /** Path without locale prefix, e.g. "/tools/tag-generator". Use "/" for home. */
  path: string;
  keywords?: string[];
  type?: PageType;
  locale?: Locale;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  image?: string;
  noindex?: boolean;
};

export function localizedPath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  if (locale === defaultLocale) {
    return clean === "/" ? "/" : clean;
  }
  return `/${locale}${clean === "/" ? "" : clean}`;
}

export function buildMetadata({
  title,
  description,
  path,
  keywords,
  type = "website",
  locale = defaultLocale,
  publishedTime,
  modifiedTime,
  authors,
  image,
  noindex = false,
}: BuildMetadataInput): Metadata {
  const canonicalPath = localizedPath(locale, path);
  const canonicalURL = `${SITE_URL}${canonicalPath}`;
  const ogImage = image || "/og-default.png";
  const ogImageURL = ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`;

  // hreflang alternates — every locale gets a canonical entry; default locale
  // also gets the bare /en variant.
  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${SITE_URL}${localizedPath(l, path)}`;
  }
  languages["x-default"] = `${SITE_URL}${localizedPath(defaultLocale, path)}`;

  return {
    title,
    description,
    keywords,
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical: canonicalURL,
      languages,
    },
    openGraph: {
      title,
      description,
      url: canonicalURL,
      siteName: SITE_NAME,
      images: [{ url: ogImageURL, width: 1200, height: 630, alt: title }],
      locale: locale === "en" ? "en_US" : locale,
      type: type === "article" || type === "product" ? "article" : "website",
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
      ...(authors ? { authors } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageURL],
    },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  };
}

/**
 * Resolve a single route's localized metadata (title / description / keywords)
 * from the messages catalog by dotted route key, e.g. "tools.seoAnalyzer" or
 * "features" or "blogPosts.guide-to-yt-seo-grow". Falls back to English if a
 * locale is missing the entry (defensive — schema guarantees presence).
 */
function resolveMetaRoute(locale: Locale, routeKey: string): MetaRoute {
  const messages = getMessages(locale);
  const meta = messages.meta as unknown as Record<string, unknown>;
  const parts = routeKey.split(".");
  let node: unknown = meta;
  for (const p of parts) {
    if (node && typeof node === "object" && p in (node as Record<string, unknown>)) {
      node = (node as Record<string, unknown>)[p];
    } else {
      node = undefined;
      break;
    }
  }
  const found = node as MetaRoute | undefined;
  if (found && found.title && found.description) return found;
  // Fallback to English.
  const enMeta = getMessages(defaultLocale).meta as unknown as Record<string, unknown>;
  let enNode: unknown = enMeta;
  for (const p of parts) {
    enNode = (enNode as Record<string, unknown>)?.[p];
  }
  return enNode as MetaRoute;
}

export type BuildLocalizedMetadataInput = {
  /** Locale code, e.g. "es", "ja", "en". */
  locale: string;
  /** Dotted path into the `meta` messages block, e.g. "tools.seoAnalyzer". */
  routeKey: string;
  /** Path without locale prefix, e.g. "/tools/seo-analyzer". Use "/" for home. */
  path: string;
  type?: PageType;
  image?: string;
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
};

/**
 * Build locale-aware Metadata for a route. Reads the translated
 * title / description / keywords from the messages catalog so each locale's
 * <title>, <meta description>, <meta keywords>, og:* and hreflang are emitted
 * in the right language.
 */
export function buildLocalizedMetadata({
  locale,
  routeKey,
  path,
  type,
  image,
  noindex,
  publishedTime,
  modifiedTime,
  authors,
}: BuildLocalizedMetadataInput): Metadata {
  const resolvedLocale: Locale = (locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : defaultLocale;
  const { title, description, keywords } = resolveMetaRoute(resolvedLocale, routeKey);
  return buildMetadata({
    title,
    description,
    keywords,
    path,
    type,
    locale: resolvedLocale,
    image,
    noindex,
    publishedTime,
    modifiedTime,
    authors,
  });
}

// ---------------------------------------------------------------------------
// JSON-LD builders
// ---------------------------------------------------------------------------

/**
 * Full ImageObject for the Organization logo. Google's site-name / favicon
 * pipelines prefer an explicit ImageObject with width & height over a bare URL.
 */
export function logoImageObject() {
  return {
    "@type": "ImageObject",
    url: `${SITE_URL}${ORG_LOGO}`,
    width: { "@type": "QuantitativeValue", value: ORG_LOGO_WIDTH },
    height: { "@type": "QuantitativeValue", value: ORG_LOGO_HEIGHT },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAME,
    url: SITE_URL,
    logo: logoImageObject(),
    image: logoImageObject(),
    description: SITE_DESCRIPTION,
    sameAs: [
      "https://twitter.com/ytforge",
      "https://www.youtube.com/@ytforge",
      "https://www.linkedin.com/company/ytforge",
    ],
  };
}

/** Map of locale codes to BCP-47 / schema.org inLanguage values. */
const LOCALE_TO_BCP47: Record<string, string> = {
  en: "en-US",
  es: "es-ES",
  de: "de-DE",
  fr: "fr-FR",
  it: "it-IT",
  ja: "ja-JP",
  ko: "ko-KR",
  tr: "tr-TR",
  zh: "zh-CN",
};

export function websiteJsonLd(locale?: string) {
  const logo = logoImageObject();
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    name: SITE_NAME,
    alternateName: SITE_ALTERNATE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
    inLanguage: locale ? (LOCALE_TO_BCP47[locale] ?? locale) : "en-US",
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/tools/seo-analyzer?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export type BreadcrumbItem = { name: string; path: string };

export function breadcrumbJsonLd(items: BreadcrumbItem[], locale: Locale = defaultLocale) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${localizedPath(locale, item.path)}`,
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  path: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author?: string;
  locale?: Locale;
}) {
  const locale = input.locale ?? defaultLocale;
  const url = `${SITE_URL}${localizedPath(locale, input.path)}`;
  const img = input.image
    ? input.image.startsWith("http")
      ? input.image
      : `${SITE_URL}${input.image}`
    : `${SITE_URL}/og-default.png`;
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    image: img,
    datePublished: input.datePublished,
    dateModified: input.dateModified ?? input.datePublished,
    author: { "@type": "Organization", name: input.author ?? `${SITE_NAME} Team` },
    publisher: { "@type": "Organization", name: SITE_NAME, logo: logoImageObject() },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
  };
}

export function webApplicationJsonLd(input: {
  name: string;
  description: string;
  path: string;
  locale?: Locale;
  category?: string;
}) {
  const locale = input.locale ?? defaultLocale;
  const url = `${SITE_URL}${localizedPath(locale, input.path)}`;
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: input.name,
    description: input.description,
    url,
    applicationCategory: input.category ?? "MultimediaApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires a modern web browser with JavaScript enabled",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: SITE_NAME },
  };
}

export function faqJsonLd(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function productJsonLd(input: {
  name: string;
  description: string;
  path: string;
  price: number;
  priceCurrency?: string;
  locale?: Locale;
}) {
  const locale = input.locale ?? defaultLocale;
  const url = `${SITE_URL}${localizedPath(locale, input.path)}`;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: input.name,
    description: input.description,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "Offer",
      price: input.price,
      priceCurrency: input.priceCurrency ?? "USD",
      availability: "https://schema.org/InStock",
      url,
    },
  };
}

/**
 * Render one or more JSON-LD objects as <script> tags. Server component safe.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
