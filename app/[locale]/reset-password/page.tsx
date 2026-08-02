"use client";

import React, { useState, useRef, Suspense } from "react";
import Link from "next/link";
import { motion } from "motion/react";
import { useSearchParams } from "next/navigation";
import {
  Play,
  Mail,
  Lock,
  Loader2,
  CheckCircle2,
  XCircle,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
} from "lucide-react";
import { getLocalePath } from "@/lib/i18n/utils";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { authFetch } from "@/lib/auth";
import TurnstileWidget, { TurnstileHandle } from "@/components/ui/turnstile-widget";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<PageShell loading />}>
      <PageShell>
        <ResetInner />
      </PageShell>
    </Suspense>
  );
}

type Status = "form" | "loading" | "success";

function ResetInner() {
  const searchParams = useSearchParams();
  const { locale } = useLocale();
  const token = searchParams.get("token") || "";
  const [status, setStatus] = useState<Status>("form");
  const [errorMsg, setErrorMsg] = useState("");
  const [linkBroken, setLinkBroken] = useState(false);
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const turnstileRef = useRef<TurnstileHandle>(null);

  const pwdValid = pwd.length >= 8 && pwd.length <= 128;
  const match = confirm.length > 0 && confirm === pwd;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setLinkBroken(true);
      setErrorMsg("This reset link is missing its token. Please check the full link from your email.");
      return;
    }
    if (!pwdValid) {
      setErrorMsg("Password must be at least 8 characters.");
      return;
    }
    if (!match) {
      setErrorMsg("Passwords don't match.");
      return;
    }
    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setErrorMsg("Please complete the security check.");
      return;
    }
    setStatus("loading");
    setErrorMsg("");
    try {
      const data = await authFetch<{ ok: boolean }>("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({
          token,
          newPassword: pwd,
          ...(turnstileToken ? { "cf-turnstile-response": turnstileToken } : {}),
        }),
      });
      if (data.ok) {
        setStatus("success");
      } else {
        setLinkBroken(true);
        setErrorMsg("This reset link is invalid or has expired.");
      }
    } catch (err: any) {
      const status = err?.status;
      const code = err?.code;
      // 400 INVALID_RESET_TOKEN → link broken (expired/used). Show the "request a new link" UI.
      if (status === 400 && code === "TURNSTILE_MISSING") {
        setStatus("form");
        setErrorMsg("Please complete the security check before resetting your password.");
        turnstileRef.current?.reset();
        setTurnstileToken("");
      } else if (status === 400 && (code === "INVALID_RESET_TOKEN" || code === "WEAK_PASSWORD")) {
        setLinkBroken(true);
        if (code === "WEAK_PASSWORD") {
          setErrorMsg(err?.message || "Password must be at least 8 characters.");
          setLinkBroken(false);
          setStatus("form");
        } else {
          setErrorMsg(err?.message || "This reset link is invalid or has expired.");
        }
      } else if (status && status >= 500) {
        setStatus("form");
        setErrorMsg("Our servers hit a snag. Please give it a moment and retry.");
        turnstileRef.current?.reset();
        setTurnstileToken("");
      } else {
        setStatus("form");
        setErrorMsg(err?.message || "We couldn't reach the server. Please check your connection and try again.");
        turnstileRef.current?.reset();
        setTurnstileToken("");
      }
    }
  };

  return (
    <>
      {linkBroken ? (
        <div>
          <div className="w-14 h-14 rounded-2xl bg-red-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-5">
            <XCircle className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Link not valid</h1>
          <p className="text-sm text-neutral-600 mb-6 leading-relaxed">{errorMsg}</p>
          <Link
            href={getLocalePath(locale, "/forgot-password")}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider text-sm"
          >
            Request a new link
          </Link>
        </div>
      ) : status === "success" ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-14 h-14 rounded-2xl bg-emerald-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-5">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Password updated!</h1>
          <p className="text-sm text-neutral-600 mb-7 leading-relaxed">
            Your password has been changed. All other sessions were signed out for your safety.
          </p>
          <Link
            href={getLocalePath(locale, "/signin")}
            className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider text-sm"
          >
            Continue to sign in <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      ) : (
        <div>
          <Link
            href={getLocalePath(locale, "/signin")}
            className="inline-flex items-center gap-1.5 text-xs font-black text-neutral-500 hover:text-red-600 mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to sign in
          </Link>

          <div className="w-14 h-14 rounded-2xl bg-red-600 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-5">
            <KeyRound className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Set a new password</h1>
          <p className="text-sm text-neutral-600 mb-7 leading-relaxed">
            Choose a strong password for your YTForge account. This link is single-use — after you
            reset, all other sessions will be signed out.
          </p>

          {errorMsg && (
            <div className="flex items-start gap-2.5 bg-red-50 border-2 border-red-300 rounded-xl p-3.5 mb-5">
              <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="text-xs font-bold text-red-700 leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5">New password</label>
              <div className="flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow">
                <Lock className="w-4 h-4 text-red-600 shrink-0" />
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  autoFocus
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="At least 8 characters"
                  className="flex-1 py-3 outline-none text-sm font-medium bg-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((v) => !v)}
                  className="text-neutral-400 hover:text-red-600 transition-colors"
                  aria-label={showPwd ? "Hide password" : "Show password"}
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5">Confirm password</label>
              <div className="flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow">
                <ShieldCheck className="w-4 h-4 text-red-600 shrink-0" />
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="Repeat your new password"
                  className="flex-1 py-3 outline-none text-sm font-medium bg-transparent"
                />
                {confirm.length > 0 && (
                  <span className={match ? "text-emerald-600 font-black text-xs" : "text-red-600 font-black text-xs"}>
                    {match ? "✓" : "✗"}
                  </span>
                )}
              </div>
            </div>

            {TURNSTILE_SITE_KEY && (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-500">
                    Security check
                  </label>
                  {turnstileToken ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-emerald-700">
                      <CheckCircle2 className="w-3 h-3" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                      <ShieldCheck className="w-3 h-3" /> Required
                    </span>
                  )}
                </div>
                <TurnstileWidget
                  ref={turnstileRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  onToken={(t) => setTurnstileToken(t)}
                  onExpire={() => setTurnstileToken("")}
                  theme="light"
                  size="normal"
                  className="mt-1 overflow-hidden rounded-lg border-2 border-black"
                />
                {!turnstileToken && (
                  <p className="mt-1 text-[11px] text-neutral-500 font-bold flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-yellow-600" />
                    Complete the check above to reset your password.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={status === "loading" || (Boolean(TURNSTILE_SITE_KEY) && !turnstileToken)}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all uppercase tracking-wider text-sm"
            >
              {status === "loading" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
              {status === "loading" ? "Resetting..." : "Reset password"}
            </button>
          </form>

          <div className="mt-7 grid grid-cols-3 gap-2">
            {[
              { i: ShieldCheck, t: "8+ chars" },
              { i: KeyRound, t: "Single-use" },
              { i: Mail, t: "Sessions reset" },
            ].map((b) => (
              <div key={b.t} className="flex flex-col items-center gap-1 p-3 bg-white border-2 border-black rounded-xl">
                <b.i className="w-4 h-4 text-red-600" />
                <span className="text-[10px] font-black uppercase tracking-wider text-center">{b.t}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
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
            <KeyRound className="w-3 h-3" /> Password recovery
          </div>
          <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-white mb-5 leading-tight [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
            New password.<br />Fresh start.
          </h2>
          <p className="text-red-50 text-base xl:text-lg leading-relaxed mb-8 max-w-md">
            Pick something strong and unique. You&apos;ll be back to creating in seconds.
          </p>
          <div className="space-y-3 max-w-md">
            {[
              { i: ShieldCheck, t: "Single-use link", d: "Tokens can never be reused" },
              { i: Lock, t: "All sessions reset", d: "Old logins are signed out everywhere" },
              { i: KeyRound, t: "Strong & secure", d: "Encrypted with bcrypt hashing" },
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
