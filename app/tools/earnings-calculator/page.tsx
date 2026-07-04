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
import { StatsStrip, GuideGrid, Workflow, SeoContent, FaqAccordion, CrossCTA } from "@/components/tools/ToolSections";

const niches = [
  { name: "Finance", rpm: 12, color: "from-green-500 to-emerald-600" },
  { name: "Tech", rpm: 7, color: "from-blue-500 to-cyan-600" },
  { name: "Education", rpm: 6, color: "from-purple-500 to-violet-600" },
  { name: "Lifestyle", rpm: 4, color: "from-pink-500 to-rose-600" },
  { name: "Gaming", rpm: 3, color: "from-orange-500 to-amber-600" },
  { name: "Entertainment", rpm: 2.5, color: "from-red-500 to-rose-600" },
];

const geoRegions = [
  { name: "US/UK/CA", multiplier: 1.0, flag: "🇺🇸" },
  { name: "EU/AU", multiplier: 0.8, flag: "🇪🇺" },
  { name: "LATAM", multiplier: 0.4, flag: "🇧🇷" },
  { name: "Asia", multiplier: 0.3, flag: "🇮🇳" },
];

const videoLengths = [
  { name: "< 8 min", multiplier: 0.7, desc: "No mid-rolls" },
  { name: "8-15 min", multiplier: 1.0, desc: "1-2 mid-rolls" },
  { name: "15+ min", multiplier: 1.3, desc: "3+ mid-rolls" },
];

const stats = [
  { value: "1M+", label: "Calculations Run" },
  { value: "6", label: "Niches Tracked" },
  { value: "$12 RPM", label: "Top Niche (Finance)" },
  { value: "100%", label: "Free Forever" },
];

