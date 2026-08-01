"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Info,
  Shield,
  Scale,
  Mail,
  Sparkles,
  Eye,
  Bot,
  ExternalLink,
  TrendingUp,
  Cpu,
  CheckCircle2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalePath } from "@/lib/i18n/utils";

const CALLOUT_ICONS = [Bot, TrendingUp, Eye, Shield] as const;

export default function DisclaimerPage() {
  const { t } = useTranslations();
  const { locale } = useLocale();
  const sections = t("disclaimer.sections");
  const callouts = t("disclaimer.callouts");
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
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" /> {t("disclaimer.lastUpdated")}
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              {t("disclaimer.title")}
            </h1>
            <p className="text-base sm:text-lg text-red-50 leading-relaxed max-w-2xl mx-auto">
              {t("disclaimer.intro")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Callouts strip */}
      <section className="bg-white border-b-2 border-black py-8 sm:py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
            {callouts.map((c, i) => {
              const Icon = CALLOUT_ICONS[i % CALLOUT_ICONS.length];
              return (
                <motion.div
                  key={c.t}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.06 }}
                  className="bg-white border-2 border-black rounded-xl p-4 flex items-start gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="w-9 h-9 rounded-lg bg-yellow-300 text-black flex items-center justify-center border-2 border-black shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-sm">{c.t}</div>
                    <div className="text-[11px] text-neutral-500 font-bold leading-snug">{c.d}</div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <main className="flex-1 bg-neutral-50 py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 max-w-6xl mx-auto">
            {/* TOC */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Info className="w-4 h-4 text-red-600" />
                  <div className="font-black text-sm uppercase tracking-wider">{t("disclaimer.tocTitle")}</div>
                </div>
                <nav className="space-y-1 max-h-[60vh] overflow-y-auto">
                  {sections.map((s) => (
                    <a
                      key={s.id}
                      href={`#${s.id}`}
                      className="block px-3 py-1.5 text-xs font-bold text-neutral-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      {s.title}
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Article */}
            <article className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10">
              <div className="prose prose-neutral max-w-none [&_h2]:text-2xl [&_h2]:font-black [&_h2]:tracking-tight [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:scroll-mt-24 first:[&_h2]:mt-0 [&_h3]:font-black [&_h3]:text-lg [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-neutral-700 [&_p]:leading-relaxed [&_p]:mb-4 [&_a]:text-red-600 [&_a]:font-black [&_a]:underline [&_strong]:font-black [&_strong]:text-black [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-4 [&_li]:text-neutral-700 [&_li]:mb-1.5">
                <p className="text-sm text-neutral-500 font-bold border-b-2 border-dashed border-neutral-200 pb-4 mb-6">
                  {t("disclaimer.effectiveDate")}
                </p>

                {sections.map((s) => (
                  <div key={s.id}>
                    <h2 id={s.id}>{s.title}</h2>
                    {s.intro && <p>{s.intro}</p>}
                    {s.subheads?.map((sh) => (
                      <div key={sh.title}>
                        <h3>{sh.title}</h3>
                        <p>{sh.body}</p>
                      </div>
                    ))}
                    {s.list && (
                      <ul>
                        {s.list.map((li) => (
                          <li key={li}>{li}</li>
                        ))}
                      </ul>
                    )}
                    {s.outro && <p>{s.outro}</p>}
                    {s.outro2 && <p>{s.outro2}</p>}
                    {s.id === "liability" && (
                      <p>
                        {t("disclaimer.liabilityOutroPre")}{" "}
                        <Link href={getLocalePath(locale, "/terms")}>{t("disclaimer.liabilityOutroLink")}</Link>
                        .
                      </p>
                    )}
                    {s.contacts && (
                      <ul>
                        {s.contacts.map((c) => (
                          <li key={c.label}>
                            <strong>{c.label}</strong>{" "}
                            {c.value.startsWith("mailto:") || c.value.includes("@") ? (
                              <a href={`mailto:${c.value}`}>{c.value}</a>
                            ) : (
                              c.value
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}

                <div className="mt-10 p-5 bg-yellow-50 border-2 border-black rounded-xl flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-black text-sm mb-1">{t("disclaimer.summaryTitle")}</div>
                    <p className="text-xs text-neutral-700 leading-relaxed">
                      {t("disclaimer.summaryText")}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </div>

          {/* Cross-link banner */}
          <div className="max-w-6xl mx-auto mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href={getLocalePath(locale, "/terms")} className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center border-2 border-black shrink-0">
                <Scale className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-base">{t("disclaimer.termsCardTitle")}</div>
                <div className="text-xs text-neutral-500 font-bold">{t("disclaimer.termsCardSub")}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-neutral-400 shrink-0" />
            </Link>
            <Link href={getLocalePath(locale, "/privacy")} className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 flex items-center gap-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-1 transition-all">
              <div className="w-12 h-12 rounded-xl bg-black text-white flex items-center justify-center border-2 border-black shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-black text-base">{t("disclaimer.privacyCardTitle")}</div>
                <div className="text-xs text-neutral-500 font-bold">{t("disclaimer.privacyCardSub")}</div>
              </div>
              <ExternalLink className="w-4 h-4 text-neutral-400 shrink-0" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
      <DisclaimerBreadcrumbJsonLd home={t("disclaimer.homeCrumb")} disclaimer={t("disclaimer.disclaimerCrumb")} />
    </div>
  );
}

function DisclaimerBreadcrumbJsonLd({ home, disclaimer }: { home: string; disclaimer: string }) {
  const bc = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: home, item: "https://ytforge.app/" },
      { "@type": "ListItem", position: 2, name: disclaimer, item: "https://ytforge.app/disclaimer" },
    ],
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />;
}
