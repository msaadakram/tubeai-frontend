"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import {
  Play,
  Mail,
  ArrowRight,
  ArrowLeft,
  Loader2,
  KeyRound,
  ShieldCheck,
  Clock,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  LifeBuoy,
  Lock,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";

const reassurances = [
  { icon: ShieldCheck, t: "Bank-grade security", d: "Reset links are signed, single-use, and expire fast" },
  { icon: Clock, t: "15-minute expiry", d: "Links expire automatically — no lingering tokens" },
  { icon: Lock, t: "Account stays safe", d: "Your data and AI history remain locked until you reset" },
];

const faqs = [
  { q: "I didn't get the email", a: "Check spam, or request a new link. Corporate firewalls sometimes delay delivery by a few minutes." },
  { q: "Link says expired", a: "Reset links last 15 minutes. Just hit 'Resend' below to get a fresh one." },
  { q: "Wrong email on file", a: "Contact support@ytforge.app from any address — we'll verify and update your account." },
];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
      setCooldown(30);
      const timer = setInterval(() => {
        setCooldown((c) => {
          if (c <= 1) {
            clearInterval(timer);
            return 0;
          }
          return c - 1;
        });
      }, 1000);
    }, 1100);
  };

  const resend = () => {
    if (cooldown > 0) return;
    setCooldown(30);
    const timer = setInterval(() => {
      setCooldown((c) => {
        if (c <= 1) {
          clearInterval(timer);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col lg:flex-row">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-red-600 relative overflow-hidden border-r-4 border-black flex-col justify-between p-10 xl:p-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_30%,rgba(255,255,255,0.25)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_30%,#000_30%,transparent_100%)]" />
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -top-20 -left-16 w-72 h-72 rounded-full bg-black/30 blur-3xl" />
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 7, repeat: Infinity, delay: 1 }} className="absolute -bottom-24 -right-10 w-80 h-80 rounded-full bg-white/30 blur-3xl" />

          <motion.div animate={{ y: [0, -10, 0], rotate: [4, 6, 4] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-28 right-14 w-28 h-28 bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-3 flex flex-col justify-center">
            <KeyRound className="w-6 h-6 text-red-600 mb-1" />
            <div className="font-black text-[10px]">Secure reset</div>
            <div className="text-[8px] text-neutral-500 font-bold">Single-use link</div>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0], rotate: [-6, -8, -6] }} transition={{ duration: 9, repeat: Infinity, delay: 0.5 }} className="absolute bottom-40 left-10 w-32 h-20 bg-yellow-300 border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-3 flex items-center gap-2">
            <Clock className="w-5 h-5 text-black" />
            <div>
              <div className="font-black text-[10px]">15 min</div>
              <div className="text-[8px] text-black/70 font-bold">Expires fast</div>
            </div>
          </motion.div>
        </div>

        <div className="relative">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Play className="w-4 h-4 text-red-600 fill-red-600" />
            </div>
            <span className="font-black text-2xl tracking-tight text-white">YTForge</span>
          </Link>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur border-2 border-white/30 text-[10px] font-black uppercase tracking-wider text-white mb-4">
            <KeyRound className="w-3 h-3" /> Account recovery
          </div>
          <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-white mb-5 leading-tight [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
            Locked out?<br />Let's get you back in.
          </h2>
          <p className="text-red-50 text-base xl:text-lg leading-relaxed mb-8 max-w-md">
            Forgot your password? No drama. We'll send a one-tap reset link to the email on file — secure, fast, and good for 15 minutes.
          </p>

          <div className="space-y-3 max-w-md">
            {reassurances.map((b) => (
              <div key={b.t} className="flex items-start gap-3 bg-black/20 backdrop-blur border-2 border-white/30 rounded-xl p-3">
                <div className="w-9 h-9 rounded-lg bg-white text-red-600 flex items-center justify-center border-2 border-black shrink-0">
                  <b.icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-black text-sm text-white">{b.t}</div>
                  <div className="text-xs text-red-100 font-bold">{b.d}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative bg-black/30 backdrop-blur border-2 border-white/30 rounded-xl p-5 max-w-md flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-yellow-300 border-2 border-black flex items-center justify-center shrink-0">
            <LifeBuoy className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="font-black text-sm text-white mb-0.5">Need a human?</div>
            <div className="text-xs text-red-100 font-bold">support@ytforge.app — we reply in under 4 hours.</div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col">
        <div className="lg:hidden border-b-2 border-black bg-white p-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-black text-lg tracking-tight">YTForge</span>
          </Link>
          <Link href="/signin" className="text-xs font-black text-red-600 hover:text-black">
            Sign In →
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <Link href="/signin" className="inline-flex items-center gap-1.5 text-xs font-black text-neutral-500 hover:text-red-600 mb-6 group">
              <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to sign in
            </Link>

            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.div key="form" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -8 }}>
                  <div className="w-14 h-14 rounded-2xl bg-red-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-5">
                    <KeyRound className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Forgot password?</h1>
                  <p className="text-sm text-neutral-600 mb-7 leading-relaxed">
                    Enter the email tied to your YTForge account and we'll send you a secure link to set a new password.
                  </p>

                  <form onSubmit={submit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1.5">Email address</label>
                      <div className="flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow">
                        <Mail className="w-4 h-4 text-red-600 shrink-0" />
                        <input
                          type="email"
                          required
                          autoFocus
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@channel.com"
                          className="flex-1 py-3 outline-none text-sm font-medium bg-transparent"
                        />
                      </div>
                      <p className="text-[11px] text-neutral-500 font-bold mt-1.5 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-yellow-600" />
                        Use the email you signed up with — even if it's not your daily address.
                      </p>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all uppercase tracking-wider text-sm"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                      {loading ? "Sending link..." : "Send reset link"}
                    </button>
                  </form>

                  <div className="mt-7 grid grid-cols-3 gap-2">
                    {[
                      { i: ShieldCheck, t: "Encrypted" },
                      { i: Clock, t: "15-min link" },
                      { i: Sparkles, t: "1-click reset" },
                    ].map((b) => (
                      <div key={b.t} className="flex flex-col items-center gap-1 p-3 bg-white border-2 border-black rounded-xl">
                        <b.i className="w-4 h-4 text-red-600" />
                        <span className="text-[10px] font-black uppercase tracking-wider text-center">{b.t}</span>
                      </div>
                    ))}
                  </div>

                  <p className="mt-7 text-center text-xs text-neutral-500 font-bold">
                    Remembered it?{" "}
                    <Link href="/signin" className="text-red-600 underline">
                      Sign in instead
                    </Link>
                    {" · "}
                    <Link href="/signup" className="text-red-600 underline">
                      Create account
                    </Link>
                  </p>
                </motion.div>
              ) : (
                <motion.div key="sent" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                  <div className="w-14 h-14 rounded-2xl bg-emerald-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-5">
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Check your inbox</h1>
                  <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
                    If an account exists for <span className="font-black text-black">{email}</span>, a reset link is on its way. The link expires in 15 minutes.
                  </p>

                  <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 mb-5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-3">Next steps</div>
                    <ol className="space-y-2.5">
                      {[
                        "Open the email from no-reply@ytforge.app",
                        "Click the secure 'Reset password' button",
                        "Choose a strong new password (8+ chars)",
                        "Sign back in and pick up where you left off",
                      ].map((s, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm font-bold">
                          <span className="w-5 h-5 rounded-md bg-red-600 text-white border-2 border-black flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">{i + 1}</span>
                          {s}
                        </li>
                      ))}
                    </ol>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      onClick={resend}
                      disabled={cooldown > 0}
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-white border-2 border-black rounded-xl font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0 transition-all"
                    >
                      <RefreshCw className={`w-4 h-4 ${cooldown > 0 ? "" : "group-hover:rotate-180"} transition-transform`} />
                      {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend link"}
                    </button>
                    <Link
                      href="/signin"
                      className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-red-600 text-white border-2 border-black rounded-xl font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                    >
                      Back to sign in <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <button onClick={() => setSent(false)} className="mt-4 w-full text-center text-xs text-neutral-500 font-bold hover:text-red-600">
                    Wrong email? <span className="underline">Try a different address</span>
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FAQ */}
            <div className="mt-10 pt-8 border-t-2 border-dashed border-neutral-200">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-4 h-4 text-red-600" />
                <span className="text-xs font-black uppercase tracking-wider">Common questions</span>
              </div>
              <div className="space-y-2">
                {faqs.map((f) => (
                  <details key={f.q} className="group bg-white border-2 border-black rounded-xl px-4 py-3 cursor-pointer">
                    <summary className="flex items-center justify-between font-black text-sm list-none">
                      {f.q}
                      <span className="text-red-600 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                    </summary>
                    <p className="mt-2 text-xs text-neutral-600 font-bold leading-relaxed">{f.a}</p>
                  </details>
                ))}
              </div>
            </div>

            <p className="mt-8 text-center text-[11px] text-neutral-500 leading-relaxed">
              Protected by enterprise-grade encryption. Read our{" "}
              <Link href="/privacy" className="underline font-bold">Privacy Policy</Link> and{" "}
              <Link href="/terms" className="underline font-bold">Terms</Link>.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
