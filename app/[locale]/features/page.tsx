"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles,
  TrendingUp,
  PenTool,
  Image as ImageIcon,
  Download,
  LineChart,
  DollarSign,
  FileText,
  Video,
  Calculator,
  BarChart3,
  Code2,
  QrCode,
  Hash,
  ArrowRight,
  Check,
  Zap,
  Shield,
  Globe,
  Layers,
  Brain,
  Target,
  Rocket,
  Lock,
  Clock,
  Users,
  Cpu,
  Database,
  Cloud,
  Palette,
  Wand2,
  Headphones,
  RefreshCw,
  Workflow as WorkflowIcon,
  Lightbulb,
  Search,
  Eye,
  MousePointer2,
  ChevronDown,
  ChevronRight,
  Star,
  Award,
  Smartphone,
  Languages,
  Activity,
  Gauge,
  Settings,
  Boxes,
  Bot,
  GitBranch,
  Bell,
  Heart,
  PlayCircle,
  Crown,
  Tag as TagIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const heroStats = [
  { value: "14", label: "AI Tools", icon: Wand2 },
  { value: "100+", label: "Languages", icon: Languages },
  { value: "4.2M", label: "Trained Videos", icon: Database },
  { value: "<2s", label: "Generation", icon: Zap },
];

const categories = [
  { id: "ai", label: "AI Generation", icon: Brain },
  { id: "research", label: "Research & Analytics", icon: BarChart3 },
  { id: "optimization", label: "SEO & Optimization", icon: Target },
  { id: "production", label: "Production Suite", icon: Layers },
  { id: "platform", label: "Platform & Security", icon: Shield },
];

type FeatureItem = {
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  bullets: string[];
  to?: string;
  badge?: string;
  color: string;
};

