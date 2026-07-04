"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Play,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  Sparkles,
  PenTool,
  TrendingUp,
  LineChart,
  FileText,
  Video,
  Image as ImageIcon,
  Download,
  Calculator,
  DollarSign,
  BarChart3,
  Hash,
  LayoutDashboard,
  LogOut,
  Settings,
  CreditCard,
  User as UserIcon,
  Crown,
  Tag as TagIcon,
  Code2,
  QrCode,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";

const tools = [
  { name: "Viral Title Generator", to: "/tools/viral-title-generator", icon: TrendingUp, desc: "High-CTR YouTube titles" },
  { name: "AI Script Writer", to: "/tools/ai-script-writer", icon: PenTool, desc: "Retention-optimized scripts" },
  { name: "Thumbnail Downloader", to: "/tools/thumbnail-downloader", icon: Download, desc: "Grab any HD thumbnail" },
  { name: "Thumbnail Preview", to: "/tools/thumbnail-preview", icon: ImageIcon, desc: "All sizes + device mockups" },
  { name: "Embed Generator", to: "/tools/embed-generator", icon: Code2, desc: "Custom iframe with live preview" },
  { name: "QR Code Generator", to: "/tools/qr-code-generator", icon: QrCode, desc: "QR codes for any YouTube link" },
  { name: "SEO Analyzer", to: "/tools/seo-analyzer", icon: LineChart, desc: "Rank #1 in search" },
  { name: "Channel Analytics", to: "/tools/channel-analytics", icon: BarChart3, desc: "Analyze any YT channel" },
  { name: "Channel ID Finder", to: "/tools/channel-id-finder", icon: Hash, desc: "Get any channel's UC... ID" },
  { name: "Monetization Checker", to: "/tools/monetization-checker", icon: DollarSign, desc: "Channel eligibility audit" },
  { name: "AI Transcript", to: "/tools/ai-transcript", icon: FileText, desc: "Transcribe + translate" },
  { name: "AI Short Video Creator", to: "/tools/shorts-ideas", icon: Video, desc: "Viral 60s Shorts", upgrade: true },
  { name: "Earnings Calculator", to: "/tools/earnings-calculator", icon: Calculator, desc: "Estimate your revenue" },
  { name: "AI Thumbnail Generator", to: "/tools/ai-thumbnail-generator", icon: ImageIcon, desc: "Studio-grade thumbnails", upgrade: true },
  { name: "Hashtag Generator", to: "/tools/hashtag-generator", icon: Hash, desc: "30+ trending #hashtags" },
  { name: "Tag Generator", to: "/tools/tag-generator", icon: TagIcon, desc: "40+ SEO video tags" },
];

