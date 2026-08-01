"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { getLocalePath } from "@/lib/i18n/utils";
import { useCountdown } from "@/lib/useCountdown";
import { motion } from "motion/react";
import { toast } from "sonner";
import TurnstileWidget, { TurnstileHandle } from "@/components/ui/turnstile-widget";
import GoogleCredentialButton from "@/components/auth/GoogleCredentialButton";
import {
  Play,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  User,
  Gift,
  Star,
  Rocket,
  Zap,
  Shield,
  AlertCircle,
  RefreshCw,
  Inbox,
} from "lucide-react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "";

const PERK_ICONS = [Gift, Sparkles, Zap, Shield];

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function strength(pwd: string) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

export default function SignUpPage() {
  return (
    <React.Suspense fallback={<SignUpSkeleton />}>
      <SignUpPageInner />
    </React.Suspense>
  );
}

function SignUpSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-red-600" />
    </div>
  );
}

function SignUpPageInner() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [agree, setAgree] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const [referrerName, setReferrerName] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [resendError, setResendError] = useState("");
  const [existingCode, setExistingCode] = useState("");

  const turnstileRef = useRef<TurnstileHandle>(null);
  const score = strength(pwd);
  const colors = ["bg-neutral-200", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-600"];
  const resendCd = useCountdown(60);

  const { signUp, signInWithGoogle, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { locale } = useLocale();
  const { t } = useTranslations();
  const searchParams = useSearchParams();

  const labels = t("auth.strengthLabels");
  const perks = t("auth.perks").map((p, i) => ({ ...p, icon: PERK_ICONS[i] }));
  const agreeUpPostParts = t("auth.agreeSignUpPost").split("Privacy Policy");

  // ── Redirect already-authenticated users away from this page ──────────────
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(getLocalePath(locale, "/dashboard"));
    }
  }, [user, authLoading, router, locale]);

  useEffect(() => {
    const code = searchParams.get("ref") || "";
    if (code) {
      setReferralCode(code);
      const base = process.env.NEXT_PUBLIC_API_URL || "https://api.ytforge.app";
      fetch(`${base}/api/referral/lookup?code=${encodeURIComponent(code)}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((d) => d?.referral?.name && setReferrerName(d.referral.name))
        .catch(() => {});
    }
  }, [searchParams]);

  // Show a full-screen spinner while auth state is resolving
  if (authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  const handleGoogleSuccess = async (idToken: string) => {
    setGoogleLoading(true);
    setError(null);
    const res = await signInWithGoogle(idToken, referralCode.trim() || undefined);
    setGoogleLoading(false);
    if (res.ok) {
      toast.success(t("auth.accountCreated"));
      router.push(getLocalePath(locale, "/dashboard"));
    } else {
      setError(res.error);
    }
  };

  const handleGoogleError = (message: string) => {
    setError(message);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree || loading) return;

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError(t("auth.captchaRequired"));
      return;
    }

    setError(null);
    setExistingCode("");
    setLoading(true);
    const res = await signUp(name.trim(), email.trim(), pwd, referralCode.trim() || undefined, turnstileToken || undefined);
    setLoading(false);

    if (res.ok) {
      setRegisteredEmail(email.trim());
      resendCd.start();
    } else {
      setExistingCode(res.code || "");
      turnstileRef.current?.reset();
      setTurnstileToken("");
      setError(res.error);
    }
  };

  const resendVerificationEmail = async () => {
    if (resendCd.active || !registeredEmail) return;
    setResendError("");
    const base = process.env.NEXT_PUBLIC_API_URL || "https://api.ytforge.app";
    try {
      const res = await fetch(`${base}/api/auth/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registeredEmail }),
      });
      if (res.ok) {
        toast.success(t("auth.verificationSent"));
        resendCd.start();
      } else {
        const data = await res.json().catch(() => null);
        setResendError(data?.message || t("auth.verificationResendFailed"));
      }
    } catch {
      setResendError(t("auth.verificationResendFailed"));
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
      <div className="lg:hidden border-b-2 border-black bg-white p-4 flex items-center justify-between">
        <Link href={getLocalePath(locale, "/")} className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-black text-lg tracking-tight">YTForge</span>
        </Link>
        <Link href={getLocalePath(locale, "/signin")} className="text-xs font-black text-red-600 hover:text-black">
          {t("auth.signIn")} →
        </Link>
      </div>

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 order-2 lg:order-1">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          {registeredEmail ? (
            <EmailSentPanel
              email={registeredEmail}
              resendCd={resendCd}
              resendError={resendError}
              onResend={resendVerificationEmail}
              onGoDashboard={() => router.push(getLocalePath(locale, "/dashboard"))}
            />
          ) : (
            <>
          <div className="hidden lg:flex mb-10">
            <Link href={getLocalePath(locale, "/")} className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-black text-2xl tracking-tight">YTForge</span>
            </Link>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-300 text-black text-[10px] font-black uppercase tracking-wider mb-4 border-2 border-black">
            <Gift className="w-3 h-3" /> {t("auth.freeBadge")}
          </div>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">{t("auth.signUpTitle")}</h1>
            <p className="text-sm text-neutral-600">
              {t("auth.alreadyMember")}{" "}
              <Link href={getLocalePath(locale, "/signin")} className="text-red-600 font-black underline">
                {t("auth.signIn")}
              </Link>
            </p>
          </div>

          <div className="space-y-3 mb-6">
            {GOOGLE_CLIENT_ID ? (
              <div>
                <GoogleCredentialButton
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                />
                {googleLoading && (
                  <div className="flex items-center justify-center gap-2 mt-2 text-xs text-neutral-500 font-bold">
                    <Loader2 className="w-3 h-3 animate-spin" /> {t("auth.signingInGoogle")}
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                disabled
                title="Google OAuth not configured"
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] opacity-40 cursor-not-allowed"
              >
                <GoogleIcon /> {t("auth.signUpGoogle")}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-0.5 bg-black" />
            <span className="text-xs font-black uppercase tracking-wider text-neutral-500">{t("auth.orWithEmail")}</span>
            <div className="flex-1 h-0.5 bg-black" />
          </div>

          <form onSubmit={submit} className="space-y-4">
            {error && (
              <div className="flex items-start gap-2 p-3 bg-red-50 border-2 border-red-500 rounded-xl text-xs font-bold text-red-700">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}
            {existingCode === "EMAIL_EXISTS_NO_PASSWORD" && (
              <div className="flex flex-col gap-2 p-3.5 bg-yellow-50 border-2 border-yellow-400 rounded-xl">
                <p className="text-xs font-bold text-neutral-800 leading-relaxed">
                  You already have an account with this email — it was created with Google. Sign in
                  with Google below, or set a password via the reset link and use email login.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <button
                    type="button"
                    onClick={() => router.push(getLocalePath(locale, "/forgot-password"))}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-white border-2 border-black rounded-lg font-black text-xs uppercase tracking-wider hover:bg-neutral-50 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5 text-red-600" /> Reset password
                  </button>
                  {GOOGLE_CLIENT_ID && (
                    <button
                      type="button"
                      onClick={() => router.push(getLocalePath(locale, "/signin"))}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 bg-red-600 text-white border-2 border-black rounded-lg font-black text-xs uppercase tracking-wider hover:bg-red-700 transition-colors"
                    >
                      Sign in with Google
                    </button>
                  )}
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5">{t("auth.fullName")}</label>
              <div className="flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow">
                <User className="w-4 h-4 text-red-600 shrink-0" />
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t("auth.namePlaceholder")}
                  className="flex-1 py-3 outline-none text-sm font-medium bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5">{t("auth.email")}</label>
              <div className="flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow">
                <Mail className="w-4 h-4 text-red-600 shrink-0" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("auth.emailPlaceholder")}
                  className="flex-1 py-3 outline-none text-sm font-medium bg-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5">{t("auth.password")}</label>
              <div className="flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow">
                <Lock className="w-4 h-4 text-red-600 shrink-0" />
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  minLength={8}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder={t("auth.passwordPlaceholder")}
                  className="flex-1 py-3 outline-none text-sm font-medium bg-transparent"
                />
                <button type="button" onClick={() => setShowPwd((s) => !s)} className="text-neutral-400 hover:text-black shrink-0">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pwd && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full ${i < score ? colors[score] : "bg-neutral-200"}`}
                      />
                    ))}
                  </div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500">
                    {t("auth.strengthLabel")} <span className={`${score >= 3 ? "text-green-600" : score >= 2 ? "text-yellow-600" : "text-red-600"}`}>{labels[score]}</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5">{t("auth.referralCode")}</label>
              <div className="flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow">
                <Gift className="w-4 h-4 text-red-600 shrink-0" />
                <input
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                  placeholder={t("auth.referralPlaceholder")}
                  className="flex-1 py-3 outline-none text-sm font-medium bg-transparent"
                />
              </div>
              {referrerName && (
                <p className="text-[11px] text-green-600 font-black mt-1.5 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> {t("auth.referredBy")} {referrerName}
                </p>
              )}
            </div>

            <label className="flex items-start gap-2 text-xs font-bold text-neutral-700 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 mt-0.5 accent-red-600 shrink-0"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span className="leading-snug">
                {t("auth.agreeSignUpPre")}{" "}
                <Link href={getLocalePath(locale, "/terms")} className="underline text-red-600">Terms of Service</Link>{" "}
                {agreeUpPostParts[0]}
                {agreeUpPostParts[1] !== undefined && (
                  <Link href={getLocalePath(locale, "/privacy")} className="underline text-red-600">Privacy Policy</Link>
                )}
                {agreeUpPostParts[1] ?? ""}
              </span>
            </label>

            {TURNSTILE_SITE_KEY && (
              <div className="flex flex-col gap-1">
                <label className="text-xs font-black uppercase tracking-wider text-neutral-500">{t("auth.securityCheck")}</label>
                <TurnstileWidget
                  ref={turnstileRef}
                  siteKey={TURNSTILE_SITE_KEY}
                  onToken={(t) => setTurnstileToken(t)}
                  onExpire={() => setTurnstileToken("")}
                  theme="light"
                  className="mt-1"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !agree || (Boolean(TURNSTILE_SITE_KEY) && !turnstileToken)}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 transition-all uppercase tracking-wider text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
              {loading ? t("auth.creatingAccount") : t("auth.signUpBtn")}
            </button>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-2 text-[10px] font-bold text-neutral-500">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> {t("auth.noCreditCard")}</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> {t("auth.cancelAnytime")}</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> {t("auth.refund30")}</span>
            </div>
          </form>
            </>
          )}
        </motion.div>
      </div>

      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-black relative overflow-hidden border-l-4 border-black flex-col justify-between p-10 xl:p-14 order-1 lg:order-2">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_70%_30%,rgba(220,38,38,0.5)_0%,transparent_70%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(220,38,38,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(220,38,38,0.12)_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 6, repeat: Infinity }} className="absolute -top-20 -right-16 w-72 h-72 rounded-full bg-red-600/40 blur-3xl" />
          <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 7, repeat: Infinity, delay: 1 }} className="absolute -bottom-24 -left-10 w-80 h-80 rounded-full bg-red-600/20 blur-3xl" />
        </div>

        <div className="relative flex justify-end">
          <Link href={getLocalePath(locale, "/signin")} className="text-xs font-black text-white/70 hover:text-white">
            {t("auth.haveAccount")} <span className="text-red-500 underline">{t("auth.signIn")}</span>
          </Link>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-black tracking-wider uppercase mb-6 border-2 border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)]">
            <Sparkles className="w-3.5 h-3.5" /> {t("auth.joinCreators")}
          </div>
          <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-white mb-5 leading-tight">
            {t("auth.advantageHeadline1")}<br />{t("auth.advantageHeadline2")}
          </h2>
          <p className="text-neutral-300 text-base xl:text-lg leading-relaxed mb-8 max-w-md">
            {t("auth.advantageDesc")}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-lg">
            {perks.map((p) => (
              <div key={p.t} className="bg-white/5 backdrop-blur border-2 border-white/20 rounded-xl p-4 hover:border-red-600 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-red-600 text-white flex items-center justify-center border-2 border-black mb-3">
                  <p.icon className="w-4 h-4" />
                </div>
                <div className="font-black text-sm text-white mb-0.5">{p.t}</div>
                <div className="text-[11px] text-neutral-400 font-bold leading-snug">{p.d}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative bg-red-600 border-2 border-white rounded-2xl p-5 max-w-md shadow-[6px_6px_0px_0px_rgba(255,255,255,0.4)]">
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            ))}
          </div>
          <p className="text-white text-sm leading-relaxed mb-3">{t("auth.signupTestimonialQuote")}</p>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src="https://ui-avatars.com/api/?name=Aisha+Patel&background=000&color=fff&bold=true" alt="" className="w-8 h-8 rounded-full border-2 border-white" />
              <div>
                <div className="font-black text-xs text-white">{t("auth.signupTestimonialName")}</div>
                <div className="text-[10px] text-red-100 font-bold">{t("auth.signupTestimonialHandle")}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-lg text-white">{t("auth.signupTestimonialMetric")}</div>
              <div className="text-[9px] text-red-100 font-bold uppercase">{t("auth.signupTestimonialMetricLabel")}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function EmailSentPanel({
  email,
  resendCd,
  resendError,
  onResend,
  onGoDashboard,
}: {
  email: string;
  resendCd: { left: number; active: boolean };
  resendError: string;
  onResend: () => void;
  onGoDashboard: () => void;
}) {
  const { t } = useTranslations();
  return (
    <div>
      <div className="hidden lg:flex mb-10">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
            <Play className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="font-black text-2xl tracking-tight">YTForge</span>
        </Link>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-14 h-14 rounded-2xl bg-emerald-500 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-5">
          <Inbox className="w-7 h-7 text-white" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">{t("auth.verificationTitle")}</h1>
        <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
          {t("auth.verificationDesc")} <span className="font-black text-black">{email}</span>.{" "}
          {t("auth.verificationSpam")}
        </p>

        <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 mb-5">
          <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-3">
            {t("auth.verificationStepsTitle")}
          </div>
          <ol className="space-y-2.5">
            {[t("auth.verificationStep1"), t("auth.verificationStep2"), t("auth.verificationStep3")].map((s, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm font-bold">
                <span className="w-5 h-5 rounded-md bg-red-600 text-white border-2 border-black flex items-center justify-center text-[10px] font-black shrink-0 mt-0.5">
                  {i + 1}
                </span>
                {s}
              </li>
            ))}
          </ol>
        </div>

        {resendError && (
          <div className="flex items-start gap-2 p-3 bg-red-50 border-2 border-red-500 rounded-xl text-xs font-bold text-red-700 mb-4">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{resendError}</span>
          </div>
        )}

        <button
          onClick={onResend}
          disabled={resendCd.active}
          className="w-full inline-flex items-center justify-center gap-2 py-3 bg-white border-2 border-black rounded-xl font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0 transition-all mb-3"
        >
          <RefreshCw className={`w-4 h-4 ${resendCd.active ? "" : ""} transition-transform`} />
          {resendCd.active ? `${t("auth.verificationResendIn")} ${resendCd.left}s` : t("auth.verificationResend")}
        </button>

        <button
          onClick={onGoDashboard}
          className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider text-sm"
        >
          {t("auth.verificationGoDashboard")} <ArrowRight className="w-4 h-4" />
        </button>

        <p className="mt-6 text-center text-xs text-neutral-500 font-bold">
          {t("auth.alreadyMember")}{" "}
          <Link href="/signin" className="text-red-600 underline">
            {t("auth.signIn")}
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
