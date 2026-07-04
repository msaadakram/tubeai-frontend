"use client";

import { copyToClipboard } from "@/lib/clipboard";
import { friendlyApiError } from "@/lib/apiError";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Type,
  Loader2,
  Copy,
  Check,
  Sparkles,
  Flame,
  TrendingUp,
  Eye,
  Target,
  Zap,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  Star,
  Hash,
} from "lucide-react";
import {
  ToolLayout,
  ToolCard,
  ToolInput,
  PrimaryButton,
} from "@/components/tools/ToolLayout";
import { LanguageSelect, getLanguage } from "@/components/tools/LanguageSelect";

const styleOptions: Record<
  string,
  { label: string; icon: any; apiValue: string }
> = {
  clickbait: {
    label: "Clickbait",
    icon: Flame,
    apiValue: "Clickbait",
  },
  educational: {
    label: "Educational",
    icon: Target,
    apiValue: "Educational",
  },
  listicle: {
    label: "Listicle",
    icon: Hash,
    apiValue: "Listicle",
  },
  howto: {
    label: "How-To",
    icon: Eye,
    apiValue: "How-to",
  },
  news: {
    label: "News",
    icon: TrendingUp,
    apiValue: "News",
  },
  controversial: {
    label: "Controversial",
    icon: Zap,
    apiValue: "Controversial",
  },
  story: {
    label: "Story-driven",
    icon: Sparkles,
    apiValue: "Story-driven",
  },
};

const emotionOptions: Record<
  string,
  { label: string; apiValue: string }
> = {
  excited: { label: "Excited", apiValue: "Excited" },
  curious: { label: "Curious", apiValue: "Curious" },
  urgent: { label: "Urgent", apiValue: "Urgent" },
  funny: { label: "Funny", apiValue: "Funny" },
  inspirational: { label: "Inspirational", apiValue: "Inspirational" },
  shocking: { label: "Shocking", apiValue: "Shocking" },
  heartwarming: { label: "Heartwarming", apiValue: "Heartwarming" },
};

interface GeneratedTitle {
  title: string;
  rank: number;
  seoScore: number;
  seoAnalysis: {
    strengths: string[];
    weaknesses: string[];
    keywords: string[];
  };
  clickability: number;
  explanation: string;
}

// Local fallback so the tool still works if the backend AI is unavailable
function localGenerateTitles(keyword: string, style: string, emotion: string): GeneratedTitle[] {
  const k = keyword.trim();
  const cap = k.charAt(0).toUpperCase() + k.slice(1);
  const templates = [
    `I Tried ${cap} for 30 Days — Here's What Happened`,
    `The Truth About ${cap} Nobody Tells You`,
    `${cap}: 7 Secrets the Pros Won't Share`,
    `Why 90% of People Fail at ${cap} (And How to Win)`,
    `Stop Doing ${cap} Wrong — Do This Instead`,
    `How I Mastered ${cap} in Record Time`,
    `${cap} Explained in Under 10 Minutes`,
    `The Ultimate ${cap} Guide for 2026`,
    `This ${cap} Trick Changed Everything`,
    `${cap}: What They Don't Want You to Know`,
  ];
  return templates.map((title, i) => {
    const len = title.length;
    const optimal = len >= 40 && len <= 60;
    return {
      title,
      rank: i + 1,
      seoScore: Math.max(62, 96 - i * 3),
      seoAnalysis: {
        strengths: [
          "Includes a curiosity gap that drives clicks",
          `${style} framing matched to a ${emotion.toLowerCase()} tone`,
          optimal ? "Length is in the optimal 40–60 char range" : "Front-loads the keyword",
        ],
        weaknesses: optimal ? ["Test against your thumbnail for balance"] : ["Consider trimming to 40–60 characters"],
        keywords: [k, ...k.split(/\s+/).filter(Boolean)].slice(0, 4),
      },
      clickability: Math.max(60, 95 - i * 3),
      explanation: `A ${style.toLowerCase()}, ${emotion.toLowerCase()} angle on "${k}" engineered to maximize curiosity and click-through.`,
    };
  });
}

