"use client";

import React from "react";
import { motion } from "motion/react";
import { Button } from "../ui/button";
import { ArrowRight } from "lucide-react";

export function CTA() {
  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-white">
      <div className="absolute inset-0 bg-neutral-50" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto rounded-3xl p-1 relative overflow-hidden shadow-2xl">
          {/* Subtle animated border effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-red-400 via-red-500 to-red-400 animate-[spin_4s_linear_infinite]" />

          <div className="relative rounded-[23px] bg-red-600 px-6 py-12 sm:px-8 sm:py-16 md:px-16 md:py-20 text-center">
             <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
             >
                <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-white mb-4 sm:mb-6">
                  Ready to 10x your YouTube channel?
                </h2>
                <p className="text-base sm:text-lg text-red-100 mb-8 sm:mb-10 max-w-2xl mx-auto">
                  Join 10,000+ creators who are using YTForge to work smarter, rank higher, and grow faster. Start your 14-day free trial today.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button size="lg" className="w-full sm:w-auto h-14 px-8 text-lg gap-2 bg-white text-red-600 hover:bg-red-50 rounded-full font-bold shadow-lg">
                    Get Started for Free <ArrowRight className="w-5 h-5" />
                  </Button>
                  <p className="text-sm text-red-200 mt-4 sm:mt-0 sm:ml-4">
                    No credit card required.
                  </p>
                </div>
             </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
