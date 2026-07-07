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

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://tubeai-backend.vercel.app";

const TAG_LIMIT = 500; // YouTube's character cap for the tags field

type TagData = {
  topic: string;
  tags: string[];
};

const stats = [
  { value: "60", label: "Tags Per Search" },
  { value: "500", label: "YouTube Char Limit" },
  { value: "<3s", label: "Generation Time" },
  { value: "Free", label: "Unlimited Forever" },
];

const guides = [
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Lead with your primary keyword", desc: "Your first 2-3 tags should match your title's main keyword phrase exactly." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Use the full 500 characters", desc: "YouTube gives you 500 characters for tags — fill them with relevant, varied terms." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Mix exact + broad match", desc: "Combine specific multi-word phrases with single broader terms for the widest reach." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't repeat the same word", desc: "Tag stuffing the same keyword 10 ways triggers spam penalties — vary your phrasing." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Skip misleading tags", desc: "Tagging unrelated trending topics violates YouTube policy and harms watch time signals." },
  { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100", title: "Tags are secondary signal", desc: "Title and thumbnail matter more — treat tags as supportive context, not your main SEO play." },
];

const faqs = [
  { q: "Are video tags still important in 2026?", a: "Yes, but as a supporting signal. YouTube uses tags to understand context and disambiguate similar topics. They're not the primary ranking factor (title and thumbnail are), but well-chosen tags noticeably improve recommended-traffic performance." },
  { q: "How many tags should I use?", a: "Use as many as fit in the 500-character limit — usually 25-40 tags. Quality over quantity: stop adding tags when they stop being relevant." },
  { q: "What's the difference between tags and hashtags?", a: "Tags are hidden metadata only the algorithm sees; hashtags appear publicly in your title or description with a # symbol. Use both for maximum reach. Try our Hashtag Generator for public hashtags." },
  { q: "Is this tool free?", a: "Yes — unlimited generations, no signup, forever free." },
];

const suggestions = ["AI tools 2026", "iPhone 17 review", "morning routine", "Tesla Model Y", "react tutorial"];

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
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TagData | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const run = async (val?: string) => {
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

  return (
    <ToolLayout
      title="YouTube Video Tag Generator"
      description="Generate 60 optimized video tags for your YouTube uploads — primary, secondary, and long-tail keywords ranked by search volume."
      icon={TagIcon}
      badge="Free Tool · SEO-Optimized Tags"
    >
      <StatsStrip stats={stats} />

      <ToolCard className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white">
            <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && run()}
              placeholder="Enter your video topic or main keyword..."
              className="flex-1 py-3 outline-none text-sm font-medium"
            />
          </div>
          <PrimaryButton onClick={() => run()} disabled={loading || !topic.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TagIcon className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate Tags"}
          </PrimaryButton>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <span className="text-[11px] font-black uppercase tracking-wider text-neutral-500">Try:</span>
          {suggestions.map((s) => (
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
                  Building your tag set…
                </motion.div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-xs text-neutral-400 font-bold"
                >
                  Analyzing search volume and competition
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
                <div className="font-black text-base text-red-800">Tag generation failed</div>
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
                  Generated for
                </div>
                <div className="font-black text-base sm:text-lg truncate">{data.topic}</div>
              </div>
              <div
                className={`text-xs font-black px-3 py-1.5 rounded-full border-2 border-black ${
                  overLimit ? "bg-red-600 text-white" : "bg-neutral-100 text-black"
                }`}
              >
                {charCount}/{TAG_LIMIT} chars
              </div>
              <button
                onClick={copyAll}
                className={`inline-flex items-center justify-center gap-1.5 px-4 py-2.5 text-xs font-black rounded-xl border-2 border-black transition shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  copiedAll ? "bg-green-500 text-white" : "bg-black text-white hover:bg-red-600"
                }`}
              >
                {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedAll ? "Copied all" : "Copy all"}
              </button>
            </div>

            {/* TAG GRID */}
            <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
              <div className="px-4 sm:px-5 py-3 border-b-2 border-black bg-neutral-50 flex items-center gap-2">
                <TagIcon className="w-4 h-4 text-red-600" />
                <div className="font-black text-sm">All video tags ({data.tags.length})</div>
                {loading && (
                  <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-red-600">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Streaming…
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
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 text-xs font-black transition hover:-translate-y-0.5 ${
                        copiedIdx === idx
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
                      more…
                    </motion.span>
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <GuideGrid
        badge="Tag Rules"
        title="How to write video tags that work"
        intro="Six rules for video-tag SEO — what to lead with, what to skip, and where tags actually matter."
        cards={guides}
      />

      <Workflow
        title="Your 4-step tagging workflow"
        steps={[
          { n: "01", t: "Enter your topic", d: "Use your main title keyword as the starting point." },
          { n: "02", t: "Generate the list", d: "Get 40+ tags split into primary, secondary, and long-tail." },
          { n: "03", t: "Trim to fit 500 chars", d: "Keep the strongest mix — exact match first, broad terms last." },
          { n: "04", t: "Paste into YouTube Studio", d: "Add them in the 'Tags' field under your video's details page." },
        ]}
      />

      <SeoContent badge="Video Tag Strategy" title="YouTube video tags in 2026: still worth it, if done right">
        <p>
          Video tags are hidden metadata — viewers never see them, but the algorithm uses them to understand what your video is about and
          which similar videos to recommend alongside it. They're not the SEO silver bullet they were in 2015, but they're a meaningful
          secondary signal — especially for ambiguous topics.
        </p>
        <h3>Lead with your exact title keyword</h3>
        <p>
          YouTube weights the first 2-3 tags more heavily. They should mirror the main keyword phrase from your title <em>exactly</em>.
          After that, branch out into related variations.
        </p>
        <h3>The 500-character limit is your budget</h3>
        <p>
          You get 500 characters total (including commas). That's roughly 25-40 tags. Don't waste characters on filler — every tag should
          be a phrase a real person might search.
        </p>
        <h3>Tags vs hashtags — use both</h3>
        <p>
          Hashtags are public and appear in your title/description. Video tags are hidden. They serve different purposes and don't overlap.
          Generate hashtags with our <a href="/tools/hashtag-generator">Hashtag Generator</a> and tags here.
        </p>
      </SeoContent>

      <FaqAccordion faqs={faqs} />

      <CrossCTA
        title="Now generate public hashtags too"
        desc="Video tags are hidden metadata. Hashtags appear in your title and description. You need both."
        primary={{ label: "Generate Hashtags", href: "/tools/hashtag-generator", icon: Hash }}
        secondary={{ label: "Write Viral Titles", href: "/tools/viral-title-generator", icon: TrendingUp }}
      />
          <ToolSeoJsonLd
        name="YouTube Tag Generator"
        description={"Generate SEO-optimized YouTube tags from any topic — exact, broad, and long-tail, within the 500-char limit."}
        slug="tag-generator"
        faqs={faqs}
        breadcrumb={[
          { name: "Home", slug: "/" },
          { name: "Tools", slug: "/tools" },
          { name: "YouTube Tag Generator", slug: "/tools/tag-generator" },
        ]}
      />
</ToolLayout>
  );
}
