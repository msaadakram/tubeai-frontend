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
import { useTranslations } from "@/lib/i18n/useTranslations";

type CategoryId = "all" | "ai" | "download" | "analytics" | "seo";

const toolMeta: {
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  category: "ai" | "download" | "analytics" | "seo";
}[] = [
  { slug: "viral-title-generator",  icon: Type,       badge: "POPULAR", category: "ai" },
  { slug: "ai-script-writer",       icon: PenTool,               category: "ai" },
  { slug: "ai-transcript",          icon: FileText,              category: "ai" },
  { slug: "hashtag-generator",      icon: Hash,                  category: "ai" },
  { slug: "tag-generator",          icon: TagIcon,               category: "ai" },
  { slug: "shorts-ideas",           icon: Video,      badge: "PRO",     category: "ai" },
  { slug: "ai-thumbnail-generator", icon: ImageIcon,  badge: "PRO",     category: "ai" },
  { slug: "thumbnail-downloader",   icon: Download,              category: "download" },
  { slug: "thumbnail-preview",      icon: ImageIcon,             category: "download" },
  { slug: "embed-generator",        icon: Code2,                 category: "download" },
  { slug: "qr-code-generator",      icon: QrCode,                category: "download" },
  { slug: "channel-analytics",      icon: BarChart3,  badge: "LIVE",    category: "analytics" },
  { slug: "monetization-checker",   icon: DollarSign,            category: "analytics" },
  { slug: "earnings-calculator",    icon: Calculator,            category: "analytics" },
  { slug: "seo-analyzer",           icon: LineChart,             category: "seo" },
];

function badgeStyle(badge?: string) {
  if (!badge) return "";
  if (badge === "PRO")     return "bg-gradient-to-r from-yellow-400 to-orange-500 text-black";
  if (badge === "POPULAR") return "bg-red-600 text-white";
  if (badge === "LIVE")    return "bg-green-500 text-white";
  return "bg-black text-white";
}

const FeatureCard = React.forwardRef<
  HTMLDivElement,
  { slug: string; icon: React.ComponentType<{ className?: string }>; badge?: string; index: number; title: string; description: string; tryFree: string }
>(function FeatureCard({ slug, icon: Icon, badge, index, title, description, tryFree }, ref) {
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
        href={`/tools/${slug}`}
        className="flex flex-col h-full bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 group relative overflow-hidden"
      >
        {badge && (
          <span className={`absolute top-3 right-3 px-2 py-0.5 text-[9px] font-black tracking-wider rounded-full border-2 border-black ${badgeStyle(badge)}`}>
            {badge}
          </span>
        )}
        <div className="absolute -bottom-8 -right-8 w-28 h-28 bg-red-600/0 group-hover:bg-red-600/6 rounded-full transition-all duration-500 blur-2xl pointer-events-none" />

        <div className="relative flex flex-col flex-1">
          <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center mb-4 border-2 border-black shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] group-hover:bg-red-600 group-hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 shrink-0">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-base sm:text-lg font-black text-black mb-2 group-hover:text-red-600 transition-colors leading-tight">
            {title}
          </h3>
          <p className="text-sm text-neutral-600 mb-5 leading-relaxed flex-1">
            {description}
          </p>
          <div className="flex items-center text-xs font-black text-black uppercase tracking-wider group-hover:text-red-600 transition-colors mt-auto">
            {tryFree}
            <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

export function Features() {
  const { t } = useTranslations();
  const [active, setActive] = useState<CategoryId>("all");

  const categories: { id: CategoryId; label: string; count: number }[] = [
    { id: "all",       label: t("features.catAll"),      count: toolMeta.length },
    { id: "ai",        label: t("features.catAi"),       count: toolMeta.filter(f => f.category === "ai").length },
    { id: "download",  label: t("features.catDownload"), count: toolMeta.filter(f => f.category === "download").length },
    { id: "analytics", label: t("features.catAnalytics"),count: toolMeta.filter(f => f.category === "analytics").length },
    { id: "seo",       label: t("features.catSeo"),      count: toolMeta.filter(f => f.category === "seo").length },
  ];

  const filtered = active === "all" ? toolMeta : toolMeta.filter(f => f.category === active);
  const tryFree = t("features.tryFree");

  return (
    <section id="features" className="py-16 sm:py-20 md:py-24 bg-white relative">
      <div className="container mx-auto px-4 sm:px-6 flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
        <div className="hidden lg:block w-12 border-l border-neutral-200 relative shrink-0">
          <div className="absolute top-0 -left-6 transform -rotate-90 origin-top-left text-neutral-400 text-sm tracking-[0.2em] font-medium whitespace-nowrap">
            PRODUCTS & SERVICES
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-black tracking-widest uppercase rounded-full mb-3">
              <Sparkles className="w-3 h-3 text-red-500" /> {toolMeta.length} {t("features.badge")}
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-black mb-3 sm:mb-4">
              {t("features.title")}
            </h2>
            <p className="text-base sm:text-lg text-neutral-500 max-w-2xl">
              {t("features.subtitle")}
            </p>
          </div>

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

          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((tool, i) => {
                const tr = t(`features.tools.${tool.slug}`) as { title: string; description: string };
                return (
                  <FeatureCard
                    key={tool.slug}
                    slug={tool.slug}
                    icon={tool.icon}
                    badge={tool.badge}
                    index={i}
                    title={tr?.title ?? tool.slug}
                    description={tr?.description ?? ""}
                    tryFree={tryFree}
                  />
                );
              })}
            </AnimatePresence>
          </motion.div>

          <div className="flex justify-center mt-10 sm:mt-12">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-black rounded-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 text-sm uppercase tracking-wider"
            >
              <Sparkles className="w-4 h-4 text-red-500" /> {t("features.exploreAll")}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
