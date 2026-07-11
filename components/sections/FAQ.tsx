"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "@/lib/i18n/useTranslations";

export function FAQ() {
  const { t } = useTranslations();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const items = t("faq.items") as unknown as { q: string; a: string }[];
  const safeItems = Array.isArray(items) ? items : [];

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-neutral-50 border-t border-neutral-200 relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-black mb-4 sm:mb-6">
            {t("faq.title")}
          </h2>
          <p className="text-base sm:text-lg text-neutral-500">
            {t("faq.subtitle")}
          </p>
        </div>

        <div className="space-y-4">
          {safeItems.map((faq, i) => (
            <div
              key={i}
              className="border border-neutral-200 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 p-4 sm:p-6 text-left group"
              >
                <span className="font-bold text-black text-base sm:text-lg group-hover:text-red-600 transition-colors">{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform duration-300 ${
                    openIndex === i ? "rotate-180 text-red-600" : "text-neutral-400 group-hover:text-red-600"
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm sm:text-base text-neutral-600 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
