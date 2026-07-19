import { notFound } from "next/navigation";
import type { Metadata } from "next";
import "../globals.css";
import { AuthProvider } from "@/lib/auth";
import { Toaster } from "sonner";
import RouteShell from "@/components/RouteShell";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";
import { buildLocalizedMetadata } from "@/lib/seo";
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
  const base = buildLocalizedMetadata({
    locale: resolved,
    routeKey: "home",
    path: "/",
  });
  return {
    ...base,
    other: { lang: resolved, dir },
    manifest: "/site.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any", type: "image/x-icon" },
        { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
        { url: "/android-chrome-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/logo.png", sizes: "512x512", type: "image/png" },
      ],
      shortcut: [{ url: "/favicon.ico" }],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
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
    </>
  );
}