const features: FeatureItem[] = [
  // AI Generation
  {
    category: "ai",
    icon: TrendingUp,
    title: "Viral Title Generator",
    desc: "Generate 10 click-magnet titles for any topic in under 2 seconds, each scored for predicted CTR.",
    bullets: [
      "5 proven title formulas (curiosity, contrarian, list, how-to, case study)",
      "Predicted CTR score per title, calibrated against your niche",
      "A/B variant generator with side-by-side comparison",
      "Niche-specific tone tuning (tech, gaming, finance, vlogs, more)",
      "Copy-to-clipboard + bulk export to CSV",
    ],
    to: "/tools/viral-title-generator",
    color: "bg-red-600",
    badge: "Most Used",
  },
  {
    category: "ai",
    icon: PenTool,
    title: "AI Script Writer",
    desc: "Retention-optimized long-form scripts up to 20 minutes, with [HOOK], [LOOP], and [PAYOFF] markers ready to film.",
    bullets: [
      "5 length presets (60s Shorts → 20 min long-form)",
      "5 tone presets (Energetic, Calm, Funny, Educational, Cinematic)",
      "Pattern interrupts and story breaks engineered for AVD",
      "Word count + read-time estimation per section",
      "Export to plain text, Markdown, or teleprompter format",
    ],
    to: "/tools/ai-script-writer",
    color: "bg-black",
  },
  {
    category: "ai",
    icon: Video,
    title: "AI Short Video Creator",
    desc: "Viral 60-second Short scripts with hook, body, and CTA — built specifically for the For You feed.",
    bullets: [
      "1-second hook openings engineered for low swipe-away",
      "Loop endings to triple watch-time per impression",
      "9:16 safe-zone visualizer for shoot planning",
      "Trending sound recommendations by niche",
      "Hook + body + CTA in three labeled sections",
    ],
    to: "/tools/shorts-ideas",
    color: "bg-orange-600",
    badge: "Pro",
  },

  // Research
  {
    category: "research",
    icon: BarChart3,
    title: "Channel Analytics",
    desc: "Full performance breakdown of any YouTube channel — public or your own — in one paste.",
    bullets: [
      "12-month subscriber growth chart with trend predictions",
      "Audience age, country, and language demographics",
      "Top 5 videos with view, retention, and CTR estimates",
      "Upload cadence heatmap across the past 8 weeks",
      "Channel health score with actionable recommendations",
    ],
    to: "/tools/channel-analytics",
    color: "bg-blue-600",
    badge: "Live Data",
  },
  {
    category: "research",
    icon: Hash,
    title: "Channel ID Finder",
    desc: "Get any channel's permanent UC... ID, RSS feed, and canonical URLs from any link or @handle.",
    bullets: [
      "Accepts any URL format: /channel/, /c/, /user/, @handle",
      "Returns permanent UC... ID, /channel/ URL, RSS feed",
      "Verified badge detection and channel metadata",
      "One-click copy on every output field",
      "API-ready output for automation workflows",
    ],
    to: "/tools/channel-id-finder",
    color: "bg-purple-600",
  },
  {
    category: "research",
    icon: Download,
    title: "Thumbnail Downloader",
    desc: "Grab any YouTube thumbnail in 4 resolutions — HD, HQ, MQ, SD — for swipe-file research.",
    bullets: [
      "1280×720 max-resolution HD download",
      "All 4 standard YouTube CDN resolutions",
      "Works for regular videos, Shorts, and unlisted",
      "Bulk download via channel URL (Pro plan)",
      "100% free, unlimited downloads, no signup",
    ],
    to: "/tools/thumbnail-downloader",
    color: "bg-pink-600",
  },
  {
    category: "research",
    icon: ImageIcon,
    title: "Thumbnail Preview (All Sizes)",
    desc: "Preview every YouTube thumbnail resolution and verify it on realistic desktop, tablet, mobile, and TV mockups.",
    bullets: [
      "All 5 YouTube resolutions in one view",
      "Realistic desktop / tablet / mobile / TV previews",
      "Side-by-side HQ vs Max comparison",
      "Auto-detects when maxres isn't available",
      "Fullscreen zoom, copy URL, and download",
    ],
    to: "/tools/thumbnail-preview",
    color: "bg-rose-600",
  },
  {
    category: "production",
    icon: Code2,
    title: "Embed Generator",
    desc: "Generate responsive, privacy-friendly YouTube embed code with 20+ customizable player options and a live preview.",
    bullets: [
      "Responsive iframe with 5 aspect ratios (16:9, 4:3, 1:1, 9:16, custom)",
      "Autoplay, mute, loop, captions, modest branding, fullscreen",
      "Privacy Enhanced Mode (youtube-nocookie)",
      "Live preview on desktop, tablet, and mobile",
      "Copy code or download a ready-to-open HTML file",
    ],
    to: "/tools/embed-generator",
    color: "bg-slate-700",
  },
  {
    category: "production",
    icon: QrCode,
    title: "QR Code Generator",
    desc: "Turn any YouTube video, Short, playlist, or channel link into a customizable, high-resolution QR code.",
    bullets: [
      "Works with videos, Shorts, live, playlists, @handles, channels",
      "Custom foreground/background colors + transparent option",
      "Add your channel logo in the center with size control",
      "Adjustable size (256–2048px) and error correction (L–H)",
      "Export PNG, SVG, or JPEG — plus copy-to-clipboard",
    ],
    to: "/tools/qr-code-generator",
    color: "bg-red-600",
  },
  {
    category: "research",
    icon: DollarSign,
    title: "Monetization Checker",
    desc: "Verify any channel's eligibility for the YouTube Partner Program in one click.",
    bullets: [
      "1,000 subscriber threshold check",
      "4,000 watch hour or 10M Shorts views verification",
      "Estimated RPM and monthly earnings",
      "Niche-specific RPM benchmarks",
      "Pass/fail breakdown per requirement",
    ],
    to: "/tools/monetization-checker",
    color: "bg-green-600",
  },

  // Optimization
  {
    category: "optimization",
    icon: Hash,
    title: "Hashtag Generator",
    desc: "Get 30+ high-performing #hashtags for any topic — broad, niche, and trending tags ranked by popularity.",
    bullets: [
      "30+ hashtags split into trending / niche / broad",
      "Popularity & competition badges per tag",
      "Copy-all in one click or copy individual tags",
      "Live trend signals refreshed continuously",
      "Mobile-friendly with category breakdown",
    ],
    to: "/tools/hashtag-generator",
    color: "bg-teal-600",
  },
  {
    category: "optimization",
    icon: TagIcon,
    title: "Tag Generator",
    desc: "Generate 40+ SEO-optimized video tags for YouTube uploads — primary, secondary, and long-tail keywords with search volume.",
    bullets: [
      "40+ tags split into primary / secondary / long-tail",
      "Live 500-character counter (YouTube's tag limit)",
      "Search volume badges (high / medium / low)",
      "Click-to-copy any tag or copy the full set",
      "Color-coded by type for fast triage",
    ],
    to: "/tools/tag-generator",
    color: "bg-lime-600",
  },
  {
    category: "optimization",
    icon: LineChart,
    title: "SEO Analyzer",
    desc: "Rank #1 in YouTube search with AI-powered keyword research, tag suggestions, and metadata audits.",
    bullets: [
      "Keyword volume, difficulty, and competition scoring",
      "Auto-generated tag clouds per video",
      "Title + description + tag SEO audit with grades",
      "Search intent classification (info, transactional, etc.)",
      "Trend tracking for emerging niche keywords",
    ],
    to: "/tools/seo-analyzer",
    color: "bg-indigo-600",
  },
  {
    category: "optimization",
    icon: Calculator,
    title: "Earnings Calculator",
    desc: "Estimate your monthly YouTube revenue based on RPM, CPM, and view volume across niches.",
    bullets: [
      "Niche-specific RPM benchmarks (finance, tech, gaming, etc.)",
      "Geographic CPM weighting (US, UK, IN, others)",
      "Long-form vs Shorts revenue split",
      "Annual projection with seasonal adjustments",
      "Sponsorship and AdSense breakdown",
    ],
    to: "/tools/earnings-calculator",
    color: "bg-teal-600",
  },
  {
    category: "optimization",
    icon: FileText,
    title: "AI Transcript & Translation",
    desc: "Transcribe and translate any video into 100+ languages with timestamp accuracy.",
    bullets: [
      "99.4% transcription accuracy on clear audio",
      "100+ target languages with native-quality translation",
      "Timestamped SRT, VTT, and TXT export",
      "Auto-generated chapters and key moments",
      "Speaker diarization for multi-host channels",
    ],
    to: "/tools/ai-transcript",
    color: "bg-cyan-600",
  },

  // Production Suite
  {
    category: "production",
    icon: Boxes,
    title: "Bulk Generation",
    desc: "Generate 50-500 titles, scripts, or thumbnails in one batch — perfect for agencies and networks.",
    bullets: [
      "CSV input for batch processing",
      "Up to 500 generations per job",
      "Parallel processing for sub-minute turnaround",
      "Background queue with email notifications",
      "Pro and Enterprise plans only",
    ],
    color: "bg-rose-600",
    badge: "Pro",
  },
  {
    category: "production",
    icon: Users,
    title: "Team Workspaces",
    desc: "Invite teammates, share projects, and manage permissions for multi-channel content teams.",
    bullets: [
      "5 seats on Pro, unlimited on Enterprise",
      "Role-based access (admin, editor, viewer)",
      "Shared swipe files and brand voice libraries",
      "Activity log per workspace",
      "SSO and SAML support (Enterprise)",
    ],
    color: "bg-violet-600",
  },
  {
    category: "production",
    icon: Palette,
    title: "Custom Brand Voice",
    desc: "Train YTForge's models on your past 50+ scripts so every output matches your unique tone.",
    bullets: [
      "Fine-tunes on your own content corpus",
      "Per-channel voice profiles (multi-brand support)",
      "Tone calibration sliders (formal ↔ casual, etc.)",
      "Vocabulary and phrase exclusion lists",
      "Available on Pro and Enterprise plans",
    ],
    color: "bg-fuchsia-600",
    badge: "Pro",
  },
  {
    category: "production",
    icon: Code2,
    title: "API Access",
    desc: "Plug YTForge into your own dashboards, CMS, or automation flows via our REST API.",
    bullets: [
      "10K requests/month on Pro, unlimited on Enterprise",
      "Every tool exposed as a typed endpoint",
      "Webhooks for async generation jobs",
      "OpenAPI 3.1 spec + auto-generated SDKs",
      "Sandbox environment for testing",
    ],
    color: "bg-slate-700",
    badge: "Pro",
  },
  {
    category: "production",
    icon: GitBranch,
    title: "Version History",
    desc: "Every generation is auto-saved with full diffs — restore any past output in one click.",
    bullets: [
      "Unlimited history on all paid plans",
      "Side-by-side diff viewer",
      "One-click restore to any past version",
      "Tag and pin favorite outputs",
      "Export full history as JSON or CSV",
    ],
    color: "bg-stone-700",
  },

  // Platform
  {
    category: "platform",
    icon: Shield,
    title: "Enterprise-Grade Security",
    desc: "Bank-level encryption, SOC 2 Type II certification, and GDPR compliance for every customer.",
    bullets: [
      "TLS 1.3 in transit, AES-256 at rest",
      "SOC 2 Type II audited annually",
      "GDPR + CCPA compliant",
      "Zero-knowledge architecture for private content",
      "We never train models on your data",
    ],
    color: "bg-emerald-700",
  },
  {
    category: "platform",
    icon: Cloud,
    title: "99.99% Uptime SLA",
    desc: "Global edge infrastructure across 14 regions, with auto-failover and 24/7 monitoring.",
    bullets: [
      "14 global regions with edge caching",
      "Auto-failover within 30 seconds",
      "Real-time status page (status.ytforge.app)",
      "99.99% SLA on Enterprise plans",
      "DDoS protection and rate limiting",
    ],
    color: "bg-sky-600",
  },
  {
    category: "platform",
    icon: Smartphone,
    title: "Mobile-Optimized",
    desc: "Generate, preview, and edit on any phone or tablet — no app required.",
    bullets: [
      "Responsive design across all 11 tools",
      "Offline-capable PWA install",
      "Touch-optimized editors and previews",
      "iOS and Android native apps in Q3 2026",
      "Works in any modern browser",
    ],
    color: "bg-amber-600",
  },
  {
    category: "platform",
    icon: Cpu,
    title: "Fast AI Inference",
    desc: "Sub-2-second generation across every tool, powered by custom-trained YouTube-specific models.",
    bullets: [
      "Avg 1.4s per title batch (10 titles)",
      "Avg 8s per 1,000-word script",
      "Avg 12s per thumbnail batch (4 variants)",
      "GPU-accelerated edge inference",
      "Streaming output for long-form scripts",
    ],
    color: "bg-zinc-700",
  },
  {
    category: "platform",
    icon: Bell,
    title: "Real-Time Alerts",
    desc: "Get notified when competitors post, monetization status changes, or your videos hit performance milestones.",
    bullets: [
      "Email + push notification channels",
      "Per-channel and per-keyword alert rules",
      "Slack and Discord integrations",
      "Daily, weekly, or instant digest options",
      "Alert history with full audit trail",
    ],
    color: "bg-lime-700",
    badge: "Pro",
  },
];

