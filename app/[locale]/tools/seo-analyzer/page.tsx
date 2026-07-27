"use client";

import { copyToClipboard } from "@/lib/clipboard";
import { friendlyApiError } from "@/lib/apiError";
import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslations } from "@/lib/i18n/useTranslations";
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
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import { StreamingPreview } from "@/components/tools/StreamingPreview";
import { streamJson } from "@/lib/streamJson";
import { StatsStrip, GuideGrid, Workflow, SeoContent, FaqAccordion, CrossCTA } from "@/components/tools/ToolSections";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.ytforge.app";

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
  const { t } = useTranslations();
  const content = t("toolPages.seoAnalyzer");

  if (!content) return null;

  const guides = [
    { icon: CheckCircle2, color: "text-green-600 bg-green-100", ...content.guides[0] },
    { icon: CheckCircle2, color: "text-green-600 bg-green-100", ...content.guides[1] },
    { icon: CheckCircle2, color: "text-green-600 bg-green-100", ...content.guides[2] },
    { icon: XCircle, color: "text-red-600 bg-red-100", ...content.guides[3] },
    { icon: XCircle, color: "text-red-600 bg-red-100", ...content.guides[4] },
    { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100", ...content.guides[5] },
  ];

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("English");
  const [audience, setAudience] = useState("General");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<SeoResult | null>(null);
  const [seoStep, setSeoStep] = useState(0);
  const [streamText, setStreamText] = useState("");
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!loading) {
      setSeoStep(0);
      return;
    }
    const id = setInterval(() => {
      setSeoStep((s) => (s + 1) % content.loadingSteps.length);
    }, 1100);
    return () => clearInterval(id);
  }, [loading]);

  const run = async () => {
    if (!title.trim() || !description.trim() || loading) return;
    setLoading(true);
    setError(null);
    setData(null);
    setStreamText("");

    abortRef.current = streamJson<SeoResult>(
      `${BASE_URL}/api/seo-analyze/stream`,
      {
        title: title.trim(),
        description: description.trim(),
        language,
        audience,
      },
      {
        onDelta: (full) => setStreamText(full),
        onDone: (result, _raw, err) => {
          if (result) {
            setData(result);
          } else if (err) {
            setError(friendlyApiError(err, 0));
          } else {
            setError(friendlyApiError("Empty response from server.", 0));
          }
          setStreamText("");
        },
        onError: (message) => {
          setError(friendlyApiError(message, 0));
          setStreamText("");
        },
      }
    );

    setLoading(false);
  };

  const cancel = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
    setStreamText("");
  };

  return (
    <ToolLayout
      title={content.title}
      description={content.description}
      icon={LineChart}
      badge={content.badge}
    >
      <StatsStrip stats={content.stats} />

      <ToolCard className="mb-6">
        <div className="space-y-4">
          <div>
            <label className="text-[11px] font-black uppercase tracking-wider text-neutral-600 flex items-center gap-1.5 mb-2">
              <Type className="w-3.5 h-3.5 text-red-600" /> {content.configTitle}
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={content.configTitlePlaceholder}
              className="w-full px-3 py-3 border-2 border-black rounded-xl outline-none text-sm font-medium bg-white"
            />
            <div className="text-[10px] font-bold text-neutral-500 mt-1">{title.length} {content.charsLimit100}</div>
          </div>

          <div>
            <label className="text-[11px] font-black uppercase tracking-wider text-neutral-600 flex items-center gap-1.5 mb-2">
              <FileText className="w-3.5 h-3.5 text-red-600" /> {content.configDesc}
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder={content.configDescPlaceholder}
              className="w-full px-3 py-3 border-2 border-black rounded-xl outline-none text-sm font-medium bg-white resize-y"
            />
            <div className="text-[10px] font-bold text-neutral-500 mt-1">{description.length} {content.charsLimit5000}</div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[11px] font-black uppercase tracking-wider text-neutral-600 flex items-center gap-1.5 mb-2">
                <Languages className="w-3.5 h-3.5 text-red-600" /> {content.configLang}
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
                <Users className="w-3.5 h-3.5 text-red-600" /> {content.configAudience}
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
            {loading ? content.analyzingBtn : content.analyzeBtn}
          </PrimaryButton>
        </div>
      </ToolCard>

      <StreamingPreview
        open={loading || !!streamText}
        text={streamText}
        onCancel={loading ? cancel : undefined}
        title="Streaming analysis"
      />

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
                  <AlertCircle className="w-3 h-3" /> {content.analysisFailed}
                </div>
                <h3 className="font-black text-2xl tracking-tight mb-2">{content.errorTitle}</h3>
                <p className="text-sm text-neutral-600 font-medium max-w-md">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="mt-5 inline-flex items-center gap-1.5 px-4 py-2.5 bg-black text-white text-xs font-black rounded-xl border-2 border-black hover:bg-red-600 transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Search className="w-3.5 h-3.5" /> {content.tryAgainBtn}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {loading && !streamText && (
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
                      {content.loadingTitle}
                    </motion.div>
                    <div className="overflow-hidden h-5 mt-1.5 relative">
                      {content.loadingSteps.map((step: string, i: number) => (
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
                      { icon: Type, label: content.titleAnalysisLabel, w: "w-2/3" },
                      { icon: FileText, label: content.descAnalysisLabel, w: "w-3/4" },
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
                      <Sparkles className="w-3 h-3" /> {content.overallScoreLabel}
                    </div>
                    <h2 className="font-black text-xl sm:text-2xl tracking-tight">
                      {data.currentScore >= 85 ? content.scoreFeedback.excellent : data.currentScore >= 70 ? content.scoreFeedback.good : data.currentScore >= 55 ? content.scoreFeedback.average : content.scoreFeedback.poor}
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
                  <div className="font-black text-sm">{content.titleAnalysisLabel}</div>
                  <div className="ml-auto px-2 py-0.5 bg-black text-white text-[10px] font-black rounded-full">{data.titleAnalysis.score}/100</div>
                </div>
                <div className="p-4 space-y-3 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    <Pill ok={data.titleAnalysis.hasNumber} label={content.pillLabels.number} />
                    <Pill ok={data.titleAnalysis.hasPowerWord} label={content.pillLabels.powerWord} />
                    <Pill ok={data.titleAnalysis.hasKeyword} label={content.pillLabels.keyword} />
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border-2 border-black text-[10px] font-black bg-blue-100 text-blue-700">
                      {data.titleAnalysis.length} {content.pillLabels.chars}
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
                      <div className="text-[10px] font-black uppercase tracking-wider text-green-700">{content.strengthsLabel}</div>
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
                      <div className="text-[10px] font-black uppercase tracking-wider text-red-700">{content.weaknessesLabel}</div>
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
                  <div className="font-black text-sm">{content.descAnalysisLabel}</div>
                  <div className="ml-auto px-2 py-0.5 bg-black text-white text-[10px] font-black rounded-full">{data.descriptionAnalysis.score}/100</div>
                </div>
                <div className="p-4 space-y-3 flex-1">
                  <div className="flex flex-wrap gap-1.5">
                    <Pill ok={data.descriptionAnalysis.hasKeywords} label={content.pillLabels.keywords} />
                    <Pill ok={data.descriptionAnalysis.hasCTA} label={content.pillLabels.cta} />
                    <Pill ok={data.descriptionAnalysis.hasTimestamps} label={content.pillLabels.timestamps} />
                    <Pill ok={data.descriptionAnalysis.hasLinks} label={content.pillLabels.links} />
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border-2 border-black text-[10px] font-black bg-blue-100 text-blue-700">
                      {data.descriptionAnalysis.length} {content.pillLabels.chars}
                    </div>
                    <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border-2 border-black text-[10px] font-black bg-purple-100 text-purple-700">
                      {content.pillLabels.density} {data.descriptionAnalysis.keywordDensity}
                    </div>
                  </div>

                  {data.descriptionAnalysis.strengths.length > 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] font-black uppercase tracking-wider text-green-700">{content.strengthsLabel}</div>
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
                <div className="font-black text-sm">{content.improvedTitleLabel}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-neutral-200">
                <div className="p-4">
                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">{content.originalLabel}</div>
                  <div className="text-sm font-bold text-neutral-700 p-3 bg-neutral-50 border-2 border-neutral-200 rounded-lg">
                    {title}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-black uppercase tracking-wider text-green-700">{content.improvedLabel}</div>
                    <CopyBtn text={data.suggestions.improvedTitle} />
                  </div>
                  <div className="text-sm font-bold text-neutral-900 p-3 bg-green-50 border-2 border-green-300 rounded-lg">
                    {data.suggestions.improvedTitle}
                  </div>
                </div>
              </div>
              {data.suggestions.titleImprovements.length > 0 && (
                <div className="px-4 py-3 border-t-2 border-black bg-neutral-50">
                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">{content.whatChangedLabel}</div>
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
                <div className="font-black text-sm">{content.improvedDescLabel}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y-2 md:divide-y-0 md:divide-x-2 divide-neutral-200">
                <div className="p-4">
                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">{content.originalLabel}</div>
                  <div className="text-xs font-medium text-neutral-700 p-3 bg-neutral-50 border-2 border-neutral-200 rounded-lg whitespace-pre-line max-h-72 overflow-y-auto leading-relaxed">
                    {description}
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-[10px] font-black uppercase tracking-wider text-green-700">{content.improvedLabel}</div>
                    <CopyBtn text={data.suggestions.improvedDescription} />
                  </div>
                  <div className="text-xs font-medium text-neutral-900 p-3 bg-green-50 border-2 border-green-300 rounded-lg whitespace-pre-line max-h-72 overflow-y-auto leading-relaxed">
                    {data.suggestions.improvedDescription}
                  </div>
                </div>
              </div>
              {data.suggestions.descriptionImprovements.length > 0 && (
                <div className="px-4 py-3 border-t-2 border-black bg-neutral-50">
                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">{content.whatChangedLabel}</div>
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
                  <div className="font-black text-sm">{content.kwSuggestionsLabel}</div>
                </div>
                <div className="p-4 flex flex-wrap gap-1.5">
                  {data.suggestions.keywordSuggestions.length === 0 ? (
                    <div className="text-xs text-neutral-500 font-bold">{content.noKwSuggestions}</div>
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
                  <div className="font-black text-sm">{content.hashtagSuggestionsLabel}</div>
                </div>
                <div className="p-4 flex flex-wrap gap-1.5">
                  {data.suggestions.hashtagSuggestions.length === 0 ? (
                    <div className="text-xs text-neutral-500 font-bold">{content.noHashtagSuggestions}</div>
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
        badge={content.rulesBadge}
        title={content.rulesTitle}
        intro={content.rulesIntro}
        cards={guides}
      />

      <Workflow
        title={content.workflowTitle}
        steps={content.workflows}
      />

      <SeoContent badge={content.seoContent.badge} title={content.seoContent.title}>
        <p>{content.seoContent.p1}</p>
        <h3>{content.seoContent.h3_1}</h3>
        <p>{content.seoContent.p2_1}</p>
        <h3>{content.seoContent.h3_2}</h3>
        <p>{content.seoContent.p2_2}</p>
        <h3>{content.seoContent.h3_3}</h3>
        <p>{content.seoContent.p2_3}</p>
        <h3>{content.seoContent.h3_4}</h3>
        <p>{content.seoContent.p2_4}</p>
        <h3>{content.seoContent.h3_5}</h3>
        <p>{content.seoContent.p2_5}</p>
      </SeoContent>

      <FaqAccordion faqs={content.faqs} />

      <CrossCTA
        title={content.ctaTitle}
        desc={content.ctaDesc}
        primary={{ label: content.ctaBtn1, href: "/tools/viral-title-generator", icon: TrendingUp }}
        secondary={{ label: content.ctaBtn2, href: "/tools/ai-script-writer", icon: PenTool }}
      />
      <ToolSeoJsonLd
        name={content.title}
        description={content.seoJsonDesc}
        slug="seo-analyzer"
        faqs={content.faqs}
        breadcrumb={[
          { name: "Home", slug: "/" },
          { name: "Tools", slug: "/tools" },
          { name: content.title, slug: "/tools/seo-analyzer" },
        ]}
      />
    </ToolLayout>
  );
}
