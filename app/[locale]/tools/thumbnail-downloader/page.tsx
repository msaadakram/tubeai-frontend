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
import { ToolTurnstile } from "@/components/tools/ToolTurnstile";
import { useTurnstileHeader } from "@/lib/turnstile/useTurnstileHeader";
import { ToolSeoJsonLd } from "@/components/tools/ToolSeoJsonLd";
import { StatsStrip, GuideGrid, Workflow, SeoContent, FaqAccordion, CrossCTA } from "@/components/tools/ToolSections";
import { useTranslations } from "@/lib/i18n/useTranslations";

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

export default function ThumbnailDownloaderPage() {
  const { t } = useTranslations();
  const tc = t("toolPages.thumbnailDownloader") as any;
  const ts = useTurnstileHeader();

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
      const res = await fetch(proxyUrl, { headers: ts.headers });
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
        headers: { "Content-Type": "application/json", ...ts.headers },
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

  const guideIcons = [CheckCircle2, CheckCircle2, CheckCircle2, XCircle, XCircle, AlertTriangle];
  const guideColors = ["text-green-600 bg-green-100", "text-green-600 bg-green-100", "text-green-600 bg-green-100", "text-red-600 bg-red-100", "text-red-600 bg-red-100", "text-yellow-600 bg-yellow-100"];

  return (
    <ToolLayout
      title={tc.title}
      description={tc.description}
      icon={Download}
      badge={tc.badge}
    >
      <StatsStrip stats={tc.stats} />

      <ToolCard className="mb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 border-2 border-black rounded-xl bg-white">
            <LinkIcon className="w-4 h-4 text-red-600 shrink-0" />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleFetch()}
              placeholder={tc.inputPlaceholder}
              className="flex-1 py-3 outline-none text-sm font-medium"
            />
          </div>
          <ToolTurnstile actionLabel={tc.fetchBtn as string} />
          <PrimaryButton onClick={handleFetch} disabled={loading || !url.trim() || !ts.ready}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
            {loading ? tc.fetchingBtn : tc.fetchBtn}
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
                      {tc.fetchingTitle}
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
                    <div className="text-xs text-neutral-500 font-bold mt-0.5">{tc.fetchingSub}</div>
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
                {tc.openVideo} <ExternalLink className="w-3 h-3" />
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
                          {tc.imgUnavail}
                        </div>
                        <div className="text-[9px] font-bold text-neutral-500 text-center px-3 uppercase tracking-wide">
                          {tc.imgUnavailSub}
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
                      {downloadingKey === t.quality ? tc.savingBtn : imgErrors[t.quality] ? tc.unavailableBtn : tc.downloadBtn}
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
        badge={tc.guideBadge}
        title={tc.guideTitle}
        intro={tc.guideIntro}
        cards={tc.guides.map((g: any, i: number) => ({ ...g, icon: guideIcons[i] || CheckCircle2, color: guideColors[i] || "text-green-600 bg-green-100" }))}
      />

      <Workflow
        title={tc.workflowTitle}
        steps={tc.workflows}
      />

      <SeoContent badge={tc.seoContent.badge} title={tc.seoContent.title}>
        <p>{tc.seoContent.p1}</p>
        <h3>{tc.seoContent.h3_1}</h3>
        <div dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_1 }} />
        <h3>{tc.seoContent.h3_2}</h3>
        <div dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_2 }} />
        <h3>{tc.seoContent.h3_3}</h3>
        <div dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_3 }} />
        <h3>{tc.seoContent.h3_4}</h3>
        <div dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_4 }} />
        <h3>{tc.seoContent.h3_5}</h3>
        <div dangerouslySetInnerHTML={{ __html: tc.seoContent.p2_5 }} />
      </SeoContent>

      <FaqAccordion faqs={tc.faqs} />

      <CrossCTA
        title={tc.crossCta.title}
        desc={tc.crossCta.desc}
        primary={{ label: tc.crossCta.btn1, href: "/tools/viral-title-generator", icon: Sparkles }}
        secondary={{ label: tc.crossCta.btn2, href: "/tools/ai-script-writer", icon: ImageIcon }}
      />
      <ToolSeoJsonLd
        name={tc.title}
        description={tc.seoJsonDesc}
        slug="thumbnail-downloader"
        faqs={tc.faqs}
        breadcrumb={[
          { name: "Home", slug: "/" },
          { name: "Tools", slug: "/tools" },
          { name: tc.title, slug: "/tools/thumbnail-downloader" },
        ]}
      />
    </ToolLayout>
  );
}