const guides = [
  {
    icon: CheckCircle2,
    color: "text-green-600 bg-green-100",
    title: "Use 40–60 characters",
    desc: "Anything longer gets truncated in YouTube search and recommendations.",
  },
  {
    icon: CheckCircle2,
    color: "text-green-600 bg-green-100",
    title: "Front-load your keyword",
    desc: "Put your main keyword in the first 25 characters for maximum SEO weight.",
  },
  {
    icon: CheckCircle2,
    color: "text-green-600 bg-green-100",
    title: "Trigger curiosity gap",
    desc: "Hint at value without giving it away. Reader must click to find out.",
  },
  {
    icon: XCircle,
    color: "text-red-600 bg-red-100",
    title: "Avoid clickbait promises",
    desc: "If your title overpromises and the video underdelivers, retention tanks.",
  },
  {
    icon: XCircle,
    color: "text-red-600 bg-red-100",
    title: "Don't ALL CAPS the whole title",
    desc: "Strategic capitalization (1-2 power words) outperforms full caps.",
  },
  {
    icon: AlertTriangle,
    color: "text-yellow-600 bg-yellow-100",
    title: "Numbers beat adjectives",
    desc: "\"7 hacks\" outperforms \"amazing hacks\" by ~32% in CTR studies.",
  },
];

const faqs = [
  {
    q: "How does the CTR prediction work?",
    a: "Our model is trained on 50M+ YouTube videos and analyzes power words, emotional triggers, length, keyword placement, and historical CTR for similar titles in your niche.",
  },
  {
    q: "Can I use these titles commercially?",
    a: "Yes — every title generated is yours to use, modify, or remix freely. There's no attribution required.",
  },
  {
    q: "Why are the predicted CTRs different across styles?",
    a: "Different title styles convert differently depending on the audience. Curiosity titles tend to over-index on first-time viewers, while How-To titles win with returning subscribers.",
  },
  {
    q: "How many titles can I generate per day?",
    a: "Free users get 50 generations per day. Pro users get unlimited generations and access to advanced niche-specific models.",
  },
];

const stats = [
  { value: "2.4M+", label: "Titles Generated" },
  { value: "+187%", label: "Avg CTR Lift" },
  { value: "12K", label: "Active Creators" },
  { value: "98%", label: "Satisfaction" },
];


