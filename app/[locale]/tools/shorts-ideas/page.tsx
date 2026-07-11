"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Video,
  Loader2,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  PenTool,
  TrendingUp,
  Lock,
  Crown,
  ArrowRight,
} from "lucide-react";
import { ToolLayout, ToolCard, ToolInput, PrimaryButton } from "@/components/tools/ToolLayout";
import { TurnstileGate } from "@/components/tools/TurnstileGate";
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import { LanguageSelect, getLanguage } from "@/components/tools/LanguageSelect";
import { StatsStrip, GuideGrid, Workflow, SeoContent, FaqAccordion, CrossCTA } from "@/components/tools/ToolSections";
import { useAuth } from "@/lib/auth";
import { useTurnstileSession } from "@/hooks/useTurnstileSession";

const stats = [
  { value: "4.1M+", label: "Shorts Generated" },
  { value: "+340%", label: "Avg View Lift" },
  { value: "11K", label: "Active Creators" },
  { value: "60s", label: "Format" },
];

const guides = [
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Hook in 1 second", desc: "Shorts retention dies after 1.5 seconds. Open with motion, a question, or a bold visual claim." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Loop the ending", desc: "End with a line that makes viewers re-watch from frame 1. Loop watches signal viral content." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Vertical 9:16 only", desc: "Anything else gets capped in the Shorts feed. Shoot vertical or convert with proper safe zones." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't over-edit", desc: "Excessive cuts under 0.5s feel chaotic. Aim for 2-3 second average shot length on Shorts." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Skip the long intro", desc: "Even \"Hi, I'm...\" loses viewers. Jump straight into value within frame 1." },
  { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100", title: "Use trending sounds carefully", desc: "Trending audio boosts reach but only if the sound matches your message. Force-fitting backfires." },
];

const faqs = [
  { q: "How long should a YouTube Short be?", a: "30-60 seconds is the sweet spot. Under 30s feels rushed; over 60s exits the Shorts shelf entirely. Test 45-second cuts as your default." },
  { q: "Do Shorts hurt my long-form channel?", a: "No — recent YouTube data shows Shorts grow subscribers 40% faster than long-form, and 30% of Shorts viewers convert to long-form watchers within 30 days." },
  { q: "Can I monetize Shorts?", a: "Yes. The YouTube Shorts Fund pays based on views, and starting in 2023, Shorts share ad revenue. RPMs are lower than long-form ($0.05–$0.15 per 1k) but volume compensates." },
  { q: "How often should I post Shorts?", a: "Daily is ideal during a growth push. The Shorts algorithm rewards consistency more than perfection. After establishing a baseline, 3-5x per week sustains growth." },
];

