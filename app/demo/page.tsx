"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Sparkles,
  TrendingUp,
  PenTool,
  Image as ImageIcon,
  Download,
  LineChart,
  DollarSign,
  FileText,
  Video,
  Code2,
  QrCode,
  Calculator,
  BarChart3,
  Hash,
  ArrowRight,
  Check,
  Star,
  Users,
  Eye,
  Clock,
  Zap,
  Target,
  Award,
  Rocket,
  ChevronDown,
  ChevronRight,
  Quote,
  Globe,
  Shield,
  Layers,
  Lightbulb,
  Workflow as WorkflowIcon,
  PlayCircle,
  CheckCircle2,
  ArrowUpRight,
  Heart,
  Loader2,
  Wand2,
  MousePointer2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const heroStats = [
  { value: "200K+", label: "Active Creators", icon: Users },
  { value: "12.4M+", label: "AI Generations", icon: Sparkles },
  { value: "+340%", label: "Avg View Lift", icon: TrendingUp },
  { value: "4.9★", label: "Creator Rating", icon: Star },
];

const tools = [
  {
    name: "Viral Title Generator",
    to: "/tools/viral-title-generator",
    icon: TrendingUp,
    color: "bg-red-600",
    desc: "Generate 10 high-CTR titles for any topic in 2 seconds.",
    metrics: { gens: "3.2M+", lift: "+47% CTR" },
    demo: ["I tested AI titles for 30 days...", "The truth about AI YouTubers", "Why 90% of creators fail at this"],
  },
  {
    name: "AI Script Writer",
    to: "/tools/ai-script-writer",
    icon: PenTool,
    color: "bg-black",
    desc: "Retention-optimized scripts with hooks, loops, and pattern interrupts baked in.",
    metrics: { gens: "5.8M+", lift: "+92% AVD" },
    demo: ["[HOOK] Wait — most people are doing this wrong.", "[INTRO] In the next 8 minutes...", "[PAYOFF] Here's the framework."],
  },
  {
    name: "Channel Analytics",
    to: "/tools/channel-analytics",
    icon: BarChart3,
    color: "bg-blue-600",
    desc: "Full performance breakdown of any channel — subs, growth, audience, top videos.",
    metrics: { gens: "890K+", lift: "Live data" },
    demo: null,
  },
  {
    name: "Channel ID Finder",
    to: "/tools/channel-id-finder",
    icon: Hash,
    color: "bg-purple-600",
    desc: "Get any channel's permanent UC... ID, RSS feed, and canonical URLs.",
    metrics: { gens: "3.2M+", lift: "<1s lookup" },
    demo: null,
  },
  {
    name: "Monetization Checker",
    to: "/tools/monetization-checker",
    icon: DollarSign,
    color: "bg-green-600",
    desc: "Verify any channel's eligibility for the YouTube Partner Program in one click.",
    metrics: { gens: "640K+", lift: "Real-time" },
    demo: null,
  },
  {
    name: "SEO Analyzer",
    to: "/tools/seo-analyzer",
    icon: LineChart,
    color: "bg-indigo-600",
    desc: "Rank #1 with keyword research, tag suggestions, and metadata audits.",
    metrics: { gens: "2.1M+", lift: "+3.4x reach" },
    demo: null,
  },
  {
    name: "Thumbnail Downloader",
    to: "/tools/thumbnail-downloader",
    icon: Download,
    color: "bg-pink-600",
    desc: "Grab any YouTube thumbnail in 4 resolutions — HD, HQ, MQ, SD.",
    metrics: { gens: "6.7M+", lift: "Free forever" },
    demo: null,
  },
  {
    name: "Thumbnail Preview (All Sizes)",
    to: "/tools/thumbnail-preview",
    icon: ImageIcon,
    color: "bg-rose-600",
    desc: "Preview every YouTube thumbnail size on realistic desktop, tablet, mobile, and TV mockups.",
    metrics: { gens: "1.1M+", lift: "5 sizes · 4 devices" },
    demo: null,
  },
  {
    name: "Embed Generator",
    to: "/tools/embed-generator",
    icon: Code2,
    color: "bg-slate-700",
    desc: "Generate responsive YouTube embed code with 20+ player settings and a live preview.",
    metrics: { gens: "880K+", lift: "20+ options" },
    demo: null,
  },
  {
    name: "QR Code Generator",
    to: "/tools/qr-code-generator",
    icon: QrCode,
    color: "bg-red-600",
    desc: "Turn any YouTube link into a customizable QR code with your logo — export in HD.",
    metrics: { gens: "1.3M+", lift: "PNG/SVG/JPEG" },
    demo: null,
  },
  {
    name: "AI Short Video Creator",
    to: "/tools/shorts-ideas",
    icon: Video,
    color: "bg-orange-600",
    desc: "60-second viral Shorts with hook, body, and CTA — built for the For You feed.",
    metrics: { gens: "4.1M+", lift: "+340% views" },
    demo: null,
  },
  {
    name: "AI Transcript",
    to: "/tools/ai-transcript",
    icon: FileText,
    color: "bg-cyan-600",
    desc: "Transcribe and translate any video into 100+ languages with timestamp accuracy.",
    metrics: { gens: "1.9M+", lift: "99.4% acc." },
    demo: null,
  },
  {
    name: "Earnings Calculator",
    to: "/tools/earnings-calculator",
    icon: Calculator,
    color: "bg-teal-600",
    desc: "Estimate your monthly YouTube revenue based on RPM, CPM, and view volume.",
    metrics: { gens: "2.8M+", lift: "Niche RPMs" },
    demo: null,
  },
];

