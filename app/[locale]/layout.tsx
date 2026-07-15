import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "sonner";
import RouteShell from "@/components/RouteShell";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";
import { JsonLd, organizationJsonLd, websiteJsonLd, buildMetadata, SITE_DESCRIPTION } from "@/lib/seo";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Add RTL locale codes here when you support Arabic, Hebrew, etc.
const RTL_LOCALES: string[] = [];

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const resolved = (locales as readonly string[]).includes(locale)
    ? (locale as Locale)
    : defaultLocale;
  const dir = RTL_LOCALES.includes(resolved) ? "rtl" : "ltr";
  const base = buildMetadata({
    title: "YTForge — Free YouTube Tools & AI Creator Toolkit",
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
  return {
    ...base,
    other: { lang: resolved, dir },
    icons: {
      // Next.js dynamically generates these from app/icon.tsx and app/apple-icon.tsx
      // These are the ONLY reliable sources — public/ PNG stubs were corrupt (< 250 bytes)
      icon: [
        { url: "/icon", sizes: "32x32", type: "image/png" },
        { url: "/icon", sizes: "16x16", type: "image/png" },
      ],
      shortcut: [{ url: "/icon", type: "image/png" }],
      apple: [
        { url: "/apple-icon", sizes: "180x180", type: "image/png" },
      ],
      // Android / PWA
      other: [
        { rel: "icon", url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { rel: "icon", url: "/android-chrome-512x512.png", sizes: "512x512", type: "image/png" },
      ],
    },
  };
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
  const dir = RTL_LOCALES.includes(resolved) ? "rtl" : "ltr";

  return (
    <html lang={resolved} dir={dir}>
      <head>
        {/* Primary favicon — served by Next.js app/icon.tsx (always works) */}
        <link rel="icon" type="image/png" href="/icon" />
        {/* Apple touch icon — served by Next.js app/apple-icon.tsx */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon" />
        {/* Legacy .ico fallback for very old browsers */}
        <link rel="shortcut icon" type="image/x-icon" href="/favicon.ico" />
      </head>
      <body>
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
          <AuthProvider>
            {/* Pass resolved locale as prop so LocaleProvider syncs on every SSR navigation */}
            <LocaleProvider locale={resolved}>
              <RouteShell>{children}</RouteShell>
              <Toaster position="bottom-right" richColors closeButton />
            </LocaleProvider>
          </AuthProvider>
        </GoogleOAuthProvider>
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
