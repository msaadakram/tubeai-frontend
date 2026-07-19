"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useInView } from "motion/react";
import { ArrowRight } from "lucide-react";
import { MonetizationChecker } from "./MonetizationChecker";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalePath } from "@/lib/i18n/utils";

const TEASER_PATHS = [
  "/tools/seo-analyzer",
  "/tools/viral-title-generator",
  "/tools/ai-script-writer",
  "/tools/qr-code-generator",
  "/tools/thumbnail-preview",
  "/tools/monetization-checker",
  "/tools/channel-analytics",
  "/tools/embed-generator",
];

function CountUp({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const target = match ? parseFloat(match[1]) : 0;
  const suffix = match ? match[2] : value;
  const decimals = match && match[1].includes(".") ? match[1].split(".")[1].length : 0;

  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: "some" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  const shown = decimals > 0 ? display.toFixed(decimals) : Math.round(display).toString();

  return (
    <div ref={ref} className={className}>
      {shown}
      {suffix}
    </div>
  );
}

export function Hero() {
  const router = useRouter();
  const { t } = useTranslations();
  const { locale } = useLocale();
  const [teaserIndex, setTeaserIndex] = useState(0);

  const teasers: string[] = t("hero.teasers") as unknown as string[];

  useEffect(() => {
    const id = setInterval(() => {
      setTeaserIndex((i) => (i + 1) % TEASER_PATHS.length);
    }, 2600);
    return () => clearInterval(id);
  }, []);

  const teaserLabel = Array.isArray(teasers) ? teasers[teaserIndex] ?? "" : "";
  const teaserPath = TEASER_PATHS[teaserIndex];

  return (
    <section className="relative pt-20 sm:pt-24 pb-16 sm:pb-20 md:pb-24 overflow-hidden bg-red-600">
      <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_30%,transparent_100%)]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.22)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.22)_1px,transparent_1px)] bg-[size:4rem_4rem]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.08)_1px,transparent_1px)] bg-[size:1rem_1rem]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5)_1px,transparent_1.5px)] bg-[size:4rem_4rem]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60rem] h-[40rem] rounded-full bg-white/10 blur-3xl" />
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_47%,rgba(255,255,255,0.08)_49%,rgba(255,255,255,0.12)_50%,rgba(255,255,255,0.08)_51%,transparent_53%),linear-gradient(-45deg,transparent_47%,rgba(0,0,0,0.06)_49%,rgba(0,0,0,0.1)_50%,rgba(0,0,0,0.06)_51%,transparent_53%)] bg-[size:10rem_10rem,14rem_14rem] opacity-90 [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_85%)]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative w-full max-w-7xl mx-auto rounded-[2.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl bg-black border-4 border-white"
        >
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute -top-24 -right-24 w-[30rem] h-[30rem] rounded-full border-[40px] border-red-600/30 blur-2xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[50rem] rounded-full border-[60px] border-white/5 blur-3xl" />
          </div>

          <div className="relative px-4 sm:px-8 md:px-16 py-10 sm:py-16 md:py-24 lg:py-32 flex flex-col items-center text-center lg:items-start lg:text-left justify-center min-h-[55vh] sm:min-h-[60vh] md:min-h-[70vh]">

            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.25 }}
              className="text-[1.75rem] xs:text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white mb-4 sm:mb-6 leading-[1.08] max-w-4xl"
            >
              {t("hero.headlinePre")}{" "}
              <br className="hidden sm:block" />
              {t("hero.headlineMid")}{" "}
              <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-red-300 to-red-500">
                {t("hero.headlineAccent")}
              </span>
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.38 }}
              className="grid grid-cols-3 sm:flex sm:flex-wrap sm:items-center gap-y-3 gap-x-0 sm:gap-x-8 md:gap-x-10 w-full sm:w-auto justify-center lg:justify-start mb-7 sm:mb-10"
            >
              {[
                { value: "10K+", label: t("hero.statCreators") },
                { value: "50M+", label: t("hero.statViews") },
                { value: "14",   label: t("hero.statTools") },
              ].map((stat, i) => (
                <div key={stat.label} className="flex flex-col sm:flex-row items-center sm:items-start gap-0 sm:gap-8 md:gap-10">
                  <div className="text-center sm:text-left">
                    <CountUp
                      value={stat.value}
                      className="text-lg xs:text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-none"
                    />
                    <div className="text-[9px] xs:text-[10px] sm:text-xs text-neutral-400 uppercase tracking-[0.14em] font-medium mt-0.5">
                      {stat.label}
                    </div>
                  </div>
                  {i < 2 && (
                    <div className="hidden sm:block h-8 md:h-10 w-px bg-white/15 shrink-0" />
                  )}
                </div>
              ))}
            </motion.div>

            <MonetizationChecker />

            <motion.button
              type="button"
              onClick={() => router.push(getLocalePath(locale, teaserPath))}
              aria-label={teaserLabel}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.58 }}
              whileHover={{ scale: 1.025 }}
              whileTap={{ scale: 0.97 }}
              className="relative mt-3 sm:mt-2 bg-white rounded-full inline-flex items-center self-center lg:self-start p-1 sm:p-1.5 pl-3 sm:pl-5 md:pl-8 border-[3px] border-black shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)] z-20 group cursor-pointer hover:border-red-600 transition-colors overflow-hidden text-left max-w-[calc(100%-2rem)] sm:max-w-none"
            >
              <motion.span
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.98, 1.04, 0.98] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="pointer-events-none absolute -inset-1 rounded-full bg-red-600/20 blur-md -z-10"
              />
              <motion.span
                initial={{ x: "-150%" }}
                animate={{ x: "150%" }}
                transition={{ duration: 2.2, repeat: Infinity, repeatDelay: 1.4, ease: "easeInOut" }}
                className="pointer-events-none absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-red-600/12 to-transparent"
              />

              <span className="relative mr-2 sm:mr-4 md:mr-8 h-[18px] sm:h-5 md:h-6 overflow-hidden flex items-center min-w-[7rem] xs:min-w-[8.5rem] sm:min-w-[11rem] md:min-w-[14rem]">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={teaserLabel}
                    initial={{ y: "110%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-110%", opacity: 0 }}
                    transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-0 flex items-center text-black text-[11px] xs:text-xs sm:text-sm md:text-base font-bold group-hover:text-red-600 transition-colors whitespace-nowrap"
                  >
                    {teaserLabel}
                  </motion.span>
                </AnimatePresence>
              </span>

              <div className="relative w-8 h-8 xs:w-9 xs:h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-red-600 flex items-center justify-center group-hover:bg-red-700 transition-colors shadow-md shrink-0 overflow-hidden">
                <motion.span
                  animate={{ scale: [1, 1.45, 1], opacity: [0.45, 0, 0.45] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 rounded-full bg-white/30"
                />
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" />
                </motion.div>
              </div>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