const techStack = [
  { icon: Brain, label: "Custom-trained AI models on 4.2M viral videos" },
  { icon: Database, label: "Real-time YouTube CDN integration" },
  { icon: Cloud, label: "Edge inference across 14 global regions" },
  { icon: Lock, label: "Zero-knowledge architecture for private content" },
  { icon: Activity, label: "Weekly model retraining on fresh viral data" },
  { icon: Gauge, label: "Sub-2s generation, p95 across all tools" },
];

const integrations = [
  "YouTube Data API v3",
  "Google Analytics 4",
  "TubeBuddy",
  "VidIQ",
  "Notion",
  "Slack",
  "Discord",
  "Zapier",
  "Make (Integromat)",
  "Google Sheets",
  "Airtable",
  "Webflow",
];

const compareRows = [
  { label: "AI title generation", us: true, theirs: "Limited" },
  { label: "AI long-form script writer", us: true, theirs: false },
  { label: "AI thumbnail generation", us: true, theirs: false },
  { label: "Niche-specific model training", us: true, theirs: false },
  { label: "Channel analytics", us: true, theirs: true },
  { label: "Bulk generation", us: true, theirs: false },
  { label: "Custom brand voice", us: true, theirs: false },
  { label: "API access", us: true, theirs: "Enterprise only" },
  { label: "Team workspaces", us: true, theirs: "Pro+" },
  { label: "100+ language transcripts", us: true, theirs: "Limited" },
  { label: "Starting price", us: "Free", theirs: "$29/mo" },
];

