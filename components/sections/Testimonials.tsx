"use client";

import React from "react";
import { motion } from "motion/react";
import { Play } from "lucide-react";

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 sm:py-20 md:py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">

        {/* Top Stats Section */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 mb-16 sm:mb-24 md:mb-32 relative">
          
          {/* Sideways Text */}
          <div className="hidden lg:block w-12 border-l border-neutral-200 relative">
            <div className="absolute top-0 -left-6 transform -rotate-90 origin-top-left text-neutral-400 text-xs tracking-[0.2em] font-medium whitespace-nowrap">
              OUR ACHIEVEMENTS
            </div>
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 sm:mb-12 md:mb-16 gap-6 md:gap-8">
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-black max-w-xl">
                Why Choose YTForge for <br />
                your channel
              </h2>
              <p className="text-neutral-500 text-sm max-w-sm">
                We've won many awards for our works. Our AI models are trained on the top 1% of performing videos.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 border-b border-neutral-200 pb-10 sm:pb-14 md:pb-16">
              {[
                { value: "+10K", label: "Creators" },
                { value: "+50M", label: "Extra Views" },
                { value: "12", label: "AI Models" },
                { value: "$2M+", label: "Creator Revenue" }
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className="text-3xl sm:text-4xl md:text-6xl font-bold text-red-600 mb-2 font-mono tracking-tighter">
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-black uppercase tracking-wider">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Empowering Section with Floating Rings */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative grid lg:grid-cols-[1.15fr_0.85fr] bg-white border border-neutral-200 rounded-3xl sm:rounded-[2.5rem] overflow-hidden shadow-[0_30px_80px_-30px_rgba(0,0,0,0.25)]"
        >
          {/* Left: Content */}
          <div className="relative p-6 sm:p-10 md:p-16 lg:p-20 overflow-hidden">
            {/* Subtle grid backdrop */}
            {/* Modern diagonal stripe pattern */}
            <div
              className="absolute inset-0 z-0 opacity-[0.035]"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #000 0px, #000 1px, transparent 1px, transparent 12px)",
              }}
            />
            {/* Radial spotlight fade over stripes */}
            {/* Animated breathing orb — top-left */}
            <motion.div
              animate={{ scale: [1, 1.25, 1], opacity: [0.18, 0.38, 0.18], x: [0, 12, 0], y: [0, -10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-12 -left-12 sm:-top-16 sm:-left-16 w-40 h-40 sm:w-64 sm:h-64 rounded-full bg-red-600/20 blur-[60px] sm:blur-[90px] z-0 pointer-events-none"
            />
            {/* Animated breathing orb — bottom-right */}
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.12, 0.28, 0.12], x: [0, -14, 0], y: [0, 12, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
              className="absolute -bottom-10 -right-10 sm:-bottom-14 sm:-right-14 w-32 h-32 sm:w-56 sm:h-56 rounded-full bg-red-500/15 blur-[50px] sm:blur-[80px] z-0 pointer-events-none"
            />
            {/* Soft red glow */}
            <div className="absolute -left-24 -top-24 w-72 h-72 rounded-full bg-red-600/10 blur-3xl z-0" />

            <div className="relative z-10 max-w-2xl">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 mb-6 sm:mb-8 px-3.5 py-1.5 rounded-full bg-red-600/10 border border-red-600/20">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-red-600 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-red-600" />
                </span>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-red-600">
                  Built for creators
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-5xl font-bold text-black mb-4 sm:mb-6 leading-tight tracking-tight">
                We're empowering <br />
                <span className="text-red-600">the next generation of</span> <br />
                Creators.
              </h3>
              <p className="text-neutral-600 text-base sm:text-lg mb-8 sm:mb-10 md:mb-12 max-w-md leading-relaxed">
                YTForge was founded by engineers, creators and product managers from leading tech companies to level the playing field.
              </p>

              {/* Platform logos */}
              <div className="flex flex-wrap items-center gap-3">
                {["YouTube", "Twitch", "TikTok", "Instagram"].map((platform) => (
                  <div
                    key={platform}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-neutral-200 text-sm sm:text-base font-bold text-black shadow-sm hover:border-red-600/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group"
                  >
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 fill-red-600 group-hover:scale-110 transition-transform" />
                    {platform}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Black showcase panel with floating rings */}
          <div className="relative bg-black overflow-hidden min-h-[260px] lg:min-h-full p-8 sm:p-10 md:p-16 flex flex-col justify-end">
            <motion.div
              animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-10 top-10 w-48 h-48 rounded-full border-[32px] border-red-600/20 z-0"
              style={{ transformStyle: "preserve-3d", perspective: "1000px" }}
            />
            <motion.div
              animate={{ y: [0, 20, 0], rotate: [0, -15, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute right-24 bottom-24 w-24 h-24 rounded-full border-[16px] border-red-600/40 z-0"
            />
            <motion.div
              animate={{ y: [0, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 2 }}
              className="absolute left-10 top-16 w-12 h-12 rounded-full border-[8px] border-red-600/60 z-0"
            />
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
              className="absolute left-1/2 top-1/2 w-8 h-8 rounded-full border-[6px] border-red-600 z-0"
            />
            {/* Bottom fade for legibility */}
            <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent z-[1]" />

            {/* Highlight stat */}
            <div className="relative z-10">
              <div className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-2 font-mono tracking-tighter">
                98<span className="text-red-600">%</span>
              </div>
              <p className="text-neutral-400 text-sm sm:text-base max-w-[16rem] leading-relaxed">
                of creators saw faster channel growth within their first month using YTForge.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
