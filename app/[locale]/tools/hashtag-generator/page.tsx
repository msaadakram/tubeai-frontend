"use client";

import { copyToClipboard } from "@/lib/clipboard";
import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Hash,
  Loader2,
  Sparkles,
  Copy,
  Check,
  Search,
  TrendingUp,
  Target,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import { ToolLayout, ToolCard, PrimaryButton } from "@/components/tools/ToolLayout";
import { ToolTurnstile } from "@/components/tools/ToolTurnstile";
import { useTurnstileHeader } from "@/lib/turnstile/useTurnstileHeader";
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import { streamJson } from "@/lib/streamJson";
import { extractObjectArray, extractStringArray, extractStringField, type HashtagItem } from "@/lib/parseStream";
import {
  StatsStrip,
  GuideGrid,
  Workflow,
  SeoContent,
  FaqAccordion,
  CrossCTA,
} from "@/components/tools/ToolSections";
import { useTranslations } from "@/lib/i18n/useTranslations";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://api.ytforge.app";

type Hashtag = {
  tag: string;
  category?: string;
  searchVolume?: string;
  competition?: string;
  relevanceScore?: number;
  reason?: string;
};

type HashtagData = {
  topic: string;
  recommended: Hashtag[];
  trending?: string[];
  niche?: string[];
  broad?: string[];
  strategy?: string;
};

const guidesColorsAndIcons = [
  { icon: CheckCircle2, color: "text-green-600 bg-green-100" },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100" },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100" },
  { icon: XCircle, color: "text-red-600 bg-red-100" },
  { icon: XCircle, color: "text-red-600 bg-red-100" },
  { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100" },
];

function popBadge(level?: string) {
  switch (level) {
    case "high":
      return "bg-green-100 text-green-700 border-green-400";
    case "medium":
      return "bg-orange-100 text-orange-700 border-orange-400";
    case "low":
      return "bg-neutral-100 text-neutral-700 border-neutral-300";
    default:
      return "bg-neutral-100 text-neutral-700 border-neutral-300";
  }
}

// Fallback local generator (used when backend isn't reachable yet)
function localGenerate(topic: string): HashtagData {
  const clean = topic.trim().toLowerCase().replace(/[^a-z0-9 ]/g, "");
  const words = clean.split(/\s+/).filter(Boolean);
  const camel = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
  const base = words.join("");
  const w0 = words[0] || base;

  const broad = ["youtube", "viral", "trending", "shorts", "youtuber", "fyp", "subscribe", "newvideo"];
  const trending = ["2026", "2025", "mustwatch", "tutorial", "explained", "guide", "update", "latest", "new"];
  const niche = [
    base,
    camel,
    ...words,
    ...words.map((w) => w + "tips"),
    ...words.map((w) => w + "guide"),
    ...words.map((w) => w + "hacks"),
    ...words.map((w) => w + "tutorial"),
    ...words.map((w) => w + "review"),
    ...words.map((w) => w + "2026"),
    `${base}tutorial`,
    `${base}guide`,
    `${base}tips`,
    `${base}review`,
    `${base}forbeginners`,
    `${base}stepbystep`,
    `${base}explained`,
    `${base}2026`,
    `${base}channel`,
    `${base}video`,
    `${base}content`,
    `best${base}`,
    `top${base}`,
    `howto${base}`,
    `${base}foradvanced`,
    `${base}mistakes`,
    `${base}strategy`,
    `${base}ideas`,
    `learn${base}`,
    `${base}fromscratch`,
    `${base}thatworks`,
    `${w0}community`,
    `${w0}creator`,
    `${w0}daily`,
    `${w0}weekly`,
    `${w0}masterclass`,
    `${w0}crashcourse`,
    `${w0}deepdive`,
    `${w0}proscons`,
    `${w0}vsalternatives`,
  ].filter(Boolean);

  const ordered = [...new Set([camel, base, ...niche, ...trending, ...broad])].filter(Boolean);

  const recommended: Hashtag[] = ordered.slice(0, 60).map((tag, i) => ({
    tag: tag.replace(/[^a-zA-Z0-9]/g, ""),
    category: i < 8 ? "broad" : i < 40 ? "trending" : i < 75 ? "niche" : "branded",
    searchVolume: i < 8 ? "high" : i < 40 ? "medium" : "low",
    competition: i < 8 ? "high" : i < 40 ? "medium" : "low",
    relevanceScore: Math.max(55, 99 - Math.floor(i * 0.45)),
    reason: i < 8 ? "Broad-reach tag for maximum discoverability." : "Niche tag that keeps your video relevant to the right audience.",
  }));

  return {
    topic,
    recommended,
    trending: [...new Set(trending)].slice(0, 15),
    niche: [...new Set(niche)].map((t) => t.replace(/[^a-zA-Z0-9]/g, "")).slice(0, 15),
    broad: [...new Set(broad)].slice(0, 15),
    strategy:
      "Lead with your 3 broad tags for reach, layer in niche tags for relevance, and refresh trending tags every few weeks. Place your strongest 3 in the title and the rest in the description.",
  };
}

