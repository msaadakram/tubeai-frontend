"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  Sparkles,
  PenLine,
  Search,
  Type,
  FileText,
  Lightbulb,
  Image as ImageIcon,
  Download,
  Calculator,
  BarChart3,
  Hash,
  ShieldCheck,
  Crown,
  ArrowRight,
  ArrowUpRight,
  Rocket,
  TrendingUp,
  Zap,
  Clock,
  CheckCircle2,
  PlayCircle,
  Users,
  MessageCircle,
  BookOpen,
  Gift,
  LogOut,
  Settings,
  CreditCard,
  ChevronRight,
  Activity,
  Target,
  Trophy,
  HeartHandshake,
  Tag as TagIcon,
  Code2,
  QrCode,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth, authFetch } from "@/lib/auth";

const tools = [
  { name: "AI Chat Coach", desc: "Ask anything, get streamed advice", href: "/chat", icon: MessageCircle, color: "bg-red-100 text-red-700" },
  { name: "Monetization Checker", desc: "Verify YPP eligibility instantly", href: "/tools/monetization-checker", icon: ShieldCheck, color: "bg-emerald-100 text-emerald-700" },
  { name: "AI Script Writer", desc: "Hook → CTA in seconds", href: "/tools/ai-script-writer", icon: PenLine, color: "bg-rose-100 text-rose-700" },
  { name: "SEO Analyzer", desc: "Score titles, tags & description", href: "/tools/seo-analyzer", icon: Search, color: "bg-blue-100 text-blue-700" },
  { name: "Viral Title Generator", desc: "20 click-worthy titles", href: "/tools/viral-title-generator", icon: Type, color: "bg-yellow-100 text-yellow-700" },
  { name: "AI Transcript", desc: "Multi-language transcripts", href: "/tools/ai-transcript", icon: FileText, color: "bg-purple-100 text-purple-700" },
  { name: "AI Short Video Creator", desc: "Viral 60s Shorts", href: "/tools/shorts-ideas", icon: Lightbulb, color: "bg-orange-100 text-orange-700", upgrade: true },
  { name: "Thumbnail Downloader", desc: "Pull HD thumbs from any video", href: "/tools/thumbnail-downloader", icon: Download, color: "bg-cyan-100 text-cyan-700" },
  { name: "Thumbnail Preview", desc: "All sizes + device mockups", href: "/tools/thumbnail-preview", icon: ImageIcon, color: "bg-pink-100 text-pink-700" },
  { name: "Embed Generator", desc: "Custom iframe with live preview", href: "/tools/embed-generator", icon: Code2, color: "bg-slate-100 text-slate-700" },
  { name: "Earnings Calculator", desc: "Estimate AdSense revenue", href: "/tools/earnings-calculator", icon: Calculator, color: "bg-green-100 text-green-700" },
  { name: "Channel Analytics", desc: "Deep channel insights", href: "/tools/channel-analytics", icon: BarChart3, color: "bg-indigo-100 text-indigo-700" },
  { name: "Channel ID Finder", desc: "Find ID, RSS & handle", href: "/tools/channel-id-finder", icon: Hash, color: "bg-fuchsia-100 text-fuchsia-700" },
  { name: "AI Thumbnail Generator", desc: "Studio-grade AI thumbnails", href: "/tools/ai-thumbnail-generator", icon: ImageIcon, color: "bg-amber-100 text-amber-700", upgrade: true },
  { name: "Hashtag Generator", desc: "30+ trending #hashtags", href: "/tools/hashtag-generator", icon: Hash, color: "bg-teal-100 text-teal-700" },
  { name: "Tag Generator", desc: "40+ SEO-ranked video tags", href: "/tools/tag-generator", icon: TagIcon, color: "bg-lime-100 text-lime-700" },
  { name: "QR Code Generator", desc: "QR codes for any YouTube link", href: "/tools/qr-code-generator", icon: QrCode, color: "bg-red-100 text-red-700" },
];

