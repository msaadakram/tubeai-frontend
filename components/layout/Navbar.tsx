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
  Crown,
  Tag as TagIcon,
  Code2,
  QrCode,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalePath } from "@/lib/i18n/utils";
import { LanguageSwitcher } from "./LanguageSwitcher";

const toolsList = [
  { key: "viral-title-generator", to: "/tools/viral-title-generator", icon: TrendingUp, upgrade: false },
  { key: "ai-script-writer", to: "/tools/ai-script-writer", icon: PenTool, upgrade: false },
  { key: "thumbnail-downloader", to: "/tools/thumbnail-downloader", icon: Download, upgrade: false },
  { key: "thumbnail-preview", to: "/tools/thumbnail-preview", icon: ImageIcon, upgrade: false },
  { key: "embed-generator", to: "/tools/embed-generator", icon: Code2, upgrade: false },
  { key: "qr-code-generator", to: "/tools/qr-code-generator", icon: QrCode, upgrade: false },
  { key: "seo-analyzer", to: "/tools/seo-analyzer", icon: LineChart, upgrade: false },
  { key: "channel-analytics", to: "/tools/channel-analytics", icon: BarChart3, upgrade: false },
  { key: "channel-id-finder", to: "/tools/channel-id-finder", icon: Hash, upgrade: false },
  { key: "monetization-checker", to: "/tools/monetization-checker", icon: DollarSign, upgrade: false },
  { key: "ai-transcript", to: "/tools/ai-transcript", icon: FileText, upgrade: false },
  { key: "shorts-ideas", to: "/tools/shorts-ideas", icon: Video, upgrade: true },
  { key: "earnings-calculator", to: "/tools/earnings-calculator", icon: Calculator, upgrade: false },
  { key: "ai-thumbnail-generator", to: "/tools/ai-thumbnail-generator", icon: ImageIcon, upgrade: true },
  { key: "hashtag-generator", to: "/tools/hashtag-generator", icon: Hash, upgrade: false },
  { key: "tag-generator", to: "/tools/tag-generator", icon: TagIcon, upgrade: false },
] as const;

