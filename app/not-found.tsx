"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import {
  Play, Home, Sparkles, TrendingUp, PenTool,
  Download, LineChart, FileText, Hash, ArrowRight,
  Wifi, WifiOff, Zap,
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

/* ─── Stable particles (module-level, no per-render recompute) ────────────── */
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 4 + (i % 5) * 3,
  x: 5 + (i * 37) % 90,
  y: 5 + (i * 53) % 85,
  delay: (i * 0.35) % 4,
  duration: 3 + (i % 3),
}));

/* ─── AnimatedCounter ─────────────────────────────────────────────────────── */
function AnimatedCounter() {
  const [count, setCount]   = useState(0);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
    let frame: number;
    const start    = performance.now();
    const duration = 1400;
    const target   = 404;
    const animate  = (now: number) => {
      const elapsed = Math.min((now - start) / duration, 1);
      const ease    = 1 - Math.pow(1 - elapsed, 4);
      setCount(Math.round(ease * target));
      if (elapsed < 1) frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);
  if (!mounted) return <>0</>;
  return <>{count}</>;
}

/* ═══════════════════════════════════════════════════════════════════════════
   404 Page
   ═══════════════════════════════════════════════════════════════════════════

   CRITICAL: This file lives at app/not-found.tsx — OUTSIDE the [locale]/layout.tsx
   wrapper. That means it NEVER receives the .dark class from RouteShell/ThemeProvider.
   Fix: detect system preference ourselves and apply data-theme on our own wrapper div.
   All CSS tokens are redeclared inline so the page is fully self-contained.
*/
export default function NotFound() {
  const wrapperRef                  = useRef<HTMLDivElement>(null);
  const [glitchActive, setGlitchActive] = useState(false);
  const [mounted, setMounted]           = useState(false);

  /* Apply theme as soon as we're on the client */
  useEffect(() => {
    setMounted(true);
    const apply = (dark: boolean) => {
      wrapperRef.current?.setAttribute("data-nf-theme", dark ? "dark" : "light");
    };
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    apply(mq.matches);
    const onChange = (e: MediaQueryListEvent) => apply(e.matches);
    mq.addEventListener("change", onChange);
    /* Also check if parent already has .dark (when RouteShell IS present) */
    if (document.documentElement.classList.contains("dark") ||
        document.body.classList.contains("dark")) {
      apply(true);
    }
    return () => mq.removeEventListener("change", onChange);
  }, []);

  /* Glitch trigger */
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const schedule = () => {
      timer = setTimeout(() => {
        setGlitchActive(true);
        setTimeout(() => { setGlitchActive(false); schedule(); }, 380);
      }, 4000 + Math.random() * 4000);
    };
    schedule();
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* ── Self-contained styles ─────────────────────────────────────────
          Placed BEFORE the markup so keyframes & vars are ready on first paint.
          data-nf-theme="dark" on the wrapper div toggles the dark palette.
      */}
      <style suppressHydrationWarning>{`
        /* Light palette */
        [data-nf-root] {
          --nf-bg:          #ffffff;
          --nf-surface:     #ffffff;
          --nf-fg:          #0a0a0a;
          --nf-muted-fg:    #717182;
          --nf-border:      rgba(0,0,0,0.12);
          --nf-muted-bg:    #ececf0;
          --nf-shadow:      rgba(0,0,0,1);
          --nf-red:         #dc2626;
          color-scheme: light;
        }
        /* Dark palette — applied when data-nf-theme="dark" */
        [data-nf-root][data-nf-theme="dark"] {
          --nf-bg:          oklch(0.145 0 0);
          --nf-surface:     oklch(0.145 0 0);
          --nf-fg:          oklch(0.985 0 0);
          --nf-muted-fg:    oklch(0.708 0 0);
          --nf-border:      oklch(0.269 0 0);
          --nf-muted-bg:    oklch(0.269 0 0);
          --nf-shadow:      rgba(0,0,0,0.9);
          --nf-red:         #ef4444;
          color-scheme: dark;
        }
        /* System dark fallback (before JS runs) */
        @media (prefers-color-scheme: dark) {
          [data-nf-root]:not([data-nf-theme="light"]) {
            --nf-bg:          oklch(0.145 0 0);
            --nf-surface:     oklch(0.145 0 0);
            --nf-fg:          oklch(0.985 0 0);
            --nf-muted-fg:    oklch(0.708 0 0);
            --nf-border:      oklch(0.269 0 0);
            --nf-muted-bg:    oklch(0.269 0 0);
            --nf-shadow:      rgba(0,0,0,0.9);
            --nf-red:         #ef4444;
            color-scheme: dark;
          }
        }

        /* Base resets scoped to 404 */
        [data-nf-root] * { box-sizing: border-box; }
        [data-nf-root] {
          background-color: var(--nf-bg);
          color: var(--nf-fg);
          min-height: 100vh;
          overflow-x: hidden;
          font-synthesis: none;
          -webkit-font-smoothing: antialiased;
        }

        /* ── Keyframes ─────────────────────────────────────────────────── */
        @keyframes nfBounce {
          0%,100% { transform: translateY(0) rotate(0deg); }
          25%     { transform: translateY(-10px) rotate(-4deg); }
          75%     { transform: translateY(5px) rotate(3deg); }
        }
        @keyframes nfPulse {
          0%,100% { opacity: 1; }
          50%     { opacity: 0.7; }
        }
        @keyframes nfGlitch {
          0%  { opacity:1;   transform:scaleX(1)   translateX(0);   }
          20% { opacity:0;   transform:scaleX(0.5) translateX(6px); }
          40% { opacity:1;   transform:scaleX(1)   translateX(-3px);}
          60% { opacity:0;   transform:scaleX(0.7) translateX(4px); }
          80% { opacity:0.8; transform:scaleX(1)   translateX(0);   }
          100%{ opacity:0; }
        }
        @keyframes nfScan {
          0%   { transform: translateY(0); }
          100% { transform: translateY(8px); }
        }
        @keyframes nfFloat {
          0%   { transform: translateY(0) scale(1); }
          100% { transform: translateY(-18px) scale(1.2); }
        }
        @keyframes nfPing {
          75%,100% { transform: scale(1.6); opacity: 0; }
        }

        /* ── Animation classes ─────────────────────────────────────────── */
        .nf-bounce         { animation: nfBounce 2.6s ease-in-out infinite; }
        .nf-bounce-delayed { animation: nfBounce 3s   ease-in-out infinite 0.8s; }
        .nf-bounce-slow    { animation: nfBounce 3.5s ease-in-out infinite 1s; }
        .nf-pulse          { animation: nfPulse  3.2s ease-in-out infinite; }
        .nf-pulse-d        { animation: nfPulse  3.2s ease-in-out infinite 0.5s; }
        .nf-glitch         { animation: nfGlitch 1.6s step-end infinite; }
        .nf-scan           { animation: nfScan   8s   linear infinite; }
        .nf-float          { animation: nfFloat  3s   ease-in-out infinite alternate; }
        .nf-ping           { animation: nfPing   2s   cubic-bezier(0,0,0.2,1) infinite; }

        /* ── Reduced-motion: kill every animation ───────────────────────── */
        @media (prefers-reduced-motion: reduce) {
          .nf-bounce, .nf-bounce-delayed, .nf-bounce-slow,
          .nf-pulse, .nf-pulse-d, .nf-glitch, .nf-scan,
          .nf-float, .nf-ping { animation: none !important; }
        }

        /* ── Depth card layers ──────────────────────────────────────────── */
        .nf-card-depth-1 {
          position: absolute;
          inset: 0;
          bottom: -12px;
          right: -12px;
          border-radius: 1rem;
          background-color: var(--nf-muted-bg);
          border: 2px solid var(--nf-border);
          z-index: 1;
        }
        .nf-card-depth-2 {
          position: absolute;
          inset: 0;
          bottom: -6px;
          right: -6px;
          border-radius: 1rem;
          background-color: var(--nf-muted-bg);
          opacity: 0.6;
          border: 2px solid var(--nf-border);
          z-index: 2;
        }
        .nf-card-main {
          position: relative;
          z-index: 3;
          background-color: var(--nf-surface);
          border: 2px solid var(--nf-border);
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 6px 6px 0px 0px var(--nf-shadow);
        }

        /* ── Utility classes using CSS vars ─────────────────────────────── */
        .nf-border  { border-color: var(--nf-border) !important; }
        .nf-surface { background-color: var(--nf-surface) !important; }
        .nf-muted   { background-color: var(--nf-muted-bg) !important; }
        .nf-fg      { color: var(--nf-fg) !important; }
        .nf-muted-fg{ color: var(--nf-muted-fg) !important; }
      `}</style>

      {/* ── Page wrapper — this div owns the theme ────────────────────── */}
      <div
        ref={wrapperRef}
        data-nf-root
        className="font-sans selection:bg-red-600/20"
      >

        {/* ══ HERO ══════════════════════════════════════════════════════ */}
        <section
          style={{
            borderBottom: "2px solid var(--nf-border)",
            paddingTop: "6rem",
            paddingBottom: "5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Grid bg */}
          <div
            aria-hidden
            style={{
              position: "absolute", inset: 0, pointerEvents: "none",
              backgroundImage:
                "linear-gradient(rgba(128,128,128,0.07) 1px,transparent 1px)," +
                "linear-gradient(90deg,rgba(128,128,128,0.07) 1px,transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Particles */}
          {mounted && PARTICLES.map((p) => (
            <div
              key={p.id}
              aria-hidden
              className="nf-float"
              style={{
                position: "absolute",
                width: p.size, height: p.size,
                left: `${p.x}%`, top: `${p.y}%`,
                borderRadius: "50%",
                backgroundColor: "var(--nf-red)",
                opacity: 0.08 + (p.id % 4) * 0.03,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Glow orbs */}
          <div aria-hidden style={{ position:"absolute", top:"-7rem", right:"-7rem", width:"30rem", height:"30rem", borderRadius:"50%", backgroundColor:"var(--nf-red)", opacity:0.055, filter:"blur(80px)", pointerEvents:"none" }} />
          <div aria-hidden style={{ position:"absolute", bottom:"-5rem", left:"-5rem",  width:"22rem", height:"22rem", borderRadius:"50%", backgroundColor:"var(--nf-red)", opacity:0.04,  filter:"blur(80px)", pointerEvents:"none" }} />

          <div style={{ maxWidth:"64rem", margin:"0 auto", padding:"0 1.5rem", position:"relative" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"3rem" }}
                 className="md:flex-row md:items-center md:gap-16">

              {/* LEFT: TEXT */}
              <div style={{ flex:1, minWidth:0, textAlign:"center" }} className="md:text-left">

                {/* Badge */}
                <div style={{
                  display:"inline-flex", alignItems:"center", gap:"0.5rem",
                  padding:"0.375rem 0.75rem",
                  backgroundColor:"var(--nf-red)", color:"#fff",
                  fontSize:"0.625rem", fontWeight:900, letterSpacing:"0.15em",
                  textTransform:"uppercase", borderRadius:"9999px",
                  border:"2px solid var(--nf-border)",
                  boxShadow:"3px 3px 0px 0px var(--nf-shadow)",
                  marginBottom:"1.5rem",
                }}>
                  <WifiOff style={{ width:"0.75rem", height:"0.75rem" }} />
                  Error 404 · Page Not Found
                </div>

                {/* 4 🔴 4 digits */}
                <div
                  aria-label="404"
                  style={{
                    display:"flex", alignItems:"center", justifyContent:"center",
                    marginBottom:"1.25rem", userSelect:"none", minWidth:0,
                  }}
                  className="md:justify-start"
                >
                  <span
                    className={`nf-pulse${glitchActive ? " nf-glitch-digit" : ""}`}
                    style={{
                      fontSize:"clamp(5rem,13vw,10rem)",
                      fontWeight:900,
                      lineHeight:1,
                      letterSpacing:"-0.05em",
                      color:"var(--nf-fg)",
                      transition:"transform 0.1s, opacity 0.1s",
                      transform: glitchActive ? "translateX(3px)" : "none",
                      opacity:   glitchActive ? 0.8 : 1,
                    }}
                  >4</span>

                  {/* Centre play-button "0" */}
                  <span
                    aria-hidden
                    style={{
                      position:"relative", margin:"0 0.5rem",
                      flexShrink:0,
                      width:"clamp(4.5rem,11vw,8rem)",
                      height:"clamp(5.5rem,13vw,10rem)",
                      display:"flex", alignItems:"center", justifyContent:"center",
                    }}
                  >
                    {/* Ping ring */}
                    <span className="nf-ping" style={{
                      position:"absolute", inset:0,
                      borderRadius:"1.25rem",
                      backgroundColor:"var(--nf-red)",
                      opacity:0.2,
                    }} />
                    {/* Bouncing button */}
                    <span
                      className="nf-bounce"
                      style={{
                        position:"absolute", inset:0,
                        borderRadius:"1.25rem",
                        backgroundColor:"var(--nf-red)",
                        border:"3px solid var(--nf-border)",
                        display:"flex", alignItems:"center", justifyContent:"center",
                        boxShadow:"6px 6px 0px 0px var(--nf-shadow)",
                      }}
                    >
                      <Play style={{ width:"40%", height:"40%", color:"#fff", fill:"#fff" }} />
                    </span>
                  </span>

                  <span
                    className="nf-pulse-d"
                    style={{
                      fontSize:"clamp(5rem,13vw,10rem)",
                      fontWeight:900,
                      lineHeight:1,
                      letterSpacing:"-0.05em",
                      color:"var(--nf-fg)",
                      transition:"transform 0.1s, opacity 0.1s",
                      transform: glitchActive ? "translateX(-3px)" : "none",
                      opacity:   glitchActive ? 0.8 : 1,
                    }}
                  >4</span>
                </div>

                {/* Counter */}
                <p style={{ fontSize:"0.75rem", fontWeight:900, color:"var(--nf-muted-fg)", textTransform:"uppercase", letterSpacing:"0.25em", marginBottom:"1rem" }}>
                  Error code: <span style={{ color:"var(--nf-red)" }}><AnimatedCounter /></span>
                </p>

                <h1 style={{ fontSize:"clamp(1.5rem,4vw,2.5rem)", fontWeight:900, letterSpacing:"-0.03em", color:"var(--nf-fg)", marginBottom:"0.75rem", lineHeight:1.2 }}>
                  This page doesn&apos;t exist
                </h1>
                <p style={{ color:"var(--nf-muted-fg)", fontSize:"clamp(0.875rem,2vw,1rem)", marginBottom:"2rem", maxWidth:"28rem", lineHeight:1.6 }}>
                  The page you&apos;re looking for was deleted, moved, or never existed.
                  Your YouTube growth journey continues — pick a tool below.
                </p>

                {/* CTAs */}
                <div style={{ display:"flex", flexWrap:"wrap", gap:"0.75rem", justifyContent:"center" }} className="md:justify-start">
                  <Link
                    href="/"
                    style={{
                      display:"inline-flex", alignItems:"center", gap:"0.5rem",
                      padding:"0.875rem 1.5rem",
                      fontSize:"0.8125rem", fontWeight:900, color:"#fff",
                      backgroundColor:"var(--nf-red)",
                      borderRadius:"0.75rem",
                      border:"2px solid var(--nf-border)",
                      boxShadow:"4px 4px 0px 0px var(--nf-shadow)",
                      textTransform:"uppercase", letterSpacing:"0.05em",
                      textDecoration:"none",
                      transition:"box-shadow 0.15s, transform 0.15s",
                    }}
                    onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.boxShadow="6px 6px 0px 0px var(--nf-shadow)"; (e.currentTarget as HTMLElement).style.transform="translate(-2px,-2px)"; }}
                    onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.boxShadow="4px 4px 0px 0px var(--nf-shadow)"; (e.currentTarget as HTMLElement).style.transform="none"; }}
                  >
                    <Home style={{ width:"1rem", height:"1rem" }} />
                    Go Back Home
                  </Link>
                  <Link
                    href="/tools/viral-title-generator"
                    style={{
                      display:"inline-flex", alignItems:"center", gap:"0.5rem",
                      padding:"0.875rem 1.5rem",
                      fontSize:"0.8125rem", fontWeight:900, color:"var(--nf-fg)",
                      backgroundColor:"var(--nf-surface)",
                      borderRadius:"0.75rem",
                      border:"2px solid var(--nf-border)",
                      boxShadow:"4px 4px 0px 0px var(--nf-shadow)",
                      textTransform:"uppercase", letterSpacing:"0.05em",
                      textDecoration:"none",
                      transition:"box-shadow 0.15s, transform 0.15s",
                    }}
                    onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.boxShadow="6px 6px 0px 0px var(--nf-shadow)"; (e.currentTarget as HTMLElement).style.transform="translate(-2px,-2px)"; }}
                    onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.boxShadow="4px 4px 0px 0px var(--nf-shadow)"; (e.currentTarget as HTMLElement).style.transform="none"; }}
                  >
                    <Sparkles style={{ width:"1rem", height:"1rem", color:"var(--nf-red)" }} />
                    Browse AI Tools
                  </Link>
                </div>
              </div>

              {/* RIGHT: BROKEN VIDEO CARD */}
              <div
                aria-hidden
                style={{ flexShrink:0, width:"100%", maxWidth:"22rem", position:"relative" }}
              >
                {/* depth layers  */}
                <div className="nf-card-depth-1" />
                <div className="nf-card-depth-2" />

                {/* main card */}
                <div className="nf-card-main">
                  {/* Fake thumbnail */}
                  <div style={{
                    position:"relative",
                    backgroundColor:"var(--nf-muted-bg)",
                    borderBottom:"2px solid var(--nf-border)",
                    aspectRatio:"16/9",
                    display:"flex", alignItems:"center", justifyContent:"center",
                    overflow:"hidden",
                  }}>
                    {/* Scanlines */}
                    <div
                      className="nf-scan"
                      style={{
                        position:"absolute", inset:0, zIndex:10, opacity:0.3,
                        backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px)",
                        pointerEvents:"none",
                      }}
                    />
                    {/* Glitch stripes */}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div
                        key={i}
                        className="nf-glitch"
                        style={{
                          position:"absolute", left:0, right:0,
                          backgroundColor:"rgba(220,38,38,0.15)",
                          zIndex:10,
                          top:`${8 + i * 11}%`, height:"5%",
                          animationDuration:`${1.6 + i * 0.28}s`,
                          animationDelay:`${i * 0.18}s`,
                          pointerEvents:"none",
                        }}
                      />
                    ))}
                    {/* Centre play */}
                    <div style={{ position:"relative", zIndex:20, display:"flex", flexDirection:"column", alignItems:"center", gap:"0.75rem" }}>
                      <div
                        className="nf-bounce-delayed"
                        style={{
                          width:"4rem", height:"4rem", borderRadius:"1rem",
                          backgroundColor:"var(--nf-red)",
                          border:"2px solid var(--nf-border)",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          boxShadow:"4px 4px 0px 0px var(--nf-shadow)",
                        }}
                      >
                        <Play style={{ width:"2rem", height:"2rem", color:"#fff", fill:"#fff" }} />
                      </div>
                      <span style={{ fontSize:"0.625rem", fontWeight:900, color:"var(--nf-muted-fg)", textTransform:"uppercase", letterSpacing:"0.15em" }}>Signal Lost</span>
                    </div>
                    {/* Duration badge */}
                    <div style={{ position:"absolute", bottom:"0.5rem", right:"0.5rem", zIndex:20, backgroundColor:"#000", color:"#fff", fontSize:"0.625rem", fontWeight:900, padding:"0.125rem 0.375rem", borderRadius:"0.25rem" }}>4:04</div>
                    {/* HD badge */}
                    <div style={{ position:"absolute", top:"0.5rem", left:"0.5rem", zIndex:20, backgroundColor:"var(--nf-red)", color:"#fff", fontSize:"0.5625rem", fontWeight:900, padding:"0.125rem 0.375rem", borderRadius:"0.25rem", border:"1px solid var(--nf-border)" }}>404p</div>
                  </div>

                  {/* Card body */}
                  <div style={{ padding:"1rem", backgroundColor:"var(--nf-surface)" }}>
                    <div style={{ display:"flex", alignItems:"flex-start", gap:"0.75rem", marginBottom:"0.75rem" }}>
                      <div style={{ width:"2.5rem", height:"2.5rem", borderRadius:"0.75rem", backgroundColor:"var(--nf-red)", border:"2px solid var(--nf-border)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, boxShadow:"2px 2px 0px 0px var(--nf-shadow)" }}>
                        <Play style={{ width:"1rem", height:"1rem", color:"#fff", fill:"#fff" }} />
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontWeight:900, fontSize:"0.875rem", color:"var(--nf-fg)", lineHeight:1.3, marginBottom:"0.125rem" }}>404: The Missing Video</div>
                        <div style={{ fontSize:"0.6875rem", color:"var(--nf-muted-fg)", fontWeight:700 }}>YTForge &bull; 0 views &bull; Just now</div>
                      </div>
                    </div>
                    {/* Tags */}
                    <div style={{ display:"flex", flexWrap:"wrap", gap:"0.5rem" }}>
                      {[
                        { icon: <Zap style={{width:"0.625rem",height:"0.625rem"}} />, label:"Not Found",  bg:"var(--nf-red)", color:"#fff" },
                        { icon: <WifiOff style={{width:"0.625rem",height:"0.625rem"}} />, label:"Offline",  bg:"var(--nf-surface)", color:"var(--nf-fg)" },
                        { icon: null, label:"# error", bg:"var(--nf-fg)", color:"var(--nf-bg)" },
                      ].map(({ icon, label, bg, color }) => (
                        <span key={label} style={{ display:"inline-flex", alignItems:"center", gap:"0.25rem", padding:"0.25rem 0.625rem", backgroundColor:bg, color:color, fontSize:"0.625rem", fontWeight:900, borderRadius:"9999px", border:"2px solid var(--nf-border)" }}>
                          {icon}{label}
                        </span>
                      ))}
                    </div>
                    {/* Progress bar */}
                    <div role="presentation" style={{ marginTop:"0.75rem", position:"relative", height:"0.375rem", backgroundColor:"var(--nf-muted-bg)", borderRadius:"9999px", border:"1px solid var(--nf-border)", overflow:"hidden" }}>
                      <div style={{ position:"absolute", left:0, top:0, height:"100%", width:0, backgroundColor:"var(--nf-red)", borderRadius:"9999px" }} />
                      <span style={{ position:"absolute", right:"0.25rem", top:0, height:"100%", display:"flex", alignItems:"center", fontSize:"0.5rem", fontWeight:900, color:"var(--nf-muted-fg)" }}>0%</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══ QUICK LINKS ══════════════════════════════════════════════ */}
        <section style={{ borderBottom:"2px solid var(--nf-border)", padding:"5rem 0", backgroundColor:"var(--nf-bg)" }}>
          <div style={{ maxWidth:"64rem", margin:"0 auto", padding:"0 1.5rem" }}>
            <div style={{ textAlign:"center", marginBottom:"2.5rem" }}>
              <div style={{
                display:"inline-flex", alignItems:"center", gap:"0.5rem",
                padding:"0.375rem 0.75rem",
                backgroundColor:"var(--nf-fg)", color:"var(--nf-bg)",
                fontSize:"0.625rem", fontWeight:900, letterSpacing:"0.15em",
                textTransform:"uppercase", borderRadius:"9999px",
                border:"2px solid var(--nf-border)",
                boxShadow:"2px 2px 0px 0px rgba(128,128,128,0.4)",
                marginBottom:"1rem",
              }}>
                <Wifi style={{ width:"0.75rem", height:"0.75rem", color:"var(--nf-red)" }} />
                While you&apos;re here
              </div>
              <h2 style={{ fontSize:"clamp(1.5rem,3vw,2rem)", fontWeight:900, letterSpacing:"-0.03em", color:"var(--nf-fg)" }}>
                Try our most popular tools
              </h2>
              <p style={{ color:"var(--nf-muted-fg)", fontSize:"0.875rem", marginTop:"0.5rem" }}>16+ AI-powered tools built for serious YouTube creators</p>
            </div>

            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(min(18rem,100%),1fr))", gap:"1rem" }}>
              {quickLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  style={{
                    display:"flex", alignItems:"center", gap:"1rem",
                    padding:"1rem",
                    backgroundColor:"var(--nf-surface)",
                    border:"2px solid var(--nf-border)",
                    borderRadius:"0.75rem",
                    boxShadow:"3px 3px 0px 0px var(--nf-shadow)",
                    textDecoration:"none",
                    transition:"box-shadow 0.15s, transform 0.15s",
                    color:"var(--nf-fg)",
                  }}
                  onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.boxShadow="6px 6px 0px 0px var(--nf-shadow)"; (e.currentTarget as HTMLElement).style.transform="translate(-2px,-2px)"; }}
                  onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.boxShadow="3px 3px 0px 0px var(--nf-shadow)"; (e.currentTarget as HTMLElement).style.transform="none"; }}
                >
                  <div style={{ width:"2.75rem", height:"2.75rem", borderRadius:"0.75rem", backgroundColor:"var(--nf-red)", color:"#fff", display:"flex", alignItems:"center", justifyContent:"center", border:"2px solid var(--nf-border)", flexShrink:0, boxShadow:"2px 2px 0px 0px var(--nf-shadow)" }}>
                    <Icon style={{ width:"1.25rem", height:"1.25rem" }} />
                  </div>
                  <span style={{ fontWeight:900, fontSize:"0.875rem", flex:1, lineHeight:1.3 }}>{label}</span>
                  <ArrowRight style={{ width:"1rem", height:"1rem", color:"var(--nf-muted-fg)", flexShrink:0 }} />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══ BOTTOM CTA ═══════════════════════════════════════════════ */}
        <section style={{ position:"relative", backgroundColor:"var(--nf-red)", borderBottom:"2px solid var(--nf-border)", padding:"5rem 0", overflow:"hidden" }}>
          <div
            aria-hidden
            style={{ position:"absolute", inset:0, opacity:0.1, pointerEvents:"none",
              backgroundImage:"radial-gradient(circle,rgba(255,255,255,0.6) 1px,transparent 1px)",
              backgroundSize:"20px 20px",
            }}
          />
          <div style={{ maxWidth:"48rem", margin:"0 auto", padding:"0 1.5rem", position:"relative", textAlign:"center" }}>
            <div
              className="nf-bounce-slow"
              style={{
                display:"inline-flex", alignItems:"center", justifyContent:"center",
                width:"4rem", height:"4rem", borderRadius:"1rem",
                backgroundColor:"var(--nf-surface)",
                border:"2px solid var(--nf-border)",
                boxShadow:"5px 5px 0px 0px var(--nf-shadow)",
                marginBottom:"1.5rem",
              }}
            >
              <Play style={{ width:"2rem", height:"2rem", color:"var(--nf-red)", fill:"var(--nf-red)" }} />
            </div>
            <h2 style={{ fontSize:"clamp(1.5rem,4vw,2.5rem)", fontWeight:900, color:"#fff", letterSpacing:"-0.03em", marginBottom:"0.75rem", lineHeight:1.2 }}>
              Ready to grow your channel?
            </h2>
            <p style={{ color:"rgba(255,255,255,0.85)", fontSize:"clamp(0.875rem,2vw,1rem)", marginBottom:"2rem", maxWidth:"32rem", margin:"0 auto 2rem", lineHeight:1.6 }}>
              16+ AI-powered tools built for serious YouTube creators.
              No subscription needed to start.
            </p>
            <div style={{ display:"flex", flexWrap:"wrap", gap:"0.75rem", justifyContent:"center" }}>
              <Link
                href="/"
                style={{
                  display:"inline-flex", alignItems:"center", gap:"0.5rem",
                  padding:"0.875rem 1.75rem",
                  fontSize:"0.8125rem", fontWeight:900,
                  color:"var(--nf-red)", backgroundColor:"var(--nf-surface)",
                  borderRadius:"0.75rem",
                  border:"2px solid var(--nf-border)",
                  boxShadow:"4px 4px 0px 0px var(--nf-shadow)",
                  textTransform:"uppercase", letterSpacing:"0.05em",
                  textDecoration:"none",
                  transition:"box-shadow 0.15s, transform 0.15s",
                }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.boxShadow="6px 6px 0px 0px var(--nf-shadow)"; (e.currentTarget as HTMLElement).style.transform="translate(-2px,-2px)"; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.boxShadow="4px 4px 0px 0px var(--nf-shadow)"; (e.currentTarget as HTMLElement).style.transform="none"; }}
              >
                <Sparkles style={{ width:"1rem", height:"1rem" }} />
                Start for Free
              </Link>
              <Link
                href="/tools/viral-title-generator"
                style={{
                  display:"inline-flex", alignItems:"center", gap:"0.5rem",
                  padding:"0.875rem 1.75rem",
                  fontSize:"0.8125rem", fontWeight:900,
                  color:"#fff", backgroundColor:"transparent",
                  borderRadius:"0.75rem",
                  border:"2px solid rgba(255,255,255,0.7)",
                  boxShadow:"4px 4px 0px 0px rgba(255,255,255,0.3)",
                  textTransform:"uppercase", letterSpacing:"0.05em",
                  textDecoration:"none",
                  transition:"box-shadow 0.15s, transform 0.15s, background 0.15s",
                }}
                onMouseEnter={e=>{ (e.currentTarget as HTMLElement).style.boxShadow="6px 6px 0px 0px rgba(255,255,255,0.3)"; (e.currentTarget as HTMLElement).style.transform="translate(-2px,-2px)"; (e.currentTarget as HTMLElement).style.backgroundColor="rgba(255,255,255,0.1)"; }}
                onMouseLeave={e=>{ (e.currentTarget as HTMLElement).style.boxShadow="4px 4px 0px 0px rgba(255,255,255,0.3)"; (e.currentTarget as HTMLElement).style.transform="none"; (e.currentTarget as HTMLElement).style.backgroundColor="transparent"; }}
              >
                <Zap style={{ width:"1rem", height:"1rem" }} />
                Explore Tools
              </Link>
            </div>
          </div>
        </section>

      </div>
    </>
  );
}
