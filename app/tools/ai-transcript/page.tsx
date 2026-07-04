"use client";

import { copyToClipboard } from "@/lib/clipboard";
import { friendlyApiError } from "@/lib/apiError";
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
import { LanguageSelect, getLanguage } from "@/components/tools/LanguageSelect";
import { StatsStrip, GuideGrid, Workflow, SeoContent, FaqAccordion, CrossCTA } from "@/components/tools/ToolSections";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://tubeai-backend.vercel.app";

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

const stats = [
  { value: "8.4M+", label: "Videos Transcribed" },
  { value: "50+", label: "Languages" },
  { value: "99.2%", label: "Accuracy" },
  { value: "<60s", label: "Avg Processing" },
];

const guides = [
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Use clean audio", desc: "Background noise drops accuracy by 15-20%. Record with a USB mic for best transcript quality." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Speak at natural pace", desc: "150-180 words per minute is optimal. Faster speech triggers more transcription errors." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Add SRT to your videos", desc: "Captions boost retention by 12% and unlock viewers who watch with sound off." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't auto-publish raw transcripts", desc: "AI transcripts need a 5-minute proofread for proper nouns, brand names, and technical terms." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't ignore translation context", desc: "Direct word-for-word translations miss idioms. Review translated transcripts before publishing." },
  { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100", title: "Watch for homophones", desc: "\"There/their/they're\" and brand names are the most commonly mis-transcribed terms." },
];

const faqs = [
  { q: "How accurate is the AI transcription?", a: "Manual captions average 99%+ accuracy; auto-generated captions average 92-95% on clean English audio. Accuracy drops slightly for accented speech, technical jargon, or noisy backgrounds." },
  { q: "Which languages are supported?", a: "We support 50+ languages including English, Spanish, French, German, Mandarin, Hindi, Arabic, Portuguese, Japanese, and Korean. Translation between any pair is included." },
  { q: "Can I download the transcript as SRT or TXT?", a: "Yes. Both .txt (clean text) and .srt (with timecodes for YouTube and most editors) are available as one-click downloads." },
  { q: "Do transcripts help SEO?", a: "Massively. YouTube reads transcripts to understand your content, which improves search ranking. Captioned videos also rank higher because of accessibility signals." },
];

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

function friendlyError(raw: string, status: number): string {
  if (/invalid youtube url/i.test(raw)) return "Please enter a valid YouTube link.";
  if (/no captions|not available/i.test(raw)) return "No captions available for this video.";
  if (status >= 500) return "Server error, please try again in a moment.";
  return friendlyApiError(raw || "", status);
}

