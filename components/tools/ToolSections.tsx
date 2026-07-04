"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Sparkles, Target } from "lucide-react";

export function StatsStrip({ stats }: { stats: { value: string; label: string }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8 sm:mb-10">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          className="bg-white border-2 border-black rounded-xl p-3 sm:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-center"
        >
          <div className="text-xl sm:text-2xl md:text-3xl font-black text-red-600 tabular-nums">{s.value}</div>
          <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider mt-1">{s.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

export function GuideGrid({
  title,
  intro,
  cards,
  badge = "The Guide",
}: {
  title: string;
  intro: string;
  cards: { icon: any; color: string; title: string; desc: string }[];
  badge?: string;
}) {
  return (
    <section className="mb-12 sm:mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-6 sm:mb-8"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black tracking-wider uppercase rounded-full mb-3">
          <Target className="w-3 h-3 text-red-500" /> {badge}
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black">{title}</h2>
        <p className="text-sm sm:text-base text-neutral-500 max-w-2xl mt-2">{intro}</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {cards.map((g, i) => (
          <motion.div
            key={g.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="bg-white border-2 border-black rounded-2xl p-5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-0.5 transition-all"
          >
            <div className={`w-10 h-10 rounded-lg ${g.color} flex items-center justify-center border-2 border-black mb-3`}>
              <g.icon className="w-5 h-5" />
            </div>
            <h3 className="font-black text-base text-black mb-1.5">{g.title}</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">{g.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Workflow({ title, steps }: { title: string; steps: { n: string; t: string; d: string }[] }) {
  return (
    <section className="mb-12 sm:mb-16">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-6 sm:mb-8"
      >
        {title}
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5">
        {steps.map((step, i) => (
          <motion.div
            key={step.n}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="bg-black text-white rounded-2xl p-5 border-2 border-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] relative overflow-hidden"
          >
            <div className="absolute -top-4 -right-4 text-6xl font-black text-white/10 select-none">{step.n}</div>
            <div className="relative">
              <div className="text-[10px] font-black text-red-500 tracking-widest mb-2">STEP {step.n}</div>
              <h3 className="font-black text-base mb-2">{step.t}</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">{step.d}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function SeoContent({
  badge,
  title,
  children,
}: {
  badge: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12 sm:mb-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white border-2 border-black rounded-2xl p-6 sm:p-10 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black tracking-wider uppercase rounded-full mb-4">
          <Sparkles className="w-3 h-3" /> {badge}
        </div>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-4">{title}</h2>
        <div className="seo-content space-y-4 text-sm sm:text-base text-neutral-700 leading-relaxed [&_h3]:text-xl [&_h3]:sm:text-2xl [&_h3]:font-black [&_h3]:text-black [&_h3]:mt-8 [&_h3]:mb-3 [&_a]:text-red-600 [&_a]:underline [&_a]:font-bold [&_strong]:text-black">
          {children}
        </div>
      </motion.div>
    </section>
  );
}

export function FaqAccordion({ faqs }: { faqs: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mb-8">
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-6 sm:mb-8"
      >
        Frequently asked questions
      </motion.h2>
      <div className="space-y-3 max-w-3xl">
        {faqs.map((f, i) => (
          <div
            key={i}
            className="bg-white border-2 border-black rounded-xl overflow-hidden shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center justify-between gap-3 p-4 sm:p-5 text-left"
            >
              <span className="font-black text-sm sm:text-base text-black">{f.q}</span>
              <ChevronDown
                className={`w-5 h-5 shrink-0 transition-transform ${
                  open === i ? "rotate-180 text-red-600" : "text-black"
                }`}
              />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 text-sm text-neutral-600 leading-relaxed border-t-2 border-dashed border-neutral-200 pt-3">
                    {f.a}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}

export function CrossCTA({
  title,
  desc,
  primary,
  secondary,
}: {
  title: string;
  desc: string;
  primary: { label: string; href: string; icon: any };
  secondary: { label: string; href: string; icon: any };
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="bg-red-600 text-white rounded-2xl border-2 border-black p-6 sm:p-10 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-center"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3">{title}</h2>
      <p className="text-sm sm:text-base text-red-100 max-w-xl mx-auto mb-6">{desc}</p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <a
          href={primary.href}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-transform text-sm uppercase tracking-wider"
        >
          <primary.icon className="w-4 h-4" /> {primary.label}
        </a>
        <a
          href={secondary.href}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-black text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-transform text-sm uppercase tracking-wider"
        >
          <secondary.icon className="w-4 h-4" /> {secondary.label}
        </a>
      </div>
    </motion.div>
  );
}
