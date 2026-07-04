"use client";

import { motion, AnimatePresence } from "motion/react";
import { Loader2, X } from "lucide-react";

type Props = {
  open: boolean;
  text: string;
  onCancel?: () => void;
  title?: string;
};

export function StreamingPreview({ open, text, onCancel, title = "Generating" }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="overflow-hidden"
        >
          <div className="relative mt-4 rounded-xl border-2 border-black bg-neutral-50 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex items-center justify-between px-3 py-2 border-b-2 border-black bg-black text-white">
              <div className="flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span className="text-[11px] font-black uppercase tracking-wider">{title}</span>
              </div>
              {onCancel && (
                <button
                  onClick={onCancel}
                  aria-label="Cancel generation"
                  className="p-1 rounded hover:bg-white/20 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <pre className="max-h-64 overflow-auto p-3 text-[12px] leading-relaxed text-neutral-700 font-mono whitespace-pre-wrap break-words">
              {text || "…"}
              <motion.span
                aria-hidden
                className="inline-block w-[6px] h-[1em] align-text-bottom ml-0.5 bg-red-600"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.9, repeat: Infinity, ease: "linear" }}
              />
            </pre>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
