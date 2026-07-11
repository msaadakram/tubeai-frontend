"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Demo } from "@/components/sections/Demo";
import { AIFeatures } from "@/components/sections/AIFeatures";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { useTranslations } from "@/lib/i18n/useTranslations";

export default function Home() {
  const { t } = useTranslations();

  // FAQ items come from translations — they update automatically with locale
  const faqItems = t("faq.items") as unknown as { q: string; a: string }[];
  const safeFaqItems = Array.isArray(faqItems) ? faqItems : [];

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-red-600/20 selection:text-red-900">
      <Navbar />
      <main>
        <Hero />

        {/* Trusted By Section */}
        <section className="py-10 sm:py-12 border-y border-neutral-200 bg-white relative z-20 overflow-hidden">
          <p className="text-center text-xs sm:text-sm font-bold text-red-600 mb-6 sm:mb-8 tracking-widest uppercase px-4">
            {t("trusted.label")}
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
            <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-12 md:gap-24 pr-12 md:pr-24">
              {[...Array(2)].map((_, dup) => (
                <div key={dup} className="flex shrink-0 items-center gap-12 md:gap-24" aria-hidden={dup === 1}>
                  {["MrBeast", "Ali Abdaal", "Marques Brownlee", "Colin & Samir", "Think Media"].map((logo) => (
                    <div
                      key={`${dup}-${logo}`}
                      className="text-lg sm:text-xl md:text-2xl font-bold font-serif italic text-black hover:text-red-600 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {logo}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes marquee {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
          `}</style>
        </section>

        <Features />
        <Demo />
        <AIFeatures />
        <Testimonials />
        <Pricing />
        <FAQ />

        {/* FAQ Section — fully driven by i18n translations */}
        <section className="bg-white border-t-2 border-black py-14 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black tracking-wider uppercase rounded-full mb-4">
              {t("features.badge")}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-4">
              {t("faq.title")}
            </h2>
            <p className="text-neutral-600 mb-8 text-sm sm:text-base">
              {t("faq.subtitle")}
            </p>
            <div className="space-y-3 max-w-3xl">
              {safeFaqItems.map((f, i) => (
                <details
                  key={i}
                  className="bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden group"
                >
                  <summary className="cursor-pointer list-none p-4 sm:p-5 flex items-center justify-between gap-3">
                    <span className="font-black text-sm sm:text-base text-black">{f.q}</span>
                    <span className="text-red-600 font-black text-xl group-open:rotate-45 transition-transform">+</span>
                  </summary>
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-neutral-600 leading-relaxed border-t-2 border-dashed border-neutral-200 pt-3">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
      <HomeJsonLd items={safeFaqItems} />
    </div>
  );
}

function HomeJsonLd({ items }: { items: { q: string; a: string }[] }) {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
  );
}