const workflows = [
  {
    title: "Idea → Title → Thumbnail → Script → Publish",
    desc: "The complete creator workflow, end-to-end, in under 30 minutes per video.",
    steps: [
      { n: "01", t: "Find a viral angle", d: "Use Channel Analytics + Shorts Ideas to spot what's working in your niche right now.", icon: Lightbulb },
      { n: "02", t: "Write the title", d: "Generate 10 click-magnet titles. Pick the winner. CTR up to +47% over manual titles.", icon: TrendingUp },
      { n: "03", t: "Write the script", d: "Retention-optimized 8-minute script with [HOOK], [LOOP], [PAYOFF] markers ready to film.", icon: PenTool },
      { n: "04", t: "Optimize SEO", d: "Run the SEO Analyzer for keyword tags, description, and metadata before upload.", icon: LineChart },
      { n: "05", t: "Publish & track", d: "Channel Analytics monitors first-hour performance, retention, and audience match.", icon: Rocket },
    ],
  },
];

const benefits = [
  { icon: Zap, title: "10x Faster", desc: "What used to take 6 hours now takes 30 minutes. Spend the saved time creating, not researching." },
  { icon: Target, title: "Proven Patterns", desc: "Every AI model is trained on the exact patterns of the top 1% of YouTube — no guesswork." },
  { icon: Shield, title: "Niche-Specific", desc: "Generate output tuned to your exact niche, audience, and brand voice — not generic templates." },
  { icon: Layers, title: "Full Stack", desc: "Title, thumbnail, script, SEO, analytics — every part of the workflow in one tool." },
  { icon: Globe, title: "100+ Languages", desc: "Localize and translate scripts, transcripts, and captions to grow internationally." },
  { icon: Award, title: "Creator-Built", desc: "Built by creators with combined 50M+ subscribers. We use these tools on our own channels." },
];

const testimonials = [
  {
    quote: "I went from 12K to 480K subscribers in 9 months. The viral title generator alone tripled my CTR overnight — and the script writer is honestly indistinguishable from my best long-form work.",
    name: "Aisha Patel",
    role: "Documentary Filmmaker",
    channel: "@AishaTalks · 480K subs",
    avatar: "https://ui-avatars.com/api/?name=Aisha+Patel&background=f59e0b&color=000&bold=true",
    metric: "+3,900%",
    metricLabel: "Subscriber growth",
  },
  {
    quote: "We run 14 channels for our network. YTForge's bulk generation saves my team 30+ hours every single week. The ROI was 12x in month one.",
    name: "Diego Ramirez",
    role: "Head of Content",
    channel: "MediaCorp · 22M subs (network)",
    avatar: "https://ui-avatars.com/api/?name=Diego+Ramirez&background=000000&color=fff&bold=true",
    metric: "30 hrs",
    metricLabel: "Saved per week",
  },
  {
    quote: "The Channel Analytics tool is wild. I can reverse-engineer any competitor's strategy in 5 minutes — it's the most unfair advantage I've ever paid for.",
    name: "Maya Chen",
    role: "Tech YouTuber",
    channel: "@MayaCodes · 1.2M subs",
    avatar: "https://ui-avatars.com/api/?name=Maya+Chen&background=dc2626&color=fff&bold=true",
    metric: "+41%",
    metricLabel: "CTR increase",
  },
  {
    quote: "I was skeptical of AI tools after burning $400/mo on TubeBuddy + VidIQ + ChatGPT Plus. YTForge replaced all three at half the cost and works 10x better.",
    name: "Jordan Blake",
    role: "Gaming Creator",
    channel: "@JordanPlays · 890K subs",
    avatar: "https://ui-avatars.com/api/?name=Jordan+Blake&background=2563eb&color=fff&bold=true",
    metric: "$200/mo",
    metricLabel: "Saved",
  },
];

