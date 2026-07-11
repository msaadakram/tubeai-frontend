"use client";

import React from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { Navbar } from "../layout/Navbar";
import { Footer } from "../layout/Footer";
import { TurnstileGate } from "./TurnstileGate";

type ToolLayoutProps = {
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  children: React.ReactNode;
};

export function ToolLayout({ title, description, icon: Icon, badge, children }: ToolLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden bg-red-600 border-b-4 border-black pt-16 sm:pt-18">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.25)_0%,transparent_60%)]" />
          {/* Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
          {/* Diagonal accent stripes */}
          <div className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(45deg,transparent_0_22px,#000_22px_24px)] [mask-image:linear-gradient(to_bottom,#000,transparent_85%)]" />
          {/* Floating black orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -12, 0] }}
            transition={{ y: { duration: 6, repeat: Infinity, ease: "easeInOut" }, opacity: { duration: 0.8 } }}
            className="absolute -top-20 -left-16 w-72 h-72 rounded-full bg-black/30 blur-3xl"
          />
          {/* Floating white orb */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, 12, 0] }}
            transition={{ y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }, opacity: { duration: 0.8 } }}
            className="absolute -bottom-24 -right-10 w-80 h-80 rounded-full bg-white/30 blur-3xl"
          />
          {/* Glowing intersection dots */}
          <div className="absolute top-12 left-[14%] w-2 h-2 rounded-full bg-white shadow-[0_0_18px_4px_rgba(255,255,255,0.7)]" />
          <div className="absolute top-24 right-[18%] w-2.5 h-2.5 rounded-full bg-yellow-300 shadow-[0_0_22px_6px_rgba(253,224,71,0.7)]" />
          <div className="absolute bottom-16 left-[28%] w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_14px_3px_rgba(255,255,255,0.6)]" />
          {/* Architectural offset cards (decorative) */}
          <motion.div
            initial={{ opacity: 0, x: -10, y: 10 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden md:block absolute top-10 right-10 w-20 h-20 rotate-6 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          />
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="hidden md:block absolute bottom-10 right-32 w-12 h-12 -rotate-12 bg-yellow-300 border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
          />
          {/* Animated shimmer sweep */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: "200%" }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
            className="absolute top-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-white/15 to-transparent skew-x-12"
          />
          {/* Bottom fade into content */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-red-600" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-14 md:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl text-center sm:text-left mx-auto sm:mx-0"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full bg-black text-white text-[9px] sm:text-xs font-black tracking-wider uppercase mb-3 sm:mb-6 border-2 border-black shadow-[2px_2px_0px_0px_rgba(255,255,255,0.4)] sm:shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)] max-w-full"
            >
              <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-500 shrink-0" />
              <span className="truncate">{badge || "YTForge Tool"}</span>
            </motion.div>

            <h1 className="text-[28px] leading-[1.1] xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white mb-3 sm:mb-4 [text-shadow:_2px_2px_0_rgb(0_0_0_/_25%)] sm:[text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              {title}
            </h1>

            <p className="text-[13px] sm:text-base md:text-lg text-red-50 max-w-2xl mx-auto sm:mx-0 leading-relaxed">
              {description}
            </p>

            {/* Mobile decorative accent */}
            <div className="flex sm:hidden items-center justify-center gap-1.5 mt-5">
              <span className="w-8 h-1 rounded-full bg-white/80" />
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-300" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
              <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content — gated behind Turnstile verification */}
      <main className="flex-1 bg-neutral-50">
        <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
          <TurnstileGate>
            {children}
          </TurnstileGate>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export function ToolCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-white rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 md:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

export function PrimaryButton({
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 transition-all duration-200 text-sm sm:text-base uppercase tracking-wider ${
        props.className || ""
      }`}
    >
      {children}
    </button>
  );
}

export function ToolInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full px-4 py-3 bg-white border-2 border-black rounded-xl text-sm sm:text-base font-medium placeholder:text-neutral-400 outline-none focus:shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] transition-shadow ${
        props.className || ""
      }`}
    />
  );
}

export function ToolTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full px-4 py-3 bg-white border-2 border-black rounded-xl text-sm sm:text-base font-medium placeholder:text-neutral-400 outline-none focus:shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] transition-shadow resize-y min-h-[120px] ${
        props.className || ""
      }`}
    />
  );
}
