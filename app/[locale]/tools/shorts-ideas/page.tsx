"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Video,
  Loader2,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PenTool,
  TrendingUp,
  Lock,
  Crown,
  ArrowRight,
} from "lucide-react";
import { ToolLayout, ToolCard, ToolInput, PrimaryButton } from "@/components/tools/ToolLayout";
import { ToolTurnstile } from "@/components/tools/ToolTurnstile";
import { useTurnstileHeader } from "@/lib/turnstile/useTurnstileHeader";
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import { LanguageSelect, getLanguage } from "@/components/tools/LanguageSelect";
import { StatsStrip, GuideGrid, Workflow, SeoContent, FaqAccordion, CrossCTA } from "@/components/tools/ToolSections";
import { useAuth } from "@/lib/auth";
import { useTranslations } from "@/lib/i18n/useTranslations";

export default function ShortsIdeasPage() {
  const { t } = useTranslations();
  const tc = t("toolPages.shortsIdeas") as any;
  const { user } = useAuth();
  const isPro = user?.plan === "pro" || user?.plan === "enterprise";
  const ts = useTurnstileHeader();

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [ideas, setIdeas] = useState<{ hook: string; body: string; cta: string }[]>([]);

  const gen = () => {
    if (!ts.ready) return; // security check must be solved first (Enter path bypasses the disabled button)
    if (!topic.trim()) return;
    setLoading(true);
    setIdeas([]);
    setTimeout(() => {
      const lang = getLanguage(language);
      const tag = lang.code === "en" ? "" : `[${lang.flag} ${lang.name}] `;
      setIdeas([
        { hook: `${tag}Wait — most people are doing ${topic} wrong. Here's the fix.`, body: `In 30 seconds, I'll show you the 3-step framework that actually works. Step 1: identify the bottleneck. Step 2: simplify. Step 3: execute consistently.`, cta: "Follow for daily creator tips!" },
        { hook: `${tag}I tested ${topic} for 7 days — the results shocked me.`, body: `Day 1: nothing. Day 3: small wins. Day 7: massive breakthrough. Here's exactly what I changed.`, cta: "Comment 'YES' if you want the full guide." },
        { hook: `${tag}If you're not using ${topic} in 2026, you're already behind.`, body: `Here's what the top 1% do differently — and how you can copy them in under 5 minutes.`, cta: "Save this for later 🔖" },
      ]);
      setLoading(false);
    }, 1100);
  };

  const guideIcons = [CheckCircle2, CheckCircle2, CheckCircle2, XCircle, XCircle, AlertTriangle];
  const guideColors = ["text-green-600 bg-green-100", "text-green-600 bg-green-100", "text-green-600 bg-green-100", "text-red-600 bg-red-100", "text-red-600 bg-red-100", "text-yellow-600 bg-yellow-100"];

  return (
    <ToolLayout
      title={tc.title}
      description={tc.description}
      icon={Video}
      badge={tc.badge}
    >
      <StatsStrip stats={tc.stats} />

      {isPro ? (
        <>
          <ToolCard className="mb-6">
            <div className="flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <ToolInput value={topic} onChange={(e) => setTopic(e.target.value)} placeholder={tc.inputPlaceholder} className="flex-1" />
                <PrimaryButton onClick={gen} disabled={loading || !topic.trim() || !ts.ready}>
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                  {loading ? tc.generatingBtn : tc.generateBtn}
                </PrimaryButton>
              </div>
              <ToolTurnstile actionLabel={tc.generateBtn as string} />
              <div className="max-w-sm">
                <LanguageSelect value={language} onChange={setLanguage} label={tc.langLabel} />
              </div>
            </div>
          </ToolCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12 sm:mb-16">
            {ideas.map((idea, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
                <div className="aspect-[9/16] bg-black relative flex items-center justify-center p-5 text-center">
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> 0:60
                  </div>
                  <div className="text-white font-black text-base sm:text-lg leading-tight">{idea.hook}</div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-wider text-red-600 mb-1">{tc.bodyLabel}</div>
                    <p className="text-xs text-neutral-700 leading-relaxed">{idea.body}</p>
                  </div>
                  <div className="pt-3 border-t border-neutral-200">
                    <div className="text-[9px] font-black uppercase tracking-wider text-red-600 mb-1">{tc.ctaLabel}</div>
                    <p className="text-xs font-bold text-black">{idea.cta}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-black text-white rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] overflow-hidden mb-12 sm:mb-16"
        >
          {/* Background grid texture */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(rgba(220,38,38,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.5) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            }}
          />

          <div className="relative p-6 sm:p-10 md:p-14 grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Left: Copy */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full border-2 border-white mb-5">
                <Crown className="w-3 h-3" /> {tc.proBadge}
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-4">
                <span dangerouslySetInnerHTML={{ __html: tc.proTitle }} />
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-6 max-w-xl">
                {tc.proDesc}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-sm rounded-xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all"
                >
                  <Crown className="w-4 h-4" /> {tc.upgradeBtn}
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/tools/viral-title-generator"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-wider text-sm rounded-xl border-2 border-white/40 transition-all"
                >
                  {tc.freeBtn}
                </Link>
              </div>
            </div>

            {/* Right: Locked preview */}
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="grid grid-cols-3 gap-2 sm:gap-3 filter blur-sm">
                  {[
                    "from-red-600 to-orange-500",
                    "from-purple-600 to-pink-500",
                    "from-blue-600 to-cyan-400",
                  ].map((g, i) => (
                    <div
                      key={i}
                      className={`aspect-[9/16] rounded-xl bg-gradient-to-br ${g} border-2 border-white relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="h-2 bg-white/60 rounded-full mb-1" />
                        <div className="h-2 bg-white/40 rounded-full w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lock overlay */}
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-red-600/30"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 border-2 border-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <GuideGrid
        badge={tc.guideBadge}
        title={tc.guideTitle}
        intro={tc.guideIntro}
        cards={tc.guides.map((g: any, i: number) => ({ ...g, icon: guideIcons[i] || CheckCircle2, color: guideColors[i] || "text-green-600 bg-green-100" }))}
      />

      <Workflow
        title={tc.workflowTitle}
        steps={tc.workflows}
      />

      <SeoContent badge={tc.seoContent.badge} title={tc.seoContent.title}>
        <p>{tc.seoContent.p1}</p>
        <h3>{tc.seoContent.h3_1}</h3>
        <div dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_1 }} />
        <h3>{tc.seoContent.h3_2}</h3>
        <div dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_2 }} />
        <h3>{tc.seoContent.h3_3}</h3>
        <div dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_3 }} />
        <h3>{tc.seoContent.h3_4}</h3>
        <div dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_4 }} />
        <h3>{tc.seoContent.h3_5}</h3>
        <div dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_5 }} />
      </SeoContent>

      <FaqAccordion faqs={tc.faqs} />

      <CrossCTA
        title={tc.crossCta.title}
        desc={tc.crossCta.desc}
        primary={{ label: tc.crossCta.btn1, href: "/tools/ai-script-writer", icon: PenTool }}
        secondary={{ label: tc.crossCta.btn2, href: "/tools/viral-title-generator", icon: TrendingUp }}
      />
      <ToolSeoJsonLd
        name={tc.title}
        description={tc.seoJsonDesc}
        slug="shorts-ideas"
        faqs={tc.faqs}
        breadcrumb={[
          { name: "Home", slug: "/" },
          { name: "Tools", slug: "/tools" },
          { name: tc.title, slug: "/tools/shorts-ideas" },
        ]}
      />
    </ToolLayout>
  );
}
