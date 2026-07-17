"use client";

import { friendlyApiError } from "@/lib/apiError";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  DollarSign,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Loader2,
  Youtube,
  Users,
  Eye,
  Video as VideoIcon,
  Calendar,
  Globe,
  Link as LinkIcon,
  TrendingUp,
  Award,
  PenTool,
  BarChart3,
  ShieldCheck,
  Zap,
  Lightbulb,
  Hash,
  MapPin,
  Ban,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadialBarChart, RadialBar, PolarAngleAxis, Cell,
} from "recharts";
import { ToolLayout, ToolCard, PrimaryButton } from "@/components/tools/ToolLayout";
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import { StatsStrip, GuideGrid, Workflow, SeoContent, FaqAccordion, CrossCTA } from "@/components/tools/ToolSections";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.ytforge.app";

type Logo = { default?: string; medium?: string; high?: string };

type MonetizationData = {
  channelId: string;
  title: string;
  description: string;
  customUrl: string | null;
  handle: string | null;
  publishedAt: string;
  country: string | null;
  countryName?: string | null;
  branding: {
    logo: Logo;
    bannerImage: string | null;
  };
  channelAnalysis: {
    niche: string;
    nicheCpm: { low: number; high: number; avg: number };
    uploadFrequency: string;
    averageVideosPerMonth: number;
    channelAge: { months: number; years: number; since: string };
    madeForKids: boolean;
    isContentOwner: boolean;
  };
  statistics: {
    subscriberCount: number;
    totalViews: number;
    videoCount: number;
    hiddenSubscriberCount: boolean;
    formattedSubs: string;
    formattedViews: string;
  };
  regionInfo: {
    countryCode: string;
    countryName: string;
    isRestricted: boolean;
    restrictionNote: string;
    cpmMultiplier: number;
  };
  monetization: {
    status: "LIKELY_MONETIZED" | "NOT_MONETIZED" | "RESTRICTED" | "RESTRICTED_REGION" | string;
    confidence: "high" | "medium" | string;
    eligibilityScore: number;
    yppEligibility: boolean;
    requirements: {
      subscribers: { required: number; current: number; met: boolean; progressPercent: number };
      watchHours: { required: number; estimated: number; met: boolean; progressPercent: number };
      content: { required: number; current: number; met: boolean };
      region: { countryName: string; restricted: boolean; met: boolean };
      contentType: { isMadeForKids: boolean; met: boolean };
    };
    rejectionReasons: string[] | null;
    analysis: {
      estimatedLifetimeWatchHours: string;
      estimatedWatchHoursRaw: number;
      averageVideoDurationMinutes: number;
      recentVideoWatchHours: string;
      videosAnalyzed: number;
    };
    estimatedEarnings: {
      currency: string;
      niche: string;
      cpmRange: { low: number; high: number; avg: number };
      rpmEstimate: number;
      estimatedMonthlyRange: { low: number; high: number };
      estimatedMonthly: number;
      estimatedYearly: number;
      basis: string;
    } | null;
  };
  recentUploads: {
    rank: number;
    title: string;
    views: number;
    likes: number;
    comments: number;
    engagementRate: string;
    estimatedDurationMinutes: number;
  }[];
  recommendations: string[];
};

const stats = [
  { value: "1.2M+", label: "Channels Checked" },
  { value: "98%", label: "Accuracy Rate" },
  { value: "190+", label: "Countries" },
  { value: "Live", label: "YouTube Data" },
];

const guides = [
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "1,000 subscribers minimum", desc: "YPP requires at least 1,000 subscribers before you can apply for monetization." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "4,000 watch hours OR 10M Shorts views", desc: "Hit 4,000 valid public watch hours in 12 months, OR 10 million Shorts views in 90 days." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Follow community guidelines", desc: "No active strikes, no copyright issues. Clean record for the past 90 days." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Reused / low-effort content", desc: "Compilation channels, AI-only voiceovers, and reaction-only content are routinely rejected." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Inactive country", desc: "Monetization isn't available in every region. You must be in a YPP-eligible country." },
  { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100", title: "Linked AdSense required", desc: "You'll need a verified AdSense account in your name to receive payments." },
];

const faqs = [
  { q: "Can I really check any channel's monetization status?", a: "We estimate monetization status based on YouTube's public requirements (subscribers, watch time, country, channel age) plus signals like ad presence and channel age. Actual YPP status is private to the creator, so this is an educated estimate — not a confirmed verdict." },
  { q: "What's the minimum to qualify for YouTube monetization?", a: "1,000 subscribers + 4,000 valid public watch hours (in the past 12 months) OR 10 million Shorts views (in the past 90 days). You must also live in a YPP-eligible country and follow YouTube's community guidelines." },
  { q: "Why does my channel show \"Eligible but Not Monetized\"?", a: "You meet YouTube's thresholds but haven't applied to the Partner Program yet, OR your application is pending review. Apply inside YouTube Studio → Earn." },
  { q: "How long does YPP review take?", a: "Most applications are reviewed within 1-4 weeks. If you're rejected, you can re-apply 30 days later — focus on adding original content during that window." },
  { q: "Does this tool work for YouTube Shorts channels?", a: "Yes. Shorts-only channels qualify via the 10M views in 90 days path." },
];

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return Math.round(n).toLocaleString();
}

