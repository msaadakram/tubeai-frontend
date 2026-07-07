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

const homeFaqs = [
  { q: "What is YTForge?", a: "YTForge is an all-in-one AI toolkit for YouTube creators. It bundles 16 purpose-built tools — a viral title generator, AI script writer, AI thumbnail generator, SEO analyzer, channel analytics, channel ID finder, monetization checker, earnings calculator, hashtag and tag generators, thumbnail downloader and preview, embed and QR code generators, AI transcript, and Shorts ideas — into one workspace tuned for the YouTube algorithm in 2026." },
  { q: "Are the YouTube tools free?", a: "Most tools are free with no signup: the tag generator, hashtag generator, channel ID finder, thumbnail downloader, embed generator, QR code generator, and Shorts ideas. AI-powered tools like the script writer, thumbnail generator, and channel analytics are part of the Creator and Pro plans, with a free trial and no credit card required." },
  { q: "Do I need to install anything?", a: "No. YTForge runs entirely in your browser. Every tool is a one-input-to-one-output flow — paste a link or topic, get the result, copy it into YouTube Studio. There is no extension, plugin, or desktop app to install." },
  { q: "Will these tools work for my niche?", a: "Yes. The underlying models are trained across every major YouTube niche — tech, gaming, finance, education, vlogs, fitness, beauty, business, and entertainment — and you can specify your niche and audience so output is tuned accordingly." },
  { q: "Is my data used to train AI?", a: "No. YTForge never trains its models on your private prompts, scripts, or channel data. Your inputs are encrypted in transit (TLS 1.3) and at rest (AES-256), and you retain full ownership of everything you generate. See our AI Policy for the full breakdown." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-red-600/20 selection:text-red-900">
      <Navbar />
      <main>
        <Hero />

        {/* Trusted By Section — looping marquee */}
        <section className="py-10 sm:py-12 border-y border-neutral-200 bg-white relative z-20 overflow-hidden">
          <p className="text-center text-xs sm:text-sm font-bold text-red-600 mb-6 sm:mb-8 tracking-widest uppercase px-4">
            Trusted by over 10,000 creators and agencies
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

        {/* SEO content — the YouTube tools hub */}
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
                competitor&apos;s thumbnail for swipe-file inspiration. Need an embed code or a QR code for a printed
                campaign? The <a href="/tools/embed-generator">Embed Generator</a> and{" "}
                <a href="/tools/qr-code-generator">QR Code Generator</a> handle both in one click.
              </p>
              <h3>Channel research and monetization</h3>
              <p>
                For channel-level work, the <a href="/tools/channel-id-finder">Channel ID Finder</a> resolves any URL or
                handle to the permanent UC identifier, RSS feed, and canonical link. The{" "}
                <a href="/tools/channel-analytics">Channel Analytics</a> tool breaks down subscriber growth, view
                velocity, and top videos. The <a href="/tools/monetization-checker">Monetization Checker</a> reports
                YPP eligibility, and the <a href="/tools/earnings-calculator">Earnings Calculator</a> projects AdSense
                revenue from your views, country mix, and niche. The{" "}
                <a href="/tools/ai-transcript">AI Transcript</a> tool extracts and translates video transcripts into
                100+ languages for accessibility and repurposing.
              </p>
              <h3>Built for the 2026 YouTube algorithm</h3>
              <p>
                Every tool is tuned for the signals YouTube weights today: click-through rate, average view duration,
                and topical authority through keyword clusters. Run the full stack — research, package, publish, audit —
                and you compound search impressions, watch time, and subscribers month over month. Read the{" "}
                <a href="/blog/guide-to-yt-seo-grow">complete YouTube SEO guide</a> for the system behind the tools, or
                the <a href="/blog/youtube-cpm-rates-by-country">CPM rates by country report</a> for the monetization
                side.
              </p>
            </div>

            {/* FAQ */}
            <div className="mt-12">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight text-black mb-6">
                Frequently asked questions
              </h3>
              <div className="space-y-3 max-w-3xl">
                {homeFaqs.map((f, i) => (
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
      <HomeJsonLd />
    </div>
  );
}

function HomeJsonLd() {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: homeFaqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
  );
}