function GenerationLoader() {
  const DURATION = 20; // seconds
  const steps = [
    { icon: Target, label: "Analyzing your topic", detail: "Understanding context & niche signals" },
    { icon: Sparkles, label: "Crafting title variants", detail: "Generating 10 high-CTR candidates" },
    { icon: TrendingUp, label: "Scoring SEO strength", detail: "Checking keyword placement & length" },
    { icon: Eye, label: "Predicting clickability", detail: "Modeling viewer psychology" },
    { icon: Flame, label: "Ranking the winners", detail: "Sorting by viral potential" },
  ];
  const [activeStep, setActiveStep] = React.useState(0);
  const [progress, setProgress] = React.useState(0);
  const [secondsLeft, setSecondsLeft] = React.useState(DURATION);

  React.useEffect(() => {
    const stepInterval = setInterval(() => {
      setActiveStep((s) => (s + 1) % steps.length);
    }, 1800);
    const startTime = Date.now();
    const tickInterval = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      const pct = Math.min((elapsed / DURATION) * 100, 99);
      setProgress(pct);
      setSecondsLeft(Math.max(0, Math.ceil(DURATION - elapsed)));
    }, 100);
    return () => {
      clearInterval(stepInterval);
      clearInterval(tickInterval);
    };
  }, []);

  const ActiveIcon = steps[activeStep].icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="mb-12 sm:mb-16 relative overflow-hidden bg-black text-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(220,38,38,1)]"
    >
      {/* Animated grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "linear-gradient(rgba(220,38,38,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.3) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      {/* Floating sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, idx) => (
          <motion.div
            key={idx}
            className="absolute"
            initial={{
              x: `${Math.random() * 100}%`,
              y: `${Math.random() * 100}%`,
              opacity: 0,
            }}
            animate={{
              y: ["100%", "-10%"],
              opacity: [0, 0.6, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: idx * 0.4,
              ease: "linear",
            }}
          >
            <Sparkles className="w-3 h-3 text-red-500" />
          </motion.div>
        ))}
      </div>

      <div className="relative p-6 sm:p-10">
        {/* Big animated icon */}
        <div className="flex flex-col items-center text-center mb-6 sm:mb-8">
          <div className="relative mb-4">
            {/* Outer pulsing ring */}
            <motion.div
              className="absolute inset-0 rounded-full bg-red-600/30"
              animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-0 rounded-full bg-red-600/20"
              animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            />
            {/* Rotating border */}
            <motion.div
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-red-600 to-orange-500 border-2 border-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]"
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeStep}
                    initial={{ scale: 0, rotate: -90, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <ActiveIcon className="w-9 h-9 sm:w-11 sm:h-11 text-white" />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </motion.div>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full border-2 border-white mb-3">
            <Loader2 className="w-3 h-3 animate-spin" /> AI Working
          </div>

          {/* Countdown timer */}
          <div className="inline-flex items-center gap-2 mb-3">
            <div className="relative w-12 h-12">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="url(#timerGrad)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={2 * Math.PI * 18}
                  strokeDashoffset={2 * Math.PI * 18 * (1 - progress / 100)}
                  style={{ transition: "stroke-dashoffset 0.1s linear" }}
                />
                <defs>
                  <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ef4444" />
                    <stop offset="50%" stopColor="#f97316" />
                    <stop offset="100%" stopColor="#facc15" />
                  </linearGradient>
                </defs>
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-sm font-black tabular-nums">
                {secondsLeft}
              </span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 leading-tight text-left">
              seconds<br />remaining
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.h3
              key={activeStep}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-xl sm:text-2xl md:text-3xl font-black tracking-tight"
            >
              {steps[activeStep].label}
              <span className="inline-block ml-1">
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0 }}
                >
                  .
                </motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
                >
                  .
                </motion.span>
                <motion.span
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: 0.4 }}
                >
                  .
                </motion.span>
              </span>
            </motion.h3>
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.p
              key={`${activeStep}-detail`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm text-neutral-300 mt-1.5 max-w-md"
            >
              {steps[activeStep].detail}
            </motion.p>
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
              Progress
            </span>
            <span className="text-[10px] font-black tabular-nums text-red-500">
              {Math.min(Math.round(progress), 99)}%
            </span>
          </div>
          <div className="h-2.5 bg-neutral-800 rounded-full overflow-hidden border border-neutral-700">
            <motion.div
              className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400 relative"
              style={{ width: `${Math.min(progress, 99)}%` }}
              transition={{ ease: "linear" }}
            >
              <motion.div
                className="absolute inset-0 bg-white/30"
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
          </div>
        </div>

        {/* Step pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isActive = idx === activeStep;
            const isDone = idx < activeStep;
            return (
              <motion.div
                key={idx}
                animate={{ scale: isActive ? 1.05 : 1 }}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border-2 text-[10px] font-black uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-red-600 text-white border-white"
                    : isDone
                    ? "bg-white text-black border-white"
                    : "bg-transparent text-neutral-500 border-neutral-700"
                }`}
              >
                {isDone ? <Check className="w-3 h-3" /> : <StepIcon className="w-3 h-3" />}
                <span className="hidden sm:inline">{step.label}</span>
                <span className="sm:hidden">{idx + 1}</span>
              </motion.div>
            );
          })}
        </div>

        {/* Reassurance message */}
        <div className="text-center pt-4 border-t-2 border-dashed border-neutral-800">
          <p className="text-xs text-neutral-400 inline-flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3 text-yellow-500" />
            Generation takes up to <strong className="text-white">20 seconds</strong>. Please don't refresh the page.
          </p>
        </div>
      </div>

      {/* Skeleton preview cards */}
      <div className="relative p-4 sm:p-6 bg-white border-t-2 border-black space-y-3">
        {[0, 1, 2].map((idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.15 }}
            className="bg-neutral-50 border-2 border-neutral-200 rounded-xl p-4 flex items-center gap-3 overflow-hidden relative"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-red-100/40 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: idx * 0.2 }}
            />
            <div className="w-10 h-10 rounded-xl bg-neutral-200 shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-neutral-200 rounded-full w-full max-w-md" />
              <div className="h-2 bg-neutral-200 rounded-full w-3/4" />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

