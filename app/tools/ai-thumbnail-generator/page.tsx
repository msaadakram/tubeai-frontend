"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import {
  Image as ImageIcon,
  Lock,
  Sparkles,
  Crown,
  Check,
  Zap,
  Wand2,
  Layers,
  Palette,
  Rocket,
  ArrowRight,
  Star,
  Clock,
} from "lucide-react";
import { ToolLayout } from "@/components/tools/ToolLayout";

const perks = [
  { icon: Wand2, title: "4 variants per prompt", desc: "Generate four click-tested thumbnail concepts in a single click." },
  { icon: Palette, title: "Style transfer", desc: "Reference any swipe-file thumbnail and remix its style into yours." },
  { icon: Layers, title: "Layered exports", desc: "Auto-extracted face, text, and emoji layers — fully editable." },
  { icon: Zap, title: "HD lossless PNG", desc: "1280×720 export at YouTube-perfect resolution, zero compression." },
];

const plans = [
  {
    name: "Creator",
    price: "$19",
    period: "/ month",
    highlight: false,
    tag: "Most popular",
    features: [
      "100 AI thumbnails / month",
      "All 4 variant generations",
      "HD lossless PNG export",
      "Style transfer + reference upload",
      "Background remover",
      "Priority generation queue",
    ],
    cta: "Upgrade to Creator",
  },
  {
    name: "Pro",
    price: "$49",
    period: "/ month",
    highlight: true,
    tag: "Best value",
    features: [
      "Unlimited AI thumbnails",
      "All Creator features",
      "Bulk generation (10 at once)",
      "Team workspaces (5 seats)",
      "API access for automation",
      "Dedicated priority queue",
    ],
    cta: "Upgrade to Pro",
  },
];

const social = [
  { value: "1.4M+", label: "Thumbnails Generated" },
  { value: "+62%", label: "Avg CTR Lift" },
  { value: "4.9★", label: "Creator Rating" },
];

