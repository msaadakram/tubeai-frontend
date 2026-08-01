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
import { useTranslations } from "@/lib/i18n/useTranslations";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalePath } from "@/lib/i18n/utils";

const HERO_STAT_ICONS = [Users, Sparkles, TrendingUp, Star];

const TOOL_META = [
  { to: "/tools/viral-title-generator", icon: TrendingUp, color: "bg-red-600" },
  { to: "/tools/ai-script-writer", icon: PenTool, color: "bg-black" },
  { to: "/tools/channel-analytics", icon: BarChart3, color: "bg-blue-600" },
  { to: "/tools/channel-id-finder", icon: Hash, color: "bg-purple-600" },
  { to: "/tools/monetization-checker", icon: DollarSign, color: "bg-green-600" },
  { to: "/tools/seo-analyzer", icon: LineChart, color: "bg-indigo-600" },
  { to: "/tools/thumbnail-downloader", icon: Download, color: "bg-pink-600" },
  { to: "/tools/thumbnail-preview", icon: ImageIcon, color: "bg-rose-600" },
  { to: "/tools/embed-generator", icon: Code2, color: "bg-slate-700" },
  { to: "/tools/qr-code-generator", icon: QrCode, color: "bg-red-600" },
  { to: "/tools/shorts-ideas", icon: Video, color: "bg-orange-600" },
  { to: "/tools/ai-transcript", icon: FileText, color: "bg-cyan-600" },
  { to: "/tools/earnings-calculator", icon: Calculator, color: "bg-teal-600" },
];

const WORKFLOW_ICONS = [Lightbulb, TrendingUp, PenTool, LineChart, Rocket];

const BENEFIT_ICONS = [Zap, Target, Shield, Layers, Globe, Award];

const USECASE_ICONS = [Rocket, TrendingUp, Crown, Users, BarChart3, Globe];

const TESTI_AVATARS = [
  "https://ui-avatars.com/api/?name=Aisha+Patel&background=f59e0b&color=000&bold=true",
  "https://ui-avatars.com/api/?name=Diego+Ramirez&background=000000&color=fff&bold=true",
  "https://ui-avatars.com/api/?name=Maya+Chen&background=dc2626&color=fff&bold=true",
  "https://ui-avatars.com/api/?name=Jordan+Blake&background=2563eb&color=fff&bold=true",
];

const pressLogos = ["TechCrunch", "The Verge", "Forbes", "Wired", "VentureBeat", "Mashable", "Tubefilter", "Creator Economy"];

function Crown({ className = "" }: { className?: string }) {
  return <Award className={className} />;
}

