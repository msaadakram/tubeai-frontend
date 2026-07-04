"use client";

import { copyToClipboard } from "@/lib/clipboard";
import { friendlyApiError } from "@/lib/apiError";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LineChart,
  Loader2,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  TrendingUp,
  PenTool,
  AlertCircle,
  FileText,
  Sparkles,
  Hash,
  Type,
  Languages,
  Users,
  Copy,
  Check,
  Wand2,
} from "lucide-react";
import { ToolLayout, ToolCard, PrimaryButton } from "@/components/tools/ToolLayout";
import { StatsStrip, GuideGrid, Workflow, SeoContent, FaqAccordion, CrossCTA } from "@/components/tools/ToolSections";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://tubeai-backend.vercel.app";

type TitleAnalysis = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  length: number;
  hasNumber: boolean;
  hasPowerWord: boolean;
  hasKeyword: boolean;
  keywordPlacement: string;
  readability: string;
};

type DescriptionAnalysis = {
  score: number;
  strengths: string[];
  weaknesses: string[];
  length: number;
  hasKeywords: boolean;
  hasCTA: boolean;
  hasTimestamps: boolean;
  hasLinks: boolean;
  keywordDensity: string;
};

type Suggestions = {
  improvedTitle: string;
  titleImprovements: string[];
  improvedDescription: string;
  descriptionImprovements: string[];
  keywordSuggestions: string[];
  hashtagSuggestions: string[];
};

type SeoResult = {
  currentScore: number;
  titleAnalysis: TitleAnalysis;
  descriptionAnalysis: DescriptionAnalysis;
  suggestions: Suggestions;
  overallFeedback: string;
};

const LANGUAGES = ["English", "Spanish", "Hindi", "French", "German", "Portuguese", "Arabic", "Japanese", "Korean", "Indonesian"];
const AUDIENCES = ["General", "Beginners", "Intermediate", "Advanced", "Developers", "Students", "Professionals", "Kids", "Teens", "Entrepreneurs"];

const SEO_LOADING_STEPS = [
  "Scanning title length & keyword placement...",
  "Checking power words & readability...",
  "Auditing description depth, CTAs & timestamps...",
  "Scoring against 20+ ranking signals...",
  "Writing AI-improved title & description...",
];

const stats = [
  { value: "Live", label: "AI Powered" },
  { value: "100", label: "Score Range" },
  { value: "<3s", label: "Analysis Time" },
  { value: "100%", label: "Free Forever" },
];