export default function AIThumbnailGeneratorPage() {
  return (
    <ToolLayout
      title="AI Thumbnail Generator"
      description="Generate click-magnet YouTube thumbnails matching the proven patterns of top creators in your niche."
      icon={ImageIcon}
      badge="Premium · Pro Feature"
    >
      {/* HERO Lock Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-black text-white rounded-3xl border-2 border-black shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] overflow-hidden mb-10 sm:mb-12"
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

        {/* Floating sparkles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: `${10 + Math.random() * 80}%`,
                y: `${Math.random() * 100}%`,
                opacity: 0,
              }}
              animate={{
                y: ["100%", "-10%"],
                opacity: [0, 0.7, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "linear",
              }}
            >
              <Sparkles className="w-3.5 h-3.5 text-red-500" />
            </motion.div>
          ))}
        </div>

        <div className="relative p-6 sm:p-10 md:p-14 grid lg:grid-cols-5 gap-8 lg:gap-12 items-center">
          {/* Left: Copy */}
          <div className="lg:col-span-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-red-600 to-orange-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full border-2 border-white mb-5">
              <Crown className="w-3 h-3" /> Premium Feature
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-[1.05] mb-4">
              Unlock studio-grade{" "}
              <span className="text-red-500">AI thumbnails</span>{" "}
              that get the click.
            </h1>
            <p className="text-sm sm:text-base text-neutral-300 leading-relaxed mb-6 max-w-xl">
              The AI Thumbnail Generator is part of our <strong className="text-white">Creator</strong> and{" "}
              <strong className="text-white">Pro</strong> plans. Upgrade to design 4 click-tested variants per
              prompt, with style transfer, layered exports, and priority queue.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <Link
                href="/pricing"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-sm rounded-xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all"
              >
                <Crown className="w-4 h-4" /> Upgrade to Unlock
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/tools/viral-title-generator"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-wider text-sm rounded-xl border-2 border-white/40 transition-all"
              >
                Try Free Tools
              </Link>
            </div>

            <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
              {social.map((s) => (
                <div key={s.label} className="flex items-baseline gap-2">
                  <span className="text-xl sm:text-2xl font-black text-red-500 tabular-nums">{s.value}</span>
                  <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Locked preview */}
          <div className="lg:col-span-2">
            <div className="relative">
              {/* Mock thumbnail grid */}
              <div className="grid grid-cols-2 gap-2 sm:gap-3 filter blur-sm">
                {[
                  "from-red-600 to-orange-500",
                  "from-purple-600 to-pink-500",
                  "from-orange-500 to-yellow-400",
                  "from-blue-600 to-cyan-400",
                ].map((g, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 + i * 0.08 }}
                    className={`aspect-video rounded-xl bg-gradient-to-br ${g} border-2 border-white relative overflow-hidden`}
                  >
                    <div className="absolute inset-0 bg-black/30" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <div className="h-2 bg-white/60 rounded-full mb-1" />
                      <div className="h-2 bg-white/40 rounded-full w-2/3" />
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Lock overlay */}
              <motion.div
                initial={{ scale: 0, rotate: -12 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.4 }}
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

      {/* Perks grid */}
      <section className="mb-12 sm:mb-16">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
            <Sparkles className="w-3 h-3 text-red-500" /> What you'll unlock
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black">
            Everything you need to win the click
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {perks.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white border-2 border-black rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-0.5 transition-all"
            >
              <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center border-2 border-black mb-3">
                <p.icon className="w-5 h-5" />
              </div>
              <h3 className="font-black text-base text-black mb-1.5">{p.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="mb-12 sm:mb-16">
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-3">
            <Crown className="w-3 h-3" /> Choose your plan
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black">
            Two ways to unlock the generator
          </h2>
          <p className="text-sm sm:text-base text-neutral-500 max-w-xl mx-auto mt-2">
            7-day free trial · cancel anytime · 30-day money-back guarantee
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`relative rounded-2xl border-2 border-black p-6 sm:p-7 ${
                plan.highlight
                  ? "bg-red-600 text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              }`}
            >
              {plan.tag && (
                <div
                  className={`absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border-2 border-black ${
                    plan.highlight ? "bg-yellow-400 text-black" : "bg-black text-white"
                  }`}
                >
                  <Star className="w-3 h-3" /> {plan.tag}
                </div>
              )}
              <h3 className="text-2xl font-black tracking-tight mb-1">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-4xl font-black tabular-nums">{plan.price}</span>
                <span className={`text-sm font-bold ${plan.highlight ? "text-red-100" : "text-neutral-500"}`}>
                  {plan.period}
                </span>
              </div>
              <ul className="space-y-2.5 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        plan.highlight ? "text-white" : "text-red-600"
                      }`}
                      strokeWidth={3}
                    />
                    <span className={plan.highlight ? "text-white" : "text-neutral-800"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/pricing"
                className={`w-full inline-flex items-center justify-center gap-2 px-4 py-3 font-black uppercase tracking-wider text-sm rounded-xl border-2 border-black transition-all hover:-translate-y-0.5 ${
                  plan.highlight
                    ? "bg-black text-white shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)]"
                    : "bg-red-600 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                }`}
              >
                {plan.cta}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-black text-white rounded-2xl border-2 border-black p-6 sm:p-10 shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] text-center relative overflow-hidden"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "linear-gradient(rgba(220,38,38,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(220,38,38,0.4) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full border-2 border-white mb-3">
            <Clock className="w-3 h-3" /> Limited Time
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 tracking-tight">
            Ready to make thumbnails that get the click?
          </h2>
          <p className="text-sm sm:text-base text-neutral-300 max-w-xl mx-auto mb-6">
            Join 18,000+ creators using YTForge to ship faster, get more views, and grow their channels.
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-wider text-sm rounded-xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.25)] hover:-translate-y-0.5 transition-all"
          >
            <Rocket className="w-4 h-4" /> Start Free Trial
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-[10px] text-neutral-400 mt-3">No credit card required · cancel anytime</p>
        </div>
      </motion.div>
    </ToolLayout>
  );
}
