"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { motion } from "motion/react";
import { toast } from "sonner";
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
} from "lucide-react";

const perks = [
  { icon: Gift, t: "7-day free trial", d: "All Creator features unlocked, no card needed" },
  { icon: Sparkles, t: "Unlimited AI generations", d: "Titles, scripts, thumbnails, analytics" },
  { icon: Zap, t: "Sub-2s generation", d: "Faster than the YouTube tab loads" },
  { icon: Shield, t: "Cancel anytime", d: "30-day money-back guarantee" },
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

function strength(pwd: string) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[0-9]/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  return score;
}

export default function SignUpPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [agree, setAgree] = useState(false);

  const score = strength(pwd);
  const labels = ["Too weak", "Weak", "Okay", "Strong", "Excellent"];
  const colors = ["bg-neutral-200", "bg-red-500", "bg-orange-500", "bg-yellow-500", "bg-green-600"];

  const { signUp } = useAuth();
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree || loading) return;
    setError(null);
    setLoading(true);
    const res = await signUp(name.trim(), email.trim(), pwd);
    setLoading(false);
    if (res.ok) {
      toast.success("Account created — welcome to YTForge!");
      router.push("/dashboard");
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col lg:flex-row">
      {/* Mobile Top Bar */}
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

      {/* Form panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 order-2 lg:order-1">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="hidden lg:flex mb-10">
            <Link href="/" className="inline-flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <Play className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="font-black text-2xl tracking-tight">YTForge</span>
            </Link>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-300 text-black text-[10px] font-black uppercase tracking-wider mb-4 border-2 border-black">
            <Gift className="w-3 h-3" /> 7 Days Free · No Card Required
          </div>

          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight mb-2">Create your account</h1>
            <p className="text-sm text-neutral-600">
              Already a member?{" "}
              <Link href="/signin" className="text-red-600 font-black underline">
                Sign in
              </Link>
            </p>
          </div>

          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              <GoogleIcon /> Sign up with Google
            </button>
            <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-black text-white border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Sign up with Apple
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
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5">Full name</label>
              <div className="flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow">
                <User className="w-4 h-4 text-red-600 shrink-0" />
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Creator"
                  className="flex-1 py-3 outline-none text-sm font-medium bg-transparent"
                />
              </div>
            </div>

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
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5">Password</label>
              <div className="flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow">
                <Lock className="w-4 h-4 text-red-600 shrink-0" />
                <input
                  type={showPwd ? "text" : "password"}
                  required
                  minLength={8}
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  placeholder="At least 8 characters"
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
                    Strength: <span className={`${score >= 3 ? "text-green-600" : score >= 2 ? "text-yellow-600" : "text-red-600"}`}>{labels[score]}</span>
                  </div>
                </div>
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
                I agree to YTForge's{" "}
                <Link href="/terms" className="underline text-red-600">Terms of Service</Link> and{" "}
                <Link href="/privacy" className="underline text-red-600">Privacy Policy</Link>.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading || !agree}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-x-0 disabled:hover:translate-y-0 transition-all uppercase tracking-wider text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
              {loading ? "Creating account..." : "Sign Up Now"}
            </button>

            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 pt-2 text-[10px] font-bold text-neutral-500">
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> No credit card</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> Cancel anytime</span>
              <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-600" /> 30-day refund</span>
            </div>
          </form>
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
          <Link href="/signin" className="text-xs font-black text-white/70 hover:text-white">
            Have an account? <span className="text-red-500 underline">Sign in</span>
          </Link>
        </div>

        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-600 text-white text-xs font-black tracking-wider uppercase mb-6 border-2 border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)]">
            <Sparkles className="w-3.5 h-3.5" /> Join 200K+ Creators
          </div>
          <h2 className="text-4xl xl:text-5xl font-black tracking-tight text-white mb-5 leading-tight">
            Your unfair advantage,<br />unlocked in 60 seconds.
          </h2>
          <p className="text-neutral-300 text-base xl:text-lg leading-relaxed mb-8 max-w-md">
            Every AI tool. Every workflow. Every analytics dashboard. Free for 7 days, no credit card required.
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
          <p className="text-white text-sm leading-relaxed mb-3">"Went from 12K to 480K subs in 9 months. The Creator plan paid for itself in week one."</p>
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <img src="https://ui-avatars.com/api/?name=Aisha+Patel&background=000&color=fff&bold=true" alt="" className="w-8 h-8 rounded-full border-2 border-white" />
              <div>
                <div className="font-black text-xs text-white">Aisha Patel</div>
                <div className="text-[10px] text-red-100 font-bold">@AishaTalks · 480K subs</div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-black text-lg text-white">+3,900%</div>
              <div className="text-[9px] text-red-100 font-bold uppercase">Growth</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
