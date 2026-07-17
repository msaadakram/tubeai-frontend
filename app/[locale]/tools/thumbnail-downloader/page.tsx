"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Download,
  Loader2,
  Link as LinkIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Image as ImageIcon,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { ToolLayout, ToolCard, PrimaryButton } from "@/components/tools/ToolLayout";
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import { StatsStrip, GuideGrid, Workflow, SeoContent, FaqAccordion, CrossCTA } from "@/components/tools/ToolSections";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://api.ytforge.app";

type Thumbnail = {
  quality: string;
  label: string;
  width: number;
  height: number;
  url: string;
  proxyUrl?: string;
};

type ThumbResponse = {
  success: boolean;
  data: {
    videoId: string;
    videoUrl: string;
    thumbnails: Thumbnail[];
  };
};

const qualityOrder = ["maxresdefault", "sddefault", "hqdefault", "mqdefault", "default"];

const stats = [
  { value: "6.7M+", label: "Thumbnails Saved" },
  { value: "100%", label: "Free Forever" },
  { value: "5", label: "Resolutions" },
  { value: "<1s", label: "Fetch Time" },
];

const guides = [
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Use for inspiration", desc: "Study the top-performing thumbnails in your niche to reverse-engineer winning visual patterns." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Pick max resolution", desc: "Always download 1280×720 for crisp print, presentation, or design reference quality." },
  { icon: CheckCircle2, color: "text-green-600 bg-green-100", title: "Build a swipe file", desc: "Save 50+ top thumbnails in your niche to create a reference library for your own designs." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't republish as-is", desc: "Other creators' thumbnails are copyrighted. Use them for study and inspiration only." },
  { icon: XCircle, color: "text-red-600 bg-red-100", title: "Don't use copyrighted faces", desc: "Faces of public figures or other creators in your own thumbnails can trigger DMCA strikes." },
  { icon: AlertTriangle, color: "text-yellow-600 bg-yellow-100", title: "Resolution may vary", desc: "Older or low-quality videos may not have a max-resolution thumbnail. Fall back to HQ." },
];

const faqs = [
  { q: "Is this tool free?", a: "100% free, forever, with unlimited downloads. No signup, no watermark, no daily cap." },
  { q: "What's the highest resolution?", a: "1280×720 (HD) is YouTube's max thumbnail size. We pull directly from YouTube's CDN, so this is the highest quality available." },
  { q: "Can I download Shorts thumbnails?", a: "Yes — paste any Shorts URL and we'll extract the same resolutions, including the vertical 9:16 frame." },
  { q: "Is this legal?", a: "Downloading public YouTube thumbnails for personal use, study, or inspiration is allowed. Republishing them as your own thumbnail is not — that's copyright infringement." },
];

