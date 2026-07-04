"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Check,
  X,
  Sparkles,
  Zap,
  Crown,
  Rocket,
  ArrowRight,
  Star,
  Shield,
  Clock,
  Users,
  HelpCircle,
  ChevronDown,
  Tag,
  Gift,
  TrendingUp,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

type Plan = {
  name: string;
  tagline: string;
  monthly: number;
  yearly: number;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
  badge?: string;
  features: string[];
  notIncluded?: string[];
  cta: string;
};

const plans: Plan[] = [
  {
    name: "Free",
    tagline: "Get started with the basics",
    monthly: 0,
    yearly: 0,
    icon: Sparkles,
    features: [
      "5 AI title generations / day",
      "3 thumbnail downloads / day",
      "Basic SEO analyzer",
      "Channel ID finder (unlimited)",
      "Community support",
    ],
    notIncluded: ["AI Script Writer", "Channel Analytics", "API access"],
    cta: "Start Free",
  },
  {
    name: "Creator",
    tagline: "For serious YouTubers ready to grow",
    monthly: 19,
    yearly: 15,
    icon: Zap,
    highlight: true,
    badge: "Most Popular",
    features: [
      "Unlimited AI title generations",
      "Unlimited script writer (up to 10K words)",
      "100 AI thumbnails / month",
      "Full SEO analyzer + keyword research",
      "Channel Analytics (5 channels)",
      "Monetization checker",
      "Shorts ideas generator",
      "AI transcript & translation",
      "Priority email support",
    ],
    cta: "Start 7-Day Trial",
  },
  {
    name: "Pro",
    tagline: "For agencies and creator teams",
    monthly: 49,
    yearly: 39,
    icon: Crown,
    badge: "Best Value",
    features: [
      "Everything in Creator, plus:",
      "Unlimited AI thumbnails",
      "Channel Analytics (unlimited)",
      "Bulk title & script generation",
      "Team workspaces (5 seats)",
      "API access (10K req/mo)",
      "Custom brand voice training",
      "White-label exports",
      "Priority chat support",
      "Early access to new tools",
    ],
    cta: "Start 7-Day Trial",
  },
  {
    name: "Enterprise",
    tagline: "Custom deployments for media networks",
    monthly: -1,
    yearly: -1,
    icon: Rocket,
    features: [
      "Everything in Pro, plus:",
      "Unlimited team seats",
      "Unlimited API requests",
      "Dedicated account manager",
      "Custom AI model fine-tuning",
      "SSO & SAML auth",
      "SOC 2 compliance docs",
      "99.99% SLA",
      "On-prem deployment option",
      "24/7 phone support",
    ],
    cta: "Contact Sales",
  },
];

const compareRows = [
  { label: "AI title generations", values: ["5/day", "Unlimited", "Unlimited", "Unlimited"] },
  { label: "AI script writer", values: [false, "10K words", "Unlimited", "Unlimited"] },
  { label: "AI thumbnails / month", values: [false, "100", "Unlimited", "Unlimited"] },
  { label: "Channel Analytics", values: [false, "5 channels", "Unlimited", "Unlimited"] },
  { label: "Monetization checker", values: [false, true, true, true] },
  { label: "SEO analyzer + keywords", values: ["Basic", true, true, true] },
  { label: "Shorts ideas generator", values: [false, true, true, true] },
  { label: "AI transcript & translation", values: [false, true, true, true] },
  { label: "Bulk generation", values: [false, false, true, true] },
  { label: "Team seats", values: ["1", "1", "5", "Unlimited"] },
  { label: "API access", values: [false, false, "10K req/mo", "Unlimited"] },
  { label: "Custom brand voice", values: [false, false, true, true] },
  { label: "White-label exports", values: [false, false, true, true] },
  { label: "SSO & SAML", values: [false, false, false, true] },
  { label: "SLA guarantee", values: [false, false, false, "99.99%"] },
  { label: "Support", values: ["Community", "Email", "Priority chat", "24/7 phone + AM"] },
];