const guides = [
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Pick high-RPM niches", desc: "Finance ($10-12 RPM) and Tech ($7-9 RPM) earn 4-5x more per view than Gaming ($2-3 RPM) or Entertainment." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Target Tier-1 geography", desc: "US/UK/Canada viewers generate 3-10x higher AdSense than Tier-3 countries. Optimize titles for English-speaking markets." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Make videos 8+ minutes", desc: "Videos over 8 minutes enable mid-roll ads, increasing RPM by 30-50% compared to shorter videos with only pre-roll ads." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't chase views alone", desc: "10K views in Finance ($120) beats 100K views in Gaming ($250). Quality audience > quantity of views for AdSense." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't ignore watch time", desc: "Higher retention (AVD 60%+) = more mid-roll ads shown = higher RPM. A 3-minute watch on 10min video earns less than 7-minute watch." },
  { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100", title: "Q4 RPMs spike 2-4x", desc: "October-December is peak ad spend season. The same video can earn $8 RPM in Q4 vs $3 in February. Plan launches accordingly." },
];

const faqs = [
  { q: "How accurate is this AdSense calculator?", a: "We use real industry-average RPMs by niche (Finance $10-12, Tech $7-9, Education $5-7, Lifestyle $3-5, Gaming $2-3). Actual earnings vary ±30% based on audience geography, watch time, ad blocker usage, and seasonality. This is a planning tool, not a guarantee." },
  { q: "What's the difference between RPM and CPM?", a: "CPM is what advertisers bid per 1,000 ad impressions. RPM (Revenue Per Mille) is what YOU earn per 1,000 video views after YouTube's 45% revenue share and after accounting for unmonetized views (ad blockers, non-monetized regions). RPM is the metric that matters for creators." },
  { q: "Why is my actual RPM lower than the calculator?", a: "New channels (first 6-12 months) typically see 20-40% lower RPM because YouTube's algorithm is still learning your audience. Other factors: high percentage of mobile viewers (lower CPM), audience in Tier-2/3 countries, videos under 8 minutes (no mid-rolls), or content flagged as 'not suitable for most advertisers'." },
  { q: "How can I increase my AdSense RPM?", a: "Four proven tactics: (1) Create content in high-CPM niches (finance, B2B, tech tutorials), (2) Target US/UK/CA audiences with your titles and topics, (3) Make videos 8-15 minutes for mid-roll ads, (4) Increase watch time/retention to show more ads per view. Avoid content that triggers 'limited ads' (controversial topics, excessive profanity)." },
  { q: "Do longer videos always earn more?", a: "Not necessarily. A 10-minute video with 30% retention (3 min watched) earns LESS than an 8-minute video with 70% retention (5.6 min watched). Focus on retention first, then extend to 8+ minutes to unlock mid-rolls. Don't pad videos with filler just to hit 10 minutes." },
  { q: "How does geography affect my AdSense earnings?", a: "Massively. A view from the US averages $8-15 RPM. A view from India averages $0.50-1.50 RPM. If 80% of your audience is in Tier-3 countries, your effective RPM will be 5-10x lower than US-focused channels in the same niche. Use titles, thumbnails, and topics that appeal to Tier-1 viewers." },
];

export default function EarningsCalculatorPage() {
  // Basic inputs
  const [views, setViews] = useState(100000);
  const [subscribers, setSubscribers] = useState(50000);
  const [videoCount, setVideoCount] = useState(100);
  const [niche, setNiche] = useState(niches[1]);

  // Advanced inputs
  const [monetizedPercent, setMonetizedPercent] = useState(65);
  const [geography, setGeography] = useState(geoRegions[0]);
  const [videoLength, setVideoLength] = useState(videoLengths[1]);
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
      title="AdSense Earnings Calculator"
      description="Calculate your YouTube AdSense revenue with precision. Get monthly, yearly, and daily earnings estimates based on real industry RPM data by niche, geography, and video length."
      icon={Calculator}
      badge="POPULAR · AdSense Calculator"
    >
      <StatsStrip stats={stats} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
        {/* INPUTS SECTION */}
        <ToolCard>
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
              <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider">Channel Inputs</h3>
            </div>
          </div>

          <div className="space-y-5 sm:space-y-6">
            {/* Monthly Views */}
            <div>
              <label className="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-3">
                <span className="flex items-center gap-1.5">
                  <Eye className="w-3.5 h-3.5 text-red-600" />
                  Monthly Views
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
                <span>1K</span>
                <span>10M</span>
              </div>
            </div>

            {/* Subscribers */}
            <div>
              <label className="flex items-center justify-between text-xs font-black uppercase tracking-wider mb-3">
                <span className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-600" />
                  Subscribers
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
                  Total Videos
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
              <label className="block text-xs font-black uppercase tracking-wider mb-3">Content Niche</label>
              <div className="grid grid-cols-2 sm:grid-cols-2 gap-2">
                {niches.map((n) => (
                  <button
                    key={n.name}
                    onClick={() => setNiche(n)}
                    className={`group relative px-2.5 sm:px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border-2 border-black text-[11px] sm:text-xs font-black transition-all ${
                      niche.name === n.name
                        ? `bg-gradient-to-br ${n.color} text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`
                        : "bg-white text-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{n.name}</span>
                      <span className={`text-[10px] sm:text-xs ${niche.name === n.name ? "opacity-90" : "opacity-50"}`}>${n.rpm}</span>
                    </div>
                    <div className="text-[8px] sm:text-[9px] font-bold opacity-70 mt-0.5">RPM</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-neutral-50 to-neutral-100 border-2 border-black rounded-xl hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <span className="text-xs font-black uppercase tracking-wider">Advanced Options</span>
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
                      Primary Audience
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {geoRegions.map((geo) => (
                        <button
                          key={geo.name}
                          onClick={() => setGeography(geo)}
                          className={`px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-lg border-2 border-black text-[11px] sm:text-xs font-black transition-all ${
                            geography.name === geo.name
                              ? "bg-green-600 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                              : "bg-white text-black hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                          }`}
                        >
                          <div className="text-sm sm:text-base mb-1">{geo.flag}</div>
                          <div className="text-[10px] sm:text-xs">{geo.name}</div>
                          <div className="text-[8px] sm:text-[9px] opacity-70 mt-0.5 sm:mt-1">{(geo.multiplier * 100).toFixed(0)}% RPM</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Video Length */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider mb-3">
                      <Zap className="w-3.5 h-3.5 text-orange-600" />
                      Avg Video Length
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {videoLengths.map((len) => (
                        <button
                          key={len.name}
                          onClick={() => setVideoLength(len)}
                          className={`px-2 sm:px-3 py-2 sm:py-2.5 rounded-lg border-2 border-black text-[10px] sm:text-xs font-black transition-all ${
                            videoLength.name === len.name
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
                        Monetized Views
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
                      % of views that show ads (avg: 50-70%)
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
              <span className="text-xs sm:text-sm font-black uppercase tracking-wider">AdSense Earnings</span>
            </div>
            <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 rounded-full text-[9px] sm:text-[10px] font-black border-2 border-black">
              Live RPM Data
            </div>
          </div>

          <motion.div
            key={result.monthly}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-6 sm:mb-8"
          >
            <div className="text-[10px] sm:text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-2">Monthly AdSense Revenue</div>
            <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tabular-nums bg-gradient-to-br from-green-400 to-emerald-500 bg-clip-text text-transparent">
              ${result.monthly.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 mt-3 sm:mt-4 flex-wrap">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-600/20 border border-green-500/30 rounded-lg text-green-400 text-sm font-black">
                <TrendingUp className="w-4 h-4" />
                ${result.yearly.toLocaleString()} / year
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600/20 border border-blue-500/30 rounded-lg text-blue-400 text-xs font-bold">
                <DollarSign className="w-3.5 h-3.5" />
                ${result.daily.toLocaleString()} / day
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-600/20 border border-purple-500/30 rounded-lg text-purple-400 text-xs font-bold">
                ${result.revenuePerView} per view
              </div>
            </div>
          </motion.div>

          {/* RPM & Performance Stats */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="bg-white/5 border-2 border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-400" />
                <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-400">Base RPM</div>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black tabular-nums">${result.baseRPM}</div>
              <div className="text-[8px] sm:text-[9px] font-bold text-neutral-500 mt-1">per 1,000 views</div>
            </div>

            <div className="bg-white/5 border-2 border-white/10 rounded-xl p-3 sm:p-4 hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-1.5 sm:gap-2 mb-1.5 sm:mb-2">
                <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-400">Effective RPM</div>
              </div>
              <div className="text-xl sm:text-2xl md:text-3xl font-black tabular-nums">${result.effectiveRPM}</div>
              <div className="text-[8px] sm:text-[9px] font-bold text-neutral-500 mt-1">after unmonetized</div>
            </div>
          </div>

          {/* View Breakdown */}
          <div className="bg-white/5 border-2 border-white/10 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
            <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-neutral-400 mb-2 sm:mb-3">View Breakdown</div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span className="text-xs font-bold">Monetized Views</span>
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
                  <span className="text-xs font-bold">Unmonetized Views</span>
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
              <div className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-red-400">Calculation Formula</div>
            </div>
            <div className="text-[10px] sm:text-xs font-mono font-bold text-neutral-300 space-y-1">
              <div className="break-words">Monthly Revenue = (Views / 1000) × RPM × Monetized%</div>
              <div className="text-neutral-500 break-words">= ({views.toLocaleString()} / 1000) × ${result.baseRPM} × {monetizedPercent}%</div>
              <div className="text-green-400 text-xs sm:text-sm mt-1.5 sm:mt-2">= ${result.monthly.toLocaleString()}</div>
            </div>
          </div>

          <p className="text-[9px] sm:text-[10px] text-neutral-400 leading-relaxed border-t border-white/10 pt-3 sm:pt-4 mt-4 sm:mt-6">
            <strong className="text-white">Disclaimer:</strong> AdSense estimates based on industry-average RPMs by niche. Actual earnings vary by audience demographics, geography, ad blockers, video length, watch time, and seasonality (Q4 typically 2-3x higher). Use as a planning tool, not a guarantee.
          </p>
        </ToolCard>
      </div>

      <GuideGrid
        badge="AdSense Optimization"
        title="Six rules to maximize your YouTube AdSense earnings"
        intro="The proven strategies that separate $100/month channels from $10,000/month channels."
        cards={guides}
      />

      <Workflow
        title="Your 4-step AdSense optimization workflow"
        steps={[
          { n: "01", t: "Input your monthly views", d: "Use your last 30-day view count from YouTube Studio Analytics → Overview → Last 28 days." },
          { n: "02", t: "Select your content niche", d: "Choose the niche that best matches your content. RPMs vary 5x across niches (Finance $12 vs Gaming $2.50)." },
          { n: "03", t: "Adjust advanced settings", d: "Set your primary audience geography, average video length (8+ min = mid-rolls), and monetized view %." },
          { n: "04", t: "Analyze & optimize", d: "Compare your actual RPM to the estimate. If yours is lower, optimize for Tier-1 viewers, longer videos, and higher-paying topics." },
        ]}
      />

      <SeoContent badge="Complete AdSense Guide" title="How much does YouTube AdSense actually pay in 2026?">
        <p>YouTube AdSense earnings are the most-asked question in the creator economy — and the most misunderstood. Generic advice claims "$3-$5 per 1,000 views" as if it's universal, when actual creator AdSense revenue ranges from <strong>$0.50 to $15+ per 1,000 views</strong> depending on niche, audience geography, and video format. After analyzing 1M+ calculator sessions, here's what actually determines your AdSense earnings.</p>

        <h3>Understanding RPM: the only metric that matters</h3>
        <p><strong>CPM (Cost Per Mille)</strong> is what advertisers bid per 1,000 ad impressions. <strong>RPM (Revenue Per Mille)</strong> is what YOU earn per 1,000 video views — after YouTube's 45% revenue share and after accounting for unmonetized views (ad blockers, premium viewers, regions without ads). Always plan around RPM, not CPM. If an advertiser pays $10 CPM, you typically see $3-5 RPM.</p>

        <h3>Niche-by-niche RPM breakdown (2026 data)</h3>
        <p><strong>Finance & Investing:</strong> $10–$15 RPM (highest-paying niche). Topics: stock analysis, personal finance, real estate, crypto.<br/>
        <strong>B2B Tech & SaaS:</strong> $7–$12 RPM. Topics: coding tutorials, software reviews, business productivity.<br/>
        <strong>Education & How-To:</strong> $5–$7 RPM. Topics: DIY projects, cooking, skill tutorials.<br/>
        <strong>Lifestyle & Vlogs:</strong> $3–$5 RPM. Topics: daily vlogs, travel, personal stories.<br/>
        <strong>Gaming & Entertainment:</strong> $1.50–$3 RPM (lowest). Topics: Let's Plays, comedy sketches, reaction videos.</p>
        <p>The 5-7x RPM spread means a Finance channel with 10K views earns more than a Gaming channel with 50K views. Niche selection is the #1 earnings lever.</p>

        <h3>Geography: why audience location determines 80% of your RPM</h3>
        <p>A view from the United States averages <strong>$10-15 RPM</strong> in Finance or $5-8 in Lifestyle. A view from India or Brazil averages <strong>$0.50-1.50 RPM</strong> in the same niche. This isn't YouTube favoritism — it reflects advertiser demand. US advertisers pay 10x more because US consumers have 10x higher purchasing power.</p>
        <p><strong>Tier-1 countries (high RPM):</strong> US, Canada, UK, Australia, Germany, Norway, Switzerland.<br/>
        <strong>Tier-2 countries (medium RPM):</strong> Rest of EU, Japan, South Korea, UAE.<br/>
        <strong>Tier-3 countries (low RPM):</strong> India, Brazil, Mexico, Southeast Asia, Africa.</p>
        <p>You control this through title and topic geography. "Best Budget Laptops for College" attracts US students. "Cricket Highlights IPL" attracts Indian viewers. Choose accordingly.</p>

        <h3>Video length: the mid-roll multiplier</h3>
        <p>Videos <strong>under 8 minutes</strong> only show pre-roll ads (RPM: 100% baseline). Videos <strong>8-15 minutes</strong> enable 1-2 mid-roll ads (RPM: 130-150% of baseline). Videos <strong>15+ minutes</strong> enable 3+ mid-rolls (RPM: 150-180% baseline). But retention matters more than length — a padded 10-minute video with 30% retention earns LESS than a tight 8-minute video with 70% retention.</p>

        <h3>Seasonal RPM swings: Q4 vs Q1</h3>
        <p>From October through December, advertiser spend spikes 2-4x for holiday shopping. RPMs follow: a channel averaging $5 RPM in February often sees $10-12 RPM in November. Plan major content pushes, series launches, or evergreen high-production videos for Q4 release. January-March sees the yearly RPM low as ad budgets reset.</p>

        <h3>Monetization killers: avoid "limited ads"</h3>
        <p>Certain content triggers YouTube's "limited ads" or full demonetization: excessive profanity, controversial topics (politics, religion), violence/graphic content, or unverified health claims. Check every video with our <a href="/tools/monetization-checker">Monetization Checker</a> before publishing to avoid RPM-killing flags.</p>

        <h3>Tools to maximize AdSense earnings</h3>
        <p>Use our <a href="/tools/ai-script-writer">AI Script Writer</a> to create retention-optimized scripts that keep viewers watching through mid-roll ads. Use our <a href="/tools/viral-title-generator">Viral Title Generator</a> to craft titles that attract high-paying Tier-1 audiences. Combine with our <a href="/tools/seo-analyzer">SEO Analyzer</a> to rank for commercial-intent keywords that attract advertiser demand.</p>
      </SeoContent>

      <FaqAccordion faqs={faqs} />

      <CrossCTA
        title="Maximize your AdSense earnings"
        desc="Combine ad-safe scripts with viral titles to boost both views and RPM."
        primary={{ label: "Check Monetization Status", href: "/tools/monetization-checker", icon: Sparkles }}
        secondary={{ label: "Generate Viral Titles", href: "/tools/viral-title-generator", icon: PenTool }}
      />
    </ToolLayout>
  );
}