const planMeta: Record<string, { label: string; color: string; cap: string; perks: string[] }> = {
  free: {
    label: "Free",
    color: "bg-neutral-200 text-black",
    cap: "10 generations / month",
    perks: ["Basic AI tools", "Community support", "Limited exports"],
  },
  pro: {
    label: "Pro",
    color: "bg-red-600 text-white",
    cap: "Unlimited generations",
    perks: ["All 10 tools", "Priority queue", "HD exports", "API access", "Priority chat"],
  },
  enterprise: {
    label: "Enterprise",
    color: "bg-black text-white",
    cap: "Custom volume",
    perks: ["Unlimited seats", "Dedicated CSM", "SSO + SAML", "Custom SLAs"],
  },
};

const TOOL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  titles: Type,
  tags: TagIcon,
  hashtags: Hash,
  script: PenLine,
  seo: Search,
  chat: MessageCircle,
};

type Stats = {
  generations: number;
  toolsUsed: number;
  daysActive: number;
  byTool: Record<string, number>;
  lastActiveAt: string | null;
  streak: number;
};

type ActivityItem = {
  id: string;
  tool: string;
  toolLabel: string;
  action: string;
  createdAt: string;
};

function relTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const m = Math.round(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.round(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

const community = [
  { t: "Join Discord", d: "12,400 creators sharing wins", icon: MessageCircle, href: "#", color: "bg-indigo-600 text-white" },
  { t: "Creator Academy", d: "Free 4-hour growth course", icon: BookOpen, href: "#", color: "bg-emerald-600 text-white" },
  { t: "Refer a friend", d: "Both get 1 month free", icon: Gift, href: "#", color: "bg-pink-600 text-white" },
  { t: "Ambassador Program", d: "Earn 30% lifetime commission", icon: Trophy, href: "#", color: "bg-yellow-400 text-black" },
];

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const [stats, setStats] = useState<Stats | null>(null);
  const [activity, setActivity] = useState<ActivityItem[]>([]);
  const [loadingDash, setLoadingDash] = useState(true);

  useEffect(() => {
    if (!user) {
      router.replace("/signin");
      return;
    }
    let cancelled = false;
    setLoadingDash(true);
    Promise.all([
      authFetch<{ stats: Stats }>("/api/stats").catch(() => null),
      authFetch<{ activity: ActivityItem[] }>("/api/activity?limit=8").catch(() => null),
    ]).then(([s, a]) => {
      if (cancelled) return;
      if (s?.stats) setStats(s.stats);
      if (a?.activity) setActivity(a.activity);
      setLoadingDash(false);
    });
    return () => {
      cancelled = true;
    };
  }, [user, router]);

  if (!user) return null;

  const meta = planMeta[user.plan] || planMeta.free;
  const canUpgrade = user.plan === "free";

  const usageStats = [
    { label: "AI generations", value: stats ? String(stats.generations) : "—", change: stats && stats.generations > 0 ? "all time" : "start creating", icon: Sparkles, color: "text-red-600" },
    { label: "Tools used", value: stats ? `${stats.toolsUsed} / 6` : "—", change: stats && stats.toolsUsed < 6 ? `${6 - stats.toolsUsed} to explore` : "all tools tried", icon: Zap, color: "text-yellow-600" },
    { label: "Days active", value: stats ? String(stats.daysActive) : "—", change: stats && stats.streak > 0 ? `🔥 ${stats.streak}-day streak` : "keep going", icon: Activity, color: "text-emerald-600" },
    { label: "Last active", value: stats?.lastActiveAt ? relTime(stats.lastActiveAt) : "—", change: stats?.lastActiveAt ? "most recent" : "no activity yet", icon: Clock, color: "text-blue-600" },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      {/* ─── HERO ─── */}
      <section className="relative bg-red-600 border-b-4 border-black overflow-hidden pt-24 sm:pt-28 pb-12 sm:pb-16">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.18)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_30%,#000_30%,transparent_100%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col lg:grid lg:grid-cols-3 gap-4 sm:gap-6"
          >
            {/* Profile card */}
            <div className="lg:col-span-2 bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6 md:p-8">
              {/* Top row: avatar + info + action buttons */}
              <div className="flex items-start gap-3 sm:gap-5">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5 mb-1">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border-2 border-black ${meta.color}`}>
                      <Crown className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> {meta.label}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-wider border-2 border-black bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> Active
                    </span>
                  </div>
                  <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-tight leading-tight">
                    Welcome back, {user.name.split(" ")[0]} 👋
                  </h1>
                  <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5 truncate">{user.email}</p>
                </div>
              </div>

              {/* Action buttons — full-width row on mobile */}
              <div className="flex gap-2 mt-4 sm:mt-0 sm:absolute sm:top-6 sm:right-6 sm:flex-col">
                {canUpgrade && (
                  <Link
                    href="/pricing"
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-yellow-300 border-2 border-black rounded-lg font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  >
                    <Rocket className="w-3.5 h-3.5" /> Upgrade
                  </Link>
                )}
                <button
                  onClick={() => { signOut(); router.push("/"); }}
                  className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-3 sm:px-4 py-2 bg-white border-2 border-black rounded-lg font-black text-xs uppercase tracking-wider hover:bg-black hover:text-white transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" /> Sign out
                </button>
              </div>

              {/* Plan perks + quota */}
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t-2 border-dashed border-neutral-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">Plan includes</div>
                  <ul className="space-y-1.5">
                    {meta.perks.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-2">Quota</div>
                  <div className="bg-neutral-50 border-2 border-black rounded-xl p-3 sm:p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-black text-xs sm:text-sm">{meta.cap}</span>
                      <Sparkles className="w-4 h-4 text-red-600" />
                    </div>
                    <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-red-600 to-red-400"
                        style={{ width: user.plan === "free" ? "65%" : "24%" }}
                      />
                    </div>
                    <div className="text-[10px] font-bold text-neutral-500 mt-1.5">
                      {user.plan === "free" ? "6.5 / 10 generations used" : "Refreshes monthly · Plenty of headroom"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Goal card */}
            <GoalCard goal={user.goal} loading={loadingDash} />
          </motion.div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 sm:space-y-12">

        {/* ─── STATS ─── */}
        <section>
          <div className="flex items-end justify-between mb-4 sm:mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">Your stats</h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">Last 30 days</p>
            </div>
            <Link
              href="/tools/channel-analytics"
              className="inline-flex items-center gap-1 text-xs font-black text-red-600 hover:text-black"
            >
              Analytics <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {usageStats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white border-2 border-black rounded-xl sm:rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-5 hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] transition-all"
              >
                <s.icon className={`w-4 h-4 sm:w-5 sm:h-5 mb-2 sm:mb-3 ${s.color}`} />
                <div className="text-xl sm:text-3xl font-black tracking-tight leading-none">
                  {loadingDash ? <span className="inline-block w-10 h-5 rounded bg-neutral-200 animate-pulse align-middle" /> : s.value}
                </div>
                <div className="text-[10px] sm:text-xs font-bold text-neutral-700 mt-0.5">{s.label}</div>
                <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-400 mt-1.5">{s.change}</div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── TOOLS GRID ─── */}
        <section>
          <div className="flex items-end justify-between mb-4 sm:mb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">Your toolkit</h2>
              <p className="text-xs sm:text-sm text-neutral-500 font-medium">All tools, ready to launch</p>
            </div>
            <Link
              href="/features"
              className="inline-flex items-center gap-1 text-xs font-black text-red-600 hover:text-black"
            >
              All features <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {tools.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: Math.min(i * 0.03, 0.3) }}
              >
                <Link
                  href={t.href}
                  className="group relative flex items-center gap-3 bg-white border-2 border-black rounded-xl sm:rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-4 hover:shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] sm:hover:shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-300 overflow-hidden min-h-[60px]"
                >
                  {/* Upgrade badge */}
                  {t.upgrade && (
                    <span className="absolute top-2 right-2 inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 border border-black text-[8px] font-black uppercase tracking-wider text-black">
                      <Crown className="w-2 h-2" /> PRO
                    </span>
                  )}

                  {/* Icon */}
                  <div className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl border-2 border-black flex items-center justify-center ${t.color} shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:-rotate-3 transition-transform duration-300`}>
                    <t.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  {/* Text */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="font-black text-sm leading-tight truncate group-hover:text-red-600 transition-colors">{t.name}</div>
                    <div className="text-[10px] sm:text-xs text-neutral-500 font-medium truncate mt-0.5">{t.desc}</div>
                  </div>

                  {/* Arrow */}
                  <span className="shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-lg bg-black text-white border-2 border-black group-hover:bg-red-600 group-hover:rotate-[-45deg] transition-all duration-300">
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ─── RECENT ACTIVITY + QUICK ACTIONS ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Recent activity */}
          <div className="lg:col-span-2 bg-white border-2 border-black rounded-xl sm:rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div>
                <h3 className="text-base sm:text-xl font-black tracking-tight">Recent activity</h3>
                <p className="text-[10px] sm:text-xs text-neutral-500 font-medium">What you've shipped lately</p>
              </div>
              <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 shrink-0" />
            </div>
            <div className="space-y-2 sm:space-y-3">
              {loadingDash ? (
                [0, 1, 2].map((i) => (
                  <div key={i} className="flex items-start gap-3 p-3 bg-neutral-50 border-2 border-black rounded-xl">
                    <div className="w-9 h-9 rounded-lg border-2 border-black bg-white animate-pulse" />
                    <div className="flex-1 space-y-1.5">
                      <div className="h-3 w-1/3 bg-neutral-200 rounded animate-pulse" />
                      <div className="h-2.5 w-2/3 bg-neutral-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))
              ) : activity.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-red-100 border-2 border-black flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="font-black text-sm mb-1">No activity yet</div>
                  <p className="text-xs text-neutral-500 font-medium mb-4 max-w-xs mx-auto">
                    Fire up any tool and your generations will show up here.
                  </p>
                  <Link href="/tools/viral-title-generator" className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform">
                    Try a tool <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ) : (
                activity.map((a) => {
                  const Icon = TOOL_ICONS[a.tool] || Sparkles;
                  return (
                    <div
                      key={a.id}
                      className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 bg-neutral-50 border-2 border-black rounded-xl hover:bg-yellow-50 transition-colors"
                    >
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg border-2 border-black bg-white flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-xs sm:text-sm">{a.toolLabel}</div>
                        <div className="text-[10px] sm:text-xs text-neutral-600 font-medium line-clamp-1 mt-0.5">{a.action}</div>
                      </div>
                      <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-neutral-400 shrink-0 mt-0.5 whitespace-nowrap">
                        {relTime(a.createdAt)}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white border-2 border-black rounded-xl sm:rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-4 sm:p-6">
            <h3 className="text-base sm:text-xl font-black tracking-tight mb-0.5">Quick actions</h3>
            <p className="text-[10px] sm:text-xs text-neutral-500 font-medium mb-4 sm:mb-5">Account shortcuts</p>
            <div className="space-y-2">
              {[
                { i: Settings, t: "Account settings", h: "/settings" },
                { i: CreditCard, t: "Billing & invoices", h: "#" },
                { i: PlayCircle, t: "Watch product demo", h: "/demo" },
                { i: BookOpen, t: "Read our guides", h: "/features" },
                { i: ShieldCheck, t: "Privacy & data", h: "/privacy" },
              ].map((q) => (
                <Link
                  key={q.t}
                  href={q.h}
                  className="flex items-center justify-between p-2.5 sm:p-3 bg-neutral-50 border-2 border-black rounded-xl hover:bg-red-50 hover:border-red-600 transition-colors group"
                >
                  <span className="flex items-center gap-2 sm:gap-2.5 font-black text-xs sm:text-sm">
                    <q.i className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600 shrink-0" /> {q.t}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-neutral-400 group-hover:text-red-600 group-hover:translate-x-0.5 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ─── COMMUNITY ─── */}
        <section>
          <div className="mb-4 sm:mb-5">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">Things to join</h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">Programs, perks, and people that grow with you</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {community.map((c, i) => (
              <motion.a
                key={c.t}
                href={c.href}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`block ${c.color} border-2 border-black rounded-xl sm:rounded-2xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 sm:p-5 hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all`}
              >
                <c.icon className="w-5 h-5 sm:w-6 sm:h-6 mb-2 sm:mb-3" />
                <div className="font-black text-sm sm:text-base tracking-tight mb-0.5 sm:mb-1 leading-tight">{c.t}</div>
                <div className="text-[10px] sm:text-xs font-bold opacity-90 mb-2 sm:mb-3 leading-snug line-clamp-2">{c.d}</div>
                <div className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black">
                  Join <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* ─── UPGRADE CTA ─── */}
        {canUpgrade && (
          <section className="relative bg-black text-white border-2 border-black rounded-2xl sm:rounded-3xl shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] sm:shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] overflow-hidden">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:2.5rem_2.5rem]" />
            <div className="relative p-5 sm:p-8 lg:p-12 grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-300 text-black border-2 border-black text-[10px] font-black uppercase tracking-wider mb-3 sm:mb-4">
                  <Crown className="w-3 h-3" /> Limited offer
                </div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight mb-2 sm:mb-3 leading-tight">
                  Unlock the full toolkit.<br />Save <span className="text-red-500">20%</span> annually.
                </h3>
                <p className="text-neutral-300 text-sm sm:text-base mb-5 sm:mb-6 max-w-md leading-relaxed">
                  Upgrade to Pro and get unlimited generations, priority queue, API access, and dedicated chat support.
                </p>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3 bg-red-600 border-2 border-white rounded-xl font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:bg-white hover:text-red-600 transition-colors"
                  >
                    See plans <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/demo"
                    className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3 bg-white/10 border-2 border-white/30 rounded-xl font-black text-sm uppercase tracking-wider hover:bg-white/20 transition-colors"
                  >
                    Tour features
                  </Link>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                {[
                  { i: Sparkles, t: "Unlimited", d: "AI generations" },
                  { i: Users, t: "5 seats", d: "Team collab" },
                  { i: Zap, t: "Priority", d: "Queue + speed" },
                  { i: HeartHandshake, t: "1:1", d: "Onboarding" },
                ].map((p) => (
                  <div key={p.t} className="bg-white/5 border-2 border-white/20 rounded-xl p-3 sm:p-4 backdrop-blur">
                    <p.i className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 mb-1.5 sm:mb-2" />
                    <div className="font-black text-sm sm:text-base tracking-tight">{p.t}</div>
                    <div className="text-[10px] sm:text-xs text-neutral-300 font-bold">{p.d}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

/* ─── GOAL CARD (reads the user's saved goal, or nudges them to set one) ─── */
function GoalCard({ goal, loading }: { goal: import("@/lib/auth").Goal | undefined; loading: boolean }) {
  if (loading) {
    return (
      <div className="bg-black text-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-red-600/40 blur-3xl" />
        <div className="relative space-y-3">
          <div className="h-5 w-20 bg-white/20 rounded animate-pulse" />
          <div className="h-6 w-3/4 bg-white/20 rounded animate-pulse" />
          <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
          <div className="h-2 w-full bg-white/10 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (!goal || !goal.title) {
    return (
      <div className="bg-black text-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-red-600/40 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-300 text-black border-2 border-black text-[10px] font-black uppercase tracking-wider mb-3">
            <Target className="w-3 h-3" /> Set a goal
          </div>
          <h3 className="text-lg sm:text-xl font-black tracking-tight mb-2">What are you aiming for?</h3>
          <p className="text-xs text-neutral-300 font-medium mb-4 leading-relaxed">
            Set a subscriber, views, or watch-time target and we&apos;ll track your progress here.
          </p>
          <Link
            href="/settings"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-yellow-300 text-black border-2 border-black rounded-lg font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-transform"
          >
            Set a goal <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  const target = Math.max(1, Number(goal.target) || 0);
  const current = Math.max(0, Number(goal.current) || 0);
  const pct = Math.min(100, Math.round((current / target) * 100));
  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : String(n));

  return (
    <div className="bg-black text-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 relative overflow-hidden">
      <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-red-600/40 blur-3xl" />
      <div className="relative">
        <div className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-300 text-black border-2 border-black text-[10px] font-black uppercase tracking-wider mb-3">
          <Target className="w-3 h-3" /> Your Goal
        </div>
        <h3 className="text-lg sm:text-xl font-black tracking-tight mb-2">{goal.title}</h3>
        <p className="text-xs text-neutral-300 font-medium mb-4 leading-relaxed">
          {pct >= 100 ? "Goal smashed. Time to set a bigger one." : `You're ${pct}% there. Ship your next video with YTForge to stay on track.`}
        </p>
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-[11px] font-bold">
            <span className="capitalize">{goal.metric || "Progress"}</span>
            <span>{fmt(current)} / {fmt(target)}</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-300" style={{ width: `${pct}%` }} />
          </div>
        </div>
        <Link
          href="/tools/ai-script-writer"
          className="inline-flex items-center gap-1.5 text-xs font-black text-yellow-300 hover:text-white transition-colors"
        >
          Start next video <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
