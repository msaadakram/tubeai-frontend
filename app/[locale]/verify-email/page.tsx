"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useSearchParams } from "next/navigation";
import {
  Play,
  Mail,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Zap,
  BadgeCheck,
  RefreshCw,
  Sparkles,
  Lock,
} from "lucide-react";
import { getLocalePath } from "@/lib/i18n/utils";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { authFetch } from "@/lib/auth";
import { useCountdown } from "@/lib/useCountdown";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<PageShell status="verifying" />}>
      <VerifyInner />
    </Suspense>
  );
}

type Status = "verifying" | "success" | "error";

function VerifyInner() {
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<Status>("verifying");
  const [errorMsg, setErrorMsg] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendMsg, setResendMsg] = useState("");
  const [resendError, setResendError] = useState("");
  const [resending, setResending] = useState(false);
  const resendCd = useCountdown(60);

  const resendVerificationEmail = async () => {
    if (resendCd.active || resending) return;
    if (!/^\S+@\S+\.\S+$/.test(resendEmail.trim())) {
      setResendError("Please enter a valid email address.");
      return;
    }
    setResending(true);
    setResendError("");
    setResendMsg("");
    try {
      const data = await authFetch<{ ok: boolean; message?: string }>("/api/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email: resendEmail.trim() }),
      });
      setResendMsg(data?.message || "If an account exists that is not yet verified, a new link has been sent.");
      resendCd.start();
    } catch (err: any) {
      setResendError(err?.message || "Couldn't send the email right now. Please try again in a minute.");
    } finally {
      setResending(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    if (!token) {
      setStatus("error");
      setErrorMsg("This verification link is missing its token. Please check the full link from your email.");
      return;
    }
    (async () => {
      try {
        const data = await authFetch<{ ok: boolean; message?: string }>("/api/auth/verify-email", {
          method: "POST",
          body: JSON.stringify({ token }),
        });
        if (cancelled) return;
        if (data.ok) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMsg(data?.message || "This verification link is invalid or has expired. Please request a new one.");
        }
      } catch (err: any) {
        if (cancelled) return;
        setStatus("error");
        const http = err?.status;
        if (http && http >= 500) {
          setErrorMsg("Our servers hit a snag. Please try again in a moment.");
        } else {
          setErrorMsg(err?.message || "This verification link is invalid or has expired. Please request a new one.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <PageShell status={status}>
      <AnimatePresence mode="wait">
        {status === "verifying" && (
          <motion.div
            key="verifying"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <div className="relative w-16 h-16 mb-6">
              <div className="absolute inset-0 rounded-2xl bg-red-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-7 h-7 text-white animate-spin" />
              </div>
              <span className="absolute -top-2 -right-2 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-80" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-300 border-2 border-black" />
              </span>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-black uppercase tracking-wider mb-4 border-2 border-black">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" /> Working
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Verifying your email</h1>
            <p className="text-sm text-neutral-600 mb-7 leading-relaxed">
              Hang tight — we're confirming your address with our servers. This usually takes a second.
            </p>

            <div className="space-y-2.5">
              {[
                { t: "Reading your secure token", done: true },
                { t: "Confirming your email address", done: true },
                { t: "Activating your account", done: false },
              ].map((s, i) => (
                <div
                  key={s.t}
                  className="flex items-center gap-3 p-3 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="w-7 h-7 rounded-lg bg-neutral-50 border-2 border-black flex items-center justify-center shrink-0">
                    {s.done ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-red-600 animate-spin" />
                    )}
                  </div>
                  <span className="text-sm font-bold text-neutral-800">{s.t}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {status === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -8 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 240, damping: 16, delay: 0.05 }}
              className="w-16 h-16 rounded-2xl bg-emerald-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-6"
            >
              <CheckCircle2 className="w-8 h-8 text-white" strokeWidth={2.5} />
            </motion.div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-black uppercase tracking-wider mb-4 border-2 border-black">
              <Sparkles className="w-3 h-3" /> Verified
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Email verified</h1>
            <p className="text-sm text-neutral-600 mb-7 leading-relaxed">
              Your address is confirmed and your account is fully secure. Welcome aboard — let's make something go viral.
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { i: BadgeCheck, t: "Account active", d: "Ready to roll" },
                { i: ShieldCheck, t: "Fully protected", d: "Email-secured" },
              ].map((b) => (
                <div
                  key={b.t}
                  className="p-4 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center border-2 border-black mb-2.5">
                    <b.i className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-black uppercase tracking-wider">{b.t}</div>
                  <div className="text-[11px] text-neutral-500 font-bold mt-0.5">{b.d}</div>
                </div>
              ))}
            </div>

            <Link
              href={getLocalePath(locale, "/signin")}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider text-sm"
            >
              Continue to sign in <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={getLocalePath(locale, "/")}
              className="w-full inline-flex items-center justify-center gap-2 py-3 mt-2.5 bg-white text-black font-black rounded-xl border-2 border-black hover:bg-neutral-50 hover:-translate-y-0.5 transition-all uppercase tracking-wider text-sm"
            >
              Go to homepage
            </Link>
          </motion.div>
        )}

        {status === "error" && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 240, damping: 18 }}
              className="w-16 h-16 rounded-2xl bg-red-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-6"
            >
              <XCircle className="w-8 h-8 text-white" strokeWidth={2.5} />
            </motion.div>

            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-black uppercase tracking-wider mb-4 border-2 border-black">
              <AlertTriangle className="w-3 h-3" /> Action needed
            </div>

            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">This link didn't work</h1>
            <p className="text-sm text-neutral-600 mb-5 leading-relaxed">{errorMsg}</p>

            <div className="flex items-start gap-2.5 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3.5 mb-6 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-neutral-700 leading-relaxed">
                Verification links expire after <span className="font-black">24 hours</span>. Sign in to continue — if
                your email still isn't verified, contact us at{" "}
                <a
                  href="mailto:support@ytforge.app"
                  className="text-red-600 font-black underline decoration-2 underline-offset-2 hover:text-red-700"
                >
                  support@ytforge.app
                </a>{" "}
                and we'll fix it fast.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5">
              <Link
                href={getLocalePath(locale, "/signin")}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-red-600 text-white border-2 border-black rounded-xl font-black text-sm uppercase tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
              >
                Sign in <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={getLocalePath(locale, "/")}
                className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-white border-2 border-black rounded-xl font-black text-sm uppercase tracking-wider hover:bg-neutral-50 hover:-translate-y-0.5 transition-all"
              >
                Go home
              </Link>
            </div>

            <div className="mt-8 pt-6 border-t-2 border-dashed border-neutral-300">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <RefreshCw className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-black uppercase tracking-wider">Need a new link?</span>
              </div>
              <p className="text-xs text-neutral-600 font-bold mb-3 leading-relaxed">
                Enter the email you signed up with and we'll send a fresh verification link.
              </p>
              <div className="flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow mb-2.5">
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <input
                  type="email"
                  required
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  placeholder="you@channel.com"
                  className="flex-1 py-2.5 outline-none text-sm font-medium bg-transparent"
                />
              </div>
              {resendError && <p className="text-xs font-bold text-red-600 mb-2.5">{resendError}</p>}
              {resendMsg && (
                <div className="flex items-start gap-2 mb-2.5 p-3 bg-emerald-50 border-2 border-emerald-400 rounded-xl">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-xs font-bold text-emerald-700 leading-relaxed">{resendMsg}</p>
                </div>
              )}
              <button
                onClick={resendVerificationEmail}
                disabled={resendCd.active || resending}
                className="w-full inline-flex items-center justify-center gap-2 py-3 bg-black text-white border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] hover:shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0 transition-all"
              >
                {resending ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                {resending ? "Sending..." : resendCd.active ? `Resend in ${resendCd.left}s` : "Send new verification link"}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}

function PageShell({ status, children }: { status: Status; children?: React.ReactNode }) {
  const { locale } = useLocale();
  const statusBadge =
    status === "verifying"
      ? { label: "Verifying", color: "bg-yellow-300 text-black" }
      : status === "success"
        ? { label: "Verified", color: "bg-emerald-400 text-black" }
        : { label: "Action needed", color: "bg-red-600 text-white" };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col lg:flex-row">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-red-600 relative overflow-hidden border-r-4 border-black flex-col justify-between p-10 xl:p-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_30%,rgba(255,255,255,0.28)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_30%,#000_30%,transparent_100%)]" />
        </div>

        <div className="relative">
          <Link href={getLocalePath(locale, "/")} className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:-translate-y-0.5">
              <Play className="w-4 h-4 text-red-600 fill-red-600" />
            </div>
            <span className="font-black text-2xl tracking-tight text-white">YTForge</span>
          </Link>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur border-2 border-white/30 text-[10px] font-black uppercase tracking-wider text-white mb-4">
            <Mail className="w-3 h-3" /> Account security
          </div>
          <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-white mb-5 leading-tight [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
            One click.
            <br />
            You're in.
          </h2>
          <p className="text-red-50 text-base xl:text-lg leading-relaxed mb-8 max-w-md">
            Verifying your email keeps your account safe and unlocks everything YTForge has to offer.
          </p>
          <div className="space-y-3 max-w-md">
            {[
              { i: ShieldCheck, t: "Real protection", d: "Only you can access your account" },
              { i: Zap, t: "Instant access", d: "No waiting — verify in seconds" },
              { i: BadgeCheck, t: "Full features", d: "AI tools, analytics and more" },
            ].map((b) => (
              <div
                key={b.t}
                className="flex items-start gap-3 bg-black/20 backdrop-blur border-2 border-white/30 rounded-xl p-3"
              >
                <div className="w-9 h-9 rounded-lg bg-white text-red-600 flex items-center justify-center border-2 border-black shrink-0">
                  <b.i className="w-4 h-4" />
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
            <Lock className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="font-black text-sm text-white mb-0.5">We never share your email</div>
            <div className="text-xs text-red-100 font-bold">Your privacy is built in, not bolted on.</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden border-b-2 border-black bg-white p-4 flex items-center justify-between">
          <Link href={getLocalePath(locale, "/")} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-black text-lg tracking-tight">YTForge</span>
          </Link>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full ${statusBadge.color} text-[10px] font-black uppercase tracking-wider border-2 border-black`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80" />
            {statusBadge.label}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32, ease: "easeOut" }}
            className="w-full max-w-md"
          >
            {children}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
