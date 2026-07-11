"use client";

import React from "react";
import Link from "next/link";
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

  // FAQ items come from the translations so they change with the locale
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

        {/* SEO content hub */}
        <section className="bg-white border-t-2 border-black py-14 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black tracking-wider uppercase rounded-full mb-4">
              YouTube Tools Hub
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-4">
              Free YouTube tools for creators, in one place
            </h2>
            <div className="space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-black [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-3 [&_a]:text-red-600 [&_a]:underline [&_a]:font-bold [&_strong]:text-black">
              <p>
                YTForge is a suite of <strong>YouTube tools</strong> built for creators who want to grow faster without
                juggling a dozen tabs. Whether you are researching a video, packaging it for clicks, or auditing a
                channel after publish, there is a tool here for every step of the workflow — and most of them are free
                with no signup. Start with the <a href="/tools/tag-generator">Tag Generator</a> and{" "}
                <a href="/tools/hashtag-generator">Hashtag Generator</a> for metadata, the{" "}
                <a href="/tools/viral-title-generator">Viral Title Generator</a> and{" "}
                <a href="/tools/ai-thumbnail-generator">AI Thumbnail Generator</a> for packaging, and the{" "}
                <a href="/tools/seo-analyzer">SEO Analyzer</a> for a full audit.
              </p>
              <h3>Research and packaging tools</h3>
              <p>
                Every winning video starts with a keyword and a hook. The title generator front-loads your primary
                keyword for SEO weight while layering a curiosity hook for click-through rate. Pair it with the AI
                script writer, which structures your video around a retention-optimized skeleton — five-second hook,
                clear promise, pattern interrupts every 30 to 60 seconds, an open-loop payoff, and a single strong
                call-to-action. For Shorts, the <a href="/tools/shorts-ideas">Shorts Ideas</a> tool spins a topic into
                vertical, sub-60-second concepts with looped endings.
              </p>
              <h3>Thumbnails and visual assets</h3>
              <p>
                The thumbnail is the single biggest lever on CTR. The AI thumbnail generator produces four
                high-contrast, one-focal-point variants per prompt at 1280×720; the{" "}
                <a href="/tools/thumbnail-preview">Thumbnail Preview</a> tool shows how each renders across device sizes
                before you commit; and the <a href="/tools/thumbnail-downloader">Thumbnail Downloader</a> pulls any
                competitor&apos;s thumbnail for swipe-file inspiration.
              </p>
              <h3>Channel research and monetization</h3>
              <p>
                For channel-level work, the <a href="/tools/channel-id-finder">Channel ID Finder</a> resolves any URL or
                handle to the permanent UC identifier, RSS feed, and canonical link. The{" "}
                <a href="/tools/channel-analytics">Channel Analytics</a> tool breaks down subscriber growth, view
                velocity, and top videos. The <a href="/tools/monetization-checker">Monetization Checker</a> reports
                YPP eligibility, and the <a href="/tools/earnings-calculator">Earnings Calculator</a> projects AdSense
                revenue from your views, country mix, and niche.
              </p>
            </div>

            {/* Home FAQ — pulled from i18n so it translates with locale */}
            <div className="mt-12">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-black mb-6">
                {t("faq.title")}
              </h3>
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
