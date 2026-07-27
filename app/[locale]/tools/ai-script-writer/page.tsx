"use client";

import { copyToClipboard } from "@/lib/clipboard";
import { friendlyApiError } from "@/lib/apiError";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  PenTool,
  Loader2,
  Copy,
  Check,
  Sparkles,
  Clock,
  Mic,
  Target,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  FileText,
  Zap,
  Film,
  Eye,
  Hash,
  RefreshCw,
  Megaphone,
  Play,
  Flag,
} from "lucide-react";
import { ToolLayout, ToolCard, ToolInput, PrimaryButton } from "@/components/tools/ToolLayout";
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import { LanguageSelect, getLanguage } from "@/components/tools/LanguageSelect";
import { StreamingPreview } from "@/components/tools/StreamingPreview";
import { streamJson } from "@/lib/streamJson";

import { useTranslations } from "@/lib/i18n/useTranslations";

const tonesMaster = [
  { id: "Professional", icon: FileText },
  { id: "Casual", icon: Mic },
  { id: "Humorous", icon: Sparkles },
  { id: "Educational", icon: Zap },
  { id: "Inspirational", icon: Film },
];

const audiencesMaster = ["Beginners", "Developers", "Students", "General", "Professionals"];

const BASE_URL = "https://api.ytforge.app";

interface ScriptSection {
  section: string;
  type: "intro" | "body" | "outro" | "hook" | "cta";
  duration: string;
  narration: string;
  visuals: string;
  notes: string;
}

interface ScriptResponse {
  title: string;
  totalDuration: string;
  sections: ScriptSection[];
  summary: string;
  seoTags: string[];
  targetKeywords: string[];
}

const sectionTypeStyles: Record<ScriptSection["type"], { bg: string; icon: any; label: string }> = {
  hook: { bg: "bg-red-600", icon: Zap, label: "Hook" },
  intro: { bg: "bg-orange-500", icon: Play, label: "Intro" },
  body: { bg: "bg-black", icon: FileText, label: "Body" },
  cta: { bg: "bg-yellow-500", icon: Megaphone, label: "CTA" },
  outro: { bg: "bg-neutral-700", icon: Flag, label: "Outro" },
};


