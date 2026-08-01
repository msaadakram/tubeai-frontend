"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { FileText, Shield, Scale, AlertTriangle, Mail } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { getLocalePath } from "@/lib/i18n/utils";
import type { Locale } from "@/lib/i18n/config";

export default function TermsPage() {
  const { t } = useTranslations();
  const { locale } = useLocale();
  const sections = t("termsPage.sections");

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-red-600 border-b-4 border-black pt-16 sm:pt-18">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.25)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-xs font-black tracking-wider uppercase mb-6 border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)]">
              <Scale className="w-3.5 h-3.5 text-red-500" /> {t("termsPage.heroBadge")}
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              {t("termsPage.h1")}
            </h1>
            <p className="text-base sm:text-lg text-red-50 leading-relaxed max-w-2xl mx-auto">
              {t("termsPage.desc")}
            </p>
          </motion.div>
        </div>
      </section>

      <main className="flex-1 bg-neutral-50 py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 max-w-6xl mx-auto">
            {/* Sidebar TOC */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <FileText className="w-4 h-4 text-red-600" />
                  <div className="font-black text-sm uppercase tracking-wider">{t("termsPage.tocTitle")}</div>
                </div>
                <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
                  {sections.map((s, i) => (
                    <a
                      key={s.title}
                      href={`#section-${i + 1}`}
                      className="block px-3 py-1.5 text-xs font-bold text-neutral-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Body */}
            <article className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10">
              <div className="prose prose-neutral max-w-none [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24 first:[&_h2]:mt-0 [&_h3]:font-black [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-neutral-700 [&_p]:leading-relaxed [&_p]:mb-4 [&_a]:text-red-600 [&_a]:font-black [&_a]:underline [&_strong]:font-black [&_strong]:text-black [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:text-neutral-700 [&_li]:mb-1.5">
                <p className="text-sm text-neutral-500 font-bold border-b-2 border-dashed border-neutral-200 pb-4 mb-6">
                  {t("termsPage.effectiveDate")}
                </p>

                {sections.map((s, i) => (
                  <div key={i}>
                    <h2 id={`section-${i + 1}`}>{s.title}</h2>
                    {s.intro && <p>{renderBody(s.intro, locale, t)}</p>}
                    {s.items && (
                      <ul>
                        {s.items.map((item, j) => (
                          <li key={j}>{item}</li>
                        ))}
                      </ul>
                    )}
                    {s.body &&
                      s.body.map((p, j) => <p key={j}>{renderBody(p, locale, t)}</p>)}
                    {s.subheads &&
                      s.subheads.map((sh, j) => (
                        <div key={j}>
                          <h3>{sh.title}</h3>
                          <p>{renderBody(sh.body, locale, t)}</p>
                        </div>
                      ))}
                    {s.outro && <p>{renderBody(s.outro, locale, t)}</p>}
                  </div>
                ))}

                <div className="mt-10 p-5 bg-red-50 border-2 border-black rounded-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-black text-sm mb-1">{t("termsPage.summaryTitle")}</div>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      {t("termsPage.summaryText")}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Need help banner */}
          <div className="max-w-6xl mx-auto mt-10">
            <div className="bg-black border-2 border-black rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)]">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center border-2 border-white shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-black text-lg text-white mb-1">{t("termsPage.helpTitle")}</div>
                <p className="text-sm text-neutral-300 leading-relaxed">{t("termsPage.helpDesc")}</p>
              </div>
              <Link href={getLocalePath(locale, "/privacy")} className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black font-black rounded-xl border-2 border-white hover:bg-neutral-100 transition-colors uppercase tracking-wider text-xs whitespace-nowrap">
                <Shield className="w-4 h-4" /> {t("termsPage.privacyPolicy")}
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
      <LegalBreadcrumbJsonLd home={t("termsPage.homeCrumb")} terms={t("termsPage.termsCrumb")} />
    </div>
  );
}

function renderBody(text: string, locale: Locale, t: (k: string) => any) {
  const parts = text.split("{{privacy}}");
  if (parts.length > 1) {
    return (
      <>
        {parts[0]}
        <Link href={getLocalePath(locale, "/privacy")}>{t("termsPage.privacyPolicy")}</Link>
        {parts[1]}
      </>
    );
  }
  const p2 = text.split("{{pricingPage}}");
  if (p2.length > 1) {
    return (
      <>
        {p2[0]}
        <Link href={getLocalePath(locale, "/pricing")}>{t("termsPage.pricingPage")}</Link>
        {p2[1]}
      </>
    );
  }
  return text;
}

function LegalBreadcrumbJsonLd({ home, terms }: { home: string; terms: string }) {
  const bc = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: home, item: "https://ytforge.app/" },
      { "@type": "ListItem", position: 2, name: terms, item: "https://ytforge.app/terms" },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />;
}
