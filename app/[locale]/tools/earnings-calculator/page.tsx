"use client";

import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calculator,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  PenTool,
  Eye,
  Users,
  Video,
  TrendingDown,
  Globe,
  BarChart3,
  Activity,
  Info,
  Zap,
} from "lucide-react";
import { ToolLayout, ToolCard } from "@/components/tools/ToolLayout";
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import { StatsStrip, GuideGrid, Workflow, SeoContent, FaqAccordion, CrossCTA } from "@/components/tools/ToolSections";

import { useTranslations } from "@/lib/i18n/useTranslations";

const nichesColorsAndFlags = {
  niches: [
    { name: "Finance", color: "from-green-500 to-emerald-600" },
    { name: "Tech", color: "from-blue-500 to-cyan-600" },
    { name: "Education", color: "from-purple-500 to-violet-600" },
    { name: "Lifestyle", color: "from-pink-500 to-rose-600" },
    { name: "Gaming", color: "from-orange-500 to-amber-600" },
    { name: "Entertainment", color: "from-red-500 to-rose-600" },
  ]
};

const guidesColorAndIcons = {
  guides: [
    { icon: CheckCircle2, color: "text-green-600 bg-green-100" },
    { icon: CheckCircle2, color: "text-green-600 bg-green-100" },
    { icon: CheckCircle2, color: "text-green-600 bg-green-100" },
    { icon: XCircle, color: "text-red-600 bg-red-100" },
    { icon: XCircle, color: "text-red-600 bg-red-100" },
    { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100" },
  ]
};

export default function EarningsCalculatorPage() {
  const { t } = useTranslations();
  const toolContent = t("toolPages.earningsCalculator") as NonNullable<ReturnType<typeof t<"toolPages.earningsCalculator">>>;

  const niches = toolContent.niches.map((n, i) => ({ ...n, color: nichesColorsAndFlags.niches[i % nichesColorsAndFlags.niches.length].color }));
  // Basic inputs
  const [views, setViews] = useState(100000);
  const [subscribers, setSubscribers] = useState(50000);
  const [videoCount, setVideoCount] = useState(100);
  const [niche, setNiche] = useState(niches[1]);

  // Advanced inputs
  const [monetizedPercent, setMonetizedPercent] = useState(65);
  const [geography, setGeography] = useState(toolContent.geoRegions[0]);
  const [videoLength, setVideoLength] = useState(toolContent.videoLengths[1]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const result = useMemo(() => {
    // AdSense calculation with all modifiers
    const baseRPM = niche.rpm * geography.multiplier * videoLength.multiplier;
    const monthlyRevenue = (views / 1000) * baseRPM * (monetizedPercent / 100);
    const yearlyRevenue = monthlyRevenue * 12;
    const dailyRevenue = monthlyRevenue / 30;
    const revenuePerView = views > 0 ? monthlyRevenue / views : 0;
    const monetizedViews = Math.round(views * (monetizedPercent / 100));

    return {
      monthly: Math.round(monthlyRevenue),
      yearly: Math.round(yearlyRevenue),
      daily: Math.round(dailyRevenue),
      baseRPM: baseRPM.toFixed(2),
      effectiveRPM: ((monthlyRevenue / views) * 1000).toFixed(2),
      revenuePerView: revenuePerView.toFixed(4),
      monetizedViews: monetizedViews,
      unmonetizedViews: views - monetizedViews,
    };
  }, [views, niche, monetizedPercent, geography, videoLength]);

  return (
    <ToolLayout
      title={toolContent.title}
      description={toolContent.description}
      icon={Calculator}
      badge={toolContent.badge}
    >
      <StatsStrip stats={toolContent.stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {/* INPUTS SECTION */}
        <ToolCard>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider">{toolContent.inputChannel}</h3>
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6">
            {/* Monthly Views */}
            <div>
              <label className="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-3">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-red-600" />
                  {toolContent.inputViews}
                </span>
                <span className="text-red-600 tabular-nums text-base">{views.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min={1000}
                max={10000000}
                step={10000}
                value={views}
                onChange={(e) => setViews(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
              <div className="flex justify-between text-[10px] font-bold text-neutral-400 mt-1">
                <span>{toolContent.inputViewsScale[0]}</span>
                <span>{toolContent.inputViewsScale[1]}</span>
              </div>
            </div>

            {/* Subscribers */}
            <div>
              <label className="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-3">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  {toolContent.inputSubs}
                </span>
                <span className="text-blue-600 tabular-nums text-base">{subscribers.toLocaleString()}</span>
              </label>
              <input
                type="range"
                min={0}
                max={5000000}
                step={1000}
                value={subscribers}
                onChange={(e) => {
                  const subs = Number(e.target.value);
                  setSubscribers(subs);
                }}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Video Count */}
            <div>
              <label className="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-3">
                <span className="flex items-center gap-1.5">
                  <Video className="w-3.5 h-3.5 text-purple-600" />
                  {toolContent.inputVideos}
                </span>
                <span className="text-purple-600 tabular-nums text-base">{videoCount}</span>
              </label>
              <input
                type="range"
                min={1}
                max={1000}
                step={1}
                value={videoCount}
                onChange={(e) => setVideoCount(Number(e.target.value))}
                className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {/* Niche Selection */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-3">{toolContent.inputNiche}</label>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                {niches.map((n) => (
                  <button
                    key={n.name}
                    onClick={() => setNiche(n)}
                    className={`group relative px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-black text-[11px] sm:text-xs font-black transition-all ${niche.name === n.name
                      ? `bg-gradient-to-br ${n.color} text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
                      : "bg-white text-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{n.name}</span>
                      <span className={`text-[10px] sm:text-xs ${niche.name === n.name ? "opacity-90" : "opacity-50"}`}>${n.rpm}</span>
                    </div>
                    <div className="text-[8px] sm:text-[9px] font-bold opacity-70 mt-0.5">{toolContent.inputNicheRpm}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-neutral-50 to-neutral-100 border-2 border-black rounded-xl hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <span className="text-xs font-black uppercase tracking-wider">{toolContent.inputAdvanced}</span>
              <motion.div animate={{ rotate: showAdvanced ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <TrendingDown className="w-4 h-4" />
              </motion.div>
            </button>

            {/* Advanced Options Panel */}
            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="space-y-6 overflow-hidden"
                >
                  {/* Geography */}
                  <div className="pt-4 border-t-2 border-dashed border-neutral-200">
                    <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mb-3">
                      <Globe className="w-3.5 h-3.5 text-green-600" />
                      {toolContent.inputGeo}
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {toolContent.geoRegions.map((geo) => (
                        <button
                          key={geo.name}
                          onClick={() => setGeography(geo)}
                          className={`px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg border-2 border-black text-[11px] sm:text-xs font-black transition-all ${geography.name === geo.name
                            ? "bg-green-600 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                            : "bg-white text-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            }`}
                        >
                          <div className="text-sm sm:text-base mb-1">{geo.flag}</div>
                          <div className="text-[10px] sm:text-xs">{geo.name}</div>
                          <div className="text-[8px] sm:text-[9px] opacity-70 mt-0.5 sm:mt-1">{(geo.multiplier * 100).toFixed(0)}{toolContent.inputGeoMultiplier.replace("%", "")}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Video Length */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mb-3">
                      <Zap className="w-3.5 h-3.5 text-orange-600" />
                      {toolContent.inputLength}
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {toolContent.videoLengths.map((len) => (
                        <button
                          key={len.name}
                          onClick={() => setVideoLength(len)}
                          className={`px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg border-2 border-black text-[10px] sm:text-xs font-black transition-all ${videoLength.name === len.name
                            ? "bg-orange-600 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                            : "bg-white text-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            }`}
                        >
                          <div className="text-[10px] sm:text-xs">{len.name}</div>
                          <div className="text-[8px] sm:text-[9px] opacity-70 mt-0.5 sm:mt-1">{len.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Monetized Percentage */}
                  <div>
                    <label className="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-3">
                      <span className="flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-yellow-600" />
                        {toolContent.inputMonetized}
                      </span>
                      <span className="text-yellow-600 tabular-nums text-base">{monetizedPercent}%</span>
                    </label>
                    <input
                      type="range"
                      min={20}
                      max={100}
                      value={monetizedPercent}
                      onChange={(e) => setMonetizedPercent(Number(e.target.value))}
                      className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-yellow-600"
                    />
                    <div className="text-[10px] font-bold text-neutral-500 mt-2">
                      {toolContent.inputMonetizedDesc}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ToolCard>

        {/* RESULTS SECTION */}
        <ToolCard className="bg-gradient-to-br from-black to-neutral-900 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 sm:w-5 sm:h-5 text-green-400" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider">{toolContent.resultTitle}</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 rounded-full text-[9px] sm:text-[10px] font-black border-2 border-black">
              {toolContent.resultLiveBadge}
            </div>
          </div>

          <motion.div
            key={result.monthly}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-6 sm:mb-8"
          >
            <div className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">{toolContent.resultMonthlyTitle}</div>
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tabular-nums bg-gradient-to-br from-green-400 to-emerald-500 bg-clip-text text-transparent">
              ${result.monthly.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-3 sm:mt-4 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-black">
                <TrendingUp className="w-4 h-4" />
                ${result.yearly.toLocaleString()} {toolContent.resultYearly}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 text-xs font-bold">
                <DollarSign className="w-3.5 h-3.5" />
                ${result.daily.toLocaleString()} {toolContent.resultDaily}
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-400 text-xs font-bold">
                ${result.revenuePerView} {toolContent.resultPerView}
              </div>
            </div>
          </motion.div>

          {/* RPM & Performance Stats */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-white/5 border-2 border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-400">{toolContent.resultBaseRpm}</div>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black tabular-nums">${result.baseRPM}</div>
              <div className="text-[8px] sm:text-[9px] font-bold text-neutral-500 mt-1">{toolContent.resultBaseRpmDesc}</div>
            </div>

            <div className="bg-white/5 border-2 border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-400">{toolContent.resultEffectiveRpm}</div>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black tabular-nums">${result.effectiveRPM}</div>
              <div className="text-[8px] sm:text-[9px] font-bold text-neutral-500 mt-1">{toolContent.resultEffectiveRpmDesc}</div>
            </div>
          </div>

          {/* View Breakdown */}
          <div className="bg-white/5 border-2 border-white/10 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-neutral-400 mb-2 sm:mb-3">{toolContent.resultViewBreakdown}</div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs font-bold">{toolContent.resultMonetizedViews}</span>
                </div>
                <span className="text-sm font-black tabular-nums">{result.monetizedViews.toLocaleString()}</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${monetizedPercent}%` }}
                  className="h-full bg-gradient-to-r from-green-500 to-emerald-600"
                  transition={{ duration: 0.5, delay: 0.2 }}
                />
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-neutral-500"></div>
                  <span className="text-xs font-bold">{toolContent.resultUnmonetizedViews}</span>
                </div>
                <span className="text-sm font-black tabular-nums">{result.unmonetizedViews.toLocaleString()}</span>
              </div>
              <div className="w-full bg-neutral-800 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${100 - monetizedPercent}%` }}
                  className="h-full bg-gradient-to-r from-neutral-600 to-neutral-700"
                  transition={{ duration: 0.5, delay: 0.3 }}
                />
              </div>
            </div>
          </div>

          {/* Calculation Formula */}
          <div className="bg-gradient-to-br from-red-600/10 to-orange-600/10 border-2 border-red-500/20 rounded-xl p-3 sm:p-4">
            <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
              <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
              <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-red-400">{toolContent.resultFormulaTitle}</div>
            </div>
            <div className="text-[10px] sm:text-xs font-mono font-bold text-neutral-300 space-y-1">
              <div className="break-words">{toolContent.resultFormula1}</div>
              <div className="text-neutral-500 break-words">= ({views.toLocaleString()} / 1000) × ${result.baseRPM} × {monetizedPercent}%</div>
              <div className="text-green-400 text-xs sm:text-sm mt-1.5 sm:mt-2">= ${result.monthly.toLocaleString()}</div>
            </div>
          </div>

          <p className="text-[9px] sm:text-[10px] text-neutral-400 leading-relaxed border-t border-white/10 pt-3 sm:pt-4 mt-4 sm:mt-6">
            <strong className="text-white">{toolContent.resultDisclaimer}</strong> {toolContent.resultDisclaimerText}
          </p>
        </ToolCard>
      </div>

      <GuideGrid
        badge={toolContent.guideBadge}
        title={toolContent.guideTitle}
        intro={toolContent.guideIntro}
        cards={toolContent.guides.map((g, i) => ({
          ...g,
          icon: guidesColorAndIcons.guides[i].icon,
          color: guidesColorAndIcons.guides[i].color
        }))}
      />

      <Workflow
        title={toolContent.workflowTitle}
        steps={toolContent.workflows}
      />

      <SeoContent badge={toolContent.seoContent.badge} title={toolContent.seoContent.title}>
        <p dangerouslySetInnerHTML={{ __html: toolContent.seoContent.p1 }} />

        <h3>{toolContent.seoContent.h3_1}</h3>
        <p dangerouslySetInnerHTML={{ __html: toolContent.seoContent.p2_1 }} />

        <h3>{toolContent.seoContent.h3_2}</h3>
        <p dangerouslySetInnerHTML={{ __html: toolContent.seoContent.p2_2 }} />

        <h3>{toolContent.seoContent.h3_3}</h3>
        <p dangerouslySetInnerHTML={{ __html: toolContent.seoContent.p2_3 }} />

        <h3>{toolContent.seoContent.h3_4}</h3>
        <p dangerouslySetInnerHTML={{ __html: toolContent.seoContent.p2_4 }} />

        <h3>{toolContent.seoContent.h3_5}</h3>
        <p dangerouslySetInnerHTML={{ __html: toolContent.seoContent.p2_5 }} />

        <h3>{toolContent.seoContent.h3_6}</h3>
        <p dangerouslySetInnerHTML={{ __html: toolContent.seoContent.p2_6 }} />
      </SeoContent>

      <FaqAccordion faqs={toolContent.faqs} />

      <CrossCTA
        title={toolContent.crossCta.title}
        desc={toolContent.crossCta.desc}
        primary={{ label: toolContent.crossCta.btn1, href: "/tools/monetization-checker", icon: Sparkles }}
        secondary={{ label: toolContent.crossCta.btn2, href: "/tools/viral-title-generator", icon: PenTool }}
      />
      <ToolSeoJsonLd
        name={toolContent.title}
        description={toolContent.seoJsonDesc}
        slug="earnings-calculator"
        faqs={toolContent.faqs}
        breadcrumb={[
          { name: toolContent.breadcrumbHome, slug: "/" },
          { name: toolContent.breadcrumbTools, slug: "/tools" },
          { name: toolContent.title, slug: "/tools/earnings-calculator" },
        ]}
      />
    </ToolLayout>
  );
}