export default function AIScriptWriterPage() {
  const [topic, setTopic] = useState("");
  const [length, setLength] = useState("8-10 minutes");
  const [tone, setTone] = useState("Professional");
  const [audience, setAudience] = useState("General");
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [script, setScript] = useState<ScriptResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedSectionIdx, setCopiedSectionIdx] = useState<number | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [streamText, setStreamText] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  const { t } = useTranslations();
  const content = t("toolPages.aiScriptWriter");

  // Fallback to avoid crashes while dictionary might be reloading
  if (!content) return null;

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setScript(null);
    setError(null);
    setStreamText("");

    const lang = getLanguage(language);
    abortRef.current = streamJson<{ script: ScriptResponse }>(
      `${BASE_URL}/api/generate-script/stream`,
      {
        topic: topic.trim(),
        length,
        tone,
        audience,
        language: lang.name,
      },
      {
        onDelta: (full) => setStreamText(full),
        onDone: (result, _raw, err) => {
          if (result?.script) {
            setScript(result.script);
          } else if (err) {
            setError(friendlyApiError(err, 0));
          } else {
            setError(friendlyApiError("Unexpected response format", 0));
          }
          setStreamText("");
          setLoading(false);
        },
        onError: (message) => {
          setError(friendlyApiError(message, 0));
          setStreamText("");
          setLoading(false);
        },
      }
    );
  };

  const cancel = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
    setStreamText("");
  };

  const scriptToText = (s: ScriptResponse) => {
    const parts: string[] = [];
    parts.push(`${s.title}\n${"=".repeat(s.title.length)}\nDuration: ${s.totalDuration}\n`);
    parts.push(`Summary: ${s.summary}\n`);
    s.sections.forEach((sec) => {
      parts.push(
        `\n[${sec.section.toUpperCase()} · ${sec.type.toUpperCase()} · ${sec.duration}]\n` +
        `NARRATION:\n${sec.narration}\n\n` +
        `VISUALS: ${sec.visuals}\n` +
        `NOTES: ${sec.notes}\n`
      );
    });
    if (s.targetKeywords?.length) parts.push(`\nTarget Keywords: ${s.targetKeywords.join(", ")}`);
    if (s.seoTags?.length) parts.push(`\nSEO Tags: ${s.seoTags.join(", ")}`);
    return parts.join("\n");
  };

  const copy = () => {
    if (!script) return;
    copyToClipboard(scriptToText(script));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const copySection = (sec: ScriptSection, idx: number) => {
    const text = `[${sec.section} · ${sec.duration}]\n\n${sec.narration}\n\nVisuals: ${sec.visuals}\nNotes: ${sec.notes}`;
    copyToClipboard(text);
    setCopiedSectionIdx(idx);
    setTimeout(() => setCopiedSectionIdx(null), 1500);
  };

  const wordCount = script
    ? script.sections.reduce((sum, s) => sum + s.narration.split(/\s+/).length, 0)
    : 0;
  const readMin = Math.max(1, Math.round(wordCount / 150));

  return (
    <ToolLayout
      title={content.title}
      description={content.description}
      icon={PenTool}
      badge={content.badge}
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {content.stats.map((s: any, i: number) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white border-2 border-black rounded-xl p-3 sm:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center"
          >
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-red-600 tabular-nums">{s.value}</div>
            <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider mt-1">{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Generator */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6 mb-12 sm:mb-16">
        <ToolCard className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5 text-red-600" />
            <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">Configure</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">{content.configTopic}</label>
              <ToolInput
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder={content.configTopicPlaceholder}
                onKeyDown={(e) => e.key === "Enter" && generate()}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">{content.configLength}</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {content.lengths.map((l: any) => (
                  <button
                    key={l.id}
                    onClick={() => setLength(l.id)}
                    className={`flex flex-col items-center justify-center py-2 rounded-lg border-2 border-black text-[10px] font-black transition-all ${length === l.id
                      ? "bg-red-600 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                      : "bg-white text-black hover:bg-neutral-50"
                      }`}
                  >
                    <span>{l.label}</span>
                    <span className="opacity-70 text-[9px]">{l.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">{content.configTone}</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tonesMaster.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border-2 border-black text-xs font-black transition-all ${tone === t.id
                      ? "bg-black text-white shadow-[2px_2px_0px_0px_rgba(220,38,38,1)]"
                      : "bg-white text-black hover:bg-neutral-50"
                      }`}
                  >
                    <t.icon className="w-3.5 h-3.5" />
                    {t.id}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">{content.configAudience}</label>
              <div className="flex flex-wrap gap-2">
                {audiencesMaster.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAudience(a)}
                    className={`px-3 py-1.5 rounded-full border-2 border-black text-[11px] font-black transition-all ${audience === a ? "bg-red-600 text-white" : "bg-white text-black hover:bg-neutral-50"
                      }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <LanguageSelect value={language} onChange={setLanguage} />

            <PrimaryButton onClick={generate} disabled={loading || !topic.trim()} className="w-full">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <PenTool className="w-4 h-4" />}
              {loading ? content.writingBtn : content.generateBtn}
            </PrimaryButton>
          </div>
        </ToolCard>

        <ToolCard className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">{content.scriptTitle}</h2>
            </div>
            {script && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black bg-black text-white px-2 py-1 rounded-full">
                  {wordCount} {content.words}
                </span>
                <span className="text-[10px] font-black bg-red-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {script.totalDuration}
                </span>
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 text-xs font-black px-3 py-1.5 border-2 border-black rounded-lg bg-white hover:bg-red-600 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? content.copied : content.copyAll}
                </button>
              </div>
            )}
          </div>

          {/* Empty state */}
          {!script && !loading && !error && (
            <div className="text-sm text-neutral-500 py-20 text-center border-2 border-dashed border-neutral-300 rounded-xl">
              <PenTool className="w-8 h-8 mx-auto mb-3 text-neutral-400" />
              {content.emptyState}
            </div>
          )}

          {/* Streaming preview */}
          <StreamingPreview
            open={loading || !!streamText}
            text={streamText}
            onCancel={loading ? cancel : undefined}
            title="Streaming script"
          />

          {/* Loading state */}
          {loading && !streamText && (
            <div className="py-8 flex flex-col items-center text-center">
              <div className="relative mb-5">
                <motion.div
                  className="absolute inset-0 rounded-full bg-red-600/30"
                  animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <motion.div
                  className="relative w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-orange-500 border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                  <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                    <PenTool className="w-7 h-7 text-white" />
                  </motion.div>
                </motion.div>
              </div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-2">
                <Loader2 className="w-3 h-3 animate-spin" /> AI Writing
              </div>
              <h3 className="text-lg font-black mb-1">{content.loadingStateTitle}</h3>
              <p className="text-xs text-neutral-500 mb-5">
                {content.loadingStateDesc}
              </p>
              <div className="w-full max-w-sm space-y-2">
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="h-12 rounded-xl bg-neutral-100 border-2 border-neutral-200 overflow-hidden relative"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-red-100/60 to-transparent"
                      animate={{ x: ["-100%", "100%"] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: i * 0.15 }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Error state */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-2 border-red-600 rounded-2xl p-5 sm:p-6 text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-600 text-white border-2 border-black mb-3">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-black text-base text-red-900 mb-1">{content.errorStateTitle}</h3>
              <p className="text-sm text-red-700 mb-4">{error}</p>
              <button
                onClick={generate}
                disabled={!topic.trim()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" /> {content.retryBtn}
              </button>
            </motion.div>
          )}

          {/* Script output */}
          {script && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              {/* Title card */}
              <div className="relative bg-black text-white rounded-2xl border-2 border-black p-5 sm:p-6 overflow-hidden shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
                <div
                  className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(220,38,38,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.4) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                    maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                    WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
                  }}
                />
                <div className="relative">
                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-red-600 text-white text-[9px] font-black uppercase tracking-widest rounded-full border border-white mb-2">
                    <Sparkles className="w-2.5 h-2.5" /> {content.scriptTitle}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black tracking-tight mb-2">{script.title}</h3>
                  <div className="flex items-center gap-3 flex-wrap text-xs">
                    <span className="inline-flex items-center gap-1 font-black text-red-500">
                      <Clock className="w-3.5 h-3.5" /> {script.totalDuration}
                    </span>
                    <span className="text-neutral-400">·</span>
                    <span className="inline-flex items-center gap-1 font-black text-white">
                      <FileText className="w-3.5 h-3.5" /> {script.sections.length} sections
                    </span>
                    <span className="text-neutral-400">·</span>
                    <span className="inline-flex items-center gap-1 font-black text-white">
                      <Eye className="w-3.5 h-3.5" /> ~{readMin} min read
                    </span>
                  </div>
                </div>
              </div>

              {/* Summary */}
              {script.summary && (
                <div className="p-4 bg-gradient-to-br from-neutral-50 to-white rounded-xl border-l-4 border-red-600 border-t-2 border-r-2 border-b-2 border-t-neutral-200 border-r-neutral-200 border-b-neutral-200">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-black mb-1">{content.summaryLabel}</div>
                      <p className="text-sm text-neutral-700 leading-relaxed">{script.summary}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Sections */}
              <div className="space-y-3">
                {script.sections.map((sec, i) => {
                  const style = sectionTypeStyles[sec.type] || sectionTypeStyles.body;
                  const StyleIcon = style.icon;
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] transition-shadow"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between gap-3 p-3 sm:p-4 bg-neutral-50 border-b-2 border-black">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`shrink-0 w-9 h-9 rounded-xl ${style.bg} text-white flex items-center justify-center border-2 border-black`}
                          >
                            <StyleIcon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="font-black text-sm sm:text-base text-black truncate">
                              {sec.section}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span
                                className={`text-[9px] font-black uppercase tracking-wider ${style.bg} text-white px-1.5 py-0.5 rounded-full`}
                              >
                                {style.label}
                              </span>
                              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-neutral-600">
                                <Clock className="w-3 h-3" /> {sec.duration}
                              </span>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => copySection(sec, i)}
                          className="shrink-0 p-2 rounded-lg border-2 border-black bg-white text-black hover:bg-red-600 hover:text-white transition-colors"
                          aria-label="Copy section"
                        >
                          {copiedSectionIdx === i ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {/* Body */}
                      <div className="p-4 sm:p-5 space-y-3">
                        {/* Narration */}
                        <div>
                          <div className="flex items-center gap-1.5 mb-1.5">
                            <Mic className="w-3.5 h-3.5 text-red-600" />
                            <span className="text-[10px] font-black uppercase tracking-wider text-black">
                              {content.narrationLabel}
                            </span>
                          </div>
                          <p className="text-sm text-neutral-800 leading-relaxed whitespace-pre-wrap">
                            {sec.narration}
                          </p>
                        </div>

                        {/* Visuals + Notes */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {sec.visuals && (
                            <div className="bg-orange-50/60 border border-orange-200 rounded-lg p-3">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Film className="w-3.5 h-3.5 text-orange-600" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-orange-800">
                                  {content.visualsLabel}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-700 leading-relaxed">{sec.visuals}</p>
                            </div>
                          )}
                          {sec.notes && (
                            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-3">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Target className="w-3.5 h-3.5 text-black" />
                                <span className="text-[10px] font-black uppercase tracking-wider text-black">
                                  {content.notesLabel}
                                </span>
                              </div>
                              <p className="text-xs text-neutral-700 leading-relaxed">{sec.notes}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Target Keywords */}
              {script.targetKeywords?.length > 0 && (
                <div className="bg-white border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Target className="w-4 h-4 text-red-600" />
                    <span className="text-xs font-black uppercase tracking-wider text-black">
                      {content.keywordsTitle}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {script.targetKeywords.map((kw, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-black bg-red-600 text-white px-2.5 py-1 rounded-full border-2 border-black"
                      >
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Tags */}
              {script.seoTags?.length > 0 && (
                <div className="bg-white border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Hash className="w-4 h-4 text-black" />
                    <span className="text-xs font-black uppercase tracking-wider text-black">{content.seoTagsTitle}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {script.seoTags.map((tag, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          copyToClipboard(tag);
                        }}
                        className="inline-flex items-center text-[11px] font-black bg-black text-white px-2.5 py-1 rounded-full border-2 border-black hover:bg-red-600 transition-colors"
                        title="Click to copy"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </ToolCard>
      </div>

      {/* Guide */}
      <section className="mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black tracking-wider uppercase rounded-full mb-3">
            <Target className="w-3 h-3 text-red-500" /> {content.rulesBadge}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black">
            {content.rulesTitle}
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 max-w-2xl mt-2">
            {content.rulesDesc}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {content.guides.map((g: any, i: number) => {
            const icons = [CheckCircle2, CheckCircle2, CheckCircle2, XCircle, XCircle, AlertTriangle];
            const colors = ["text-green-600 bg-green-100", "text-green-600 bg-green-100", "text-green-600 bg-green-100", "text-red-600 bg-red-100", "text-red-600 bg-red-100", "text-yellow-600 bg-yellow-100"];
            const GIcon = icons[i];
            const gcolor = colors[i];
            return (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border-2 border-black rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-0.5 transition-all"
              >
                <div className={`w-10 h-10 rounded-lg ${gcolor} flex items-center justify-center border-2 border-black mb-3`}>
                  <GIcon className="w-5 h-5" />
                </div>
                <h3 className="font-black text-base text-black mb-1.5">{g.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{g.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Workflow */}
      <section className="mb-12 sm:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-6 sm:mb-8"
        >
          {content.workflowTitle}
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5">
          {content.workflows.map((step: any, i: number) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-black text-white rounded-2xl p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] relative overflow-hidden"
            >
              <div className="absolute top-2 right-3 text-5xl sm:text-6xl font-black text-white/15 select-none leading-none pointer-events-none">{step.n}</div>
              <div className="relative">
                <div className="text-[10px] font-black text-red-500 tracking-widest mb-2">STEP {step.n}</div>
                <h3 className="font-black text-base mb-2">{step.t}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{step.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SEO long-form content */}
      <section className="mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border-2 border-black rounded-2xl p-6 sm:p-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black tracking-wider uppercase rounded-full mb-4">
            <Sparkles className="w-3 h-3" /> {content.seoContent.badge}
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-4">
            {content.seoContent.h2}
          </h2>
          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            {content.seoContent.h3_5}
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            {content.seoContent.p2_5}
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            {content.seoContent.h3_6}
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            {content.seoContent.p2_6}
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            {content.seoContent.h3_7}
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            {content.seoContent.p2_7}
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            {content.seoContent.h3_8}
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            {content.seoContent.p2_8}
          </p>
        </motion.div>
      </section>

      {/* FAQ */}
      <section className="mb-8">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-6 sm:mb-8"
        >
          {content.faqsTitle}
        </motion.h2>

        <div className="space-y-3 max-w-3xl">
          {content.faqs.map((f: any, i: number) => (
            <div
              key={i}
              className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left"
              >
                <span className="font-black text-sm sm:text-base text-black">{f.q}</span>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 transition-transform ${openFaq === i ? "rotate-180 text-red-600" : "text-black"
                    }`}
                />
              </button>
              <AnimatePresence>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-neutral-600 leading-relaxed border-t-2 border-dashed border-neutral-200 pt-3">
                      {f.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-red-600 text-white rounded-2xl border-2 border-black p-6 sm:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center"
      >
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3">
          {content.ctaTitle}
        </h2>
        <p className="text-sm sm:text-base text-red-100 max-w-xl mx-auto mb-6">
          {content.ctaDesc}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/tools/viral-title-generator"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform text-sm uppercase tracking-wider"
          >
            <TrendingUp className="w-4 h-4" /> {content.ctaBtn1}
          </a>
          <a
            href="/tools/ai-thumbnail-generator"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-transform text-sm uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4" /> {content.ctaBtn2}
          </a>
        </div>
      </motion.div>
      <ToolSeoJsonLd
        name={content.title}
        description={content.description}
        slug="ai-script-writer"
        faqs={content.faqs}
        breadcrumb={[
          { name: "Home", slug: "/" },
          { name: "Tools", slug: "/tools" },
          { name: content.title, slug: "/tools/ai-script-writer" },
        ]}
      />
    </ToolLayout>
  );
}
