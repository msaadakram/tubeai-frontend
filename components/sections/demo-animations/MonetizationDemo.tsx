"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { DollarSign, Briefcase, TrendingUp } from "lucide-react";

const sponsors = [
  { name: "Squarespace", deal: "$4,200", tag: "MATCH 98%" },
  { name: "NordVPN", deal: "$3,750", tag: "MATCH 94%" },
  { name: "Notion", deal: "$2,900", tag: "MATCH 91%" },
  { name: "Audible", deal: "$3,400", tag: "MATCH 89%" },
];

export function MonetizationDemo() {
  const [revenue, setRevenue] = useState(12847);
  const [sponsorIdx, setSponsorIdx] = useState(0);

  useEffect(() => {
    const rev = setInterval(() => setRevenue((r) => r + Math.floor(Math.random() * 47) + 13), 800);
    const spon = setInterval(() => setSponsorIdx((i) => (i + 1) % sponsors.length), 2200);
    return () => {
      clearInterval(rev);
      clearInterval(spon);
    };
  }, []);

  return (
    <div className="p-3 sm:p-5 flex flex-col gap-2.5 sm:gap-3 aspect-[5/6] sm:aspect-[4/3] bg-white">
      <div className="flex items-center justify-between border-b-2 border-black pb-2">
        <div className="font-black text-black text-lg tracking-tight">Revenue Engine</div>
        <div className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-full border-2 border-black">
          THIS MONTH
        </div>
      </div>

      {/* Big revenue counter */}
      <motion.div
        className="bg-black text-white border-2 border-black rounded-xl p-3 sm:p-4 shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] sm:shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] relative overflow-hidden"
      >
        <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
          Total Earnings
        </div>
        <div className="flex items-end gap-1">
          <DollarSign className="w-6 h-6 sm:w-7 sm:h-7 text-red-600 mb-1" />
          <motion.span
            key={revenue}
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-2xl sm:text-3xl md:text-4xl font-black tabular-nums"
          >
            {revenue.toLocaleString()}
          </motion.span>
          <motion.div
            animate={{ y: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="ml-auto flex items-center gap-1 text-red-500 text-xs font-bold"
          >
            <TrendingUp className="w-3 h-3" />
            +18.2%
          </motion.div>
        </div>
        {/* Floating coins */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            initial={{ y: 60, opacity: 0, x: 30 + i * 60 }}
            animate={{ y: -80, opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.6 }}
            className="absolute bottom-0 w-5 h-5 rounded-full bg-red-600 border-2 border-white flex items-center justify-center text-[10px] font-black text-white"
          >
            $
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3 flex-1 min-h-0">
        {/* Sponsor matches */}
        <div className="border-2 border-black rounded-xl p-2.5 sm:p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col min-w-0">
          <div className="flex items-center gap-1.5 mb-2">
            <Briefcase className="w-3.5 h-3.5 text-red-600" />
            <span className="text-[10px] font-black uppercase tracking-wider">Sponsor Match</span>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={sponsorIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="flex-1 flex flex-col justify-center"
            >
              <div className="text-sm sm:text-base font-black text-black truncate">{sponsors[sponsorIdx].name}</div>
              <div className="text-lg sm:text-2xl font-black text-red-600 tabular-nums">{sponsors[sponsorIdx].deal}</div>
              <div className="mt-2 inline-block w-fit text-[9px] font-black bg-black text-white px-2 py-0.5 rounded-full">
                {sponsors[sponsorIdx].tag}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Revenue split */}
        <div className="border-2 border-black rounded-xl p-2.5 sm:p-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col min-w-0">
          <div className="text-[10px] font-black uppercase tracking-wider mb-2">Revenue Split</div>
          <div className="flex flex-col gap-2 flex-1 justify-center">
            {[
              { label: "AdSense", pct: 52, color: "bg-red-600" },
              { label: "Sponsors", pct: 31, color: "bg-black" },
              { label: "Memberships", pct: 11, color: "bg-neutral-400" },
              { label: "Merch", pct: 6, color: "bg-neutral-300" },
            ].map((row, i) => (
              <div key={i}>
                <div className="flex justify-between text-[10px] font-bold text-black mb-0.5">
                  <span>{row.label}</span>
                  <span className="tabular-nums">{row.pct}%</span>
                </div>
                <div className="h-1.5 bg-neutral-100 border border-black rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${row.pct}%` }}
                    transition={{ duration: 1, delay: i * 0.15 }}
                    className={`h-full ${row.color}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
