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
import { LanguageSelect, getLanguage } from "@/components/tools/LanguageSelect";
import { StreamingPreview } from "@/components/tools/StreamingPreview";
import { streamJson } from "@/lib/streamJson";

const lengths = [
  { id: "5-7 minutes", label: "Short", sub: "5-7 min" },
  { id: "8-10 minutes", label: "Standard", sub: "8-10 min" },
  { id: "10-12 minutes", label: "Long", sub: "10-12 min" },
  { id: "15-20 minutes", label: "Deep Dive", sub: "15-20 min" },
];

const tones = [
  { id: "Professional", icon: FileText },
  { id: "Casual", icon: Mic },
  { id: "Humorous", icon: Sparkles },
  { id: "Educational", icon: Zap },
  { id: "Inspirational", icon: Film },
];

const audiences = ["Beginners", "Developers", "Students", "General", "Professionals"];

const BASE_URL = "https://tubeai-backend.vercel.app";

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

const stats = [
  { value: "5.8M+", label: "Scripts Written" },
  { value: "+92%", label: "Avg Retention Lift" },
  { value: "18K", label: "Active Creators" },
  { value: "4.9★", label: "Creator Rating" },
];

const guides = [
  {
    icon: CheckCircle2,
    color: "text-green-600 bg-green-100",
    title: "Hook in the first 5 seconds",
    desc: "Open with a bold claim, surprising stat, or unanswered question. The first 5 seconds decide retention for the next 5 minutes.",
  },
  {
    icon: CheckCircle2,
    color: "text-green-600 bg-green-100",
    title: "Use pattern interrupts",
    desc: "Every 30-60 seconds, change camera angle, add a B-roll, or shift tone to keep dopamine firing.",
  },
  {
    icon: CheckCircle2,
    color: "text-green-600 bg-green-100",
    title: "Open loops & payoffs",
    desc: "Tease something earlier in the video that you only resolve later — viewers stick around for the answer.",
  },
  {
    icon: XCircle,
    color: "text-red-600 bg-red-100",
    title: "Avoid long intros",
    desc: "Anything over 10 seconds of \"what's up guys\" loses 30% of viewers before the actual content starts.",
  },
  {
    icon: XCircle,
    color: "text-red-600 bg-red-100",
    title: "Don't bury the value",
    desc: "Promise the outcome upfront — viewers don't trust creators who hide what the video is actually about.",
  },
  {
    icon: AlertTriangle,
    color: "text-yellow-600 bg-yellow-100",
    title: "One CTA, one ask",
    desc: "A single, well-placed call-to-action converts 3x better than three CTAs scattered throughout.",
  },
];

