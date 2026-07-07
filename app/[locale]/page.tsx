"use client";

import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Features } from "@/components/sections/Features";
import { Demo } from "@/components/sections/Demo";
import { AIFeatures } from "@/components/sections/AIFeatures";
import { Testimonials } from "@/components/sections/Testimonials";
import { Pricing } from "@/components/sections/Pricing";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-red-600/20 selection:text-red-900">
      <Navbar />
      <main>
        <Hero />

        {/* Trusted By Section — looping marquee */}
        <section className="py-10 sm:py-12 border-y border-neutral-200 bg-white relative z-20 overflow-hidden">
          <p className="text-center text-xs sm:text-sm font-bold text-red-600 mb-6 sm:mb-8 tracking-widest uppercase px-4">
            Trusted by over 10,000 creators and agencies
          </p>
          <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_10%,#000_90%,transparent)]">
            <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-12 md:gap-24 pr-12 md:pr-24">
              {[...Array(2)].map((_, dup) => (
                <div key={dup} className="flex shrink-0 items-center gap-12 md:gap-24" aria-hidden={dup === 1}>
                  {["MrBeast", "Ali Abdaal", "Marques Brownlee", "Colin & Samir", "Think Media"].map((logo) => (
                    <div
                      key={`${dup}-${logo}`}
                      className="text-lg sm:text-xl md:text-2xl font-bold font-serif italic text-black hover:text-red-600 transition-colors cursor-pointer whitespace-nowrap"
                    >
                      {logo}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <style>{`
            @keyframes marquee {
              from { transform: translateX(0); }
              to { transform: translateX(-50%); }
            }
          `}</style>
        </section>

        <Features />
        <Demo />
        <AIFeatures />
        <Testimonials />
        <Pricing />
        <FAQ />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
