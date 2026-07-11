"use client";

import { copyToClipboard } from "@/lib/clipboard";
import { friendlyApiError } from "@/lib/apiError";
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Hash,
  Loader2,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Copy,
  Check,
  Search,
  BarChart3,
  DollarSign,
  Users,
  Eye,
  Video as VideoIcon,
  Calendar,
  AlertCircle,
  ExternalLink,
  Play,
} from "lucide-react";
import { ToolLayout, ToolCard, PrimaryButton } from "@/components/tools/ToolLayout";
import { TurnstileGate } from "@/components/tools/TurnstileGate";
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import { StatsStrip, GuideGrid, Workflow, SeoContent, FaqAccordion, CrossCTA } from "@/components/tools/ToolSections";
import { useTurnstileSession } from "@/hooks/useTurnstileSession";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://tubeai-backend.vercel.app";

type ChannelData = {
  channelId: string;
  title: string;
  description: string;
  customUrl?: string;
  handle?: string;
  publishedAt: string;
  country?: string;
  thumbnails?: {
    default?: string;
    medium?: string;
    high?: string;
  } | null;
  bannerImage?: string | null;
  statistics: {
    viewCount: number;
    subscriberCount: number;
    hiddenSubscriberCount: boolean;
    videoCount: number;
  };
};

function formatCount(num: number): string {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return num.toLocaleString();
}

