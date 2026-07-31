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
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import {
  StatsStrip,
  GuideGrid,
  Workflow,
  SeoContent,
  FaqAccordion,
  CrossCTA,
} from "@/components/tools/ToolSections";
import { useTranslations } from "@/lib/i18n/useTranslations";
import Link from "next/link";

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
    "4:3": "75%",
    "1:1": "100%",
    "9:16": "177.7778%",
  };
  return map[opts.aspectRatio];
}

function buildEmbedSrc(videoId: string, opts: EmbedOptions): string {
  const host = opts.privacyEnhanced ? "https://www.youtube-nocookie.com" : "https://www.youtube.com";
  const params = new URLSearchParams();

  if (opts.autoplay) params.set("autoplay", "1");
  if (opts.mute || opts.autoplay) params.set("mute", "1"); // browsers require mute for autoplay
  if (opts.loop) {
    params.set("loop", "1");
    if (!opts.playlistId) params.set("playlist", videoId); // loop requires playlist
  }
  if (!opts.controls) params.set("controls", "0");
  if (!opts.fullscreen) params.set("fs", "0");
  if (opts.modestBranding) params.set("modestbranding", "1");
  if (opts.disableKeyboard) params.set("disablekb", "1");
  if (opts.startTime > 0) params.set("start", String(Math.floor(opts.startTime)));
  if (opts.endTime > 0) params.set("end", String(Math.floor(opts.endTime)));
  if (!opts.showRelated) params.set("rel", "0");
  if (opts.closedCaptions) {
    params.set("cc_load_policy", "1");
    if (opts.captionLanguage) params.set("cc_lang_pref", opts.captionLanguage);
  }
  if (opts.enableJsApi) params.set("enablejsapi", "1");
  if (opts.originDomain.trim()) params.set("origin", opts.originDomain.trim());
  if (opts.colorTheme === "white") params.set("color", "white");
  if (opts.playlistId.trim()) params.set("list", opts.playlistId.trim());
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

const guidesColorsAndIcons = [
  { icon: CheckCircle2, color: "text-green-600 bg-green-100" },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100" },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100" },
  { icon: XCircle, color: "text-red-600 bg-red-100" },
  { icon: XCircle, color: "text-red-600 bg-red-100" },
  { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100" },
];

// ─── Page ───
export default function EmbedGeneratorPage() {
  const { t, locale } = useTranslations();
  const tc = t("toolPages.embedGenerator") as NonNullable<ReturnType<typeof t<"toolPages.embedGenerator">>>;
  const guides = tc.guides.map((g: { title: string; desc: string }, i: number) => ({
    ...g,
    icon: guidesColorsAndIcons[i % guidesColorsAndIcons.length].icon,
    color: guidesColorsAndIcons[i % guidesColorsAndIcons.length].color,
  }));

  const [input, setInput] = useState("");
  const [videoId, setVideoId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [opts, setOpts] = useState<EmbedOptions>(DEFAULTS);
  const [device, setDevice] = useState<DevicePreview>("desktop");
  const [codeFullscreen, setCodeFullscreen] = useState(false);
  const [copied, setCopied] = useState(false);
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
        setError(tc.errorInvalid);
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
    toast.success(tc.toastReset);
  };

  const embedHtml = useMemo(() => (videoId ? buildEmbedHtml(videoId, opts) : ""), [videoId, opts]);
  const embedSrc = useMemo(() => (videoId ? buildEmbedSrc(videoId, opts) : ""), [videoId, opts]);

  const copyCode = async () => {
    if (!embedHtml) return;
    try {
      await copyToClipboard(embedHtml);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
      toast.success(tc.toastCopied);
    } catch {
      toast.error(tc.toastCopyFailed);
    }
  };

  const downloadHtml = () => {
    if (!embedHtml || !videoId) return;
    const doc = `<!DOCTYPE html>
<html lang="${locale}">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${tc.uiShareTitle} — ${videoId}</title>
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
    toast.success(tc.toastHtmlDownloaded);
  };

  const handleShare = async () => {
    if (!videoId) return;
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    if (navigator.share) {
      try { await navigator.share({ title: tc.uiShareTitle, url }); } catch { /* user canceled */ }
    } else {
      try {
        await copyToClipboard(url);
        toast.success(tc.toastLinkCopied);
      } catch {
        toast.error(tc.toastLinkFailed);
      }
    }
  };

  const previewMaxWidth =
    device === "mobile" ? 360 :
      device === "tablet" ? 720 :
        1080;

  return (
    <ToolLayout
      title={tc.title}
      description={tc.description}
      icon={Code2}
      badge={tc.badge}
    >
      <StatsStrip stats={tc.stats} />

      {/* ─── URL INPUT ─── */}
      <ToolCard className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow min-w-0">
            <LinkIcon className="w-4 h-4 text-red-600 shrink-0" aria-hidden />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              placeholder={tc.inputPlaceholder}
              aria-label={tc.inputAriaLabel}
              className="flex-1 py-3 outline-none text-sm font-medium bg-transparent min-w-0"
            />
            {input && !loading && (
              <button
                onClick={() => { setInput(""); setVideoId(null); setError(null); inputRef.current?.focus(); }}
                aria-label={tc.uiClearInput}
                className="p-1 rounded-md hover:bg-neutral-100 transition shrink-0"
              >
                <X className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            )}
          </div>
          <PrimaryButton onClick={() => handleGenerate()} disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? tc.btnGenerating : tc.btnGenerate}
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
              {tc.videoIdPrefix} <span className="text-black font-black font-mono">{videoId}</span>
            </div>
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto">
              <button onClick={copyCode} className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-black text-white border-2 border-black hover:bg-red-600 transition">
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? tc.btnCopied : tc.btnCopy}
              </button>
              <button onClick={downloadHtml} className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-white border-2 border-black hover:bg-red-50 transition">
                <Download className="w-3.5 h-3.5" /> {tc.btnDownload}
              </button>
              <button onClick={handleShare} className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-white border-2 border-black hover:bg-red-50 transition">
                <Share2 className="w-3.5 h-3.5" /> {tc.btnShare}
              </button>
              <button onClick={reset} className="w-full sm:w-auto justify-center inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-white border-2 border-black hover:bg-red-50 transition">
                <RotateCcw className="w-3.5 h-3.5" /> {tc.btnReset}
              </button>
            </div>
          </div>

          <div className="grid lg:grid-cols-[1fr_1.15fr] gap-6">
            {/* ─── OPTIONS PANEL ─── */}
            <section aria-label={tc.uiCustomizationAria} className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-w-0">
              <div className="px-5 py-3 border-b-2 border-black bg-neutral-50 flex items-center gap-2">
                <Sliders className="w-4 h-4 text-red-600" />
                <h2 className="font-black text-sm">{tc.customizationTitle}</h2>
              </div>

              <div className="p-4 sm:p-5 space-y-6 max-h-[640px] sm:max-h-[760px] lg:max-h-[820px] overflow-y-auto">
                {/* SIZING */}
                <FieldGroup title={tc.sizingTitle}>
                  <ToggleField label={tc.responsiveLabel} value={opts.responsive} onChange={(v) => update("responsive", v)} desc={tc.responsiveDesc} />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <SelectField label={tc.aspectRatioLabel} value={opts.aspectRatio} onChange={(v) => update("aspectRatio", v as AspectRatio)} options={tc.aspectRatioOptions} disabled={!opts.responsive} />
                    {opts.aspectRatio === "custom" && opts.responsive && (
                      <TextField label={tc.customRatioLabel} value={opts.customRatio} onChange={(v) => update("customRatio", v)} placeholder="21:9" />
                    )}
                  </div>
                  {!opts.responsive && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <NumberField label={tc.widthLabel} value={opts.width} onChange={(v) => update("width", v)} min={120} max={3840} />
                      <NumberField label={tc.heightLabel} value={opts.height} onChange={(v) => update("height", v)} min={90} max={2160} />
                    </div>
                  )}
                </FieldGroup>

                {/* PLAYBACK */}
                <FieldGroup title={tc.playbackTitle}>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-2">
                    <ToggleField compact label={tc.autoplayLabel} value={opts.autoplay} onChange={(v) => update("autoplay", v)} />
                    <ToggleField compact label={tc.muteLabel} value={opts.mute || opts.autoplay} onChange={(v) => update("mute", v)} disabled={opts.autoplay} />
                    <ToggleField compact label={tc.loopLabel} value={opts.loop} onChange={(v) => update("loop", v)} />
                    <ToggleField compact label={tc.controlsLabel} value={opts.controls} onChange={(v) => update("controls", v)} />
                    <ToggleField compact label={tc.fullscreenLabel} value={opts.fullscreen} onChange={(v) => update("fullscreen", v)} />
                    <ToggleField compact label={tc.modestBrandingLabel} value={opts.modestBranding} onChange={(v) => update("modestBranding", v)} />
                    <ToggleField compact label={tc.disableKbLabel} value={opts.disableKeyboard} onChange={(v) => update("disableKeyboard", v)} />
                    <ToggleField compact label={tc.showRelatedLabel} value={opts.showRelated} onChange={(v) => update("showRelated", v)} />
                  </div>
                </FieldGroup>

                {/* TIMING */}
                <FieldGroup title={tc.timingTitle}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <NumberField label={tc.startTimeLabel} value={opts.startTime} onChange={(v) => update("startTime", v)} min={0} />
                    <NumberField label={tc.endTimeLabel} value={opts.endTime} onChange={(v) => update("endTime", v)} min={0} />
                  </div>
                </FieldGroup>

                {/* CAPTIONS */}
                <FieldGroup title={tc.captionsTitle}>
                  <ToggleField label={tc.closedCaptionsLabel} value={opts.closedCaptions} onChange={(v) => update("closedCaptions", v)} />
                  {opts.closedCaptions && (
                    <TextField label={tc.captionLanguageLabel} value={opts.captionLanguage} onChange={(v) => update("captionLanguage", v)} placeholder={tc.captionLanguagePlaceholder} />
                  )}
                </FieldGroup>

                {/* PRIVACY & API */}
                <FieldGroup title={tc.privacyTitle}>
                  <ToggleField label={tc.privacyEnhancedLabel} value={opts.privacyEnhanced} onChange={(v) => update("privacyEnhanced", v)} desc={tc.privacyEnhancedDesc} />
                  <ToggleField label={tc.enableJsApiLabel} value={opts.enableJsApi} onChange={(v) => update("enableJsApi", v)} />
                  {opts.enableJsApi && (
                    <TextField label={tc.originDomainLabel} value={opts.originDomain} onChange={(v) => update("originDomain", v)} placeholder={tc.originDomainPlaceholder} />
                  )}
                </FieldGroup>

                {/* PLAYLIST */}
                <FieldGroup title={tc.playlistTitle}>
                  <TextField label={tc.playlistIdLabel} value={opts.playlistId} onChange={(v) => update("playlistId", v)} placeholder={tc.playlistIdPlaceholder} />
                  {opts.playlistId && (
                    <ToggleField compact label={tc.playlistLoopLabel} value={opts.playlistLoop} onChange={(v) => update("playlistLoop", v)} />
                  )}
                </FieldGroup>

                {/* THEME */}
                <FieldGroup title={tc.themeTitle}>
                  <SelectField label={tc.progressBarColorLabel} value={opts.colorTheme} onChange={(v) => update("colorTheme", v as "red" | "white")} options={tc.progressBarOptions} />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => update("previewTheme", "light")}
                      aria-pressed={opts.previewTheme === "light"}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-black rounded-lg border-2 transition ${opts.previewTheme === "light" ? "bg-white text-black border-black shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]" : "bg-white text-neutral-600 border-neutral-300 hover:border-black"
                        }`}
                    >
                      <Sun className="w-3.5 h-3.5" /> {tc.previewLight}
                    </button>
                    <button
                      onClick={() => update("previewTheme", "dark")}
                      aria-pressed={opts.previewTheme === "dark"}
                      className={`flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-black rounded-lg border-2 transition ${opts.previewTheme === "dark" ? "bg-black text-white border-black shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]" : "bg-white text-neutral-600 border-neutral-300 hover:border-black"
                        }`}
                    >
                      <Moon className="w-3.5 h-3.5" /> {tc.previewDark}
                    </button>
                  </div>
                </FieldGroup>

                {/* PLAYBACK SPEED (note) */}
                <FieldGroup title={tc.speedTitle}>
                  <SelectField label={tc.speedLabel} value={String(opts.playbackSpeed)} onChange={(v) => update("playbackSpeed", parseFloat(v))} options={tc.speedOptions} />
                  <p className="text-[10px] font-bold text-neutral-400 -mt-1">{tc.speedNotice}</p>
                </FieldGroup>
              </div>
            </section>

            {/* ─── PREVIEW + CODE ─── */}
            <section className="space-y-6 min-w-0">
              {/* DEVICE PREVIEW */}
              <div className={`border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden ${opts.previewTheme === "dark" ? "bg-neutral-900" : "bg-white"}`}>
                <div className={`px-4 sm:px-5 py-3 border-b-2 border-black flex flex-wrap items-center justify-between gap-3 ${opts.previewTheme === "dark" ? "bg-black text-white" : "bg-neutral-50 text-black"}`}>
                  <h2 className="font-black text-sm flex items-center gap-2">
                    <Play className="w-4 h-4 text-red-500" /> {tc.previewTitle}
                  </h2>
                  <div role="tablist" aria-label={tc.uiDeviceAria} className="flex flex-wrap gap-1">
                    {([
                      { id: "desktop", label: tc.previewDesktop, icon: Monitor },
                      { id: "tablet", label: tc.previewTablet, icon: Tablet },
                      { id: "mobile", label: tc.previewMobile, icon: Smartphone },
                    ] as { id: DevicePreview; label: string; icon: typeof Monitor }[]).map((d) => {
                      const active = device === d.id;
                      return (
                        <button
                          key={d.id}
                          role="tab"
                          aria-selected={active}
                          onClick={() => setDevice(d.id)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-black rounded-lg border-2 transition shrink-0 ${active
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
                            title={tc.uiIframeTitle}
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
                          title={tc.uiIframeTitle}
                            loading="lazy"
                            allow={`accelerometer; ${opts.autoplay ? "autoplay; " : ""}clipboard-write; encrypted-media; gyroscope; picture-in-picture`}
                            allowFullScreen={opts.fullscreen}
                            referrerPolicy="strict-origin-when-cross-origin"
                          />
                        </div>
                        <div className={`mt-2 text-center text-[10px] font-black ${opts.previewTheme === "dark" ? "text-neutral-400" : "text-neutral-500"}`}>
                          {tc.previewFixedNotice.replace("{width}", String(opts.width)).replace("{height}", String(opts.height))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* CODE BLOCK */}
              <CodeBlock
                tc={tc}
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
        badge={tc.guideBadge}
        title={tc.guideTitle}
        intro={tc.guideIntro}
        cards={guides}
      />

      <Workflow
        title={tc.workflowTitle}
        steps={tc.workflows}
      />

      <SeoContent badge={tc.seoContent.badge} title={tc.seoContent.title}>
        <p>{tc.seoContent.p1}</p>
        <h3>{tc.seoContent.h3_1}</h3>
        <p>{tc.seoContent.p2_1}</p>
        <h3>{tc.seoContent.h3_2}</h3>
        <p>{tc.seoContent.p2_2}</p>
        <h3>{tc.seoContent.h3_3}</h3>
        <p>{tc.seoContent.p2_3}</p>
        <h3>{tc.seoContent.h3_4}</h3>
        <p>{tc.seoContent.p2_4}</p>
        <h3>{tc.seoContent.h3_5}</h3>
        <p>{tc.seoContent.p2_5} <Link href="/tools/thumbnail-preview">{tc.crossCta.btn1}</Link> {tc.crossCta.desc} <Link href="/tools/thumbnail-downloader">{tc.crossCta.btn2}</Link>.</p>
      </SeoContent>

      <FaqAccordion faqs={tc.faqs} />

      <CrossCTA
        title={tc.crossCta.title}
        desc={tc.crossCta.desc}
        primary={{ label: tc.crossCta.btn1, href: "/tools/thumbnail-preview", icon: Monitor }}
        secondary={{ label: tc.crossCta.btn2, href: "/tools/thumbnail-downloader", icon: Download }}
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
            aria-label={tc.uiFullscreen}
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
                  <Code2 className="w-4 h-4 text-red-500" /> {tc.codeTitle}
                </h3>
                <div className="flex items-center gap-2">
                  <button onClick={copyCode} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black rounded-lg bg-red-600 hover:bg-red-700 transition">
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? tc.btnCopied : tc.btnCopy}
                  </button>
                  <button onClick={() => setCodeFullscreen(false)} aria-label={tc.uiClose} className="p-1.5 rounded-md bg-white/10 hover:bg-white/20 transition">
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
        name={tc.title}
        description={tc.seoJsonDesc}
        slug="embed-generator"
        faqs={tc.faqs}
        breadcrumb={[
          { name: tc.breadcrumbHome, slug: "/" },
          { name: tc.breadcrumbTools, slug: "/tools" },
          { name: tc.title, slug: "/tools/embed-generator" },
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

function CodeBlock({ tc, code, onCopy, copied, onDownload, onFullscreen }: {
  tc: any; code: string; onCopy: () => void; copied: boolean; onDownload: () => void; onFullscreen: () => void;
}) {
  return (
    <div className="bg-neutral-950 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="flex items-center justify-between gap-2 sm:gap-3 px-4 sm:px-5 py-3 border-b-2 border-black bg-black text-white">
        <h2 className="font-black text-sm flex items-center gap-2 min-w-0">
          <Code2 className="w-4 h-4 text-red-500 shrink-0" /> <span className="truncate">{tc.codeTitle}</span>
        </h2>
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button onClick={onCopy} aria-label={tc.btnCopy} className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-black rounded-lg bg-red-600 hover:bg-red-700 transition">
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{copied ? tc.btnCopied : tc.btnCopy}</span>
          </button>
          <button onClick={onDownload} aria-label={tc.uiDownload} className="inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 text-xs font-black rounded-lg bg-white/10 hover:bg-white/20 transition">
            <Download className="w-3.5 h-3.5" />
          </button>
          <button onClick={onFullscreen} aria-label={tc.uiFullscreen} className="inline-flex items-center justify-center px-2.5 sm:px-3 py-1.5 text-xs font-black rounded-lg bg-white/10 hover:bg-white/20 transition">
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <pre className="overflow-auto max-h-[300px] sm:max-h-[420px] p-4 sm:p-5 text-[11px] sm:text-xs lg:text-sm font-mono text-neutral-100 leading-relaxed whitespace-pre">{highlightHtml(code)}</pre>
    </div>
  );
}