const faqs = [
  { q: "How are YTForge's AI features different from ChatGPT or Gemini?", a: "Generic models like ChatGPT are trained on general web data and don't understand YouTube-specific signals like CTR, AVD, or niche RPMs. YTForge's models are trained exclusively on 4.2M viral YouTube videos and updated weekly with the freshest performance data — every output is tuned for the YouTube algorithm in 2026, not for being a helpful chatbot." },
  { q: "Do all features work for non-English channels?", a: "Yes. Every generation tool supports 40+ source languages out of the box, and the AI Transcript tool translates into 100+ target languages. Niche-specific models cover non-English markets including Spanish, Portuguese, Hindi, German, French, Japanese, and Korean." },
  { q: "Which features are included in the Free plan?", a: "Free plan includes 5 AI title generations/day, 3 thumbnail downloads/day, basic SEO analyzer, unlimited Channel ID Finder, and unlimited Thumbnail Downloader. Upgrade to Creator ($19/mo) for unlimited everything plus the AI Script Writer and Channel Analytics." },
  { q: "Can I integrate YTForge with my existing tools?", a: "Yes — Pro and Enterprise plans include full REST API access, webhooks, and pre-built integrations for Slack, Discord, Zapier, Make, Notion, Google Sheets, and Airtable. Enterprise customers get custom integration support." },
  { q: "How often are new features released?", a: "Major features ship monthly, model retraining happens weekly, and bug fixes ship continuously. Pro and Enterprise customers get early access to new features at least 2 weeks before public release." },
  { q: "Do you offer custom features for enterprise customers?", a: "Yes — Enterprise plans include custom AI model fine-tuning on your channel network's data, white-label exports, dedicated account managers, custom SLAs, and on-prem deployment options. Contact sales for a tailored quote." },
];