function formatJoined(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", { month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function flagEmoji(country?: string): string {
  if (!country || country.length !== 2) return "";
  return country.toUpperCase().replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

const stats = [
  { value: "Live", label: "YouTube API" },
  { value: "<2s", label: "Lookup Speed" },
  { value: "100%", label: "Free Forever" },
  { value: "Any", label: "URL Format" },
];

const guides = [
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Use for API integrations", desc: "Channel IDs are required for the YouTube Data API, RSS feeds, and most analytics integrations." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Save the canonical URL", desc: "The /channel/UC... URL never changes — handles can be rebranded but IDs are permanent." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Subscribe via RSS", desc: "Power users follow channels via RSS — paste the channel ID into any RSS reader for ad-free updates." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't confuse handle with ID", desc: "@handle is human-readable; the ID is a 24-character UC... string used by YouTube's backend." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't share IDs publicly without context", desc: "Channel IDs unlock automation. Be mindful when posting them in public scraper or bot configs." },
  { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100", title: "Old custom URLs may differ", desc: "Pre-2022 /c/ and /user/ URLs sometimes resolve to a different ID than the new @handle. Verify both." },
];

const faqs = [
  { q: "What is a YouTube Channel ID?", a: "A unique 24-character string starting with 'UC' that YouTube uses internally to identify every channel. Unlike @handles, channel IDs never change — even if the channel rebrands." },
  { q: "Why do I need it?", a: "You'll need a channel ID for the YouTube Data API, third-party analytics tools, RSS feed subscriptions, embed widgets, and most automation workflows." },
  { q: "How is this different from @handle?", a: "Handles are human-readable usernames (like @MrBeast) that owners can change. Channel IDs are permanent backend identifiers — apps and APIs use IDs, humans use handles." },
  { q: "Is this tool free?", a: "Yes — 100% free, no signup, unlimited lookups. Paste any URL or handle and get the ID, RSS feed, and canonical channel URL instantly." },
];

const suggestions = ["@MrBeast", "@MarquesBrownlee", "@AliAbdaal", "@Veritasium", "@TheVerge"];

export default function ChannelIdFinderPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<ChannelData | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [showFullDesc, setShowFullDesc] = useState(false);
  const [bannerFailed, setBannerFailed] = useState(false);
  const { token, verified, turnstileRef, onSuccess, onExpire, onError } = useTurnstileSession();

  const run = async (val?: string) => {
    const v = (val ?? input).trim();
    if (!v || loading) return;
    if (val !== undefined) setInput(val);
    setLoading(true);
    setError(null);
    setData(null);
    setShowFullDesc(false);
    setBannerFailed(false);
    try {
      const res = await fetch(`${BASE_URL}/api/channel-info`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: v, "cf-turnstile-response": token }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(friendlyApiError(body?.error || "", res.status));
      }
      setData(body.data as ChannelData);
    } catch (err: any) {
      setError(friendlyApiError(err?.message || "", 0));
    } finally {
      setLoading(false);
    }
  };

  const copy = (label: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 1400);
  };

  const handle = data?.handle || (data?.customUrl ? `@${data.customUrl}` : "");
  const channelUrl = data ? `https://youtube.com/channel/${data.channelId}` : "";
  const handleUrl = data && handle ? `https://youtube.com/${handle.startsWith("@") ? handle : "@" + handle}` : "";
  const rssUrl = data ? `https://www.youtube.com/feeds/videos.xml?channel_id=${data.channelId}` : "";
  const avatar = data?.thumbnails?.high || data?.thumbnails?.medium || data?.thumbnails?.default || null;

  const descriptionShort = data?.description ? data.description.slice(0, 220) : "";
  const needsTruncation = !!data?.description && data.description.length > 220;

  return (
    <ToolLayout
      title="YouTube Channel ID Finder"
      description="Paste any YouTube link — video, short, channel URL, or @handle — to get live channel info, the permanent UC... ID, RSS feed, and canonical URLs."
      icon={Hash}
      badge="Free Tool · Live YouTube Data"
    >
      <StatsStrip stats={stats} />

      <ToolCard className="mb-6">
        <TurnstileGate verified={verified} turnstileRef={turnstileRef} onSuccess={onSuccess} onExpire={onExpire} onError={onError}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white">
              <LinkIcon className="w-4 h-4 text-red-600 shrink-0" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && run()}
                placeholder="Paste any YouTube URL, @handle, or video link..."
                className="flex-1 py-3 outline-none text-sm font-medium"
              />
            </div>
            <PrimaryButton onClick={() => run()} disabled={loading || !input.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "Fetching..." : "Find Channel"}
            </PrimaryButton>
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-4">
            <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500">Try:</span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => run(s)}
                className="px-2.5 py-1 text-xs font-bold rounded-full border-2 border-black bg-white hover:bg-red-50 hover:-translate-y-0.5 transition-all"
              >
                {s}
              </button>
            ))}
          </div>
        </TurnstileGate>

      </ToolCard>

      <AnimatePresence>
        {error && !loading && (
          <motion.div
            key="error-card"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-12 sm:mb-16"
          >
            <div className="relative bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              {/* Decorative top stripe */}
              <div className="h-2 bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400" />
              {/* Subtle grid texture */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

              <div className="relative px-6 sm:px-10 py-10 sm:py-12 flex flex-col items-center text-center">
                {/* Animated 404 illustration */}
                <div className="relative mb-5">
                  <motion.div
                    animate={{ rotate: [0, -6, 6, -3, 0] }}
                    transition={{ duration: 0.6, delay: 0.15 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-black bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Search className="w-9 h-9 sm:w-11 sm:h-11 text-white" />
                  </motion.div>
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-black border-2 border-white flex items-center justify-center">
                    <XCircle className="w-5 h-5 text-red-500" />
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 mb-3 rounded-full bg-red-100 border-2 border-black text-[10px] font-black uppercase tracking-wider text-red-700">
                  <AlertCircle className="w-3 h-3" /> Channel Not Found
                </div>

                <h3 className="font-black text-2xl sm:text-3xl tracking-tight mb-2">
                  We couldn't find that channel
                </h3>
                <p className="text-sm sm:text-base text-neutral-600 font-medium max-w-md leading-relaxed">
                  {error}
                </p>

                {/* Helpful tips */}
                <div className="mt-6 w-full max-w-lg grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left">
                  {[
                    { icon: CheckCircle2, label: "Use a full URL", hint: "youtube.com/@handle" },
                    { icon: CheckCircle2, label: "Or paste a video", hint: "youtu.be/abc123" },
                    { icon: CheckCircle2, label: "Or just the handle", hint: "@MrBeast" },
                  ].map((tip) => (
                    <div
                      key={tip.label}
                      className="flex items-start gap-2 p-2.5 rounded-xl border-2 border-black bg-neutral-50"
                    >
                      <tip.icon className="w-4 h-4 text-green-600 shrink-0 mt-0.5" />
                      <div className="min-w-0">
                        <div className="font-black text-[11px] truncate">{tip.label}</div>
                        <div className="text-[10px] text-neutral-500 font-bold truncate">{tip.hint}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Try again with suggestions */}
                <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => {
                      setError(null);
                      setInput("");
                    }}
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-black text-white text-xs font-black rounded-xl border-2 border-black hover:bg-red-600 transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <Search className="w-3.5 h-3.5" /> Try another link
                  </button>
                  <div className="flex flex-wrap items-center justify-center gap-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Or try:</span>
                    {suggestions.slice(0, 3).map((s) => (
                      <button
                        key={s}
                        onClick={() => run(s)}
                        className="px-2 py-0.5 text-[11px] font-bold rounded-full border-2 border-black bg-white hover:bg-red-50 transition"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16"
          >
            <div className="bg-white border-2 border-black rounded-2xl p-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full bg-red-600 flex items-center justify-center animate-pulse">
                <Search className="w-7 h-7 text-white" />
              </div>
              <div className="text-center">
                <div className="font-black text-base">Looking up channel...</div>
                <div className="text-xs text-neutral-500 font-bold mt-1">Pulling live data from the YouTube API</div>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && data && (
          <motion.div
            key={data.channelId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16"
          >
            {/* HERO CARD: banner + identity + stats */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              {/* Banner — responsive heights so YT banner safe-area renders cleanly on every device */}
              <div className="relative w-full h-32 sm:h-40 md:h-48 lg:h-56 bg-gradient-to-br from-red-600 via-orange-500 to-yellow-400 border-b-2 border-black overflow-hidden">
                {data.bannerImage && !bannerFailed ? (
                  <>
                    {/* Blurred backdrop fills any letterbox space with the banner's own colors */}
                    <img
                      src={data.bannerImage}
                      alt=""
                      aria-hidden="true"
                      onError={() => setBannerFailed(true)}
                      className="absolute inset-0 w-full h-full object-cover scale-110 blur-2xl opacity-70"
                    />
                    {/* Foreground banner — contain on mobile so the safe-area is fully visible, cover on desktop */}
                    <img
                      src={data.bannerImage}
                      alt="Channel banner"
                      onError={() => setBannerFailed(true)}
                      className="relative w-full h-full object-contain sm:object-cover object-center"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px]" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-2 sm:gap-3 px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl bg-black/30 backdrop-blur-sm border-2 border-white/40">
                        <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-white flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,0.4)]">
                          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 fill-red-600" />
                        </div>
                        <span className="font-black text-lg sm:text-2xl tracking-tight text-white drop-shadow-[2px_2px_0_rgba(0,0,0,0.4)]">
                          YTForge
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Identity row — sits cleanly below the banner */}
              <div className="px-4 sm:px-6 pt-5 sm:pt-6 pb-5 sm:pb-6">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-5">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full border-4 border-black bg-white shrink-0 overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    {avatar ? (
                      <img src={avatar} alt={data.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-red-600 text-white font-black text-3xl flex items-center justify-center">
                        {data.title.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="font-black text-xl sm:text-2xl md:text-3xl tracking-tight truncate">
                        {data.title}
                      </h2>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-black text-white text-[10px] font-black rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Live
                      </span>
                    </div>
                    <div className="text-xs sm:text-sm text-neutral-600 font-bold mt-1 flex items-center gap-x-3 gap-y-1 flex-wrap">
                      {handle && <span className="text-red-600">{handle}</span>}
                      {data.country && (
                        <span className="inline-flex items-center gap-1">
                          <span className="text-base leading-none">{flagEmoji(data.country)}</span>
                          {data.country}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Joined {formatJoined(data.publishedAt)}
                      </span>
                    </div>
                  </div>

                  <a
                    href={channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 text-white text-xs font-black rounded-xl border-2 border-black hover:bg-red-700 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition shrink-0 self-stretch sm:self-auto"
                  >
                    Open Channel <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* STATS — 3 across, full width on mobile */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-5 sm:mt-6">
                  {[
                    {
                      icon: Users,
                      label: "Subscribers",
                      value: data.statistics.hiddenSubscriberCount
                        ? "Hidden"
                        : formatCount(data.statistics.subscriberCount),
                    },
                    { icon: Eye, label: "Total Views", value: formatCount(data.statistics.viewCount) },
                    { icon: VideoIcon, label: "Videos", value: formatCount(data.statistics.videoCount) },
                  ].map((s) => (
                    <div
                      key={s.label}
                      className="border-2 border-black rounded-xl p-3 sm:p-4 bg-gradient-to-br from-neutral-50 to-white text-center sm:text-left"
                    >
                      <s.icon className="w-4 h-4 text-red-600 mx-auto sm:mx-0 mb-1" />
                      <div className="font-black text-base sm:text-xl md:text-2xl tracking-tight">{s.value}</div>
                      <div className="text-[9px] sm:text-[10px] text-neutral-500 font-bold uppercase tracking-wider">
                        {s.label}
                      </div>
                    </div>
                  ))}
                </div>

                {/* DESCRIPTION */}
                {data.description && (
                  <div className="mt-5 sm:mt-6 pt-5 border-t-2 border-dashed border-neutral-200">
                    <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">
                      About
                    </div>
                    <div className="text-sm text-neutral-700 leading-relaxed whitespace-pre-line">
                      {showFullDesc || !needsTruncation ? data.description : descriptionShort + "..."}
                      {needsTruncation && (
                        <button
                          onClick={() => setShowFullDesc((s) => !s)}
                          className="ml-1 text-red-600 font-black hover:underline text-xs"
                        >
                          {showFullDesc ? "Show less" : "Show more"}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* COPY ROWS */}
            <div className="mt-5 sm:mt-6 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b-2 border-black bg-neutral-50 flex items-center gap-2">
                <Hash className="w-4 h-4 text-red-600" />
                <div className="font-black text-sm">Identifiers &amp; Links</div>
              </div>
              <div className="divide-y-2 divide-neutral-100">
                {[
                  { label: "Channel ID", value: data.channelId, hint: "Permanent UC... identifier" },
                  { label: "Channel URL", value: channelUrl, hint: "Canonical /channel/ link" },
                  ...(handleUrl ? [{ label: "Handle URL", value: handleUrl, hint: "Human-friendly @handle link" }] : []),
                  { label: "RSS Feed", value: rssUrl, hint: "Subscribe in any RSS reader" },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="p-3 sm:p-4 flex flex-col md:flex-row md:items-center gap-2.5 md:gap-3 hover:bg-neutral-50 transition"
                  >
                    <div className="md:w-40 lg:w-48 shrink-0">
                      <div className="font-black text-sm">{row.label}</div>
                      <div className="text-[10px] text-neutral-500 font-bold hidden md:block">{row.hint}</div>
                    </div>
                    <code className="flex-1 min-w-0 truncate font-mono text-xs sm:text-sm bg-neutral-100 border-2 border-neutral-200 rounded-lg px-3 py-2">
                      {row.value}
                    </code>
                    <button
                      onClick={() => copy(row.label, row.value)}
                      className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-black rounded-lg border-2 border-black shrink-0 transition ${
                        copied === row.label
                          ? "bg-green-500 text-white"
                          : "bg-black text-white hover:bg-red-600"
                      }`}
                    >
                      {copied === row.label ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied === row.label ? "Copied" : "Copy"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !data && <div key="empty" className="mb-12 sm:mb-16" />}
      </AnimatePresence>

      <GuideGrid
        badge="Lookup Rules"
        title="When and how to use channel IDs"
        intro="Six rules for using YouTube channel IDs in API workflows, automation, and research."
        cards={guides}
      />

      <Workflow
        title="Your 4-step lookup workflow"
        steps={[
          { n: "01", t: "Copy any YouTube link", d: "Channel URL, @handle, video link, or short — any format works." },
          { n: "02", t: "Paste & fetch", d: "We resolve it through the YouTube Data API and pull live channel data." },
          { n: "03", t: "Copy what you need", d: "Channel ID, /channel/ URL, @handle URL, or RSS feed — all one click." },
          { n: "04", t: "Plug into your tools", d: "Use the ID in YouTube Data API requests, RSS readers, or analytics dashboards." },
        ]}
      />

      <SeoContent badge="Complete Channel ID Guide" title="How to find any YouTube channel ID in 2026">
        <p>YouTube uses two parallel identifier systems. The <strong>@handle</strong> is the human-readable username creators chose during the 2022 rollout — short, brandable, and easy to share. The <strong>channel ID</strong> is the permanent 24-character backend identifier (always starting with "UC") that powers every API request, RSS feed, and embed widget on the platform. If you're integrating with the YouTube Data API or building any kind of automation, you need the ID, not the handle.</p>
        <h3>Why channel IDs matter for creators and developers</h3>
        <p>Handles can be changed. IDs cannot. When a creator rebrands from @OldName to @NewName, every link using the handle eventually breaks — but every link using <code>/channel/UC...</code> keeps working. That's why third-party analytics platforms, scheduling tools, and the YouTube Data API all index channels by ID, not handle.</p>
        <h3>Where you'll need it</h3>
        <p><strong>YouTube Data API:</strong> every channel-level endpoint (<code>channels.list</code>, <code>search.list</code>, <code>playlistItems.list</code>) accepts a channel ID as the primary key. <strong>RSS subscriptions:</strong> the URL <code>youtube.com/feeds/videos.xml?channel_id=UC...</code> delivers a live feed of every new upload, no API key required. <strong>Analytics dashboards:</strong> tools like Social Blade, vidIQ, and TubeBuddy all expect a channel ID for tracking.</p>
        <h3>Common pitfalls</h3>
        <p>Pre-2022 channels used three URL formats: <code>/c/CustomName</code>, <code>/user/LegacyName</code>, and <code>/channel/UC...</code>. Some legacy <code>/c/</code> links still resolve to a different ID than the modern @handle for the same creator. Always verify by visiting the channel page and checking the canonical <code>/channel/</code> URL in YouTube's "Share" menu.</p>
        <h3>How our tool works</h3>
        <p>We accept any channel URL format — full link, @handle, /c/, /user/, or /channel/ — and return all four canonical formats: the channel ID, the /channel/ URL, the @handle URL, and the live RSS feed URL. Everything is pulled from YouTube's public metadata; no API key or signup required.</p>
        <h3>From channel ID to deeper insights</h3>
        <p>Once you've got the ID, plug it into our <a href="/tools/channel-analytics">Channel Analytics</a> for a full performance breakdown, or run a monetization eligibility check via our <a href="/tools/monetization-checker">Monetization Checker</a>.</p>
      </SeoContent>

      <FaqAccordion faqs={faqs} />

      <CrossCTA
        title="Now go deeper on any channel"
        desc="Got the ID? Run a full analytics report or monetization audit in seconds."
        primary={{ label: "Analyze Channel", href: "/tools/channel-analytics", icon: BarChart3 }}
        secondary={{ label: "Check Monetization", href: "/tools/monetization-checker", icon: DollarSign }}
      />
          <ToolSeoJsonLd
        name="YouTube Channel ID Finder"
        description={"Find any YouTube channel ID, RSS feed, and canonical URL from a video link, @handle, or channel URL."}
        slug="channel-id-finder"
        faqs={faqs}
        breadcrumb={[
          { name: "Home", slug: "/" },
          { name: "Tools", slug: "/tools" },
          { name: "YouTube Channel ID Finder", slug: "/tools/channel-id-finder" },
        ]}
      />
</ToolLayout>
  );
}
