"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, TrendingUp, Hash, Trophy } from "lucide-react";

const keywordPool = [
  { kw: "ai video editing 2026", vol: "248K", diff: 42 },
  { kw: "youtube algorithm hack", vol: "189K", diff: 38 },
  { kw: "viral shorts formula", vol: "412K", diff: 51 },
  { kw: "best thumbnail design", vol: "156K", diff: 29 },
  { kw: "monetize small channel", vol: "98K", diff: 24 },
  { kw: "youtube seo guide", vol: "327K", diff: 47 },
];

const titleVariants = [
  "How I Hit 1M Subs Using AI",
  "The AI Trick YouTubers HATE (Works in 2026)",
  "I Tried AI Video Tools for 30 Days — Shocking Results",
];

export function SeoDemo() {
  const [rank, setRank] = useState(47);
  const [keywordIdx, setKeywordIdx] = useState(0);
  const [titleIdx, setTitleIdx] = useState(0);

  useEffect(() => {
    const rankInt = setInterval(() => {
      setRank((r) => (r > 1 ? r - 1 : 47));
    }, 600);
    const kwInt = setInterval(() => setKeywordIdx((i) => (i + 1) % keywordPool.length), 1200);
    const titleInt = setInterval(() => setTitleIdx((i) => (i + 1) % titleVariants.length), 2500);
    return () => {
      clearInterval(rankInt);
      clearInterval(kwInt);
      clearInterval(titleInt);
    };
  }, []);

  const visibleKeywords = [0, 1, 2, 3].map((offset) => keywordPool[(keywordIdx + offset) % keywordPool.length]);

  return (
    <div className="p-3 sm:p-5 flex flex-col gap-2.5 sm:gap-3 aspect-[5/6] sm:aspect-[4/3] bg-white">
      <div className="flex items-center justify-between border-b-2 border-black pb-2">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-red-600" />
          <div className="font-black text-black text-lg tracking-tight">SEO Optimizer</div>
        </div>
        <motion.div
          animate={{ opacity: [1, 0.4, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="flex items-center gap-1.5 text-[10px] font-black text-red-600"
        >
          <div className="w-2 h-2 bg-red-600 rounded-full" />
          CRAWLING
        </motion.div>
      </div>

      {/* Search bar with live typing */}
      <div className="border-2 border-black rounded-lg px-3 py-2 flex items-center gap-2 bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <Search className="w-4 h-4 text-black shrink-0" />
        <AnimatePresence mode="wait">
          <motion.div
            key={keywordIdx}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            className="flex-1 text-sm font-bold text-black truncate"
          >
            {keywordPool[keywordIdx].kw}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="inline-block w-0.5 h-3.5 bg-red-600 ml-0.5 align-middle"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1 min-h-0">
        {/* Rank tracker */}
        <div className="border-2 border-black rounded-xl p-2.5 sm:p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-black text-white flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <Trophy className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Search Rank</span>
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-[10px] font-bold text-neutral-500">#</span>
            <motion.span
              key={rank}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="text-3xl sm:text-4xl font-black tabular-nums text-white"
            >
              {rank}
            </motion.span>
            <motion.div
              animate={{ y: [0, -3, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="ml-auto flex items-center gap-1 text-[10px] font-bold text-red-500"
            >
              <TrendingUp className="w-3 h-3 rotate-180" />
              CLIMBING
            </motion.div>
          </div>
          <div className="mt-auto pt-2">
            <div className="flex justify-between text-[9px] font-bold text-neutral-500 mb-1">
              <span>Goal: #1</span>
              <span className="tabular-nums">{Math.round(((47 - rank) / 46) * 100)}%</span>
            </div>
            <div className="h-1.5 bg-neutral-800 border border-neutral-700 rounded-full overflow-hidden">
              <motion.div
                animate={{ width: `${((47 - rank) / 46) * 100}%` }}
                transition={{ duration: 0.5 }}
                className="h-full bg-red-600"
              />
            </div>
          </div>
        </div>

        {/* Keyword discovery */}
        <div className="border-2 border-black rounded-xl p-2.5 sm:p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden min-w-0">
          <div className="flex items-center gap-1.5 mb-2">
            <Hash className="w-3.5 h-3.5 text-red-600" />
            <span className="text-[10px] font-black uppercase tracking-wider">Keywords Found</span>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <AnimatePresence mode="popLayout">
              {visibleKeywords.map((k) => (
                <motion.div
                  key={k.kw}
                  layout
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center justify-between gap-2 border border-black rounded-md px-2 py-1 bg-white"
                >
                  <span className="text-[10px] font-bold text-black truncate">{k.kw}</span>
                  <span className="text-[9px] font-black text-red-600 tabular-nums shrink-0">{k.vol}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Title A/B testing */}
      <div className="border-2 border-black rounded-lg px-3 py-2 bg-red-600 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-center justify-between gap-2">
          <div className="text-[10px] font-black uppercase tracking-wider opacity-80 shrink-0">Title A/B</div>
          <AnimatePresence mode="wait">
            <motion.div
              key={titleIdx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="flex-1 text-xs font-black truncate text-right"
            >
              {titleVariants[titleIdx]}
            </motion.div>
          </AnimatePresence>
          <div className="text-[10px] font-black bg-black px-2 py-0.5 rounded-full shrink-0">CTR 14.2%</div>
        </div>
      </div>
    </div>
  );
}