const guides = [
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Front-load keywords", desc: "Place your primary keyword in the first 60 characters of the title for max CTR." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Use power words", desc: "Words like 'Ultimate', 'Secret', 'Proven' boost click-through by 30%+." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Add CTAs in description", desc: "Subscribe, Like, Comment prompts in the first 150 chars lift engagement." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't keyword stuff", desc: "Repeating the same keyword 5+ times triggers spam filters." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't write 10-word descriptions", desc: "Aim for 200+ words with timestamps, links, and hashtags." },
  { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100", title: "Refresh old metadata", desc: "Re-optimizing titles & descriptions can lift impressions 30–60%." },
];

const faqs = [
  { q: "How does this analyzer score my video?", a: "We send your title, description, language, and audience to our AI which scores against 20+ proven SEO ranking signals — title length, keyword placement, power words, description depth, CTAs, hashtags, and more." },
  { q: "Will my video rank #1 if I score 100?", a: "A perfect SEO score gives you the strongest foundation, but watch time, CTR, and audience retention also drive ranking. SEO gets you discovered — content keeps you ranked." },
  { q: "Can I use the improved title and description directly?", a: "Yes — copy them directly into YouTube Studio. They're tuned for your selected language and audience." },
  { q: "Is the audience selection important?", a: "Critical. The same topic written for Beginners vs Developers needs entirely different keywords, hooks, and tone. Pick precisely." },
];

function ScoreRing({ score }: { score: number }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  const color = score >= 85 ? "#16a34a" : score >= 70 ? "#f59e0b" : score >= 55 ? "#ea580c" : "#dc2626";
  return (
    <div className="relative w-32 h-32">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle cx="60" cy="60" r={r} stroke="#f3f4f6" strokeWidth="10" fill="none" />
        <circle
          cx="60" cy="60" r={r} stroke={color} strokeWidth="10" fill="none"
          strokeLinecap="round" strokeDasharray={c} strokeDashoffset={off}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="font-black text-3xl tabular-nums leading-none">{score}</div>
        <div className="text-[9px] font-black uppercase tracking-wider text-neutral-500 mt-0.5">/ 100</div>
      </div>
    </div>
  );
}

function Pill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border-2 border-black text-[10px] font-black ${ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
      {ok ? <Check className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
      {label}
    </div>
  );
}

function CopyBtn({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => {
        copyToClipboard(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }}
      className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-black rounded-lg border-2 border-black bg-white hover:bg-red-50 transition"
    >
      {copied ? <><Check className="w-3 h-3 text-green-600" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
    </button>
  );
}

export default function SeoAnalyzerPage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [audience, setAudience] = useState("General");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SeoResult | null>(null);
  const [seoStep, setSeoStep] = useState(0);

  useEffect(() => {
    if (!loading) {
      setSeoStep(0);
      return;
    }
    const id = setInterval(() => {
      setSeoStep((s) => (s + 1) % SEO_LOADING_STEPS.length);
    }, 1100);
    return () => clearInterval(id);
  }, [loading]);

  const run = async () => {
    if (!title.trim() || !description.trim() || loading) return;
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const res = await fetch(`${BASE_URL}/api/seo-analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          language,
          audience,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(friendlyApiError(body?.error || "", res.status));
      }
      setData(body.data as SeoResult);
    } catch (err: any) {
      setError(friendlyApiError(err?.message || "", 0));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="SEO Analyzer"
      description="Score your YouTube title and description against 20+ ranking signals — and get an AI-rewritten version optimized for your audience."
      icon={LineChart}
      badge="AI Powered · Title + Description Audit"
    >
      <StatsStrip stats={stats} />

      <ToolCard className="mb-6">
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-black uppercase tracking-wider text-neutral-600 flex items-center gap-1.5 mb-2">
              <Type className="w-3.5 h-3.5 text-red-600" /> Video Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 7 React Hooks That Changed How I Code Forever"
              className="w-full px-3 py-3 border-2 border-black rounded-xl outline-none text-sm font-medium bg-white"
            />
            <div className="text-[10px] font-bold text-neutral-500 mt-1">{title.length} chars · YouTube limit 100</div>
          </div>

          <div>
            <label className="text-[11px] font-black uppercase tracking-wider text-neutral-600 flex items-center gap-1.5 mb-2">
              <FileText className="w-3.5 h-3.5 text-red-600" /> Video Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Paste your full video description here including timestamps, links, hashtags..."
              className="w-full px-3 py-3 border-2 border-black rounded-xl outline-none text-sm font-medium bg-white resize-y"
            />
            <div className="text-[10px] font-bold text-neutral-500 mt-1">{description.length} chars · YouTube limit 5000</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-neutral-600 flex items-center gap-1.5 mb-2">
                <Languages className="w-3.5 h-3.5 text-red-600" /> Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full px-3 py-3 border-2 border-black rounded-xl outline-none text-sm font-bold bg-white"
              >
                {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-neutral-600 flex items-center gap-1.5 mb-2">
                <Users className="w-3.5 h-3.5 text-red-600" /> Target Audience
              </label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                className="w-full px-3 py-3 border-2 border-black rounded-xl outline-none text-sm font-bold bg-white"
              >
                {AUDIENCES.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
          </div>

          <PrimaryButton onClick={run} disabled={loading || !title.trim() || !description.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Analyzing..." : "Analyze SEO"}
          </PrimaryButton>
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
                  <AlertCircle className="w-3 h-3" /> Analysis Failed
                </div>
                <h3 className="font-black text-2xl tracking-tight mb-2">We couldn't analyze that</h3>
                <p className="text-sm text-neutral-600 font-medium max-w-md">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-5 inline-flex items-center gap-1.5 px-4 py-2.5 bg-black text-white text-xs font-black rounded-xl border-2 border-black hover:bg-red-600 transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Search className="w-3.5 h-3.5" /> Try again
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mb-12 sm:mb-16"
          >
            <div className="relative bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              {/* Animated gradient top bar */}
              <div
                className="h-1.5 w-full"
                style={{
                  background:
                    "linear-gradient(90deg, #dc2626, #f59e0b, #fbbf24, #dc2626)",
                  backgroundSize: "200% 100%",
                  animation: "seo-shimmer 1.8s linear infinite",
                }}
              />

              <div className="relative p-6 sm:p-10">
                {/* Glow backdrop */}
                <div
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full blur-3xl opacity-20 pointer-events-none"
                  style={{ background: "radial-gradient(circle, #dc2626 0%, transparent 70%)" }}
                />

                <div className="relative flex flex-col items-center justify-center gap-5">
                  {/* Animated SEO score ring */}
                  <div className="relative w-28 h-28">
                    {/* Spinning conic ring */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background:
                          "conic-gradient(from 0deg, transparent 0%, #dc2626 25%, #f59e0b 50%, transparent 75%)",
                        animation: "seo-ring-spin 1.4s linear infinite",
                        WebkitMask:
                          "radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 7px))",
                        mask: "radial-gradient(farthest-side, transparent calc(100% - 7px), #000 calc(100% - 7px))",
                      }}
                    />
                    {/* Inner card with icon */}
                    <div className="absolute inset-[10px] rounded-full bg-white border-2 border-black flex items-center justify-center shadow-[inset_0_0_0_2px_rgba(0,0,0,0.04)]">
                      <motion.div
                        animate={{ scale: [1, 1.12, 1] }}
                        transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <LineChart className="w-9 h-9 text-red-600" />
                      </motion.div>
                    </div>
                  </div>

                  {/* Equalizer bars */}
                  <div className="flex items-end justify-center gap-1.5 h-8" aria-hidden>
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 rounded-full"
                        style={{
                          height: "100%",
                          transformOrigin: "bottom",
                          background:
                            i % 2 === 0
                              ? "linear-gradient(to top, #dc2626, #f59e0b)"
                              : "linear-gradient(to top, #f59e0b, #fbbf24)",
                          animation: `seo-bar-grow 1s ease-in-out ${i * 0.12}s infinite`,
                        }}
                      />
                    ))}
                  </div>

                  {/* Title + rotating status messages */}
                  <div className="text-center">
                    <motion.div
                      animate={{ opacity: [0.6, 1, 0.6] }}
                      transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
                      className="font-black text-base sm:text-lg"
                    >
                      Analyzing SEO...
                    </motion.div>
                    <div className="overflow-hidden h-5 mt-1.5 relative">
                      {SEO_LOADING_STEPS.map((step, i) => (
                        <motion.div
                          key={step}
                          className="absolute inset-0 text-xs text-neutral-500 font-bold flex items-center justify-center"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{
                            opacity: i === seoStep ? 1 : 0,
                            y: i === seoStep ? 0 : 8,
                          }}
                          transition={{ duration: 0.4 }}
                        >
                          {step}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Skeleton preview cards */}
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                    {[
                      { icon: Type, label: "Title Analysis", w: "w-2/3" },
                      { icon: FileText, label: "Description Analysis", w: "w-3/4" },
                    ].map((c, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 + i * 0.1 }}
                        className="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-3 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-lg bg-white border-2 border-neutral-200 flex items-center justify-center shrink-0">
                          <c.icon className="w-4 h-4 text-red-500" />
                        </div>
                        <div className="flex-1 min-w-0 space-y-2">
                          <div
                            className={`h-2.5 ${c.w} rounded-full`}
                            style={{
                              background:
                                "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
                              backgroundSize: "200% 100%",
                              animation: "seo-shimmer 1.4s linear infinite",
                            }}
                          />
                          <div
                            className="h-2 w-1/2 rounded-full"
                            style={{
                              background:
                                "linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%)",
                              backgroundSize: "200% 100%",
                              animation: "seo-shimmer 1.4s linear infinite",
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && data && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16 space-y-5"
          >
            {/* SCORE HERO */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="relative bg-gradient-to-br from-red-600 via-red-500 to-orange-500 p-5 sm:p-6 border-b-2 border-black">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:24px_24px]" />
                <div className="relative flex flex-col sm:flex-row items-center gap-5">
                  <div className="bg-white border-4 border-black rounded-2xl p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]">
                    <ScoreRing score={data.currentScore} />
                  </div>
                  <div className="flex-1 min-w-0 text-center sm:text-left text-white">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 mb-2 bg-black text-white text-[10px] font-black rounded-full">
                      <Sparkles className="w-3 h-3" /> Overall SEO Score
                    </div>
                    <h2 className="font-black text-xl sm:text-2xl tracking-tight">
                      {data.currentScore >= 85 ? "Excellent — ready to publish" : data.currentScore >= 70 ? "Good — small tweaks will help" : data.currentScore >= 55 ? "Average — apply the rewrites below" : "Needs work — use the improved version"}
                    </h2>
                    <p className="text-sm font-medium mt-1 text-white/90">{data.overallFeedback}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TITLE + DESCRIPTION ANALYSIS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* TITLE */}
              <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b-2 border-black bg-neutral-50 flex items-center gap-2">
                  <Type className="w-4 h-4 text-red-600" />
                  <div className="font-black text-sm">Title Analysis</div>
                  <div className="ml-auto px-2 py-0.5 bg-black text-white text-[10px] font-black rounded-full">{data.titleAnalysis.score}/100</div>
                </div>
                <div className="p-4 space-y-3 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    <Pill ok={data.titleAnalysis.hasNumber} label="Number" />
                    <Pill ok={data.titleAnalysis.hasPowerWord} label="Power Word" />
                    <Pill ok={data.titleAnalysis.hasKeyword} label="Keyword" />
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border-2 border-black text-[10px] font-black bg-blue-100 text-blue-700">
                      {data.titleAnalysis.length} chars
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border-2 border-black text-[10px] font-black bg-purple-100 text-purple-700">
                      {data.titleAnalysis.readability}
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border-2 border-black text-[10px] font-black bg-yellow-100 text-yellow-800">
                      {data.titleAnalysis.keywordPlacement}
                    </div>
                  </div>

                  {data.titleAnalysis.strengths.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-black uppercase tracking-wider text-green-700">Strengths</div>
                      {data.titleAnalysis.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 bg-green-50 border-2 border-green-200 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                          <div className="text-[11px] font-medium text-neutral-700">{s}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {data.titleAnalysis.weaknesses.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-black uppercase tracking-wider text-red-700">Weaknesses</div>
                      {data.titleAnalysis.weaknesses.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 bg-red-50 border-2 border-red-200 rounded-lg">
                          <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                          <div className="text-[11px] font-medium text-neutral-700">{s}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* DESCRIPTION */}
              <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
                <div className="px-4 py-3 border-b-2 border-black bg-neutral-50 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-red-600" />
                  <div className="font-black text-sm">Description Analysis</div>
                  <div className="ml-auto px-2 py-0.5 bg-black text-white text-[10px] font-black rounded-full">{data.descriptionAnalysis.score}/100</div>
                </div>
                <div className="p-4 space-y-3 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    <Pill ok={data.descriptionAnalysis.hasKeywords} label="Keywords" />
                    <Pill ok={data.descriptionAnalysis.hasCTA} label="CTA" />
                    <Pill ok={data.descriptionAnalysis.hasTimestamps} label="Timestamps" />
                    <Pill ok={data.descriptionAnalysis.hasLinks} label="Links" />
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border-2 border-black text-[10px] font-black bg-blue-100 text-blue-700">
                      {data.descriptionAnalysis.length} chars
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border-2 border-black text-[10px] font-black bg-purple-100 text-purple-700">
                      Density: {data.descriptionAnalysis.keywordDensity}
                    </div>
                  </div>

                  {data.descriptionAnalysis.strengths.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-black uppercase tracking-wider text-green-700">Strengths</div>
                      {data.descriptionAnalysis.strengths.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 bg-green-50 border-2 border-green-200 rounded-lg">
                          <CheckCircle2 className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" />
                          <div className="text-[11px] font-medium text-neutral-700">{s}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {data.descriptionAnalysis.weaknesses.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-black uppercase tracking-wider text-red-700">Weaknesses</div>
                      {data.descriptionAnalysis.weaknesses.map((s, i) => (
                        <div key={i} className="flex items-start gap-2 p-2 bg-red-50 border-2 border-red-200 rounded-lg">
                          <XCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                          <div className="text-[11px] font-medium text-neutral-700">{s}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* IMPROVED TITLE — side by side */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="px-4 py-3 border-b-2 border-black bg-gradient-to-r from-yellow-100 to-orange-100 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-orange-600" />
                <div className="font-black text-sm">AI-Improved Title</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-neutral-200">
                <div className="p-4">
                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">Original</div>
                  <div className="text-sm font-bold text-neutral-700 p-3 bg-neutral-50 border-2 border-neutral-200 rounded-lg">
                    {title}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-black uppercase tracking-wider text-green-700">Improved</div>
                    <CopyBtn text={data.suggestions.improvedTitle} />
                  </div>
                  <div className="text-sm font-bold text-neutral-900 p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                    {data.suggestions.improvedTitle}
                  </div>
                </div>
              </div>
              {data.suggestions.titleImprovements.length > 0 && (
                <div className="px-4 py-3 border-t-2 border-black bg-neutral-50">
                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">What changed</div>
                  <ul className="space-y-1">
                    {data.suggestions.titleImprovements.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] font-medium text-neutral-700">
                        <Sparkles className="w-3 h-3 text-orange-500 shrink-0 mt-0.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* IMPROVED DESCRIPTION */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="px-4 py-3 border-b-2 border-black bg-gradient-to-r from-yellow-100 to-orange-100 flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-orange-600" />
                <div className="font-black text-sm">AI-Improved Description</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-neutral-200">
                <div className="p-4">
                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">Original</div>
                  <div className="text-xs font-medium text-neutral-700 p-3 bg-neutral-50 border-2 border-neutral-200 rounded-lg whitespace-pre-line max-h-72 overflow-y-auto leading-relaxed">
                    {description}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-black uppercase tracking-wider text-green-700">Improved</div>
                    <CopyBtn text={data.suggestions.improvedDescription} />
                  </div>
                  <div className="text-xs font-medium text-neutral-900 p-3 bg-green-50 border-2 border-green-300 rounded-lg whitespace-pre-line max-h-72 overflow-y-auto leading-relaxed">
                    {data.suggestions.improvedDescription}
                  </div>
                </div>
              </div>
              {data.suggestions.descriptionImprovements.length > 0 && (
                <div className="px-4 py-3 border-t-2 border-black bg-neutral-50">
                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">What changed</div>
                  <ul className="space-y-1">
                    {data.suggestions.descriptionImprovements.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-[11px] font-medium text-neutral-700">
                        <Sparkles className="w-3 h-3 text-orange-500 shrink-0 mt-0.5" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* KEYWORDS + HASHTAGS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="px-4 py-3 border-b-2 border-black bg-neutral-50 flex items-center gap-2">
                  <Search className="w-4 h-4 text-red-600" />
                  <div className="font-black text-sm">Keyword Suggestions</div>
                </div>
                <div className="p-4 flex flex-wrap gap-1.5">
                  {data.suggestions.keywordSuggestions.length === 0 ? (
                    <div className="text-xs text-neutral-500 font-bold">No keyword suggestions returned.</div>
                  ) : (
                    data.suggestions.keywordSuggestions.map((kw) => (
                      <span key={kw} className="px-2.5 py-1 bg-red-50 border-2 border-black text-[11px] font-bold rounded-full">
                        {kw}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <div className="px-4 py-3 border-b-2 border-black bg-neutral-50 flex items-center gap-2">
                  <Hash className="w-4 h-4 text-red-600" />
                  <div className="font-black text-sm">Hashtag Suggestions</div>
                </div>
                <div className="p-4 flex flex-wrap gap-1.5">
                  {data.suggestions.hashtagSuggestions.length === 0 ? (
                    <div className="text-xs text-neutral-500 font-bold">No hashtag suggestions returned.</div>
                  ) : (
                    data.suggestions.hashtagSuggestions.map((tag) => (
                      <span key={tag} className="px-2.5 py-1 bg-blue-50 border-2 border-black text-[11px] font-bold rounded-full">
                        {tag.startsWith("#") ? tag : `#${tag}`}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !data && !error && <div key="empty" className="mb-12 sm:mb-16" />}
      </AnimatePresence>

      <GuideGrid
        badge="SEO Rules"
        title="Six rules to dominate YouTube video SEO"
        intro="Apply these and watch your video impressions climb across search and Browse."
        cards={guides}
      />

      <Workflow
        title="Your 4-step video SEO workflow"
        steps={[
          { n: "01", t: "Paste your title & description", d: "Drop in the metadata you're about to publish — or one already live." },
          { n: "02", t: "Set language and audience", d: "AI tunes the rewrite to your exact viewer — beginners need different keywords than pros." },
          { n: "03", t: "Apply the rewrites", d: "Copy the improved title and description directly into YouTube Studio." },
          { n: "04", t: "Re-analyze after edits", d: "Run again to confirm your score climbed. Aim for 85+ before publishing." },
        ]}
      />

      <SeoContent badge="Complete YouTube SEO Guide" title="The complete guide to YouTube video SEO in 2026">
        <p>YouTube is the second-largest search engine in the world, processing more than 3 billion searches per month. Your video's title and description are the two highest-impact SEO levers you control. Optimizing them with the right keywords, length, and structure can lift impressions 30-60% on the same content.</p>
        <h3>How YouTube ranking actually works</h3>
        <p>YouTube weighs three signals: <strong>relevance</strong> (does your title/description match the query?), <strong>engagement</strong> (CTR + watch time + likes), and <strong>authority</strong> (channel-level trust). The Title and Description are where you control relevance directly.</p>
        <h3>Title SEO: front-load keywords, use power words, add numbers</h3>
        <p>The first 60 characters of your title get the most weight in YouTube's index. Lead with your primary keyword, follow with a power word ("Ultimate", "Proven", "Secret"), and include a number when possible — numbered lists get 2x the CTR of unnumbered titles.</p>
        <h3>Description SEO: 200+ words, CTAs, timestamps, hashtags</h3>
        <p>The first 150 characters appear in search snippets — make them count. Below the fold, include 200+ words of context, 3-5 timestamps, social/affiliate links, and 1-3 hashtags at the bottom. YouTube uses your description to understand topical depth.</p>
        <h3>Match your audience precisely</h3>
        <p>The same React tutorial written for Beginners vs Senior Engineers needs entirely different vocabulary. Beginners search "how to use react hooks" — pros search "useReducer vs zustand performance". Pick your audience first, then write to it.</p>
        <h3>Pair video SEO with great titles, scripts, and thumbnails</h3>
        <p>SEO gets you discovered — content keeps you ranked. Use our <a href="/tools/viral-title-generator">Viral Title Generator</a> for click-magnet titles, our <a href="/tools/ai-script-writer">AI Script Writer</a> for retention-optimized scripts, and our <a href="/tools/ai-thumbnail-generator">AI Thumbnail Generator</a> for thumbnails that earn the click.</p>
      </SeoContent>

      <FaqAccordion faqs={faqs} />

      <CrossCTA
        title="Rank #1 in YouTube search"
        desc="Pair perfect video SEO with viral titles and click-magnet thumbnails."
        primary={{ label: "Generate Title", href: "/tools/viral-title-generator", icon: TrendingUp }}
        secondary={{ label: "Write Script", href: "/tools/ai-script-writer", icon: PenTool }}
      />
    </ToolLayout>
  );
}
