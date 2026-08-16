"use client";

import { copyToClipboard } from "@/lib/clipboard";
import { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Tag as TagIcon,
  Loader2,
  Sparkles,
  Copy,
  Check,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Hash,
} from "lucide-react";
import { ToolLayout, ToolCard, PrimaryButton } from "@/components/tools/ToolLayout";
import { ToolTurnstile } from "@/components/tools/ToolTurnstile";
import { useTurnstileHeader } from "@/lib/turnstile/useTurnstileHeader";
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import { streamJson } from "@/lib/streamJson";
import { extractStringArray } from "@/lib/parseStream";
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

const TAG_LIMIT = 500; // YouTube's character cap for the tags field

type TagData = {
  topic: string;
  tags: string[];
};

// Local fallback — generates ~60 varied tags when the backend is unreachable
function localGenerate(topic: string): TagData {
  const clean = topic.trim().toLowerCase().replace(/[^a-z0-9 ]/g, "");
  const words = clean.split(/\s+/).filter(Boolean);
  const phrase = words.join(" ");
  const w0 = words[0] || phrase;

  const tags = [
    // Exact + year variants
    phrase, `${phrase} 2026`, `${phrase} 2025`,
    // Action prefixes
    `best ${phrase}`, `top ${phrase}`, `how to ${phrase}`,
    `${phrase} tutorial`, `${phrase} guide`, `${phrase} review`,
    `${phrase} tips`, `${phrase} tricks`, `${phrase} hacks`,
    // Audience modifiers
    `${phrase} for beginners`, `${phrase} for advanced`, `${phrase} for professionals`,
    `${phrase} for students`, `${phrase} for everyone`,
    // Structure
    `${phrase} step by step`, `${phrase} complete guide`,
    `${phrase} full tutorial`, `${phrase} crash course`,
    `${phrase} masterclass`, `${phrase} deep dive`,
    // Analysis
    `${phrase} explained`, `${phrase} explained simply`,
    `${phrase} pros and cons`, `${phrase} comparison`,
    `${phrase} vs alternatives`, `is ${phrase} worth it`,
    `${phrase} mistakes to avoid`, `${phrase} common mistakes`,
    // Questions
    `what is ${phrase}`, `why ${phrase}`, `when to use ${phrase}`,
    `where to learn ${phrase}`, `how does ${phrase} work`,
    // Discovery
    `${phrase} for youtube`, `${phrase} youtube channel`,
    `${phrase} content ideas`, `${phrase} video ideas`,
    `${phrase} youtube tips`,
    // Trending formats
    `${phrase} in 2026`, `${phrase} update`, `${phrase} news`,
    `${phrase} latest`, `${phrase} new`, `${phrase} future`,
    // Superlatives
    `best ${phrase} 2026`, `top 10 ${phrase}`, `top 5 ${phrase}`,
    `ultimate ${phrase}`, `complete ${phrase}`,
    // Combinations
    `${phrase} strategy`, `${phrase} method`, `${phrase} approach`,
    `${phrase} framework`, `${phrase} system`, `${phrase} process`,
    `${phrase} workflow`, `${phrase} checklist`, `${phrase} plan`,
    `${phrase} roadmap`, `${phrase} blueprint`,
    // Results-focused
    `${phrase} results`, `${phrase} success`, `${phrase} growth`,
    `${phrase} improve`, `${phrase} optimize`, `${phrase} boost`,
    `${phrase} increase`, `${phrase} advanced ${phrase}`,
    // Single word variants
    ...words,
    ...words.map(w => `${w} tips`),
    ...words.map(w => `${w} guide`),
    ...words.map(w => `best ${w}`),
    // Long-tail
    `learn ${phrase} fast`, `${phrase} for free`,
    `${phrase} without experience`, `${phrase} from scratch`,
    `${phrase} the right way`, `${phrase} that actually works`,
    `${phrase} beginners guide 2026`, `${phrase} expert tips`,
    // Niche SEO
    `${w0} tutorial for beginners`, `${w0} explained 2026`,
    `${w0} step by step guide`, `${w0} complete course`,
    `${w0} tips and tricks`, `${w0} best practices`,
    `${w0} do it yourself`, `${w0} quick start`,
  ].filter(Boolean);

  return {
    topic,
    tags: [...new Set(tags)].slice(0, 60),
  };
}