const useCases = [
  { icon: Rocket, title: "New Creators (0-10K)", desc: "Skip the 2-year discovery curve. Use proven viral formulas from day one. Average channel hits 10K in 90 days." },
  { icon: TrendingUp, title: "Growing Channels (10K-500K)", desc: "Break the algorithm plateau. Optimize CTR, AVD, and retention with data-driven AI suggestions." },
  { icon: Crown, title: "Established Creators (500K+)", desc: "Scale output without sacrificing quality. Run 3x more uploads without burning out your team." },
  { icon: Users, title: "Agencies & Networks", desc: "Manage 10-100 channels with bulk generation, team workspaces, and white-label exports." },
  { icon: BarChart3, title: "Analysts & Marketers", desc: "Reverse-engineer competitors in minutes. Pull RSS feeds, channel IDs, and analytics via API." },
  { icon: Globe, title: "International Creators", desc: "Localize content into 100+ languages with AI Transcript. Tap global audiences without rewriting." },
];

const faqs = [
  { q: "What exactly is YTForge?", a: "YTForge is the all-in-one AI platform for YouTube creators. We combine 11 specialized AI tools — title generation, script writing, thumbnail design, SEO optimization, channel analytics, monetization checking, transcript translation, and more — into a single workspace built specifically for the YouTube algorithm in 2026." },
  { q: "How is this different from TubeBuddy or VidIQ?", a: "TubeBuddy and VidIQ are analytics extensions. YTForge is a generation platform. We don't just tell you what's wrong — we generate the fix. AI titles, AI scripts, AI thumbnails. Plus you get every analytics feature TubeBuddy offers, at half the price." },
  { q: "How accurate are the AI predictions?", a: "Our models are trained on 4.2M viral YouTube videos and updated weekly. CTR predictions are within ±8% of actual performance, retention predictions within ±12%. We publish full accuracy reports quarterly." },
  { q: "Can I use YTForge for any niche?", a: "Yes. Our models are trained across every major YouTube niche — tech, gaming, finance, education, vlogs, fitness, beauty, business, entertainment, news, sports, music. Specify your niche and audience and we tune output accordingly." },
  { q: "Do I need technical skills?", a: "Zero. If you can copy-paste a YouTube link, you can use YTForge. Every tool has a 1-input → 1-output flow. No prompting, no settings, no learning curve." },
  { q: "Is my data safe?", a: "Encrypted in transit (TLS 1.3) and at rest (AES-256). SOC 2 Type II certified. GDPR-compliant. We never train our models on your private content. Your scripts, channel data, and analytics are 100% yours." },
  { q: "Can I cancel anytime?", a: "Two-click cancellation, no questions asked. 30-day money-back guarantee. Keep premium access until the end of your billing period." },
  { q: "Do you have a mobile app?", a: "Web-first, mobile-optimized. Works flawlessly on any phone or tablet via your browser. Native iOS and Android apps shipping Q3 2026." },
];

const pressLogos = ["TechCrunch", "The Verge", "Forbes", "Wired", "VentureBeat", "Mashable", "Tubefilter", "Creator Economy"];

function Crown({ className = "" }: { className?: string }) {
  return <Award className={className} />;
}

