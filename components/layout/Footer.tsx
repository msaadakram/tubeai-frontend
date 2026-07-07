"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Play,
  Twitter,
  Github,
  Linkedin,
  Youtube,
  Mail,
  Sparkles,
  ArrowRight,
  TrendingUp,
  PenTool,
  LineChart,
  FileText,
  Video,
  Image as ImageIcon,
  Download,
  Calculator,
  DollarSign,
  Heart,
  Hash,
  Tag as TagIcon,
  Code2,
  QrCode,
} from "lucide-react";
import { motion } from "motion/react";

const tools = [
  { name: "Viral Title Generator", to: "/tools/viral-title-generator", icon: TrendingUp },
  { name: "AI Script Writer", to: "/tools/ai-script-writer", icon: PenTool },
  { name: "Thumbnail Downloader", to: "/tools/thumbnail-downloader", icon: Download },
  { name: "Thumbnail Preview", to: "/tools/thumbnail-preview", icon: ImageIcon },
  { name: "Embed Generator", to: "/tools/embed-generator", icon: Code2 },
  { name: "QR Code Generator", to: "/tools/qr-code-generator", icon: QrCode },
  { name: "SEO Analyzer", to: "/tools/seo-analyzer", icon: LineChart },
  { name: "Monetization Checker", to: "/tools/monetization-checker", icon: DollarSign },
  { name: "AI Transcript", to: "/tools/ai-transcript", icon: FileText },
  { name: "AI Short Video Creator", to: "/tools/shorts-ideas", icon: Video, upgrade: true },
  { name: "Earnings Calculator", to: "/tools/earnings-calculator", icon: Calculator },
  { name: "AI Thumbnail Generator", to: "/tools/ai-thumbnail-generator", icon: ImageIcon, upgrade: true },
  { name: "Hashtag Generator", to: "/tools/hashtag-generator", icon: Hash },
  { name: "Tag Generator", to: "/tools/tag-generator", icon: TagIcon },
];

