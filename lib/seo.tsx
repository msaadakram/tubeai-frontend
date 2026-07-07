import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

export const SITE_NAME = "YTForge";
export const SITE_URL = "https://ytforge.app";
export const SITE_TAGLINE = "AI-Powered YouTube Creator Toolkit";
export const SITE_DESCRIPTION =
  "YTForge is an AI-powered YouTube creator toolkit — title generators, AI script writer, thumbnail tools, SEO analyzer, channel analytics, monetization checker, and earnings calculator in one place.";

export const ORG_LOGO = "/logo.png";

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

// ---------------------------------------------------------------------------
// JSON-LD builders
// ---------------------------------------------------------------------------

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}${ORG_LOGO}`,
    description: SITE_DESCRIPTION,
    sameAs: [
      "https://twitter.com/ytforge",
      "https://www.youtube.com/@ytforge",
      "https://www.linkedin.com/company/ytforge",
    ],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_TAGLINE,
    publisher: { "@type": "Organization", name: SITE_NAME },
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
    publisher: { "@type": "Organization", name: SITE_NAME, logo: { "@type": "ImageObject", url: `${SITE_URL}${ORG_LOGO}` } },
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
