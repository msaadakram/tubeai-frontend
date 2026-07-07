"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading" || status === "success") return;

    const trimmed = email.trim();
    if (!/^\S+@\S+\.\S+$/.test(trimmed)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    setMessage("");

    const base = process.env.NEXT_PUBLIC_API_URL || "https://tubeai-backend.vercel.app";
    try {
      const res = await fetch(`${base}/api/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-source": "homepage-newsletter" },
        body: JSON.stringify({ email: trimmed }),
      });

      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || `Failed to subscribe (${res.status})`);
      }

      setStatus("success");
      setMessage("You're in! Check your inbox this Sunday.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <section className="py-16 sm:py-20 md:py-24 relative overflow-hidden bg-neutral-950">
      {/* Soft red glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[40rem] h-[24rem] rounded-full bg-red-600/20 blur-3xl pointer-events-none" />
      {/* Subtle grid */}
      <div className="absolute inset-0 opacity-[0.06] bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,#000_30%,transparent_75%)]" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-red-600/40 bg-red-600/10 px-3 py-1 mb-5">
            <Mail className="w-3.5 h-3.5 text-red-500" />
            <span className="text-[11px] font-semibold uppercase tracking-widest text-red-500">
              The Sunday Drop
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white mb-3 sm:mb-4">
            Join 50K+ creators growing weekly
          </h2>
          <p className="text-sm sm:text-base text-neutral-400 mb-8 max-w-xl mx-auto">
            One email every Sunday. Viral case studies, algorithm updates, and the exact tactics
            top creators use this week.
          </p>

          {status === "success" ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto flex max-w-md items-center justify-center gap-3 rounded-2xl border border-green-600/30 bg-green-600/10 px-5 py-4 text-green-300"
            >
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{message}</span>
            </motion.div>
          ) : (
            <form onSubmit={submit} className="mx-auto flex max-w-md flex-col sm:flex-row gap-3">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                aria-label="Email address"
                className="flex-1 h-12 sm:h-14 rounded-full bg-neutral-900 border border-neutral-800 px-5 text-sm sm:text-base text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-red-600/60 focus:border-red-600 transition"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                className="group inline-flex h-12 sm:h-14 items-center justify-center gap-2 rounded-full bg-red-600 px-6 sm:px-7 text-sm sm:text-base font-bold text-white shadow-lg shadow-red-600/25 hover:bg-red-500 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {status === "loading" ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <>
                    Subscribe
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </button>
            </form>
          )}

          {(status === "error" || message) && status === "error" && (
            <p className="mt-3 text-xs text-red-400">{message}</p>
          )}

          <p className="mt-5 text-[11px] text-neutral-500">
            No spam. Unsubscribe anytime.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
