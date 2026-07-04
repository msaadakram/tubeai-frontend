"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Calendar, Flame, Target, Lightbulb } from "lucide-react";

const trendingTopics = [
  { topic: "AI Productivity Hacks", heat: 94, tag: "RISING" },
  { topic: "Day in the Life Vlogs", heat: 81, tag: "STEADY" },
  { topic: "Tech Reviews 2026", heat: 88, tag: "HOT" },
  { topic: "Faceless Channels", heat: 96, tag: "VIRAL" },
  { topic: "Mini Documentaries", heat: 73, tag: "RISING" },
];

const videoIdeas = [
  "I Used AI to Plan My Entire Month — Here's What Happened",
  "Why Faceless YouTube Channels Are Taking Over in 2026",
  "The 3-Minute Morning Routine That Changed Everything",
  "I Reverse-Engineered MrBeast's Thumbnail Strategy",
  "Building a Channel from 0 to 100K With Only AI",
];

const calendar = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export function StrategyDemo() {
  const [trendIdx, setTrendIdx] = useState(0);
  const [ideaIdx, setIdeaIdx] = useState(0);
  const [activeDay, setActiveDay] = useState(0);
  const [niche, setNiche] = useState(72);

  useEffect(() => {
    const trendInt = setInterval(() => setTrendIdx((i) => (i + 1) % trendingTopics.length), 1400);
    const ideaInt = setInterval(() => setIdeaIdx((i) => (i + 1) % videoIdeas.length), 2400);
    const dayInt = setInterval(() => setActiveDay((d) => (d + 1) % 7), 700);
    const nicheInt = setInterval(() => setNiche(60 + Math.floor(Math.random() * 35)), 1100);
    return () => {
      clearInterval(trendInt);
      clearInterval(ideaInt);
      clearInterval(dayInt);
      clearInterval(nicheInt);
    };
  }, []);

  const visibleTrends = [0, 1, 2].map((o) => trendingTopics[(trendIdx + o) % trendingTopics.length]);

  return (
    <div className="p-3 sm:p-5 flex flex-col gap-2.5 sm:gap-3 aspect-[5/6] sm:aspect-[4/3] bg-white">
      <div className="flex items-center justify-between border-b-2 border-black pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-red-600" />
          <div className="font-black text-black text-lg tracking-tight">Strategy Planner</div>
        </div>
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-full border-2 border-black"
        >
          AI BRAINSTORMING
        </motion.div>
      </div>

      {/* Hot idea spotlight */}
      <div className="border-2 border-black rounded-xl p-2.5 sm:p-3 bg-black text-white shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] sm:shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] relative overflow-hidden">
        <div className="flex items-center gap-1.5 mb-1">
          <Lightbulb className="w-3.5 h-3.5 text-red-500" />
          <span className="text-[10px] font-black uppercase tracking-wider text-neutral-400">Next Video Idea</span>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={ideaIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="text-xs sm:text-sm font-black leading-tight"
          >
            "{videoIdeas[ideaIdx]}"
          </motion.div>
        </AnimatePresence>
        <div className="flex gap-2 mt-2 text-[9px] font-bold">
          <span className="bg-red-600 text-white px-2 py-0.5 rounded-full">VIRAL POTENTIAL 92</span>
          <span className="bg-white text-black px-2 py-0.5 rounded-full">8 MIN</span>
          <span className="border border-neutral-600 text-neutral-300 px-2 py-0.5 rounded-full">TUTORIAL</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1 min-h-0">
        {/* Trending heatmap */}
        <div className="border-2 border-black rounded-xl p-2.5 sm:p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col overflow-hidden min-w-0">
          <div className="flex items-center gap-1.5 mb-2">
            <Flame className="w-3.5 h-3.5 text-red-600" />
            <span className="text-[10px] font-black uppercase tracking-wider">Trending Now</span>
          </div>
          <div className="flex flex-col gap-1.5 flex-1">
            <AnimatePresence mode="popLayout">
              {visibleTrends.map((t) => (
                <motion.div
                  key={t.topic}
                  layout
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="border border-black rounded-md p-1.5"
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-black truncate">{t.topic}</span>
                    <span className="text-[8px] font-black text-red-600 shrink-0">{t.tag}</span>
                  </div>
                  <div className="h-1 bg-neutral-100 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${t.heat}%` }}
                      transition={{ duration: 0.6 }}
                      className="h-full bg-red-600"
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Niche match radar */}
        <div className="border-2 border-black rounded-xl p-2.5 sm:p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 mb-2">
            <Target className="w-3.5 h-3.5 text-red-600" />
            <span className="text-[10px] font-black uppercase tracking-wider">Niche Fit</span>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-24 sm:h-24 -rotate-90">
              <circle cx="50" cy="50" r="42" stroke="#e5e5e5" strokeWidth="8" fill="none" />
              <motion.circle
                cx="50"
                cy="50"
                r="42"
                stroke="#dc2626"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray="263.9"
                initial={{ strokeDashoffset: 263.9 }}
                animate={{ strokeDashoffset: 263.9 - (niche / 100) * 263.9 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <motion.span
                key={niche}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-xl sm:text-2xl font-black text-black tabular-nums"
              >
                {niche}
              </motion.span>
              <span className="text-[9px] font-bold text-neutral-500 -mt-1">MATCH</span>
            </div>
          </div>
          <div className="text-[9px] font-bold text-black text-center">Tech / Productivity</div>
        </div>
      </div>

      {/* Posting calendar */}
      <div className="border-2 border-black rounded-lg px-3 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
        <Calendar className="w-3.5 h-3.5 text-red-600 shrink-0" />
        <span className="text-[10px] font-black uppercase tracking-wider text-black shrink-0">Plan</span>
        <div className="flex gap-1 flex-1 justify-end">
          {calendar.map((d, i) => (
            <motion.div
              key={d}
              animate={{
                backgroundColor: i === activeDay ? "#dc2626" : i === 1 || i === 3 || i === 5 ? "#000000" : "#ffffff",
                color: i === activeDay || i === 1 || i === 3 || i === 5 ? "#ffffff" : "#000000",
                scale: i === activeDay ? 1.1 : 1,
              }}
              className="w-7 h-7 border-2 border-black rounded-md flex items-center justify-center text-[9px] font-black"
            >
              {d}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