const testimonials = [
  {
    quote: "YTForge's Creator plan paid for itself in the first week. My CTR jumped 41% after switching to AI-generated titles.",
    name: "Maya Chen",
    role: "Tech YouTuber · 1.2M subs",
    avatar: "https://ui-avatars.com/api/?name=Maya+Chen&background=dc2626&color=fff&bold=true",
  },
  {
    quote: "We run 14 channels for our network. Pro plan's bulk generation saves my team 30+ hours every week.",
    name: "Diego Ramirez",
    role: "Head of Content · MediaCorp",
    avatar: "https://ui-avatars.com/api/?name=Diego+Ramirez&background=000000&color=fff&bold=true",
  },
  {
    quote: "I was skeptical of AI tools but the script writer is honestly indistinguishable from my best long-form work.",
    name: "Aisha Patel",
    role: "Documentary Filmmaker · 480K subs",
    avatar: "https://ui-avatars.com/api/?name=Aisha+Patel&background=f59e0b&color=000&bold=true",
  },
];

const faqs = [
  { q: "Can I switch plans anytime?", a: "Yes — upgrade or downgrade in one click. Upgrades take effect immediately and we prorate the difference. Downgrades apply at the end of your current billing cycle so you keep premium features until then." },
  { q: "Is there a free trial?", a: "All paid plans include a 7-day free trial with full access to every feature. No credit card required to start the Free plan, and you can cancel the trial anytime before day 7 with zero charges." },
  { q: "What payment methods do you accept?", a: "All major credit cards (Visa, Mastercard, Amex, Discover), Apple Pay, Google Pay, and PayPal. Enterprise customers can pay via wire transfer or annual invoice." },
  { q: "Do you offer refunds?", a: "Yes — 30-day money-back guarantee on all plans, no questions asked. If YTForge doesn't grow your channel, email support@ytforge.app and we'll refund your full payment." },
  { q: "Are there discounts for students or non-profits?", a: "Yes — 50% off the Creator plan for verified students and 40% off for registered non-profits. Email support@ytforge.app with proof of eligibility to claim your discount." },
  { q: "What happens if I exceed my plan limits?", a: "We'll send a friendly email at 80% usage. Beyond the cap, generations queue until the next cycle — we never charge surprise overage fees. You can upgrade anytime to lift the limit instantly." },
  { q: "Can I cancel anytime?", a: "Absolutely. Cancel in two clicks from your dashboard. You'll keep premium access until the end of your billing period, and you can re-activate anytime with the same data intact." },
  { q: "Is my data and content safe?", a: "Your scripts, titles, and channel data are encrypted in transit (TLS 1.3) and at rest (AES-256). We're SOC 2 Type II certified, GDPR-compliant, and never train on your private content." },
];

const guarantees = [
  { icon: Shield, title: "30-Day Money Back", desc: "No questions, no hassle, full refund." },
  { icon: Clock, title: "Cancel Anytime", desc: "Two-click cancellation. Keep what you've made." },
  { icon: Users, title: "200K+ Creators", desc: "Trusted by top channels in 60+ countries." },
  { icon: Star, title: "4.9 ★ Rated", desc: "From 12,000+ verified reviews." },
];

function FeatureCheck({ value }: { value: string | boolean }) {
  if (value === true) return <Check className="w-5 h-5 text-green-600 mx-auto" strokeWidth={3} />;
  if (value === false) return <X className="w-5 h-5 text-neutral-300 mx-auto" strokeWidth={3} />;
  return <span className="text-xs sm:text-sm font-black text-black">{value}</span>;
}

