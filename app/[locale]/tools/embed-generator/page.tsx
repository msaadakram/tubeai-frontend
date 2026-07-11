"use client";

import { copyToClipboard } from "@/lib/clipboard";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  Code2,
  Link as LinkIcon,
  Loader2,
  Copy,
  Check,
  Download,
  RotateCcw,
  Share2,
  Maximize2,
  Minimize2,
  Monitor,
  Smartphone,
  Tablet,
  Sparkles,
  Sun,
  Moon,
  X,
  AlertCircle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sliders,
  Play,
} from "lucide-react";
import { ToolLayout, ToolCard, PrimaryButton } from "@/components/tools/ToolLayout";
import { TurnstileGate } from "@/components/tools/TurnstileGate";
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import {
  StatsStrip,
  GuideGrid,
  Workflow,
  SeoContent,
  FaqAccordion,
  CrossCTA,
} from "@/components/tools/ToolSections";
import { useTurnstileSession } from "@/hooks/useTurnstileSession";

// ─── Types ───
type AspectRatio = "16:9" | "4:3" | "1:1" | "9:16" | "custom";
type DevicePreview = "desktop" | "tablet" | "mobile";

type EmbedOptions = {
  // sizing
  responsive: boolean;
  aspectRatio: AspectRatio;
  customRatio: string; // "21:9"
  width: number;
  height: number;
  // player behavior
  autoplay: boolean;
  mute: boolean;
  loop: boolean;
  controls: boolean;
  fullscreen: boolean;
  modestBranding: boolean;
  disableKeyboard: boolean;
  privacyEnhanced: boolean; // youtube-nocookie
  // timing
  startTime: number;
  endTime: number;
  // related
  showRelated: boolean;
  // captions
  closedCaptions: boolean;
  captionLanguage: string;
  // playback
  playbackSpeed: number;
  // api
  enableJsApi: boolean;
  originDomain: string;
  // playlist
  playlistId: string;
  playlistLoop: boolean;
  // theme
  colorTheme: "red" | "white";
  previewTheme: "light" | "dark";
};

const DEFAULTS: EmbedOptions = {
  responsive: true,
  aspectRatio: "16:9",
  customRatio: "21:9",
  width: 560,
  height: 315,
  autoplay: false,
  mute: false,
  loop: false,
  controls: true,
  fullscreen: true,
  modestBranding: false,
  disableKeyboard: false,
  privacyEnhanced: false,
  startTime: 0,
  endTime: 0,
  showRelated: false,
  closedCaptions: false,
  captionLanguage: "en",
  playbackSpeed: 1,
  enableJsApi: false,
  originDomain: "",
  playlistId: "",
  playlistLoop: false,
  colorTheme: "red",
  previewTheme: "light",
};

