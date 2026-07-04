"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Target, Cpu, MessageSquare, TrendingUp, BarChart3, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const aiFeatures = [
  {
    title: "Trained on viral hits",
    description: "Our AI models analyse millions of top-performing videos across every niche to understand exactly what triggers the algorithm.",
    icon: Cpu,
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    stat: "4.2M+",
    statLabel: "videos trained",
  },
  {
    title: "Automated A/B Testing",
    description: "Upload up to 5 thumbnails and let our predictive engine tell you which one will get the highest CTR before you publish.",
    icon: Target,
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    stat: "+47%",
    statLabel: "avg CTR lift",
  },
  {
    title: "Smart Script Suggestions",
    description: "Write your script in our editor and get real-time suggestions to improve retention, pacing, and audience engagement.",
    icon: Zap,
    color: "text-yellow-600",
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    stat: "+92%",
    statLabel: "avg AVD lift",
  },
  {
    title: "AI Comment Responder",
    description: "Automatically engage with your audience using personalized, AI-generated responses to boost early video velocity.",
    icon: MessageSquare,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    stat: "2.4×",
    statLabel: "engagement",
  },
];

// Animated floating metric cards for the right panel
const metrics = [
  { label: "Predicted CTR", value: "8.4%", icon: Target, delay: 0,    top: "12%",  side: "right-[4%]",  y: [-8, 8]  },
  { label: "Retention Score", value: "68%",  icon: BarChart3, delay: 0.8, bottom: "16%", side: "left-[4%]",   y: [6, -10] },
  { label: "SEO Score",     value: "94/100", icon: TrendingUp, delay: 1.4, top: "42%",  side: "right-[2%]",  y: [-6, 8]  },
];

const ORB_COUNT = 6;