export default function PricingPage() {
  const [yearly, setYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-red-600 border-b-4 border-black pt-16 sm:pt-18">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.25)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-20 -left-16 w-72 h-72 rounded-full bg-black/30 blur-3xl"
          />
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute -bottom-24 -right-10 w-80 h-80 rounded-full bg-white/30 blur-3xl"
          />
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 md:py-24 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-xs font-black tracking-wider uppercase mb-6 border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)]">
              <Tag className="w-3.5 h-3.5 text-red-500" />
              <span>Simple Pricing · No Hidden Fees</span>
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              Pricing that scales with your channel
            </h1>
            <p className="text-base sm:text-lg text-red-50 max-w-2xl mx-auto leading-relaxed mb-8">
              Start free, upgrade when you're ready. Every plan includes a 7-day trial and 30-day money-back guarantee.
            </p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-2 p-1.5 bg-black border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)]">
              <button
                onClick={() => setYearly(false)}
                className={`px-4 sm:px-5 py-2 text-sm font-black rounded-xl transition-all ${
                  !yearly ? "bg-white text-black" : "text-white"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setYearly(true)}
                className={`px-4 sm:px-5 py-2 text-sm font-black rounded-xl transition-all flex items-center gap-1.5 ${
                  yearly ? "bg-white text-black" : "text-white"
                }`}
              >
                Yearly
                <span className="px-1.5 py-0.5 text-[9px] font-black bg-red-600 text-white rounded-md">SAVE 20%</span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans */}
      <section className="bg-neutral-50 py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {plans.map((plan, i) => {
              const price = yearly ? plan.yearly : plan.monthly;
              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className={`relative bg-white border-2 border-black rounded-2xl p-6 sm:p-7 flex flex-col ${
                    plan.highlight
                      ? "shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] -translate-y-2 lg:-translate-y-3"
                      : "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all"
                  }`}
                >
                  {plan.badge && (
                    <div
                      className={`absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[10px] font-black tracking-wider uppercase rounded-full border-2 border-black ${
                        plan.highlight ? "bg-red-600 text-white" : "bg-yellow-300 text-black"
                      }`}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center border-2 border-black mb-4 ${
                      plan.highlight ? "bg-red-600 text-white" : "bg-black text-white"
                    }`}
                  >
                    <plan.icon className="w-5 h-5" />
                  </div>

                  <div className="font-black text-xl sm:text-2xl mb-1">{plan.name}</div>
                  <div className="text-xs text-neutral-500 font-bold mb-5 min-h-[2.5em]">{plan.tagline}</div>

                  <div className="mb-5">
                    {price === -1 ? (
                      <div className="font-black text-3xl sm:text-4xl">Custom</div>
                    ) : (
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-black text-3xl sm:text-4xl">${price}</span>
                        <span className="text-xs text-neutral-500 font-bold">/{yearly ? "mo billed yearly" : "month"}</span>
                      </div>
                    )}
                    {yearly && price > 0 && (
                      <div className="text-[11px] text-green-600 font-black mt-1">
                        Save ${(plan.monthly - plan.yearly) * 12}/yr
                      </div>
                    )}
                    {price === 0 && <div className="text-[11px] text-neutral-500 font-bold mt-1">Free forever, no card needed</div>}
                  </div>

                  <button
                    className={`w-full py-3 text-sm font-black rounded-xl border-2 border-black uppercase tracking-wider mb-6 transition-all ${
                      plan.highlight
                        ? "bg-red-600 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
                        : "bg-white text-black hover:bg-black hover:text-white"
                    }`}
                  >
                    {plan.cta}
                  </button>

                  <ul className="space-y-2.5 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs sm:text-sm">
                        <Check className="w-4 h-4 text-green-600 shrink-0 mt-0.5" strokeWidth={3} />
                        <span className="text-neutral-800 leading-snug">{f}</span>
                      </li>
                    ))}
                    {plan.notIncluded?.map((f) => (
                      <li key={f} className="flex items-start gap-2 text-xs sm:text-sm opacity-50">
                        <X className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" strokeWidth={3} />
                        <span className="text-neutral-500 line-through leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>

          {/* Guarantees strip */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-10 sm:mt-12">
            {guarantees.map((g) => (
              <div
                key={g.title}
                className="bg-white border-2 border-black rounded-xl p-4 flex items-start gap-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              >
                <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center border-2 border-black shrink-0">
                  <g.icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-black text-sm">{g.title}</div>
                  <div className="text-[11px] text-neutral-500 font-bold leading-snug">{g.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Compare Table */}
      <section className="bg-white py-16 sm:py-20 border-t-2 border-black">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider mb-4">
              <Sparkles className="w-3 h-3 text-red-500" /> Full Feature Comparison
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">Compare every plan, side by side</h2>
            <p className="text-sm sm:text-base text-neutral-600">Every feature, every limit — clearly laid out so you can pick the right plan in 30 seconds.</p>
          </motion.div>

          <div className="overflow-x-auto -mx-4 sm:mx-0">
            <div className="min-w-[760px] px-4 sm:px-0">
              <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                {/* Header */}
                <div className="grid grid-cols-5 bg-black text-white">
                  <div className="p-4 font-black text-sm">Feature</div>
                  {plans.map((p) => (
                    <div key={p.name} className={`p-4 font-black text-sm text-center ${p.highlight ? "bg-red-600" : ""}`}>
                      {p.name}
                    </div>
                  ))}
                </div>
                {compareRows.map((row, i) => (
                  <div
                    key={row.label}
                    className={`grid grid-cols-5 ${i % 2 === 0 ? "bg-neutral-50" : "bg-white"} border-t-2 border-black`}
                  >
                    <div className="p-4 font-bold text-xs sm:text-sm">{row.label}</div>
                    {row.values.map((v, j) => (
                      <div
                        key={j}
                        className={`p-4 flex items-center justify-center ${plans[j].highlight ? "bg-red-50" : ""}`}
                      >
                        <FeatureCheck value={v} />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-neutral-50 py-16 sm:py-20 border-t-2 border-black">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-10"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-600 text-white text-[10px] font-black uppercase tracking-wider mb-4">
              <Heart /> Loved by 200K+ creators
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">Don't take our word for it</h2>
            <p className="text-sm sm:text-base text-neutral-600">Real creators, real channel growth, real ROI.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white border-2 border-black rounded-2xl p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-1 transition-all"
              >
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-sm leading-relaxed text-neutral-800 mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full border-2 border-black" />
                  <div>
                    <div className="font-black text-sm">{t.name}</div>
                    <div className="text-[11px] text-neutral-500 font-bold">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-white py-16 sm:py-20 border-t-2 border-black">
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black text-white text-[10px] font-black uppercase tracking-wider mb-4">
              <HelpCircle className="w-3 h-3 text-red-500" /> Pricing FAQ
            </div>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight mb-3">Everything you might be wondering</h2>
            <p className="text-sm sm:text-base text-neutral-600">Still have questions? Email <a href="mailto:support@ytforge.app" className="text-red-600 font-black underline">support@ytforge.app</a> — we reply within 4 hours.</p>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div
                key={f.q}
                className="bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-neutral-50 transition-colors"
                >
                  <span className="font-black text-sm sm:text-base">{f.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 transition-transform ${openFaq === i ? "rotate-180 text-red-600" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t-2 border-dashed border-neutral-200"
                    >
                      <p className="px-5 py-4 text-sm text-neutral-700 leading-relaxed">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-black py-16 sm:py-24 border-t-2 border-black">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(220,38,38,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(220,38,38,0.15)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(220,38,38,0.4)_0%,transparent_70%)]" />
        <div className="container mx-auto px-4 sm:px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-black tracking-wider uppercase mb-6 border-2 border-white">
              <Gift className="w-3.5 h-3.5" /> 7-Day Free Trial
            </div>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white mb-4">
              Ready to grow your YouTube channel?
            </h2>
            <p className="text-base sm:text-lg text-neutral-300 mb-8 leading-relaxed">
              Join 200,000+ creators using YTForge to write better titles, design click-magnet thumbnails, and ship retention-optimized videos every week.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button className="inline-flex items-center gap-2 px-6 py-3.5 bg-red-600 text-white font-black rounded-xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider">
                <Sparkles className="w-4 h-4" /> Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </button>
              <Link
                href="/tools/viral-title-generator"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-black font-black rounded-xl border-2 border-white hover:bg-neutral-100 transition-colors uppercase tracking-wider"
              >
                <TrendingUp className="w-4 h-4" /> Try Free Tools
              </Link>
            </div>
            <div className="mt-6 text-xs text-neutral-400 font-bold">
              No credit card required · Cancel anytime · 30-day money-back guarantee
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Heart() {
  return <span className="w-3 h-3 rounded-full bg-white inline-block" />;
}