// ─── URL parser ───
function extractVideoId(input: string): string | null {
  const raw = input.trim();
  if (!raw) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) return raw;
  let url: URL;
  try {
    url = new URL(raw.match(/^https?:\/\//) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
  if (host === "youtu.be") {
    const id = url.pathname.split("/").filter(Boolean)[0];
    return id && /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  }
  if (host === "youtube.com" || host === "youtube-nocookie.com") {
    const v = url.searchParams.get("v");
    if (v && /^[A-Za-z0-9_-]{11}$/.test(v)) return v;
    const segs = url.pathname.split("/").filter(Boolean);
    if (segs.length >= 2 && ["shorts", "live", "embed", "v"].includes(segs[0])) {
      const id = segs[1];
      if (/^[A-Za-z0-9_-]{11}$/.test(id)) return id;
    }
  }
  return null;
}

function ratioToPadding(opts: EmbedOptions): string {
  if (opts.aspectRatio === "custom") {
    const m = opts.customRatio.match(/^(\d+(?:\.\d+)?)\s*:\s*(\d+(?:\.\d+)?)$/);
    if (m) {
      const w = parseFloat(m[1]);
      const h = parseFloat(m[2]);
      if (w > 0 && h > 0) return `${((h / w) * 100).toFixed(4)}%`;
    }
    return "56.25%";
  }
  const map: Record<Exclude<AspectRatio, "custom">, string> = {
    "16:9": "56.25%",
    "4:3":  "75%",
    "1:1":  "100%",
    "9:16": "177.7778%",
  };
  return map[opts.aspectRatio];
}

function buildEmbedSrc(videoId: string, opts: EmbedOptions): string {
  const host = opts.privacyEnhanced ? "https://www.youtube-nocookie.com" : "https://www.youtube.com";
  const params = new URLSearchParams();

  if (opts.autoplay)            params.set("autoplay", "1");
  if (opts.mute || opts.autoplay) params.set("mute", "1"); // browsers require mute for autoplay
  if (opts.loop) {
    params.set("loop", "1");
    if (!opts.playlistId) params.set("playlist", videoId); // loop requires playlist
  }
  if (!opts.controls)           params.set("controls", "0");
  if (!opts.fullscreen)         params.set("fs", "0");
  if (opts.modestBranding)      params.set("modestbranding", "1");
  if (opts.disableKeyboard)     params.set("disablekb", "1");
  if (opts.startTime > 0)       params.set("start", String(Math.floor(opts.startTime)));
  if (opts.endTime > 0)         params.set("end", String(Math.floor(opts.endTime)));
  if (!opts.showRelated)        params.set("rel", "0");
  if (opts.closedCaptions) {
    params.set("cc_load_policy", "1");
    if (opts.captionLanguage)   params.set("cc_lang_pref", opts.captionLanguage);
  }
  if (opts.enableJsApi)         params.set("enablejsapi", "1");
  if (opts.originDomain.trim()) params.set("origin", opts.originDomain.trim());
  if (opts.colorTheme === "white") params.set("color", "white");
  if (opts.playlistId.trim())   params.set("list", opts.playlistId.trim());
  if (opts.playlistId.trim() && opts.playlistLoop) params.set("loop", "1");

  const qs = params.toString();
  return `${host}/embed/${videoId}${qs ? `?${qs}` : ""}`;
}

function buildEmbedHtml(videoId: string, opts: EmbedOptions): string {
  const src = buildEmbedSrc(videoId, opts);
  const allowAttrs = [
    "accelerometer",
    opts.autoplay ? "autoplay" : null,
    "clipboard-write",
    "encrypted-media",
    "gyroscope",
    "picture-in-picture",
    opts.fullscreen ? "web-share" : null,
  ].filter(Boolean).join("; ");

  if (opts.responsive) {
    const pad = ratioToPadding(opts);
    return [
      `<div style="position:relative;width:100%;padding-bottom:${pad};height:0;overflow:hidden;">`,
      `  <iframe`,
      `    src="${src}"`,
      `    style="position:absolute;top:0;left:0;width:100%;height:100%;border:0;"`,
      `    title="YouTube video player"`,
      `    loading="lazy"`,
      `    allow="${allowAttrs}"`,
      opts.fullscreen ? `    allowfullscreen` : null,
      `    referrerpolicy="strict-origin-when-cross-origin">`,
      `  </iframe>`,
      `</div>`,
    ].filter(Boolean).join("\n");
  }

  return [
    `<iframe`,
    `  width="${opts.width}"`,
    `  height="${opts.height}"`,
    `  src="${src}"`,
    `  title="YouTube video player"`,
    `  loading="lazy"`,
    `  allow="${allowAttrs}"`,
    opts.fullscreen ? `  allowfullscreen` : null,
    `  referrerpolicy="strict-origin-when-cross-origin">`,
    `</iframe>`,
  ].filter(Boolean).join("\n");
}

// Very lightweight HTML syntax highlighter (no external dep)
function highlightHtml(code: string): React.ReactNode {
  const parts: React.ReactNode[] = [];
  const regex = /(<\/?)([a-zA-Z][\w-]*)|([\w-]+)(=)("[^"]*"|'[^']*')|(<!--[\s\S]*?-->|<\?[\s\S]*?\?>|>)/g;
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = regex.exec(code)) !== null) {
    if (m.index > lastIndex) {
      parts.push(<span key={`t-${i++}`}>{code.slice(lastIndex, m.index)}</span>);
    }
    if (m[1] && m[2]) {
      parts.push(<span key={`b-${i++}`} className="text-neutral-400">{m[1]}</span>);
      parts.push(<span key={`tg-${i++}`} className="text-red-400">{m[2]}</span>);
    } else if (m[3] && m[4] && m[5]) {
      parts.push(<span key={`a-${i++}`} className="text-yellow-300">{m[3]}</span>);
      parts.push(<span key={`eq-${i++}`} className="text-neutral-400">{m[4]}</span>);
      parts.push(<span key={`v-${i++}`} className="text-green-300">{m[5]}</span>);
    } else if (m[6]) {
      parts.push(<span key={`p-${i++}`} className="text-neutral-400">{m[6]}</span>);
    }
    lastIndex = m.index + m[0].length;
  }
  if (lastIndex < code.length) parts.push(<span key={`tail-${i++}`}>{code.slice(lastIndex)}</span>);
  return parts;
}