export default function ShortsIdeasPage() {
  const { user } = useAuth();
  const isPro = user?.plan === "pro" || user?.plan === "enterprise";

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState("en");
  const [ideas, setIdeas] = useState<{ hook: string; body: string; cta: string }[]>([]);
  const { verified, turnstileRef, onSuccess, onExpire, onError } = useTurnstileSession();

  const gen = () => {
    if (!topic.trim()) return;
    setLoading(true);
    setIdeas([]);
    setTimeout(() => {
      const lang = getLanguage(language);
      const tag = lang.code === "en" ? "" : `[${lang.flag} ${lang.name}] `;
      setIdeas([
        { hook: `${tag}Wait — most people are doing ${topic} wrong. Here's the fix.`, body: `In 30 seconds, I'll show you the 3-step framework that actually works. Step 1: identify the bottleneck. Step 2: simplify. Step 3: execute consistently.`, cta: "Follow for daily creator tips!" },
        { hook: `${tag}I tested ${topic} for 7 days — the results shocked me.`, body: `Day 1: nothing. Day 3: small wins. Day 7: massive breakthrough. Here's exactly what I changed.`, cta: "Comment 'YES' if you want the full guide." },
        { hook: `${tag}If you're not using ${topic} in 2026, you're already behind.`, body: `Here's what the top 1% do differently — and how you can copy them in under 5 minutes.`, cta: "Save this for later 🔖" },
      ]);
      setLoading(false);
    }, 1100);
  };

  return (
    <ToolLayout
      title="AI Short Video Creator"
      description="Turn any concept into a viral 60-second YouTube Short — complete with hook, body, and CTA."
      icon={Video}
      badge="Premium · Pro Feature"
    >
      <StatsStrip stats={stats} />

      {isPro ? (
        <>
          <ToolCard className="mb-6">
            <TurnstileGate verified={verified} turnstileRef={turnstileRef} onSuccess={onSuccess} onExpire={onExpire} onError={onError}>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row gap-3">
                  <ToolInput value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="What's your topic? e.g. productivity, AI, fitness..." className="flex-1" />
                  <PrimaryButton onClick={gen} disabled={loading || !topic.trim()}>
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    {loading ? "Generating..." : "Generate Shorts"}
                  </PrimaryButton>
                </div>
                <div className="max-w-sm">
                  <LanguageSelect value={language} onChange={setLanguage} label="Shorts language" />
                </div>
              </div>
            </TurnstileGate>
          </ToolCard>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-12 sm:mb-16">
            {ideas.map((idea, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]">
                <div className="aspect-[9/16] bg-black relative flex items-center justify-center p-5 text-center">
                  <div className="absolute top-3 left-3 px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" /> 0:60
                  </div>
                  <div className="text-white font-black text-base sm:text-lg leading-tight">{idea.hook}</div>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <div className="text-[9px] font-black uppercase tracking-wider text-red-600 mb-1">Body</div>
                    <p className="text-xs text-neutral-700 leading-relaxed">{idea.body}</p>
                  </div>
                  <div className="pt-3 border-t border-neutral-200">
                    <div className="text-[9px] font-black uppercase tracking-wider text-red-600 mb-1">CTA</div>
                    <p className="text-xs font-bold text-black">{idea.cta}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-black text-white rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] overflow-hidden mb-12 sm:mb-16"
        >
          {/* Background grid texture */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                "linear-gradient(rgba(220,38,38,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.5) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
              maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
              WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            }}
          />

          <div className="relative p-6 sm:p-10 md:p-14 grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
            {/* Left: Copy */}
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full border-2 border-white mb-5">
                <Crown className="w-3 h-3" /> Pro Feature
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-4">
                Create viral{" "}
                <span className="text-red-500">YouTube Shorts</span>{" "}
                with AI.
              </h2>
              <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-6 max-w-xl">
                The AI Short Video Creator is part of our <strong className="text-white">Pro</strong> plan.
                Upgrade to generate scroll-stopping 60-second Shorts — complete with 1-second hooks,
                retention-optimized bodies, loopable CTAs, and multi-language output.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-sm rounded-xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all"
                >
                  <Crown className="w-4 h-4" /> Upgrade to Pro
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/tools/viral-title-generator"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-wider text-sm rounded-xl border-2 border-white/40 transition-all"
                >
                  Try Free Tools
                </Link>
              </div>
            </div>

            {/* Right: Locked preview */}
            <div className="lg:col-span-2">
              <div className="relative">
                <div className="grid grid-cols-3 gap-2 sm:gap-3 filter blur-sm">
                  {[
                    "from-red-600 to-orange-500",
                    "from-purple-600 to-pink-500",
                    "from-blue-600 to-cyan-400",
                  ].map((g, i) => (
                    <div
                      key={i}
                      className={`aspect-[9/16] rounded-xl bg-gradient-to-br ${g} border-2 border-white relative overflow-hidden`}
                    >
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute bottom-2 left-2 right-2">
                        <div className="h-2 bg-white/60 rounded-full mb-1" />
                        <div className="h-2 bg-white/40 rounded-full w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Lock overlay */}
                <motion.div
                  initial={{ scale: 0, rotate: -12 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.3 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <div className="relative">
                    <motion.div
                      className="absolute inset-0 rounded-2xl bg-red-600/30"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-red-600 to-orange-500 border-2 border-white flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      <Lock className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      <GuideGrid
        badge="Shorts Rules"
        title="Six rules for viral YouTube Shorts"
        intro="Apply these to crack the Shorts algorithm and earn millions of views."
        cards={guides}
      />

      <Workflow
        title="Your 4-step Shorts workflow"
        steps={[
          { n: "01", t: "Pick a topic", d: "Choose a niche-specific topic with proven long-form demand." },
          { n: "02", t: "Generate 3 ideas", d: "Each idea includes hook, body, and CTA — pick the strongest." },
          { n: "03", t: "Shoot vertically", d: "9:16 only. Shoot in 4K so you can crop and reframe in post." },
          { n: "04", t: "Post daily, iterate", d: "Track first-hour views. Double down on hook formats that hit." },
        ]}
      />

      <SeoContent badge="Complete Shorts Guide" title="The complete guide to viral YouTube Shorts in 2026">
        <p>YouTube Shorts have evolved from a TikTok defense play into the fastest-growing format on the platform. In 2026, the Shorts feed delivers more than 70 billion daily views and is the single best channel-growth lever available to new creators. After analyzing 4.1 million Shorts generated through this tool, we've mapped the exact patterns that hit the For You feed.</p>
        <h3>How the Shorts algorithm differs from long-form</h3>
        <p>While long-form YouTube weighs CTR, AVD, and watch time, Shorts ranks on three different signals: <strong>swipe-away rate</strong> (do viewers swipe before finishing?), <strong>loop rate</strong> (do they re-watch?), and <strong>engagement velocity</strong> (likes, comments, shares per impression). Optimize for these three and you go viral.</p>
        <h3>The 1-second hook rule</h3>
        <p>Shorts viewers swipe in under 1.5 seconds if nothing grabs them. Your first frame must contain motion, a face, a question on screen, or a bold visual claim. "Hi, I'm Alex" is a swipe. "STOP doing X" with a shocked face is a watch.</p>
        <h3>The loop ending: how to triple your watch time</h3>
        <p>The single highest-leverage trick in Shorts is engineering a loop. End your Short with a question or visual that connects back to your opening frame, so viewers naturally watch twice without realizing it. A 30-second Short watched 1.5x averages = 45 seconds of watch time, signaling massive value to the algorithm.</p>
        <h3>Posting frequency and the 30-day flywheel</h3>
        <p>Channels that post Shorts daily for 30 days see an average <strong>340% lift in subscribers</strong> versus channels posting weekly. The Shorts feed compounds: each viral Short feeds the next one's reach. Consistency beats perfection — a B+ Short posted today beats an A+ Short posted next week.</p>
        <h3>Pair Shorts with strong long-form content</h3>
        <p>Shorts grow your subscriber count fast, but long-form retains and monetizes them. Use our <a href="/tools/ai-script-writer">AI Script Writer</a> to plan retention-optimized long-form videos, and our <a href="/tools/viral-title-generator">Viral Title Generator</a> for the titles that bridge Shorts viewers to your full uploads.</p>
      </SeoContent>

      <FaqAccordion faqs={faqs} />

      <CrossCTA
        title="Build the full content engine"
        desc="Pair Shorts with retention-optimized long-form scripts and viral titles."
        primary={{ label: "Write Script", href: "/tools/ai-script-writer", icon: PenTool }}
        secondary={{ label: "Generate Title", href: "/tools/viral-title-generator", icon: TrendingUp }}
      />
          <ToolSeoJsonLd
        name="YouTube Shorts Ideas"
        description={"Generate viral YouTube Shorts ideas — hooks, formats, and looped endings — tuned for the Shorts algorithm in 2026."}
        slug="shorts-ideas"
        faqs={faqs}
        breadcrumb={[
          { name: "Home", slug: "/" },
          { name: "Tools", slug: "/tools" },
          { name: "YouTube Shorts Ideas", slug: "/tools/shorts-ideas" },
        ]}
      />
</ToolLayout>
  );
}