export default function HashtagGeneratorPage() {
  const { t } = useTranslations();
  const tc = t("toolPages.hashtagGenerator") as NonNullable<ReturnType<typeof t<"toolPages.hashtagGenerator">>>;
  const ts = useTurnstileHeader();
  const guides = tc.guides.map((g: { title: string; desc: string }, i: number) => ({
    ...g,
    icon: guidesColorsAndIcons[i % guidesColorsAndIcons.length].icon,
    color: guidesColorsAndIcons[i % guidesColorsAndIcons.length].color,
  }));

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<HashtagData | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = async (val?: string) => {
    const v = (val ?? topic).trim();
    if (!v || loading) return;
    if (val !== undefined) setTopic(val);
    setLoading(true);
    setError(null);
    setData({ topic: v, recommended: [] });
    setCopiedAll(false);
    setCopiedIdx(null);

    abortRef.current = streamJson<HashtagData>(
      `${BASE_URL}/api/generate-hashtags/stream`,
      { topic: v },
      {
        onDelta: (full) => {
          const recommended = extractObjectArray<HashtagItem>(full, "recommended");
          if (recommended.length) {
            setData((prev) => ({
              topic: v,
              recommended,
              trending: prev?.trending,
              niche: prev?.niche,
              broad: prev?.broad,
              strategy: prev?.strategy,
            }));
          }
        },
        onDone: (result, raw, err) => {
          if (result && Array.isArray(result.recommended) && result.recommended.length) {
            setData(result);
          } else {
            // Try to recover whatever we parsed from the partial stream first.
            const partial = extractObjectArray<HashtagItem>(raw, "recommended");
            if (partial.length) {
              setData({
                topic: v,
                recommended: partial,
                trending: extractStringArray(raw, "trending").slice(0, 15),
                niche: extractStringArray(raw, "niche").slice(0, 15),
                broad: extractStringArray(raw, "broad").slice(0, 15),
                strategy: extractStringField(raw, "strategy") || undefined,
              });
            } else if (err) {
              setError(err);
              setData(localGenerate(v));
            } else {
              setData(localGenerate(v));
            }
          }
          setLoading(false);
        },
        onError: (message) => {
          console.warn("[HashtagGenerator] stream error, using local fallback:", message);
          setData((prev) =>
            prev && prev.recommended.length ? prev : localGenerate(v)
          );
          setLoading(false);
        },
      }
    );
  };

  const cancel = () => {
    abortRef.current?.abort();
    abortRef.current = null;
    setLoading(false);
  };

  const allTagsString = useMemo(
    () => (data?.recommended || []).map((h) => `#${h.tag}`).join(" "),
    [data]
  );

  const copyAll = () => {
    if (!allTagsString) return;
    copyToClipboard(allTagsString);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1600);
  };

  const copyOne = (tag: string, idx: number) => {
    copyToClipboard(`#${tag}`);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1200);
  };

  return (
    <ToolLayout
      title={tc.title}
      description={tc.description}
      icon={Hash}
      badge={tc.badge}
    >
      <StatsStrip stats={tc.stats} />

      <ToolCard className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white">
            <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder={tc.inputPlaceholder}
              className="flex-1 py-3 outline-none text-sm font-medium"
            />
          </div>
          <PrimaryButton onClick={() => run()} disabled={loading || !topic.trim() || !ts.ready}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Hash className="w-4 h-4" />}
            {loading ? tc.btnGenerating : tc.btnGenerate}
          </PrimaryButton>
        </div>
        <ToolTurnstile actionLabel={tc.btnGenerate as string} />
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500">{tc.tryPrefix}</span>
          {tc.suggestions.map((s: string) => (
            <button
              key={s}
              onClick={() => run(s)}
              className="px-2.5 py-1 text-xs font-bold rounded-full border-2 border-black bg-white hover:bg-red-50 hover:-translate-y-0.5 transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      </ToolCard>

      <AnimatePresence mode="wait">
        {loading && !(data && data.recommended.length > 0) && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16"
          >
            <div className="relative bg-black border-2 border-black rounded-2xl p-8 sm:p-12 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] flex flex-col items-center justify-center gap-6 overflow-hidden">
              {/* Subtle grid backdrop */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

              {/* Pulsing glow behind icon */}
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.15, 0.35, 0.15] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute w-24 h-24 rounded-full bg-red-600 blur-2xl pointer-events-none"
              />

              {/* Spinner stack */}
              <div className="relative flex items-center justify-center">
                {/* Outer ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 rounded-full border-[3px] border-red-600/25 border-t-red-600"
                />
                {/* Inner counter-ring */}
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
                  className="absolute w-13 h-13 rounded-full border-[2px] border-white/8 border-b-white/35"
                  style={{ width: 52, height: 52 }}
                />
                {/* Center icon */}
                <motion.div
                  animate={{ scale: [1, 1.18, 1], opacity: [0.85, 1, 0.85] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-10 h-10 rounded-xl bg-red-600 border-2 border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.7)]"
                >
                  <Hash className="w-5 h-5 text-white" />
                </motion.div>
              </div>

              {/* Animated label */}
              <div className="relative text-center space-y-1.5">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="font-black text-base sm:text-lg text-white"
                >
                  {tc.loadingTitle}
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs text-neutral-400 font-bold"
                >
                  {tc.loadingDesc}
                </motion.div>
              </div>

              {/* Wave dots */}
              <div className="flex items-center gap-2">
                {[0, 1, 2, 3, 4].map((i) => (
                  <motion.span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-red-600"
                    animate={{ y: [0, -9, 0], opacity: [0.35, 1, 0.35] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.12 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {error && !loading && !(data && data.recommended.length > 0) && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16 bg-red-50 border-2 border-red-500 rounded-2xl p-6"
          >
            <div className="flex items-start gap-3">
              <XCircle className="w-6 h-6 text-red-600 shrink-0" />
              <div>
                <div className="font-black text-base text-red-800">{tc.errorPrefix}</div>
                <div className="text-sm text-red-700 mt-1">{error}</div>
              </div>
            </div>
          </motion.div>
        )}

        {data && data.recommended.length > 0 && (
          <motion.div
            key={data.topic}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16 space-y-5"
          >
            {/* TOP STRIP — copy all */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                  {tc.generatedFor}
                </div>
                <div className="font-black text-base sm:text-lg truncate">{data.topic}</div>
              </div>
              <div className="text-xs font-bold text-neutral-600">
                {data.recommended.length} {tc.hashtagsSuffix}
              </div>
              <button
                onClick={copyAll}
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black rounded-xl border-2 border-black transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${copiedAll ? "bg-green-500 text-white" : "bg-black text-white hover:bg-red-600"
                  }`}
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedAll ? tc.btnCopiedAll : tc.btnCopyAll}
              </button>
            </div>

            {/* HASHTAG GRID */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b-2 border-black bg-neutral-50 flex items-center gap-2">
                <Hash className="w-4 h-4 text-red-600" />
                <div className="font-black text-sm">{tc.sectionAllTitle}</div>
                {loading && (
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-red-600">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {tc.loadingStreaming}
                  </span>
                )}
              </div>
              <div className="p-3 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                {data.recommended.map((h, idx) => {
                  const copied = copiedIdx === idx;
                  const isNew = loading && idx === data.recommended.length - 1;
                  return (
                    <motion.button
                      key={`${h.tag}-${idx}`}
                      onClick={() => copyOne(h.tag, idx)}
                      title={h.reason}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.24, ease: "easeOut" }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`group relative flex items-center gap-2.5 px-3 sm:px-4 py-2.5 rounded-xl border-2 text-left transition-all overflow-hidden ${copied
                        ? "bg-green-500 border-green-600 shadow-[3px_3px_0px_0px_rgba(22,163,74,1)]"
                        : isNew
                          ? "bg-red-50 border-red-600 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]"
                          : "bg-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] hover:border-red-600"
                        }`}
                    >
                      {/* Icon */}
                      <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center border-2 border-black text-sm font-black transition-colors ${copied ? "bg-white text-green-600 border-green-600" : "bg-black text-white group-hover:bg-red-600"
                        }`}>
                        {copied ? <Check className="w-3.5 h-3.5" /> : "#"}
                      </span>

                      {/* Tag name */}
                      <span className={`flex-1 font-black text-xs sm:text-sm truncate transition-colors ${copied ? "text-white" : "text-black group-hover:text-red-600"
                        }`}>
                        {h.tag}
                      </span>

                      {/* Badges */}
                      <div className="flex items-center gap-1 shrink-0">
                        {typeof h.relevanceScore === "number" && (
                          <span className={`px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${copied ? "bg-white/20 border-white/30 text-white" : "bg-red-50 border-red-300 text-red-700"
                            }`}>
                            {h.relevanceScore}%
                          </span>
                        )}
                        {h.searchVolume && (
                          <span className={`hidden sm:inline-flex px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider border ${copied ? "bg-white/20 border-white/30 text-white" : popBadge(h.searchVolume)
                            }`}>
                            {h.searchVolume}
                          </span>
                        )}
                      </div>
                    </motion.button>
                  );
                })}
                {loading && (
                  <span className="col-span-1 sm:col-span-2 inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl border-2 border-dashed border-neutral-300 text-xs font-black text-neutral-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {tc.loadingMore}
                    </motion.span>
                  </span>
                )}
              </div>
            </div>

            {/* STRATEGY CALLOUT */}
            {!loading && data.strategy && (
              <div className="bg-black text-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-red-500" />
                  <div className="font-black text-sm uppercase tracking-wider">{tc.strategyTitle}</div>
                </div>
                <p className="text-sm text-neutral-200 leading-relaxed">{data.strategy}</p>
              </div>
            )}

            {/* CATEGORY BREAKDOWN */}
            {!loading && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { title: tc.groupTrending, icon: TrendingUp, color: "text-red-600", items: data.trending },
                  { title: tc.groupNiche, icon: Target, color: "text-orange-600", items: data.niche },
                  { title: tc.groupBroad, icon: Hash, color: "text-neutral-700", items: data.broad },
                ].map(
                  (group) =>
                    group.items &&
                    group.items.length > 0 && (
                      <div
                        key={group.title}
                        className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4"
                      >
                        <div className="flex items-center gap-2 mb-3">
                          <group.icon className={`w-4 h-4 ${group.color}`} />
                          <div className="font-black text-sm">{group.title}</div>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {group.items.map((t, i) => (
                            <span
                              key={`${t}-${i}`}
                              className="inline-flex items-center text-[11px] font-black bg-neutral-100 text-black px-2 py-1 rounded-full border border-neutral-300"
                            >
                              #{t.replace(/[^a-zA-Z0-9]/g, "")}
                            </span>
                          ))}
                        </div>
                      </div>
                    )
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

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
      </SeoContent>

      <FaqAccordion faqs={tc.faqs} />

      <CrossCTA
        title={tc.crossCta.title}
        desc={tc.crossCta.desc}
        primary={{ label: tc.crossCta.btn1, href: "/tools/tag-generator", icon: Target }}
        secondary={{ label: tc.crossCta.btn2, href: "/tools/viral-title-generator", icon: TrendingUp }}
      />
      <ToolSeoJsonLd
        name={tc.title}
        description={tc.seoJsonDesc}
        slug="hashtag-generator"
        faqs={tc.faqs}
        breadcrumb={[
          { name: "Home", slug: "/" },
          { name: "Tools", slug: "/tools" },
          { name: tc.title, slug: "/tools/hashtag-generator" },
        ]}
      />
    </ToolLayout>
  );
}
