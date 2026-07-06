"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";
import {
  User as UserIcon,
  Mail,
  Target,
  Crown,
  Save,
  Check,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Calendar,
  TrendingUp,
  Zap,
  Shield,
  Star,
  CreditCard,
  Trash2,
  AlertTriangle,
  Loader2,
  Trophy,
  Building2,
  Users,
  Gift,
  Copy,
  Share2,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth, authFetch, type Plan } from "@/lib/auth";

const SALES_EMAIL = "arhamsaad453@gmail.com";

const plans: { id: Plan; name: string; price: string; period: string; tagline: string; icon: any; accent: string; features: string[]; popular?: boolean }[] = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    tagline: "Get a feel for YTForge",
    icon: Sparkles,
    accent: "bg-neutral-100 text-black",
    features: ["10 generations / month", "Basic AI tools", "Community support"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29",
    period: "per month",
    tagline: "For serious creators & teams",
    icon: Crown,
    accent: "bg-red-600 text-white",
    features: ["Unlimited generations", "All 10 tools", "Priority queue", "HD exports", "API access", "Priority chat"],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "talk to sales",
    tagline: "For agencies & networks",
    icon: Building2,
    accent: "bg-black text-white",
    features: ["Unlimited seats", "Dedicated CSM", "SSO + SAML", "Custom SLAs", "1:1 onboarding"],
  },
];

const goalPresets = [
  { title: "Hit 100K subscribers", metric: "subscribers", target: 100000, icon: Users },
  { title: "Reach 1M total views", metric: "views", target: 1000000, icon: TrendingUp },
  { title: "Ship 50 videos this year", metric: "videos", target: 50, icon: Zap },
  { title: "Earn $10K from AdSense", metric: "USD", target: 10000, icon: Trophy },
];

type Tab = "profile" | "goals" | "plan" | "refer" | "danger";

export default function SettingsPage() {
  return (
    <React.Suspense fallback={<SettingsSkeleton />}>
      <SettingsPageInner />
    </React.Suspense>
  );
}

function SettingsSkeleton() {
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
      <Loader2 className="w-6 h-6 animate-spin text-red-600" />
    </div>
  );
}

function SettingsPageInner() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<Tab>("profile");

  useEffect(() => {
    if (!user) router.replace("/signin");
  }, [user, router]);

  useEffect(() => {
    const t = searchParams.get("tab") as Tab | null;
    if (t && ["profile", "goals", "plan", "refer", "danger"].includes(t)) {
      setTab(t);
    }
  }, [searchParams]);

  if (!user) return null;

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "profile", label: "Profile", icon: UserIcon },
    { id: "goals", label: "Goals", icon: Target },
    { id: "plan", label: "Plan & Billing", icon: Crown },
    { id: "refer", label: "Refer & Earn", icon: Gift },
    { id: "danger", label: "Danger zone", icon: AlertTriangle },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />

      {/* Header */}
      <section className="relative bg-red-600 border-b-4 border-black overflow-hidden pt-28 pb-12">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.18)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_30%_30%,#000_30%,transparent_100%)]" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs font-black text-white/80 hover:text-white mb-5 group">
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            Back to dashboard
          </Link>
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt="" className="w-16 h-16 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]" />
            <div>
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-300 text-black border-2 border-black text-[10px] font-black uppercase tracking-wider mb-1.5">
                <Crown className="w-3 h-3" /> {user.plan} plan
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white [text-shadow:_2px_2px_0_rgb(0_0_0_/_30%)]">Account settings</h1>
              <p className="text-sm text-red-50 font-medium">Manage your profile, goals, and subscription.</p>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid lg:grid-cols-[240px_1fr] gap-8">
        {/* Sidebar tabs */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-2 flex lg:flex-col gap-1 overflow-x-auto">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-black text-sm border-2 whitespace-nowrap transition-all ${
                  tab === t.id
                    ? "bg-red-600 text-white border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                    : "border-transparent hover:bg-neutral-100 text-neutral-700"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div>
          <AnimatePresence mode="wait">
            {tab === "profile" && <ProfileTab key="profile" />}
            {tab === "goals" && <GoalsTab key="goals" />}
            {tab === "plan" && <PlanTab key="plan" />}
            {tab === "refer" && <ReferTab key="refer" />}
            {tab === "danger" && <DangerTab key="danger" onSignOut={() => { signOut(); router.push("/"); }} />}
          </AnimatePresence>
        </div>
      </main>

      <Footer />
    </div>
  );
}