export default function ThumbnailDownloaderPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ThumbResponse["data"] | null>(null);
  const [downloadingKey, setDownloadingKey] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const markImgError = (quality: string) =>
    setImgErrors((prev) => (prev[quality] ? prev : { ...prev, [quality]: true }));

  const sortedThumbs = (thumbs: Thumbnail[]) =>
    [...thumbs].sort(
      (a, b) => qualityOrder.indexOf(a.quality) - qualityOrder.indexOf(b.quality)
    );

  const handleDownload = async (t: Thumbnail) => {
    if (!result || downloadingKey) return;
    setDownloadingKey(t.quality);
    const fallback = () => window.open(t.url, "_blank");
    try {
      const proxyUrl = `${BASE_URL}/api/thumbnail-proxy/${result.videoId}/${t.quality}`;
      const res = await fetch(proxyUrl);
      if (!res.ok) throw new Error(`Download failed (${res.status})`);
      const blob = await res.blob();
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = `thumbnail-${result.videoId}-${t.quality}.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objectUrl);
    } catch {
      fallback();
    } finally {
      setDownloadingKey(null);
    }
  };

  const handleFetch = async () => {
    if (!url.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setImgErrors({});
    try {
      const res = await fetch(`${BASE_URL}/api/thumbnail`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || !body?.success) {
        throw new Error(body?.error || `Failed to fetch (${res.status})`);
      }
      setResult(body.data as ThumbResponse["data"]);
    } catch (err: any) {
      setError(err?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout
      title="Thumbnail Downloader"
      description="Paste any YouTube link to instantly grab the original thumbnail in every available resolution — 100% free."
      icon={Download}
      badge="Free Tool · Unlimited Downloads"
    >
      <StatsStrip stats={stats} />

      <ToolCard className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white">
            <LinkIcon className="w-4 h-4 text-red-600 shrink-0" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              placeholder="https://youtube.com/watch?v=..."
              className="flex-1 py-3 outline-none text-sm font-medium"
            />
          </div>
          <PrimaryButton onClick={handleFetch} disabled={loading || !url.trim()}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {loading ? "Fetching..." : "Get Thumbnails"}
          </PrimaryButton>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-4 flex items-start gap-2 p-3 bg-red-50 border-2 border-red-300 rounded-xl"
            >
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <div className="text-xs font-bold text-red-700">{error}</div>
            </motion.div>
          )}
        </AnimatePresence>
      </ToolCard>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16"
          >
            <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-7 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center justify-between gap-3 mb-6 pb-5 border-b-2 border-black">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-xl bg-red-600 border-2 border-black flex items-center justify-center overflow-hidden">
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      initial={{ x: "-120%" }}
                      animate={{ x: "120%" }}
                      transition={{ repeat: Infinity, duration: 1.4, ease: "easeInOut" }}
                    />
                    <Download className="w-5 h-5 text-white relative z-10" />
                  </div>
                  <div>
                    <div className="font-black text-base flex items-center">
                      Fetching thumbnails
                      <span className="inline-flex ml-0.5">
                        {[0, 1, 2].map((i) => (
                          <motion.span
                            key={i}
                            animate={{ opacity: [0, 1, 0] }}
                            transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2, ease: "easeInOut" }}
                          >
                            .
                          </motion.span>
                        ))}
                      </span>
                    </div>
                    <div className="text-xs text-neutral-500 font-bold mt-0.5">Pulling every resolution from YouTube's CDN</div>
                  </div>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  {["maxres", "sd", "hq", "mq", "default"].map((q, i) => (
                    <motion.div
                      key={q}
                      initial={{ opacity: 0.3, scale: 0.9 }}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1, 0.9] }}
                      transition={{ repeat: Infinity, duration: 1.5, delay: i * 0.15, ease: "easeInOut" }}
                      className="px-2 py-1 text-[10px] font-black uppercase rounded-md border-2 border-black bg-neutral-100"
                    >
                      {q}
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[0, 1, 2, 3, 4, 5].map((i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="aspect-video bg-neutral-100 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-neutral-100 via-neutral-200 to-neutral-100"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ repeat: Infinity, duration: 1.3, delay: i * 0.1, ease: "easeInOut" }}
                      />
                      {i === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600/70 text-white text-[10px] font-black rounded-md border-2 border-black tracking-wide">
                          BEST
                        </div>
                      )}
                      <div className="absolute top-2 right-2 w-12 h-4 bg-neutral-300/80 rounded-md" />
                    </div>
                    <div className="p-4 flex items-center justify-between gap-3 border-t-2 border-black">
                      <div className="space-y-2">
                        <div className="h-3 w-20 bg-neutral-200 rounded" />
                        <div className="h-2 w-14 bg-neutral-100 rounded" />
                      </div>
                      <div className="h-7 w-20 bg-red-600/70 rounded-lg border-2 border-black" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 flex items-center gap-3">
                <div className="flex-1 h-2.5 bg-neutral-200 rounded-full overflow-hidden border-2 border-black">
                  <motion.div
                    className="h-full bg-red-600 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 6, ease: "easeInOut" }}
                  />
                </div>
                <span className="text-[10px] font-black uppercase text-neutral-500 tracking-wider shrink-0">Loading</span>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && result && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-12 sm:mb-16"
          >
            <div className="flex flex-wrap items-center justify-between gap-3 mb-5 p-4 bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-xs font-bold text-neutral-600">
                Video ID: <span className="text-black font-black">{result.videoId}</span>
              </div>
              <a
                href={result.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-black text-red-600 hover:underline"
              >
                Open video <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {sortedThumbs(result.thumbnails).map((t, i) => (
                <motion.div
                  key={t.quality}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="group bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col h-full hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition"
                >
                  <a
                    href={t.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-video bg-neutral-100 relative overflow-hidden"
                  >
                    <img
                      src={t.url}
                      alt={t.label}
                      loading="lazy"
                      onError={() => markImgError(t.quality)}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition" />
                    {t.quality === "maxresdefault" && (
                      <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 text-white text-[10px] font-black rounded-md border-2 border-black tracking-wide">
                        BEST
                      </div>
                    )}
                    <div className="absolute top-2 right-2 px-2 py-0.5 bg-black/80 text-white text-[10px] font-black rounded-md backdrop-blur-sm">
                      {t.width}×{t.height}
                    </div>
                    {imgErrors[t.quality] && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-neutral-50">
                        <div className="w-10 h-10 rounded-full bg-red-100 border-2 border-red-300 flex items-center justify-center">
                          <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="text-[11px] font-black text-red-700 text-center px-3">
                          Image unavailable
                        </div>
                        <div className="text-[9px] font-bold text-neutral-500 text-center px-3 uppercase tracking-wide">
                          This resolution isn't offered for this video
                        </div>
                      </div>
                    )}
                  </a>
                  <div className="p-4 flex items-center justify-between gap-3 border-t-2 border-black bg-white mt-auto">
                    <div className="min-w-0">
                      <div className="font-black text-sm truncate">{t.label.split(" (")[0]}</div>
                      <div className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold truncate">
                        {t.quality}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleDownload(t)}
                      disabled={downloadingKey === t.quality || !!imgErrors[t.quality]}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-xs font-black rounded-lg border-2 border-black hover:bg-red-700 shrink-0 disabled:opacity-70 disabled:cursor-wait"
                    >
                      {downloadingKey === t.quality ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : imgErrors[t.quality] ? (
                        <XCircle className="w-3.5 h-3.5" />
                      ) : (
                        <Download className="w-3.5 h-3.5" />
                      )}
                      {downloadingKey === t.quality ? "Saving..." : imgErrors[t.quality] ? "Unavailable" : "Download"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {!loading && !result && (
          <div key="empty" className="mb-12 sm:mb-16" />
        )}
      </AnimatePresence>

      <GuideGrid
        badge="Download Rules"
        title="How to use thumbnails ethically and legally"
        intro="Six rules for building a reference library without crossing copyright lines."
        cards={guides}
      />

      <Workflow
        title="Your 4-step research workflow"
        steps={[
          { n: "01", t: "Find a viral video", d: "Search your niche on YouTube. Filter by views or upload date for fresh viral hits." },
          { n: "02", t: "Paste the URL", d: "Copy the link from your browser, paste it here, click Get Thumbnails." },
          { n: "03", t: "Pick a resolution", d: "Choose Max for full study, or smaller sizes for mobile preview testing." },
          { n: "04", t: "Build a swipe file", d: "Organize 50+ winning thumbnails in your niche for reference when designing your own." },
        ]}
      />

      <SeoContent badge="Complete Download Guide" title="How to use the YouTube thumbnail downloader for creator research">
        <p>YouTube's thumbnail downloader is one of the most underrated research tools available to creators. By systematically downloading and studying the highest-CTR thumbnails in your niche, you can reverse-engineer the visual patterns that drive clicks — and apply them to your own channel without guessing.</p>
        <h3>Why creators download thumbnails</h3>
        <p>Top creators don't design thumbnails in a vacuum. They build "swipe files" — collections of 50-100 high-performing thumbnails in their niche — and study them weekly for patterns. <strong>Color palettes</strong>, <strong>face placement</strong>, <strong>text size</strong>, and <strong>composition</strong> all reveal trends that AI models and your competitors are already exploiting.</p>
        <h3>The five resolutions explained</h3>
        <p><strong>maxresdefault (1280×720):</strong> YouTube's HD master file. Use this for full-quality study, design reference, or print mockups. <strong>sddefault (640×480):</strong> Standard definition with 4:3 letterbox padding. <strong>hqdefault (480×360):</strong> The default fallback for most videos. <strong>mqdefault (320×180):</strong> Mobile-feed preview size — useful for testing how your design holds up at small sizes. <strong>default (120×90):</strong> Tiny preview frame.</p>
        <h3>Legal and ethical use</h3>
        <p>Public YouTube thumbnails are legally accessible because they're served from YouTube's public CDN. Downloading them for <strong>personal study, education, or inspiration</strong> falls under fair use. <strong>Republishing them as your own</strong> — using a competitor's exact thumbnail or another creator's face — is copyright infringement and can trigger DMCA strikes on your channel.</p>
        <h3>Building a competitive thumbnail swipe file</h3>
        <p>Pick the top 10 channels in your niche. Download the thumbnails of their 5 highest-viewed videos each. That gives you 50 reference thumbnails — a statistically meaningful sample. Look for repeated patterns: dominant colors, expression types, text positioning, and visual hierarchy. These are the patterns proven to convert in your specific niche.</p>
        <h3>From research to creation</h3>
        <p>Once you've reverse-engineered the patterns, pair high-CTR titles from our <a href="/tools/viral-title-generator">Viral Title Generator</a> with retention-optimized scripts from our <a href="/tools/ai-script-writer">AI Script Writer</a>.</p>
      </SeoContent>

      <FaqAccordion faqs={faqs} />

      <CrossCTA
        title="From thumbnail research to your next viral video"
        desc="Studied the winners? Now write a title and script that match the click."
        primary={{ label: "Generate Title", href: "/tools/viral-title-generator", icon: Sparkles }}
        secondary={{ label: "Write Script", href: "/tools/ai-script-writer", icon: ImageIcon }}
      />
          <ToolSeoJsonLd
        name="YouTube Thumbnail Downloader"
        description={"Download any YouTube video thumbnail in HD, full, or standard resolution — free, no signup, unlimited."}
        slug="thumbnail-downloader"
        faqs={faqs}
        breadcrumb={[
          { name: "Home", slug: "/" },
          { name: "Tools", slug: "/tools" },
          { name: "YouTube Thumbnail Downloader", slug: "/tools/thumbnail-downloader" },
        ]}
      />
</ToolLayout>
  );
}
