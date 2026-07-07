"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import QRCode from "qrcode";
import { toast } from "sonner";
import {
  QrCode,
  Link as LinkIcon,
  Loader2,
  Download,
  Copy,
  Check,
  Share2,
  RotateCcw,
  Upload,
  X,
  ImageIcon,
  Maximize2,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  History,
} from "lucide-react";
import { copyToClipboard } from "@/lib/clipboard";
import { ToolLayout, ToolCard, PrimaryButton } from "@/components/tools/ToolLayout";
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import {
  StatsStrip,
  GuideGrid,
  Workflow,
  SeoContent,
  FaqAccordion,
  CrossCTA,
} from "@/components/tools/ToolSections";

// ─── Types ───
type ErrorLevel = "L" | "M" | "Q" | "H";
type QrOptions = {
  size: number;
  errorLevel: ErrorLevel;
  fg: string;
  bg: string;
  transparent: boolean;
  margin: number;
  logo: string | null; // data URL
  logoSize: number; // percent of QR size
};

type HistoryItem = {
  id: string;
  url: string;
  preview: string; // small data URL
  at: number;
};

const HISTORY_KEY = "ytforge_qr_history_v1";
const SIZES = [256, 512, 1024, 2048] as const;
const ERROR_LEVELS: { value: ErrorLevel; label: string; hint: string }[] = [
  { value: "L", label: "L", hint: "~7% recovery" },
  { value: "M", label: "M", hint: "~15% recovery" },
  { value: "Q", label: "Q", hint: "~25% recovery" },
  { value: "H", label: "H", hint: "~30% recovery — best with logo" },
];

const stats = [
  { value: "HD", label: "Up to 2048px" },
  { value: "Logo", label: "Center Overlay" },
  { value: "100%", label: "Free Forever" },
  { value: "4", label: "Export Formats" },
];

