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
  Layers,
  Brain,
  Target,
  Rocket,
  Lock,
  Users,
  Cpu,
  Database,
  Cloud,
  Palette,
  Headphones,
  RefreshCw,
  Workflow as WorkflowIcon,
  Lightbulb,
  Search,
  Eye,
  MousePointer2,
  ChevronDown,
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
  Wand2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { getLocalePath } from "@/lib/i18n/utils";
import type { Locale } from "@/lib/i18n/config";

const HERO_ICONS = [Wand2, Languages, Database, Zap];

const CATEGORY_ICONS = [Brain, BarChart3, Target, Layers, Shield];

type FeatureMeta = {
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  to?: string;
  color: string;
};

const FEATURE_META: FeatureMeta[] = [
  { category: "ai", icon: TrendingUp, to: "/tools/viral-title-generator", color: "bg-red-600" },
  { category: "ai", icon: PenTool, to: "/tools/ai-script-writer", color: "bg-black" },
  { category: "ai", icon: Video, to: "/tools/shorts-ideas", color: "bg-orange-600" },
  { category: "research", icon: BarChart3, to: "/tools/channel-analytics", color: "bg-blue-600" },
  { category: "research", icon: Hash, to: "/tools/channel-id-finder", color: "bg-purple-600" },
  { category: "research", icon: Download, to: "/tools/thumbnail-downloader", color: "bg-pink-600" },
  { category: "research", icon: ImageIcon, to: "/tools/thumbnail-preview", color: "bg-rose-600" },
  { category: "production", icon: Code2, to: "/tools/embed-generator", color: "bg-slate-700" },
  { category: "production", icon: QrCode, to: "/tools/qr-code-generator", color: "bg-red-600" },
  { category: "research", icon: DollarSign, to: "/tools/monetization-checker", color: "bg-green-600" },
  { category: "optimization", icon: Hash, to: "/tools/hashtag-generator", color: "bg-teal-600" },
  { category: "optimization", icon: TagIcon, to: "/tools/tag-generator", color: "bg-lime-600" },
  { category: "optimization", icon: LineChart, to: "/tools/seo-analyzer", color: "bg-indigo-600" },
  { category: "optimization", icon: Calculator, to: "/tools/earnings-calculator", color: "bg-teal-600" },
  { category: "optimization", icon: FileText, to: "/tools/ai-transcript", color: "bg-cyan-600" },
  { category: "production", icon: Boxes, color: "bg-rose-600" },
  { category: "production", icon: Users, color: "bg-violet-600" },
  { category: "production", icon: Palette, color: "bg-fuchsia-600" },
  { category: "production", icon: Code2, color: "bg-slate-700" },
  { category: "production", icon: GitBranch, color: "bg-stone-700" },
  { category: "platform", icon: Shield, color: "bg-emerald-700" },
  { category: "platform", icon: Cloud, color: "bg-sky-600" },
  { category: "platform", icon: Smartphone, color: "bg-amber-600" },
  { category: "platform", icon: Cpu, color: "bg-zinc-700" },
  { category: "platform", icon: Bell, color: "bg-lime-700" },
];

const TECH_ICONS = [Brain, Database, Cloud, Lock, Activity, Gauge];

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

