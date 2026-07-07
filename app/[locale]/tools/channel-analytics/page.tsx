"use client";

import { friendlyApiError } from "@/lib/apiError";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  BarChart3,
  Loader2,
  Youtube,
  Link as LinkIcon,
  Users,
  Eye,
  Video as VideoIcon,
  TrendingUp,
  Heart,
  MessageCircle,
  Calendar,
  Globe,
  Award,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PenTool,
  Sparkles,
  ExternalLink,
  AlertCircle,
  Search,
  ShieldCheck,
  Baby,
  Activity,
  ThumbsUp,
  DollarSign,
  TrendingDown,
  Coins,
  PieChart,
  LineChart,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { ToolLayout, ToolCard, PrimaryButton } from "@/components/tools/ToolLayout";
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import { StatsStrip, GuideGrid, Workflow, SeoContent, FaqAccordion, CrossCTA } from "@/components/tools/ToolSections";
import {
  BarChart,
  Bar,
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://tubeai-backend.vercel.app";

type RecentUpload = {
  videoId: string;
  title: string;
  description: string;
  thumbnails?: { default?: string; medium?: string; high?: string } | null;
  publishedAt: string;
  stats: {
    title: string;
    publishedAt: string;
    viewCount: number;
    likeCount: number;
    commentCount: number;
  };
};

type AnalyticsData = {
  channelId: string;
  title: string;
  description: string;
  customUrl: string | null;
  handle: string | null;
  publishedAt: string;
  country: string | null;
  status: { isLinked: boolean; madeForKids: boolean };
  thumbnails?: { default?: string; medium?: string; high?: string } | null;
  bannerImage: string | null;
  statistics: {
    subscriberCount: number;
    hiddenSubscriberCount: boolean;
    videoCount: number;
    totalViews: number;
  };
  uploadsPlaylistId: string | null;
  topicCategories: string[];
  recentUploads: RecentUpload[];
  engagementMetrics: {
    averageViews: number;
    averageLikes: number;
    averageComments: number;
    totalRecentViews: number;
    totalRecentLikes: number;
    totalRecentComments: number;
    recentVideosAnalyzed: number;
  };
  estimatedMetrics: {
    averageViewsPerVideo: number;
    subscriberToViewRatio: string;
  };
};

function fmt(n: number): string {
  if (!Number.isFinite(n)) return "0";
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return Math.round(n).toLocaleString();
}

function formatJoined(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function timeAgo(iso: string): string {
  try {
    const diff = Date.now() - new Date(iso).getTime();
    const d = Math.floor(diff / 86_400_000);
    if (d < 1) return "today";
    if (d < 30) return `${d}d ago`;
    const m = Math.floor(d / 30);
    if (m < 12) return `${m}mo ago`;
    return `${Math.floor(m / 12)}y ago`;
  } catch {
    return "";
  }
}

function flagEmoji(country?: string | null): string {
  if (!country || country.length !== 2) return "";
  return country.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

function calculateEstimatedEarnings(totalViews: number, videoCount: number) {
  // Industry-standard CPM estimates
  const lowCPM = 0.25;  // $0.25 per 1000 views (lower bound)
  const midCPM = 2.0;   // $2.00 per 1000 views (average)
  const highCPM = 5.0;  // $5.00 per 1000 views (upper bound)

  const viewsInThousands = totalViews / 1000;

  return {
    monthly: {
      low: Math.round((viewsInThousands * lowCPM) / 12),
      mid: Math.round((viewsInThousands * midCPM) / 12),
      high: Math.round((viewsInThousands * highCPM) / 12),
    },
    yearly: {
      low: Math.round(viewsInThousands * lowCPM),
      mid: Math.round(viewsInThousands * midCPM),
      high: Math.round(viewsInThousands * highCPM),
    },
    lifetime: {
      low: Math.round(viewsInThousands * lowCPM),
      mid: Math.round(viewsInThousands * midCPM),
      high: Math.round(viewsInThousands * highCPM),
    },
  };
}

const stats = [
  { value: "Live", label: "YouTube API" },
  { value: "10", label: "Recent Uploads" },
  { value: "<3s", label: "Pull Speed" },
  { value: "100%", label: "Free Forever" },
];

const guides = [
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Track engagement rate", desc: "Channels with >5% engagement consistently outperform those at 1-2% — even with smaller subscriber counts." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Watch upload cadence", desc: "Consistency beats volume. Channels uploading twice weekly grow 3x faster than sporadic ones." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Compare top videos", desc: "Look at the recent uploads to find what resonates. Then double down on that format." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't obsess over subs", desc: "Subscriber count is a vanity metric. Average views per video matters far more for revenue and reach." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't ignore growth velocity", desc: "A 100k channel growing 5%/month beats a 1M channel growing 0.1%/month for sponsors and partnerships." },
  { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100", title: "Watch the trend, not the snapshot", desc: "Look at the last 10 uploads as a moving sample to reveal what one video's data hides." },
];

const faqs = [
  { q: "How accurate is this analytics tool?", a: "We pull live public stats from the YouTube Data API — subscribers, total views, video count, and channel age are exact. Engagement metrics come from the most recent 10 uploads." },
  { q: "Can I see private analytics from other channels?", a: "No — and no tool can. YouTube Studio analytics (impressions, CTR, AVD, revenue) are private to the channel owner. We show only what's publicly visible." },
  { q: "What URLs can I paste?", a: "Any YouTube link works — channel page, @handle, video URL, short link, or even a bare @handle. We resolve to the parent channel automatically." },
  { q: "How often is the data updated?", a: "Every request hits the YouTube API live, so you get fresh numbers on every check." },
];

const suggestions = ["@MrBeast", "@MarquesBrownlee", "@AliAbdaal", "@Veritasium", "@TheVerge"];

export default function ChannelAnalyticsPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [bannerFailed, setBannerFailed] = useState(false);
  const [descExpanded, setDescExpanded] = useState(false);

  const run = async (val?: string) => {
    const v = (val ?? input).trim();
    if (!v || loading) return;
    if (val !== undefined) setInput(val);
    setLoading(true);
    setError(null);
    setData(null);
    setBannerFailed(false);
    try {
      const res = await fetch(`${BASE_URL}/api/channel-analytics`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: v }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(friendlyApiError(body?.error || "", res.status));
      }
      setData(body.data as AnalyticsData);
    } catch (err: any) {
      setError(friendlyApiError(err?.message || "", 0));
    } finally {
      setLoading(false);
    }
  };

  const avatar = data?.thumbnails?.high || data?.thumbnails?.medium || data?.thumbnails?.default || null;
  const handle = data?.handle || (data?.customUrl ? `@${data.customUrl}` : "");
  const engagementRate =
    data && data.engagementMetrics.averageViews > 0
      ? ((data.engagementMetrics.averageLikes + data.engagementMetrics.averageComments) /
          data.engagementMetrics.averageViews) *
        100
      : 0;
  const earnings = data ? calculateEstimatedEarnings(data.statistics.totalViews, data.statistics.videoCount) : null;

  return (
    <ToolLayout
      title="YouTube Channel Analytics"
      description="Paste any YouTube link — channel, video, short, or @handle — to get live channel analytics: subscribers, views, recent uploads, and engagement metrics."
      icon={BarChart3}
      badge="Live YouTube Data · Channel Analytics"
    >
      <StatsStrip stats={stats} />

      <ToolCard className="mb-6">
        <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider mb-3">
          <Youtube className="w-4 h-4 text-red-600" /> YouTube URL or @handle
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] transition-shadow">
            <LinkIcon className="w-4 h-4 text-red-600 shrink-0" />
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="https://youtube.com/@MrBeast or any video link"
              className="flex-1 py-3 outline-none text-sm font-medium bg-transparent"
            />
          </div>
          <PrimaryButton onClick={() => run()} disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart3 className="w-4 h-4" />}
            {loading ? "Analyzing..." : "Analyze Channel"}
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

      <AnimatePresence>
        {error && !loading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-12 sm:mb-16"
          >
            <div className="relative bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400" />
              <div className="px-6 py-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-full border-4 border-black bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-4">
                  <Search className="w-9 h-9 text-white" />
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-red-100 border-2 border-black text-[10px] font-black uppercase tracking-wider text-red-700">
                  <AlertCircle className="w-3 h-3" /> Channel Not Found
                </div>
                <h3 className="font-black text-2xl tracking-tight mb-2">We couldn't analyze that channel</h3>
                <p className="text-sm text-neutral-600 font-medium max-w-md">{error}</p>
                <button
                  onClick={() => {
                    setError(null);
                    setInput("");
                  }}
                  className="mt-5 inline-flex items-center gap-1.5 px-4 py-2.5 bg-black text-white text-xs font-black rounded-xl border-2 border-black hover:bg-red-600 transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Search className="w-3.5 h-3.5" /> Try another link
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <ToolCard className="mb-12 sm:mb-16">
          <div className="flex flex-col items-center justify-center py-12 gap-3 text-neutral-500">
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            <div className="text-xs font-black uppercase tracking-wider">Pulling live channel analytics...</div>
            <div className="text-[11px] font-bold text-neutral-400">YouTube API · 1–3 seconds</div>
          </div>
        </ToolCard>
      )}

      <AnimatePresence>
        {data && !loading && (
          <motion.div
            key={data.channelId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16 space-y-5"
          >
            {/* PROFILE HERO */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              {/* Banner */}
              <div className="relative w-full h-32 sm:h-44 md:h-52 lg:h-60 border-b-2 border-black overflow-hidden bg-gradient-to-br from-red-600 via-red-700 to-black">
                {data.bannerImage && !bannerFailed ? (
                  <>
                    {/* Blurred background */}
                    <div
                      className="absolute inset-0 w-full h-full bg-cover bg-center scale-110 blur-2xl opacity-70"
                      style={{ backgroundImage: `url(${data.bannerImage})` }}
                    />
                    {/* Main banner image */}
                    <img
                      src={data.bannerImage}
                      alt={`${data.title} channel banner`}
                      onError={() => setBannerFailed(true)}
                      className="absolute inset-0 w-full h-full object-cover object-center z-0"
                      loading="eager"
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none z-10" />
                  </>
                ) : (
                  <>
                    {/* Fallback: YTForge branded banner */}
                    <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(45deg,rgba(0,0,0,0.25)_1px,transparent_1px)] bg-[size:36px_36px] animate-[seo-shimmer_8s_linear_infinite]" style={{ backgroundSize: "200% 200%" }} />
                    {/* Glow blobs */}
                    <div className="absolute -top-10 -left-10 w-40 h-40 sm:w-56 sm:h-56 rounded-full bg-red-500/40 blur-3xl" />
                    <div className="absolute -bottom-12 -right-8 w-44 h-44 sm:w-60 sm:h-60 rounded-full bg-orange-500/30 blur-3xl" />
                    {/* Center logo lockup */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 sm:gap-2 px-4 text-center">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Youtube className="w-7 h-7 sm:w-9 sm:h-9 md:w-11 md:h-11 text-white drop-shadow-[2px_2px_4px_rgba(0,0,0,0.6)]" />
                        <span className="font-black text-2xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-white drop-shadow-[3px_3px_6px_rgba(0,0,0,0.6)]">
                          YT<span className="text-red-300">Forge</span>
                        </span>
                      </div>
                      <span className="text-[9px] sm:text-[11px] md:text-xs font-bold uppercase tracking-[0.25em] text-white/70">
                        AI-Powered YouTube Creator Toolkit
                      </span>
                    </div>
                    {/* Bottom fade for readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  </>
                )}
              </div>

              {/* Profile info — sits below the banner with clean spacing (no overlap) */}
              <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6 pb-5 sm:pb-6">
                {/* Avatar + identity row. Items stack on mobile, row on sm+.
                    Avatar aligns to start on mobile, center on sm+ so the
                    name baseline lines up with the avatar. */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-white bg-white shrink-0 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ring-2 ring-black self-center sm:self-start">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={`${data.title} channel logo`}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-red-600 to-red-700 text-white font-black text-3xl sm:text-4xl md:text-5xl flex items-center justify-center">
                        {data.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 pb-1 sm:pb-2 text-center sm:text-left">
                    <div className="flex items-start sm:items-center gap-2 flex-wrap justify-center sm:justify-start">
                      <h2 className="font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl tracking-tight break-words">{data.title}</h2>
                      <div className="flex items-center gap-1.5 flex-wrap justify-center sm:justify-start">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black text-white text-[10px] sm:text-[11px] font-black rounded-full border-2 border-black">
                          <CheckCircle2 className="w-3 h-3" /> Live
                        </span>
                        {data.status.madeForKids && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-500 text-white text-[10px] sm:text-[11px] font-black rounded-full border-2 border-black">
                            <Baby className="w-3 h-3" /> Kids
                          </span>
                        )}
                        {data.status.isLinked && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-600 text-white text-[10px] sm:text-[11px] font-black rounded-full border-2 border-black">
                            <ShieldCheck className="w-3 h-3" /> Verified
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs sm:text-sm text-neutral-600 font-bold mt-2 flex items-center gap-x-3 sm:gap-x-4 gap-y-1.5 flex-wrap justify-center sm:justify-start">
                      {handle && <span className="text-red-600 font-black text-sm sm:text-base break-all">{handle}</span>}
                      {data.country && (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="text-lg leading-none">{flagEmoji(data.country)}</span>
                          <span className="font-bold">{data.country}</span>
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                        Joined {formatJoined(data.publishedAt)}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`https://youtube.com/channel/${data.channelId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 bg-red-600 text-white text-xs sm:text-sm font-black rounded-xl border-2 border-black hover:bg-red-700 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all shrink-0 w-full sm:w-auto self-center sm:self-end"
                  >
                    <Youtube className="w-4 h-4" />
                    Open Channel
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Top stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 sm:mt-7">
                  {[
                    {
                      icon: Users,
                      label: "Subscribers",
                      value: data.statistics.hiddenSubscriberCount ? "Hidden" : fmt(data.statistics.subscriberCount),
                      color: "text-red-600",
                    },
                    { icon: Eye, label: "Total Views", value: fmt(data.statistics.totalViews), color: "text-blue-600" },
                    { icon: VideoIcon, label: "Videos", value: fmt(data.statistics.videoCount), color: "text-purple-600" },
                    { icon: TrendingUp, label: "Avg Views/Video", value: fmt(data.estimatedMetrics.averageViewsPerVideo), color: "text-green-600" },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="border-2 border-black rounded-xl p-4 sm:p-5 bg-gradient-to-br from-neutral-50 to-white text-center hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                    >
                      <s.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${s.color} mx-auto mb-2`} />
                      <div className="font-black text-xl sm:text-2xl md:text-3xl tracking-tight mb-1">{s.value}</div>
                      <div className="text-[10px] sm:text-[11px] text-neutral-500 font-bold uppercase tracking-wider">{s.label}</div>
                    </div>
                  ))}
                </div>

                {data.description && (
                  <div className="mt-5 sm:mt-6 pt-5 sm:pt-6 border-t-2 border-dashed border-neutral-200 text-center sm:text-left">
                    <div className="flex items-center gap-2 mb-3 justify-center sm:justify-start">
                      <Globe className="w-4 h-4 text-neutral-500" />
                      <div className="text-[11px] font-black uppercase tracking-wider text-neutral-500">About Channel</div>
                    </div>
                    <div
                      className={`text-sm sm:text-base text-neutral-700 leading-relaxed whitespace-pre-line break-words ${
                        descExpanded ? "" : "line-clamp-3 sm:line-clamp-4"
                      }`}
                    >
                      {data.description}
                    </div>
                    <button
                      onClick={() => setDescExpanded((v) => !v)}
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg border-2 border-black bg-white hover:bg-red-50 transition shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                    >
                      {descExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" /> Show Less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" /> Show More
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ENGAGEMENT METRICS */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="px-4 py-3 sm:py-4 border-b-2 border-black bg-gradient-to-r from-neutral-50 to-neutral-100 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-red-600" />
                  <div className="font-black text-sm sm:text-base">Engagement (Last {data.engagementMetrics.recentVideosAnalyzed} Uploads)</div>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-[11px] font-black rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Activity className="w-3.5 h-3.5" />
                  {engagementRate.toFixed(1)}% Rate
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
                {[
                  { icon: Eye, label: "Avg Views", value: fmt(data.engagementMetrics.averageViews), color: "text-red-600", bg: "bg-red-50" },
                  { icon: ThumbsUp, label: "Avg Likes", value: fmt(data.engagementMetrics.averageLikes), color: "text-pink-600", bg: "bg-pink-50" },
                  { icon: MessageCircle, label: "Avg Comments", value: fmt(data.engagementMetrics.averageComments), color: "text-blue-600", bg: "bg-blue-50" },
                  { icon: Eye, label: "Total Views", value: fmt(data.engagementMetrics.totalRecentViews), color: "text-neutral-700", bg: "bg-neutral-50" },
                  { icon: Heart, label: "Total Likes", value: fmt(data.engagementMetrics.totalRecentLikes), color: "text-rose-600", bg: "bg-rose-50" },
                  { icon: MessageCircle, label: "Total Comments", value: fmt(data.engagementMetrics.totalRecentComments), color: "text-indigo-600", bg: "bg-indigo-50" },
                ].map((m, idx) => (
                  <div
                    key={m.label}
                    className={`p-4 sm:p-5 text-center border-b-2 md:border-b-0 md:border-r-2 last:border-r-0 border-neutral-100 ${m.bg} hover:bg-white transition-colors`}
                  >
                    <m.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${m.color} mx-auto mb-2`} />
                    <div className="font-black text-lg sm:text-xl md:text-2xl tracking-tight mb-1">{m.value}</div>
                    <div className="text-[10px] sm:text-[11px] text-neutral-600 font-bold uppercase tracking-wider">{m.label}</div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 sm:py-4 border-t-2 border-neutral-200 bg-neutral-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm font-bold text-neutral-600">
                <span className="flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-neutral-500" />
                  Sub→View ratio: <span className="text-black font-black">{data.estimatedMetrics.subscriberToViewRatio}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-neutral-500" />
                  Avg views/video: <span className="text-black font-black">{fmt(data.estimatedMetrics.averageViewsPerVideo)}</span>
                </span>
              </div>
            </div>

            {/* ANALYTICS CHARTS */}
            {data.recentUploads.length > 0 && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5">
                {/* VIDEO PERFORMANCE BAR CHART */}
                <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                  <div className="px-4 sm:px-5 py-3 sm:py-4 border-b-2 border-black bg-gradient-to-r from-red-50 to-orange-50 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                    <div className="font-black text-xs sm:text-sm md:text-base">Recent Video Performance</div>
                  </div>
                  <div className="p-3 sm:p-4 md:p-6">
                    <ResponsiveContainer width="100%" height={250} className="sm:hidden">
                      <BarChart
                        data={data.recentUploads.slice(0, 5).reverse().map((v, idx) => ({
                          name: `V${idx + 1}`,
                          views: v.stats.viewCount,
                          likes: v.stats.likeCount,
                          comments: v.stats.commentCount,
                        }))}
                        margin={{ top: 10, right: 5, left: -20, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10, fontWeight: 700, fill: "#737373" }}
                          stroke="#000"
                          strokeWidth={2}
                        />
                        <YAxis
                          tick={{ fontSize: 9, fontWeight: 700, fill: "#737373" }}
                          stroke="#000"
                          strokeWidth={2}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#000",
                            border: "2px solid #000",
                            borderRadius: "12px",
                            padding: "8px",
                            fontWeight: 700,
                          }}
                          labelStyle={{ color: "#fff", fontWeight: 900, marginBottom: "6px", fontSize: "11px" }}
                          itemStyle={{ color: "#fff", fontSize: "10px" }}
                          formatter={(value: any) => fmt(value)}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: "9px", fontWeight: 700 }}
                          iconType="circle"
                        />
                        <Bar dataKey="views" fill="#dc2626" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="likes" fill="#ec4899" radius={[6, 6, 0, 0]} />
                        <Bar dataKey="comments" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
                      <BarChart
                        data={data.recentUploads.slice(0, 8).reverse().map((v, idx) => ({
                          name: `Video ${idx + 1}`,
                          views: v.stats.viewCount,
                          likes: v.stats.likeCount,
                          comments: v.stats.commentCount,
                        }))}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fontWeight: 700, fill: "#737373" }}
                          stroke="#000"
                          strokeWidth={2}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fontWeight: 700, fill: "#737373" }}
                          stroke="#000"
                          strokeWidth={2}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#000",
                            border: "2px solid #000",
                            borderRadius: "12px",
                            padding: "12px",
                            fontWeight: 700,
                          }}
                          labelStyle={{ color: "#fff", fontWeight: 900, marginBottom: "8px" }}
                          itemStyle={{ color: "#fff", fontSize: "12px" }}
                          formatter={(value: any) => fmt(value)}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: "11px", fontWeight: 700 }}
                          iconType="circle"
                        />
                        <Bar dataKey="views" fill="#dc2626" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="likes" fill="#ec4899" radius={[8, 8, 0, 0]} />
                        <Bar dataKey="comments" fill="#3b82f6" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* ENGAGEMENT DISTRIBUTION PIE CHART */}
                <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                  <div className="px-4 sm:px-5 py-3 sm:py-4 border-b-2 border-black bg-gradient-to-r from-purple-50 to-pink-50 flex items-center gap-2">
                    <PieChart className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    <div className="font-black text-xs sm:text-sm md:text-base">Engagement Distribution</div>
                  </div>
                  <div className="p-3 sm:p-4 md:p-6">
                    <ResponsiveContainer width="100%" height={250} className="sm:hidden">
                      <RechartsPieChart>
                        <Pie
                          data={[
                            { name: "Views", value: data.engagementMetrics.totalRecentViews, color: "#dc2626" },
                            { name: "Likes", value: data.engagementMetrics.totalRecentLikes * 50, color: "#ec4899" },
                            { name: "Comments", value: data.engagementMetrics.totalRecentComments * 100, color: "#3b82f6" },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                          stroke="#000"
                          strokeWidth={2}
                        >
                          {[
                            { name: "Views", value: data.engagementMetrics.totalRecentViews, color: "#dc2626" },
                            { name: "Likes", value: data.engagementMetrics.totalRecentLikes * 50, color: "#ec4899" },
                            { name: "Comments", value: data.engagementMetrics.totalRecentComments * 100, color: "#3b82f6" },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#000",
                            border: "2px solid #000",
                            borderRadius: "12px",
                            padding: "8px",
                            fontWeight: 700,
                          }}
                          labelStyle={{ color: "#fff", fontWeight: 900, fontSize: "11px" }}
                          itemStyle={{ color: "#fff", fontSize: "10px" }}
                          formatter={(value: any) => fmt(value)}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: "9px", fontWeight: 700 }}
                          iconType="circle"
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
                      <RechartsPieChart>
                        <Pie
                          data={[
                            { name: "Views", value: data.engagementMetrics.totalRecentViews, color: "#dc2626" },
                            { name: "Likes", value: data.engagementMetrics.totalRecentLikes * 50, color: "#ec4899" },
                            { name: "Comments", value: data.engagementMetrics.totalRecentComments * 100, color: "#3b82f6" },
                          ]}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          stroke="#000"
                          strokeWidth={2}
                        >
                          {[
                            { name: "Views", value: data.engagementMetrics.totalRecentViews, color: "#dc2626" },
                            { name: "Likes", value: data.engagementMetrics.totalRecentLikes * 50, color: "#ec4899" },
                            { name: "Comments", value: data.engagementMetrics.totalRecentComments * 100, color: "#3b82f6" },
                          ].map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#000",
                            border: "2px solid #000",
                            borderRadius: "12px",
                            padding: "12px",
                            fontWeight: 700,
                          }}
                          labelStyle={{ color: "#fff", fontWeight: 900 }}
                          itemStyle={{ color: "#fff", fontSize: "12px" }}
                          formatter={(value: any) => fmt(value)}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: "11px", fontWeight: 700 }}
                          iconType="circle"
                        />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* VIDEO TIMELINE AREA CHART */}
                <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                  <div className="px-4 sm:px-5 py-3 sm:py-4 border-b-2 border-black bg-gradient-to-r from-blue-50 to-cyan-50 flex items-center gap-2">
                    <LineChart className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    <div className="font-black text-xs sm:text-sm md:text-base">Views Trend Timeline</div>
                  </div>
                  <div className="p-3 sm:p-4 md:p-6">
                    <ResponsiveContainer width="100%" height={250} className="sm:hidden">
                      <AreaChart
                        data={data.recentUploads.slice(0, 8).reverse().map((v, idx) => ({
                          name: `V${idx + 1}`,
                          views: v.stats.viewCount,
                          likes: v.stats.likeCount,
                        }))}
                        margin={{ top: 10, right: 5, left: -20, bottom: 20 }}
                      >
                        <defs>
                          <linearGradient id="colorViewsMobile" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="colorLikesMobile" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 10, fontWeight: 700, fill: "#737373" }}
                          stroke="#000"
                          strokeWidth={2}
                        />
                        <YAxis
                          tick={{ fontSize: 9, fontWeight: 700, fill: "#737373" }}
                          stroke="#000"
                          strokeWidth={2}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#000",
                            border: "2px solid #000",
                            borderRadius: "12px",
                            padding: "8px",
                            fontWeight: 700,
                          }}
                          labelStyle={{ color: "#fff", fontWeight: 900, marginBottom: "6px", fontSize: "11px" }}
                          itemStyle={{ color: "#fff", fontSize: "10px" }}
                          formatter={(value: any) => fmt(value)}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: "9px", fontWeight: 700 }}
                          iconType="circle"
                        />
                        <Area
                          type="monotone"
                          dataKey="views"
                          stroke="#dc2626"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorViewsMobile)"
                        />
                        <Area
                          type="monotone"
                          dataKey="likes"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          fillOpacity={1}
                          fill="url(#colorLikesMobile)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
                      <AreaChart
                        data={data.recentUploads.slice(0, 10).reverse().map((v, idx) => ({
                          name: `V${idx + 1}`,
                          views: v.stats.viewCount,
                          likes: v.stats.likeCount,
                        }))}
                        margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                      >
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0.1} />
                          </linearGradient>
                          <linearGradient id="colorLikes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                        <XAxis
                          dataKey="name"
                          tick={{ fontSize: 11, fontWeight: 700, fill: "#737373" }}
                          stroke="#000"
                          strokeWidth={2}
                        />
                        <YAxis
                          tick={{ fontSize: 11, fontWeight: 700, fill: "#737373" }}
                          stroke="#000"
                          strokeWidth={2}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#000",
                            border: "2px solid #000",
                            borderRadius: "12px",
                            padding: "12px",
                            fontWeight: 700,
                          }}
                          labelStyle={{ color: "#fff", fontWeight: 900, marginBottom: "8px" }}
                          itemStyle={{ color: "#fff", fontSize: "12px" }}
                          formatter={(value: any) => fmt(value)}
                        />
                        <Legend
                          wrapperStyle={{ fontSize: "11px", fontWeight: 700 }}
                          iconType="circle"
                        />
                        <Area
                          type="monotone"
                          dataKey="views"
                          stroke="#dc2626"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorViews)"
                        />
                        <Area
                          type="monotone"
                          dataKey="likes"
                          stroke="#3b82f6"
                          strokeWidth={3}
                          fillOpacity={1}
                          fill="url(#colorLikes)"
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* ENGAGEMENT RADAR CHART */}
                <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                  <div className="px-4 sm:px-5 py-3 sm:py-4 border-b-2 border-black bg-gradient-to-r from-green-50 to-emerald-50 flex items-center gap-2">
                    <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    <div className="font-black text-xs sm:text-sm md:text-base">Channel Engagement Metrics</div>
                  </div>
                  <div className="p-3 sm:p-4 md:p-6">
                    <ResponsiveContainer width="100%" height={250} className="sm:hidden">
                      <RadarChart
                        data={[
                          {
                            metric: "Views",
                            value: Math.min((data.engagementMetrics.averageViews / data.estimatedMetrics.averageViewsPerVideo) * 100, 100),
                          },
                          {
                            metric: "Likes",
                            value: Math.min((data.engagementMetrics.averageLikes / (data.engagementMetrics.averageViews * 0.05)) * 100, 100),
                          },
                          {
                            metric: "Comments",
                            value: Math.min((data.engagementMetrics.averageComments / (data.engagementMetrics.averageViews * 0.01)) * 100, 100),
                          },
                          {
                            metric: "Engage",
                            value: Math.min(engagementRate * 20, 100),
                          },
                          {
                            metric: "Consist",
                            value: Math.min((data.recentUploads.length / 10) * 100, 100),
                          },
                        ]}
                        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      >
                        <PolarGrid stroke="#e5e5e5" strokeWidth={2} />
                        <PolarAngleAxis
                          dataKey="metric"
                          tick={{ fontSize: 9, fontWeight: 700, fill: "#000" }}
                          stroke="#000"
                          strokeWidth={2}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={{ fontSize: 8, fontWeight: 700, fill: "#737373" }}
                          stroke="#000"
                          strokeWidth={2}
                        />
                        <Radar
                          name="Performance"
                          dataKey="value"
                          stroke="#dc2626"
                          fill="#dc2626"
                          fillOpacity={0.6}
                          strokeWidth={2}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#000",
                            border: "2px solid #000",
                            borderRadius: "12px",
                            padding: "8px",
                            fontWeight: 700,
                          }}
                          labelStyle={{ color: "#fff", fontWeight: 900, fontSize: "10px" }}
                          itemStyle={{ color: "#fff", fontSize: "9px" }}
                          formatter={(value: any) => `${Math.round(value)}%`}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                    <ResponsiveContainer width="100%" height={300} className="hidden sm:block">
                      <RadarChart
                        data={[
                          {
                            metric: "Views",
                            value: Math.min((data.engagementMetrics.averageViews / data.estimatedMetrics.averageViewsPerVideo) * 100, 100),
                          },
                          {
                            metric: "Likes",
                            value: Math.min((data.engagementMetrics.averageLikes / (data.engagementMetrics.averageViews * 0.05)) * 100, 100),
                          },
                          {
                            metric: "Comments",
                            value: Math.min((data.engagementMetrics.averageComments / (data.engagementMetrics.averageViews * 0.01)) * 100, 100),
                          },
                          {
                            metric: "Engagement",
                            value: Math.min(engagementRate * 20, 100),
                          },
                          {
                            metric: "Consistency",
                            value: Math.min((data.recentUploads.length / 10) * 100, 100),
                          },
                        ]}
                        margin={{ top: 20, right: 30, bottom: 20, left: 30 }}
                      >
                        <PolarGrid stroke="#e5e5e5" strokeWidth={2} />
                        <PolarAngleAxis
                          dataKey="metric"
                          tick={{ fontSize: 11, fontWeight: 700, fill: "#000" }}
                          stroke="#000"
                          strokeWidth={2}
                        />
                        <PolarRadiusAxis
                          angle={90}
                          domain={[0, 100]}
                          tick={{ fontSize: 10, fontWeight: 700, fill: "#737373" }}
                          stroke="#000"
                          strokeWidth={2}
                        />
                        <Radar
                          name="Performance"
                          dataKey="value"
                          stroke="#dc2626"
                          fill="#dc2626"
                          fillOpacity={0.6}
                          strokeWidth={3}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#000",
                            border: "2px solid #000",
                            borderRadius: "12px",
                            padding: "12px",
                            fontWeight: 700,
                          }}
                          labelStyle={{ color: "#fff", fontWeight: 900 }}
                          itemStyle={{ color: "#fff", fontSize: "12px" }}
                          formatter={(value: any) => `${Math.round(value)}%`}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* ESTIMATED EARNINGS */}
            {earnings && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="px-4 py-3 border-b-2 border-black bg-white flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-green-600" />
                    <div className="font-black text-sm">Estimated Lifetime Earnings</div>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-yellow-400 text-black text-[10px] font-black rounded-full border-2 border-black">
                    <AlertTriangle className="w-3 h-3" /> Estimate Only
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {/* Main earnings range */}
                  <div className="text-center mb-6">
                    <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">
                      Total Estimated Revenue
                    </div>
                    <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                      <div className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-green-600">
                        ${fmt(earnings.lifetime.low)}
                      </div>
                      <div className="font-black text-xl sm:text-2xl text-neutral-400">—</div>
                      <div className="font-black text-3xl sm:text-4xl md:text-5xl tracking-tight text-green-600">
                        ${fmt(earnings.lifetime.high)}
                      </div>
                    </div>
                    <div className="mt-2 text-xs sm:text-sm font-bold text-neutral-600">
                      Based on {fmt(data.statistics.totalViews)} total views across {fmt(data.statistics.videoCount)} videos
                    </div>
                  </div>

                  {/* Breakdown cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { label: "Low Estimate", value: earnings.lifetime.low, desc: "$0.25 CPM", icon: TrendingDown, color: "from-orange-500 to-red-500" },
                      { label: "Mid Estimate", value: earnings.lifetime.mid, desc: "$2.00 CPM", icon: DollarSign, color: "from-green-500 to-emerald-500" },
                      { label: "High Estimate", value: earnings.lifetime.high, desc: "$5.00 CPM", icon: TrendingUp, color: "from-blue-500 to-purple-500" },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="bg-white border-2 border-black rounded-xl p-4 text-center hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-3 border-2 border-black`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <div className="font-black text-2xl sm:text-3xl tracking-tight mb-1">
                          ${fmt(item.value)}
                        </div>
                        <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1">
                          {item.label}
                        </div>
                        <div className="text-[9px] font-bold text-neutral-400">
                          {item.desc}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Disclaimer */}
                  <div className="mt-5 pt-4 border-t-2 border-dashed border-neutral-200">
                    <div className="flex items-start gap-2 text-[11px] font-bold text-neutral-600 bg-white border-2 border-black rounded-lg p-3">
                      <AlertCircle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-black text-black">Disclaimer:</span> These are rough estimates based on industry-standard CPM ranges ($0.25–$5.00 per 1,000 views). Actual earnings vary widely based on niche, audience location, engagement, monetization status, brand deals, and AdSense rates. YouTube does not publicly share revenue data.
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TOPIC CATEGORIES */}
            {data.topicCategories.length > 0 && (
              <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b-2 border-black bg-gradient-to-r from-neutral-50 to-neutral-100 flex items-center gap-2">
                  <Award className="w-5 h-5 text-red-600" />
                  <div className="font-black text-sm sm:text-base">Topic Categories</div>
                  <div className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white text-[10px] font-black rounded-full">
                    {data.topicCategories.length}
                  </div>
                </div>
                <div className="p-4 sm:p-5 flex flex-wrap gap-2">
                  {data.topicCategories.map((url) => {
                    const name = decodeURIComponent(url.split("/").pop() || "").replace(/_/g, " ");
                    return (
                      <span
                        key={url}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-black text-[11px] sm:text-xs font-black rounded-full hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                      >
                        <Globe className="w-3 h-3 text-red-600" />
                        {name}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* RECENT UPLOADS */}
            {data.recentUploads.length > 0 && (
              <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="px-4 sm:px-5 py-3 sm:py-4 border-b-2 border-black bg-gradient-to-r from-neutral-50 to-neutral-100 flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <VideoIcon className="w-5 h-5 text-red-600" />
                    <div className="font-black text-sm sm:text-base">Recent Uploads</div>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-black text-white text-[10px] font-black rounded-full">
                    {data.recentUploads.length} Videos
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 p-4 sm:p-5">
                  {data.recentUploads.map((v) => {
                    const thumb = v.thumbnails?.high || v.thumbnails?.medium || v.thumbnails?.default;
                    return (
                      <a
                        key={v.videoId}
                        href={`https://youtube.com/watch?v=${v.videoId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group bg-white border-2 border-black rounded-xl overflow-hidden hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 flex flex-col"
                      >
                        <div className="aspect-video bg-gradient-to-br from-neutral-100 to-neutral-200 relative overflow-hidden border-b-2 border-black">
                          {thumb ? (
                            <>
                              <img
                                src={thumb}
                                alt={v.title}
                                loading="lazy"
                                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                            </>
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-neutral-200 text-neutral-400 font-black text-sm">
                              <Youtube className="w-12 h-12 opacity-20" />
                            </div>
                          )}
                          <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/90 text-white text-[10px] font-black rounded-md backdrop-blur-sm border border-white/20">
                            {timeAgo(v.publishedAt)}
                          </div>
                        </div>
                        <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3 flex-1">
                          <div className="font-black text-xs sm:text-sm leading-tight line-clamp-2 group-hover:text-red-600 transition-colors min-h-[2.5rem]">
                            {v.title}
                          </div>
                          <div className="flex items-center justify-between gap-2 text-[10px] sm:text-[11px] font-bold text-neutral-500 mt-auto pt-2 border-t border-neutral-100">
                            <span className="inline-flex items-center gap-1">
                              <Eye className="w-3.5 h-3.5 text-red-600" />
                              {fmt(v.stats.viewCount)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <ThumbsUp className="w-3.5 h-3.5 text-pink-600" />
                              {fmt(v.stats.likeCount)}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <MessageCircle className="w-3.5 h-3.5 text-blue-600" />
                              {fmt(v.stats.commentCount)}
                            </span>
                          </div>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!data && !loading && !error && <div className="mb-12 sm:mb-16" />}

      <GuideGrid
        badge="Analytics Rules"
        title="How to read YouTube channel analytics like a pro"
        intro="Six rules that separate signal from vanity in any creator's public stats."
        cards={guides}
      />

      <Workflow
        title="Your 4-step competitive analysis workflow"
        steps={[
          { n: "01", t: "Pick your competitors", d: "Choose 3-5 channels in your niche with similar subscriber counts to yours." },
          { n: "02", t: "Run each through the analyzer", d: "Look at engagement rate, recent uploads, and avg views — not just subs." },
          { n: "03", t: "Identify the patterns", d: "What format do their recent uploads share? What's their posting rhythm?" },
          { n: "04", t: "Apply to your channel", d: "Replicate their winning patterns with your unique voice and topics." },
        ]}
      />

      <SeoContent badge="Complete Channel Analytics Guide" title="The complete guide to YouTube channel analytics in 2026">
        <p>YouTube channel analytics are the single most powerful research tool available to creators today. Whether you're benchmarking your own channel, sizing up a competitor, or evaluating a creator for sponsorship, the public stats tell a richer story than most people realize.</p>
        <h3>Why public analytics matter</h3>
        <p>YouTube Studio analytics — impressions, CTR, AVD, audience retention — are private to the channel owner. But the public-facing metrics (subscribers, views, video count, channel age, engagement on individual videos) reveal more than enough to reverse-engineer almost any successful channel. <strong>Sponsors evaluate creators on public stats first</strong>, then dig deeper.</p>
        <h3>The metrics that actually matter</h3>
        <p>Most creators obsess over subscriber count — the laziest possible benchmark. The real signals are: <strong>average views per video</strong> (revenue and reach proxy), <strong>engagement rate</strong> (likes + comments / views — the brand-deal kingmaker), and <strong>upload cadence</strong> (the algorithm rewards consistency).</p>
        <h3>Engagement rate: the brand sponsor's holy grail</h3>
        <p>A 50K-subscriber channel with 8% engagement is more valuable to sponsors than a 1M-subscriber channel with 0.5% engagement. Engagement rate is calculated as <strong>(likes + comments) / views × 100</strong>. Anything above 5% is excellent, 2-5% is healthy, 1-2% is average, and below 1% suggests bot or paid-traffic inflation.</p>
        <h3>How to use channel analytics for competitive advantage</h3>
        <p>The smartest creators run weekly competitor sweeps. Pick 5 channels in your niche, log their subscribers and avg views, and re-check every 30 days. Combine this with our <a href="/tools/seo-analyzer">SEO Analyzer</a> to extract their winning keywords, and our <a href="/tools/viral-title-generator">Viral Title Generator</a> to model their title structures.</p>
      </SeoContent>

      <FaqAccordion faqs={faqs} />

      <CrossCTA
        title="Turn analytics into action"
        desc="See a competitor's winning pattern? Generate your own version with our AI tools."
        primary={{ label: "Generate Title", href: "/tools/viral-title-generator", icon: Sparkles }}
        secondary={{ label: "Write Script", href: "/tools/ai-script-writer", icon: PenTool }}
      />
          <ToolSeoJsonLd
        name="YouTube Channel Analytics"
        description={"Pull live channel analytics — subscribers, views, watch time, top videos, and growth velocity — from any channel URL."}
        slug="channel-analytics"
        faqs={faqs}
        breadcrumb={[
          { name: "Home", slug: "/" },
          { name: "Tools", slug: "/tools" },
          { name: "YouTube Channel Analytics", slug: "/tools/channel-analytics" },
        ]}
      />
</ToolLayout>
  );
}
