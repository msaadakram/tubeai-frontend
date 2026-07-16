"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Play,
  Home,
  Sparkles,
  TrendingUp,
  PenTool,
  Download,
  LineChart,
  FileText,
  Hash,
  ArrowRight,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "@/lib/auth";
import { LocaleProvider } from "@/lib/i18n/LocaleContext";
import type { Locale } from "@/lib/i18n/LocaleContext";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { Toaster } from "sonner";

const quickLinks = [
  { label: "Viral Title Generator", href: "/tools/viral-title-generator", icon: TrendingUp },
  { label: "AI Script Writer", href: "/tools/ai-script-writer", icon: PenTool },
  { label: "Thumbnail Downloader", href: "/tools/thumbnail-downloader", icon: Download },
  { label: "SEO Analyzer", href: "/tools/seo-analyzer", icon: LineChart },
  { label: "AI Transcript", href: "/tools/ai-transcript", icon: FileText },
  { label: "Hashtag Generator", href: "/tools/hashtag-generator", icon: Hash },
];

export default function NotFound() {
  const pathname = usePathname();
  const [dark, setDark] = useState(false);
  const [year] = useState(() => new Date().getFullYear());

  const segments = pathname.split("/").filter(Boolean);
  const locale: Locale =
    segments.length > 0 && isLocale(segments[0])
      ? (segments[0] as Locale)
      : defaultLocale;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setDark(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setDark(e.matches);
    mq.addEventListener("change", onChange);
    if (
      document.documentElement.classList.contains("dark") ||
      document.body.classList.contains("dark")
    ) {
      setDark(true);
    }
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className={`${dark ? "dark" : ""} min-h-screen bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-red-600/20`}>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
        <AuthProvider>
          <LocaleProvider locale={locale}>
            <Navbar />
            <main className="flex-1 flex flex-col pt-16 sm:pt-18">
              <section className="flex-1 flex items-center justify-center py-16 sm:py-24">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                  <div className="max-w-2xl mx-auto">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-red-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] mb-6 sm:mb-8">
                      <Play className="w-7 h-7 sm:w-9 sm:h-9 text-white fill-white" />
                    </div>

                    <h1 className="text-[8rem] sm:text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-black dark:text-white select-none">
                      404
                    </h1>

                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black dark:text-white mt-4 sm:mt-6">
                      This page doesn&apos;t exist
                    </h2>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm sm:text-base mt-3 max-w-md mx-auto leading-relaxed">
                      The page you&apos;re looking for was deleted, moved, or never existed.
                      Your YouTube growth journey continues — try one of our tools below.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3 mt-8 sm:mt-10">
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black text-white bg-red-600 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.15)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider"
                      >
                        <Home className="w-4 h-4" />
                        Go Back Home
                      </Link>
                      <Link
                        href="/tools/viral-title-generator"
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black text-black dark:text-white bg-white dark:bg-neutral-900 rounded-xl border-2 border-black dark:border-neutral-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider"
                      >
                        <Sparkles className="w-4 h-4 text-red-600" />
                        Browse AI Tools
                      </Link>
                    </div>
                  </div>
                </div>
              </section>

              <section className="border-t-2 border-black dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 py-14 sm:py-16">
                <div className="container mx-auto px-4 sm:px-6">
                  <div className="text-center mb-8 sm:mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-wider rounded-full mb-3">
                      <Sparkles className="w-3 h-3" />
                      While you&apos;re here
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black tracking-tight text-black dark:text-white">
                      Try our most popular tools
                    </h3>
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mt-1">
                      16+ AI-powered tools built for serious YouTube creators
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-4xl mx-auto">
                    {quickLinks.map(({ label, href, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-950 border-2 border-black dark:border-neutral-700 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.08)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[5px_5px_0px_0px_rgba(255,255,255,0.08)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all group"
                      >
                        <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-red-600 flex items-center justify-center border-2 border-black shrink-0 group-hover:rotate-3 transition-transform">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <span className="font-black text-sm sm:text-base text-black dark:text-white flex-1 leading-tight">
                          {label}
                        </span>
                        <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-red-600 transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </section>
            </main>
            <Footer />
            <Toaster position="bottom-right" richColors closeButton />
          </LocaleProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </div>
  );
}
