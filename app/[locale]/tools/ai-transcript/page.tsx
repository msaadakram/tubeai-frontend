"use client";

import { copyToClipboard } from "@/lib/clipboard";
import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText,
  Loader2,
  Download,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  PenTool,
  Copy,
  Check,
  Clock,
  Youtube,
  User,
  Languages,
  Wand2,
  AlignLeft,
  ListOrdered,
} from "lucide-react";
import { ToolLayout, ToolCard, ToolInput, PrimaryButton } from "@/components/tools/ToolLayout";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import { LanguageSelect, getLanguage } from "@/components/tools/LanguageSelect";
import { StatsStrip, GuideGrid, Workflow, SeoContent, FaqAccordion, CrossCTA } from "@/components/tools/ToolSections";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.ytforge.app";

type Segment = {
  sequence: number;
  startSeconds: number;
  endSeconds: number;
  text: string;
  timestamp: string;
};

type LanguageInfo = {
  code: string;
  name: string;
  kind: "manual" | "auto-generated" | string;
  proxyUrl?: string;
};

type TranscriptData = {
  videoId: string;
  title: string;
  channelTitle: string;
  duration: string;
  thumbnails?: Record<string, { url: string; width?: number; height?: number }> | null;
  transcript: string | null;
  translatedText: string | null;
  captionLanguage?: string;
  segmentCount?: number;
  totalDurationFormatted?: string;
  segments?: Segment[];
  languages?: LanguageInfo[];
  instructions?: string;
};

const unused = true; // placeholder for diff

function pad(n: number, w = 2) {
  return String(Math.floor(n)).padStart(w, "0");
}

function toSrtTimestamp(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  const ms = Math.round((s - Math.floor(s)) * 1000);
  return `${pad(h)}:${pad(m)}:${pad(sec)},${pad(ms, 3)}`;
}

function buildSrt(segments: Segment[]) {
  return segments
    .map((s) => `${s.sequence}\n${toSrtTimestamp(s.startSeconds)} --> ${toSrtTimestamp(s.endSeconds)}\n${s.text}\n`)
    .join("\n");
}

function download(filename: string, content: string, type = "text/plain") {
  const blob = new Blob([content], { type });
  const u = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = u;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(u);
}

function parseIsoDuration(iso?: string): string {
  if (!iso) return "";
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso);
  if (!m) return iso;
  const h = parseInt(m[1] || "0", 10);
  const min = parseInt(m[2] || "0", 10);
  const s = parseInt(m[3] || "0", 10);
  if (h) return `${h}:${pad(min)}:${pad(s)}`;
  return `${min}:${pad(s)}`;
}

function friendlyError(raw: string, status: number, tc: any): string {
  if (/invalid youtube url/i.test(raw)) return tc.errorInvalidUrl;
  if (/no captions|not available/i.test(raw)) return tc.errorNoCaptions;
  if (status >= 500) return tc.errorServer;
  return tc.errorDefault;
}