export function AIFeatures() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-16 sm:py-20 md:py-28 bg-white border-y border-neutral-100 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6">

        {/* Section badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-10 sm:mb-14"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white text-[11px] sm:text-xs font-black uppercase tracking-widest border-2 border-black shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]">
            <Sparkles className="w-3 h-3 text-red-500" /> Real AI Intelligence
          </span>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">

          {/* ── LEFT: copy + feature cards ── */}
          <div className="lg:w-1/2 order-2 lg:order-1">
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55 }}
            >
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-black mb-4 sm:mb-5 leading-[1.08]">
                Not just another wrapper.{" "}
                <br className="hidden sm:block" />
                <span className="text-neutral-400">Real AI intelligence.</span>
              </h2>
              <p className="text-base sm:text-lg text-neutral-600 mb-8 sm:mb-10 max-w-xl leading-relaxed">
                We didn't just plug into an API. We trained our own models specifically on YouTube metadata, retention graphs, and click-through rates from 4.2 million viral videos.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-8 sm:mb-10">
              {aiFeatures.map((feature, i) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.09 }}
                  onHoverStart={() => setHovered(i)}
                  onHoverEnd={() => setHovered(null)}
                  className="relative p-4 sm:p-5 rounded-2xl bg-white border-2 border-neutral-200 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group overflow-hidden cursor-default"
                >
                  {/* Animated background fill on hover */}
                  <motion.div
                    className={`absolute inset-0 ${feature.bg} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl ${feature.bg} ${feature.border} border flex items-center justify-center`}>
                        <feature.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${feature.color}`} />
                      </div>
                      {/* Stat badge */}
                      <AnimatePresence>
                        {hovered === i && (
                          <motion.span
                            initial={{ opacity: 0, scale: 0.8, y: -4 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: -4 }}
                            transition={{ type: "spring", stiffness: 340, damping: 20 }}
                            className={`inline-flex flex-col items-center px-2 py-1 rounded-lg ${feature.bg} border ${feature.border}`}
                          >
                            <span className={`text-xs font-black ${feature.color} leading-none`}>{feature.stat}</span>
                            <span className="text-[9px] text-neutral-500 font-bold leading-none mt-0.5">{feature.statLabel}</span>
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    <h4 className="text-sm sm:text-base font-black text-black mb-1.5 group-hover:text-black transition-colors">
                      {feature.title}
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <Link
                href="/features"
                className="inline-flex items-center gap-2 px-5 py-3 bg-black text-white text-sm font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider"
              >
                <Sparkles className="w-4 h-4 text-red-500" /> Explore all 14 tools
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </div>

          {/* ── RIGHT: animated visualization ── */}
          <div className="w-full lg:w-1/2 order-1 lg:order-2 flex items-center justify-center">
            <div className="relative aspect-square w-full max-w-[300px] sm:max-w-[360px] md:max-w-[420px] mx-auto">

              {/* Background glow */}
              <motion.div
                animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[10%] rounded-full blur-[60px] sm:blur-[80px] pointer-events-none"
                style={{ background: "radial-gradient(circle, rgba(220,38,38,0.35) 0%, rgba(220,38,38,0.05) 70%, transparent 100%)" }}
              />

              {/* Concentric orbit rings */}
              {[0, 12, 24].map((inset, ri) => (
                <div
                  key={ri}
                  className={`absolute rounded-full border ${ri === 1 ? "border-red-200" : "border-neutral-200"}`}
                  style={{
                    inset: `${inset}%`,
                    animation: `spin ${60 - ri * 18}s linear infinite ${ri % 2 === 1 ? "reverse" : ""}`,
                  }}
                />
              ))}

              {/* Orbiting dots */}
              {Array.from({ length: ORB_COUNT }).map((_, oi) => {
                const angle = (oi / ORB_COUNT) * 360;
                const radius = oi % 2 === 0 ? 44 : 32; // % of container
                return (
                  <motion.div
                    key={oi}
                    className="absolute w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full"
                    style={{
                      top: `calc(50% + ${radius * Math.sin((angle * Math.PI) / 180)}% - 4px)`,
                      left: `calc(50% + ${radius * Math.cos((angle * Math.PI) / 180)}% - 4px)`,
                      background: oi % 3 === 0 ? "#dc2626" : oi % 3 === 1 ? "#000" : "#e5e7eb",
                    }}
                    animate={{
                      scale: [1, 1.6, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: oi * 0.4,
                    }}
                  />
                );
              })}

              {/* Center black card */}
              <motion.div
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-[28%] rounded-2xl sm:rounded-3xl bg-black border-2 border-white shadow-[0_20px_60px_-12px_rgba(0,0,0,0.7)] flex flex-col items-center justify-center gap-1"
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-6 h-6 sm:w-7 sm:h-7 text-red-500" />
                </motion.div>
                <span className="text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wider mt-0.5">YTForge AI</span>
              </motion.div>

              {/* Floating metric cards */}
              {metrics.map((m, mi) => (
                <motion.div
                  key={m.label}
                  animate={{ y: [m.y[0], m.y[1], m.y[0]] }}
                  transition={{ repeat: Infinity, duration: 3 + mi * 0.8, ease: "easeInOut", delay: m.delay }}
                  className={`absolute ${m.side} ${"top" in m ? `top-[${m.top}]` : `bottom-[${(m as any).bottom}]`} p-2 sm:p-3 rounded-xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2 sm:gap-2.5 max-w-[48%]`}
                  style={"top" in m ? { top: m.top } : { bottom: (m as any).bottom }}
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-red-50 flex items-center justify-center shrink-0 border border-red-200">
                    <m.icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-600" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] sm:text-[10px] text-neutral-500 truncate">{m.label}</div>
                    <div className="text-[11px] sm:text-xs font-black text-black">{m.value}</div>
                  </div>
                </motion.div>
              ))}

              {/* Pulsing connection lines (SVG) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                {[
                  { x1: 50, y1: 50, x2: 82, y2: 20 },
                  { x1: 50, y1: 50, x2: 16, y2: 75 },
                  { x1: 50, y1: 50, x2: 88, y2: 55 },
                ].map((line, li) => (
                  <motion.line
                    key={li}
                    x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                    stroke="#dc2626"
                    strokeWidth="0.4"
                    strokeDasharray="2 2"
                    animate={{ opacity: [0.15, 0.55, 0.15] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: li * 0.6 }}
                  />
                ))}
              </svg>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