const guides = [
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Use high error correction with a logo", desc: "Pick level H so the QR still scans reliably even with your channel logo covering the center." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Keep strong contrast", desc: "Dark foreground on a light background scans best. Avoid light-on-light or busy gradients." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Print at 1024px+", desc: "For posters, thumbnails, and merch, export at 1024 or 2048px so it stays crisp when scaled." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't shrink too small", desc: "Below ~2cm printed, phones struggle to scan. Give your QR room to breathe." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't oversize the logo", desc: "A logo above ~30% of the QR blocks too many modules and breaks scannability." },
  { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100", title: "Always test before publishing", desc: "Scan your final QR with a real phone camera before printing or uploading it anywhere." },
];

const faqs = [
  { q: "What YouTube links can I turn into a QR code?", a: "Any of them — video URLs, Shorts, live streams, playlists, @handles, and channel URLs. Just paste the full link or a bare video ID." },
  { q: "Will the QR code expire?", a: "No. These are static QR codes that encode your link directly, so they work forever with no tracking, no account, and no expiry." },
  { q: "Can I add my channel logo?", a: "Yes — upload a PNG or SVG and it's placed in the center. Use error-correction level H so it still scans with the logo overlay." },
  { q: "What size should I download?", a: "256px for on-screen use, 512px for social posts, and 1024–2048px for print, posters, and merch." },
  { q: "Is it really free?", a: "100% free, unlimited QR codes, no signup, no watermark." },
];

// ─── URL parsing / validation ───
function normalizeYouTube(input: string): { ok: boolean; url: string } {
  const raw = input.trim();
  if (!raw) return { ok: false, url: "" };

  // Bare 11-char video ID → full watch URL
  if (/^[A-Za-z0-9_-]{11}$/.test(raw)) {
    return { ok: true, url: `https://www.youtube.com/watch?v=${raw}` };
  }

  try {
    const url = new URL(raw.match(/^https?:\/\//) ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^www\./, "").replace(/^m\./, "");
    if (
      host === "youtube.com" ||
      host === "youtu.be" ||
      host === "youtube-nocookie.com"
    ) {
      return { ok: true, url: url.toString() };
    }
  } catch {
    /* fall through */
  }
  return { ok: false, url: raw };
}

function readHistory(): HistoryItem[] {
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeHistory(items: HistoryItem[]) {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(items.slice(0, 8)));
  } catch {
    /* ignore */
  }
}

export default function QrCodeGeneratorPage() {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [pngDataUrl, setPngDataUrl] = useState<string | null>(null);
  const [zoom, setZoom] = useState(false);
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const [opts, setOpts] = useState<QrOptions>({
    size: 512,
    errorLevel: "M",
    fg: "#000000",
    bg: "#ffffff",
    transparent: false,
    margin: 2,
    logo: null,
    logoSize: 22,
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const logoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => setHistory(readHistory()), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setZoom(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const update = <K extends keyof QrOptions>(key: K, val: QrOptions[K]) =>
    setOpts((p) => ({ ...p, [key]: val }));

  // Render the QR to a canvas (with optional logo), return the PNG data URL
  const renderCanvas = useCallback(
    async (url: string): Promise<string> => {
      const canvas = canvasRef.current!;
      await QRCode.toCanvas(canvas, url, {
        errorCorrectionLevel: opts.errorLevel,
        width: opts.size,
        margin: opts.margin,
        color: {
          dark: opts.fg,
          light: opts.transparent ? "#00000000" : opts.bg,
        },
      });

      // Overlay logo in the center
      if (opts.logo) {
        const ctx = canvas.getContext("2d")!;
        const logoImg = new Image();
        await new Promise<void>((resolve, reject) => {
          logoImg.onload = () => resolve();
          logoImg.onerror = () => reject(new Error("logo failed"));
          logoImg.src = opts.logo!;
        });
        const logoPx = (opts.size * opts.logoSize) / 100;
        const pad = logoPx * 0.14;
        const x = (opts.size - logoPx) / 2;
        const y = (opts.size - logoPx) / 2;
        // white rounded backing so the logo reads cleanly
        if (!opts.transparent) {
          ctx.fillStyle = opts.bg;
          ctx.fillRect(x - pad, y - pad, logoPx + pad * 2, logoPx + pad * 2);
        }
        ctx.drawImage(logoImg, x, y, logoPx, logoPx);
      }
      return canvas.toDataURL("image/png");
    },
    [opts]
  );

  const generate = async (val?: string) => {
    const raw = (val ?? input).trim();
    if (!raw) return;
    if (val !== undefined) setInput(val);

    const { ok, url } = normalizeYouTube(raw);
    if (!ok) {
      setError("Enter a valid YouTube link (video, Short, live, playlist, @handle, or channel) or an 11-character video ID.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const dataUrl = await renderCanvas(url);
      setPngDataUrl(dataUrl);
      setGeneratedUrl(url);

      // Save to history
      const item: HistoryItem = { id: `${Date.now()}`, url, preview: dataUrl, at: Date.now() };
      const next = [item, ...readHistory().filter((h) => h.url !== url)];
      writeHistory(next);
      setHistory(next.slice(0, 8));
    } catch {
      setError("Couldn't generate the QR code. Try a smaller logo or a different image.");
    } finally {
      setLoading(false);
    }
  };

  // Re-render live when options change (only if we already have a URL)
  useEffect(() => {
    if (!generatedUrl) return;
    let cancelled = false;
    (async () => {
      try {
        const dataUrl = await renderCanvas(generatedUrl);
        if (!cancelled) setPngDataUrl(dataUrl);
      } catch {/* ignore live errors */}
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts]);

  const onLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/(png|svg\+xml|jpeg|jpg|webp)/.test(file.type)) {
      toast.error("Use a PNG, SVG, JPG, or WEBP image");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update("logo", reader.result as string);
    reader.readAsDataURL(file);
  };

  const download = async (format: "png" | "jpeg" | "svg") => {
    if (!generatedUrl) return;
    const base = `ytforge-qr-${Date.now()}`;
    try {
      if (format === "svg") {
        const svg = await QRCode.toString(generatedUrl, {
          type: "svg",
          errorCorrectionLevel: opts.errorLevel,
          margin: opts.margin,
          color: { dark: opts.fg, light: opts.transparent ? "#00000000" : opts.bg },
        });
        triggerBlob(new Blob([svg], { type: "image/svg+xml" }), `${base}.svg`);
        toast.success("Downloaded SVG");
        return;
      }
      // png / jpeg from canvas
      const mime = format === "jpeg" ? "image/jpeg" : "image/png";
      const canvas = canvasRef.current!;
      // JPEG needs an opaque bg
      let src = canvas;
      if (format === "jpeg" && opts.transparent) {
        const tmp = document.createElement("canvas");
        tmp.width = canvas.width;
        tmp.height = canvas.height;
        const tctx = tmp.getContext("2d")!;
        tctx.fillStyle = "#ffffff";
        tctx.fillRect(0, 0, tmp.width, tmp.height);
        tctx.drawImage(canvas, 0, 0);
        src = tmp;
      }
      src.toBlob((blob) => {
        if (blob) triggerBlob(blob, `${base}.${format === "jpeg" ? "jpg" : "png"}`);
        toast.success(`Downloaded ${format.toUpperCase()}`);
      }, mime, 0.95);
    } catch {
      toast.error("Download failed — try again");
    }
  };

  const triggerBlob = (blob: Blob, name: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  };

  const copyImage = async () => {
    if (!canvasRef.current) return;
    try {
      const blob: Blob = await new Promise((resolve, reject) =>
        canvasRef.current!.toBlob((b) => (b ? resolve(b) : reject()), "image/png")
      );
      // Try modern image clipboard first, fall back gracefully
      try {
        // @ts-ignore
        await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      } catch {
        // Fallback: copy the data URL as text so something gets on the clipboard
        const dataUrl = URL.createObjectURL(blob);
        await copyToClipboard(dataUrl);
        setTimeout(() => URL.revokeObjectURL(dataUrl), 2000);
        toast.message("Image copied (as URL) — use Download for the file");
        return;
      }
      toast.success("QR image copied to clipboard");
    } catch {
      toast.error("Your browser blocked image copy — use Download instead");
    }
  };

  const copyUrl = async () => {
    if (!generatedUrl) return;
    const ok = await copyToClipboard(generatedUrl);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
      toast.success("YouTube URL copied");
    } else {
      toast.error("Couldn't copy");
    }
  };

  const share = async () => {
    if (!generatedUrl) return;
    if (navigator.share) {
      try { await navigator.share({ title: "YouTube QR Code", url: generatedUrl }); } catch {/* canceled */}
    } else {
      copyUrl();
    }
  };

  const reset = () => {
    setInput("");
    setGeneratedUrl(null);
    setPngDataUrl(null);
    setError(null);
    setOpts((p) => ({ ...p, logo: null }));
    inputRef.current?.focus();
  };

  const clearHistory = () => {
    writeHistory([]);
    setHistory([]);
    toast.message("History cleared");
  };

  const scanQuality = useMemo(() => {
    // rough heuristic based on contrast + error level + logo size
    const strong = opts.errorLevel === "H" || opts.errorLevel === "Q";
    const logoRisk = opts.logo && opts.logoSize > 28;
    if (logoRisk && !strong) return { label: "At risk", color: "text-red-600 bg-red-100 border-red-300" };
    if (strong) return { label: "Excellent", color: "text-green-700 bg-green-100 border-green-400" };
    return { label: "Good", color: "text-emerald-700 bg-emerald-100 border-emerald-400" };
  }, [opts]);

  return (
    <ToolLayout
      title="YouTube QR Code Generator"
      description="Generate beautiful, customizable QR codes for any YouTube video, Short, live stream, playlist, or channel. Add your logo, pick your colors, and download in HD. 100% free."
      icon={QrCode}
      badge="Free Tool · Logo + HD Export"
    >
      <StatsStrip stats={stats} />

      {/* Input */}
      <ToolCard className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white focus-within:shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] transition-shadow">
            <LinkIcon className="w-4 h-4 text-red-600 shrink-0" aria-hidden />
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="YouTube video, Short, playlist, @handle, or channel URL…"
              aria-label="YouTube URL"
              className="flex-1 py-3 outline-none text-sm font-medium bg-transparent"
            />
            {input && (
              <button onClick={reset} aria-label="Clear input" className="p-1 rounded-md hover:bg-neutral-100 transition shrink-0">
                <X className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            )}
          </div>
          <PrimaryButton onClick={() => generate()} disabled={loading || !input.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <QrCode className="w-4 h-4" />}
            {loading ? "Generating..." : "Generate QR Code"}
          </PrimaryButton>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-start gap-2 p-3 bg-red-50 border-2 border-red-300 rounded-xl"
              role="alert"
            >
              <XCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs font-bold text-red-700">{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-3 text-[11px] text-neutral-400 font-medium">
          Supports: <code className="font-mono">watch?v=</code> · <code className="font-mono">youtu.be</code> · <code className="font-mono">/shorts/</code> · <code className="font-mono">/live/</code> · <code className="font-mono">/playlist</code> · <code className="font-mono">@handle</code> · <code className="font-mono">/channel/</code>
        </div>
      </ToolCard>

      {/* MAIN: preview + controls */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-5 mb-12 sm:mb-16">
        {/* Preview */}
        <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-base flex items-center gap-2">
              <QrCode className="w-5 h-5 text-red-600" /> Live Preview
            </h2>
            {generatedUrl && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border-2 ${scanQuality.color}`}>
                {scanQuality.label} scan
              </span>
            )}
          </div>

          <div
            className="flex-1 flex items-center justify-center rounded-xl border-2 border-dashed border-neutral-300 p-6 sm:p-10 min-h-[280px]"
            style={{
              backgroundImage:
                "linear-gradient(45deg,#f1f1f1 25%,transparent 25%),linear-gradient(-45deg,#f1f1f1 25%,transparent 25%),linear-gradient(45deg,transparent 75%,#f1f1f1 75%),linear-gradient(-45deg,transparent 75%,#f1f1f1 75%)",
              backgroundSize: "16px 16px",
              backgroundPosition: "0 0,0 8px,8px -8px,-8px 0",
            }}
          >
            {/* Canvas is always mounted (offscreen when empty) so refs work */}
            <canvas
              ref={canvasRef}
              className={pngDataUrl ? "hidden" : "hidden"}
              aria-hidden
            />
            {pngDataUrl ? (
              <div className="relative group">
                <img
                  src={pngDataUrl}
                  alt="Generated YouTube QR code"
                  className="w-full max-w-[280px] rounded-lg shadow-lg border border-neutral-200"
                />
                <button
                  onClick={() => setZoom(true)}
                  aria-label="Zoom QR code"
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/70 text-white opacity-0 group-hover:opacity-100 hover:bg-red-600 transition"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center text-neutral-400">
                <QrCode className="w-12 h-12 mx-auto mb-2" />
                <div className="text-sm font-bold">Your QR code will appear here</div>
                <div className="text-xs">Paste a YouTube link and hit Generate</div>
              </div>
            )}
          </div>

          {generatedUrl && (
            <>
              <div className="flex items-center justify-between mt-4 text-[11px] font-bold text-neutral-500">
                <span>{opts.size} × {opts.size}px</span>
                <span className="truncate max-w-[60%]">{generatedUrl}</span>
              </div>

              {/* Export actions */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
                <button onClick={() => download("png")} className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-red-600 text-white text-xs font-black rounded-lg border-2 border-black hover:bg-red-700 transition">
                  <Download className="w-3.5 h-3.5" /> PNG
                </button>
                <button onClick={() => download("svg")} className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-black text-white text-xs font-black rounded-lg border-2 border-black hover:bg-red-600 transition">
                  <Download className="w-3.5 h-3.5" /> SVG
                </button>
                <button onClick={() => download("jpeg")} className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white text-xs font-black rounded-lg border-2 border-black hover:bg-neutral-50 transition">
                  <Download className="w-3.5 h-3.5" /> JPEG
                </button>
                <button onClick={copyImage} className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white text-xs font-black rounded-lg border-2 border-black hover:bg-neutral-50 transition">
                  <ImageIcon className="w-3.5 h-3.5" /> Copy Image
                </button>
                <button onClick={copyUrl} className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white text-xs font-black rounded-lg border-2 border-black hover:bg-neutral-50 transition">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />} Copy URL
                </button>
                <button onClick={share} className="inline-flex items-center justify-center gap-1.5 px-3 py-2.5 bg-white text-xs font-black rounded-lg border-2 border-black hover:bg-neutral-50 transition">
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>
              <button onClick={reset} className="mt-2 inline-flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-black text-neutral-500 hover:text-black transition">
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            </>
          )}
        </div>

        {/* Controls */}
        <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5 sm:p-6 space-y-5">
          <h2 className="font-black text-base flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-600" /> Customize
          </h2>

          {/* Size */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600 mb-1.5">Size</label>
            <div className="grid grid-cols-4 gap-1.5">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => update("size", s)}
                  className={`px-2 py-2 text-xs font-black rounded-lg border-2 border-black transition ${opts.size === s ? "bg-red-600 text-white" : "bg-white hover:bg-red-50"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Error correction */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600 mb-1.5">Error Correction</label>
            <div className="grid grid-cols-4 gap-1.5">
              {ERROR_LEVELS.map((l) => (
                <button
                  key={l.value}
                  onClick={() => update("errorLevel", l.value)}
                  title={l.hint}
                  className={`px-2 py-2 text-xs font-black rounded-lg border-2 border-black transition ${opts.errorLevel === l.value ? "bg-red-600 text-white" : "bg-white hover:bg-red-50"}`}
                >
                  {l.label}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-neutral-400 font-bold mt-1.5">{ERROR_LEVELS.find((l) => l.value === opts.errorLevel)?.hint}</p>
          </div>

          {/* Colors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600 mb-1.5">Foreground</label>
              <div className="flex items-center gap-2 border-2 border-black rounded-lg px-2 py-1.5">
                <input type="color" value={opts.fg} onChange={(e) => update("fg", e.target.value)} aria-label="Foreground color" className="w-7 h-7 rounded cursor-pointer border border-neutral-300" />
                <span className="text-xs font-mono font-bold uppercase">{opts.fg}</span>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600 mb-1.5">Background</label>
              <div className={`flex items-center gap-2 border-2 border-black rounded-lg px-2 py-1.5 ${opts.transparent ? "opacity-40 pointer-events-none" : ""}`}>
                <input type="color" value={opts.bg} onChange={(e) => update("bg", e.target.value)} aria-label="Background color" className="w-7 h-7 rounded cursor-pointer border border-neutral-300" />
                <span className="text-xs font-mono font-bold uppercase">{opts.bg}</span>
              </div>
            </div>
          </div>

          {/* Transparent */}
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={opts.transparent} onChange={(e) => update("transparent", e.target.checked)} className="w-4 h-4 accent-red-600" />
            <span className="text-xs font-bold">Transparent background (PNG/SVG)</span>
          </label>

          {/* Margin */}
          <div>
            <label className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-neutral-600 mb-1.5">
              <span>Margin</span><span className="text-neutral-400">{opts.margin}</span>
            </label>
            <input type="range" min={0} max={8} value={opts.margin} onChange={(e) => update("margin", Number(e.target.value))} className="w-full accent-red-600" aria-label="Margin" />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-neutral-600 mb-1.5">Center Logo</label>
            <input ref={logoInputRef} type="file" accept="image/png,image/svg+xml,image/jpeg,image/webp" onChange={onLogoUpload} className="hidden" />
            {opts.logo ? (
              <div className="flex items-center gap-2">
                <img src={opts.logo} alt="Logo preview" className="w-9 h-9 rounded-lg border-2 border-black object-contain bg-white" />
                <button onClick={() => update("logo", null)} className="inline-flex items-center gap-1 px-3 py-2 text-xs font-black rounded-lg border-2 border-black bg-white hover:bg-red-50 transition">
                  <X className="w-3.5 h-3.5" /> Remove
                </button>
              </div>
            ) : (
              <button onClick={() => logoInputRef.current?.click()} className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-black rounded-lg border-2 border-dashed border-black bg-white hover:bg-red-50 transition">
                <Upload className="w-3.5 h-3.5" /> Upload PNG / SVG
              </button>
            )}
            {opts.logo && (
              <div className="mt-3">
                <label className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider text-neutral-600 mb-1.5">
                  <span>Logo Size</span><span className="text-neutral-400">{opts.logoSize}%</span>
                </label>
                <input type="range" min={10} max={35} value={opts.logoSize} onChange={(e) => update("logoSize", Number(e.target.value))} className="w-full accent-red-600" aria-label="Logo size" />
                {opts.logoSize > 28 && opts.errorLevel !== "H" && (
                  <p className="text-[10px] text-red-600 font-bold mt-1">Tip: switch Error Correction to H for large logos.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HISTORY */}
      {history.length > 0 && (
        <section className="mb-12 sm:mb-16">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-black text-base flex items-center gap-2">
              <History className="w-5 h-5 text-red-600" /> Recent QR Codes
            </h2>
            <button onClick={clearHistory} className="inline-flex items-center gap-1 text-xs font-black text-neutral-500 hover:text-red-600 transition">
              <Trash2 className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {history.map((h) => (
              <button
                key={h.id}
                onClick={() => generate(h.url)}
                title={h.url}
                className="group bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] p-2 hover:shadow-[5px_5px_0px_0px_rgba(220,38,38,1)] hover:-translate-y-0.5 transition-all"
              >
                <img src={h.preview} alt="Recent QR" className="w-full aspect-square object-contain rounded" />
              </button>
            ))}
          </div>
        </section>
      )}

      <GuideGrid
        badge="QR Best Practices"
        title="How to make a QR code that always scans"
        intro="Six rules for reliable, professional YouTube QR codes — on screen and in print."
        cards={guides}
      />

      <Workflow
        title="Your 4-step QR workflow"
        steps={[
          { n: "01", t: "Paste your link", d: "Any YouTube video, Short, live, playlist, @handle, or channel URL." },
          { n: "02", t: "Customize", d: "Pick size, colors, margin, and add your channel logo in the center." },
          { n: "03", t: "Check scan quality", d: "Watch the live scan-quality badge — use level H when adding a logo." },
          { n: "04", t: "Download & share", d: "Export PNG, SVG, or JPEG in up to 2048px, or copy the image directly." },
        ]}
      />

      <SeoContent badge="YouTube QR Code Guide" title="Why every creator needs a YouTube QR code">
        <p>A QR code is the fastest bridge between the offline world and your channel. Print it on merch, business cards, event banners, packaging, or drop it in a video's end screen — anyone with a phone camera lands on your video, Short, or channel in one tap. No typing, no searching, no lost viewers.</p>
        <h3>Static vs dynamic QR codes</h3>
        <p>This tool creates <strong>static</strong> QR codes: your YouTube link is encoded directly into the pattern, so it works forever with no account, no subscription, and no third-party tracking that can disappear. The trade-off is that the destination is fixed — generate a new code if your link changes.</p>
        <h3>Adding your logo without breaking the scan</h3>
        <p>QR codes have built-in error correction — they can still be read even when part of the pattern is covered. That's what lets you drop a logo in the center. Use <strong>error-correction level H</strong> (≈30% recovery) whenever you add a logo, and keep the logo under about 30% of the QR's width so enough modules remain scannable.</p>
        <h3>Picking the right size</h3>
        <p>Export <strong>256px</strong> for on-screen use, <strong>512px</strong> for social posts, and <strong>1024–2048px</strong> for anything printed. The larger the print, the larger the source file you want so it stays razor-sharp.</p>
        <h3>Pair it with your other assets</h3>
        <p>Design a click-magnet thumbnail with our <a href="/tools/ai-thumbnail-generator">AI Thumbnail Generator</a>, then embed the video anywhere with the <a href="/tools/embed-generator">Embed Generator</a>.</p>
      </SeoContent>

      <FaqAccordion faqs={faqs} />

      <CrossCTA
        title="Now make the rest of your launch kit"
        desc="Embed the video on your site, or design a thumbnail that gets the click."
        primary={{ label: "Embed Generator", href: "/tools/embed-generator", icon: QrCode }}
        secondary={{ label: "AI Thumbnail Generator", href: "/tools/ai-thumbnail-generator", icon: Sparkles }}
      />

      {/* ZOOM MODAL */}
      <AnimatePresence>
        {zoom && pngDataUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoom(false)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-label="Fullscreen QR code"
          >
            <button
              onClick={() => setZoom(false)}
              aria-label="Close"
              className="absolute top-4 right-4 p-2 rounded-lg bg-white text-black border-2 border-black hover:bg-red-600 hover:text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={pngDataUrl}
              alt="QR code"
              onClick={(e) => e.stopPropagation()}
              className="max-w-full max-h-full rounded-xl border-4 border-white bg-white object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
          <ToolSeoJsonLd
        name="YouTube QR Code Generator"
        description={"Generate branded QR codes for your YouTube videos, channels, and Shorts — with logos, colors, and HD export."}
        slug="qr-code-generator"
        faqs={faqs}
        breadcrumb={[
          { name: "Home", slug: "/" },
          { name: "Tools", slug: "/tools" },
          { name: "YouTube QR Code Generator", slug: "/tools/qr-code-generator" },
        ]}
      />
</ToolLayout>
  );
}