export default function FeaturesPage() {
  const [activeCat, setActiveCat] = useState("ai");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const visible = features.filter((f) => f.category === activeCat);

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
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-24 md:py-28 relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-xs font-black tracking-wider uppercase mb-6 border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)]">
              <Boxes className="w-3.5 h-3.5 text-red-500" /> 30+ Features · 11 Tools · One Platform
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mb-5 [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              Every feature you need.<br />Nothing you don't.
            </h1>
            <p className="text-base sm:text-xl text-red-50 max-w-3xl mx-auto leading-relaxed mb-8">
              The complete YTForge feature set — from AI generation to deep analytics, from bulk workflows to enterprise security. Every tool purpose-built for the YouTube algorithm in 2026.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
              {heroStats.map((s) => (
                <div key={s.label} className="bg-white border-2 border-black rounded-xl p-3 sm:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <s.icon className="w-4 h-4 text-red-600 mx-auto mb-1.5" />
                  <div className="font-black text-lg sm:text-2xl">{s.value}</div>
                  <div className="text-[10px] sm:text-xs text-neutral-500 font-bold">{s.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY TABS */}
      <section className="sticky top-16 sm:top-18 z-30 bg-white border-b-2 border-black">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-2 overflow-x-auto py-3 scrollbar-thin">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border-2 text-xs sm:text-sm font-black uppercase tracking-wider whitespace-nowrap transition-all shrink-0 ${
                  activeCat === c.id
                    ? "bg-red-600 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
                    : "bg-white text-black border-black hover:bg-neutral-100"
                }`}
              >
                <c.icon className="w-3.5 h-3.5" /> {c.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURE GRID */}
      <section className="bg-neutral-50 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCat}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-5"
            >
              {visible.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-white border-2 border-black rounded-2xl p-6 sm:p-7 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-1 transition-all relative"
                >
                  {f.badge && (
                    <div className="absolute -top-3 right-5 px-2.5 py-0.5 text-[10px] font-black tracking-wider uppercase rounded-full border-2 border-black bg-yellow-300 text-black">
                      {f.badge}
                    </div>
                  )}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-12 h-12 rounded-xl ${f.color} text-white flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0`}>
                      <f.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-black text-xl mb-1">{f.title}</div>
                      <p className="text-sm text-neutral-600 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-5">
                    {f.bullets.map((b) => (
                      <li key={b} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" strokeWidth={3} />
                        <span className="text-neutral-800 leading-snug">{b}</span>
                      </li>
                    ))}
                  </ul>

                  {f.to && (
                    <Link
                      href={f.to}
                      className="inline-flex items-center gap-1.5 text-sm font-black text-red-600 hover:text-black transition-colors"
                    >
                      Try it free <ArrowRight className="w-4 h-4" />
                    </Link>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* TECH STACK */}
      <section className="bg-black py-16 sm:py-24 border-y-2 border-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(220,38,38,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(220,38,38,0.12)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider mb-4">
              <Cpu className="w-3 h-3" /> Powered By
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">The most advanced YouTube AI stack on the planet</h2>
            <p className="text-sm sm:text-lg text-neutral-400">Custom models, edge inference, weekly retraining — no off-the-shelf shortcuts.</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {techStack.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white/5 backdrop-blur border-2 border-white/20 rounded-xl p-5 flex items-start gap-3 hover:border-red-600 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center border-2 border-black shrink-0">
                  <s.icon className="w-4 h-4" />
                </div>
                <p className="text-sm text-white leading-relaxed font-bold">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INTEGRATIONS */}
      <section className="bg-white py-16 sm:py-24 border-b-2 border-black">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-300 text-black text-[10px] font-black uppercase tracking-wider mb-4 border-2 border-black">
              <RefreshCw className="w-3 h-3" /> Plays Nicely With
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">12+ native integrations</h2>
            <p className="text-sm sm:text-lg text-neutral-600">Plug YTForge into the tools you already use, no glue code required.</p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-4xl mx-auto">
            {integrations.map((tool) => (
              <div
                key={tool}
                className="bg-white border-2 border-black rounded-xl p-4 text-center font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-0.5 transition-all"
              >
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARE TABLE */}
      <section className="bg-neutral-50 py-16 sm:py-24 border-b-2 border-black">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center max-w-3xl mx-auto mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider mb-4">
              <Award className="w-3 h-3 text-red-500" /> YTForge vs Competition
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">More features. Half the price.</h2>
            <p className="text-sm sm:text-lg text-neutral-600">How YTForge compares to the legacy YouTube tooling stack.</p>
          </motion.div>

          <div className="max-w-3xl mx-auto bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="grid grid-cols-3 bg-black text-white">
              <div className="p-4 font-black text-sm">Feature</div>
              <div className="p-4 font-black text-sm text-center bg-red-600">YTForge</div>
              <div className="p-4 font-black text-sm text-center">Legacy Tools</div>
            </div>
            {compareRows.map((row, i) => (
              <div key={row.label} className={`grid grid-cols-3 ${i % 2 === 0 ? "bg-neutral-50" : "bg-white"} border-t-2 border-black`}>
                <div className="p-4 font-bold text-xs sm:text-sm">{row.label}</div>
                <div className="p-4 flex items-center justify-center bg-red-50">
                  {row.us === true ? (
                    <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
                  ) : (
                    <span className="font-black text-sm">{row.us}</span>
                  )}
                </div>
                <div className="p-4 flex items-center justify-center">
                  {row.theirs === true ? (
                    <Check className="w-5 h-5 text-green-600" strokeWidth={3} />
                  ) : row.theirs === false ? (
                    <span className="text-neutral-300 text-2xl font-black">×</span>
                  ) : (
                    <span className="font-bold text-xs sm:text-sm text-neutral-500">{row.theirs}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECURITY HIGHLIGHT */}
      <section className="bg-white py-16 sm:py-24 border-b-2 border-black">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-600 text-white text-[10px] font-black uppercase tracking-wider mb-4">
                <Shield className="w-3 h-3" /> Trust & Security
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">Your content. Your data. Your IP.</h2>
              <p className="text-base text-neutral-700 leading-relaxed mb-6">YTForge is built for creators who treat their channel as a real business. We handle your scripts, channel data, and analytics with the same rigor as a Fortune 500 SaaS — encrypted in transit and at rest, audited annually, and never used to train our public models.</p>
              <ul className="space-y-3">
                {[
                  "TLS 1.3 encryption in transit",
                  "AES-256 encryption at rest",
                  "SOC 2 Type II certified",
                  "GDPR + CCPA compliant",
                  "Zero-knowledge architecture",
                  "We never train on your private content",
                ].map((s) => (
                  <li key={s} className="flex items-start gap-2 text-sm font-bold">
                    <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" strokeWidth={3} />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="relative">
              <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 border-2 border-black rounded-2xl p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
                <div className="relative">
                  <Lock className="w-12 h-12 mb-5" />
                  <div className="font-black text-3xl mb-2">SOC 2 Type II</div>
                  <p className="text-emerald-50 text-sm leading-relaxed mb-6">Audited annually by an independent third-party auditor. Full report available upon request.</p>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-white/10 backdrop-blur border-2 border-white/20 rounded-xl p-3 text-center">
                      <div className="font-black text-xl">99.99%</div>
                      <div className="text-[10px] text-emerald-100 font-bold uppercase">Uptime</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur border-2 border-white/20 rounded-xl p-3 text-center">
                      <div className="font-black text-xl">14</div>
                      <div className="text-[10px] text-emerald-100 font-bold uppercase">Regions</div>
                    </div>
                    <div className="bg-white/10 backdrop-blur border-2 border-white/20 rounded-xl p-3 text-center">
                      <div className="font-black text-xl">24/7</div>
                      <div className="text-[10px] text-emerald-100 font-bold uppercase">Monitor</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-neutral-50 py-16 sm:py-24 border-b-2 border-black">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider mb-4">
              <Lightbulb className="w-3 h-3" /> Feature FAQ
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">Common questions</h2>
            <p className="text-sm sm:text-base text-neutral-600">Need a deeper dive? Check our <Link href="/demo" className="text-red-600 font-black underline">interactive demo</Link> or <Link href="/pricing" className="text-red-600 font-black underline">pricing page</Link>.</p>
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
              <Crown className="w-3.5 h-3.5 text-red-500" /> Every Feature, One Price
            </div>
            <h2 className="text-3xl sm:text-6xl font-black tracking-tight text-white mb-5 [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              Try every feature.<br />Free for 7 days.
            </h2>
            <p className="text-base sm:text-xl text-red-50 mb-8 leading-relaxed max-w-2xl mx-auto">
              Full access to all 30+ features. No credit card. Cancel anytime. 30-day money-back guarantee.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/pricing" className="inline-flex items-center gap-2 px-7 py-4 bg-white text-black font-black rounded-xl border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider text-sm sm:text-base">
                <Rocket className="w-5 h-5" /> Start Free Trial <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/demo" className="inline-flex items-center gap-2 px-7 py-4 bg-black text-white font-black rounded-xl border-2 border-black hover:bg-neutral-900 transition-all uppercase tracking-wider text-sm sm:text-base">
                <PlayCircle className="w-5 h-5" /> See Live Demo
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