export default function DemoPage() {
  const { t } = useTranslations();
  const { locale } = useLocale();
  const [activeTool, setActiveTool] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const tools = t("demoPage.tools").map((tool, i) => ({ ...tool, ...TOOL_META[i] }));
  const current = tools[activeTool];
  const heroStats = t("demoPage.heroStats").map((s, i) => ({ ...s, icon: HERO_STAT_ICONS[i] }));
  const workflow = {
    title: t("demoPage.workflowTitle"),
    desc: t("demoPage.workflowDesc"),
    steps: t("demoPage.workflowSteps").map((s, i) => ({ ...s, icon: WORKFLOW_ICONS[i] })),
  };
  const benefits = t("demoPage.benefits").map((b, i) => ({ ...b, icon: BENEFIT_ICONS[i] }));
  const useCases = t("demoPage.useCases").map((u, i) => ({ ...u, icon: USECASE_ICONS[i] }));
  const testimonials = t("demoPage.testimonials").map((item, i) => ({ ...item, avatar: TESTI_AVATARS[i] }));
  const faqs = t("demoPage.faqs");
  const seoContent = t("demoPage.seoContent");

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
            <div className="text-[8px] text-neutral-500 font-bold">{t("demoPage.viewLift")}</div>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0], rotate: [-8, -10, -8] }} transition={{ duration: 9, repeat: Infinity, delay: 0.5 }} className="hidden lg:block absolute bottom-32 left-16 w-28 h-28 bg-yellow-300 border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-3">
            <Sparkles className="w-5 h-5 text-black mb-1" />
            <div className="font-black text-[10px]">12.4M+</div>
            <div className="text-[8px] text-black/70 font-bold">{t("demoPage.generations")}</div>
          </motion.div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 py-14 sm:py-24 md:py-32 relative">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-xs font-black tracking-wider uppercase mb-6 border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)]">
              <PlayCircle className="w-3.5 h-3.5 text-red-500" /> {t("demoPage.heroBadge")}
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-7xl font-black tracking-tight text-white mb-5 [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              {t("demoPage.heroTitle1")}<br />{t("demoPage.heroTitle2")}
            </h1>
            <p className="text-base sm:text-xl text-red-50 max-w-3xl mx-auto leading-relaxed mb-8">
              {t("demoPage.heroDesc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10">
              <Link href={getLocalePath(locale, "/pricing")} className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider">
                <Rocket className="w-4 h-4" /> {t("demoPage.startTrial")} <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#tools" className="inline-flex items-center gap-2 px-6 py-3.5 bg-black text-white font-black rounded-xl border-2 border-black hover:bg-neutral-900 transition-colors uppercase tracking-wider">
                <MousePointer2 className="w-4 h-4" /> {t("demoPage.exploreTools")}
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
          <div className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-neutral-500 mb-4">{t("demoPage.featuredIn")}</div>
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
              <Wand2 className="w-3 h-3 text-red-500" /> {t("demoPage.tourBadge")}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">{t("demoPage.tourTitle")}</h2>
            <p className="text-sm sm:text-lg text-neutral-600">{t("demoPage.tourDesc")}</p>
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
                    <div className={`w-14 h-14 rounded-xl ${current.color} text-white flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0`}>
                      <current.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-2xl mb-1">{current.name}</h3>
                      <p className="text-sm text-neutral-600 leading-relaxed">{current.desc}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="bg-neutral-50 border-2 border-black rounded-xl p-3">
                      <div className="text-[10px] text-neutral-500 font-black uppercase tracking-wider mb-1">{t("demoPage.lifetimeGens")}</div>
                      <div className="font-black text-xl">{current.metrics.gens}</div>
                    </div>
                    <div className="bg-red-50 border-2 border-black rounded-xl p-3">
                      <div className="text-[10px] text-red-600 font-black uppercase tracking-wider mb-1">{t("demoPage.avgLift")}</div>
                      <div className="font-black text-xl">{current.metrics.lift}</div>
                    </div>
                  </div>

                  {current.demo && (
                    <div className="mb-6">
                      <div className="text-[10px] text-neutral-500 font-black uppercase tracking-wider mb-2">{t("demoPage.sampleOutput")}</div>
                      <div className="space-y-2">
                        {current.demo.map((line, j) => (
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

                  {!current.demo && (
                    <div className="mb-6 bg-gradient-to-br from-neutral-100 to-neutral-200 border-2 border-black rounded-xl p-8 text-center">
                      <div className={`w-20 h-20 rounded-2xl ${current.color} text-white mx-auto flex items-center justify-center border-2 border-black mb-4`}>
                        <current.icon className="w-9 h-9" />
                      </div>
                      <div className="font-black text-base mb-1">{t("demoPage.livePreviewTitle")}</div>
                      <div className="text-xs text-neutral-600">{t("demoPage.livePreviewDesc")}</div>
                    </div>
                  )}

                  <Link href={getLocalePath(locale, current.to)} className="w-full inline-flex items-center justify-center gap-2 py-3 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider">
                    <Rocket className="w-4 h-4" /> {t("demoPage.tryToolFreePre")} {current.name} {t("demoPage.tryToolFreeSuffix")} <ArrowUpRight className="w-4 h-4" />
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
              <WorkflowIcon className="w-3 h-3" /> {t("demoPage.workflowBadge")}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">{workflow.title}</h2>
            <p className="text-sm sm:text-lg text-neutral-600">{workflow.desc}</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {workflow.steps.map((step, i) => (
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
              <Sparkles className="w-3 h-3 text-red-500" /> {t("demoPage.benefitsBadge")}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">{t("demoPage.benefitsTitle")}</h2>
            <p className="text-sm sm:text-lg text-neutral-600">{t("demoPage.benefitsDesc")}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {benefits.map((b, i) => (
              <motion.div
                key={b.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center border-2 border-black mb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                  <b.icon className="w-5 h-5" />
                </div>
                <div className="font-black text-lg mb-2">{b.t}</div>
                <p className="text-sm text-neutral-600 leading-relaxed">{b.d}</p>
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
              <Users className="w-3 h-3" /> {t("demoPage.useCasesBadge")}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">{t("demoPage.useCasesTitle")}</h2>
            <p className="text-sm sm:text-lg text-neutral-600">{t("demoPage.useCasesDesc")}</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {useCases.map((u, i) => (
              <motion.div
                key={u.t}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="bg-gradient-to-br from-white to-neutral-50 border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-1 transition-all"
              >
                <u.icon className="w-8 h-8 text-red-600 mb-3" />
                <div className="font-black text-base mb-2">{u.t}</div>
                <p className="text-sm text-neutral-600 leading-relaxed">{u.d}</p>
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
              <Heart className="w-3 h-3 fill-white" /> {t("demoPage.testiBadge")}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">{t("demoPage.testiTitle")}</h2>
            <p className="text-sm sm:text-lg text-neutral-400">{t("demoPage.testiDesc")}</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {testimonials.map((item, i) => (
              <motion.div
                key={item.name}
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
                <p className="text-sm sm:text-base leading-relaxed text-neutral-800 mb-6">"{item.quote}"</p>
                <div className="flex items-center gap-3 pt-4 border-t-2 border-dashed border-neutral-200">
                  <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full border-2 border-black" />
                  <div className="flex-1 min-w-0">
                    <div className="font-black text-sm">{item.name}</div>
                    <div className="text-[11px] text-neutral-500 font-bold">{item.role} · {item.channel}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="font-black text-lg text-red-600">{item.metric}</div>
                    <div className="text-[9px] text-neutral-500 font-bold uppercase tracking-wider">{item.metricLabel}</div>
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
              <FileText className="w-3 h-3 text-red-500" /> {t("demoPage.guideBadge")}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">{t("demoPage.guideTitle")}</h2>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">{t("demoPage.guideDesc")}</p>
          </motion.div>

          <div className="prose prose-neutral max-w-none [&_h3]:text-2xl [&_h3]:font-black [&_h3]:tracking-tight [&_h3]:mt-10 [&_h3]:mb-3 [&_p]:text-neutral-700 [&_p]:leading-relaxed [&_p]:mb-4 [&_a]:text-red-600 [&_a]:font-black [&_a]:underline [&_strong]:font-black [&_strong]:text-black">
            <p>{t("demoPage.guideLead")}</p>
            {seoContent.map((sec, i) => (
              <div key={i}>
                <h3>{sec.h3}</h3>
                <p>{sec.p1}</p>
                {sec.p2 && <p>{sec.p2}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-neutral-50 py-16 sm:py-24 border-b-2 border-black">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider mb-4">
              <Lightbulb className="w-3 h-3" /> {t("demoPage.faqBadge")}
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mb-4">{t("demoPage.faqTitle")}</h2>
            <p className="text-sm sm:text-base text-neutral-600">{t("demoPage.faqDesc")}</p>
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
              <Sparkles className="w-3.5 h-3.5 text-red-500" /> {t("demoPage.finalBadge")}
            </div>
            <h2 className="text-3xl sm:text-6xl font-black tracking-tight text-white mb-5 [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              {t("demoPage.finalTitle1")}<br />{t("demoPage.finalTitle2")}
            </h2>
            <p className="text-base sm:text-xl text-red-50 mb-8 leading-relaxed max-w-2xl mx-auto">
              {t("demoPage.finalDesc")}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href={getLocalePath(locale, "/pricing")} className="inline-flex items-center gap-2 px-7 py-4 bg-white text-black font-black rounded-xl border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-[7px_7px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider text-sm sm:text-base">
                <Rocket className="w-5 h-5" /> {t("demoPage.startTrial")} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href={getLocalePath(locale, "/tools/viral-title-generator")} className="inline-flex items-center gap-2 px-7 py-4 bg-black text-white font-black rounded-xl border-2 border-black hover:bg-neutral-900 transition-all uppercase tracking-wider text-sm sm:text-base">
                <Wand2 className="w-5 h-5" /> {t("demoPage.tryFreeTools")}
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-red-50 font-bold">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> {t("demoPage.noCreditCard")}</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> {t("demoPage.cancelAnytime")}</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> {t("demoPage.refund30")}</span>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <DemoJsonLd faqs={faqs} home={t("demoPage.homeCrumb")} demo={t("demoPage.demoCrumb")} />
    </div>
  );
}

function DemoJsonLd({
  faqs,
  home,
  demo,
}: {
  faqs: { q: string; a: string }[];
  home: string;
  demo: string;
}) {
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
      { "@type": "ListItem", position: 2, name: demo, item: "https://ytforge.app/demo" },
    ],
  };
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(bc) }} />
    </>
  );
}
