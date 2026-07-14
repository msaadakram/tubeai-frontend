import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { defaultLocale } from "@/lib/i18n/config";
import { getLocalePath } from "@/lib/i18n/utils";
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
} from "lucide-react";

const quickLinks = [
  { label: "Viral Title Generator", href: "/tools/viral-title-generator", icon: TrendingUp },
  { label: "AI Script Writer",       href: "/tools/ai-script-writer",       icon: PenTool    },
  { label: "Thumbnail Downloader",   href: "/tools/thumbnail-downloader",   icon: Download   },
  { label: "SEO Analyzer",           href: "/tools/seo-analyzer",           icon: LineChart  },
  { label: "AI Transcript",          href: "/tools/ai-transcript",          icon: FileText   },
  { label: "Hashtag Generator",      href: "/tools/hashtag-generator",      icon: Hash       },
];

export default function NotFound() {
  const home = getLocalePath(defaultLocale, "/");
  const tools = getLocalePath(defaultLocale, "/tools/viral-title-generator");

  return (
    <div className="min-h-screen bg-white text-neutral-900 font-sans selection:bg-red-600/20 selection:text-red-900">
      <Navbar />

      <main className="pt-20 sm:pt-24">
        {/* ── Hero ─────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden border-b-2 border-black py-16 sm:py-24">
          {/* Grid background pattern */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px)," +
                "linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)",
              backgroundSize: "32px 32px",
            }}
          />

          {/* Red corner accent */}
          <div aria-hidden className="pointer-events-none absolute -top-20 -right-20 w-72 h-72 bg-red-600 rounded-full opacity-[0.06]" />
          <div aria-hidden className="pointer-events-none absolute -bottom-16 -left-16 w-56 h-56 bg-red-600 rounded-full opacity-[0.04]" />

          <div className="container mx-auto px-4 sm:px-6 max-w-5xl relative">
            <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">

              {/* Left — text */}
              <div className="flex-1 text-center md:text-left">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600 text-white text-[10px] font-black tracking-wider uppercase rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-5">
                  <Sparkles className="w-3 h-3" />
                  Oops! Lost in the algorithm
                </div>

                {/* Giant 404 */}
                <div className="flex items-center justify-center md:justify-start gap-0 mb-4 select-none" aria-label="404">
                  <span
                    className="text-[7rem] sm:text-[9rem] font-black leading-none tracking-tighter text-black"
                    style={{ animation: "notFoundPulse 3s ease-in-out infinite" }}
                  >
                    4
                  </span>
                  {/* Animated Play button as the middle '0' */}
                  <span
                    className="relative mx-1 sm:mx-2 flex items-center justify-center w-[5.5rem] sm:w-[7rem] h-[7rem] sm:h-[9rem]"
                    aria-hidden
                  >
                    <span className="absolute inset-0 rounded-[1.5rem] bg-red-600 border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center"
                      style={{ animation: "notFoundBounce 2.4s ease-in-out infinite" }}
                    >
                      <Play className="w-10 sm:w-14 h-10 sm:h-14 text-white fill-white" />
                    </span>
                  </span>
                  <span
                    className="text-[7rem] sm:text-[9rem] font-black leading-none tracking-tighter text-black"
                    style={{ animation: "notFoundPulse 3s ease-in-out infinite 0.4s" }}
                  >
                    4
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-3">
                  This page doesn&apos;t exist
                </h1>
                <p className="text-neutral-600 text-sm sm:text-base mb-8 max-w-sm mx-auto md:mx-0">
                  The page you&apos;re looking for was deleted, moved, or never existed.
                  Don&apos;t worry — your YouTube growth journey continues below.
                </p>

                {/* CTA buttons */}
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-3">
                  <Link
                    href={home}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black text-white bg-red-600 rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wide"
                  >
                    <Home className="w-4 h-4" /> Go Back Home
                  </Link>
                  <Link
                    href={tools}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-black text-black bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wide"
                  >
                    <Sparkles className="w-4 h-4 text-red-600" /> Browse Tools
                  </Link>
                </div>
              </div>

              {/* Right — decorative broken video card */}
              <div className="shrink-0 w-full max-w-xs md:max-w-sm" aria-hidden>
                <div className="relative">
                  {/* Main card */}
                  <div className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
                    {/* Fake thumbnail */}
                    <div className="relative bg-neutral-100 border-b-2 border-black aspect-video flex items-center justify-center">
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* Noise stripes — broken video effect */}
                        {Array.from({ length: 7 }).map((_, i) => (
                          <div
                            key={i}
                            className="absolute left-0 right-0 bg-red-600/10"
                            style={{
                              top: `${10 + i * 13}%`,
                              height: "6%",
                              animation: `glitchLine ${1.5 + i * 0.3}s step-end infinite`,
                              animationDelay: `${i * 0.2}s`,
                            }}
                          />
                        ))}
                        <div className="w-14 h-14 rounded-2xl bg-red-600 border-2 border-black flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                          <Play className="w-7 h-7 text-white fill-white" />
                        </div>
                      </div>
                      {/* Duration badge */}
                      <div className="absolute bottom-2 right-2 bg-black text-white text-[10px] font-black px-1.5 py-0.5 rounded">
                        4:04
                      </div>
                    </div>
                    {/* Card body */}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-9 h-9 rounded-lg bg-red-600 border-2 border-black flex items-center justify-center shrink-0">
                          <Play className="w-4 h-4 text-white fill-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-black text-sm text-black leading-tight mb-1">
                            404: The Missing Video
                          </div>
                          <div className="text-[11px] text-neutral-500 font-bold">YTForge &bull; 0 views &bull; Just now</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-600 text-white text-[10px] font-black rounded-full border-2 border-black">
                          <Sparkles className="w-2.5 h-2.5" /> AI Generated
                        </span>
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white text-black text-[10px] font-black rounded-full border-2 border-black">
                          # Not Found
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stacked card shadow (depth illusion) */}
                  <div aria-hidden className="absolute -bottom-2 -right-2 -z-10 w-full h-full rounded-2xl bg-neutral-200 border-2 border-black" />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── Quick Links ──────────────────────────────────────────── */}
        <section className="bg-white border-b-2 border-black py-14 sm:py-20">
          <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
            <div className="text-center mb-10">
              <p className="text-xs font-black text-red-600 uppercase tracking-widest mb-2">
                While you&apos;re here
              </p>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-black">
                Try our most popular tools
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map(({ label, href, icon: Icon }) => (
                <Link
                  key={href}
                  href={getLocalePath(defaultLocale, href)}
                  className="group flex items-center gap-4 p-4 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <div className="w-11 h-11 rounded-xl bg-red-600 text-white flex items-center justify-center border-2 border-black shrink-0 group-hover:rotate-3 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-black text-sm text-black flex-1">{label}</span>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-red-600 group-hover:translate-x-1 transition-all" />
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Bottom CTA ───────────────────────────────────────────── */}
        <section className="bg-red-600 border-b-2 border-black py-12 sm:py-16">
          <div className="container mx-auto px-4 sm:px-6 max-w-3xl text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-5 mx-auto">
              <Play className="w-7 h-7 text-red-600 fill-red-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-3">
              Ready to grow your channel?
            </h2>
            <p className="text-red-100 text-sm sm:text-base mb-7 max-w-lg mx-auto">
              16+ AI-powered tools built for serious YouTube creators.
              No subscriptions needed to start.
            </p>
            <Link
              href={home}
              className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-black text-red-600 bg-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all uppercase tracking-wide"
            >
              <Sparkles className="w-4 h-4" /> Start for Free
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      {/* ── CSS animations (scoped, no JS required) ──────────────── */}
      <style>{`
        @keyframes notFoundBounce {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25%       { transform: translateY(-8px) rotate(-3deg); }
          75%       { transform: translateY(4px) rotate(2deg); }
        }
        @keyframes notFoundPulse {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.75; }
        }
        @keyframes glitchLine {
          0%   { opacity: 1; transform: scaleX(1)   translateX(0);   }
          20%  { opacity: 0; transform: scaleX(0.6) translateX(4px);  }
          40%  { opacity: 1; transform: scaleX(1)   translateX(-2px); }
          60%  { opacity: 0; transform: scaleX(0.8) translateX(2px);  }
          80%  { opacity: 1; transform: scaleX(1)   translateX(0);   }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
