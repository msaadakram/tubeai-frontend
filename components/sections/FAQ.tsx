"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown } from "lucide-react";

const faqs = [
  {
    question: "Do I need to give YTForge access to my YouTube account?",
    answer: "For basic features like the Title Generator and Script Writer, no account connection is required. To access Advanced Analytics and automated SEO optimization, you can optionally connect your channel via YouTube's official, secure OAuth API.",
  },
  {
    question: "How accurate is the Monetization Checker?",
    answer: "Our Monetization Checker uses the exact same NLP models that YouTube employs for its automated advertiser-friendly guidelines check. It accurately flags 98% of potential demonetization risks before you even film.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Yes, you can cancel your subscription at any time from your account settings. You will continue to have access to your plan until the end of your current billing cycle.",
  },
  {
    question: "Is the AI trained specifically on YouTube data?",
    answer: "Yes! Unlike generic AI tools, YTForge is trained on a proprietary dataset of over 50 million high-performing YouTube videos, focusing on retention graphs, click-through rates, and metadata optimization.",
  },
  {
    question: "Do you offer an API for agencies?",
    answer: "Yes, our Enterprise plan includes full API access so you can integrate our title generation, SEO analysis, and scripting tools directly into your custom agency workflows.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 sm:py-20 md:py-24 bg-neutral-50 border-t border-neutral-200 relative">
      <div className="container mx-auto px-4 sm:px-6 max-w-3xl">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-black mb-4 sm:mb-6">
            Frequently asked questions
          </h2>
          <p className="text-base sm:text-lg text-neutral-500">
            Everything you need to know about the product and billing.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-neutral-200 bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between gap-3 p-4 sm:p-6 text-left group"
              >
                <span className="font-bold text-black text-base sm:text-lg group-hover:text-red-600 transition-colors">{faq.question}</span>
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
                      {faq.answer}
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
