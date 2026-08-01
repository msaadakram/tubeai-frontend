"use client";

import React, { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { motion } from "motion/react";
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
} from "lucide-react";
import { getLocalePath } from "@/lib/i18n/utils";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useCountdown } from "@/lib/useCountdown";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://api.ytforge.app";

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<PageShell loading />}>
      <PageShell>
        <VerifyInner />
      </PageShell>
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
      const res = await fetch(`${API_BASE}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok) {
        setResendMsg(data?.message || "If an account exists that is not yet verified, a new link has been sent.");
        resendCd.start();
      } else {
        setResendError(data?.message || "Couldn't send the email right now. Please try again in a minute.");
      }
    } catch {
      setResendError("Couldn't reach the server. Please check your connection and try again.");
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
        const res = await fetch(`${API_BASE}/api/auth/verify-email`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });
        if (cancelled) return;
        const data = await res.json();
        if (res.ok && data.ok) {
          setStatus("success");
        } else {
          setStatus("error");
          setErrorMsg(
            data?.message ||
              "This verification link is invalid or has expired. Please request a new one."
          );
        }
      } catch {
        if (!cancelled) {
          setStatus("error");
          setErrorMsg("We couldn't reach the verification service. Please try again in a moment.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <PageShell>
      {status === "verifying" && (
        <div>
          <div className="w-14 h-14 rounded-2xl bg-red-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-5">
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Verifying your email…</h1>
          <p className="text-sm text-neutral-600 mb-7 leading-relaxed">
            Please wait a moment while we confirm your address.
          </p>
        </div>
      )}

      {status === "success" && (
        <div>
          <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 260, damping: 18 }}>
            <div className="w-14 h-14 rounded-2xl bg-emerald-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-5">
              <CheckCircle2 className="w-7 h-7 text-white" />
            </div>
          </motion.div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Email verified!</h1>
          <p className="text-sm text-neutral-600 mb-7 leading-relaxed">
            Your email address is confirmed. Your account is fully secure — welcome aboard.
          </p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {[
              { i: BadgeCheck, t: "Account active" },
              { i: ShieldCheck, t: "Fully protected" },
            ].map((b) => (
              <div key={b.t} className="flex flex-col items-center gap-1.5 p-4 bg-white border-2 border-black rounded-xl">
                <b.i className="w-5 h-5 text-red-600" />
                <span className="text-[11px] font-black uppercase tracking-wider text-center">{b.t}</span>
              </div>
            ))}
          </div>
          <Link
            href={getLocalePath(locale, "/signin")}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider text-sm"
          >
            Continue to sign in <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {status === "error" && (
        <div>
          <div className="w-14 h-14 rounded-2xl bg-red-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-5">
            <XCircle className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Link not valid</h1>
          <p className="text-sm text-neutral-600 mb-4 leading-relaxed">{errorMsg}</p>
          <div className="flex items-start gap-2.5 bg-yellow-50 border-2 border-yellow-300 rounded-xl p-3.5 mb-6">
            <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-xs font-bold text-neutral-700 leading-relaxed">
              Verification links expire after 24 hours. Sign in to continue — if your email still
              isn&apos;t verified, contact <span className="text-red-600">support@ytforge.app</span> and we&apos;ll fix it fast.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link
              href={getLocalePath(locale, "/signin")}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-red-600 text-white border-2 border-black rounded-xl font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              Sign in <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={getLocalePath(locale, "/")}
              className="flex-1 inline-flex items-center justify-center gap-2 py-3 bg-white border-2 border-black rounded-xl font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              Go home
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t-2 border-dashed border-neutral-200">
            <div className="flex items-center gap-2 mb-3">
              <RefreshCw className="w-4 h-4 text-red-600" />
              <span className="text-xs font-black uppercase tracking-wider">Need a new link?</span>
            </div>
            <p className="text-xs text-neutral-600 font-bold mb-3 leading-relaxed">
              Enter the email you signed up with and we&apos;ll send a fresh verification link.
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
            {resendError && (
              <p className="text-xs font-bold text-red-600 mb-2.5">{resendError}</p>
            )}
            {resendMsg && (
              <p className="text-xs font-bold text-emerald-700 mb-2.5 leading-relaxed">{resendMsg}</p>
            )}
            <button
              onClick={resendVerificationEmail}
              disabled={resendCd.active || resending}
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 bg-white border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0 transition-all"
            >
              {resending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              {resending
                ? "Sending..."
                : resendCd.active
                  ? `Resend in ${resendCd.left}s`
                  : "Send new verification link"}
            </button>
          </div>
        </div>
      )}
    </PageShell>
  );
}

function PageShell({ loading, children }: { loading?: boolean; children?: React.ReactNode }) {
  const { locale } = useLocale();
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col lg:flex-row">
      {/* Left brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-red-600 relative overflow-hidden border-r-4 border-black flex-col justify-between p-10 xl:p-14">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_30%_30%,rgba(255,255,255,0.25)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_30%,#000_30%,transparent_100%)]" />
        </div>
        <div className="relative">
          <Link href={getLocalePath(locale, "/")} className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
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
            One click.<br />You&apos;re in.
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
              <div key={b.t} className="flex items-start gap-3 bg-black/20 backdrop-blur border-2 border-white/30 rounded-xl p-3">
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
            <ShieldCheck className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="font-black text-sm text-white mb-0.5">Verification is instant</div>
            <div className="text-xs text-red-100 font-bold">We never share your email with anyone.</div>
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex flex-col">
        <div className="lg:hidden border-b-2 border-black bg-white p-4 flex items-center justify-between">
          <Link href={getLocalePath(locale, "/")} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-black text-lg tracking-tight">YTForge</span>
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          {loading ? (
            <Loader2 className="w-8 h-8 animate-spin text-red-600" />
          ) : (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
