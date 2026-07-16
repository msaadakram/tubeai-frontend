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
      icon: [
        { url: "/faci.png", sizes: "514x538", type: "image/png" },
      ],
      shortcut: [{ url: "/faci.png", type: "image/png" }],
      apple: [
        { url: "/faci.png", sizes: "514x538", type: "image/png" },
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
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `document.documentElement.lang="${resolved}";document.documentElement.dir="${dir}";`,
        }}
      />
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <AuthProvider>
          <LocaleProvider locale={resolved}>
            <RouteShell>{children}</RouteShell>
            <Toaster position="bottom-right" richColors closeButton />
          </LocaleProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
      <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
    </>
  );
}