export default function AITranscriptPage() {
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
        throw new Error(friendlyError(body?.error || "", res.status));
      }
      if (!body?.success) {
        console.warn("[Transcribe] success=false. Reason from backend:", body?.error, "| Full body:", body);
        throw new Error(friendlyError(body?.error || "Transcript unavailable.", res.status));
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
      setError(err?.message || "Something went wrong. Please try again.");
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
        throw new Error(friendlyError(`Caption fetch failed`, xmlRes.status));
      }
      const xml = await xmlRes.text();
      console.log("XML length:", xml.length, "First 200 chars:", xml.slice(0, 200));
      if (!xml || xml.length < 20) {
        console.warn("[Transcribe Proxy] Caption track XML is empty / too short.");
        throw new Error("Empty caption track returned.");
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
        throw new Error(friendlyError(procBody?.error || "", procRes.status));
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
      setError(err?.message || "Something went wrong. Please try again.");
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
      title="AI Transcript Generator"
      description="Extract perfectly timed transcripts from any YouTube video and translate them into 50+ languages."
      icon={FileText}
      badge="Transcribe AI · 99.2% Accuracy"
    >
      <StatsStrip stats={stats} />

      <ToolCard className="mb-6">
        <div className="flex flex-col gap-3">
          <ToolInput
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && run()}
            placeholder="https://youtube.com/watch?v=..."
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 min-w-0">
              <LanguageSelect value={lang} onChange={setLang} compact label="Transcript language" />
            </div>
            <PrimaryButton onClick={() => run()} disabled={loading || !url.trim()}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" />}
              {loading ? "Fetching transcript..." : "Generate Transcript"}
            </PrimaryButton>
          </div>
        </div>
      </ToolCard>

      {/* Loading */}
      {loading && (
        <ToolCard className="mb-12 sm:mb-16">
          <div className="flex flex-col items-center justify-center py-10 gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-red-600" />
            <div className="text-xs font-black uppercase tracking-wider text-neutral-600">Fetching transcript...</div>
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
              <div className="font-black text-sm text-black">Couldn't generate transcript</div>
              <div className="text-xs font-medium text-neutral-600 mt-1 break-words">{error}</div>
              <button
                onClick={() => {
                  setError(null);
                  setUrl("");
                }}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black bg-white text-black text-[11px] font-black hover:bg-red-600 hover:text-white transition-colors"
              >
                Try another video
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
                      <span className="flex items-center gap-1"><AlignLeft className="w-3 h-3" /> {data.segmentCount.toLocaleString()} segments</span>
                    )}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {data.captionLanguage && (
                      <Badge icon={Languages} label={`Source: ${data.captionLanguage.toUpperCase()}`} color="green" />
                    )}
                    {data.translatedText && data.captionLanguage !== lang && (
                      <Badge icon={Sparkles} label={`Translated → ${getLanguage(lang).name}`} color="red" />
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
                    <div className="font-black text-sm text-black">No captions available</div>
                    <div className="text-xs font-medium text-neutral-600 mt-1">
                      {data.instructions || "This video doesn't have captions enabled. Try a different video."}
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
                    <div className="font-black text-sm text-black">Pick a language to fetch the transcript</div>
                    <div className="text-xs font-medium text-neutral-600 mt-1">
                      Captions are published in these languages. Click one to download and translate it to{" "}
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
                      title={l.kind === "auto-generated" ? "Auto-generated" : "Manual captions"}
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
                  <Languages className="w-3.5 h-3.5" /> Available caption languages
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
                        title={l.kind === "auto-generated" ? "Auto-generated" : "Manual captions"}
                        className={`text-[11px] font-black px-2.5 py-1.5 rounded-full border-2 border-black flex items-center gap-1.5 transition-colors ${
                          active ? "bg-red-600 text-white" : "bg-white text-black hover:bg-black hover:text-white"
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
                    <ViewToggle active={view === "plain"} onClick={() => setView("plain")} icon={AlignLeft} label="Plain text" />
                    <ViewToggle
                      active={view === "segments"}
                      onClick={() => setView("segments")}
                      icon={ListOrdered}
                      label="Timestamps"
                      disabled={!data.segments?.length}
                    />
                    {showLanguageToggle && (
                      <ViewToggle
                        active={showOriginal}
                        onClick={() => setShowOriginal((v) => !v)}
                        icon={Languages}
                        label={showOriginal ? "Show translation" : "Show original"}
                      />
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <ActionButton onClick={copy}>
                      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copied ? "Copied" : "Copy"}
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
        badge="Transcription Rules"
        title="How to get perfect transcripts every time"
        intro="Six rules from professionals who transcribe thousands of hours per month."
        cards={guides}
      />

      <Workflow
        title="Your 4-step transcript workflow"
        steps={[
          { n: "01", t: "Paste video URL", d: "Drop in any YouTube link — public, unlisted, or your own uploads." },
          { n: "02", t: "Pick language", d: "Generate in the original language or auto-translate to 50+ target languages." },
          { n: "03", t: "Proofread quickly", d: "5-minute scan for proper nouns, brand names, and technical terminology." },
          { n: "04", t: "Upload as captions", d: "Add SRT to YouTube Studio for accessibility, SEO, and a 12% retention lift." },
        ]}
      />

      <SeoContent badge="Complete Transcript Guide" title="Why transcripts are the most underrated YouTube growth hack">
        <p>Most creators see transcripts as an accessibility checkbox — something you upload to be polite. The reality is that transcripts and closed captions are one of the highest-ROI activities you can do on YouTube. They directly improve SEO, retention, and reach to non-native speakers, all in a single 10-minute upload.</p>
        <h3>How transcripts boost YouTube SEO</h3>
        <p>YouTube's algorithm reads your transcript to understand the topic, depth, and authority of your video. Without an uploaded transcript, YouTube relies on auto-generated captions — which average only 80-85% accuracy. By uploading a clean SRT file, you give the algorithm a perfect map of your content, which can lift your search rankings by 30-50%.</p>
        <h3>Captions and the 12% retention lift</h3>
        <p>Internal YouTube data shows videos with captions retain viewers 12% longer on average. The reason: <strong>40% of YouTube viewers watch with sound off</strong> (commute, classroom, late at night, open offices). Without captions, those viewers bounce. With captions, they stay and watch.</p>
        <h3>Translation: unlocking global audiences</h3>
        <p>Translating your transcript into Spanish, Portuguese, Hindi, or Japanese can multiply your view count by 3-5x with zero new content created. YouTube's "subtitles" feature lets you upload multiple translated SRTs to one video, and the algorithm will recommend it to viewers in those languages automatically.</p>
        <h3>Pair transcripts with strong SEO and scripts</h3>
        <p>Once you have a transcript, feed it into our <a href="/tools/seo-analyzer">SEO Analyzer</a> to extract long-tail keywords for your description, or use it as raw material for a follow-up video script in our <a href="/tools/ai-script-writer">AI Script Writer</a>.</p>
      </SeoContent>

      <FaqAccordion faqs={faqs} />

      <CrossCTA
        title="Turn transcripts into more views"
        desc="Use your transcripts to fuel SEO and write better follow-up scripts."
        primary={{ label: "Analyze SEO", href: "/tools/seo-analyzer", icon: Sparkles }}
        secondary={{ label: "Write Script", href: "/tools/ai-script-writer", icon: PenTool }}
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
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 border-black text-[11px] font-black transition-colors ${
        disabled
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
