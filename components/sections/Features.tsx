"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import {
  DollarSign,
  FileText,
  LineChart,
  PenTool,
  Type,
  Video,
  ArrowRight,
  Image as ImageIcon,
  Download,
  Calculator,
  Hash,
  Tag as TagIcon,
  BarChart3,
  Sparkles,
  Code2,
  QrCode,
} from "lucide-react";

type Feature = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  slug: string;
  badge?: string;
  category: "ai" | "download" | "analytics" | "seo";
};

const allFeatures: Feature[] = [
  // AI Generation
  {
    title: "Viral Title Generator",
    description: "Generate 10 click-magnet titles scored for predicted CTR in under 2 seconds.",
    icon: Type,
    slug: "viral-title-generator",
    category: "ai",
    badge: "POPULAR",
  },
  {
    title: "AI Script Writer",
    description: "Retention-optimized long-form scripts with hook, loop, and payoff markers.",
    icon: PenTool,
    slug: "ai-script-writer",
    category: "ai",
  },
  {
    title: "AI Transcript",
    description: "Extract and translate perfectly timed transcripts from any video in 100+ languages.",
    icon: FileText,
    slug: "ai-transcript",
    category: "ai",
  },
  {
    title: "Hashtag Generator",
    description: "30+ trending YouTube hashtags — broad, niche, and trending — ranked by relevance.",
    icon: Hash,
    slug: "hashtag-generator",
    category: "ai",
  },
  {
    title: "Tag Generator",
    description: "Generate 20 SEO-optimized video tags to maximize discoverability.",
    icon: TagIcon,
    slug: "tag-generator",
    category: "ai",
  },
  {
    title: "AI Short Video Creator",
    description: "Turn any concept into a viral 60-second Short with hook, body, and CTA.",
    icon: Video,
    slug: "shorts-ideas",
    category: "ai",
    badge: "PRO",
  },
  {
    title: "AI Thumbnail Generator",
    description: "Generate studio-grade, scroll-stopping thumbnails with AI — 4 variants per prompt.",
    icon: ImageIcon,
    slug: "ai-thumbnail-generator",
    category: "ai",
    badge: "PRO",
  },
  // Downloads
  {
    title: "Thumbnail Downloader",
    description: "Grab any YouTube thumbnail in every resolution — HD, HQ, MQ, SD — instantly.",
    icon: Download,
    slug: "thumbnail-downloader",
    category: "download",
  },
  {
    title: "Thumbnail Preview",
    description: "Preview every YouTube thumbnail size — and see it on desktop, tablet, mobile, and TV.",
    icon: ImageIcon,
    slug: "thumbnail-preview",
    category: "download",
  },
  {
    title: "Embed Generator",
    description: "Generate responsive YouTube embed code with 20+ player options and a live preview.",
    icon: Code2,
    slug: "embed-generator",
    category: "download",
  },
  {
    title: "QR Code Generator",
    description: "Turn any YouTube link into a customizable QR code — add your logo and export in HD.",
    icon: QrCode,
    slug: "qr-code-generator",
    category: "download",
  },
  // Analytics
  {
    title: "Channel Analytics",
    description: "Full performance breakdown of any YouTube channel — subs, growth, top videos.",
    icon: BarChart3,
    slug: "channel-analytics",
    category: "analytics",
    badge: "LIVE",
  },
  {
    title: "Monetization Checker",
    description: "Verify any channel's YPP eligibility and estimated monthly earnings in one click.",
    icon: DollarSign,
    slug: "monetization-checker",
    category: "analytics",
  },
  {
    title: "Earnings Calculator",
    description: "Estimate your monthly YouTube revenue with niche-specific RPM benchmarks.",
    icon: Calculator,
    slug: "earnings-calculator",
    category: "analytics",
  },
  // SEO
  {
    title: "SEO Analyzer",
    description: "Rank #1 in YouTube search with AI-powered keyword research and metadata audits.",
    icon: LineChart,
    slug: "seo-analyzer",
    category: "seo",
  },
];