/* ========== Profile ========== */
function ProfileTab() {
  const { user, updateProfile } = useAuth();
  const [name, setName] = useState(user!.name);
  const [email, setEmail] = useState(user!.email);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const dirty = name !== user!.name || email !== user!.email;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dirty) return;
    setSaving(true);
    try {
      await updateProfile({ name: name.trim(), email: email.trim() });
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
      <Card title="Profile" desc="How your account appears across YTForge." icon={UserIcon}>
        <form onSubmit={save} className="space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-neutral-50 border-2 border-black rounded-xl">
            <img src={user!.avatar} alt="" className="w-16 h-16 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]" />
            <div className="flex-1">
              <div className="font-black tracking-tight">{name || "Your name"}</div>
              <div className="text-xs text-neutral-500 font-bold">{email}</div>
              <div className="text-[10px] text-neutral-400 font-black uppercase tracking-wider mt-1">Avatar auto-generated from your name</div>
            </div>
          </div>

          <Field label="Display name" hint="Shown on your dashboard, exports, and team comments.">
            <UserIcon className="w-4 h-4 text-red-600 shrink-0" />
            <input
              type="text"
              required
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="flex-1 py-3 outline-none text-sm font-medium bg-transparent"
            />
            <span className="text-[10px] font-black text-neutral-400">{name.length}/40</span>
          </Field>

          <Field label="Email address" hint="Used for sign-in, billing receipts, and reset links.">
            <Mail className="w-4 h-4 text-red-600 shrink-0" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 py-3 outline-none text-sm font-medium bg-transparent"
            />
          </Field>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={!dirty || saving}
              className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] disabled:hover:translate-x-0 disabled:hover:translate-y-0 transition-all uppercase tracking-wider text-sm"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Saving..." : "Save changes"}
            </button>
            <AnimatePresence>
              {saved && (
                <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1.5 text-sm font-black text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Saved!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </form>
      </Card>

      <Card title="Account meta" desc="Read-only info from your YTForge account." icon={Shield}>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { l: "Member since", v: user!.joined },
            { l: "Active plan", v: user!.plan, badge: true },
            { l: "Account type", v: "Personal" },
          ].map((m) => (
            <div key={m.l} className="bg-neutral-50 border-2 border-black rounded-xl p-3">
              <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1">{m.l}</div>
              <div className={`font-black tracking-tight ${m.badge ? "capitalize" : ""}`}>{m.v}</div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

/* ========== Goals ========== */
function GoalsTab() {
  const { user, setGoal } = useAuth();
  const existing = user!.goal;
  const [title, setTitle] = useState(existing?.title || "");
  const [metric, setMetric] = useState(existing?.metric || "subscribers");
  const [target, setTarget] = useState<number>(existing?.target || 100000);
  const [current, setCurrent] = useState<number>(existing?.current || 0);
  const [deadline, setDeadline] = useState(existing?.deadline || new Date(Date.now() + 90 * 86400000).toISOString().slice(0, 10));
  const [saved, setSaved] = useState(false);

  const pct = Math.min(100, Math.round((current / Math.max(1, target)) * 100));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(false);
    try {
      await setGoal({ title: title.trim() || "Untitled goal", metric, target, current, deadline });
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (err: any) {
      toast.error(err?.message || "Failed to save goal");
    }
  };

  const applyPreset = (p: typeof goalPresets[number]) => {
    setTitle(p.title);
    setMetric(p.metric);
    setTarget(p.target);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
      <Card title="Set your goal" desc="A clear north star helps you ship the right videos. Pick a preset or define your own." icon={Target}>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
          {goalPresets.map((p) => {
            const active = title === p.title;
            return (
              <button
                key={p.title}
                onClick={() => applyPreset(p)}
                type="button"
                className={`text-left p-3 border-2 border-black rounded-xl transition-all ${active ? "bg-red-600 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-x-0.5 -translate-y-0.5" : "bg-white hover:bg-yellow-50 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"}`}
              >
                <p.icon className={`w-5 h-5 mb-2 ${active ? "text-yellow-300" : "text-red-600"}`} />
                <div className="font-black text-sm tracking-tight leading-snug">{p.title}</div>
                <div className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${active ? "text-red-100" : "text-neutral-400"}`}>
                  {p.target.toLocaleString()} {p.metric}
                </div>
              </button>
            );
          })}
        </div>

        <form onSubmit={submit} className="space-y-4">
          <Field label="Goal title">
            <Target className="w-4 h-4 text-red-600 shrink-0" />
            <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Hit 100K subscribers" className="flex-1 py-3 outline-none text-sm font-medium bg-transparent" />
          </Field>

          <div className="grid sm:grid-cols-3 gap-3">
            <Field label="Metric">
              <Sparkles className="w-4 h-4 text-red-600 shrink-0" />
              <select value={metric} onChange={(e) => setMetric(e.target.value)} className="flex-1 py-3 outline-none text-sm font-bold bg-transparent">
                <option value="subscribers">Subscribers</option>
                <option value="views">Views</option>
                <option value="videos">Videos</option>
                <option value="USD">USD earned</option>
                <option value="watch hours">Watch hours</option>
              </select>
            </Field>
            <Field label="Current">
              <TrendingUp className="w-4 h-4 text-red-600 shrink-0" />
              <input type="number" min={0} value={current} onChange={(e) => setCurrent(Number(e.target.value))} className="flex-1 py-3 outline-none text-sm font-medium bg-transparent" />
            </Field>
            <Field label="Target">
              <Trophy className="w-4 h-4 text-red-600 shrink-0" />
              <input type="number" min={1} required value={target} onChange={(e) => setTarget(Number(e.target.value))} className="flex-1 py-3 outline-none text-sm font-medium bg-transparent" />
            </Field>
          </div>

          <Field label="Deadline">
            <Calendar className="w-4 h-4 text-red-600 shrink-0" />
            <input type="date" required value={deadline} onChange={(e) => setDeadline(e.target.value)} className="flex-1 py-3 outline-none text-sm font-medium bg-transparent" />
          </Field>

          <div className="bg-black text-white border-2 border-black rounded-xl p-5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-40 h-40 rounded-full bg-red-600/40 blur-3xl" />
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-300">Live preview</div>
                  <div className="font-black text-lg tracking-tight">{title || "Your goal"}</div>
                </div>
                <div className="text-3xl font-black text-yellow-300">{pct}%</div>
              </div>
              <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mb-2">
                <motion.div className="h-full bg-yellow-300" initial={false} animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 120, damping: 20 }} />
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-300">
                <span>{current.toLocaleString()} / {target.toLocaleString()} {metric}</span>
                <span className="inline-flex items-center gap-1"><Calendar className="w-3 h-3" /> by {deadline}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button type="submit" className="inline-flex items-center gap-2 px-5 py-3 bg-red-600 text-white font-black rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wider text-sm">
              <Save className="w-4 h-4" /> Save goal
            </button>
            <AnimatePresence>
              {saved && (
                <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="inline-flex items-center gap-1.5 text-sm font-black text-emerald-600">
                  <CheckCircle2 className="w-4 h-4" /> Goal locked in!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </form>
      </Card>
    </motion.div>
  );
}

/* ========== Plan ========== */
function PlanTab() {
  const { user } = useAuth();
  const router = useRouter();
  const [pending, setPending] = useState<Plan | null>(null);
  const [confirm, setConfirm] = useState<Plan | null>(null);
  const [canceling, setCanceling] = useState(false);

  const select = (p: Plan) => {
    if (p === user!.plan) return;
    if (p === "enterprise") {
      window.location.href = `mailto:${SALES_EMAIL}?subject=YTForge%20Enterprise%20inquiry&body=Hi%2C%20I%27d%20like%20to%20discuss%20an%20YTForge%20Enterprise%20plan%20for%20my%20team.`;
      return;
    }
    setConfirm(p);
  };

  const apply = async () => {
    if (!confirm) return;
    setPending(confirm);
    try {
      if (confirm === "pro") {
        const res = await authFetch<{ url: string }>("/api/billing/checkout", {
          method: "POST",
          body: JSON.stringify({ plan: "pro" }),
        });
        // Mock checkout flow: confirm immediately server-side, then reload user.
        const card = { brand: "visa", last4: "4242", expMonth: 12, expYear: 2028 };
        await authFetch("/api/billing/confirm", {
          method: "POST",
          body: JSON.stringify({ plan: "pro", card }),
        });
        toast.success("You're on Pro! Unlimited generations unlocked.");
        router.push("/dashboard");
        void res;
      } else {
        await authFetch("/api/billing/cancel", { method: "POST" });
        toast.success("Plan cancelled — back to Free at period end.");
        router.push("/dashboard");
      }
    } catch (err: any) {
      toast.error(err?.message || "Checkout failed. Please try again.");
    } finally {
      setPending(null);
      setConfirm(null);
    }
  };

  const cancelPlan = async () => {
    setCanceling(true);
    try {
      await authFetch("/api/billing/cancel", { method: "POST" });
      toast.success("Subscription cancelled. You'll keep Pro until the period ends.");
    } catch (err: any) {
      toast.error(err?.message || "Failed to cancel");
    } finally {
      setCanceling(false);
    }
  };

  const onPro = user!.plan === "pro" || user!.plan === "enterprise";
  const renews = user!.planRenewsAt ? new Date(user!.planRenewsAt).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : null;
  const card = user!.payment;

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
      <Card title="Subscription" desc={`You're on the ${user!.plan} plan. Upgrade to Pro for unlimited everything, or contact sales for Enterprise.`} icon={Crown}>
        <div className="grid sm:grid-cols-3 gap-4">
          {plans.map((p) => {
            const isCurrent = p.id === user!.plan;
            const isLoading = pending === p.id;
            return (
              <motion.div
                key={p.id}
                whileHover={{ y: isCurrent ? 0 : -2 }}
                className={`relative border-2 border-black rounded-2xl p-5 transition-all ${
                  isCurrent
                    ? "bg-black text-white shadow-[4px_4px_0px_0px_rgba(220,38,38,1)]"
                    : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)]"
                }`}
              >
                {p.popular && !isCurrent && (
                  <div className="absolute -top-3 left-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-300 text-black border-2 border-black text-[10px] font-black uppercase tracking-wider">
                    <Star className="w-3 h-3 fill-black" /> Most popular
                  </div>
                )}
                {isCurrent && (
                  <div className="absolute -top-3 left-4 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-400 text-black border-2 border-black text-[10px] font-black uppercase tracking-wider">
                    <Check className="w-3 h-3" /> Current
                  </div>
                )}
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-11 h-11 rounded-xl border-2 border-black flex items-center justify-center ${p.accent}`}>
                    <p.icon className="w-5 h-5" />
                  </div>
                  <div className="text-right">
                    <div className="font-black text-2xl tracking-tight">{p.price}</div>
                    <div className={`text-[10px] font-black uppercase tracking-wider ${isCurrent ? "text-neutral-400" : "text-neutral-500"}`}>{p.period}</div>
                  </div>
                </div>
                <div className="font-black text-lg tracking-tight">{p.name}</div>
                <div className={`text-xs font-bold mb-3 ${isCurrent ? "text-neutral-300" : "text-neutral-500"}`}>{p.tagline}</div>
                <ul className="space-y-1.5 mb-5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-xs font-bold">
                      <CheckCircle2 className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${isCurrent ? "text-emerald-400" : "text-emerald-600"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => select(p.id)}
                  disabled={isCurrent || isLoading}
                  className={`w-full inline-flex items-center justify-center gap-1.5 py-2.5 font-black text-xs uppercase tracking-wider rounded-xl border-2 border-black transition-all ${
                    isCurrent
                      ? "bg-white/10 text-neutral-400 cursor-default"
                      : p.id === "enterprise"
                      ? "bg-black text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
                      : "bg-red-600 text-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5"
                  }`}
                >
                  {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : isCurrent ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                  {isCurrent ? "Active plan" : p.id === "enterprise" ? "Contact sales" : p.id === "pro" ? "Upgrade to Pro" : "Switch to Free"}
                </button>
              </motion.div>
            );
          })}
        </div>
      </Card>

      <Card title="Billing" desc="Payment, invoices, and plan renewals." icon={CreditCard}>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { l: "Next invoice", v: onPro ? "$29.00" : "—" },
            { l: "Billing cycle", v: onPro ? "Monthly" : "—" },
            { l: "Renews on", v: renews || "—" },
          ].map((b) => (
            <div key={b.l} className="bg-neutral-50 border-2 border-black rounded-xl p-3">
              <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1">{b.l}</div>
              <div className="font-black tracking-tight">{b.v}</div>
            </div>
          ))}
        </div>
        <div className="mt-4 grid sm:grid-cols-2 gap-3">
          <div className="border-2 border-black rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center border-2 border-black">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Payment method</div>
              <div className="font-black tracking-tight">{card?.last4 ? `${card.brand?.toUpperCase()} •••• ${card.last4}` : "No card on file"}</div>
              {card?.expMonth ? <div className="text-[10px] text-neutral-500 font-bold">Expires {String(card.expMonth).padStart(2, "0")}/{card.expYear}</div> : null}
            </div>
          </div>
          <div className="border-2 border-black rounded-xl p-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500">Cancel subscription</div>
              <div className="font-black tracking-tight text-xs">{onPro ? "Drop to Free at period end" : "You're on the free plan"}</div>
            </div>
            <button
              onClick={cancelPlan}
              disabled={!onPro || canceling}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-black uppercase tracking-wider hover:bg-neutral-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {canceling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
              Cancel
            </button>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href={`mailto:${SALES_EMAIL}?subject=YTForge%20Enterprise%20inquiry`}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-black uppercase tracking-wider hover:bg-neutral-100 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5" /> Talk to sales
          </a>
        </div>
      </Card>

      <AnimatePresence>
        {confirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !pending && setConfirm(null)}>
            <motion.div initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 12 }} className="w-full max-w-md bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-xl bg-red-600 border-2 border-black flex items-center justify-center mb-4">
                <Crown className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-1">{confirm === "pro" ? "Upgrade to Pro?" : "Switch plan?"}</h3>
              <p className="text-sm text-neutral-600 mb-5">
                {confirm === "pro" ? (
                  <>Pro is <span className="font-black">$29/month</span>. Billed monthly, cancel anytime. Your card ends in 4242 (test mode).</>
                ) : (
                  <>You'll move from <span className="font-black capitalize">{user!.plan}</span> to <span className="font-black capitalize">{confirm}</span>.</>
                )}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setConfirm(null)} disabled={!!pending} className="flex-1 py-3 bg-white border-2 border-black rounded-xl font-black text-sm uppercase tracking-wider hover:bg-neutral-100 disabled:opacity-50 transition-colors">
                  Cancel
                </button>
                <button onClick={apply} disabled={!!pending} className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 bg-red-600 text-white border-2 border-black rounded-xl font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-70 transition-all">
                  {pending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                  {pending ? "Processing..." : "Confirm & pay"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ========== Refer & Earn ========== */
function ReferTab() {
  const { user } = useAuth();
  const [referral, setReferral] = useState<{ referralCode: string; referrals: number; referredByName: string; shareUrl: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    authFetch<{ referral: any }>("/api/referral")
      .then((res) => setReferral(res.referral))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const code = referral?.referralCode || user?.referralCode || "";
  const shareUrl = referral?.shareUrl || `${typeof window !== "undefined" ? window.location.origin : ""}/signup?ref=${code}`;

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Couldn't copy — select and copy manually");
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-5">
      <Card title="Your referral code" desc="Share your code. When a friend signs up with it, you both get 1 month of Pro free." icon={Gift}>
        {loading ? (
          <div className="h-28 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-3">
              <div className="border-2 border-black rounded-xl p-4 bg-black text-white relative overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-red-600/40 blur-2xl" />
                <div className="relative">
                  <div className="text-[10px] font-black uppercase tracking-wider text-neutral-400 mb-1">Your code</div>
                  <div className="font-black text-2xl tracking-tight">{code || "—"}</div>
                </div>
              </div>
              <div className="border-2 border-black rounded-xl p-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-neutral-500 mb-1">Friends referred</div>
                <div className="font-black text-2xl tracking-tight">{referral?.referrals ?? 0}</div>
                <div className="text-[10px] text-neutral-500 font-bold mt-1">{referral?.referredByName ? `Referred by ${referral.referredByName}` : "Not referred by anyone"}</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-1.5">Share link</label>
              <div className="flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white">
                <Share2 className="w-4 h-4 text-red-600 shrink-0" />
                <input readOnly value={shareUrl} className="flex-1 py-3 outline-none text-sm font-medium bg-transparent truncate" />
                <button onClick={() => copy(shareUrl)} className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-black uppercase border-2 border-black hover:bg-red-700 transition-colors">
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => copy(code)} className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-black uppercase tracking-wider hover:bg-neutral-100 transition-colors">
                <Copy className="w-3.5 h-3.5" /> Copy code only
              </button>
              <a
                href={`https://wa.me/?text=${encodeURIComponent(`Join me on YTForge — AI tools that grow your YouTube channel. Use my code ${code}: ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-black uppercase tracking-wider hover:bg-neutral-100 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Share on WhatsApp
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`I'm growing my YouTube channel with YTForge. Use my code ${code} for a free month: ${shareUrl}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-white border-2 border-black rounded-lg text-xs font-black uppercase tracking-wider hover:bg-neutral-100 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Share on X
              </a>
            </div>
          </div>
        )}
      </Card>

      <Card title="How it works" desc="Three steps, real rewards." icon={Sparkles}>
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { n: "1", t: "Share your code", d: "Send your link or code to a friend." },
            { n: "2", t: "They sign up", d: "Your friend creates a free YTForge account." },
            { n: "3", t: "You both win", d: "You each get 1 month of Pro — on us." },
          ].map((s) => (
            <div key={s.n} className="border-2 border-black rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center border-2 border-black font-black text-sm mb-2">{s.n}</div>
              <div className="font-black text-sm tracking-tight">{s.t}</div>
              <div className="text-xs text-neutral-500 font-bold mt-1">{s.d}</div>
            </div>
          ))}
        </div>
      </Card>
    </motion.div>
  );
}

/* ========== Danger ========== */
function DangerTab({ onSignOut }: { onSignOut: () => void }) {
  const { user, deleteAccount } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [typedEmail, setTypedEmail] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const emailMatches = typedEmail.trim().toLowerCase() === user!.email.trim().toLowerCase();

  const doDelete = async () => {
    if (!emailMatches) return;
    setDeleting(true);
    setError(null);
    const res = await deleteAccount();
    setDeleting(false);
    if (res.ok) {
      toast.success("Account deleted. Sorry to see you go.");
      window.location.href = "/";
    } else {
      setError(res.error || "Failed to delete account. Please try again.");
      setConfirmOpen(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      <div className="bg-white border-2 border-red-600 rounded-2xl shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] overflow-hidden">
        <div className="bg-red-50 border-b-2 border-red-600 px-6 py-4 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-600" />
          <div>
            <div className="font-black tracking-tight">Danger zone</div>
            <div className="text-xs text-red-700 font-bold">These actions cannot be undone.</div>
          </div>
        </div>
        <div className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-2 border-black rounded-xl">
            <div className="flex-1">
              <div className="font-black tracking-tight">Sign out everywhere</div>
              <div className="text-xs text-neutral-500 font-bold">Ends your sessions on every device.</div>
            </div>
            <button onClick={onSignOut} className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-black text-white border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              <ArrowRight className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 border-2 border-red-600 bg-red-50 rounded-xl">
            <div className="flex-1">
              <div className="font-black tracking-tight text-red-700">Delete account</div>
              <div className="text-xs text-red-700 font-bold">Permanently removes your account, generations, goals, and billing info. This cannot be undone.</div>
            </div>
            <button onClick={() => setConfirmOpen(true)} className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-red-600 text-white border-2 border-black rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all">
              <Trash2 className="w-3.5 h-3.5" /> Delete account
            </button>
          </div>
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-50 border-2 border-red-500 rounded-xl text-xs font-bold text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {confirmOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => !deleting && setConfirmOpen(false)}>
            <motion.div initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 12 }} className="w-full max-w-md bg-white border-2 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6" onClick={(e) => e.stopPropagation()}>
              <div className="w-12 h-12 rounded-xl bg-red-600 border-2 border-black flex items-center justify-center mb-4">
                <Trash2 className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-2xl font-black tracking-tight mb-1">Delete your account?</h3>
              <p className="text-sm text-neutral-600 mb-4">
                This permanently deletes your account, all activity, goals, and billing details. <span className="font-black text-red-700">This cannot be undone.</span>
              </p>
              <p className="text-xs font-bold text-neutral-700 mb-2">
                Type <span className="font-black text-red-700">{user!.email}</span> to confirm.
              </p>
              <input
                type="email"
                value={typedEmail}
                onChange={(e) => setTypedEmail(e.target.value)}
                placeholder={user!.email}
                className="w-full px-3 py-3 border-2 border-black rounded-xl text-sm font-medium bg-white outline-none focus:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow mb-4"
              />
              <div className="flex gap-2">
                <button onClick={() => setConfirmOpen(false)} disabled={deleting} className="flex-1 py-3 bg-white border-2 border-black rounded-xl font-black text-sm uppercase tracking-wider hover:bg-neutral-100 disabled:opacity-50 transition-colors">
                  Cancel
                </button>
                <button onClick={doDelete} disabled={!emailMatches || deleting} className="flex-1 inline-flex items-center justify-center gap-1.5 py-3 bg-red-600 text-white border-2 border-black rounded-xl font-black text-sm uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
                  {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  {deleting ? "Deleting..." : "Delete forever"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ========== Reusable bits ========== */
function Card({ title, desc, icon: Icon, children }: { title: string; desc: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
      <div className="px-6 py-5 border-b-2 border-black bg-neutral-50 flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-red-600 text-white border-2 border-black flex items-center justify-center shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <div>
          <div className="font-black tracking-tight">{title}</div>
          <div className="text-xs text-neutral-500 font-bold">{desc}</div>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-black uppercase tracking-wider mb-1.5">{label}</label>
      <div className="flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow">
        {children}
      </div>
      {hint && <p className="text-[11px] text-neutral-500 font-bold mt-1.5">{hint}</p>}
    </div>
  );
}
