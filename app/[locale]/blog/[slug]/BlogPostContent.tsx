"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "motion/react";
import {
  ArrowRight,
  ArrowLeft,
  Clock,
  Calendar,
  Twitter,
  Linkedin,
  Facebook,
  Link as LinkIcon,
  Check,
  ArrowUp,
  Sparkles,
  TrendingUp,
  DollarSign,
  PenTool,
  BarChart3,
  Hash,
  type LucideIcon,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import type { Block } from "@/lib/blog/posts";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  TrendingUp,
  DollarSign,
  PenTool,
  BarChart3,
  Hash,
};

export type SerializablePost = {
  slug: string;
  title: string;
  description: string;
  category: string;
  author: string;
  date: string;
  readTime: string;
  accent: string;
  image?: string;
  keywords: string[];
  blocks: Block[];
};

export type SerializableRelated = {
  slug: string;
  title: string;
  description: string;
  category: string;
  readTime: string;
  date: string;
  accent: string;
};

function BlockRenderer({ block }: { block: Block }) {
  switch (block.type) {
    case "p":
      return <p className="text-[15px] sm:text-base text-neutral-700 leading-relaxed mb-5">{block.text}</p>;
    case "h2":
      return (
        <h2 id={block.id} className="scroll-mt-24 text-2xl sm:text-3xl font-black tracking-tight text-black mt-10 mb-4 flex items-start gap-2">
          <span className="w-1.5 h-7 sm:h-8 bg-red-600 rounded-full mt-1.5 shrink-0" />
          <span>{block.text}</span>
        </h2>
      );
    case "h3":
      return <h3 className="font-black text-lg text-black mt-6 mb-2">{block.text}</h3>;
    case "ul":
      return (
        <ul className="mb-5 space-y-2 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-[15px] text-neutral-700 leading-relaxed">
              <span className="mt-2 w-1.5 h-1.5 rounded-full bg-red-600 shrink-0" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol className="mb-5 space-y-2 pl-1">
          {block.items.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-[15px] text-neutral-700 leading-relaxed">
              <span className="shrink-0 w-6 h-6 rounded-lg bg-black text-white text-xs font-black flex items-center justify-center mt-0.5">
                {i + 1}
              </span>
              <span className="pt-0.5">{item}</span>
            </li>
          ))}
        </ol>
      );
    case "quote":
      return (
        <blockquote className="my-6 border-l-4 border-red-600 bg-red-50 rounded-r-xl py-4 pl-5 pr-4">
          <p className="text-base sm:text-lg font-black text-black leading-snug">{block.text}</p>
        </blockquote>
      );
    case "table":
      return (
        <div className="my-6 overflow-x-auto border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {block.head.map((h, i) => (
                  <th key={i} className="p-3 text-left bg-black text-white text-xs font-black uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, ri) => (
                <tr key={ri} className={ri % 2 === 0 ? "bg-white" : "bg-neutral-50"}>
                  {row.map((cell, ci) => (
                    <td key={ci} className="p-3 border-t-2 border-black text-sm font-bold text-black">
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}

export function BlogPostContent({
  post,
  related,
  toc,
  iconName,
}: {
  post: SerializablePost;
  related: SerializableRelated[];
  toc: { id: string; text: string }[];
  iconName: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const [showTop, setShowTop] = React.useState(false);

  const Icon = ICONS[iconName] ?? Sparkles;

  React.useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <Navbar />

      {/* Hero */}
      <section className={cn("relative overflow-hidden border-b-4 border-black pt-16 sm:pt-18", post.accent)}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.18)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.18)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.2)_0%,transparent_60%)]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-white/90 hover:text-white mb-6"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> All Articles
            </Link>

            <div className="flex items-center gap-3 mb-4 text-white">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-full border-2 border-white/30">
                <Icon className="w-3 h-3 text-red-500" /> {post.category}
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-5 leading-tight [text-shadow:_2px_2px_0_rgb(0_0_0_/_30%)]">
              {post.title}
            </h1>
            <p className="text-base sm:text-lg text-white/90 leading-relaxed mb-6 max-w-2xl">
              {post.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-white/90 text-xs font-bold">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> {post.date}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> {post.readTime}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> {post.author}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Cover image */}
      {post.image && (
        <div className="bg-white">
          <div className="container mx-auto px-4 sm:px-6 -mt-8 sm:-mt-12 relative">
            <div className="max-w-4xl mx-auto">
              <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] aspect-[16/9] bg-neutral-100">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 768px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Body */}
      <main className="flex-1 bg-white py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 max-w-5xl mx-auto">
            {/* TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <div className="bg-white border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-5">
                  <div className="font-black text-sm uppercase tracking-wider mb-3 flex items-center gap-2">
                    <ArrowRight className="w-3.5 h-3.5 text-red-600 rotate-45" /> Contents
                  </div>
                  <nav className="space-y-1">
                    {toc.map((s) => (
                      <a
                        key={s.id}
                        href={`#${s.id}`}
                        className="block px-3 py-1.5 text-xs font-bold text-neutral-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        {s.text}
                      </a>
                    ))}
                  </nav>
                </div>

                {/* Share */}
                <div className="mt-4 bg-black border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(220,38,38,1)] p-5">
                  <div className="font-black text-sm uppercase tracking-wider mb-3 text-white">Share</div>
                  <div className="flex flex-col gap-2">
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border-2 border-white/10 text-white text-xs font-black hover:bg-red-600 hover:border-red-600 transition-colors"
                    >
                      <Twitter className="w-3.5 h-3.5" /> Twitter / X
                    </a>
                    <a
                      href="https://www.linkedin.com/sharing/share-offsite/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border-2 border-white/10 text-white text-xs font-black hover:bg-red-600 hover:border-red-600 transition-colors"
                    >
                      <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                    </a>
                    <a
                      href="https://www.facebook.com/sharer/sharer.php"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border-2 border-white/10 text-white text-xs font-black hover:bg-red-600 hover:border-red-600 transition-colors"
                    >
                      <Facebook className="w-3.5 h-3.5" /> Facebook
                    </a>
                    <button
                      onClick={copyLink}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border-2 border-white/10 text-white text-xs font-black hover:bg-red-600 hover:border-red-600 transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <LinkIcon className="w-3.5 h-3.5" />}
                      {copied ? "Copied!" : "Copy link"}
                    </button>
                  </div>
                </div>
              </div>
            </aside>

            {/* Article */}
            <article className="bg-white border-2 border-black rounded-2xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] p-6 sm:p-10">
              {/* Mobile share */}
              <div className="lg:hidden flex items-center gap-2 mb-6 pb-6 border-b-2 border-dashed border-neutral-200">
                <span className="text-xs font-black uppercase tracking-wider text-neutral-500 mr-1">Share:</span>
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center hover:bg-red-50">
                  <Twitter className="w-3.5 h-3.5" />
                </a>
                <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center hover:bg-red-50">
                  <Linkedin className="w-3.5 h-3.5" />
                </a>
                <button onClick={copyLink} className="w-8 h-8 rounded-lg border-2 border-black flex items-center justify-center hover:bg-red-50">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <LinkIcon className="w-3.5 h-3.5" />}
                </button>
              </div>

              {post.blocks.map((block, i) => (
                <BlockRenderer key={i} block={block} />
              ))}

              {/* CTA */}
              <div className="mt-10 p-6 bg-red-600 border-2 border-black rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-black flex items-center justify-center border-2 border-white shrink-0">
                  <Sparkles className="w-5 h-5 text-red-500" />
                </div>
                <div className="flex-1">
                  <div className="font-black text-lg text-white mb-1">Try these tactics with YTForge</div>
                  <p className="text-sm text-red-100">AI titles, SEO audits, thumbnails, and channel analytics — all in one place.</p>
                </div>
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-white text-black font-black rounded-xl border-2 border-black hover:-translate-y-0.5 transition-transform text-sm uppercase tracking-wider whitespace-nowrap"
                >
                  Start Free <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </article>
          </div>

          {/* Related */}
          {related.length > 0 && (
            <div className="max-w-5xl mx-auto mt-14">
              <h3 className="text-2xl font-black tracking-tight text-black mb-6 flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-red-600" /> Keep reading
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {related.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group block bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                  >
                    <div className={cn("relative h-24 p-4 flex items-end", rp.accent)}>
                      <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(0,0,0,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.3)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
                      <span className="relative px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-wider rounded-full border border-white/30">
                        {rp.category}
                      </span>
                    </div>
                    <div className="p-4">
                      <div className="text-[11px] text-neutral-500 font-bold mb-1.5 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {rp.readTime}
                      </div>
                      <h4 className="font-black text-sm leading-tight text-black group-hover:text-red-600 transition-colors line-clamp-2">
                        {rp.title}
                      </h4>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Back to top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-6 right-6 z-40 w-11 h-11 rounded-xl bg-black text-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(220,38,38,1)] flex items-center justify-center hover:-translate-y-0.5 transition-transform"
          aria-label="Back to top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      <Footer />
    </div>
  );
}
