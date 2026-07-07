"use client";

import { copyToClipboard } from "@/lib/clipboard";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Image as ImageIcon,
  Link as LinkIcon,
  Loader2,
  Download,
  Copy,
  Check,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Maximize2,
  X,
  Monitor,
  Smartphone,
  Tablet,
  Tv,
  Share2,
  Sparkles,
  ArrowLeftRight,
  Play,
  Zap,
} from "lucide-react";
import { ToolLayout, ToolCard, PrimaryButton } from "@/components/tools/ToolLayout";
import {
  StatsStrip,
  GuideGrid,
  Workflow,
  SeoContent,
  FaqAccordion,
  CrossCTA,
} from "@/components/tools/ToolSections";

// ─── Types ───
type ThumbKey = "default" | "mqdefault" | "hqdefault" | "sddefault" | "maxresdefault";

type ThumbSize = {
  key: ThumbKey;
  label: string;
  width: number;
  height: number;
  description: string;
};

const SIZES: ThumbSize[] = [
  { key: "default",       label: "Default",            width: 120,  height: 90,  description: "Tiny preview frame" },
  { key: "mqdefault",     label: "Medium",             width: 320,  height: 180, description: "Mobile feed preview" },
  { key: "hqdefault",     label: "High",               width: 480,  height: 360, description: "Default fallback" },
  { key: "sddefault",     label: "Standard",           width: 640,  height: 480, description: "4:3 standard def" },
  { key: "maxresdefault", label: "Maximum Resolution", width: 1280, height: 720, description: "HD master file" },
];

const stats = [
  { value: "5",   label: "Resolutions" },
  { value: "4",   label: "Device Previews" },
  { value: "100%",label: "Free Forever" },
  { value: "<1s", label: "Fetch Time" },
];

const guides = [
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Use max for design work", desc: "Pull 1280×720 when you need a crisp reference for thumbnail design or print." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Preview on real devices", desc: "Check how your thumbnail reads on mobile, tablet, desktop, and TV before publishing." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Compare HQ vs Max", desc: "Some uploads never get a maxres variant — use the side-by-side compare to know what to expect." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't republish as-is", desc: "Other creators' thumbnails are copyrighted. Use them for study and inspiration only." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't use private videos", desc: "Private, unlisted-to-you, and members-only thumbnails won't load. Use public links." },
  { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100", title: "Max isn't always there", desc: "Older or low-res uploads cap at sddefault or hqdefault. We label Max as unavailable when needed." },
];

const faqs = [
  { q: "What thumbnail sizes does YouTube provide?", a: "Every public video ships with five auto-generated thumbnails: 120×90 (default), 320×180 (medium), 480×360 (high), 640×480 (standard), and 1280×720 (maxres). Older or low-resolution uploads may not have all five." },
  { q: "Why is the max resolution unavailable for some videos?", a: "YouTube only generates maxres (1280×720) when the original source video is at least HD. Older uploads or low-resolution recordings cap at sddefault (640×480) or hqdefault (480×360)." },
  { q: "How do I download a thumbnail?", a: "Click any quality's Download button. The image saves as a JPG to your device with a clean filename." },
  { q: "Does this work for YouTube Shorts?", a: "Yes — paste any Shorts URL and you'll get the same five resolutions, including the vertical-feed preview frame." },
  { q: "Is this tool free?", a: "100% free, no signup, no watermark, unlimited previews forever." },
];

// ─── URL parser ───
function extractVideoId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;

  // Bare 11-char video ID
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;

  // Try as URL
  let url: URL;
  try {
    url = new URL(raw.match(/^https?:\/\//) ? raw : `https://${raw}`);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");

  // youtu.be/<id>
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  }

  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    // /watch?v=ID
    const v = url.searchParams.get("v");
    if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;

    // /shorts/ID, /live/ID, /embed/ID, /v/ID
    const segs = url.pathname.split("/").filter(Boolean);
    if (segs.length >= 2 && ["shorts", "live", "embed", "v"].includes(segs[0])) {
      const id = segs[1];
      if (/^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    }
  }

  return null;
}

function thumbUrl(id: string, key: ThumbKey): string {
  return `https://i.ytimg.com/vi/${id}/${key}.jpg`;
}

function filename(id: string, key: ThumbKey): string {
  return `${id}-${key}.jpg`;
}

async function downloadAs(url: string, name: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    const objectUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = objectUrl;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
    toast.success("Thumbnail downloaded", { description: name });
  } catch {
    // Fallback: open in new tab so the user can save manually
    window.open(url, "_blank", "noopener,noreferrer");
    toast.message("Opened in new tab — right-click to save", { description: name });
  }
}

async function copyText(text: string, label = "Copied") {
  try {
    await copyToClipboard(text);
    toast.success(label, { description: text.length > 60 ? text.slice(0, 60) + "…" : text });
  } catch {
    toast.error("Couldn't copy to clipboard");
  }
}

// Preload an image to check if it exists (and that it's not the 120px "no thumbnail" placeholder)
function preload(url: string): Promise<{ ok: boolean; width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ ok: img.naturalWidth > 120, width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ ok: false, width: 0, height: 0 });
    img.src = url;
  });
}