const categories = [
  { id: "all",      label: "All Tools",   count: allFeatures.length },
  { id: "ai",       label: "AI Generation", count: allFeatures.filter(f => f.category === "ai").length },
  { id: "download", label: "Downloaders",   count: allFeatures.filter(f => f.category === "download").length },
  { id: "analytics",label: "Analytics",     count: allFeatures.filter(f => f.category === "analytics").length },
  { id: "seo",      label: "SEO & Tags",    count: allFeatures.filter(f => f.category === "seo").length },
] as const;

type CategoryId = typeof categories[number]["id"];

function badgeStyle(badge?: string) {
  if (!badge) return "";
  if (badge === "PRO") return "bg-gradient-to-r from-yellow-400 to-orange-500 text-black";
  if (badge === "POPULAR") return "bg-red-600 text-white";
  if (badge === "LIVE") return "bg-green-500 text-white";
  return "bg-black text-white";
}

const FeatureCard = React.forwardRef<HTMLDivElement, { feature: Feature; index: number }>(function FeatureCard({ feature, index }, ref) {
  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: (index % 4) * 0.06 }}
    >
      <Link
        href={`/tools/${feature.slug}`}
        className="flex flex-col h-full bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden"
      >
        {feature.badge && (
          <span className={`absolute top-3 right-3 px-2 py-0.5 text-[9px] font-black tracking-wider rounded-full border-2 border-black ${badgeStyle(feature.badge)}`}>
            {feature.badge}
          </span>
        )}
        {/* Hover glow */}
        <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-red-600/0 group-hover:bg-red-600/6 rounded-full transition-all duration-500 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col flex-1">
          <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center mb-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] group-hover:bg-red-600 group-hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 shrink-0">
            <feature.icon className="w-6 h-6 text-white" />
          </div>

          <h3 className="text-base sm:text-lg font-black text-black mb-2 group-hover:text-red-600 transition-colors leading-tight">
            {feature.title}
          </h3>
          <p className="text-sm text-neutral-600 mb-5 leading-relaxed flex-1">
            {feature.description}
          </p>

          <div className="flex items-center text-xs font-black text-black uppercase tracking-wider group-hover:text-red-600 transition-colors mt-auto">
            Try it free
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export function Features() {
  const [active, setActive] = useState<CategoryId>("all");

  const filtered = active === "all"
    ? allFeatures
    : allFeatures.filter(f => f.category === active);

  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
        {/* Sideways label */}
        <div className="hidden lg:block w-12 border-l border-neutral-200 relative shrink-0">
          <div className="absolute top-0 -left-6 transform -rotate-90 origin-top-left text-neutral-400 text-sm tracking-[0.2em] font-medium whitespace-nowrap">
            PRODUCTS & SERVICES
          </div>
        </div>

        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-black tracking-widest uppercase rounded-full mb-3">
              <Sparkles className="w-3 h-3 text-red-500" /> {allFeatures.length} Tools
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-black mb-3 sm:mb-4">
              Products & Services
            </h2>
            <p className="text-base sm:text-lg text-neutral-500 max-w-2xl">
              Every tool you need to grow your YouTube channel — from AI generation to downloads, analytics, and SEO.
            </p>
          </div>

          {/* Category filter pills */}
          <div className="flex flex-wrap gap-2 mb-8 sm:mb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-black border-2 transition-all duration-200 ${
                  active === cat.id
                    ? "bg-black text-white border-black shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]"
                    : "bg-white text-neutral-700 border-neutral-300 hover:border-black hover:text-black"
                }`}
              >
                {cat.label}
                <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-[9px] font-black ${
                  active === cat.id ? "bg-red-600 text-white" : "bg-neutral-200 text-neutral-600"
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>

          {/* Tool grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((feature, i) => (
                <FeatureCard key={feature.slug} feature={feature} index={i} />
              ))}
            </AnimatePresence>
          </motion.div>

          {/* View all link */}
          <div className="flex justify-center mt-10 sm:mt-12">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-black rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 text-sm uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 text-red-500" /> Explore All Features
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