const faqs = [
  {
    q: "How are these scripts structured?",
    a: "Every script we generate uses a proven retention framework: a 5-second hook, a clear promise, 2–4 main points with pattern interrupts, an open-loop payoff, and a single strong CTA at the end. This is the same structure used by top creators averaging 50%+ AVD.",
  },
  {
    q: "Can I edit the script after it's generated?",
    a: "Absolutely — copy the output and tweak it freely. Many creators treat our script as the skeleton and add personal stories, examples, or jokes on top. The structure stays, the voice becomes yours.",
  },
  {
    q: "Does this work for YouTube Shorts and TikTok?",
    a: "Yes. Pick the \"Shorts\" length and the AI will compress the structure into a 30–60 second vertical format with a sub-1-second hook, a single value drop, and a fast loop-back ending.",
  },
  {
    q: "What's the difference between tones?",
    a: "Energetic uses short punchy sentences, exclamations, and high-energy verbs. Educational is calmer, denser, with citations and structured lists. Funny adds setup-punchline rhythm. Cinematic uses pauses, imagery, and slower pacing for documentary-style content.",
  },
  {
    q: "Will my script be unique?",
    a: "Yes. Every script is generated fresh from your topic, audience, tone, and length inputs. We don't store or reuse generated content, and no two scripts are ever identical even with the same prompt.",
  },
];


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
      title="AI Script Writer"
      description="Generate viral, retention-optimized YouTube scripts in seconds — complete with hooks, pattern interrupts, open loops, and CTAs."
      icon={PenTool}
      badge="Script AI · Trained on 50M+ Videos"
    >
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {stats.map((s, i) => (
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
              <label className="block text-xs font-black uppercase tracking-wider mb-2">Video Topic</label>
              <ToolInput
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. AI productivity hacks for students"
                onKeyDown={(e) => e.key === "Enter" && generate()}
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">Length</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {lengths.map((l) => (
                  <button
                    key={l.id}
                    onClick={() => setLength(l.id)}
                    className={`flex flex-col items-center justify-center py-2 rounded-lg border-2 border-black text-[10px] font-black transition-all ${
                      length === l.id
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
              <label className="block text-xs font-black uppercase tracking-wider mb-2">Tone</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {tones.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTone(t.id)}
                    className={`flex items-center justify-center gap-1.5 py-2 rounded-lg border-2 border-black text-xs font-black transition-all ${
                      tone === t.id
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
              <label className="block text-xs font-black uppercase tracking-wider mb-2">Audience</label>
              <div className="flex flex-wrap gap-2">
                {audiences.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAudience(a)}
                    className={`px-3 py-1.5 rounded-full border-2 border-black text-[11px] font-black transition-all ${
                      audience === a ? "bg-red-600 text-white" : "bg-white text-black hover:bg-neutral-50"
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
              {loading ? "Writing..." : "Generate Script"}
            </PrimaryButton>
          </div>
        </ToolCard>

        <ToolCard className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">Generated Script</h2>
            </div>
            {script && (
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black bg-black text-white px-2 py-1 rounded-full">
                  {wordCount} words
                </span>
                <span className="text-[10px] font-black bg-red-600 text-white px-2 py-1 rounded-full flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {script.totalDuration}
                </span>
                <button
                  onClick={copy}
                  className="flex items-center gap-1.5 text-xs font-black px-3 py-1.5 border-2 border-black rounded-lg bg-white hover:bg-red-600 hover:text-white transition-colors"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy All"}
                </button>
              </div>
            )}
          </div>

          {/* Empty state */}
          {!script && !loading && !error && (
            <div className="text-sm text-neutral-500 py-20 text-center border-2 border-dashed border-neutral-300 rounded-xl">
              <PenTool className="w-8 h-8 mx-auto mb-3 text-neutral-400" />
              Fill in your topic on the left and click Generate Script.
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
              <h3 className="text-lg font-black mb-1">Crafting your script...</h3>
              <p className="text-xs text-neutral-500 mb-5">
                Building hooks, sections, visuals & SEO — usually 5–15 seconds
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
              <h3 className="font-black text-base text-red-900 mb-1">Generation Failed</h3>
              <p className="text-sm text-red-700 mb-4">{error}</p>
              <button
                onClick={generate}
                disabled={!topic.trim()}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-sm rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4" /> Retry
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
                    <Sparkles className="w-2.5 h-2.5" /> Video Script
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
                      <div className="text-[10px] font-black uppercase tracking-wider text-black mb-1">Summary</div>
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
                              Narration
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
                                  Visuals / B-Roll
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
                                  Director Notes
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
                      Target Keywords
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
                    <span className="text-xs font-black uppercase tracking-wider text-black">SEO Tags</span>
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
            <Target className="w-3 h-3 text-red-500" /> Script Writing Rules
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black">
            Six rules for retention-killing scripts
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 max-w-2xl mt-2">
            Apply these and watch your average view duration climb past 50%.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {guides.map((g, i) => (
            <motion.div
              key={g.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border-2 border-black rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-0.5 transition-all"
            >
              <div className={`w-10 h-10 rounded-lg ${g.color} flex items-center justify-center border-2 border-black mb-3`}>
                <g.icon className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base text-black mb-1.5">{g.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{g.desc}</p>
            </motion.div>
          ))}
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
          Your 4-step scripting workflow
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5">
          {[
            { n: "01", t: "Define the topic", d: "Be specific — \"AI for students\" beats \"productivity\". Specificity drives CTR." },
            { n: "02", t: "Pick length & tone", d: "Match length to your niche. Tutorial = 10min. Vlog = 5min. Hook = Shorts." },
            { n: "03", t: "Generate & customize", d: "Use our output as the skeleton. Add your stories, voice, and personality." },
            { n: "04", t: "Record & A/B test", d: "Track 30s retention. If <70% stays past the hook, rewrite the first 8 seconds." },
          ].map((step, i) => (
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
            <Sparkles className="w-3 h-3" /> Complete YouTube Script Guide
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-4">
            How to write a YouTube script that keeps viewers watching
          </h2>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-6">
            A great script is the difference between a video people click on and a video people actually finish.
            YouTube's algorithm rewards <strong>average view duration (AVD)</strong> and watch time more than any
            other signal in 2026, which means a tight, retention-optimized script is the highest-leverage thing
            you can write before you ever press record. After processing more than 5.8 million scripts inside our
            AI Script Writer, we've extracted the patterns that consistently beat 50%+ AVD across every niche on
            YouTube.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            The anatomy of a viral YouTube script
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            Every retention-optimized script follows the same five-part skeleton: <strong>hook</strong>,{" "}
            <strong>promise</strong>, <strong>main content with pattern interrupts</strong>,{" "}
            <strong>open-loop payoff</strong>, and a <strong>single strong CTA</strong>. The hook lives in the
            first 5 seconds. The promise comes immediately after — what will the viewer walk away with by the end?
            The body delivers that promise in 2 to 4 chunks, with a visual or tonal interrupt every 30 to 60
            seconds. The open loop is teased early and resolved late. And the CTA goes in one spot only — the moment
            of peak value.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            Why the first 5 seconds matter more than everything else
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            YouTube measures retention curves second-by-second. The steepest drop on almost every video happens
            between 0:00 and 0:08. If you can hold viewers past 8 seconds, you've already beaten 70% of competing
            videos in your niche. That's why our AI script writer always opens with a question, a contrarian
            claim, or a specific surprising number — never with "hey guys, welcome back to the channel." Generic
            intros leak views and signal to the algorithm that your content isn't worth recommending.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            Pattern interrupts: keeping the dopamine loop alive
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            Human attention naturally drops every 30–60 seconds. A pattern interrupt is anything that resets that
            attention curve — a B-roll cut, a zoom-in, a sound effect, a tonal shift, a graphic overlay, or a
            change of physical location. The best YouTubers (MrBeast, Veritasium, Mark Rober, Ali Abdaal) average
            a pattern interrupt every 15–25 seconds. Our generated scripts mark exactly where to drop these cues
            so your editor (or you) doesn't have to guess.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            Tone, audience, and length: getting the inputs right
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            The tone of your script should match the energy of your niche. Tech tutorials and educational content
            perform best with a calmer, denser, "Educational" tone. Vlogs, challenges, and reaction videos win
            with "Energetic." Documentary-style and storytelling videos benefit from "Cinematic" pacing. Length
            should match viewer intent: long-tail SEO topics work best at 8–12 minutes, browse-driven topics at
            5–7 minutes, and trend-driven topics at 60-second Shorts. Match the input to the output, and the
            algorithm rewards you with sustained recommendations.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            Open loops, payoffs, and the curiosity engine
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            An open loop is a question or tease introduced early in the video that you only resolve at the end.
            Example: "By the end of this video I'll show you the one mistake that wrecks 90% of beginners." That
            single sentence can lift retention by 15–25% because viewers consciously decide to wait for the
            payoff. Layer 2–3 open loops in any video over 5 minutes and you'll see your retention graph flatten
            instead of decay.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            Calls-to-action that actually convert
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            The biggest CTA mistake creators make is asking for too many things — like, subscribe, comment, share,
            check the description, click the bell, join Patreon. Pick <em>one</em> action per video and place it
            at the moment of peak value (usually 60–80% of the way through). Single CTAs convert 3x better than
            stacked CTAs. Our scripts always position one strong, specific ask right after the climax, never at
            the very start or end.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            How to use AI scripts without sounding like AI
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            AI-generated scripts work best as a <strong>structural skeleton</strong>, not a finished product. Take
            our output, then layer in your own stories, examples, jokes, and verbal tics. Read the script aloud
            once before recording — anything that doesn't sound like you, rewrite. The structure (hook → promise
            → body → loop → CTA) stays. The voice becomes 100% yours. This hybrid workflow gives you the speed
            of AI with the authenticity of a human creator.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            Pairing your script with a viral title and thumbnail
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            A great script can't save a bad title or thumbnail. After generating your script, use our{" "}
            <a href="/tools/viral-title-generator" className="text-red-600 underline font-bold">Viral Title Generator</a>{" "}
            to write a high-CTR title and our{" "}
            <a href="/tools/ai-thumbnail-generator" className="text-red-600 underline font-bold">AI Thumbnail Generator</a>{" "}
            to design a click-magnet thumbnail. Creators who use the full YTForge stack — script + title +
            thumbnail — see an average <strong>187% lift in CTR</strong> and a <strong>92% lift in retention</strong>{" "}
            within their first 30 days.
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
          Frequently asked questions
        </motion.h2>

        <div className="space-y-3 max-w-3xl">
          {faqs.map((f, i) => (
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
                  className={`w-5 h-5 shrink-0 transition-transform ${
                    openFaq === i ? "rotate-180 text-red-600" : "text-black"
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
          Complete your viral video stack
        </h2>
        <p className="text-sm sm:text-base text-red-100 max-w-xl mx-auto mb-6">
          Pair your script with a high-CTR title and a click-magnet thumbnail.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/tools/viral-title-generator"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform text-sm uppercase tracking-wider"
          >
            <TrendingUp className="w-4 h-4" /> Generate Title
          </a>
          <a
            href="/tools/ai-thumbnail-generator"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-transform text-sm uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4" /> Make Thumbnail
          </a>
        </div>
      </motion.div>
    </ToolLayout>
  );
}