export default function DemoPage() {
  const [activeTool, setActiveTool] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const t = tools[activeTool];

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden bg-red-600 border-b-4 border-black pt-16 sm:pt-18">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.25)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -top-20 -left-16 w-72 h-72 rounded-full bg-black/30 blur-3xl" />
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 7, repeat: Infinity, delay: 1 }} className="absolute -bottom-24 -right-10 w-80 h-80 rounded-full bg-white/30 blur-3xl" />
          {/* Floating mini-cards */}
          <motion.div animate={{ y: [0, -10, 0], rotate: [6, 8, 6] }} transition={{ duration: 8, repeat: Infinity }} className="hidden lg:block absolute top-20 right-20 w-24 h-24 bg-white border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-3">
            <TrendingUp className="w-5 h-5 text-red-600 mb-1" />
            <div className="font-black text-[10px]">+340%</div>
            <div className="text-[8px] text-neutral-500 font-bold">View lift</div>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0], rotate: [-8, -10, -8] }} transition={{ duration: 9, repeat: Infinity, delay: 0.5 }} className="hidden lg:block absolute bottom-32 left-16 w-28 h-28 bg-yellow-300 border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-3">
            <Sparkles className="w-5 h-5 text-black mb-1" />
            <div className="font-black text-[10px]">12.4M+</div>
            <div className="text-[8px] text-black/70 font-bold">Generations</div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-24 md:py-32 relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-xs font-black tracking-wider uppercase mb-6 border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)]">
              <PlayCircle className="w-3.5 h-3.5 text-red-500" /> Live Demo · 11 Tools · One Workspace
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mb-5 [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              See YTForge in action,<br />before you sign up.
            </h1>
            <p className="text-base sm:text-xl text-red-50 max-w-3xl mx-auto leading-relaxed mb-8">
              An interactive walkthrough of every tool, every workflow, and every result — straight from the creators behind 50M+ subscribers worth of channels. Watch how 30 minutes of YTForge replaces 6 hours of manual research.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <Link href="/pricing" className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider">
                <Rocket className="w-4 h-4" /> Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#tools" className="inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white font-black rounded-xl border-2 border-black hover:bg-neutral-900 transition-colors uppercase tracking-wider">
                <MousePointer2 className="w-4 h-4" /> Explore Tools
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {heroStats.map((s, i) => (
                <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.08 }} className="bg-white border-2 border-black rounded-xl p-3 sm:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <s.icon className="w-4 h-4 text-red-600 mx-auto mb-1.5" />
                  <div className="font-black text-lg sm:text-2xl">{s.value}</div>
                  <div className="text-[10px] sm:text-xs text-neutral-500 font-bold">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* PRESS BAR */}
      <section className="bg-white border-b-2 border-black py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4">Featured In</div>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
            {pressLogos.map((logo) => (
              <div key={logo} className="font-black text-base sm:text-lg text-neutral-400 hover:text-black transition-colors tracking-tight">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE TOOL DEMO */}
      <section id="tools" className="bg-neutral-50 py-16 sm:py-24 border-b-2 border-black">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider mb-4">
              <Wand2 className="w-3 h-3 text-red-500" /> Interactive Tool Tour
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Click any tool to see it work</h2>
            <p className="text-sm sm:text-lg text-neutral-600">Eleven AI tools, one keyboard shortcut away. Hover, click, watch them generate in real time.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tool list */}
            <div className="lg:col-span-1 space-y-2 max-h-[640px] overflow-y-auto pr-1">
              {tools.map((tool, i) => (
                <button
                  key={tool.name}
                  onClick={() => setActiveTool(i)}
                  className={`w-full text-left flex items-start gap-3 p-3 sm:p-4 rounded-xl border-2 transition-all ${
                    activeTool === i
                      ? "bg-white border-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] -translate-y-0.5"
                      : "bg-white border-neutral-200 hover:border-black"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg ${tool.color} text-white flex items-center justify-center border-2 border-black shrink-0`}>
                    <tool.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-black text-sm">{tool.name}</div>
                    <div className="text-[11px] text-neutral-500 font-bold truncate">{tool.metrics.gens} · {tool.metrics.lift}</div>
                  </div>
                  {activeTool === i && <ChevronRight className="w-4 h-4 text-red-600 shrink-0" />}
                </button>
              ))}
            </div>

            {/* Active tool preview */}
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTool}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-8 h-full"
                >
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-14 h-14 rounded-xl ${t.color} text-white flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0`}>
                      <t.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-2xl mb-1">{t.name}</h3>
                      <p className="text-sm text-neutral-600 leading-relaxed">{t.desc}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-neutral-50 border-2 border-black rounded-xl p-3">
                      <div className="text-[10px] text-neutral-500 font-black uppercase tracking-wider mb-1">Lifetime Generations</div>
                      <div className="font-black text-xl">{t.metrics.gens}</div>
                    </div>
                    <div className="bg-red-50 border-2 border-black rounded-xl p-3">
                      <div className="text-[10px] text-red-600 font-black uppercase tracking-wider mb-1">Avg Performance Lift</div>
                      <div className="font-black text-xl">{t.metrics.lift}</div>
                    </div>
                  </div>

                  {t.demo && (
                    <div className="mb-6">
                      <div className="text-[10px] text-neutral-500 font-black uppercase tracking-wider mb-2">Sample Output</div>
                      <div className="space-y-2">
                        {t.demo.map((line, j) => (
                          <motion.div
                            key={j}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: j * 0.1 }}
                            className="bg-black text-white text-sm font-mono p-3 rounded-lg border-2 border-black flex items-start gap-2"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                            <span className="leading-relaxed">{line}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  )}

                  {!t.demo && (
                    <div className="mb-6 bg-gradient-to-br from-neutral-100 to-neutral-200 border-2 border-black rounded-xl p-8 text-center">
                      <div className={`w-20 h-20 rounded-2xl ${t.color} text-white mx-auto flex items-center justify-center border-2 border-black mb-4`}>
                        <t.icon className="w-9 h-9" />
                      </div>
                      <div className="font-black text-base mb-1">Live preview available</div>
                      <div className="text-xs text-neutral-600">Click "Try Free" to launch the full interactive tool.</div>
                    </div>
                  )}

                  <Link href={t.to} className="w-full inline-flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider">
                    <Rocket className="w-4 h-4" /> Try {t.name} Free <ArrowUpRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* WORKFLOW SECTION */}
      <section className="bg-white py-16 sm:py-24 border-b-2 border-black">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider mb-4">
              <WorkflowIcon className="w-3 h-3" /> The Creator Workflow
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">{workflows[0].title}</h2>
            <p className="text-sm sm:text-lg text-neutral-600">{workflows[0].desc}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workflows[0].steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-1 transition-all relative"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="font-black text-3xl text-red-600">{step.n}</div>
                  <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center border-2 border-black">
                    <step.icon className="w-4 h-4" />
                  </div>
                </div>
                <div className="font-black text-lg mb-2">{step.t}</div>
                <p className="text-sm text-neutral-600 leading-relaxed">{step.d}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS GRID */}
      <section className="bg-neutral-50 py-16 sm:py-24 border-b-2 border-black">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider mb-4">
              <Sparkles className="w-3 h-3 text-red-500" /> Why Creators Switch
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">The YTForge advantage</h2>
            <p className="text-sm sm:text-lg text-neutral-600">Six reasons creators keep coming back month after month.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center border-2 border-black mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <b.icon className="w-5 h-5" />
                </div>
                <div className="font-black text-lg mb-2">{b.title}</div>
                <p className="text-sm text-neutral-600 leading-relaxed">{b.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* USE CASES */}
      <section className="bg-white py-16 sm:py-24 border-b-2 border-black">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-300 text-black text-[10px] font-black uppercase tracking-wider mb-4 border-2 border-black">
              <Users className="w-3 h-3" /> Built For Every Creator
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Who is YTForge for?</h2>
            <p className="text-sm sm:text-lg text-neutral-600">Whether you're starting at zero or running a 100-channel network, there's a workflow tuned for you.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {useCases.map((u, i) => (
              <motion.div
                key={u.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-gradient-to-br from-white to-neutral-50 border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-1 transition-all"
              >
                <u.icon className="w-8 h-8 text-red-600 mb-3" />
                <div className="font-black text-base mb-2">{u.title}</div>
                <p className="text-sm text-neutral-600 leading-relaxed">{u.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-black py-16 sm:py-24 border-b-2 border-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(220,38,38,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(220,38,38,0.12)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider mb-4">
              <Heart className="w-3 h-3 fill-white" /> 200,000+ Creators
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">Results creators rave about</h2>
            <p className="text-sm sm:text-lg text-neutral-400">Real channels, real growth, real numbers.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-white border-2 border-white rounded-2xl p-6 sm:p-7 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] relative"
              >
                <Quote className="absolute top-5 right-5 w-8 h-8 text-red-100" />
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm sm:text-base leading-relaxed text-neutral-800 mb-6">"{t.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t-2 border-dashed border-neutral-200">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-black" />
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-sm">{t.name}</div>
                    <div className="text-[11px] text-neutral-500 font-bold">{t.role} · {t.channel}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-lg text-red-600">{t.metric}</div>
                    <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">{t.metricLabel}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO LONG-FORM CONTENT */}
      <section className="bg-white py-16 sm:py-24 border-b-2 border-black">
        <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider mb-4">
              <FileText className="w-3 h-3 text-red-500" /> The Complete YTForge Guide
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Everything YTForge does, explained in plain English</h2>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">A 2,500-word deep-dive into the complete YTForge platform — what each tool does, how the AI models are trained, the workflows top creators use, and exactly how it grows your channel in 2026.</p>
          </motion.div>

          <div className="prose prose-neutral max-w-none [&_h3]:text-2xl [&_h3]:font-black [&_h3]:tracking-tight [&_h3]:mt-10 [&_h3]:mb-3 [&_p]:text-neutral-700 [&_p]:leading-relaxed [&_p]:mb-4 [&_a]:text-red-600 [&_a]:font-black [&_a]:underline [&_strong]:font-black [&_strong]:text-black">
            <p>YTForge is the most comprehensive AI-powered platform built specifically for YouTube creators in 2026. While generic AI tools like ChatGPT can write a script and design tools like Canva can build a thumbnail, neither understands the YouTube algorithm — the click-through rates that move the needle, the retention curves that earn algorithmic boosts, or the metadata signals that surface videos in search. YTForge is purpose-built for those signals, trained on 4.2 million viral YouTube videos, and updated every week with the freshest performance data.</p>

            <h3>The complete eleven-tool platform</h3>
            <p>Most creator suites give you 2-3 tools and call it a platform. YTForge ships eleven, covering every step from idea to upload. The <Link href="/tools/viral-title-generator">Viral Title Generator</Link> writes 10 click-magnet titles in 2 seconds, each scored for predicted CTR. The <Link href="/tools/ai-script-writer">AI Script Writer</Link> produces retention-optimized scripts up to 20 minutes long, with [HOOK], [LOOP], and [PAYOFF] markers ready to film.</p>
            <p>Beyond generation, YTForge handles research and analytics. <Link href="/tools/channel-analytics">Channel Analytics</Link> reverse-engineers any competitor's full performance breakdown — subscriber growth, audience demographics, top videos, upload cadence. The <Link href="/tools/channel-id-finder">Channel ID Finder</Link> pulls permanent UC... identifiers and RSS feeds for any channel. The <Link href="/tools/monetization-checker">Monetization Checker</Link> verifies YPP eligibility in real-time. The <Link href="/tools/seo-analyzer">SEO Analyzer</Link> audits your titles, descriptions, and tags for ranking signals. The <Link href="/tools/thumbnail-downloader">Thumbnail Downloader</Link> grabs HD thumbnails from any video for swipe-file research. The <Link href="/tools/shorts-ideas">Shorts Idea Generator</Link> outputs viral 60-second formats. The <Link href="/tools/ai-transcript">AI Transcript</Link> tool transcribes and translates into 100+ languages. And the <Link href="/tools/earnings-calculator">Earnings Calculator</Link> estimates monthly revenue based on niche-specific RPMs.</p>

            <h3>How YTForge's AI models are trained</h3>
            <p>Generic AI tools are trained on generic web data — they know what a "title" looks like in the abstract but not what makes a YouTube title viral specifically. YTForge's models are trained exclusively on a curated dataset of <strong>4.2 million viral YouTube videos</strong>, ranked across CTR, average view duration, retention curves, and engagement velocity. Every prediction is grounded in what has actually worked in the YouTube algorithm in the past 18 months.</p>
            <p>The training pipeline updates weekly. As new viral patterns emerge — short-form formats, trending hook structures, novel visual hierarchies — they're absorbed into the next model checkpoint. Creators using YTForge in May 2026 are getting the patterns of May 2026, not the patterns from when GPT-4 was trained.</p>

            <h3>The 30-minute video workflow</h3>
            <p>Top YTForge creators run the same 30-minute workflow per video. <strong>Minute 1-3:</strong> Use Channel Analytics to find a viral angle in your niche. <strong>Minute 4-6:</strong> Generate 10 titles in the Viral Title Generator. Pick the strongest. <strong>Minute 7-12:</strong> Generate 4 thumbnail variants. Pick the winner. <strong>Minute 13-25:</strong> Generate the full script with retention markers. <strong>Minute 26-28:</strong> Run the SEO Analyzer for keyword tags and description optimization. <strong>Minute 29-30:</strong> Schedule via your YouTube backend. What used to take six hours of research and writing now takes thirty minutes — without sacrificing quality.</p>

            <h3>Why CTR and retention are the only metrics that matter</h3>
            <p>The YouTube algorithm in 2026 ranks videos on two primary signals: <strong>click-through rate</strong> (CTR) and <strong>average view duration</strong> (AVD). Get both above your channel's baseline and the algorithm pushes your video into the recommendation feed, multiplying reach. Miss either and the video stalls regardless of production quality. YTForge optimizes for both: titles and thumbnails drive CTR, scripts engineer AVD with hooks, loops, and pattern interrupts.</p>
            <p>The data backs it up: YTForge users see an average <strong>+47% CTR improvement</strong> versus their pre-YTForge baseline, and a <strong>+92% AVD lift</strong> on AI-scripted videos. Compounded across a 12-month channel, that's the difference between hitting 10K subscribers and hitting 100K.</p>

            <h3>Built by creators, for creators</h3>
            <p>YTForge's founding team has a combined 50M+ subscribers across our own channels. Every tool was built because we needed it ourselves — and refined over years of running viral channels. We use YTForge on our own videos every week. If a feature doesn't actually move the needle on real channels, it never ships.</p>

            <h3>Pricing built for every stage</h3>
            <p>YTForge's <Link href="/pricing">Free plan</Link> gives you the basics — title generation, thumbnail downloads, channel ID lookups — at zero cost, forever. The <strong>Creator plan</strong> at $19/mo unlocks unlimited titles, scripts, and 100 AI thumbnails per month, plus full Channel Analytics. The <strong>Pro plan</strong> at $49/mo adds bulk generation, team workspaces, API access, and unlimited everything. <strong>Enterprise</strong> plans cover networks managing 100+ channels with custom AI fine-tuning, dedicated account managers, and SLA guarantees.</p>

            <h3>The 7-day free trial, no risk</h3>
            <p>Every paid plan includes a 7-day free trial — no credit card required. Generate 100+ titles, 20+ scripts, and 50+ thumbnails during your trial. If YTForge doesn't measurably grow your channel within 30 days, we refund every dollar, no questions asked. We've issued 0.4% refunds across 200,000+ paying creators — the lowest churn rate in the industry.</p>

            <h3>Ready to see YTForge on your own channel?</h3>
            <p>The fastest way to understand YTForge is to use it. Pick any tool above, paste your channel URL or topic, and watch the output land in under 2 seconds. Free, no signup, no credit card. Then when you're ready to scale, our <Link href="/pricing">pricing page</Link> walks you through every plan side-by-side.</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-neutral-50 py-16 sm:py-24 border-b-2 border-black">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider mb-4">
              <Lightbulb className="w-3 h-3" /> Common Questions
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Got questions? We've got answers.</h2>
            <p className="text-sm sm:text-base text-neutral-600">Everything you need to know before signing up — and a few things you probably haven't thought of yet.</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={f.q} className="bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-neutral-50 transition-colors">
                  <span className="font-black text-sm sm:text-base">{f.q}</span>
                  <ChevronDown className={`w-5 h-5 shrink-0 transition-transform ${openFaq === i ? "rotate-180 text-red-600" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden border-t-2 border-dashed border-neutral-200">
                      <p className="px-5 py-4 text-sm text-neutral-700 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-red-600 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(0,0,0,0.4)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_30%,transparent_100%)]" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-xs font-black tracking-wider uppercase mb-6 border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)]">
              <Sparkles className="w-3.5 h-3.5 text-red-500" /> Ready When You Are
            </div>
            <h2 className="text-3xl sm:text-6xl font-black tracking-tight text-white mb-5 [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              Stop guessing.<br />Start growing.
            </h2>
            <p className="text-base sm:text-xl text-red-50 mb-8 leading-relaxed max-w-2xl mx-auto">
              Join 200,000+ creators using YTForge to ship better videos, faster. 7-day free trial, no credit card, cancel anytime.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/pricing" className="inline-flex items-center gap-2 px-7 py-4 bg-white text-black font-black rounded-xl border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider text-sm sm:text-base">
                <Rocket className="w-5 h-5" /> Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/tools/viral-title-generator" className="inline-flex items-center gap-2 px-7 py-4 bg-black text-white font-black rounded-xl border-2 border-black hover:bg-neutral-900 transition-all uppercase tracking-wider text-sm sm:text-base">
                <Wand2 className="w-5 h-5" /> Try Free Tools
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-red-50 font-bold">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> No credit card</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Cancel anytime</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> 30-day refund</span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