export default function AITranscriptPage() {
  const { t } = useTranslations();
  const toolContent = t("toolPages.aiTranscript");
  const tc = toolContent as NonNullable<typeof toolContent>;

  const [url, setUrl] = useState("");
  const [lang, setLang] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TranscriptData | null>(null);
  const [view, setView] = useState<"plain" | "segments">("plain");
  const [showOriginal, setShowOriginal] = useState(false);
  const [copied, setCopied] = useState(false);

  const run = async (overrideLang?: string) => {
    if (!url.trim() || loading) return;
    const targetLang = overrideLang || lang;
    setLoading(true);
    setError(null);
    setData(null);
    setCopied(false);
    setShowOriginal(false);
    console.groupCollapsed("[Transcribe] POST /api/transcribe");
    console.log("URL:", url.trim(), "Language:", targetLang, "Endpoint:", `${BASE_URL}/api/transcribe`);
    try {
      const res = await fetch(`${BASE_URL}/api/transcribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), language: targetLang }),
      });
      console.log("HTTP status:", res.status, res.statusText);
      const body = await res.json().catch((e) => {
        console.error("[Transcribe] Failed to parse JSON response:", e);
        return {};
      });
      console.log("Response body:", body);
      if (!res.ok) {
        console.error("[Transcribe] Non-OK response:", res.status, body?.error);
        throw new Error(friendlyError(body?.error || "", res.status, tc));
      }
      if (!body?.success) {
        console.warn("[Transcribe] success=false. Reason from backend:", body?.error, "| Full body:", body);
        throw new Error(friendlyError(body?.error || "Transcript unavailable.", res.status, tc));
      }
      if (!body?.data?.transcript) {
        console.warn(
          "[Transcribe] No transcript in payload. languages.length =",
          body?.data?.languages?.length ?? 0,
          "→ This means YouTube blocked the backend's auto-fetch. UI will show CASE 2 (pick a language) or CASE 3 (no captions)."
        );
      }
      setData(body.data as TranscriptData);
    } catch (err: any) {
      console.error("[Transcribe] FAILED:", err?.message, err);
      setError(err?.message || tc.errorDefault);
    } finally {
      console.groupEnd();
      setLoading(false);
    }
  };

  // Fallback path: when initial response had transcript=null but provided proxyUrl per language.
  // GET /api/transcribe/fetch?url=<proxyUrl> → XML, then POST /api/transcribe/process.
  const runFromProxy = async (langInfo: LanguageInfo) => {
    if (loading || !langInfo.proxyUrl) return;
    setLoading(true);
    setError(null);
    setCopied(false);
    setShowOriginal(false);
    console.groupCollapsed(`[Transcribe Proxy] ${langInfo.code} (${langInfo.name})`);
    console.log("Step 1 — GET caption XML:", `${BASE_URL}${langInfo.proxyUrl}`);
    try {
      const xmlRes = await fetch(`${BASE_URL}${langInfo.proxyUrl}`);
      console.log("XML fetch status:", xmlRes.status, xmlRes.statusText);
      if (!xmlRes.ok) {
        console.error("[Transcribe Proxy] XML fetch failed:", xmlRes.status);
        throw new Error(friendlyError(`Caption fetch failed`, xmlRes.status, tc));
      }
      const xml = await xmlRes.text();
      console.log("XML length:", xml.length, "First 200 chars:", xml.slice(0, 200));
      if (!xml || xml.length < 20) {
        console.warn("[Transcribe Proxy] Caption track XML is empty / too short.");
        throw new Error(tc.errorDefault);
      }

      console.log("Step 2 — POST /api/transcribe/process with language:", lang);
      const procRes = await fetch(`${BASE_URL}/api/transcribe/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ xml, language: lang }),
      });
      console.log("Process HTTP status:", procRes.status, procRes.statusText);
      const procBody = await procRes.json().catch((e) => {
        console.error("[Transcribe Proxy] Failed to parse process JSON:", e);
        return {};
      });
      console.log("Process response body:", procBody);
      if (!procRes.ok || !procBody?.success) {
        console.error("[Transcribe Proxy] Process step failed:", procBody?.error);
        throw new Error(friendlyError(procBody?.error || "", procRes.status, tc));
      }
      const proc = procBody.data as Partial<TranscriptData>;
      setData((prev) => ({
        ...(prev as TranscriptData),
        transcript: proc.transcript ?? null,
        translatedText: proc.translatedText ?? null,
        captionLanguage: proc.captionLanguage,
        segmentCount: proc.segmentCount,
        totalDurationFormatted: proc.totalDurationFormatted,
        segments: proc.segments,
      }));
    } catch (err: any) {
      console.error("[Transcribe Proxy] FAILED:", err?.message, err);
      setError(err?.message || tc.errorDefault);
    } finally {
      console.groupEnd();
      setLoading(false);
    }
  };

  const transcriptText = useMemo(() => {
    if (!data) return "";
    if (showOriginal) return data.transcript || "";
    return data.translatedText?.trim() || data.transcript || "";
  }, [data, showOriginal]);

  const copy = async () => {
    if (!transcriptText) return;
    try {
      await copyToClipboard(transcriptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  const safeTitle = (data?.title || "transcript").replace(/[^\w\d-]+/g, "_").slice(0, 60);
  const thumb =
    data?.thumbnails?.maxres?.url ||
    data?.thumbnails?.standard?.url ||
    data?.thumbnails?.high?.url ||
    data?.thumbnails?.medium?.url ||
    data?.thumbnails?.default?.url ||
    (data?.videoId ? `https://i.ytimg.com/vi/${data.videoId}/hqdefault.jpg` : null);

  const hasTranscript = !!data?.transcript;
  const showLanguageToggle = !!data?.translatedText && data.captionLanguage !== lang;

  return (
    <ToolLayout
      title={tc.title || ""}
      description={tc.description || ""}
      icon={FileText}
      badge={tc.badge || ""}
    >
      <StatsStrip stats={tc.stats || []} />

      <ToolCard className="mb-6">
        <div className="flex flex-col gap-3">
          <ToolInput
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && run()}
            placeholder={tc.inputPlaceholder}
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 min-w-0">
              <LanguageSelect value={lang} onChange={setLang} compact label={tc.inputLanguageLabel} />
            </div>
            <PrimaryButton onClick={() => run()} disabled={loading || !url.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {loading ? tc.btnLoading : tc.btnGenerate}
            </PrimaryButton>
          </div>
        </div>
      </ToolCard>

      {/* Loading */}
      {loading && (
        <ToolCard className="mb-12 sm:mb-16">
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            <div className="text-xs font-black uppercase tracking-wider text-neutral-600">{tc.btnLoading}</div>
            <div className="w-full max-w-md space-y-2">
              <div className="h-3 rounded-full bg-neutral-200 animate-pulse" />
              <div className="h-3 rounded-full bg-neutral-200 animate-pulse w-5/6" />
              <div className="h-3 rounded-full bg-neutral-200 animate-pulse w-4/6" />
            </div>
          </div>
        </ToolCard>
      )}

      {/* Error */}
      {error && !loading && (
        <ToolCard className="mb-12 sm:mb-16 border-red-600">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-black text-sm text-black">{tc.errorTitle}</div>
              <div className="text-xs font-medium text-neutral-600 mt-1 break-words">{error}</div>
              <button
                onClick={() => {
                  setError(null);
                  setUrl("");
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black bg-white text-black text-[11px] font-black hover:bg-red-600 hover:text-white transition-colors"
              >
                {tc.errorRetryBtn}
              </button>
            </div>
          </div>
        </ToolCard>
      )}

      {/* Result */}
      <AnimatePresence>
        {data && !loading && (
          <motion.div
            key={data.videoId}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16 space-y-5"
          >
            {/* Video header */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="bg-black p-5 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center">
                <a
                  href={`https://youtube.com/watch?v=${data.videoId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative shrink-0 w-full sm:w-44 aspect-video rounded-xl overflow-hidden border-2 border-red-600 group"
                >
                  {thumb && <img src={thumb} alt={data.title} className="w-full h-full object-cover" />}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Youtube className="w-8 h-8 text-red-500" />
                  </div>
                </a>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-black text-lg sm:text-xl leading-snug line-clamp-2">{data.title}</div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] font-bold text-neutral-300">
                    {data.channelTitle && (
                      <span className="flex items-center gap-1"><User className="w-3 h-3" /> {data.channelTitle}</span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {data.totalDurationFormatted || parseIsoDuration(data.duration)}
                    </span>
                    {data.segmentCount != null && (
                      <span className="flex items-center gap-1"><AlignLeft className="w-3 h-3" /> {data.segmentCount.toLocaleString()} {tc.resultSegmentsSuffix}</span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.captionLanguage && (
                      <Badge icon={Languages} label={`${tc.resultSourcePrefix}: ${data.captionLanguage.toUpperCase()}`} color="green" />
                    )}
                    {data.translatedText && data.captionLanguage !== lang && (
                      <Badge icon={Sparkles} label={`${tc.resultTranslatedPrefix} → ${getLanguage(lang).name}`} color="red" />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CASE 3 — no captions at all */}
            {!hasTranscript && (!data.languages || data.languages.length === 0) && (
              <ToolCard className="border-red-600">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center shrink-0">
                    <XCircle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-sm text-black">{tc.resultNoCaptionsTitle}</div>
                    <div className="text-xs font-medium text-neutral-600 mt-1">
                      {data.instructions || tc.resultNoCaptionsDesc}
                    </div>
                  </div>
                </div>
              </ToolCard>
            )}

            {/* CASE 2 — captions exist, need one-click retry via proxy */}
            {!hasTranscript && data.languages && data.languages.length > 0 && (
              <div className="bg-white border-2 border-blue-600 rounded-2xl shadow-[4px_4px_0px_0px_rgba(37,99,235,1)] p-5 sm:p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <Languages className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-black text-sm text-black">{tc.resultPickLanguageTitle}</div>
                    <div className="text-xs font-medium text-neutral-600 mt-1">
                      {tc.resultPickLanguageDesc}{" "}
                      <span className="font-black text-black">{getLanguage(lang).name}</span>.
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.languages.map((l, i) => (
                    <button
                      key={`${l.code}-${l.kind}-${i}`}
                      onClick={() => (l.proxyUrl ? runFromProxy(l) : run(l.code))}
                      disabled={loading}
                      title={l.kind === "auto-generated" ? tc.resultAutoGenerated : tc.resultManualCaptions}
                      className="text-[11px] font-black px-3 py-2 rounded-xl border-2 border-black bg-white text-black flex items-center gap-1.5 hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <span>{l.name}</span>
                      <span className="text-[9px] opacity-70 uppercase tracking-wider">{l.code}</span>
                      {l.kind === "auto-generated" && <Wand2 className="w-3 h-3" />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Language switcher once we have a transcript */}
            {hasTranscript && data.languages && data.languages.length > 1 && (
              <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6">
                <div className="text-[10px] font-black text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Languages className="w-3.5 h-3.5" /> {tc.resultAvailableLanguages}
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.languages.map((l, i) => {
                    const active = l.code === data.captionLanguage;
                    return (
                      <button
                        key={`${l.code}-${l.kind}-${i}`}
                        onClick={() => {
                          setLang(l.code);
                          if (l.proxyUrl) runFromProxy(l);
                          else run(l.code);
                        }}
                        title={l.kind === "auto-generated" ? tc.resultAutoGenerated : tc.resultManualCaptions}
                        className={`text-[11px] font-black px-2.5 py-1.5 rounded-full border-2 border-black flex items-center gap-1.5 transition-colors ${active ? "bg-red-600 text-white" : "bg-white text-black hover:bg-black hover:text-white"
                          }`}
                      >
                        <span>{l.name}</span>
                        <span className="text-[9px] opacity-70 uppercase tracking-wider">{l.code}</span>
                        {l.kind === "auto-generated" && <Wand2 className="w-3 h-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Transcript panel */}
            {hasTranscript && (
              <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 border-b-2 border-black bg-neutral-50">
                  <div className="flex flex-wrap gap-2">
                    <ViewToggle active={view === "plain"} onClick={() => setView("plain")} icon={AlignLeft} label={tc.viewPlainText || "Plain Text"} />
                    <ViewToggle
                      active={view === "segments"}
                      onClick={() => setView("segments")}
                      icon={ListOrdered}
                      label={tc.viewTimestamps || "Timestamps"}
                      disabled={!data.segments?.length}
                    />
                    {showLanguageToggle && (
                      <ViewToggle
                        active={showOriginal}
                        onClick={() => setShowOriginal((v) => !v)}
                        icon={Languages}
                        label={showOriginal ? tc.viewShowTranslation || "Translation" : tc.viewShowOriginal || "Original"}
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ActionButton onClick={copy}>
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? tc.btnCopied : tc.btnCopy}
                    </ActionButton>
                    <ActionButton onClick={() => download(`${safeTitle}.txt`, transcriptText)}>
                      <Download className="w-3.5 h-3.5" /> .txt
                    </ActionButton>
                    {data.segments && data.segments.length > 0 && (
                      <ActionButton
                        onClick={() => download(`${safeTitle}.srt`, buildSrt(data.segments!), "application/x-subrip")}
                      >
                        <Download className="w-3.5 h-3.5" /> .srt
                      </ActionButton>
                    )}
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  {view === "plain" || !data.segments?.length ? (
                    <div className="max-h-[520px] overflow-y-auto pr-1 text-sm leading-relaxed text-neutral-800 whitespace-pre-wrap">
                      {transcriptText}
                    </div>
                  ) : (
                    <div className="max-h-[520px] overflow-y-auto divide-y divide-neutral-100">
                      {data.segments.map((s) => (
                        <a
                          key={s.sequence}
                          href={`https://youtube.com/watch?v=${data.videoId}&t=${Math.floor(s.startSeconds)}s`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex gap-3 py-2.5 px-1 hover:bg-red-50 rounded transition-colors"
                        >
                          <span className="text-xs font-black text-red-600 tabular-nums shrink-0 w-14 pt-0.5">{s.timestamp}</span>
                          <span className="text-sm text-neutral-800 leading-relaxed">{s.text}</span>
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!data && !loading && !error && <div className="mb-12 sm:mb-16" />}

      <GuideGrid
        badge={tc.guideBadge || ""}
        title={tc.guideTitle || ""}
        intro={tc.guideIntro || ""}
        cards={(tc.guides || []).map((g: any, i: number) => {
          const icons = [CheckCircle2, CheckCircle2, CheckCircle2, XCircle, XCircle, AlertTriangle];
          const colors = [
            "text-green-600 bg-green-100",
            "text-green-600 bg-green-100",
            "text-green-600 bg-green-100",
            "text-red-600 bg-red-100",
            "text-red-600 bg-red-100",
            "text-yellow-600 bg-yellow-100"
          ];
          return {
            ...g,
            icon: icons[i] || CheckCircle2,
            color: colors[i] || "text-gray-600 bg-gray-100"
          };
        })}
      />

      <Workflow
        title={tc.workflowTitle || ""}
        steps={tc.workflows || []}
      />

      {tc.seoContent && (
        <SeoContent badge={tc.seoContent.badge} title={tc.seoContent.title}>
          <p dangerouslySetInnerHTML={{ __html: tc.seoContent.p1 }} />
          <h3>{tc.seoContent.h3_1}</h3>
          <p dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_1 }} />
          <h3>{tc.seoContent.h3_2}</h3>
          <p dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_2 }} />
          <h3>{tc.seoContent.h3_3}</h3>
          <p dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_3 }} />
          <h3>{tc.seoContent.h3_4}</h3>
          <p dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_4 }} />
        </SeoContent>
      )}

      <FaqAccordion faqs={tc.faqs || []} />

      {tc.crossCta && (
        <CrossCTA
          title={tc.crossCta.title}
          desc={tc.crossCta.desc}
          primary={{ label: tc.crossCta.btn1, href: "/tools/seo-analyzer", icon: Sparkles }}
          secondary={{ label: tc.crossCta.btn2, href: "/tools/ai-script-writer", icon: PenTool }}
        />
      )}
      <ToolSeoJsonLd
        name={tc.title || "AI Transcript"}
        description={tc.seoJsonDesc || "Extract, translate, and search YouTube video transcripts into 100+ languages with AI-powered accuracy."}
        slug="ai-transcript"
        faqs={tc.faqs || []}
        breadcrumb={[
          { name: tc.breadcrumbHome, slug: "/" },
          { name: tc.breadcrumbTools, slug: "/tools" },
          { name: tc.title || "AI Transcript", slug: "/tools/ai-transcript" },
        ]}
      />
    </ToolLayout>
  );
}

/* ---------------- subcomponents ---------------- */

function Badge({
  icon: Icon,
  label,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  color: "green" | "yellow" | "red";
}) {
  const styles = {
    green: "bg-green-500 text-white border-white",
    yellow: "bg-yellow-500 text-black border-white",
    red: "bg-red-600 text-white border-white",
  }[color];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border-2 text-[10px] font-black uppercase tracking-wider ${styles}`}>
      <Icon className="w-3 h-3" />
      {label}
    </span>
  );
}

function ViewToggle({
  active,
  onClick,
  icon: Icon,
  label,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black text-[11px] font-black transition-colors ${disabled
        ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
        : active
          ? "bg-black text-white"
          : "bg-white text-black hover:bg-neutral-100"
        }`}
    >
      <Icon className="w-3.5 h-3.5" />
      {label}
    </button>
  );
}

function ActionButton({ onClick, children }: { onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black bg-white text-black text-[11px] font-black hover:bg-red-600 hover:text-white transition-colors"
    >
      {children}
    </button>
  );
}