const stats = [
  { value: "20+", label: "Customization Options" },
  { value: "5",  label: "Aspect Ratios" },
  { value: "3",  label: "Device Previews" },
  { value: "100%", label: "Free Forever" },
];

const guides = [
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Use responsive mode", desc: "Responsive iframes adapt to any screen — critical for mobile-first sites and blog posts." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Enable privacy mode for compliance", desc: "youtube-nocookie.com blocks YouTube tracking cookies until playback — friendlier for GDPR/CCPA." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Add loading=\"lazy\"", desc: "Lazy-loaded iframes only load when scrolled into view, dramatically improving page speed scores." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't autoplay with sound", desc: "Browsers block autoplay unless the video is muted. Always pair autoplay with mute." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't strip the title attribute", desc: "The title attribute is required for accessibility — screen readers depend on it." },
  { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100", title: "Loop needs a playlist", desc: "The loop param only works when paired with a playlist param — we add it automatically for you." },
];

const faqs = [
  { q: "What's the difference between responsive and fixed embeds?", a: "A responsive embed scales to fill its container at any screen size, preserving the chosen aspect ratio. A fixed embed uses the exact width and height you specify. For blog posts and websites, responsive is almost always the right choice." },
  { q: "Why does YouTube ignore my autoplay setting?", a: "Modern browsers block autoplay with sound. We automatically add mute=1 when autoplay is enabled so the video can actually start playing — this is a browser requirement, not a YouTube one." },
  { q: "What does Privacy Enhanced Mode do?", a: "It uses youtube-nocookie.com instead of youtube.com, which prevents YouTube from setting tracking cookies until the user clicks play. Recommended for GDPR/CCPA-conscious sites." },
  { q: "Why doesn't loop work for a single video?", a: "YouTube's loop param only works in combination with a playlist param. We automatically set playlist=VIDEO_ID for you when you enable loop on a single video." },
  { q: "Is this tool free?", a: "100% free, no signup, no watermark, unlimited generations forever." },
];

// ─── Page ───
export default function EmbedGeneratorPage() {
  const [input, setInput] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [opts, setOpts] = useState<EmbedOptions>(DEFAULTS);
  const [device, setDevice] = useState<DevicePreview>("desktop");
  const [codeFullscreen, setCodeFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { verified, turnstileRef, onSuccess, onExpire, onError } = useTurnstileSession();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && codeFullscreen) setCodeFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [codeFullscreen]);

  const update = <K extends keyof EmbedOptions>(key: K, value: EmbedOptions[K]) => {
    setOpts((prev) => ({ ...prev, [key]: value }));
  };

  const handleGenerate = (val?: string) => {
    const raw = (val ?? input).trim();
    if (!raw) return;
    if (val !== undefined) setInput(val);
    setLoading(true);
    setError(null);

    setTimeout(() => {
      const id = extractVideoId(raw);
      if (!id) {
        setError("That doesn't look like a valid YouTube URL or video ID. Try a full link or the 11-character ID.");
        setVideoId(null);
      } else {
        setVideoId(id);
      }
      setLoading(false);
    }, 350);
  };

  const reset = () => {
    setInput("");
    setVideoId(null);
    setError(null);
    setOpts(DEFAULTS);
    inputRef.current?.focus();
    toast.success("Reset to defaults");
  };

  const embedHtml = useMemo(() => (videoId ? buildEmbedHtml(videoId, opts) : ""), [videoId, opts]);
  const embedSrc = useMemo(() => (videoId ? buildEmbedSrc(videoId, opts) : ""), [videoId, opts]);

  const copyCode = async () => {
    if (!embedHtml) return;
    try {
      await copyToClipboard(embedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success("Embed code copied to clipboard");
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  };

  const downloadHtml = () => {
    if (!embedHtml || !videoId) return;
    const doc = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>YouTube Embed — ${videoId}</title>
<style>body{font-family:system-ui,sans-serif;max-width:960px;margin:2rem auto;padding:0 1rem}</style>
</head>
<body>
${embedHtml}
</body>
</html>`;
    const blob = new Blob([doc], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `youtube-embed-${videoId}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast.success("HTML file downloaded");
  };

  const handleShare = async () => {
    if (!videoId) return;
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    if (navigator.share) {
      try { await navigator.share({ title: "YouTube Embed", url }); } catch { /* user canceled */ }
    } else {
      try {
        await copyToClipboard(url);
        toast.success("Video link copied");
      } catch {
        toast.error("Couldn't copy");
      }
    }
  };

  const previewMaxWidth =
    device === "mobile" ? 360 :
    device === "tablet" ? 720 :
    1080;

  return (
    <ToolLayout
      title="YouTube Embed Generator"
      description="Generate responsive YouTube embed code with custom player settings — autoplay, loop, captions, privacy mode, and more — with a live preview."
      icon={Code2}
      badge="Free Tool · 20+ Customization Options"
    >
      <StatsStrip stats={stats} />

      {/* ─── URL INPUT ─── */}
      <ToolCard className="mb-6">
        <TurnstileGate verified={verified} turnstileRef={turnstileRef} onSuccess={onSuccess} onExpire={onExpire} onError={onError}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow min-w-0">
              <LinkIcon className="w-4 h-4 text-red-600 shrink-0" aria-hidden />
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                placeholder="Video URL or 11-char ID…"
                aria-label="YouTube video URL or video ID"
                className="flex-1 py-3 outline-none text-sm font-medium bg-transparent min-w-0"
              />
              {input && !loading && (
                <button
                  onClick={() => { setInput(""); setVideoId(null); setError(null); inputRef.current?.focus(); }}
                  aria-label="Clear input"
                  className="p-1 rounded-md hover:bg-neutral-100 transition shrink-0"
                >
                  <X className="w-3.5 h-3.5 text-neutral-500" />
                </button>
              )}
            </div>
            <PrimaryButton onClick={() => handleGenerate()} disabled={loading || !input.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {loading ? "Generating..." : "Generate Embed"}
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
        </TurnstileGate>
      </ToolCard>

      {!videoId && loading && (
        <div className="mb-12 sm:mb-16 grid lg:grid-cols-2 gap-5">
          <div className="bg-white border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-3">
            {[0, 1, 2, 3].map((i) => <div key={i} className="h-10 bg-neutral-100 rounded animate-pulse" />)}
          </div>
          <div className="bg-white border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="aspect-video bg-neutral-200 rounded-lg animate-pulse" />
          </div>
        </div>
      )}

      {videoId && (
        <motion.div
          key={videoId}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 sm:mb-16 space-y-6"
        >
          {/* ─── ACTION BAR ─── */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center sm:justify-between gap-3 p-4 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <div className="text-xs font-bold text-neutral-600 truncate min-w-0">
              Video ID: <span className="text-black font-black font-mono">{videoId}</span>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
              <button onClick={copyCode} className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-black text-white border-2 border-black hover:bg-red-600 transition">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? "Copied" : "Copy Code"}
              </button>
              <button onClick={downloadHtml} className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-white border-2 border-black hover:bg-red-50 transition">
                <Download className="w-3.5 h-3.5" /> Download
              </button>
              <button onClick={handleShare} className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-white border-2 border-black hover:bg-red-50 transition">
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              <button onClick={reset} className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-white border-2 border-black hover:bg-red-50 transition">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-6">
            {/* ─── OPTIONS PANEL ─── */}
            <section aria-label="Embed customization" className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-w-0">
              <div className="px-5 py-3 border-b-2 border-black bg-neutral-50 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-red-600" />
                <h2 className="font-black text-sm">Customization</h2>
              </div>

              <div className="p-4 sm:p-5 space-y-6 max-h-[640px] sm:max-h-[760px] lg:max-h-[820px] overflow-y-auto">
                {/* SIZING */}
                <FieldGroup title="Sizing">
                  <ToggleField label="Responsive iframe" value={opts.responsive} onChange={(v) => update("responsive", v)} desc="Scales to fill any container width" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SelectField label="Aspect Ratio" value={opts.aspectRatio} onChange={(v) => update("aspectRatio", v as AspectRatio)} options={[
                      { value: "16:9", label: "16:9 (Standard)" },
                      { value: "4:3", label: "4:3 (Classic)" },
                      { value: "1:1", label: "1:1 (Square)" },
                      { value: "9:16", label: "9:16 (Vertical)" },
                      { value: "custom", label: "Custom…" },
                    ]} disabled={!opts.responsive} />
                    {opts.aspectRatio === "custom" && opts.responsive && (
                      <TextField label="Custom Ratio" value={opts.customRatio} onChange={(v) => update("customRatio", v)} placeholder="21:9" />
                    )}
                  </div>
                  {!opts.responsive && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <NumberField label="Width (px)" value={opts.width} onChange={(v) => update("width", v)} min={120} max={3840} />
                      <NumberField label="Height (px)" value={opts.height} onChange={(v) => update("height", v)} min={90} max={2160} />
                    </div>
                  )}
                </FieldGroup>

                {/* PLAYBACK */}
                <FieldGroup title="Playback">
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    <ToggleField compact label="Autoplay" value={opts.autoplay} onChange={(v) => update("autoplay", v)} />
                    <ToggleField compact label="Mute" value={opts.mute || opts.autoplay} onChange={(v) => update("mute", v)} disabled={opts.autoplay} />
                    <ToggleField compact label="Loop" value={opts.loop} onChange={(v) => update("loop", v)} />
                    <ToggleField compact label="Show Controls" value={opts.controls} onChange={(v) => update("controls", v)} />
                    <ToggleField compact label="Fullscreen" value={opts.fullscreen} onChange={(v) => update("fullscreen", v)} />
                    <ToggleField compact label="Modest Branding" value={opts.modestBranding} onChange={(v) => update("modestBranding", v)} />
                    <ToggleField compact label="Disable Keyboard" value={opts.disableKeyboard} onChange={(v) => update("disableKeyboard", v)} />
                    <ToggleField compact label="Show Related" value={opts.showRelated} onChange={(v) => update("showRelated", v)} />
                  </div>
                </FieldGroup>

                {/* TIMING */}
                <FieldGroup title="Timing">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <NumberField label="Start time (s)" value={opts.startTime} onChange={(v) => update("startTime", v)} min={0} />
                    <NumberField label="End time (s)" value={opts.endTime} onChange={(v) => update("endTime", v)} min={0} />
                  </div>
                </FieldGroup>

                {/* CAPTIONS */}
                <FieldGroup title="Captions">
                  <ToggleField label="Closed captions on by default" value={opts.closedCaptions} onChange={(v) => update("closedCaptions", v)} />
                  {opts.closedCaptions && (
                    <TextField label="Caption Language (ISO code)" value={opts.captionLanguage} onChange={(v) => update("captionLanguage", v)} placeholder="en, es, fr…" />
                  )}
                </FieldGroup>

                {/* PRIVACY & API */}
                <FieldGroup title="Privacy & API">
                  <ToggleField label="Privacy Enhanced Mode (youtube-nocookie)" value={opts.privacyEnhanced} onChange={(v) => update("privacyEnhanced", v)} desc="Blocks tracking cookies until play" />
                  <ToggleField label="Enable JS API (postMessage)" value={opts.enableJsApi} onChange={(v) => update("enableJsApi", v)} />
                  {opts.enableJsApi && (
                    <TextField label="Origin domain" value={opts.originDomain} onChange={(v) => update("originDomain", v)} placeholder="https://yoursite.com" />
                  )}
                </FieldGroup>

                {/* PLAYLIST */}
                <FieldGroup title="Playlist">
                  <TextField label="Playlist ID (optional)" value={opts.playlistId} onChange={(v) => update("playlistId", v)} placeholder="PL…" />
                  {opts.playlistId && (
                    <ToggleField compact label="Loop playlist" value={opts.playlistLoop} onChange={(v) => update("playlistLoop", v)} />
                  )}
                </FieldGroup>

                {/* THEME */}
                <FieldGroup title="Theme">
                  <SelectField label="Progress bar color" value={opts.colorTheme} onChange={(v) => update("colorTheme", v as "red" | "white")} options={[
                    { value: "red", label: "Red (default)" },
                    { value: "white", label: "White" },
                  ]} />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => update("previewTheme", "light")}
                      aria-pressed={opts.previewTheme === "light"}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-black rounded-lg border-2 transition ${
                        opts.previewTheme === "light" ? "bg-white text-black border-black shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]" : "bg-white text-neutral-600 border-neutral-300 hover:border-black"
                      }`}
                    >
                      <Sun className="w-3.5 h-3.5" /> Light Preview
                    </button>
                    <button
                      onClick={() => update("previewTheme", "dark")}
                      aria-pressed={opts.previewTheme === "dark"}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-black rounded-lg border-2 transition ${
                        opts.previewTheme === "dark" ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]" : "bg-white text-neutral-600 border-neutral-300 hover:border-black"
                      }`}
                    >
                      <Moon className="w-3.5 h-3.5" /> Dark Preview
                    </button>
                  </div>
                </FieldGroup>

                {/* PLAYBACK SPEED (note) */}
                <FieldGroup title="Playback Speed">
                  <SelectField label="Default playback speed (hint only)" value={String(opts.playbackSpeed)} onChange={(v) => update("playbackSpeed", parseFloat(v))} options={[
                    { value: "0.5", label: "0.5×" },
                    { value: "0.75", label: "0.75×" },
                    { value: "1", label: "1× (normal)" },
                    { value: "1.25", label: "1.25×" },
                    { value: "1.5", label: "1.5×" },
                    { value: "2", label: "2×" },
                  ]} />
                  <p className="text-[10px] font-bold text-neutral-400 -mt-1">YouTube ignores this in iframes — viewers can change it from the player menu.</p>
                </FieldGroup>
              </div>
            </section>

            {/* ─── PREVIEW + CODE ─── */}
            <section className="space-y-6 min-w-0">
              {/* DEVICE PREVIEW */}
              <div className={`border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden ${opts.previewTheme === "dark" ? "bg-neutral-900" : "bg-white"}`}>
                <div className={`px-4 sm:px-5 py-3 border-b-2 border-black flex flex-wrap items-center justify-between gap-3 ${opts.previewTheme === "dark" ? "bg-black text-white" : "bg-neutral-50 text-black"}`}>
                  <h2 className="font-black text-sm flex items-center gap-2">
                    <Play className="w-4 h-4 text-red-500" /> Live Preview
                  </h2>
                  <div role="tablist" aria-label="Device" className="flex flex-wrap gap-1">
                    {([
                      { id: "desktop", label: "Desktop", icon: Monitor },
                      { id: "tablet", label: "Tablet", icon: Tablet },
                      { id: "mobile", label: "Mobile", icon: Smartphone },
                    ] as { id: DevicePreview; label: string; icon: typeof Monitor }[]).map((d) => {
                      const active = device === d.id;
                      return (
                        <button
                          key={d.id}
                          role="tab"
                          aria-selected={active}
                          onClick={() => setDevice(d.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-black rounded-lg border-2 transition shrink-0 ${
                            active
                              ? "bg-red-600 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              : opts.previewTheme === "dark"
                              ? "bg-white/5 text-neutral-300 border-white/10 hover:border-white/40"
                              : "bg-white text-neutral-700 border-neutral-300 hover:border-black"
                          }`}
                        >
                          <d.icon className="w-3.5 h-3.5" /> {d.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className={`p-3 sm:p-5 flex items-center justify-center ${opts.previewTheme === "dark" ? "bg-neutral-900" : "bg-neutral-50"}`}>
                  <div className="w-full mx-auto max-w-full" style={{ maxWidth: previewMaxWidth }}>
                    {opts.responsive ? (
                      <div style={{ position: "relative", width: "100%", paddingBottom: ratioToPadding(opts), height: 0, overflow: "hidden" }} className="rounded-xl border-2 border-black overflow-hidden bg-black">
                        <iframe
                          src={embedSrc}
                          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                          title="YouTube preview"
                          loading="lazy"
                          allow={`accelerometer; ${opts.autoplay ? "autoplay; " : ""}clipboard-write; encrypted-media; gyroscope; picture-in-picture`}
                          allowFullScreen={opts.fullscreen}
                          referrerPolicy="strict-origin-when-cross-origin"
                        />
                      </div>
                    ) : (
                      <div className="w-full" style={{ maxWidth: opts.width }}>
                        <div style={{ position: "relative", width: "100%", paddingBottom: `${((opts.height / opts.width) * 100).toFixed(4)}%`, height: 0, overflow: "hidden" }} className="rounded-xl border-2 border-black overflow-hidden bg-black">
                          <iframe
                            src={embedSrc}
                            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                            title="YouTube preview"
                            loading="lazy"
                            allow={`accelerometer; ${opts.autoplay ? "autoplay; " : ""}clipboard-write; encrypted-media; gyroscope; picture-in-picture`}
                            allowFullScreen={opts.fullscreen}
                            referrerPolicy="strict-origin-when-cross-origin"
                          />
                        </div>
                        <div className={`mt-2 text-center text-[10px] font-black ${opts.previewTheme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
                          Fixed {opts.width}×{opts.height} (scaled to fit container)
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CODE BLOCK */}
              <CodeBlock
                code={embedHtml}
                onCopy={copyCode}
                copied={copied}
                onDownload={downloadHtml}
                onFullscreen={() => setCodeFullscreen(true)}
              />
            </section>
          </div>
        </motion.div>
      )}

      <GuideGrid
        badge="Embed Rules"
        title="How to embed YouTube videos the right way"
        intro="Six rules for shipping fast, accessible, privacy-friendly YouTube embeds."
        cards={guides}
      />

      <Workflow
        title="Your 4-step embed workflow"
        steps={[
          { n: "01", t: "Paste a YouTube link", d: "Drop any YouTube URL, Shorts link, embed URL, or 11-char video ID into the input." },
          { n: "02", t: "Tune the options", d: "Toggle autoplay, mute, loop, captions, privacy mode — every change updates the live preview." },
          { n: "03", t: "Preview on any device", d: "Switch between desktop, tablet, and mobile to verify the embed looks right everywhere." },
          { n: "04", t: "Copy or download", d: "Copy the embed code to your clipboard, or download a ready-to-open HTML file." },
        ]}
      />

      <SeoContent badge="Complete Embed Guide" title="How to embed YouTube videos in 2026">
        <p>YouTube embeds are still the easiest way to add video to a website, but the default <em>Share → Embed</em> markup leaves a lot of performance and privacy on the table. This generator builds production-ready iframes with sensible defaults — <strong>responsive sizing</strong>, <strong>lazy loading</strong>, <strong>strict referrer policy</strong>, and an <strong>accessibility title</strong> — out of the box.</p>
        <h3>Responsive vs fixed embeds</h3>
        <p>Responsive embeds use a wrapper div with <code>padding-bottom</code> set to the inverse aspect ratio (56.25% for 16:9), letting the iframe stretch to any container width while preserving its shape. This is the right choice for almost every website. Fixed embeds use a hardcoded width and height — useful when you need a precise size.</p>
        <h3>Privacy Enhanced Mode (youtube-nocookie)</h3>
        <p>Switching from <code>youtube.com</code> to <code>youtube-nocookie.com</code> prevents YouTube from setting tracking cookies until the user actually plays the video. It's the same player, the same features — but more friendly to GDPR and CCPA compliance.</p>
        <h3>Autoplay quirks</h3>
        <p>Browsers will block autoplay with sound. We automatically pair <code>autoplay=1</code> with <code>mute=1</code> so your video actually starts. Viewers can unmute manually with one click.</p>
        <h3>Loop, captions, and the JS API</h3>
        <p>YouTube's <code>loop</code> parameter only works when paired with a <code>playlist</code> param — we set <code>playlist=VIDEO_ID</code> for you so single-video loops just work. The JS API toggle adds <code>enablejsapi=1</code> so you can control the player with <code>postMessage</code>; pair it with your site's <code>origin</code> for security.</p>
        <h3>Pair with our other thumbnail tools</h3>
        <p>Need to preview the thumbnail too? Use our <a href="/tools/thumbnail-preview">Thumbnail Preview</a> for all sizes, or our <a href="/tools/thumbnail-downloader">Thumbnail Downloader</a> for direct downloads.</p>
      </SeoContent>

      <FaqAccordion faqs={faqs} />

      <CrossCTA
        title="Now finish your video page"
        desc="Pair your embed with thumbnail previews and downloadable HD thumbs."
        primary={{ label: "Thumbnail Preview", href: "/tools/thumbnail-preview", icon: Monitor }}
        secondary={{ label: "Thumbnail Downloader", href: "/tools/thumbnail-downloader", icon: Download }}
      />

      {/* ─── CODE FULLSCREEN MODAL ─── */}
      <AnimatePresence>
        {codeFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCodeFullscreen(false)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Fullscreen embed code"
          >
            <motion.div
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-neutral-950 border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between gap-3 p-4 border-b-2 border-black bg-black text-white shrink-0">
                <h3 className="font-black text-base flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-red-500" /> Embed code
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={copyCode} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-red-600 hover:bg-red-700 transition">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy"}
                  </button>
                  <button onClick={() => setCodeFullscreen(false)} aria-label="Close" className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <pre className="flex-1 overflow-auto p-4 sm:p-5 text-[11px] sm:text-xs lg:text-sm font-mono text-neutral-100 leading-relaxed whitespace-pre">{highlightHtml(embedHtml)}</pre>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
          <ToolSeoJsonLd
        name="YouTube Embed Generator"
        description={"Generate responsive, privacy-enhanced YouTube embed codes with custom dimensions, start times, and captions."}
        slug="embed-generator"
        faqs={faqs}
        breadcrumb={[
          { name: "Home", slug: "/" },
          { name: "Tools", slug: "/tools" },
          { name: "YouTube Embed Generator", slug: "/tools/embed-generator" },
        ]}
      />
</ToolLayout>
  );
}

// ─── Sub-components ───
function FieldGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-2.5">{title}</div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function ToggleField({ label, value, onChange, desc, compact, disabled }: {
  label: string; value: boolean; onChange: (v: boolean) => void; desc?: string; compact?: boolean; disabled?: boolean;
}) {
  return (
    <label className={`flex items-center gap-3 ${compact ? "" : "p-2.5 rounded-lg border-2 border-neutral-200 hover:border-black transition"} ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={`relative inline-flex w-9 h-5 rounded-full border-2 border-black transition shrink-0 ${value ? "bg-red-600" : "bg-neutral-200"}`}
      >
        <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white border border-black transition-transform ${value ? "translate-x-4" : "translate-x-0.5"}`} />
      </button>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-black text-black">{label}</span>
        {desc && <span className="block text-[10px] font-bold text-neutral-500 mt-0.5">{desc}</span>}
      </span>
    </label>
  );
}

function TextField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm font-medium bg-neutral-50 border-2 border-black rounded-lg focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] transition"
      />
    </label>
  );
}

function NumberField({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">{label}</span>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={(e) => onChange(Number.isFinite(+e.target.value) ? +e.target.value : 0)}
        className="w-full px-3 py-2 text-sm font-medium tabular-nums bg-neutral-50 border-2 border-black rounded-lg focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] transition"
      />
    </label>
  );
}

function SelectField({ label, value, onChange, options, disabled }: {
  label: string; value: string; onChange: (v: string) => void; options: { value: string; label: string }[]; disabled?: boolean;
}) {
  return (
    <label className={`block ${disabled ? "opacity-50" : ""}`}>
      <span className="block text-[10px] font-black uppercase tracking-wider text-neutral-600 mb-1">{label}</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 text-sm font-medium bg-neutral-50 border-2 border-black rounded-lg focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_0px_rgba(220,38,38,1)] transition disabled:cursor-not-allowed"
      >
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </label>
  );
}

function CodeBlock({ code, onCopy, copied, onDownload, onFullscreen }: {
  code: string; onCopy: () => void; copied: boolean; onDownload: () => void; onFullscreen: () => void;
}) {
  return (
    <div className="bg-neutral-950 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="flex items-center justify-between gap-2 sm:gap-3 px-4 sm:px-5 py-3 border-b-2 border-black bg-black text-white">
        <h2 className="font-black text-sm flex items-center gap-2 min-w-0">
          <Code2 className="w-4 h-4 text-red-500 shrink-0" /> <span className="truncate">Generated Code</span>
        </h2>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button onClick={onCopy} aria-label="Copy code" className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-black rounded-lg bg-red-600 hover:bg-red-700 transition">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? "Copied" : "Copy"}</span>
          </button>
          <button onClick={onDownload} aria-label="Download HTML" className="inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 text-xs font-black rounded-lg bg-white/10 hover:bg-white/20 transition">
            <Download className="w-3.5 h-3.5" />
          </button>
          <button onClick={onFullscreen} aria-label="Fullscreen code" className="inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 text-xs font-black rounded-lg bg-white/10 hover:bg-white/20 transition">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <pre className="overflow-auto max-h-[300px] sm:max-h-[420px] p-4 sm:p-5 text-[11px] sm:text-xs lg:text-sm font-mono text-neutral-100 leading-relaxed whitespace-pre">{highlightHtml(code)}</pre>
    </div>
  );
}