// ─── Devices ───
type DeviceId = "desktop" | "tablet" | "mobile" | "tv";

const DEVICES: { id: DeviceId; label: string; icon: typeof Monitor }[] = [
  { id: "desktop", label: "Desktop", icon: Monitor },
  { id: "tablet",  label: "Tablet",  icon: Tablet  },
  { id: "mobile",  label: "Mobile",  icon: Smartphone },
  { id: "tv",      label: "TV",      icon: Tv      },
];

function DeviceFrame({ device, src, alt }: { device: DeviceId; src: string; alt: string }) {
  if (device === "desktop") {
    return (
      <div className="w-full max-w-2xl mx-auto rounded-2xl border-2 border-black bg-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-neutral-200 border-b-2 border-black">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
          <span className="ml-3 px-3 py-1 rounded text-[10px] font-bold bg-white border border-neutral-300 text-neutral-500">youtube.com/watch?v=…</span>
        </div>
        <div className="aspect-video bg-black relative">
          <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/20 transition">
            <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center border-4 border-white shadow-lg opacity-90">
              <Play className="w-7 h-7 text-white fill-white ml-1" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (device === "tablet") {
    return (
      <div className="w-full max-w-md mx-auto rounded-3xl border-[6px] border-black bg-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] p-3">
        <div className="aspect-video rounded-xl overflow-hidden bg-neutral-900">
          <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover" />
        </div>
      </div>
    );
  }
  if (device === "mobile") {
    return (
      <div className="w-[200px] sm:w-[220px] mx-auto rounded-[2rem] border-[6px] border-black bg-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] p-2 relative">
        <div className="absolute top-1.5 left-1/2 -translate-x-1/2 w-16 h-1.5 rounded-full bg-neutral-700" />
        <div className="aspect-[9/16] rounded-[1.4rem] overflow-hidden bg-neutral-900 mt-3">
          <div className="aspect-video w-full bg-neutral-900">
            <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover" />
          </div>
          <div className="p-2 space-y-1">
            <div className="h-2 bg-neutral-700 rounded w-3/4" />
            <div className="h-1.5 bg-neutral-700 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }
  // TV
  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="rounded-xl border-[10px] border-black bg-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] overflow-hidden">
        <div className="aspect-video bg-black">
          <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover" />
        </div>
      </div>
      <div className="mx-auto h-2 w-32 bg-neutral-700 rounded-b-lg" />
      <div className="mx-auto h-6 w-16 bg-neutral-800 rounded-b" />
    </div>
  );
}

// ─── Page ───
export default function ThumbnailPreviewPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [videoId, setVideoId] = useState<string | null>(null);
  const [availability, setAvailability] = useState<Record<ThumbKey, boolean>>({
    default: false, mqdefault: false, hqdefault: false, sddefault: false, maxresdefault: false,
  });

  const [device, setDevice] = useState<DeviceId>("desktop");
  const [zoom, setZoom] = useState<{ url: string; alt: string } | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setZoom(null);
        setCompareOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const reset = () => {
    setInput("");
    setVideoId(null);
    setError(null);
    inputRef.current?.focus();
  };

  const handlePreview = async (val?: string) => {
    const raw = (val ?? input).trim();
    if (!raw) return;
    if (val !== undefined) setInput(val);

    const id = extractVideoId(raw);
    if (!id) {
      setError("That doesn't look like a valid YouTube URL or video ID. Try a full link or the 11-character ID.");
      setVideoId(null);
      return;
    }

    setError(null);
    setLoading(true);
    setVideoId(null);

    // Pre-check every size in parallel so we can show "Not available" badges
    const results = await Promise.all(
      SIZES.map(async (s) => ({ key: s.key, ok: (await preload(thumbUrl(id, s.key))).ok }))
    );

    const next: Record<ThumbKey, boolean> = {
      default: true, mqdefault: true, hqdefault: true, sddefault: false, maxresdefault: false,
    };
    for (const r of results) next[r.key] = r.ok;

    setAvailability(next);
    setVideoId(id);
    setLoading(false);
  };

  const shareUrl = useMemo(() => (videoId ? `https://www.youtube.com/watch?v=${videoId}` : ""), [videoId]);

  const handleShare = async () => {
    if (!videoId) return;
    const shareData = {
      title: "YouTube Thumbnail Preview",
      text: "Check out this YouTube video's thumbnails in every resolution.",
      url: shareUrl,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        /* user canceled */
      }
    } else {
      copyText(shareUrl, "Share link copied");
    }
  };

  const hqUrl = videoId ? thumbUrl(videoId, "hqdefault") : "";
  const maxUrl = videoId ? thumbUrl(videoId, "maxresdefault") : "";

  // Preview source for device frames — best available
  const previewSrc = videoId
    ? availability.maxresdefault
      ? maxUrl
      : availability.sddefault
      ? thumbUrl(videoId, "sddefault")
      : hqUrl
    : "";

  return (
    <ToolLayout
      title="YouTube Thumbnail Preview (All Sizes)"
      description="Paste any YouTube video, Short, or video ID to instantly preview every thumbnail resolution — and see how it looks on desktop, tablet, mobile, and TV. 100% free."
      icon={ImageIcon}
      badge="Free Tool · 5 Resolutions · 4 Devices"
    >
      <StatsStrip stats={stats} />

      {/* Input */}
      <ToolCard className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow">
            <LinkIcon className="w-4 h-4 text-red-600 shrink-0" aria-hidden />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handlePreview()}
              placeholder="Video URL, Shorts URL, or 11-character video ID…"
              aria-label="YouTube video URL, Shorts URL, or video ID"
              className="flex-1 py-3 outline-none text-sm font-medium bg-transparent"
            />
            {input && !loading && (
              <button
                onClick={reset}
                aria-label="Clear input"
                className="p-1 rounded-md hover:bg-neutral-100 transition shrink-0"
              >
                <X className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            )}
          </div>
          <PrimaryButton onClick={() => handlePreview()} disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Loading..." : "Preview Thumbnails"}
          </PrimaryButton>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-start gap-2 p-3 bg-red-50 border-2 border-red-300 rounded-xl"
              role="alert"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs font-bold text-red-700">{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-3 text-[11px] text-neutral-400 font-medium">
          Supports: <code className="font-mono">youtube.com/watch?v=…</code> · <code className="font-mono">youtu.be/…</code> · <code className="font-mono">/shorts/…</code> · <code className="font-mono">/live/…</code> · <code className="font-mono">/embed/…</code> · <code className="font-mono">m.youtube.com</code> · bare 11-char IDs
        </div>
      </ToolCard>

      {/* Loading skeleton */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="aspect-video bg-neutral-200 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded animate-pulse w-1/2" />
                  <div className="h-3 bg-neutral-200 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {!loading && videoId && (
          <motion.div
            key={videoId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16 space-y-8"
          >
            {/* Action bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-xs font-bold text-neutral-600 truncate min-w-0">
                Video ID: <span className="text-black font-black font-mono">{videoId}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setCompareOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-white border-2 border-black hover:bg-red-50 transition"
                >
                  <ArrowLeftRight className="w-3.5 h-3.5" /> Compare HQ vs Max
                </button>
                <button
                  onClick={handleShare}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-white border-2 border-black hover:bg-red-50 transition"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-black text-white border-2 border-black hover:bg-red-600 transition"
                >
                  Open on YouTube <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* THUMBNAIL GRID */}
            <section aria-label="Available thumbnail sizes">
              <h2 className="font-black text-lg mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-red-600" /> All Thumbnail Sizes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {SIZES.map((s, idx) => {
                  const url = thumbUrl(videoId, s.key);
                  const avail = availability[s.key];
                  if (!avail) return null;
                  const isMax = s.key === "maxresdefault";
                  const fname = filename(videoId, s.key);
                  return (
                    <motion.div
                      key={s.key}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      className="group bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col"
                    >
                      <div className="aspect-video bg-neutral-100 relative overflow-hidden">
                        <img
                          src={url}
                          alt={`${s.label} thumbnail (${s.width}×${s.height})`}
                          loading="lazy"
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                        />
                        <button
                          onClick={() => setZoom({ url, alt: `${s.label} thumbnail` })}
                          aria-label={`Zoom ${s.label} thumbnail`}
                          className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                        {isMax && (
                          <span className="absolute top-2 right-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-md border-2 border-black tracking-wide">
                            BEST
                          </span>
                        )}
                        <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-[10px] font-black rounded-md">
                          {s.width}×{s.height}
                        </span>
                      </div>

                      <div className="p-4 flex flex-col gap-3 border-t-2 border-black bg-white">
                        <div>
                          <div className="font-black text-sm">{s.label}</div>
                          <div className="text-[11px] font-bold text-neutral-500">{s.description}</div>
                          <div className="text-[10px] font-mono text-neutral-400 truncate mt-1">{fname}</div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <button
                            onClick={() => downloadAs(url, fname)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-red-600 text-white text-xs font-black rounded-lg border-2 border-black hover:bg-red-700 transition"
                          >
                            <Download className="w-3.5 h-3.5" /> Download
                          </button>
                          <button
                            onClick={() => {
                              copyText(url, "Image URL copied");
                              setCopiedKey(s.key);
                              setTimeout(() => setCopiedKey(null), 1200);
                            }}
                            aria-label="Copy image URL"
                            className={`inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-black rounded-lg border-2 border-black transition ${
                              copiedKey === s.key ? "bg-green-500 text-white" : "bg-white hover:bg-neutral-50"
                            }`}
                          >
                            {copiedKey === s.key ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Open thumbnail in new tab"
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white text-xs font-black rounded-lg border-2 border-black hover:bg-neutral-50 transition"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* DEVICE PREVIEW */}
            <section aria-label="Device preview" className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <h2 className="font-black text-lg flex items-center gap-2">
                  <Zap className="w-5 h-5 text-red-600" /> Device Preview
                </h2>
                <div role="tablist" aria-label="Choose device" className="flex flex-wrap gap-1.5">
                  {DEVICES.map((d) => {
                    const active = device === d.id;
                    return (
                      <button
                        key={d.id}
                        role="tab"
                        aria-selected={active}
                        onClick={() => setDevice(d.id)}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg border-2 transition ${
                          active
                            ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]"
                            : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                        }`}
                      >
                        <d.icon className="w-3.5 h-3.5" /> {d.label}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="bg-gradient-to-br from-neutral-50 to-neutral-100 border-2 border-dashed border-neutral-300 rounded-xl p-6 sm:p-10 flex items-center justify-center min-h-[280px]">
                {previewSrc ? (
                  <DeviceFrame device={device} src={previewSrc} alt="Thumbnail preview" />
                ) : (
                  <div className="text-sm font-bold text-neutral-400">No preview available</div>
                )}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>

      <GuideGrid
        badge="Preview Rules"
        title="How to read your thumbnail across resolutions"
        intro="Six rules for using YouTube's auto-generated thumbnails effectively — what to do, what to skip."
        cards={guides}
      />

      <Workflow
        title="Your 4-step preview workflow"
        steps={[
          { n: "01", t: "Paste your link", d: "Drop a YouTube URL, Shorts link, or 11-char video ID into the box above." },
          { n: "02", t: "Preview every size", d: "See all five YouTube thumbnail resolutions at once with file sizes labeled." },
          { n: "03", t: "Check on real devices", d: "Switch between desktop, tablet, mobile, and TV mockups to verify readability." },
          { n: "04", t: "Download or copy", d: "Save the resolution you need, or copy the direct image URL to your clipboard." },
        ]}
      />

      <SeoContent badge="Thumbnail Sizes Guide" title="YouTube thumbnail sizes & resolutions in 2026">
        <p>Every public YouTube video automatically ships with five thumbnail resolutions, served straight from YouTube's CDN. Knowing which size to use — and where — is essential for designers studying high-CTR thumbnails, mobile-feed testers, and creators verifying that their uploads look sharp at every scale.</p>
        <h3>The five YouTube thumbnail sizes explained</h3>
        <p><strong>120×90 (default):</strong> Tiny preview used in legacy embeds and notifications. <strong>320×180 (mqdefault):</strong> Mobile-feed preview — use it to test how your design holds at small sizes. <strong>480×360 (hqdefault):</strong> The default fallback for most placements. <strong>640×480 (sddefault):</strong> Standard-def 4:3 with letterbox padding. <strong>1280×720 (maxresdefault):</strong> YouTube's HD master file — use it for design reference, swipe files, and prints.</p>
        <h3>Why max resolution isn't always there</h3>
        <p>YouTube only generates the <strong>1280×720</strong> variant when the source video is at least HD. Older uploads or low-bitrate recordings will cap at <strong>sddefault</strong> or <strong>hqdefault</strong>. This tool checks every resolution in parallel and clearly marks any that aren't available.</p>
        <h3>Test on real devices before you publish</h3>
        <p>A thumbnail that looks great at 1280×720 in Photoshop can collapse to a mush at 320×180 on a phone in the For You feed. Use the device previews to see your thumbnail at the exact size it'll appear on desktop, tablet, mobile, and TV.</p>
        <h3>Pair with our other thumbnail tools</h3>
        <p>Need the raw files? Use our <a href="/tools/thumbnail-downloader">Thumbnail Downloader</a>. Want to generate brand-new thumbnails with AI? Try the <a href="/tools/ai-thumbnail-generator">AI Thumbnail Generator</a>.</p>
      </SeoContent>

      <FaqAccordion faqs={faqs} />

      <CrossCTA
        title="From preview to download — and beyond"
        desc="Now grab the file, or design a brand-new thumbnail with AI."
        primary={{ label: "Thumbnail Downloader", href: "/tools/thumbnail-downloader", icon: Download }}
        secondary={{ label: "AI Thumbnail Generator", href: "/tools/ai-thumbnail-generator", icon: Sparkles }}
      />

      {/* ─── ZOOM / FULLSCREEN MODAL ─── */}
      <AnimatePresence>
        {zoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(null)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Fullscreen thumbnail preview"
          >
            <button
              onClick={() => setZoom(null)}
              aria-label="Close preview"
              className="absolute top-4 right-4 p-2 rounded-lg bg-white text-black border-2 border-black hover:bg-red-600 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              src={zoom.url}
              alt={zoom.alt}
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full rounded-xl shadow-2xl border-2 border-white object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─── COMPARE MODAL ─── */}
      <AnimatePresence>
        {compareOpen && videoId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCompareOpen(false)}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Compare HQ vs Max resolution"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] overflow-hidden max-w-5xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between gap-3 p-4 border-b-2 border-black bg-black text-white">
                <h3 className="font-black text-base flex items-center gap-2">
                  <ArrowLeftRight className="w-4 h-4 text-red-500" /> HQ vs Max Resolution
                </h3>
                <button
                  onClick={() => setCompareOpen(false)}
                  aria-label="Close compare"
                  className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 sm:p-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-black text-sm">HQ <span className="text-neutral-500 font-bold">· 480×360</span></div>
                    <span className="text-[10px] font-black uppercase tracking-wider bg-green-100 text-green-700 border-2 border-green-400 rounded-full px-2 py-0.5">Always available</span>
                  </div>
                  <div className="aspect-video bg-neutral-100 border-2 border-black rounded-xl overflow-hidden">
                    <img src={hqUrl} alt="HQ thumbnail" className="w-full h-full object-cover" />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-black text-sm">Max <span className="text-neutral-500 font-bold">· 1280×720</span></div>
                    <span className={`text-[10px] font-black uppercase tracking-wider rounded-full px-2 py-0.5 border-2 ${
                      availability.maxresdefault
                        ? "bg-red-100 text-red-700 border-red-400"
                        : "bg-neutral-100 text-neutral-500 border-neutral-300"
                    }`}>
                      {availability.maxresdefault ? "HD available" : "Not available"}
                    </span>
                  </div>
                  <div className="aspect-video bg-neutral-100 border-2 border-black rounded-xl overflow-hidden">
                    {availability.maxresdefault ? (
                      <img src={maxUrl} alt="Max thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500 gap-1">
                        <XCircle className="w-8 h-8" />
                        <div className="text-xs font-black uppercase tracking-wider">Not Available</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </ToolLayout>
  );
}
