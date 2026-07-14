"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Play,
  Home,
  Sparkles,
  TrendingUp,
  PenTool,
  Download,
  LineChart,
  FileText,
  Hash,
  ArrowRight,
  Wifi,
  WifiOff,
  Zap,
} from "lucide-react";

/* ─── Quick links ─────────────────────────────────────────────────────────── */
const quickLinks = [
  { label: "Viral Title Generator", href: "/tools/viral-title-generator", icon: TrendingUp },
  { label: "AI Script Writer",      href: "/tools/ai-script-writer",       icon: PenTool   },
  { label: "Thumbnail Downloader",  href: "/tools/thumbnail-downloader",   icon: Download  },
  { label: "SEO Analyzer",          href: "/tools/seo-analyzer",           icon: LineChart },
  { label: "AI Transcript",         href: "/tools/ai-transcript",          icon: FileText  },
  { label: "Hashtag Generator",     href: "/tools/hashtag-generator",      icon: Hash      },
];

/* ─── Animated counter (counts 0 → 404) ───────────────────────────────────── */
function AnimatedCounter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let frame: number;
    const start = performance.now();
    const duration = 1400;
    const target = 404;
    const animate = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - elapsed, 4);
      setCount(Math.round(ease * target));
      if (elapsed < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  return <>{count}</>;
}