export default function FeaturesPage() {
  const [activeCat, setActiveCat] = useState("ai");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { t } = useTranslations();
  const { locale } = useLocale();

  const heroStats = t("featuresPage.heroStats").map((s, i) => ({ ...s, icon: HERO_ICONS[i] }));
  const categories = t("featuresPage.categories").map((label, i) => ({ id: ["ai", "research", "optimization", "production", "platform"][i], label, icon: CATEGORY_ICONS[i] }));
  const features = t("featuresPage.features").map((f, i) => ({ ...FEATURE_META[i], ...f }));
  const techStack = t("featuresPage.techStack").map((label, i) => ({ label, icon: TECH_ICONS[i] }));
  const compareRows = t("featuresPage.compareRows");
  const faqs = t("featuresPage.faqs");
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
              <Boxes className="w-3.5 h-3.5 text-red-500" /> {t("featuresPage.heroBadge")}
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mb-5 [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              {t("featuresPage.heroTitle1")}<br />{t("featuresPage.heroTitle2")}
            </h1>
            <p className="text-base sm:text-xl text-red-50 max-w-3xl mx-auto leading-relaxed mb-8">
              {t("featuresPage.heroDesc")}
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
                      href={getLocalePath(locale, f.to)}
                      className="inline-flex items-center gap-1.5 text-sm font-black text-red-600 hover:text-black transition-colors"
                    >
                      {t("featuresPage.tryItFree")} <ArrowRight className="w-4 h-4" />
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
              <Cpu className="w-3 h-3" /> {t("featuresPage.techBadge")}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">{t("featuresPage.techTitle")}</h2>
            <p className="text-sm sm:text-lg text-neutral-400">{t("featuresPage.techDesc")}</p>
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
              <RefreshCw className="w-3 h-3" /> {t("featuresPage.intBadge")}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">{t("featuresPage.intTitle")}</h2>
            <p className="text-sm sm:text-lg text-neutral-600">{t("featuresPage.intDesc")}</p>
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
              <Award className="w-3 h-3 text-red-500" /> {t("featuresPage.compareBadge")}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">{t("featuresPage.compareTitle")}</h2>
            <p className="text-sm sm:text-lg text-neutral-600">{t("featuresPage.compareDesc")}</p>
          </motion.div>

          <div className="max-w-3xl mx-auto bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
            <div className="grid grid-cols-3 bg-black text-white">
              <div className="p-4 font-black text-sm">{t("featuresPage.compareFeatureCol")}</div>
              <div className="p-4 font-black text-sm text-center bg-red-600">YTForge</div>
              <div className="p-4 font-black text-sm text-center">{t("featuresPage.compareTheirs")}</div>
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
                <Shield className="w-3 h-3" /> {t("featuresPage.securityBadge")}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight mb-4">{t("featuresPage.securityTitle")}</h2>
              <p className="text-base text-neutral-700 leading-relaxed mb-6">{t("featuresPage.securityDesc")}</p>
              <ul className="space-y-3">
                {t("featuresPage.securityList").map((s) => (
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
                  <div className="font-black text-3xl mb-2">{t("featuresPage.soc2Title")}</div>
                  <p className="text-emerald-50 text-sm leading-relaxed mb-6">{t("featuresPage.soc2Desc")}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {t("featuresPage.soc2Metrics").map((m) => (
                      <div key={m.label} className="bg-white/10 backdrop-blur border-2 border-white/20 rounded-xl p-3 text-center">
                        <div className="font-black text-xl">{m.value}</div>
                        <div className="text-[10px] text-emerald-100 font-bold uppercase">{m.label}</div>
                      </div>
                    ))}
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
              <Lightbulb className="w-3 h-3" /> {t("featuresPage.faqBadge")}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">{t("featuresPage.faqTitle")}</h2>
            <p className="text-sm sm:text-base text-neutral-600">{renderFaqDesc(t("featuresPage.faqDesc"), locale, t)}</p>
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
              <Crown className="w-3.5 h-3.5 text-red-500" /> {t("featuresPage.finalBadge")}
            </div>
            <h2 className="text-3xl sm:text-6xl font-black tracking-tight text-white mb-5 [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              {t("featuresPage.finalTitle1")}<br />{t("featuresPage.finalTitle2")}
            </h2>
            <p className="text-base sm:text-xl text-red-50 mb-8 leading-relaxed max-w-2xl mx-auto">
              {t("featuresPage.finalDesc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={getLocalePath(locale, "/pricing")} className="inline-flex items-center gap-2 px-7 py-4 bg-white text-black font-black rounded-xl border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider text-sm sm:text-base">
                <Rocket className="w-5 h-5" /> {t("featuresPage.startFreeTrial")} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href={getLocalePath(locale, "/demo")} className="inline-flex items-center gap-2 px-7 py-4 bg-black text-white font-black rounded-xl border-2 border-black hover:bg-neutral-900 transition-all uppercase tracking-wider text-sm sm:text-base">
                <PlayCircle className="w-5 h-5" /> {t("featuresPage.seeLiveDemo")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <FeaturesSeoJsonLd
        featureNames={features.map((f) => f.title)}
        faqs={faqs}
        home={t("featuresPage.homeCrumb")}
        featuresCrumb={t("featuresPage.featuresCrumb")}
      />
    </div>
  );
}

function renderFaqDesc(text: string, locale: Locale, t: (k: string) => any) {
  const demoParts = text.split("{{demo}}");
  if (demoParts.length > 1) {
    const pricingParts = demoParts[1].split("{{pricing}}");
    return (
      <>
        {demoParts[0]}
        <Link href={getLocalePath(locale, "/demo")} className="text-red-600 font-black underline">{t("nav.demo")}</Link>
        {pricingParts[0]}
        <Link href={getLocalePath(locale, "/pricing")} className="text-red-600 font-black underline">{t("nav.pricing")}</Link>
        {pricingParts[1]}
      </>
    );
  }
  return text;
}

function FeaturesSeoJsonLd({ featureNames, faqs, home, featuresCrumb }: { featureNames: string[]; faqs: { q: string; a: string }[]; home: string; featuresCrumb: string }) {
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "YTForge Features — YouTube Creator Toolkit",
    itemListElement: featureNames.slice(0, 10).map((name, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name,
      url: `https://ytforge.app/tools/${["viral-title-generator", "ai-script-writer", "ai-thumbnail-generator", "seo-analyzer", "channel-analytics", "tag-generator", "hashtag-generator", "monetization-checker", "earnings-calculator", "thumbnail-downloader"][i]}`,
    })),
  };
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  const bc = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: home, item: "https://ytforge.app/" },
      { "@type": "ListItem", position: 2, name: featuresCrumb, item: "https://ytforge.app/features" },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
    </>
  );
}