function fmtMoney(n: number): string {
  if (!Number.isFinite(n)) return "$0";
  if (n >= 1_000_000) return "$" + (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return "$" + (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return "$" + Math.round(n).toLocaleString();
}

function formatJoined(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function countryToFlag(code?: string | null) {
  if (!code || code.length !== 2) return "";
  return String.fromCodePoint(...code.toUpperCase().split("").map((c) => 0x1f1a5 + c.charCodeAt(0)));
}

type StatusInfo = {
  cardBg: string;
  cardBorder: string;
  badgeBg: string;
  shadowColor: string;
  label: string;
  icon: typeof CheckCircle2;
  desc: string;
};

function getStatusInfo(status: string): StatusInfo {
  const s = (status || "").toUpperCase();
  if (s === "LIKELY_MONETIZED") {
    return {
      cardBg: "bg-green-50",
      cardBorder: "border-green-600",
      badgeBg: "bg-green-500",
      shadowColor: "rgba(22,163,74,1)",
      label: "Likely Monetized",
      icon: CheckCircle2,
      desc: "This channel meets all YPP thresholds and shows signals consistent with active ad revenue.",
    };
  }
  if (s === "RESTRICTED_REGION") {
    return {
      cardBg: "bg-red-50",
      cardBorder: "border-red-600",
      badgeBg: "bg-red-600",
      shadowColor: "rgba(220,38,38,1)",
      label: "Restricted Region",
      icon: Ban,
      desc: "YPP is not available in this channel's country. Monetization is blocked regardless of stats.",
    };
  }
  if (s === "RESTRICTED") {
    return {
      cardBg: "bg-yellow-50",
      cardBorder: "border-yellow-500",
      badgeBg: "bg-yellow-500",
      shadowColor: "rgba(234,179,8,1)",
      label: "Restricted",
      icon: AlertTriangle,
      desc: "Limited monetization due to channel settings — typically Made for Kids or content type restrictions.",
    };
  }
  return {
    cardBg: "bg-orange-50",
    cardBorder: "border-orange-500",
    badgeBg: "bg-orange-500",
    shadowColor: "rgba(249,115,22,1)",
    label: "Not Monetized",
    icon: XCircle,
    desc: "This channel does not currently meet YouTube Partner Program requirements.",
  };
}

export default function MonetizationCheckerPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<MonetizationData | null>(null);
  const [bannerFailed, setBannerFailed] = useState(false);

  const run = async (val?: string) => {
    const v = (val ?? input).trim();
    if (!v || loading) return;
    if (val !== undefined) setInput(val);
    setLoading(true);
    setError(null);
    setData(null);
    setBannerFailed(false);
    try {
      const res = await fetch(`${BASE_URL}/api/monetization`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: v }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(friendlyApiError(body?.error || "", res.status));
      }
      setData(body.data as MonetizationData);
    } catch (err: any) {
      setError(friendlyApiError(err?.message || "", 0));
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ["@MrBeast", "@MarquesBrownlee", "@AliAbdaal", "@PewDiePie", "@TheVerge"];

  return (
    <ToolLayout
      title="YouTube Channel Monetization Checker"
      description="Paste any YouTube channel link, video, or @handle to instantly check if it's monetized — eligibility score, YPP requirements, niche CPM, and full earnings estimate."
      icon={DollarSign}
      badge="Channel Monetization · Live YouTube Data"
    >
      <StatsStrip stats={stats} />

      {/* Search Input */}
      <ToolCard className="mb-6">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-3">
          <Youtube className="w-4 h-4 text-red-600" /> YouTube URL, channel, or @handle
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] transition-shadow">
            <LinkIcon className="w-4 h-4 text-red-600 shrink-0" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="https://youtube.com/@MrBeast  or  @MrBeast"
              className="flex-1 py-3 outline-none text-sm font-medium bg-transparent min-w-0"
            />
          </div>
          <PrimaryButton onClick={() => run()} disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <DollarSign className="w-4 h-4" />}
            {loading ? "Checking..." : "Check Channel"}
          </PrimaryButton>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-wider">Try:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              onClick={() => run(s)}
              className="text-[11px] font-black px-2.5 py-1 rounded-full border-2 border-black bg-white text-black hover:bg-red-600 hover:text-white transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      </ToolCard>

      {/* Loading */}
      {loading && <SkeletonReport />}

      {/* Error */}
      {error && !loading && (
        <ToolCard className="mb-12 sm:mb-16 border-red-600">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="font-black text-sm text-black">Couldn't check this channel</div>
              <div className="text-xs font-medium text-neutral-600 mt-1 break-words">{error}</div>
            </div>
          </div>
        </ToolCard>
      )}

      {/* Report */}
      <AnimatePresence>
        {data && !loading && (
          <motion.div
            key={data.channelId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16 space-y-5"
          >
            <ChannelHeroCard data={data} bannerFailed={bannerFailed} onBannerFail={() => setBannerFailed(true)} />

            <StatusCard data={data} />

            {/* Score + Requirements */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-2">
                <ScoreGauge score={data.monetization.eligibilityScore} confidence={data.monetization.confidence} />
              </div>
              <div className="lg:col-span-3">
                <RequirementsChecklist data={data} />
              </div>
            </div>

            <ChannelAnalysisGrid data={data} />

            {/* Stats + Region */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
              <div className="lg:col-span-3">
                <StatisticsRow data={data} />
              </div>
              <div className="lg:col-span-2">
                <RegionCard data={data} />
              </div>
            </div>

            {/* YPP Requirements Radial Chart */}
            <YPPRequirementsChart data={data} />

            {data.monetization.estimatedEarnings && <EarningsCard data={data} />}
            {data.monetization.estimatedEarnings && <EarningsBarChart data={data} />}

            {data.recentUploads?.length > 0 && <UploadsViewsChart uploads={data.recentUploads} />}
            {data.recentUploads?.length > 0 && <RecentUploadsTable uploads={data.recentUploads} />}

            {data.recommendations?.length > 0 && <RecommendationsList items={data.recommendations} />}
          </motion.div>
        )}
      </AnimatePresence>

      {!data && !loading && !error && <div className="mb-12 sm:mb-16" />}

      <GuideGrid
        badge="YPP Requirements"
        title="What YouTube actually requires for monetization"
        intro="The full checklist YouTube uses to approve or reject Partner Program applications in 2026."
        cards={guides}
      />

      <Workflow
        title="Your 4-step monetization workflow"
        steps={[
          { n: "01", t: "Paste channel link", d: "Drop in any YouTube channel URL or @handle — yours or a competitor's." },
          { n: "02", t: "Read the report", d: "See subscribers, watch hours, country, and YPP eligibility status." },
          { n: "03", t: "Identify the gap", d: "If not eligible, the report shows exactly which threshold is missing." },
          { n: "04", t: "Apply or grow", d: "If eligible, apply inside YouTube Studio → Earn. If not, plan content to close the gap." },
        ]}
      />

      <SeoContent badge="Complete Monetization Guide" title="The complete guide to YouTube channel monetization in 2026">
        <p>YouTube monetization is the gateway to earning a real income from your content. Our YouTube Channel Monetization Checker pulls public data from any channel, runs it against the latest YouTube Partner Program (YPP) rules, and returns a clear verdict in seconds — including an eligibility score, niche-specific CPM, regional multipliers, and a full earnings estimate.</p>

        <h3>What is YouTube monetization?</h3>
        <p>YouTube monetization means your channel is approved into the <strong>YouTube Partner Program (YPP)</strong> and can earn revenue through ads, channel memberships, Super Chats, Super Thanks, the merch shelf, and YouTube Premium revenue share.</p>

        <h3>The 2026 YPP requirements</h3>
        <p>To be eligible: <strong>1,000+ subscribers</strong>, <strong>4,000+ valid public watch hours</strong> (12 mo) OR <strong>10M Shorts views</strong> (90 days), a verified <strong>AdSense account</strong>, residency in a <strong>YPP-eligible country</strong>, and a <strong>clean record</strong> with no active strikes.</p>

        <h3>How niche and region change everything</h3>
        <p>Two channels with identical view counts can earn 5–10x different amounts depending on niche. Finance, tech, and B2B niches earn $6–$15 CPM; gaming and entertainment earn $1.50–$3 CPM. Region adds another multiplier — US/UK/CA/AU traffic pays the most.</p>

        <h3>Beyond AdSense</h3>
        <p>Top creators earn 60–80% of their income from <strong>sponsorships</strong>, <strong>memberships</strong>, <strong>merch</strong>, <strong>affiliates</strong>, and <strong>digital products</strong>. Use our <a href="/tools/earnings-calculator">Earnings Calculator</a> to project your full revenue potential.</p>
      </SeoContent>

      <FaqAccordion faqs={faqs} />

      <CrossCTA
        title="Maximize your channel revenue"
        desc="Once you're monetized, calculate your potential earnings and pair high-CTR content with ad-safe scripts."
        primary={{ label: "Calculate Earnings", href: "/tools/earnings-calculator", icon: DollarSign }}
        secondary={{ label: "Write Script", href: "/tools/ai-script-writer", icon: PenTool }}
      />
          <ToolSeoJsonLd
        name="YouTube Monetization Checker"
        description={"Check any channel monetization status, YPP eligibility, and estimated ad-revenue tier in seconds."}
        slug="monetization-checker"
        faqs={faqs}
        breadcrumb={[
          { name: "Home", slug: "/" },
          { name: "Tools", slug: "/tools" },
          { name: "YouTube Monetization Checker", slug: "/tools/monetization-checker" },
        ]}
      />
</ToolLayout>
  );
}

/* ----------------- Sub Components ----------------- */

function SkeletonReport() {
  return (
    <ToolCard className="mb-12 sm:mb-16">
      <div className="flex flex-col items-center justify-center py-10 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-red-600" />
        <div className="text-xs font-black uppercase tracking-wider text-neutral-600">Pulling channel + 50 recent videos...</div>
        <div className="w-full max-w-md space-y-2">
          <div className="h-3 rounded-full bg-neutral-200 animate-pulse" />
          <div className="h-3 rounded-full bg-neutral-200 animate-pulse w-5/6" />
          <div className="h-3 rounded-full bg-neutral-200 animate-pulse w-4/6" />
        </div>
      </div>
    </ToolCard>
  );
}

function ChannelHeroCard({
  data,
  bannerFailed,
  onBannerFail,
}: {
  data: MonetizationData;
  bannerFailed: boolean;
  onBannerFail: () => void;
}) {
  const avatar = data.branding.logo?.high || data.branding.logo?.medium || data.branding.logo?.default || null;
  const handleStr = data.handle?.replace(/^@@/, "@") || (data.customUrl ? (data.customUrl.startsWith("@") ? data.customUrl : "@" + data.customUrl) : "");
  const flag = countryToFlag(data.country || data.regionInfo?.countryCode);
  const countryName = data.countryName || data.regionInfo?.countryName || data.country;
  const s = data.statistics;

  const quickStats = [
    { icon: Users, label: "Subscribers", value: s.hiddenSubscriberCount ? "Hidden" : fmt(s.subscriberCount) },
    { icon: Eye, label: "Total Views", value: fmt(s.totalViews) },
    { icon: VideoIcon, label: "Videos", value: fmt(s.videoCount) },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white border-2 border-black rounded-2xl sm:rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
    >
      {/* ── Banner ── */}
      <div className="relative w-full h-32 sm:h-40 md:h-52 overflow-hidden">
        {data.branding.bannerImage && !bannerFailed ? (
          <>
            {/* Blurred background fill */}
            <div
              className="absolute inset-0 scale-110 blur-xl opacity-60"
              style={{ backgroundImage: `url(${data.branding.bannerImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
            />
            <motion.img
              initial={{ scale: 1.08 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              src={data.branding.bannerImage}
              alt={`${data.title} banner`}
              onError={onBannerFail}
              className="absolute inset-0 w-full h-full object-cover object-center"
              loading="eager"
            />
          </>
        ) : (
          /* Fallback: YTForge branded animated banner */
          <motion.div
            animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(135deg, #dc2626, #7f1d1d, #18181b, #b91c1c, #dc2626)",
              backgroundSize: "300% 300%",
            }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(45deg,rgba(0,0,0,0.3)_1px,transparent_1px)] bg-[size:28px_28px]" />
            {/* Glow blobs */}
            <div className="absolute -top-10 -left-10 w-40 h-40 sm:w-52 sm:h-52 rounded-full bg-red-500/40 blur-3xl" />
            <div className="absolute -bottom-12 -right-8 w-44 h-44 sm:w-56 sm:h-56 rounded-full bg-orange-500/30 blur-3xl" />
            {/* Center YTForge logo lockup */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 sm:gap-2 px-4 text-center">
              <div className="flex items-center gap-2 sm:gap-3">
                <Youtube className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.6)]" />
                <span className="font-black text-2xl sm:text-4xl md:text-5xl tracking-tight text-white drop-shadow-[3px_3px_6px_rgba(0,0,0,0.6)]">
                  YT<span className="text-red-300">Forge</span>
                </span>
              </div>
              <span className="text-[9px] sm:text-[11px] md:text-xs font-bold uppercase tracking-[0.25em] text-white/70">
                AI-Powered YouTube Creator Toolkit
              </span>
            </div>
          </motion.div>
        )}
        {/* Bottom gradient for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
      </div>

      {/* ── Profile section ── */}
      <div className="relative bg-black px-4 sm:px-6 pt-6 sm:pt-7 pb-5 sm:pb-6">
        {/* Avatar + identity. Centered on mobile, row on sm+.
            No negative margin — avatar sits cleanly below the banner. */}
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center items-center gap-4 sm:gap-5">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 280, damping: 20, delay: 0.15 }}
            className="shrink-0 relative self-center sm:self-center"
          >
            {avatar ? (
              <img
                src={avatar}
                alt={data.title}
                className="w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl border-4 border-red-600 shadow-[0_0_0_2px_#000] object-cover bg-white"
              />
            ) : (
              <div className="w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-2xl border-4 border-red-600 shadow-[0_0_0_2px_#000] bg-gradient-to-br from-red-600 to-red-800 text-white flex items-center justify-center font-black text-3xl sm:text-3xl">
                {data.title.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Live pulse dot */}
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-black flex items-center justify-center">
              <span className="absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 animate-ping" />
            </span>
          </motion.div>

          {/* Name + handle + meta */}
          <motion.div
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.45, delay: 0.25 }}
            className="flex-1 min-w-0 pt-2 sm:pt-0 pb-1 text-center sm:text-center"
          >
            <div className="text-white font-black text-lg sm:text-2xl md:text-3xl leading-tight break-words sm:truncate">{data.title}</div>
            {handleStr && (
              <div className="text-red-500 font-bold text-xs sm:text-sm break-all sm:truncate mt-0.5">{handleStr}</div>
            )}
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 mt-2">
              {countryName && (
                <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-neutral-400">
                  {flag ? <span className="text-sm leading-none">{flag}</span> : <Globe className="w-3 h-3" />}
                  {countryName}
                </span>
              )}
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-bold text-neutral-400">
                <Calendar className="w-3 h-3" /> {formatJoined(data.publishedAt)}
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-600/20 border border-red-600/40 text-[10px] font-black text-red-400 uppercase tracking-wide">
                <Award className="w-2.5 h-2.5" /> {data.channelAnalysis.niche}
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── Quick stats strip ── */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.38 }}
          className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-5"
        >
          {quickStats.map((st, i) => (
            <motion.div
              key={st.label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: 0.45 + i * 0.08 }}
              className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 text-center hover:bg-white/10 hover:border-red-600/40 transition-colors"
            >
              <st.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500 mx-auto mb-1.5" />
              <div className="text-white font-black text-sm sm:text-base md:text-lg tabular-nums leading-none">{st.value}</div>
              <div className="text-[9px] sm:text-[10px] font-bold text-neutral-500 uppercase tracking-wider mt-1">{st.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.div>
  );
}

function StatusCard({ data }: { data: MonetizationData }) {
  const info = getStatusInfo(data.monetization.status);
  const Icon = info.icon;
  const earnings = data.monetization.estimatedEarnings;
  const subs = data.monetization.requirements.subscribers;
  const hours = data.monetization.requirements.watchHours;

  return (
    <div
      className={`${info.cardBg} border-2 ${info.cardBorder} rounded-2xl p-5 sm:p-6`}
      style={{ boxShadow: `4px 4px 0px 0px ${info.shadowColor}` }}
    >
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className={`${info.badgeBg} text-white w-14 h-14 rounded-xl border-2 border-black flex items-center justify-center shrink-0`}>
          <Icon className="w-7 h-7" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-xl sm:text-2xl text-black">{info.label}</div>
          <div className="text-xs font-bold text-neutral-700 uppercase tracking-wider mt-0.5">
            {data.monetization.confidence} confidence
          </div>
          <p className="text-sm text-neutral-700 leading-relaxed mt-1">{info.desc}</p>
        </div>
        {data.monetization.status === "LIKELY_MONETIZED" && earnings && (
          <div className="bg-black text-white rounded-xl border-2 border-black p-4 shrink-0">
            <div className="text-[10px] font-black text-neutral-400 uppercase tracking-wider">Est. Monthly</div>
            <div className="text-2xl font-black tabular-nums">
              {fmtMoney(earnings.estimatedMonthlyRange.low)}<span className="text-red-500">–</span>{fmtMoney(earnings.estimatedMonthlyRange.high)}
            </div>
            <div className="text-[10px] font-bold text-red-500 mt-1">{fmtMoney(earnings.estimatedYearly)} / year</div>
          </div>
        )}
      </div>

      {/* Progress bars for NOT_MONETIZED */}
      {data.monetization.status === "NOT_MONETIZED" && (
        <div className="mt-5 space-y-4">
          <ProgressRow
            label="Subscribers"
            pass={subs.met}
            current={fmt(subs.current)}
            target={fmt(subs.required)}
            percent={subs.progressPercent}
          />
          <ProgressRow
            label="Watch Hours (12 mo est.)"
            pass={hours.met}
            current={fmt(hours.estimated)}
            target={fmt(hours.required)}
            percent={hours.progressPercent}
          />
        </div>
      )}

      {/* Rejection reasons */}
      {data.monetization.rejectionReasons && data.monetization.rejectionReasons.length > 0 && (
        <div className="mt-4 p-4 rounded-xl border-2 border-black bg-white">
          <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">Why it's not monetized</div>
          <ul className="space-y-1.5">
            {data.monetization.rejectionReasons.map((r, i) => (
              <li key={i} className="flex items-start gap-2 text-sm font-medium text-neutral-800">
                <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ScoreGauge({ score, confidence }: { score: number; confidence: string }) {
  const pct = Math.max(0, Math.min(100, score));
  const r = 52;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color = pct >= 80 ? "#16a34a" : pct >= 50 ? "#f97316" : "#dc2626";

  return (
    <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 h-full">
      <h3 className="font-black text-base text-black mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-red-600" /> Eligibility Score
      </h3>
      <div className="flex flex-col items-center justify-center">
        <div className="relative w-36 h-36">
          <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
            <circle cx="60" cy="60" r={r} stroke="#e5e5e5" strokeWidth="12" fill="none" />
            <circle
              cx="60"
              cy="60"
              r={r}
              stroke={color}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={circ}
              strokeDashoffset={offset}
              style={{ transition: "stroke-dashoffset 1s ease-out" }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-black tabular-nums text-black">{pct}</div>
            <div className="text-[9px] font-black uppercase tracking-wider text-neutral-500">/ 100</div>
          </div>
        </div>
        <div className="mt-3 text-xs font-black uppercase tracking-wider text-neutral-600">{confidence} confidence</div>
      </div>
    </div>
  );
}

function RequirementsChecklist({ data }: { data: MonetizationData }) {
  const r = data.monetization.requirements;
  const items = [
    { label: "1,000+ Subscribers", met: r.subscribers.met, value: `${fmt(r.subscribers.current)} / ${fmt(r.subscribers.required)}` },
    { label: "4,000+ Watch Hours", met: r.watchHours.met, value: `${fmt(r.watchHours.estimated)} / ${fmt(r.watchHours.required)}` },
    { label: "Content Count", met: r.content.met, value: `${fmt(r.content.current)} / ${fmt(r.content.required)} videos` },
    { label: "Eligible Region", met: r.region.met, value: r.region.restricted ? "Restricted" : r.region.countryName },
    { label: "Standard Audience", met: r.contentType.met, value: r.contentType.isMadeForKids ? "Made for Kids" : "OK" },
  ];
  return (
    <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 h-full">
      <h3 className="font-black text-base text-black mb-4 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-red-600" /> YPP Requirements
      </h3>
      <div className="space-y-2.5">
        {items.map((it) => (
          <div key={it.label} className="flex items-center justify-between gap-3 p-3 rounded-xl border-2 border-black bg-white">
            <div className="flex items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center shrink-0 ${it.met ? "bg-green-500 text-white" : "bg-red-600 text-white"}`}>
                {it.met ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
              </div>
              <span className="font-black text-sm text-black truncate">{it.label}</span>
            </div>
            <span className="text-xs font-black tabular-nums text-neutral-600 shrink-0 truncate max-w-[40%]">{it.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChannelAnalysisGrid({ data }: { data: MonetizationData }) {
  const a = data.channelAnalysis;
  const items = [
    { icon: Hash, label: "Niche", value: a.niche, sub: `CPM $${a.nicheCpm.low}–$${a.nicheCpm.high}` },
    { icon: TrendingUp, label: "Upload Frequency", value: a.uploadFrequency, sub: `${a.averageVideosPerMonth.toFixed(1)} videos/mo` },
    { icon: Calendar, label: "Channel Age", value: `${a.channelAge.years.toFixed(1)} yrs`, sub: `${a.channelAge.months} months` },
    { icon: VideoIcon, label: "Avg Videos / Mo", value: a.averageVideosPerMonth.toFixed(1), sub: a.uploadFrequency },
  ];

  return (
    <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6">
      <h3 className="font-black text-base text-black mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-red-600" /> Channel Analysis
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map((it) => (
          <div key={it.label} className="p-4 rounded-xl border-2 border-black bg-neutral-50">
            <div className="flex items-center gap-1.5 text-[10px] font-black text-neutral-500 uppercase tracking-wider mb-1">
              <it.icon className="w-3 h-3" /> {it.label}
            </div>
            <div className="text-base sm:text-lg font-black text-black capitalize truncate">{it.value}</div>
            <div className="text-[10px] font-bold text-neutral-500 mt-0.5 truncate">{it.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatisticsRow({ data }: { data: MonetizationData }) {
  const s = data.statistics;
  const a = data.channelAnalysis;

  const avgViewsPerVideo = s.videoCount > 0
    ? Math.round(s.totalViews / s.videoCount)
    : 0;

  const items = [
    {
      icon: Users,
      label: "Subscribers",
      value: s.hiddenSubscriberCount ? "Hidden" : fmt(s.subscriberCount),
      sub: s.hiddenSubscriberCount ? "Private" : "Public count",
      accent: "text-red-500",
      bg: "bg-red-600",
    },
    {
      icon: Eye,
      label: "Total Views",
      value: fmt(s.totalViews),
      sub: `~${fmt(avgViewsPerVideo)} per video`,
      accent: "text-blue-400",
      bg: "bg-blue-600",
    },
    {
      icon: VideoIcon,
      label: "Videos",
      value: fmt(s.videoCount),
      sub: `${a.averageVideosPerMonth.toFixed(1)}/mo avg`,
      accent: "text-emerald-400",
      bg: "bg-emerald-600",
    },
  ];

  return (
    <div className="bg-black border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] p-4 sm:p-6 h-full">
      <h3 className="font-black text-sm sm:text-base text-white mb-4 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-red-500" /> Channel Statistics
      </h3>

      <div className="flex flex-col gap-2 sm:gap-3">
        {items.map((it, i) => (
          <motion.div
            key={it.label}
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.35, delay: i * 0.1 }}
            className="flex items-center gap-3 p-3 sm:p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors"
          >
            {/* Icon pill */}
            <div className={`${it.bg} w-9 h-9 sm:w-10 sm:h-10 rounded-xl border-2 border-white/20 flex items-center justify-center shrink-0`}>
              <it.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>

            {/* Label + sub */}
            <div className="flex-1 min-w-0">
              <div className={`text-[10px] sm:text-[11px] font-black uppercase tracking-wider ${it.accent}`}>{it.label}</div>
              <div className="text-[10px] text-neutral-500 font-bold truncate">{it.sub}</div>
            </div>

            {/* Value */}
            <div className="text-white font-black text-lg sm:text-xl md:text-2xl tabular-nums shrink-0">
              {it.value}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function RegionCard({ data }: { data: MonetizationData }) {
  const r = data.regionInfo;
  const flag = countryToFlag(r.countryCode);
  return (
    <div className={`bg-white border-2 ${r.isRestricted ? "border-red-600" : "border-black"} rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 h-full`}>
      <h3 className="font-black text-base text-black mb-4 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-red-600" /> Region
      </h3>
      <div className="flex items-center gap-3">
        {flag && <div className="text-4xl leading-none">{flag}</div>}
        <div className="min-w-0">
          <div className="font-black text-lg text-black truncate">{r.countryName}</div>
          <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500">{r.countryCode}</div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="p-3 rounded-xl border-2 border-black bg-neutral-50">
          <div className="text-[9px] font-black uppercase tracking-wider text-neutral-500">CPM Multiplier</div>
          <div className="text-lg font-black tabular-nums text-black">{r.cpmMultiplier.toFixed(2)}×</div>
        </div>
        <div className={`p-3 rounded-xl border-2 border-black ${r.isRestricted ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
          <div className="text-[9px] font-black uppercase tracking-wider opacity-80">Status</div>
          <div className="text-sm font-black truncate">{r.isRestricted ? "Restricted" : "Eligible"}</div>
        </div>
      </div>
      <p className="text-[11px] text-neutral-500 mt-3 leading-relaxed">{r.restrictionNote}</p>
    </div>
  );
}

function EarningsCard({ data }: { data: MonetizationData }) {
  const e = data.monetization.estimatedEarnings!;
  return (
    <div
      className="bg-black text-white rounded-2xl border-2 border-black p-5 sm:p-6"
      style={{ boxShadow: "4px 4px 0px 0px rgba(220,38,38,1)" }}
    >
      <h3 className="font-black text-base mb-4 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-red-500" /> Estimated Earnings
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="p-4 rounded-xl border-2 border-white bg-red-600">
          <div className="text-[10px] font-black uppercase tracking-wider opacity-90">Monthly Range</div>
          <div className="text-xl font-black tabular-nums break-words">
            {fmtMoney(e.estimatedMonthlyRange.low)}–{fmtMoney(e.estimatedMonthlyRange.high)}
          </div>
        </div>
        <div className="p-4 rounded-xl border-2 border-white bg-white text-black">
          <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Est. Monthly</div>
          <div className="text-xl font-black tabular-nums">{fmtMoney(e.estimatedMonthly)}</div>
        </div>
        <div className="p-4 rounded-xl border-2 border-white bg-white text-black">
          <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Est. Yearly</div>
          <div className="text-xl font-black tabular-nums">{fmtMoney(e.estimatedYearly)}</div>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Pill label="Niche" value={e.niche} />
        <Pill label="CPM Range" value={`$${e.cpmRange.low}–$${e.cpmRange.high}`} />
        <Pill label="RPM Estimate" value={`$${e.rpmEstimate.toFixed(2)}`} />
      </div>
      <p className="text-[10px] text-neutral-400 mt-4 leading-relaxed">* {e.basis}</p>
    </div>
  );
}

function Pill({ label, value }: { label: string; value: string }) {
  return (
    <div className="px-3 py-2 rounded-lg border-2 border-white bg-black/40">
      <div className="text-[9px] font-black uppercase tracking-wider text-neutral-400">{label}</div>
      <div className="text-sm font-black truncate capitalize">{value}</div>
    </div>
  );
}

function RecentUploadsTable({ uploads }: { uploads: MonetizationData["recentUploads"] }) {
  return (
    <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="p-5 sm:p-6 pb-3">
        <h3 className="font-black text-base text-black flex items-center gap-2">
          <VideoIcon className="w-5 h-5 text-red-600" /> Recent Uploads
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-black text-white">
            <tr>
              <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider">#</th>
              <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-wider">Title</th>
              <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-wider">Views</th>
              <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-wider hidden sm:table-cell">Likes</th>
              <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-wider hidden md:table-cell">Comments</th>
              <th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-wider">ER</th>
            </tr>
          </thead>
          <tbody>
            {uploads.slice(0, 10).map((u, i) => (
              <tr key={u.rank} className={i % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                <td className="px-4 py-3 font-black text-red-600 tabular-nums">{u.rank}</td>
                <td className="px-4 py-3 font-bold text-black max-w-xs truncate" title={u.title}>{u.title}</td>
                <td className="px-4 py-3 text-right font-bold tabular-nums">{fmt(u.views)}</td>
                <td className="px-4 py-3 text-right font-bold tabular-nums hidden sm:table-cell">{fmt(u.likes)}</td>
                <td className="px-4 py-3 text-right font-bold tabular-nums hidden md:table-cell">{fmt(u.comments)}</td>
                <td className="px-4 py-3 text-right font-black tabular-nums text-green-600">{u.engagementRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function RecommendationsList({ items }: { items: string[] }) {
  return (
    <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6">
      <h3 className="font-black text-base text-black mb-4 flex items-center gap-2">
        <Lightbulb className="w-5 h-5 text-red-600" /> Recommendations
      </h3>
      <ul className="space-y-2.5">
        {items.map((r, i) => (
          <li key={i} className="flex items-start gap-3 p-3 rounded-xl border-2 border-black bg-neutral-50">
            <div className="w-7 h-7 rounded-lg bg-red-600 text-white border-2 border-black flex items-center justify-center shrink-0 font-black text-xs tabular-nums">
              {i + 1}
            </div>
            <span className="text-sm font-medium text-neutral-800 leading-relaxed">{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── NEW GRAPH COMPONENTS ───────────────────────────────────────────────────

function YPPRequirementsChart({ data }: { data: MonetizationData }) {
  const r = data.monetization.requirements;
  const items = [
    {
      label: "Subscribers",
      current: r.subscribers.current,
      required: r.subscribers.required,
      pct: Math.min(100, r.subscribers.progressPercent),
      met: r.subscribers.met,
      display: `${fmt(r.subscribers.current)} / ${fmt(r.subscribers.required)}`,
    },
    {
      label: "Watch Hours",
      current: r.watchHours.estimated,
      required: r.watchHours.required,
      pct: Math.min(100, r.watchHours.progressPercent),
      met: r.watchHours.met,
      display: `${fmt(r.watchHours.estimated)} / ${fmt(r.watchHours.required)}h`,
    },
    {
      label: "Videos",
      current: r.content.current,
      required: r.content.required,
      pct: r.content.current >= r.content.required ? 100 : Math.round((r.content.current / r.content.required) * 100),
      met: r.content.met,
      display: `${r.content.current} / ${r.content.required}`,
    },
  ];

  const radialData = items.map((it) => ({
    name: it.label,
    value: it.pct,
    fill: it.met ? "#16a34a" : it.pct >= 60 ? "#f97316" : "#dc2626",
  }));

  return (
    <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6">
      <h3 className="font-black text-base text-black mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-red-600" /> YPP Progress Overview
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">

        {/* Radial chart */}
        <div className="flex items-center justify-center">
          <div className="relative w-full max-w-[260px]">
            <ResponsiveContainer width="100%" height={220}>
              <RadialBarChart
                innerRadius="25%"
                outerRadius="95%"
                data={radialData}
                startAngle={90}
                endAngle={-270}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar dataKey="value" cornerRadius={6} background={{ fill: "#f3f4f6" }}>
                  {radialData.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </RadialBar>
              </RadialBarChart>
            </ResponsiveContainer>
            {/* Center label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-2xl font-black text-black">
                {items.filter((i) => i.met).length}/{items.length}
              </div>
              <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Met</div>
            </div>
          </div>
        </div>

        {/* Animated horizontal bars */}
        <div className="space-y-5">
          {items.map((it, i) => (
            <div key={it.label}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-md border-2 border-black flex items-center justify-center shrink-0 ${it.met ? "bg-green-500 text-white" : "bg-red-600 text-white"}`}>
                    {it.met ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                  </div>
                  <span className="font-black text-xs text-black">{it.label}</span>
                </div>
                <span className="text-[10px] font-black tabular-nums text-neutral-600">{it.display}</span>
              </div>
              <div className="relative h-3 rounded-full border-2 border-black bg-neutral-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${it.pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: i * 0.15, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: it.met ? "#16a34a" : it.pct >= 60 ? "#f97316" : "#dc2626" }}
                />
              </div>
              <div className="text-[9px] font-black uppercase tracking-wider text-neutral-400 mt-0.5 tabular-nums">{it.pct}%</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function EarningsBarChart({ data }: { data: MonetizationData }) {
  const e = data.monetization.estimatedEarnings!;

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  // Seasonal multipliers (Q4 highest for ad revenue)
  const seasonalMult = [0.78, 0.72, 0.85, 0.88, 0.90, 0.92, 0.87, 0.91, 0.95, 1.05, 1.18, 1.32];
  const chartData = months.map((m, i) => ({
    month: m,
    low: Math.round(e.estimatedMonthlyRange.low * seasonalMult[i]),
    high: Math.round(e.estimatedMonthlyRange.high * seasonalMult[i]),
    mid: Math.round(e.estimatedMonthly * seasonalMult[i]),
  }));

  return (
    <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6">
      <h3 className="font-black text-base text-black mb-1 flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-red-600" /> Estimated Monthly Earnings (Seasonal)
      </h3>
      <p className="text-[11px] text-neutral-500 font-bold mb-5">
        Q4 typically earns 30–40% more due to advertiser spend spikes — shown below.
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={chartData} barCategoryGap="28%" margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
          <XAxis
            dataKey="month"
            tick={{ fontSize: 10, fontWeight: 700, fill: "#6b7280" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 9, fontWeight: 700, fill: "#9ca3af" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `$${v >= 1000 ? (v / 1000).toFixed(1) + "k" : v}`}
            width={44}
          />
          <Tooltip
            contentStyle={{ border: "2px solid #000", borderRadius: 10, fontSize: 11, fontWeight: 700 }}
            formatter={(v: number, name: string) => [`$${v.toLocaleString()}`, name === "high" ? "High" : name === "low" ? "Low" : "Mid"]}
          />
          <Bar dataKey="low" stackId="a" fill="#fca5a5" radius={[0, 0, 4, 4]} name="low" />
          <Bar dataKey="mid" stackId="b" fill="#dc2626" radius={[4, 4, 0, 0]} name="mid" />
        </BarChart>
      </ResponsiveContainer>
      <div className="flex flex-wrap items-center gap-4 mt-3">
        {[
          { color: "#dc2626", label: `Mid — ${fmtMoney(e.estimatedMonthly)}/mo` },
          { color: "#fca5a5", label: `Low — ${fmtMoney(e.estimatedMonthlyRange.low)}/mo` },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5 text-[10px] font-bold text-neutral-600">
            <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: l.color }} />
            {l.label}
          </div>
        ))}
      </div>
    </div>
  );
}

function UploadsViewsChart({ uploads }: { uploads: MonetizationData["recentUploads"] }) {
  const top = uploads.slice(0, 8);
  const chartData = top.map((u) => ({
    name: u.title.length > 16 ? u.title.slice(0, 14) + "…" : u.title,
    views: u.views,
    likes: u.likes,
    er: parseFloat(u.engagementRate) || 0,
  }));

  const maxViews = Math.max(...chartData.map((d) => d.views), 1);

  return (
    <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6">
      <h3 className="font-black text-base text-black mb-1 flex items-center gap-2">
        <Eye className="w-5 h-5 text-red-600" /> Recent Upload Performance
      </h3>
      <p className="text-[11px] text-neutral-500 font-bold mb-5">Views and likes across the last {top.length} videos.</p>

      {/* Horizontal bar chart — custom rendered for perfect control */}
      <div className="space-y-2.5 mb-6">
        {chartData.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="text-[10px] font-bold text-neutral-500 w-4 tabular-nums shrink-0">{i + 1}</div>
            <div className="flex-1 min-w-0">
              <div className="text-[10px] font-black text-black truncate mb-1">{d.name}</div>
              <div className="relative h-3 bg-neutral-100 rounded-full border border-neutral-200 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${(d.views / maxViews) * 100}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: i * 0.07, ease: "easeOut" }}
                  className="h-full rounded-full"
                  style={{ background: `hsl(${4 - i * 0.5}, 80%, ${42 + i * 4}%)` }}
                />
              </div>
            </div>
            <div className="text-[10px] font-black tabular-nums text-neutral-700 shrink-0 w-12 text-right">
              {fmt(d.views)}
            </div>
          </div>
        ))}
      </div>

      {/* Likes recharts bar chart */}
      <div className="border-t-2 border-dashed border-neutral-200 pt-4">
        <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">Likes per video</div>
        <ResponsiveContainer width="100%" height={140}>
          <BarChart data={chartData} barCategoryGap="30%" margin={{ top: 2, right: 4, bottom: 0, left: 0 }}>
            <XAxis
              dataKey="name"
              tick={{ fontSize: 9, fontWeight: 700, fill: "#9ca3af" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis hide />
            <Tooltip
              contentStyle={{ border: "2px solid #000", borderRadius: 8, fontSize: 10, fontWeight: 700 }}
              formatter={(v: number) => [`${v.toLocaleString()}`, "Likes"]}
            />
            <Bar dataKey="likes" radius={[4, 4, 0, 0]}>
              {chartData.map((_, i) => (
                <Cell key={i} fill={i === 0 ? "#dc2626" : i === 1 ? "#ef4444" : "#fca5a5"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ProgressRow({
  label,
  pass,
  current,
  target,
  percent,
}: {
  label: string;
  pass: boolean;
  current: string;
  target: string;
  percent: number;
}) {
  const pct = Math.max(0, Math.min(100, percent));
  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-6 h-6 rounded-md border-2 border-black flex items-center justify-center shrink-0 ${pass ? "bg-green-500 text-white" : "bg-red-600 text-white"}`}>
            {pass ? <CheckCircle2 className="w-3.5 h-3.5" /> : <XCircle className="w-3.5 h-3.5" />}
          </div>
          <span className="font-black text-sm text-black truncate">{label}</span>
        </div>
        <span className="text-xs font-black tabular-nums text-neutral-700 shrink-0">
          {current} <span className="text-neutral-400">/ {target}</span>
        </span>
      </div>
      <div className="relative h-3 w-full rounded-full border-2 border-black bg-white overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full ${pass ? "bg-green-500" : "bg-red-600"}`}
        />
      </div>
      <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mt-1 tabular-nums">{pct.toFixed(0)}% complete</div>
    </div>
  );
}