const navLinks = [
  { name: "Features", href: "/features" },
  { name: "AI Chat", href: "/chat" },
  { name: "Demo", href: "/demo" },
  { name: "Disclaimer", href: "/disclaimer" },
  { name: "Pricing", href: "/pricing" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const onTool = pathname.startsWith("/tools/");
  const onDashboard = pathname.startsWith("/dashboard");

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSignOut = () => {
    signOut();
    setUserOpen(false);
    setMobileOpen(false);
    router.push("/");
  };

  const planLabel = user?.plan === "creator" ? "Creator" : user?.plan === "pro" ? "Pro" : user?.plan === "enterprise" ? "Enterprise" : "Free";
  const planColor = user?.plan === "creator" ? "bg-red-600" : user?.plan === "pro" ? "bg-yellow-400 text-black" : user?.plan === "enterprise" ? "bg-black" : "bg-neutral-200 text-black";

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMobileToolsOpen(false);
    setToolsOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 inset-x-0 z-50 transition-all duration-300 bg-white/85 backdrop-blur-xl border-b-2 border-black",
          isScrolled || onTool || onDashboard
            ? "shadow-[0_2px_0_0_rgba(0,0,0,0.05)]"
            : "shadow-none"
        )}
      >
        <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-18 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-black text-lg sm:text-xl tracking-tight text-black">YTForge</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Tools dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button
                onClick={() => setToolsOpen((o) => !o)}
                className="flex items-center gap-1 px-3 py-2 text-sm font-bold text-neutral-700 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors"
              >
                Tools
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform", toolsOpen && "rotate-180 text-red-600")}
                />
              </button>

              <AnimatePresence>
                {toolsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 top-full pt-3 w-[760px]"
                  >
                    <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-3 grid grid-cols-3 gap-2">
                      {tools.map((t) => (
                        
                          <Link
                          key={t.to}
                          href={t.to}
                          className="flex items-start gap-3 p-3 rounded-xl hover:bg-red-50 border-2 border-transparent hover:border-black transition-all group"
                        >
                          <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center border-2 border-black shrink-0 group-hover:rotate-3 transition-transform">
                            <t.icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <div className="font-black text-sm text-black truncate">{t.name}</div>
                              {t.upgrade && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[9px] font-black rounded-md border-2 border-black tracking-wide shrink-0">
                                  <Crown className="w-2.5 h-2.5" /> PRO
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-neutral-500 truncate">{t.desc}</div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-bold text-neutral-700 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            {user ? (
              <>
                <Link href="/dashboard" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-black text-black hover:text-red-600 transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> Dashboard
                </Link>
                <div className="relative" ref={userRef}>
                  <button
                    onClick={() => setUserOpen((o) => !o)}
                    className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  >
                    <img src={user.avatar} alt="" className="w-7 h-7 rounded-lg border-2 border-black" />
                    <span className="font-black text-sm max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className={cn("w-3.5 h-3.5 transition-transform", userOpen && "rotate-180 text-red-600")} />
                  </button>
                  <AnimatePresence>
                    {userOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-64 bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
                      >
                        <div className="p-4 border-b-2 border-black bg-gradient-to-br from-red-50 to-white">
                          <div className="flex items-center gap-3 mb-2">
                            <img src={user.avatar} alt="" className="w-10 h-10 rounded-lg border-2 border-black" />
                            <div className="min-w-0 flex-1">
                              <div className="font-black text-sm truncate">{user.name}</div>
                              <div className="text-[10px] text-neutral-500 font-bold truncate">{user.email}</div>
                            </div>
                          </div>
                          <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border-2 border-black text-white", planColor)}>
                            <Crown className="w-2.5 h-2.5" /> {planLabel} Plan
                          </div>
                        </div>
                        <div className="p-2">
                          <Link href="/dashboard" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-colors">
                            <LayoutDashboard className="w-4 h-4" /> Dashboard
                          </Link>
                          <Link href="/settings" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-colors">
                            <Settings className="w-4 h-4" /> Settings
                          </Link>
                          <Link href="/pricing" onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-colors">
                            <CreditCard className="w-4 h-4" /> Billing & Plan
                          </Link>
                        </div>
                        <div className="p-2 border-t-2 border-black bg-neutral-50">
                          <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-black text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" /> Sign Out
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href="/signin" className="px-4 py-2 text-sm font-black text-black hover:text-red-600 transition-colors">
                  Sign In
                </Link>
                <Link href="/signup" className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-black text-white bg-red-600 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                  <Sparkles className="w-4 h-4" /> Start Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            aria-label="Toggle menu"
            className="lg:hidden p-2 rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            onClick={() => setMobileOpen((o) => !o)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-[88vw] max-w-sm bg-white border-l-2 border-black flex flex-col lg:hidden"
            >
              <div className="h-16 sm:h-18 px-4 sm:px-6 flex items-center justify-between border-b-2 border-black shrink-0">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center border-2 border-black">
                    <Play className="w-4 h-4 text-white fill-white" />
                  </div>
                  <span className="font-black text-lg tracking-tight">YTForge</span>
                </div>
                <button
                  aria-label="Close menu"
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-lg border-2 border-black bg-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5">
                <button
                  onClick={() => setMobileToolsOpen((o) => !o)}
                  className="w-full flex items-center justify-between py-3 font-black text-base text-black border-b-2 border-dashed border-neutral-200"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-red-600" /> All Tools
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 transition-transform",
                      mobileToolsOpen && "rotate-180 text-red-600"
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {mobileToolsOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="grid grid-cols-1 gap-2 py-3">
                        {tools.map((t) => (
                          
                            <Link
                            key={t.to}
                            href={t.to}
                            className="flex items-center gap-3 p-2.5 rounded-xl border-2 border-black bg-white hover:bg-red-50 transition-colors"
                          >
                            <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center border-2 border-black shrink-0">
                              <t.icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <div className="font-black text-sm text-black truncate">{t.name}</div>
                                {t.upgrade && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[9px] font-black rounded-md border-2 border-black shrink-0">
                                    <Crown className="w-2.5 h-2.5" /> PRO
                                  </span>
                                )}
                              </div>
                              <div className="text-[10px] text-neutral-500 truncate">{t.desc}</div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 font-black text-base text-black border-b-2 border-dashed border-neutral-200 hover:text-red-600 transition-colors"
                  >
                    {link.name}
                  </a>
                ))}
              </div>

              <div className="p-4 sm:p-6 border-t-2 border-black bg-neutral-50 shrink-0 space-y-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 p-3 bg-white border-2 border-black rounded-xl">
                      <img src={user.avatar} alt="" className="w-10 h-10 rounded-lg border-2 border-black" />
                      <div className="min-w-0 flex-1">
                        <div className="font-black text-sm truncate">{user.name}</div>
                        <div className="text-[10px] text-neutral-500 font-bold truncate">{user.email}</div>
                      </div>
                      <div className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border-2 border-black text-white shrink-0", planColor)}>
                        <Crown className="w-2.5 h-2.5" /> {planLabel}
                      </div>
                    </div>
                    <Link href="/dashboard" className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-black text-white bg-red-600 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <button onClick={handleSignOut} className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-black text-red-600 border-2 border-black rounded-xl bg-white hover:bg-red-600 hover:text-white transition-colors uppercase tracking-wider">
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/signin" className="w-full block text-center py-3 text-sm font-black text-black border-2 border-black rounded-xl bg-white hover:bg-neutral-100 transition-colors">
                      Sign In
                    </Link>
                    <Link href="/signup" className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-black text-white bg-red-600 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" /> Start Free Trial
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