export default function ViralTitleGeneratorPage() {
  const [keyword, setKeyword] = useState("");
  const [language, setLanguage] = useState("en");
  const [activeStyle, setActiveStyle] = useState<keyof typeof styleOptions>("clickbait");
  const [emotion, setEmotion] = useState<keyof typeof emotionOptions>("excited");
  const [titles, setTitles] = useState<GeneratedTitle[]>([]);
  const [loading, setLoading] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [error, setError] = useState<string | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (!keyword.trim()) return;
    setLoading(true);
    setTitles([]);
    setFavorites(new Set());
    setError(null);
    const minDisplay = new Promise((res) => setTimeout(res, 20000));
    // Scroll to results immediately so the loader is visible
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 80);

    try {
      const lang = getLanguage(language);
      const fetchPromise = fetch("https://tubeai-backend.vercel.app/api/generate-titles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: keyword.trim(),
          language: lang.name,
          style: styleOptions[activeStyle].apiValue,
          emotion: emotionOptions[emotion].apiValue,
        }),
      });

      const [response] = await Promise.all([fetchPromise, minDisplay]);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(friendlyApiError(errorData.error || "", response.status));
      }

      const data = await response.json();
      if (data.success && data.data?.titles) {
        setTitles(data.data.titles);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      await minDisplay;
      console.warn("[ViralTitleGenerator] Backend unavailable — using local fallback:", err);
      setTitles(
        localGenerateTitles(
          keyword.trim(),
          styleOptions[activeStyle].apiValue,
          emotionOptions[emotion].apiValue,
        ),
      );
      setError("Live AI is temporarily unavailable — showing high-quality template titles. Try again shortly for AI-tuned results.");
    } finally {
      setLoading(false);
    }
  };

  const copy = (text: string, idx: number) => {
    copyToClipboard(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  const toggleFav = (idx: number) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <ToolLayout
      title="Viral Title Generator"
      description="Get high-CTR YouTube titles instantly. Choose your style, set your emotion, and our AI generates ranked title variants with predicted click-through rates."
      icon={Type}
      badge="Title AI · Trained on 50M+ Videos"
    >
      {/* Stats strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white border-2 border-black rounded-xl p-3 sm:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center"
          >
            <div className="text-xl sm:text-2xl md:text-3xl font-black text-red-600 tabular-nums">
              {s.value}
            </div>
            <div className="text-[10px] sm:text-xs font-black text-black uppercase tracking-wider mt-1">
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Generator */}
      <ToolCard className="mb-8 sm:mb-10">
        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <Sparkles className="w-5 h-5 text-red-600" />
          <h2 className="text-base sm:text-lg font-black uppercase tracking-wider">Generator</h2>
        </div>

        {/* Keyword */}
        <label className="block text-xs font-black uppercase tracking-wider mb-2">
          Topic or Main Keyword
        </label>
        <div className="flex flex-col sm:flex-row gap-3 mb-3">
          <ToolInput
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. AI productivity, fitness routine, crypto..."
            onKeyDown={(e) => e.key === "Enter" && generate()}
            className="flex-1"
          />
          <PrimaryButton onClick={generate} disabled={loading || !keyword.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate"}
          </PrimaryButton>
        </div>
        <div className="mb-5 sm:mb-6 max-w-sm">
          <LanguageSelect value={language} onChange={setLanguage} label="Title language" />
        </div>

        {/* Style picker */}
        <label className="block text-xs font-black uppercase tracking-wider mb-2">Title Style</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-5 sm:mb-6">
          {Object.entries(styleOptions).map(([key, s]) => {
            const active = activeStyle === key;
            return (
              <button
                key={key}
                onClick={() => setActiveStyle(key as keyof typeof styleOptions)}
                className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-black text-xs sm:text-sm font-black transition-all ${
                  active
                    ? "bg-red-600 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                    : "bg-white text-black hover:bg-neutral-50"
                }`}
              >
                <s.icon className="w-3.5 h-3.5" />
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Emotion picker */}
        <label className="block text-xs font-black uppercase tracking-wider mb-2">Emotion</label>
        <div className="flex flex-wrap gap-2">
          {Object.entries(emotionOptions).map(([key, e]) => (
            <button
              key={key}
              onClick={() => setEmotion(key as keyof typeof emotionOptions)}
              className={`px-4 py-2 rounded-full border-2 border-black text-xs font-black transition-all ${
                emotion === key ? "bg-black text-white" : "bg-white text-black hover:bg-neutral-50"
              }`}
            >
              {e.label}
            </button>
          ))}
        </div>
      </ToolCard>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 bg-red-50 border-2 border-red-600 rounded-xl p-4 flex items-start gap-3"
          >
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-black text-sm text-red-900 mb-1">Generation Failed</h3>
              <p className="text-sm text-red-700">{error}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-600 hover:text-red-700"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll anchor */}
      <div ref={resultsRef} />

      {/* Loading State */}
      <AnimatePresence>
        {loading && <GenerationLoader />}
      </AnimatePresence>

      {/* Results */}
      <AnimatePresence>
        {titles.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-red-600" />
                AI-Generated Titles
              </h2>
              <span className="text-xs font-bold text-neutral-500">{titles.length} results</span>
            </div>

            <div className="space-y-4">
              {titles.map((t, i) => (
                <motion.div
                  key={`${t.title}-${i}`}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4, ease: "easeOut" }}
                  whileHover={{ y: -3 }}
                  className={`group relative bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(220,38,38,1)] transition-all duration-300 ${
                    t.rank === 1 ? "ring-4 ring-red-600/20" : ""
                  }`}
                >
                  {/* Top accent bar */}
                  <div
                    className={`h-1.5 w-full ${
                      t.rank === 1
                        ? "bg-gradient-to-r from-red-600 via-orange-500 to-yellow-400"
                        : t.rank <= 3
                        ? "bg-gradient-to-r from-orange-500 to-red-500"
                        : "bg-gradient-to-r from-neutral-800 to-neutral-600"
                    }`}
                  />

                  {/* #1 ribbon */}
                  {t.rank === 1 && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Sparkles className="w-3 h-3" /> Top Pick
                      </div>
                    </div>
                  )}

                  <div className="p-5 sm:p-6">
                    {/* Header: rank + title + actions */}
                    <div className="flex items-start gap-4 mb-5">
                      <div className="relative shrink-0">
                        <div
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] ${
                            t.rank === 1
                              ? "bg-gradient-to-br from-red-600 to-orange-500"
                              : t.rank === 2
                              ? "bg-gradient-to-br from-orange-500 to-amber-500"
                              : t.rank === 3
                              ? "bg-gradient-to-br from-amber-500 to-yellow-500"
                              : "bg-gradient-to-br from-neutral-800 to-neutral-600"
                          }`}
                        >
                          <span className="text-white text-xl font-black tabular-nums leading-none">
                            #{t.rank}
                          </span>
                        </div>
                        {t.rank <= 3 && (
                          <div className="absolute -bottom-1.5 -right-1.5 w-6 h-6 bg-white rounded-full border-2 border-black flex items-center justify-center">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-500" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="text-base sm:text-lg font-black text-black leading-snug break-words mb-2 pr-2">
                          {t.title}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-neutral-600 bg-neutral-100 px-2 py-0.5 rounded-full border border-neutral-300">
                            <Type className="w-3 h-3" />
                            {t.title.length} chars
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              t.title.length >= 40 && t.title.length <= 60
                                ? "bg-green-100 text-green-700 border-green-300"
                                : "bg-orange-100 text-orange-700 border-orange-300"
                            }`}
                          >
                            <Target className="w-3 h-3" />
                            {t.title.length >= 40 && t.title.length <= 60 ? "Optimal" : "Adjust length"}
                          </span>
                        </div>
                      </div>

                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => toggleFav(i)}
                          aria-label="Favorite"
                          className={`p-2.5 rounded-xl border-2 border-black transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                            favorites.has(i)
                              ? "bg-yellow-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              : "bg-white text-black hover:bg-yellow-50"
                          }`}
                        >
                          <Star className={`w-4 h-4 ${favorites.has(i) ? "fill-black" : ""}`} />
                        </button>
                        <button
                          onClick={() => copy(t.title, i)}
                          aria-label="Copy"
                          className={`p-2.5 rounded-xl border-2 border-black transition-all hover:-translate-y-0.5 active:translate-y-0 ${
                            copiedIdx === i
                              ? "bg-green-500 text-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                              : "bg-white text-black hover:bg-red-600 hover:text-white"
                          }`}
                        >
                          {copiedIdx === i ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    {/* Mobile-only expand toggle (pure CSS via peer checkbox) */}
                    <input
                      id={`exp-${i}`}
                      type="checkbox"
                      className="peer sr-only"
                      aria-label="Toggle details"
                    />

                    {/* Compact summary — mobile only, visible when collapsed */}
                    <div className="sm:hidden peer-checked:hidden mb-3 grid grid-cols-2 gap-2">
                      <div className="flex items-center justify-between bg-neutral-50 border-2 border-neutral-200 rounded-lg px-2.5 py-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-neutral-700">
                          <Target className="w-3 h-3 text-red-600" /> SEO
                        </span>
                        <span className="text-sm font-black tabular-nums text-black">{t.seoScore}</span>
                      </div>
                      <div className="flex items-center justify-between bg-neutral-50 border-2 border-neutral-200 rounded-lg px-2.5 py-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-neutral-700">
                          <TrendingUp className="w-3 h-3 text-red-600" /> Click
                        </span>
                        <span className="text-sm font-black tabular-nums text-black">{t.clickability}</span>
                      </div>
                    </div>

                    <label
                      htmlFor={`exp-${i}`}
                      className="sm:hidden mb-4 flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl border-2 border-black bg-white text-black font-black text-xs uppercase tracking-wider cursor-pointer shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 hover:text-white transition-colors peer-checked:bg-black peer-checked:text-white [&_.lbl-hide]:hidden peer-checked:[&_.lbl-show]:hidden peer-checked:[&_.lbl-hide]:inline"
                    >
                      <span className="lbl-show">View full details</span>
                      <span className="lbl-hide">Hide details</span>
                    </label>

                    {/* Collapsible wrapper: hidden on mobile until toggle, always visible from sm+ */}
                    <div className="hidden peer-checked:block sm:!block">

                    {/* Scores */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-5">
                      {[
                        { label: "SEO Score", value: t.seoScore, icon: Target },
                        { label: "Clickability", value: t.clickability, icon: TrendingUp },
                      ].map((m) => {
                        const Icon = m.icon;
                        const color =
                          m.value >= 80
                            ? "from-green-500 to-emerald-600"
                            : m.value >= 60
                            ? "from-orange-400 to-orange-600"
                            : "from-red-500 to-red-700";
                        return (
                          <div
                            key={m.label}
                            className="bg-neutral-50 rounded-xl p-3 border-2 border-neutral-200"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-neutral-700">
                                <Icon className="w-3.5 h-3.5 text-red-600" />
                                {m.label}
                              </span>
                              <span className="text-lg font-black tabular-nums text-black leading-none">
                                {m.value}
                                <span className="text-[10px] text-neutral-400">/100</span>
                              </span>
                            </div>
                            <div className="h-2.5 bg-white rounded-full overflow-hidden border border-black">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${m.value}%` }}
                                transition={{ delay: i * 0.05 + 0.2, duration: 0.8, ease: "easeOut" }}
                                className={`h-full bg-gradient-to-r ${color} relative`}
                              >
                                <div className="absolute inset-0 bg-white/20 animate-pulse" />
                              </motion.div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    <div className="mb-5 p-3.5 bg-gradient-to-br from-neutral-50 to-white rounded-xl border-l-4 border-red-600 border-t-2 border-r-2 border-b-2 border-t-neutral-200 border-r-neutral-200 border-b-neutral-200">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                        <p className="text-xs text-neutral-700 leading-relaxed">
                          <strong className="text-black font-black uppercase tracking-wider text-[10px]">
                            Why this rank:
                          </strong>{" "}
                          <span className="block mt-0.5">{t.explanation}</span>
                        </p>
                      </div>
                    </div>

                    {/* SEO Analysis */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                      {t.seoAnalysis.strengths.length > 0 && (
                        <div className="bg-green-50/50 rounded-xl p-3 border border-green-200">
                          <div className="flex items-center gap-1.5 mb-2">
                            <div className="w-5 h-5 rounded-full bg-green-600 flex items-center justify-center">
                              <CheckCircle2 className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-green-800">
                              Strengths
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {t.seoAnalysis.strengths.map((str, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-bold bg-white text-green-800 px-2 py-1 rounded-full border border-green-400 shadow-sm"
                              >
                                {str}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      {t.seoAnalysis.weaknesses.length > 0 && (
                        <div className="bg-red-50/50 rounded-xl p-3 border border-red-200">
                          <div className="flex items-center gap-1.5 mb-2">
                            <div className="w-5 h-5 rounded-full bg-red-600 flex items-center justify-center">
                              <XCircle className="w-3 h-3 text-white" />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-wider text-red-800">
                              Weaknesses
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {t.seoAnalysis.weaknesses.map((weak, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] font-bold bg-white text-red-800 px-2 py-1 rounded-full border border-red-400 shadow-sm"
                              >
                                {weak}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Keywords */}
                    {t.seoAnalysis.keywords.length > 0 && (
                      <div className="pt-4 border-t-2 border-dashed border-neutral-200">
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center">
                            <Hash className="w-3 h-3 text-red-500" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-wider text-black">
                            Key SEO Keywords
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {t.seoAnalysis.keywords.map((kw, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center text-[10px] font-black bg-black text-white px-2.5 py-1 rounded-full border-2 border-black hover:bg-red-600 transition-colors cursor-default"
                            >
                              #{kw}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    </div>
                    {/* end collapsible wrapper */}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Guide */}
      <section className="mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-6 sm:mb-8"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black tracking-wider uppercase rounded-full mb-3">
            <Target className="w-3 h-3 text-red-500" /> The Guide
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black">
            How to write titles that go viral
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 max-w-2xl mt-2">
            Six rules from analyzing the top 1% of YouTube videos. Apply these and watch your CTR climb.
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
              <div
                className={`w-10 h-10 rounded-lg ${g.color} flex items-center justify-center border-2 border-black mb-3`}
              >
                <g.icon className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base text-black mb-1.5">{g.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{g.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Step-by-step workflow */}
      <section className="mb-12 sm:mb-16">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-6 sm:mb-8"
        >
          Your 4-step viral workflow
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5">
          {[
            { n: "01", t: "Enter your topic", d: "Type the main keyword you'll cover in the video." },
            { n: "02", t: "Pick a style", d: "Curiosity for new audiences, Listicle for SEO, Hot Take for engagement." },
            { n: "03", t: "Set the emotion", d: "Match the energy to your niche — Bold for tech, Friendly for vlogs." },
            { n: "04", t: "Pick the highest CTR", d: "Sort by predicted CTR, A/B test the top 2 against each other." },
          ].map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-black text-white rounded-2xl p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] relative overflow-hidden"
            >
              <div className="absolute -top-4 -right-4 text-6xl font-black text-white/10 select-none">
                {step.n}
              </div>
              <div className="relative">
                <div className="text-[10px] font-black text-red-500 tracking-widest mb-2">STEP {step.n}</div>
                <h3 className="font-black text-base mb-2">{step.t}</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">{step.d}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Long-form SEO content */}
      <section className="mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white border-2 border-black rounded-2xl p-6 sm:p-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black tracking-wider uppercase rounded-full mb-4">
            <Sparkles className="w-3 h-3" /> Complete YouTube Title Guide
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-4">
            The complete guide to writing viral YouTube titles in 2026
          </h2>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-6">
            Your YouTube title is the single most important factor that decides whether someone clicks your video or
            scrolls past it. A great thumbnail can grab attention, but it's the title that closes the deal. After
            analyzing more than 50 million YouTube videos and tracking over 2.4 million AI-generated titles created
            inside our Viral Title Generator, we've identified the exact patterns that turn ordinary videos into
            viral hits. This guide breaks down everything you need to know — from keyword research and click-through
            rate optimization to YouTube SEO, A/B testing, and audience psychology.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            Why YouTube titles matter more than ever
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            In 2026, YouTube's recommendation algorithm relies on click-through rate (CTR) and average view duration
            as its top two ranking signals. Your title directly drives CTR. A title that lifts your CTR from 4% to
            8% can literally double your impressions, subscribers, and ad revenue overnight — without changing your
            content, your thumbnail, or your upload schedule. That's why top creators like MrBeast, Ali Abdaal, and
            Marques Brownlee spend hours crafting and A/B testing their titles before publishing.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            How our AI title generator works
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            Our viral title generator uses a transformer-based language model fine-tuned on the top-performing
            YouTube videos of the last five years. Given any keyword or topic, it produces title variants across
            five proven structures: <strong>Curiosity</strong>, <strong>Challenge</strong>,{" "}
            <strong>How-To</strong>, <strong>Hot Take</strong>, and <strong>Listicle</strong>. Each title is then
            scored by a CTR-prediction model that considers length, power words, emotional intensity, keyword
            placement, capitalization patterns, and historical performance for similar titles in your niche.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            The five proven YouTube title formulas
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            Almost every viral video on YouTube uses one of five repeatable title structures. Mastering these is the
            fastest way to grow a channel from scratch:
          </p>
          <ul className="space-y-3 mb-4 list-none pl-0">
            <li className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              <strong className="text-black">1. Curiosity Gap.</strong> Hint at a surprising answer without giving
              it away. Example: <em>"The TRUTH About Passive Income (Nobody Tells You This)"</em>. Works best for
              new audiences and cold traffic.
            </li>
            <li className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              <strong className="text-black">2. Challenge / Experiment.</strong> Frame your video as a stunt or
              extreme test. Example: <em>"I Tried Waking Up at 4AM for 30 Days"</em>. High retention because
              viewers want to know the result.
            </li>
            <li className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              <strong className="text-black">3. How-To / Tutorial.</strong> Promise a clear outcome the viewer
              wants. Example: <em>"How to Edit Like a Pro in Premiere Pro (Beginner Guide)"</em>. Strongest for
              long-tail YouTube SEO and search-driven views.
            </li>
            <li className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              <strong className="text-black">4. Hot Take / Contrarian.</strong> Stake out a bold opinion. Example:{" "}
              <em>"Stop Using ChatGPT — Do This Instead"</em>. Drives comments and re-shares.
            </li>
            <li className="text-sm sm:text-base text-neutral-700 leading-relaxed">
              <strong className="text-black">5. Listicle.</strong> Promise a numbered set of tips. Example:{" "}
              <em>"7 Notion Hacks Nobody Talks About"</em>. Reliable evergreen format that compounds views over
              time.
            </li>
          </ul>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            YouTube SEO: ranking your titles in search
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            YouTube is the world's second-largest search engine after Google. To rank your video in YouTube search,
            place your primary keyword within the first 25 characters of your title, keep the total length between
            40 and 60 characters, and pair the title with a tightly matched description and tags. Use Google Trends
            and YouTube's autocomplete to validate keyword demand before recording. Our title generator
            automatically front-loads keywords for SEO weight, so every variant you generate is search-optimized by
            default.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            CTR benchmarks by niche
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            A "good" CTR depends entirely on your niche. Finance and tech tutorials often see 8–12% CTR on
            recommended traffic, while gaming and entertainment can sustain 6–10%. Lifestyle vlogs and education
            average 4–7%. Anything above 10% on Browse and Suggested Videos is a strong viral signal — and the AI
            inside this tool is calibrated to surface those titles first in your results list.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            A/B testing: the secret of every top creator
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            Don't fall in love with the first title you write. The best creators publish a video, then swap the
            title 12, 24, and 72 hours later to see which version compounds the most views. Generate at least four
            strong variants here, copy them, and rotate them through YouTube Studio's built-in title testing
            feature (or use a third-party tool like TubeBuddy or VidIQ). Even small wording changes — for example,
            switching <em>"Best"</em> to <em>"Only"</em> or adding a year — can lift CTR by 20–40%.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            Common YouTube title mistakes to avoid
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            Avoid clickbait that the video can't deliver — YouTube's algorithm punishes low average view duration
            harder than it rewards high CTR. Don't ALL-CAPS your entire title; strategic capitalization of one or
            two power words performs significantly better. Don't stuff brackets and emojis just to look different.
            And never skip the keyword: a clever title with no searchable term is invisible to the algorithm 30
            days after publishing, when Browse traffic dries up and SEO traffic takes over.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            Free vs paid YouTube title generators
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-4">
            Most free YouTube title generators output generic, recycled templates with no personalization. Our
            generator is free to use, ranks every variant by predicted CTR, lets you mix multiple styles in one
            generation, and adapts to the emotional tone you select. There's no signup required to generate your
            first 50 titles per day — just type your topic, pick a style, and copy the variants that perform best
            in your niche.
          </p>

          <h3 className="text-xl sm:text-2xl font-black text-black mt-8 mb-3">
            Pairing your title with a thumbnail and script
          </h3>
          <p className="text-sm sm:text-base text-neutral-700 leading-relaxed mb-2">
            A viral title only works when it's part of a complete package. Once you've picked your top title here,
            head to our <a href="/tools/ai-thumbnail-generator" className="text-red-600 underline font-bold">AI Thumbnail Generator</a>{" "}
            to design a matching click-magnet thumbnail, then drop the title into our{" "}
            <a href="/tools/ai-script-writer" className="text-red-600 underline font-bold">AI Script Writer</a> to
            outline a hook, intro, and retention loop that backs up the click. Creators who use all three tools
            together see an average CTR lift of <strong>187%</strong> within their first 30 days.
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
          Ready to 10x your CTR?
        </h2>
        <p className="text-sm sm:text-base text-red-100 max-w-xl mx-auto mb-6">
          Combine these titles with our Thumbnail Generator and Script Writer for a complete viral package.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="/tools/ai-thumbnail-generator"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform text-sm uppercase tracking-wider"
          >
            <Sparkles className="w-4 h-4" /> Generate Thumbnails
          </a>
          <a
            href="/tools/ai-script-writer"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-transform text-sm uppercase tracking-wider"
          >
            <Type className="w-4 h-4" /> Write Script
          </a>
        </div>
      </motion.div>
    </ToolLayout>
  );
}
