"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { getLocalePath } from "@/lib/i18n/utils";
import { motion } from "motion/react";
import { toast } from "sonner";
import TurnstileWidget, { TurnstileHandle } from "@/components/ui/turnstile-widget";
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
  Star,
  Shield,
  AlertCircle,
} from "lucide-react";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

const benefits = [
  { icon: Sparkles, t: "Unlimited AI generations", d: "Titles, scripts, thumbnails — all unlimited" },
  { icon: TrendingUp, t: "+340% avg view lift", d: "From 200K+ verified creators" },
  { icon: Shield, t: "Enterprise security", d: "SOC 2 certified, GDPR compliant" },
];

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

export default function SignInPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const turnstileRef = useRef<TurnstileHandle>(null);
  const { signIn, user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { locale } = useLocale();

  // ── Redirect already-authenticated users away from this page ──────────────
  useEffect(() => {
    if (!authLoading && user) {
      router.replace(getLocalePath(locale, "/dashboard"));
    }
  }, [user, authLoading, router, locale]);

  // Show a full-screen spinner while we resolve auth state (prevents flash)
  if (authLoading || user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <Loader2 className="w-8 h-8 animate-spin text-red-600" />
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (TURNSTILE_SITE_KEY && !turnstileToken) {
      setError("Please complete the CAPTCHA verification.");
      return;
    }

    setError(null);
    setLoading(true);

    const res = await signIn(email.trim(), pwd, turnstileToken || undefined);
    setLoading(false);

    if (res.ok) {
      toast.success("Welcome back!");
      router.push(getLocalePath(locale, "/dashboard"));
    } else {
      turnstileRef.current?.reset();
      setTurnstileToken("");
      setError(res.error);
    }
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
          <motion.div animate={{ y: [0, -10, 0], rotate: [6, 8, 6] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-32 right-16 w-24 h-24 bg-white border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-3">
            <TrendingUp className="w-5 h-5 text-red-600 mb-1" />
            <div className="font-black text-[10px]">+340%</div>
            <div className="text-[8px] text-neutral-500 font-bold">View lift</div>
          </motion.div>
          <motion.div animate={{ y: [0, 10, 0], rotate: [-8, -10, -8] }} transition={{ duration: 9, repeat: Infinity, delay: 0.5 }} className="absolute bottom-44 left-12 w-28 h-28 bg-yellow-300 border-2 border-black rounded-xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-3">
            <Sparkles className="w-5 h-5 text-black mb-1" />
            <div className="font-black text-[10px]">200K+</div>
            <div className="text-[8px] text-black/70 font-bold">Creators</div>
          </motion.div>
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
          <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-white mb-5 leading-tight [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
            Welcome back to the<br />creator workspace.
          </h2>
          <p className="text-red-50 text-base xl:text-lg leading-relaxed mb-8 max-w-md">
            200,000+ creators ship better videos faster with YTForge. Sign in and pick up where you left off.
          </p>

          <div className="space-y-3 max-w-md">
            {benefits.map((b) => (
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

        <div className="relative bg-black/30 backdrop-blur border-2 border-white/30 rounded-xl p-5 max-w-md">
          <div className="flex gap-0.5 mb-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-yellow-300 text-yellow-300" />
            ))}
          </div>
          <p className="text-white text-sm leading-relaxed mb-3">&quot;YTForge tripled my CTR overnight. Single best subscription I pay for.&quot;</p>
          <div className="flex items-center gap-2">
            <img src="https://ui-avatars.com/api/?name=Maya+Chen&background=000&color=fff&bold=true" alt="" className="w-8 h-8 rounded-full border-2 border-white" />
            <div>
              <div className="font-black text-xs text-white">Maya Chen</div>
              <div className="text-[10px] text-red-100 font-bold">@MayaCodes · 1.2M subs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col">
        <div className="lg:hidden border-b-2 border-black bg-white p-4 flex items-center justify-between">
          <Link href={getLocalePath(locale, "/")} className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-red-600 flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <Play className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="font-black text-lg tracking-tight">YTForge</span>
          </Link>
          <Link href={getLocalePath(locale, "/signup")} className="text-xs font-black text-red-600 hover:text-black">
            Sign Up →
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
            <div className="mb-8">
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Sign in</h1>
              <p className="text-sm text-neutral-600">
                New here?{" "}
                <Link href={getLocalePath(locale, "/signup")} className="text-red-600 font-black underline">
                  Create a free account
                </Link>
              </p>
            </div>

            <div className="space-y-3 mb-6">
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                <GoogleIcon /> Continue with Google
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                Continue with Apple
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex-1 h-0.5 bg-black" />
              <span className="text-xs font-black uppercase tracking-wider text-neutral-500">Or with email</span>
              <div className="flex-1 h-0.5 bg-black" />
            </div>

            <form onSubmit={submit} className="space-y-4">
              {error && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border-2 border-red-500 rounded-xl text-xs font-bold text-red-700">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-1.5">Email</label>
                <div className="flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow">
                  <Mail className="w-4 h-4 text-red-600 shrink-0" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@channel.com"
                    className="flex-1 py-3 outline-none text-sm font-medium bg-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-black uppercase tracking-wider">Password</label>
                  <Link href={getLocalePath(locale, "/forgot-password")} className="text-xs font-black text-red-600 hover:text-black">
                    Forgot?
                  </Link>
                </div>
                <div className="flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow">
                  <Lock className="w-4 h-4 text-red-600 shrink-0" />
                  <input
                    type={showPwd ? "text" : "password"}
                    required
                    minLength={8}
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                    placeholder="••••••••"
                    className="flex-1 py-3 outline-none text-sm font-medium bg-transparent"
                  />
                  <button type="button" onClick={() => setShowPwd((s) => !s)} className="text-neutral-400 hover:text-black shrink-0">
                    {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-neutral-700 cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 accent-red-600" defaultChecked />
                Keep me signed in for 30 days
              </label>

              {TURNSTILE_SITE_KEY && (
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-black uppercase tracking-wider text-neutral-500">Security check</label>
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
                disabled={loading || (Boolean(TURNSTILE_SITE_KEY) && !turnstileToken)}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all uppercase tracking-wider text-sm"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <p className="mt-8 text-center text-[11px] text-neutral-500 leading-relaxed">
              By signing in you agree to our{" "}
              <Link href={getLocalePath(locale, "/terms")} className="underline font-bold">Terms</Link> and{" "}
              <Link href={getLocalePath(locale, "/privacy")} className="underline font-bold">Privacy Policy</Link>. Protected by enterprise-grade encryption.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