export function Navbar() {
  const { t } = useTranslations();
  const { locale } = useLocale();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileToolsOpen, setMobileToolsOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const userRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const onTool = pathname.includes("/tools/");
  const onDashboard = pathname.includes("/dashboard");

  const navLinks = [
    { name: t("nav.features"), href: getLocalePath(locale, "/features") },
    { name: t("nav.blog"), href: getLocalePath(locale, "/blog") },
    { name: t("nav.chat"), href: getLocalePath(locale, "/chat") },
    { name: t("nav.demo"), href: getLocalePath(locale, "/demo") },
    { name: t("nav.disclaimer"), href: getLocalePath(locale, "/disclaimer") },
    { name: t("nav.pricing"), href: getLocalePath(locale, "/pricing") },
  ];

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
    router.push(getLocalePath(locale, "/"));
  };

  const planLabel = user?.plan === "pro" ? "Pro" : user?.plan === "enterprise" ? "Enterprise" : "Free";
  const planColor = user?.plan === "pro" ? "bg-red-600 text-white" : user?.plan === "enterprise" ? "bg-black text-white" : "bg-neutral-200 text-black";

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
          <Link href={getLocalePath(locale, "/")} className="flex items-center gap-2 group shrink-0">
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
                {t("nav.tools")}
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
                      {toolsList.map((tool) => {
                        const tr = t(`features.tools.${tool.key}`);
                        return (
                          <Link
                            key={tool.to}
                            href={getLocalePath(locale, tool.to)}
                            className="flex items-start gap-3 p-3 rounded-xl hover:bg-red-50 border-2 border-transparent hover:border-black transition-all group"
                          >
                            <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center border-2 border-black shrink-0 group-hover:rotate-3 transition-transform">
                              <tool.icon className="w-4 h-4" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <div className="font-black text-sm text-black truncate">{tr.title}</div>
                                {tool.upgrade && (
                                  <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[9px] font-black rounded-md border-2 border-black tracking-wide shrink-0">
                                    <Crown className="w-2.5 h-2.5" /> PRO
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-neutral-500 truncate">{tr.description}</div>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="px-3 py-2 text-sm font-bold text-neutral-700 hover:text-black rounded-lg hover:bg-neutral-100 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden lg:flex items-center gap-2">
            <LanguageSwitcher />

            {user ? (
              <>
                <Link href={getLocalePath(locale, "/dashboard")} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-black text-black hover:text-red-600 transition-colors">
                  <LayoutDashboard className="w-4 h-4" /> {t("nav.dashboard")}
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
                          <Link href={getLocalePath(locale, "/dashboard")} onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-colors">
                            <LayoutDashboard className="w-4 h-4" /> {t("nav.dashboard")}
                          </Link>
                          <Link href={getLocalePath(locale, "/settings")} onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-colors">
                            <Settings className="w-4 h-4" /> {t("nav.settings")}
                          </Link>
                          <Link href={getLocalePath(locale, "/pricing")} onClick={() => setUserOpen(false)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-50 hover:text-red-600 transition-colors">
                            <CreditCard className="w-4 h-4" /> {t("nav.billing")}
                          </Link>
                        </div>
                        <div className="p-2 border-t-2 border-black bg-neutral-50">
                          <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-black text-red-600 hover:bg-red-600 hover:text-white transition-colors">
                            <LogOut className="w-4 h-4" /> {t("nav.signOut")}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href={getLocalePath(locale, "/signin")} className="px-4 py-2 text-sm font-black text-black hover:text-red-600 transition-colors">
                  {t("nav.signIn")}
                </Link>
                <Link href={getLocalePath(locale, "/signup")} className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-black text-white bg-red-600 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                  <Sparkles className="w-4 h-4" /> {t("nav.startFree")}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher compact />
            <button
              aria-label={t("nav.toggleMenu")}
              className="p-2 rounded-lg border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
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
                  aria-label={t("nav.closeMenu")}
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
                    <Sparkles className="w-4 h-4 text-red-600" /> {t("nav.allTools")}
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
                        {toolsList.map((tool) => {
                          const tr = t(`features.tools.${tool.key}`);
                          return (
                            <Link
                              key={tool.to}
                              href={getLocalePath(locale, tool.to)}
                              className="flex items-center gap-3 p-2.5 rounded-xl border-2 border-black bg-white hover:bg-red-50 transition-colors"
                            >
                              <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center border-2 border-black shrink-0">
                                <tool.icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <div className="font-black text-sm text-black truncate">{tr.title}</div>
                                  {tool.upgrade && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-[9px] font-black rounded-md border-2 border-black shrink-0">
                                      <Crown className="w-2.5 h-2.5" /> PRO
                                    </span>
                                  )}
                                </div>
                                <div className="text-[10px] text-neutral-500 truncate">{tr.description}</div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-neutral-400 shrink-0" />
                            </Link>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 font-black text-base text-black border-b-2 border-dashed border-neutral-200 hover:text-red-600 transition-colors"
                  >
                    {link.name}
                  </Link>
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
                    <Link href={getLocalePath(locale, "/dashboard")} className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-black text-white bg-red-600 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
                      <LayoutDashboard className="w-4 h-4" /> {t("nav.dashboard")}
                    </Link>
                    <button onClick={handleSignOut} className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-black text-red-600 border-2 border-black rounded-xl bg-white hover:bg-red-600 hover:text-white transition-colors uppercase tracking-wider">
                      <LogOut className="w-4 h-4" /> {t("nav.signOut")}
                    </button>
                  </>
                ) : (
                  <>
                    <Link href={getLocalePath(locale, "/signin")} className="w-full block text-center py-3 text-sm font-black text-black border-2 border-black rounded-xl bg-white hover:bg-neutral-100 transition-colors">
                      {t("nav.signIn")}
                    </Link>
                    <Link href={getLocalePath(locale, "/signup")} className="w-full inline-flex items-center justify-center gap-2 py-3 text-sm font-black text-white bg-red-600 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider">
                      <Sparkles className="w-4 h-4" /> {t("nav.startFreeTrial")}
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
