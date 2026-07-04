"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { PenTool, Sparkles } from "lucide-react";

const scriptSections = [
  { label: "HOOK", time: "0:00 - 0:03", text: "Wait... did you know 99% of YouTubers are doing THIS wrong?" },
  { label: "INTRO", time: "0:03 - 0:15", text: "Hey creators, today I'm breaking down the exact framework I used to hit 1M subs..." },
  { label: "MAIN POINT 1", time: "0:15 - 1:30", text: "First, let's talk about the algorithm. The watch-time signal is everything..." },
  { label: "MAIN POINT 2", time: "1:30 - 2:45", text: "Now here's the secret most gurus won't tell you: thumbnail psychology..." },
  { label: "CTA", time: "2:45 - 3:00", text: "If this helped, smash that subscribe button — let's grow together!" },
];

export function ScriptWritingDemo() {
  const [activeSection, setActiveSection] = useState(0);
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    const fullText = scriptSections[activeSection].text;
    setTypedText("");
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i <= fullText.length) {
        setTypedText(fullText.slice(0, i));
        i++;
      } else {
        clearInterval(typeInterval);
      }
    }, 25);

    const sectionTimer = setTimeout(() => {
      setActiveSection((prev) => (prev + 1) % scriptSections.length);
    }, 4500);

    return () => {
      clearInterval(typeInterval);
      clearTimeout(sectionTimer);
    };
  }, [activeSection]);

  return (
    <div className="p-3 sm:p-5 md:p-6 flex flex-col gap-3 sm:gap-4 aspect-[5/6] sm:aspect-[4/3] bg-white">
      <div className="flex items-center justify-between border-b-2 border-black pb-3">
        <div className="flex items-center gap-2">
          <PenTool className="w-5 h-5 text-red-600" />
          <div className="font-black text-black text-lg tracking-tight">script_draft.md</div>
        </div>
        <motion.div
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="flex items-center gap-1.5 text-xs font-bold text-red-600"
        >
          <div className="w-2 h-2 bg-red-600 rounded-full" />
          AI WRITING
        </motion.div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 flex-1 min-h-0">
        {/* Section list */}
        <div className="flex sm:flex-col gap-1 sm:gap-1.5 shrink-0 sm:w-32 overflow-x-auto sm:overflow-visible -mx-1 px-1 sm:mx-0 sm:px-0">
          {scriptSections.map((s, i) => (
            <motion.div
              key={i}
              animate={{
                backgroundColor: i === activeSection ? "#dc2626" : "#ffffff",
                color: i === activeSection ? "#ffffff" : "#000000",
              }}
              className="border-2 border-black rounded-md px-2 py-1 sm:py-1.5 shrink-0"
            >
              <div className="text-[9px] sm:text-[10px] font-black tracking-wider whitespace-nowrap">{s.label}</div>
              <div className="text-[8px] sm:text-[9px] opacity-70 whitespace-nowrap">{s.time}</div>
            </motion.div>
          ))}
        </div>

        {/* Typewriter area */}
        <div className="flex-1 border-2 border-black rounded-xl p-3 sm:p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col min-w-0 min-h-0">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-red-600" />
            <span className="text-[10px] font-black uppercase tracking-wider text-black">
              {scriptSections[activeSection].label} • {scriptSections[activeSection].time}
            </span>
          </div>
          <div className="flex-1 text-sm text-black font-medium leading-relaxed">
            {typedText}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ repeat: Infinity, duration: 0.6 }}
              className="inline-block w-0.5 h-4 bg-red-600 ml-0.5 align-middle"
            />
          </div>
          <div className="flex gap-2 mt-3 pt-3 border-t-2 border-dashed border-neutral-200">
            <div className="text-[10px] font-bold text-neutral-500">Words: {typedText.split(" ").length}</div>
            <div className="text-[10px] font-bold text-red-600">Hook Score: 94/100</div>
          </div>
        </div>
      </div>
    </div>
  );
}
