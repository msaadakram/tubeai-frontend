"use client";

import React from "react";

type Faq = { q: string; a: string };

/**
 * Emits WebApplication + BreadcrumbList + FAQPage JSON-LD for a tool page.
 * Client component (tool pages are "use client"), so we render script tags
 * with dangerouslySetInnerHTML — safe because all data is static site content.
 */
export function ToolSeoJsonLd({
  name,
  description,
  slug,
  faqs,
  breadcrumb,
}: {
  name: string;
  description: string;
  slug: string;
  faqs: Faq[];
  breadcrumb: { name: string; slug: string }[];
}) {
  const url = `https://ytforge.app/tools/${slug}`;

  const webApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name,
    description,
    url,
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires a modern web browser with JavaScript enabled",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    publisher: { "@type": "Organization", name: "YTForge" },
  };

  const bc = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumb.map((b, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: b.name,
      item: `https://ytforge.app${b.slug === "/" ? "/" : b.slug}`,
    })),
  };

  const faq =
    faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webApp) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
      {faq && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />}
    </>
  );
}