export default function TagGeneratorPage() {
  const { t } = useTranslations();
  const tc = t("toolPages.tagGenerator") as any;
  const ts = useTurnstileHeader();

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TagData | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = async (val?: string) => {
    if (!ts.ready) return; // security check must be solved first (Enter/chip paths bypass the disabled button)
    const v = (val ?? topic).trim();
    if (!v || loading) return;
    if (val !== undefined) setTopic(val);
    setLoading(true);
    setError(null);
    setData({ topic: v, tags: [] });
    setCopiedAll(false);
    setCopiedIdx(null);

    abortRef.current = streamJson<TagData>(
      `${BASE_URL}/api/generate-tags/stream`,
      { topic: v },
      {
        onDelta: (full) => {
          const tags = extractStringArray(full, "tags");
          if (tags.length) {
            setData({ topic: v, tags });
          }
        },
        onDone: (result, _raw, err) => {
          if (result && Array.isArray(result.tags) && result.tags.length) {
            setData(result);
          } else if (err) {
            setError(err);
            setData(localGenerate(v));
          } else {
            setData((prev) =>
              prev && prev.tags.length ? prev : localGenerate(v)
            );
          }
          setLoading(false);
        },
        onError: (message) => {
          console.warn("[TagGenerator] stream error, using local fallback:", message);
          setData((prev) =>
            prev && prev.tags.length ? prev : localGenerate(v)
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
    () => (data?.tags || []).join(", "),
    [data]
  );

  const charCount = allTagsString.length;
  const overLimit = charCount > TAG_LIMIT;

  const copyAll = () => {
    if (!allTagsString) return;
    navigator.clipboard?.writeText(allTagsString);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1600);
  };

  const copyOne = (tag: string, idx: number) => {
    navigator.clipboard?.writeText(tag);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1200);
  };

  const guideIcons = [CheckCircle2, CheckCircle2, CheckCircle2, XCircle, XCircle, AlertTriangle];
  const guideColors = ["text-green-600 bg-green-100", "text-green-600 bg-green-100", "text-green-600 bg-green-100", "text-red-600 bg-red-100", "text-red-600 bg-red-100", "text-yellow-600 bg-yellow-100"];

  return (
    <ToolLayout
      title={tc.title}
      description={tc.description}
      icon={TagIcon}
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
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TagIcon className="w-4 h-4" />}
            {loading ? tc.generatingBtn : tc.generateBtn}
          </PrimaryButton>
        </div>
        <ToolTurnstile actionLabel={tc.generateBtn as string} />
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500">{tc.tryLabel}</span>
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
        {loading && !(data && data.tags.length > 0) && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16"
          >
            <div className="bg-black border-2 border-black rounded-2xl p-8 sm:p-12 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] flex flex-col items-center justify-center gap-6 overflow-hidden relative">
              {/* Background grid */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:28px_28px]" />

              {/* Spinning ring + icon */}
              <div className="relative flex items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-20 h-20 rounded-full border-[3px] border-red-600/30 border-t-red-600"
                />
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute w-14 h-14 rounded-full border-[2px] border-white/10 border-b-white/40"
                />
                <motion.div
                  animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute w-10 h-10 rounded-xl bg-red-600 border-2 border-white/20 flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)]"
                >
                  <TagIcon className="w-5 h-5 text-white" />
                </motion.div>
              </div>

              {/* Animated text */}
              <div className="relative text-center space-y-2">
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
                  {tc.loadingSub}
                </motion.div>
              </div>

              {/* Bouncing dots */}
              <div className="flex items-center gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <motion.span
                    key={i}
                    className="w-2 h-2 rounded-full bg-red-600"
                    animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
                    transition={{ duration: 0.9, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {error && !loading && !(data && data.tags.length > 0) && (
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
                <div className="font-black text-base text-red-800">{tc.errorTitle}</div>
                <div className="text-sm text-red-700 mt-1">{error}</div>
              </div>
            </div>
          </motion.div>
        )}

        {data && data.tags.length > 0 && (
          <motion.div
            key={data.topic}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16 space-y-5"
          >
            {/* TOP STRIP — copy all + char counter */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                  {tc.generatedFor}
                </div>
                <div className="font-black text-base sm:text-lg truncate">{data.topic}</div>
              </div>
              <div
                className={`text-xs font-black px-3 py-1.5 rounded-full border-2 border-black ${overLimit ? "bg-red-600 text-white" : "bg-neutral-100 text-black"
                  }`}
              >
                {charCount}/{TAG_LIMIT} chars
              </div>
              <button
                onClick={copyAll}
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black rounded-xl border-2 border-black transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${copiedAll ? "bg-green-500 text-white" : "bg-black text-white hover:bg-red-600"
                  }`}
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedAll ? tc.copiedAll : tc.copyAll}
              </button>
            </div>

            {/* TAG GRID */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b-2 border-black bg-neutral-50 flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-red-600" />
                <div className="font-black text-sm">{tc.allTags} ({data.tags.length})</div>
                {loading && (
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-red-600">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    {tc.streaming}
                  </span>
                )}
              </div>
              <div className="p-4 sm:p-5 flex flex-wrap gap-2">
                {data.tags.map((t, idx) => {
                  const isNew = loading && idx === data.tags.length - 1;
                  return (
                    <motion.button
                      key={`${t}-${idx}`}
                      onClick={() => copyOne(t, idx)}
                      initial={{ opacity: 0, scale: 0.85, y: 6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      transition={{ duration: 0.22, ease: "easeOut" }}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-xs font-black transition hover:-translate-y-0.5 ${copiedIdx === idx
                          ? "bg-green-500 text-white border-black"
                          : isNew
                            ? "bg-red-600 text-white border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                            : "bg-white text-black border-black hover:bg-red-600 hover:text-white"
                        }`}
                    >
                      {copiedIdx === idx ? <Check className="w-3 h-3" /> : null}
                      {t}
                    </motion.button>
                  );
                })}
                {loading && (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border-2 border-dashed border-neutral-300 text-xs font-black text-neutral-400">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      {tc.more}
                    </motion.span>
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GuideGrid
        badge={tc.guideBadge}
        title={tc.guideTitle}
        intro={tc.guideIntro}
        cards={tc.guides.map((g: any, i: number) => ({ ...g, icon: guideIcons[i] || CheckCircle2, color: guideColors[i] || "text-green-600 bg-green-100" }))}
      />

      <Workflow
        title={tc.workflowTitle}
        steps={tc.workflows}
      />

      <SeoContent badge={tc.seoContent.badge} title={tc.seoContent.title}>
        <p>{tc.seoContent.p1}</p>
        <h3>{tc.seoContent.h3_1}</h3>
        <div dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_1 }} />
        <h3>{tc.seoContent.h3_2}</h3>
        <div dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_2 }} />
        <h3>{tc.seoContent.h3_3}</h3>
        <div dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_3 }} />
      </SeoContent>

      <FaqAccordion faqs={tc.faqs} />

      <CrossCTA
        title={tc.crossCta.title}
        desc={tc.crossCta.desc}
        primary={{ label: tc.crossCta.btn1, href: "/tools/hashtag-generator", icon: Hash }}
        secondary={{ label: tc.crossCta.btn2, href: "/tools/viral-title-generator", icon: TrendingUp }}
      />
      <ToolSeoJsonLd
        name={tc.title}
        description={tc.seoJsonDesc}
        slug="tag-generator"
        faqs={tc.faqs}
        breadcrumb={[
          { name: "Home", slug: "/" },
          { name: "Tools", slug: "/tools" },
          { name: tc.title, slug: "/tools/tag-generator" },
        ]}
      />
    </ToolLayout>
  );
}