/* ─── Floating particles ──────────────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 4 + (i % 5) * 3,
  x: 5 + (i * 37) % 90,
  y: 5 + (i * 53) % 85,
  delay: (i * 0.35) % 4,
  duration: 3 + (i % 3),
}));

/* ═══════════════════════════════════════════════════════════════════════════ */
export default function NotFound() {
  const [glitchActive, setGlitchActive] = useState(false);

  /* Random glitch trigger every 4-8 s */
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setGlitchActive(true);
        setTimeout(() => {
          setGlitchActive(false);
          schedule();
        }, 380);
      }, 4000 + Math.random() * 4000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-red-600/20 selection:text-red-900 overflow-x-hidden">

      {/* ══ HERO SECTION ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b-2 border-black pt-24 pb-20 sm:pt-32 sm:pb-28">

        {/* Grid background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,0.045) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(0,0,0,0.045) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Floating particles */}
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            aria-hidden
            className="pointer-events-none absolute rounded-full bg-red-600"
            style={{
              width: p.size,
              height: p.size,
              left: `${p.x}%`,
              top: `${p.y}%`,
              opacity: 0.08 + (p.id % 4) * 0.03,
              animation: `floatParticle ${p.duration}s ease-in-out ${p.delay}s infinite alternate`,
            }}
          />
        ))}

        {/* Big red glow orbs (subtle, 4-6% opacity) */}
        <div aria-hidden className="pointer-events-none absolute -top-28 -right-28 w-[480px] h-[480px] rounded-full bg-red-600 opacity-[0.055] blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 w-[360px] h-[360px] rounded-full bg-red-600 opacity-[0.04] blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">

            {/* ─── LEFT: TEXT CONTENT ────────────────────────────────────── */}
            <div className="flex-1 text-center md:text-left">

              {/* Status badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-[10px] font-black tracking-widest uppercase rounded-full border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-6">
                <WifiOff className="w-3 h-3" />
                Error 404 · Page Not Found
              </div>

              {/* ─ Giant 4▶️4 ─ */}
              <div
                className="flex items-center justify-center md:justify-start mb-5 select-none"
                aria-label="404"
              >
                {/* "4" left */}
                <span
                  className={`text-[8rem] sm:text-[10rem] font-black leading-none tracking-tighter text-black transition-all ${glitchActive ? "translate-x-[3px] opacity-80" : ""}`}
                  style={{ animation: "notFoundPulse 3.2s ease-in-out infinite" }}
                >
                  4
                </span>

                {/* Bouncing Play button as middle "0" */}
                <span
                  aria-hidden
                  className="relative mx-2 sm:mx-3 flex items-center justify-center"
                  style={{ width: "6.5rem", height: "8rem" }}
                >
                  {/* Ping ring */}
                  <span className="absolute inset-0 rounded-[1.75rem] bg-red-600 opacity-20"
                    style={{ animation: "pingRing 2s cubic-bezier(0,0,0.2,1) infinite" }} />
                  {/* Main button */}
                  <span
                    className="absolute inset-0 rounded-[1.75rem] bg-red-600 border-[3px] border-black flex items-center justify-center"
                    style={{
                      boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)",
                      animation: "notFoundBounce 2.6s ease-in-out infinite",
                    }}
                  >
                    <Play className="w-12 sm:w-14 h-12 sm:h-14 text-white fill-white drop-shadow-sm" />
                  </span>
                </span>

                {/* "4" right */}
                <span
                  className={`text-[8rem] sm:text-[10rem] font-black leading-none tracking-tighter text-black transition-all ${glitchActive ? "-translate-x-[3px] opacity-80" : ""}`}
                  style={{ animation: "notFoundPulse 3.2s ease-in-out infinite 0.5s" }}
                >
                  4
                </span>
              </div>

              {/* Counter sub-line */}
              <p className="text-xs font-black text-neutral-400 uppercase tracking-[0.25em] mb-4">
                Error code: <span className="text-red-600"><AnimatedCounter /></span>
              </p>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-3 leading-tight">
                This page doesn&apos;t exist
              </h1>
              <p className="text-neutral-600 text-sm sm:text-base mb-8 max-w-sm mx-auto md:mx-0 leading-relaxed">
                The page you&apos;re looking for was deleted, moved, or never existed.
                Your YouTube growth journey continues — pick a tool below.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-black text-white bg-red-600 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-wide"
                >
                  <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Go Back Home
                </Link>
                <Link
                  href="/tools/viral-title-generator"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-black text-black bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-wide"
                >
                  <Sparkles className="w-4 h-4 text-red-600 group-hover:rotate-12 transition-transform" />
                  Browse AI Tools
                </Link>
              </div>
            </div>

            {/* ─── RIGHT: BROKEN VIDEO CARD ──────────────────────────────── */}
            <div className="shrink-0 w-full max-w-xs md:max-w-sm" aria-hidden>
              <div className="relative">

                {/* Depth shadow card (bottom layer) */}
                <div className="absolute -bottom-3 -right-3 -z-10 w-full h-full rounded-2xl bg-neutral-200 border-2 border-black" />
                <div className="absolute -bottom-1.5 -right-1.5 -z-10 w-full h-full rounded-2xl bg-neutral-100 border-2 border-black" />

                {/* Main card */}
                <div className="relative bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">

                  {/* ── Fake thumbnail ── */}
                  <div className="relative bg-neutral-100 border-b-2 border-black aspect-video flex items-center justify-center overflow-hidden">
                    {/* Scanline overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none z-10 opacity-30"
                      style={{
                        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)",
                        animation: "scanLines 8s linear infinite",
                      }}
                    />
                    {/* Glitch noise stripes */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute left-0 right-0 bg-red-600/15 z-10"
                        style={{
                          top: `${8 + i * 11}%`,
                          height: "5%",
                          animation: `glitchLine ${1.6 + i * 0.28}s step-end infinite`,
                          animationDelay: `${i * 0.18}s`,
                        }}
                      />
                    ))}
                    {/* Static noise dots */}
                    <div className="absolute inset-0 opacity-[0.035]"
                      style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")", backgroundSize: "100px 100px" }} />
                    {/* Center play button */}
                    <div className="relative z-20 flex flex-col items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-red-600 border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                        style={{ animation: "notFoundBounce 3s ease-in-out infinite 0.8s" }}>
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                      <span className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Signal Lost</span>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 z-20 bg-black text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm">
                      4:04
                    </div>
                    {/* HD badge */}
                    <div className="absolute top-2 left-2 z-20 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded border border-black">
                      404p
                    </div>
                  </div>

                  {/* ── Card body ── */}
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-red-600 border-2 border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-sm text-black leading-tight mb-0.5">404: The Missing Video</div>
                        <div className="text-[11px] text-neutral-500 font-bold">YTForge &bull; 0 views &bull; Just now</div>
                      </div>
                    </div>

                    {/* Tags row */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 text-white text-[10px] font-black rounded-full border-2 border-black">
                        <Zap className="w-2.5 h-2.5" /> Not Found
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-black text-[10px] font-black rounded-full border-2 border-black">
                        <WifiOff className="w-2.5 h-2.5" /> Offline
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-black text-white text-[10px] font-black rounded-full border-2 border-black">
                        # error
                      </span>
                    </div>

                    {/* Progress bar (stuck at 0%) */}
                    <div className="mt-3 relative h-1.5 bg-neutral-200 rounded-full border border-black overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-0 bg-red-600 rounded-full" />
                      <div className="absolute right-1 top-0 h-full flex items-center">
                        <span className="text-[8px] font-black text-neutral-400">0%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* ── end right panel ── */}

          </div>
        </div>
      </section>

      {/* ══ QUICK LINKS SECTION ════════════════════════════════════════════ */}
      <section className="bg-white border-b-2 border-black py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">

          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white text-[10px] font-black tracking-widest uppercase rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(200,200,200,1)] mb-4">
              <Wifi className="w-3 h-3 text-red-400" />
              While you&apos;re here
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
              Try our most popular tools
            </h2>
            <p className="text-neutral-500 text-sm mt-2">16+ AI-powered tools built for serious YouTube creators</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map(({ label, href, icon: Icon }, idx) => (
              <Link
                key={href}
                href={href}
                className="group relative flex items-center gap-4 p-4 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center border-2 border-black shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:rotate-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-black text-sm text-black flex-1 leading-tight">{label}</span>
                <ArrowRight className="w-4 h-4 text-neutral-300 group-hover:text-red-600 group-hover:translate-x-1.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BOTTOM CTA STRIP ═══════════════════════════════════════════════ */}
      <section className="relative bg-red-600 border-b-2 border-black py-14 sm:py-20 overflow-hidden">
        {/* Dot pattern overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center relative">
          {/* Icon */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-6 mx-auto"
            style={{ animation: "notFoundBounce 3.5s ease-in-out infinite 1s" }}>
            <Play className="w-8 h-8 text-red-600 fill-red-600" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3 leading-tight">
            Ready to grow your channel?
          </h2>
          <p className="text-red-100 text-sm sm:text-base mb-8 max-w-lg mx-auto leading-relaxed">
            16+ AI-powered tools built for serious YouTube creators.
            No subscription needed to start.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-black text-red-600 bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wide"
            >
              <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
              Start for Free
            </Link>
            <Link
              href="/tools/viral-title-generator"
              className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-black text-white bg-transparent rounded-xl border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.4)] hover:bg-white/10 hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.4)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wide"
            >
              <Zap className="w-4 h-4" />
              Explore Tools
            </Link>
          </div>
        </div>
      </section>

      {/* ══ CSS ANIMATIONS ═════════════════════════════════════════════════ */}
      <style>{`
        @keyframes notFoundBounce {
          0%,100% { transform: translateY(0)    rotate(0deg);  }
          25%      { transform: translateY(-10px) rotate(-4deg); }
          75%      { transform: translateY(5px)  rotate(3deg);  }
        }
        @keyframes notFoundPulse {
          0%,100% { opacity: 1;    }
          50%      { opacity: 0.72; }
        }
        @keyframes glitchLine {
          0%   { opacity: 1;   transform: scaleX(1)   translateX(0);    }
          20%  { opacity: 0;   transform: scaleX(0.5) translateX(6px);  }
          40%  { opacity: 1;   transform: scaleX(1)   translateX(-3px); }
          60%  { opacity: 0;   transform: scaleX(0.7) translateX(4px);  }
          80%  { opacity: 0.8; transform: scaleX(1)   translateX(0);    }
          100% { opacity: 0;                                              }
        }
        @keyframes scanLines {
          0%   { transform: translateY(0);   }
          100% { transform: translateY(8px); }
        }
        @keyframes floatParticle {
          0%   { transform: translateY(0)    scale(1);    }
          100% { transform: translateY(-18px) scale(1.2); }
        }
        @keyframes pingRing {
          75%,100% { transform: scale(1.6); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
