import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "sonner";
import RouteShell from "@/components/RouteShell";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import { locales, defaultLocale, type Locale, localeNames } from "@/lib/i18n/config";
import { JsonLd, organizationJsonLd, websiteJsonLd, buildMetadata, SITE_NAME, SITE_TAGLINE, SITE_DESCRIPTION } from "@/lib/seo";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolved = (locales as readonly string[]).includes(locale) ? (locale as Locale) : defaultLocale;
  const base = buildMetadata({
    title: `${SITE_NAME} — ${SITE_TAGLINE}`,
    description: SITE_DESCRIPTION,
    path: "/",
    keywords: [
      "youtube tools",
      "youtube tag extractor",
      "youtube title generator",
      "youtube seo",
      "ai script writer",
      "thumbnail downloader",
      "channel analytics",
      "monetization checker",
      "earnings calculator",
    ],
    locale: resolved,
  });
  return { ...base, other: { lang: resolved, dir: "ltr" } };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!(locales as readonly string[]).includes(locale)) {
    notFound();
  }
  const resolved = locale as Locale;
  const dir = "ltr";

  return (
    <html lang={resolved} dir={dir}>
      <body>
        <AuthProvider>
          <LocaleProvider locale={resolved}>
            <RouteShell>{children}</RouteShell>
            <Toaster position="bottom-right" richColors closeButton />
          </LocaleProvider>
        </AuthProvider>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
