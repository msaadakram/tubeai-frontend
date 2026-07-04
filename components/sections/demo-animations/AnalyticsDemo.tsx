"use client";

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import { TrendingUp, Eye, Users, Clock } from "lucide-react";

function useCounter(target: number, duration = 1500) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      setValue(Math.floor(target * progress));
      if (progress >= 1) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [target, duration]);
  return value;
}

export function AnalyticsDemo() {
  const [tick, setTick] = useState(0);
  const views = useCounter(1247893 + tick * 137);
  const subs = useCounter(48291 + tick * 3);
  const watchTime = useCounter(8472 + tick);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1500);
    return () => clearInterval(interval);
  }, []);

  const chartData = [40, 65, 50, 80, 70, 95, 85, 100, 92, 78, 88, 100];

  return (
    <div className="p-3 sm:p-5 flex flex-col gap-2.5 sm:gap-3 aspect-[5/6] sm:aspect-[4/3] bg-white">
      <div className="flex items-center justify-between border-b-2 border-black pb-2">
        <div className="font-black text-black text-lg tracking-tight">Live Analytics</div>
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-2 h-2 bg-red-600 rounded-full"
          />
          <span className="text-red-600">REAL-TIME</span>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {[
          { icon: Eye, label: "Views", value: views.toLocaleString(), bg: "bg-red-600", text: "text-white" },
          { icon: Users, label: "Subs", value: subs.toLocaleString(), bg: "bg-black", text: "text-white" },
          { icon: Clock, label: "Watch hrs", value: watchTime.toLocaleString(), bg: "bg-white", text: "text-black" },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`${kpi.bg} ${kpi.text} border-2 border-black rounded-lg p-2 sm:p-2.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] min-w-0`}
          >
            <kpi.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 mb-1" />
            <div className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider opacity-80">{kpi.label}</div>
            <div className="text-sm sm:text-base font-black tabular-nums truncate">{kpi.value}</div>
          </motion.div>
        ))}
      </div>

      {/* Live chart */}
      <div className="flex-1 border-2 border-black rounded-xl p-2.5 sm:p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2">
          <div className="text-[10px] font-black uppercase tracking-wider">Views / Hour</div>
          <div className="flex items-center gap-1 text-[10px] font-bold text-red-600">
            <TrendingUp className="w-3 h-3" />
            +24.7%
          </div>
        </div>
        <div className="flex-1 flex items-end gap-1">
          {chartData.map((h, i) => (
            <motion.div
              key={`${i}-${tick}`}
              initial={{ height: 0 }}
              animate={{ height: `${h + ((tick + i) % 7) * 2}%` }}
              transition={{ duration: 0.8, delay: i * 0.04 }}
              className={`flex-1 rounded-t border-2 border-black ${
                i === chartData.length - 1 ? "bg-red-600" : i % 2 === 0 ? "bg-black" : "bg-white"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Audience pulse */}
      <div className="border-2 border-black rounded-lg px-3 py-2 flex items-center justify-between bg-black text-white">
        <div className="text-[10px] font-black uppercase tracking-wider">CTR</div>
        <div className="flex-1 mx-3 h-1.5 bg-neutral-700 rounded-full overflow-hidden">
          <motion.div
            animate={{ width: ["40%", "78%", "62%", "85%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="h-full bg-red-600"
          />
        </div>
        <div className="text-xs font-black tabular-nums">12.4%</div>
      </div>
    </div>
  );
}
