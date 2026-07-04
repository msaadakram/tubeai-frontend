"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Youtube, Search, DollarSign, TrendingUp, Users, Briefcase, Loader2 } from "lucide-react";

type Result = {
  channel: string;
  subs: string;
  monthlyMin: number;
  monthlyMax: number;
  rpm: string;
  sponsorValue: string;
  growthScore: number;
};

// NOTE: Replace this mock with a real YouTube Data API call.
// Endpoint suggestion: GET https://www.googleapis.com/youtube/v3/channels?part=statistics&key=YOUR_API_KEY_HERE
function generateMockResult(input: string): Result {
  const cleaned = input.replace(/^@/, "").split("/").pop() || "channel";
  const seed = cleaned.length * 137 + cleaned.charCodeAt(0);
  const subsK = 50 + (seed % 950);
  const rpm = 2 + ((seed % 70) / 10);
  const monthlyMin = Math.round(subsK * rpm * 0.8);
  const monthlyMax = Math.round(subsK * rpm * 2.4);
  return {
    channel: cleaned,
    subs: subsK > 999 ? `${(subsK / 1000).toFixed(1)}M` : `${subsK}K`,
    monthlyMin,
    monthlyMax,
    rpm: `$${rpm.toFixed(2)}`,
    sponsorValue: `$${(subsK * 12).toLocaleString()}`,
    growthScore: 60 + (seed % 38),
  };
}

export function MonetizationChecker() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      setResult(generateMockResult(input.trim()));
      setLoading(false);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="w-full max-w-2xl mb-8 sm:mb-10"
    >
      <div className="flex items-center gap-2 mb-3 text-white/70 text-xs font-bold uppercase tracking-wider">
        <DollarSign className="w-3.5 h-3.5 text-red-500" />
        Free Tool · Channel Earnings Estimator
      </div>

      <form
        onSubmit={handleCheck}
        className="relative flex items-center bg-white rounded-2xl border-[3px] border-white shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] overflow-hidden focus-within:shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] transition-shadow"
      >
        <div className="pl-4 pr-2 shrink-0">
          <Youtube className="w-6 h-6 text-red-600" />
        </div>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste channel URL or @handle..."
          className="flex-1 py-3 sm:py-4 px-2 bg-transparent text-black placeholder:text-neutral-400 outline-none text-sm md:text-base font-medium min-w-0"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="m-1.5 px-4 md:px-6 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shrink-0"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden md:inline">Analyzing</span>
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              <span className="hidden md:inline">Check Earnings</span>
            </>
          )}
        </button>
      </form>

      {/* Suggestions */}
      {!result && !loading && (
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-white/50 text-xs">Try:</span>
          {["@MrBeast", "@MKBHD", "@veritasium"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setInput(s)}
              className="text-xs font-bold text-white/80 hover:text-white border border-white/20 hover:border-white/50 rounded-full px-3 py-1 transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Result Card */}
      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="mt-4 bg-white rounded-2xl border-[3px] border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden"
          >
            <div className="px-5 py-3 bg-black text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center font-black text-sm uppercase">
                  {result.channel.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-black">@{result.channel}</div>
                  <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                    <Users className="w-3 h-3" /> {result.subs} subscribers
                  </div>
                </div>
              </div>
              <div className="px-2 py-0.5 bg-red-600 rounded-full text-[10px] font-black tracking-wider">
                ESTIMATE
              </div>
            </div>

            <div className="p-3 sm:p-5 grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3">
              <div className="border-2 border-black rounded-xl p-3 bg-red-600 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <DollarSign className="w-4 h-4 mb-1" />
                <div className="text-[9px] font-bold uppercase tracking-wider opacity-90">Monthly</div>
                <div className="text-base font-black tabular-nums leading-tight">
                  ${result.monthlyMin.toLocaleString()}
                </div>
                <div className="text-[10px] font-bold opacity-80">to ${result.monthlyMax.toLocaleString()}</div>
              </div>

              <div className="border-2 border-black rounded-xl p-3 bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <TrendingUp className="w-4 h-4 mb-1 text-red-600" />
                <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Avg RPM</div>
                <div className="text-base font-black tabular-nums">{result.rpm}</div>
                <div className="text-[10px] font-bold text-neutral-500">per 1K views</div>
              </div>

              <div className="border-2 border-black rounded-xl p-3 bg-white text-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Briefcase className="w-4 h-4 mb-1 text-red-600" />
                <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-500">Sponsor /yr</div>
                <div className="text-base font-black tabular-nums">{result.sponsorValue}</div>
                <div className="text-[10px] font-bold text-neutral-500">est. value</div>
              </div>

              <div className="border-2 border-black rounded-xl p-3 bg-black text-white shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]">
                <div className="text-[9px] font-bold uppercase tracking-wider text-neutral-400 mb-1">Growth Score</div>
                <div className="text-base font-black tabular-nums">{result.growthScore}/100</div>
                <div className="h-1 bg-neutral-700 rounded-full mt-1.5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${result.growthScore}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-full bg-red-600"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
