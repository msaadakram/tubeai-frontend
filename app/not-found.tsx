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

/* ─── Particle definitions (stable — computed at module load, not per render) */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 4 + (i % 5) * 3,
  x: 5 + (i * 37) % 90,
  y: 5 + (i * 53) % 85,
  delay: (i * 0.35) % 4,
  duration: 3 + (i % 3),
}));

/* ─── AnimatedCounter ─────────────────────────────────────────────────────
   FIX #3: Added `mounted` guard so server and first client render both
   output "0", eliminating the React hydration text-content mismatch.
*/
function AnimatedCounter() {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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

  // Render stable "0" on server + first paint to avoid hydration mismatch
  if (!mounted) return <>0</>;
  return <>{count}</>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   404 Page
   ═══════════════════════════════════════════════════════════════════════════ */
export default function NotFound() {
  const [glitchActive, setGlitchActive] = useState(false);

  /* Random glitch trigger every 4–8 s */
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
    /*
     * FIX #1 — Dark mode
     * Removed hardcoded `bg-white text-neutral-900`.
     * `bg-background` and `text-foreground` pick up the CSS variables
     * set by the `.dark` class (see globals.css).
     */
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-red-600/20 selection:text-red-900 overflow-x-hidden">

      {/* ══ HERO SECTION ═══════════════════════════════════════════════════ */}
      <section className="relative overflow-hidden border-b-2 border-border pt-24 pb-20 sm:pt-32 sm:pb-28">

        {/* Grid background */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(128,128,128,0.07) 1px,transparent 1px)," +
              "linear-gradient(90deg,rgba(128,128,128,0.07) 1px,transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Floating particles — hidden for reduced-motion users */}
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            aria-hidden
            className="motion-safe:block hidden pointer-events-none absolute rounded-full bg-red-600 nf-float"
            style={{
              width:  p.size,
              height: p.size,
              left:   `${p.x}%`,
              top:    `${p.y}%`,
              opacity: 0.08 + (p.id % 4) * 0.03,
              animationDuration:  `${p.duration}s`,
              animationDelay:     `${p.delay}s`,
            }}
          />
        ))}

        {/* Glow orbs */}
        <div aria-hidden className="pointer-events-none absolute -top-28 -right-28 w-[480px] h-[480px] rounded-full bg-red-600 opacity-[0.055] blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-20 -left-20 w-[360px] h-[360px] rounded-full bg-red-600 opacity-[0.04] blur-3xl" />

        <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative">
          <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">

            {/* ─── LEFT: TEXT ─────────────────────────────────────────── */}
            <div className="flex-1 min-w-0 text-center md:text-left">

              {/* Status badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white text-[10px] font-black tracking-widest uppercase rounded-full border-2 border-border shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] mb-6">
                <WifiOff className="w-3 h-3" />
                Error 404 · Page Not Found
              </div>

              {/*
               * FIX #4 — Mobile overflow
               * Smaller base size on tiny screens (5.5rem), grows at sm (10rem).
               * `min-w-0` on the flex parent allows the row to shrink.
               */}
              <div
                className="flex items-center justify-center md:justify-start mb-5 select-none min-w-0"
                aria-label="404"
              >
                <span
                  className={`
                    text-[5.5rem] sm:text-[10rem]
                    font-black leading-none tracking-tighter text-foreground
                    nf-pulse transition-all
                    ${glitchActive ? "translate-x-[3px] opacity-80" : ""}
                  `}
                >
                  4
                </span>

                {/* Bouncing Play button as middle "0" */}
                <span
                  aria-hidden
                  className="relative mx-2 sm:mx-3 flex items-center justify-center shrink-0"
                  style={{ width: "5.5rem", height: "6.5rem" }}
                >
                  {/* Ping ring — class-driven so reduced-motion CSS can mute it */}
                  <span className="absolute inset-0 rounded-[1.5rem] bg-red-600 opacity-20 motion-safe:nf-ping" />
                  {/* Main bouncing button */}
                  <span
                    className="absolute inset-0 rounded-[1.5rem] bg-red-600 border-[3px] border-border flex items-center justify-center motion-safe:nf-bounce"
                    style={{ boxShadow: "6px 6px 0px 0px rgba(0,0,0,1)" }}
                  >
                    <Play className="w-10 sm:w-12 h-10 sm:h-12 text-white fill-white drop-shadow-sm" />
                  </span>
                </span>

                <span
                  className={`
                    text-[5.5rem] sm:text-[10rem]
                    font-black leading-none tracking-tighter text-foreground
                    nf-pulse-delayed transition-all
                    ${glitchActive ? "-translate-x-[3px] opacity-80" : ""}
                  `}
                >
                  4
                </span>
              </div>

              {/* Counter */}
              <p className="text-xs font-black text-muted-foreground uppercase tracking-[0.25em] mb-4">
                Error code: <span className="text-red-600"><AnimatedCounter /></span>
              </p>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-foreground mb-3 leading-tight">
                This page doesn&apos;t exist
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base mb-8 max-w-sm mx-auto md:mx-0 leading-relaxed">
                The page you&apos;re looking for was deleted, moved, or never existed.
                Your YouTube growth journey continues — pick a tool below.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                <Link
                  href="/"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-black text-white bg-red-600 rounded-xl border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-wide"
                >
                  <Home className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Go Back Home
                </Link>
                <Link
                  href="/tools/viral-title-generator"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 text-sm font-black text-foreground bg-card rounded-xl border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-0.5 active:translate-y-0.5 transition-all uppercase tracking-wide"
                >
                  <Sparkles className="w-4 h-4 text-red-600 group-hover:rotate-12 transition-transform" />
                  Browse AI Tools
                </Link>
              </div>
            </div>

            {/* ─── RIGHT: BROKEN VIDEO CARD ──────────────────────────── */}
            {/*
             * FIX #2 — z-index depth layers
             * Old: -z-10 put depth layers behind the page background → invisible.
             * New: wrap in `relative isolate` to create a self-contained stacking
             *      context. Depth layers use z-0, main card uses z-10.
             */}
            <div className="shrink-0 w-full max-w-xs md:max-w-sm" aria-hidden>
              <div className="relative isolate">

                {/* Depth shadow layers */}
                <div className="absolute -bottom-3 -right-3 z-0 w-full h-full rounded-2xl bg-muted border-2 border-border" />
                <div className="absolute -bottom-1.5 -right-1.5 z-0 w-full h-full rounded-2xl bg-muted/60 border-2 border-border" />

                {/* Main card */}
                <div className="relative z-10 bg-card border-2 border-border rounded-2xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">

                  {/* Fake thumbnail */}
                  <div className="relative bg-muted border-b-2 border-border aspect-video flex items-center justify-center overflow-hidden">
                    {/* Scanline overlay */}
                    <div
                      className="absolute inset-0 pointer-events-none z-10 opacity-30 motion-safe:nf-scan"
                      style={{
                        backgroundImage: "repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)",
                      }}
                    />
                    {/* Glitch stripes */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute left-0 right-0 bg-red-600/15 z-10 motion-safe:nf-glitch"
                        style={{
                          top: `${8 + i * 11}%`,
                          height: "5%",
                          animationDuration: `${1.6 + i * 0.28}s`,
                          animationDelay: `${i * 0.18}s`,
                        }}
                      />
                    ))}
                    {/* Static noise */}
                    <div
                      className="absolute inset-0 opacity-[0.035]"
                      style={{
                        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                        backgroundSize: "100px 100px",
                      }}
                    />
                    {/* Centre play button */}
                    <div className="relative z-20 flex flex-col items-center gap-3">
                      <div
                        className="w-16 h-16 rounded-2xl bg-red-600 border-2 border-border flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] motion-safe:nf-bounce-delayed"
                      >
                        <Play className="w-8 h-8 text-white fill-white" />
                      </div>
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Signal Lost</span>
                    </div>
                    {/* Duration badge */}
                    <div className="absolute bottom-2 right-2 z-20 bg-black text-white text-[10px] font-black px-1.5 py-0.5 rounded-sm">
                      4:04
                    </div>
                    {/* HD badge */}
                    <div className="absolute top-2 left-2 z-20 bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded border border-border">
                      404p
                    </div>
                  </div>

                  {/* Card body */}
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-red-600 border-2 border-border flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-black text-sm text-foreground leading-tight mb-0.5">404: The Missing Video</div>
                        <div className="text-[11px] text-muted-foreground font-bold">YTForge &bull; 0 views &bull; Just now</div>
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 text-white text-[10px] font-black rounded-full border-2 border-border">
                        <Zap className="w-2.5 h-2.5" /> Not Found
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-card text-foreground text-[10px] font-black rounded-full border-2 border-border">
                        <WifiOff className="w-2.5 h-2.5" /> Offline
                      </span>
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-foreground text-background text-[10px] font-black rounded-full border-2 border-border">
                        # error
                      </span>
                    </div>

                    {/* FIX #7 — role="presentation" on decorative progress bar */}
                    <div role="presentation" className="mt-3 relative h-1.5 bg-muted rounded-full border border-border overflow-hidden">
                      <div className="absolute left-0 top-0 h-full w-0 bg-red-600 rounded-full" />
                      <div className="absolute right-1 top-0 h-full flex items-center">
                        <span className="text-[8px] font-black text-muted-foreground">0%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ QUICK LINKS ════════════════════════════════════════════════════ */}
      <section className="bg-background border-b-2 border-border py-14 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-foreground text-background text-[10px] font-black tracking-widest uppercase rounded-full border-2 border-border shadow-[2px_2px_0px_0px_rgba(128,128,128,0.4)] mb-4">
              <Wifi className="w-3 h-3 text-red-400" />
              While you&apos;re here
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
              Try our most popular tools
            </h2>
            <p className="text-muted-foreground text-sm mt-2">16+ AI-powered tools built for serious YouTube creators</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickLinks.map(({ label, href, icon: Icon }, idx) => (
              <Link
                key={href}
                href={href}
                className="group relative flex items-center gap-4 p-4 bg-card border-2 border-border rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,0.5)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,0.5)] hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.5)] active:translate-x-0.5 active:translate-y-0.5 transition-all"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center border-2 border-border shrink-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)] group-hover:rotate-6 group-hover:scale-110 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="font-black text-sm text-foreground flex-1 leading-tight">{label}</span>
                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-red-600 group-hover:translate-x-1.5 transition-all shrink-0" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ BOTTOM CTA ═════════════════════════════════════════════════════ */}
      <section className="relative bg-red-600 border-b-2 border-border py-14 sm:py-20 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center relative">
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-card border-2 border-border shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] mb-6 mx-auto motion-safe:nf-bounce-slow"
          >
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
              className="group inline-flex items-center gap-2 px-7 py-3.5 text-sm font-black text-red-600 bg-card rounded-xl border-2 border-border shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wide"
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

      {/*
       * FIX #6 — Single <style> block with suppressHydrationWarning
       * All keyframes live here. The `motion-safe:` Tailwind variant on
       * animated elements means these animations only run when the user
       * has NOT requested reduced motion, respecting globals.css rule.
       *
       * Class → keyframe mapping:
       *   .nf-bounce        → notFoundBounce
       *   .nf-bounce-delayed → notFoundBounce (0.8s delay)
       *   .nf-bounce-slow   → notFoundBounce (3.5s, 1s delay)
       *   .nf-pulse         → notFoundPulse
       *   .nf-pulse-delayed → notFoundPulse (0.5s delay)
       *   .nf-glitch        → glitchLine
       *   .nf-scan          → scanLines
       *   .nf-float         → floatParticle
       *   .nf-ping          → pingRing
       */}
      <style suppressHydrationWarning>{`
        @keyframes notFoundBounce {
          0%,100% { transform: translateY(0)     rotate(0deg);  }
          25%      { transform: translateY(-10px)  rotate(-4deg); }
          75%      { transform: translateY(5px)   rotate(3deg);  }
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
          0%   { transform: translateY(0)     scale(1);   }
          100% { transform: translateY(-18px) scale(1.2); }
        }
        @keyframes pingRing {
          75%,100% { transform: scale(1.6); opacity: 0; }
        }

        /* Animation utility classes (used with motion-safe: Tailwind variant) */
        .nf-bounce        { animation: notFoundBounce 2.6s ease-in-out infinite; }
        .nf-bounce-delayed{ animation: notFoundBounce 3s   ease-in-out infinite 0.8s; }
        .nf-bounce-slow   { animation: notFoundBounce 3.5s ease-in-out infinite 1s; }
        .nf-pulse         { animation: notFoundPulse  3.2s ease-in-out infinite; }
        .nf-pulse-delayed { animation: notFoundPulse  3.2s ease-in-out infinite 0.5s; }
        .nf-glitch        { animation: glitchLine     1.6s step-end infinite; }
        .nf-scan          { animation: scanLines      8s   linear     infinite; }
        .nf-float         { animation: floatParticle  3s   ease-in-out infinite alternate; }
        .nf-ping          { animation: pingRing       2s   cubic-bezier(0,0,0.2,1) infinite; }

        /* Respect prefers-reduced-motion for any animation class not handled
           by the Tailwind motion-safe: variant (belt-and-suspenders). */
        @media (prefers-reduced-motion: reduce) {
          .nf-bounce, .nf-bounce-delayed, .nf-bounce-slow,
          .nf-pulse, .nf-pulse-delayed,
          .nf-glitch, .nf-scan, .nf-float, .nf-ping {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  );
}