const linkSections = [
  {
    title: "Product",
    links: [
      { name: "Features", href: "/#features" },
      { name: "Demo", href: "/#demo" },
      { name: "Pricing", href: "/#pricing" },
      { name: "Changelog", href: "#" },
      { name: "Roadmap", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Blog", href: "#" },
      { name: "Creator Guides", href: "#" },
      { name: "YouTube SEO 101", href: "#" },
      { name: "Help Center", href: "#" },
      { name: "Community", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { name: "About Us", href: "#" },
      { name: "Careers", href: "#" },
      { name: "Press Kit", href: "#" },
      { name: "Contact", href: "#" },
      { name: "Affiliates", href: "#" },
    ],
  },
];

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Youtube, href: "#", label: "YouTube" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const year = new Date().getFullYear();

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "success") return;

    const trimmed = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const base = process.env.NEXT_PUBLIC_API_URL || "https://tubeai-backend.vercel.app";
    try {
      const res = await fetch(`${base}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed, source: "footer-newsletter" }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || `Failed to subscribe (${res.status})`);
      }

      setStatus("success");
      setMessage(body.created ? "You're in! See you Sunday." : "You're already subscribed!");
      setEmail("");
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 4000);
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  const subscribed = status === "success";

  return (
    <footer className="relative bg-black text-white overflow-hidden">
      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_30%,transparent_100%)] pointer-events-none" />
      <div className="absolute -top-40 -left-20 w-96 h-96 rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative">
        {/* Newsletter banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="-mt-16 sm:-mt-20 mb-16 sm:mb-20 bg-red-600 border-2 border-black rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] relative overflow-hidden"
        >
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-yellow-300/30 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/20 blur-2xl" />

          <div className="relative grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10 items-center">
            <div className="lg:col-span-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-full mb-3 border-2 border-white/20">
                <Sparkles className="w-3 h-3 text-yellow-300" /> Creator Newsletter
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight mb-2">
                Join 50K+ creators growing weekly
              </h3>
              <p className="text-sm sm:text-base text-red-100 max-w-lg">
                One email every Sunday. Viral case studies, algorithm updates, and the exact tactics top creators use this week.
              </p>
            </div>
            <form onSubmit={subscribe} className="lg:col-span-2 flex flex-col sm:flex-row gap-3">
              <div className="flex-1 flex items-center gap-2 bg-white border-2 border-black rounded-xl px-3">
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@channel.com"
                  className="flex-1 py-3 outline-none text-sm font-bold text-black placeholder:text-neutral-400 bg-transparent"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-black text-white font-black rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.3)] hover:-translate-y-0.5 transition-transform text-sm uppercase tracking-wider whitespace-nowrap disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : status === "success" ? (
                  "✓ Subscribed!"
                ) : (
                  <>Subscribe <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
              {status === "error" && message && (
                <p className="sm:absolute sm:mt-1 text-xs font-bold text-yellow-200">{message}</p>
              )}
              {status === "success" && message && (
                <p className="sm:absolute sm:mt-1 text-xs font-bold text-yellow-200">{message}</p>
              )}
            </form>
          </div>
        </motion.div>

        {/* Main grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-12 gap-8 sm:gap-10 mb-12 sm:mb-16">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-4">
            <Link href="/" className="inline-flex items-center gap-2 group mb-5">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center border-2 border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)] group-hover:-translate-y-0.5 transition-transform">
                <Play className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-black text-2xl tracking-tight">YTForge</span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6 max-w-sm">
              The ultimate AI toolkit for YouTube creators. Grow your channel faster with data-driven insights, automated workflows, and creator-tested templates.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6 max-w-sm">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-lg font-black text-red-500">50K+</div>
                <div className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Creators</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-lg font-black text-red-500">4.9★</div>
                <div className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Rated</div>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center">
                <div className="text-lg font-black text-red-500">14</div>
                <div className="text-[9px] font-black text-neutral-400 uppercase tracking-wider">Tools</div>
              </div>
            </div>

            {/* Socials */}
            <div className="flex gap-2">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-10 h-10 rounded-xl bg-white/5 border-2 border-white/10 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:-translate-y-0.5 transition-all"
                >
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Tools column */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-3">
            <h4 className="font-black text-sm uppercase tracking-wider mb-5 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-red-500" /> All Tools
            </h4>
            <ul className="grid grid-cols-1 gap-2.5">
              {tools.map((t) => (
                <li key={t.to}>
                  <Link
                    href={t.to}
                    className="group flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    <t.icon className="w-3.5 h-3.5 text-red-500/70 group-hover:text-red-500 transition-colors" />
                    <span className="group-hover:translate-x-0.5 transition-transform">{t.name}</span>
                    {t.upgrade && (
                      <span className="ml-1 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[9px] font-black rounded border border-black tracking-wide">
                        PRO
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Link sections */}
          {linkSections.map((section) => (
            <div key={section.title} className="lg:col-span-1">
              <h4 className="font-black text-sm uppercase tracking-wider mb-5">{section.title}</h4>
              <ul className="flex flex-col gap-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-neutral-400 hover:text-white hover:translate-x-0.5 inline-block transition-all"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <h4 className="font-black text-sm uppercase tracking-wider mb-5">Contact</h4>
            <ul className="flex flex-col gap-3 mb-5">
              <li>
                <a href="mailto:hello@ytforge.app" className="text-sm text-neutral-400 hover:text-white inline-flex items-center gap-2 transition-colors">
                  <Mail className="w-3.5 h-3.5 text-red-500" /> hello@ytforge.app
                </a>
              </li>
            </ul>
            <div className="bg-white/5 border-2 border-dashed border-white/10 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-xs font-black text-emerald-400 uppercase tracking-wider">All systems operational</span>
              </div>
              <p className="text-[10px] text-neutral-500">Last checked just now</p>
            </div>
          </div>
        </div>

        {/* Big YTForge watermark */}
        <div className="relative pt-10 sm:pt-14 mb-6 sm:mb-8 select-none overflow-hidden">
          <div className="text-center text-[18vw] sm:text-[14vw] lg:text-[10rem] font-black leading-none bg-gradient-to-b from-white/10 to-transparent bg-clip-text text-transparent tracking-tighter">
            YTFORGE
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 sm:pt-8 border-t-2 border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 pb-8">
          <p className="text-xs text-neutral-500 flex items-center gap-1.5 flex-wrap justify-center">
            © {year} YTForge Inc. Made with <Heart className="w-3 h-3 text-red-500 fill-red-500" /> for creators worldwide.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 justify-center">
            <Link href="/privacy" className="text-xs text-neutral-500 hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-neutral-500 hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/disclaimer" className="text-xs text-neutral-500 hover:text-white transition-colors">Disclaimer</Link>
            <a href="mailto:dmca@ytforge.app" className="text-xs text-neutral-500 hover:text-white transition-colors">DMCA</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
