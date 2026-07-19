"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ArrowRight, Clock, Sparkles, Search, TrendingUp } from "lucide-react";
import { posts, categories } from "@/lib/blog/posts";
import { postTranslations } from "@/lib/blog/translations";
import { useLocale } from "@/lib/i18n/LocaleContext";
import { useTranslations } from "@/lib/i18n/useTranslations";
import { LocaleLink } from "@/lib/i18n/LocaleLink";
import { cn } from "@/lib/utils";

export function BlogHomeContent() {
  const [activeCat, setActiveCat] = useState<string>("all");
  const [query, setQuery] = useState("");
  const { locale } = useLocale();
  const { t } = useTranslations();

  // Resolve each post's localizable fields for the active locale, falling
  // back to the English base when no translation exists yet.
  const localizedPosts = useMemo(() => {
    return posts.map((p) => {
      const tr = postTranslations[p.slug]?.[locale];
      return {
        ...p,
        title: tr?.title ?? p.title,
        description: tr?.description ?? p.description,
        readTime: tr?.readTime ?? p.readTime,
        keywords: tr?.keywords ?? p.keywords,
      };
    });
  }, [locale]);

  const featured = localizedPosts.find((p) => p.featured) ?? localizedPosts[0];

  const filtered = useMemo(() => {
    return localizedPosts.filter((p) => {
      const catMatch = activeCat === "all" || p.category === activeCat;
      const q = query.trim().toLowerCase();
      const queryMatch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.keywords.some((k) => k.toLowerCase().includes(q));
      return catMatch && queryMatch;
    });
  }, [activeCat, query, localizedPosts]);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-red-600 border-b-4 border-black pt-16 sm:pt-18">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(255,255,255,0.25)_0%,transparent_60%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.16)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.16)_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_0%,#000_40%,transparent_100%)]" />
        </div>
        <div className="container mx-auto px-4 sm:px-6 py-12 sm:py-20 relative">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black text-white text-xs font-black tracking-wider uppercase mb-6 border-2 border-black shadow-[3px_3px_0px_0px_rgba(255,255,255,0.4)]">
              <Sparkles className="w-3.5 h-3.5 text-red-500" /> {t("blog.badge")}
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 [text-shadow:_3px_3px_0_rgb(0_0_0_/_30%)]">
              {t("blog.heroTitle")}
            </h1>
            <p className="text-base sm:text-lg text-red-50 leading-relaxed max-w-2xl mx-auto">
              {t("blog.heroDesc")}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured post */}
      <section className="bg-white border-b-2 border-black py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <LocaleLink
              href={`/blog/${featured.slug}`}
              className="group block bg-white border-2 border-black rounded-2xl sm:rounded-3xl overflow-hidden shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[8px_8px_0px_0px_rgba(220,38,38,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className={cn("relative aspect-[16/10] lg:aspect-auto p-8 sm:p-12 flex flex-col justify-between", featured.accent)}>
                  <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(0,0,0,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.3)_1px,transparent_1px)] bg-[size:2rem_2rem]" />
                  {featured.image && (
                    <Image
                      src={featured.image}
                      alt={featured.title}
                      fill
                      priority
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover opacity-90 mix-blend-luminosity"
                    />
                  )}
                  <div className="relative">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-wider rounded-full border-2 border-white/30">
                      <TrendingUp className="w-3 h-3 text-red-500" /> {t("blog.featured")}
                    </span>
                  </div>
                  <div className="relative">
                    <featured.icon className="w-16 h-16 sm:w-20 sm:h-20 text-white drop-shadow-[3px_3px_0_rgba(0,0,0,0.4)]" />
                  </div>
                  <div className="relative flex items-center gap-3 text-white">
                    <span className="text-xs font-black uppercase tracking-wider opacity-90">{featured.category}</span>
                    <span className="w-1 h-1 rounded-full bg-white/60" />
                    <span className="inline-flex items-center gap-1 text-xs font-bold opacity-90">
                      <Clock className="w-3 h-3" /> {featured.readTime}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-10 flex flex-col justify-center">
                  <div className="text-xs font-black text-red-600 uppercase tracking-wider mb-3">
                    {new Date(featured.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </div>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-black mb-3 leading-tight group-hover:text-red-600 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-sm sm:text-base text-neutral-600 leading-relaxed mb-5">
                    {featured.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-sm font-black text-black group-hover:text-red-600 transition-colors">
                    {t("blog.readArticle")} <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            </LocaleLink>
          </div>
        </div>
      </section>

      {/* Filters + grid */}
      <main className="flex-1 bg-neutral-50 py-10 sm:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setActiveCat("all")}
                  className={cn(
                    "px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl border-2 border-black transition-all",
                    activeCat === "all"
                      ? "bg-black text-white shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]"
                      : "bg-white text-black hover:bg-red-50"
                  )}
                >
                  {t("blog.all")}
                </button>
                {categories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setActiveCat(c.id)}
                    className={cn(
                      "inline-flex items-center gap-1.5 px-4 py-2 text-xs font-black uppercase tracking-wider rounded-xl border-2 border-black transition-all",
                      activeCat === c.id
                        ? "bg-black text-white shadow-[3px_3px_0px_0px_rgba(220,38,38,1)]"
                        : "bg-white text-black hover:bg-red-50"
                    )}
                  >
                    <c.icon className="w-3.5 h-3.5 text-red-600" /> {c.label}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t("blog.searchPlaceholder")}
                  className="w-full h-11 pl-10 pr-4 rounded-xl border-2 border-black bg-white text-sm font-bold placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-600/40"
                />
              </div>
            </div>

            {filtered.length === 0 ? (
              <div className="text-center py-20 bg-white border-2 border-black rounded-2xl">
                <p className="text-neutral-500 font-bold">{t("blog.noResults")}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((post, i) => (
                  <motion.div
                    key={post.slug}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: Math.min(i * 0.05, 0.3) }}
                  >
                    <LocaleLink
                      href={`/blog/${post.slug}`}
                      className="group block h-full bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(220,38,38,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                    >
                      <div className={cn("relative h-36 p-5 flex items-end justify-between overflow-hidden", post.accent)}>
                        <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,rgba(0,0,0,0.3)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.3)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem]" />
                        {post.image && (
                          <Image
                            src={post.image}
                            alt={post.title}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover opacity-90 mix-blend-luminosity"
                          />
                        )}
                        <post.icon className="absolute top-4 right-4 w-10 h-10 text-white/90 z-10" />
                        <span className="relative px-2.5 py-1 bg-black text-white text-[9px] font-black uppercase tracking-wider rounded-full border border-white/30 z-10">
                          {post.category}
                        </span>
                      </div>
                      <div className="p-5">
                        <div className="flex items-center gap-2 text-[11px] text-neutral-500 font-bold mb-2">
                          <span>{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                          <span className="w-1 h-1 rounded-full bg-neutral-300" />
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" /> {post.readTime}
                          </span>
                        </div>
                        <h3 className="font-black text-base sm:text-lg leading-tight text-black mb-2 group-hover:text-red-600 transition-colors line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-xs text-neutral-600 leading-relaxed line-clamp-3 mb-4">
                          {post.description}
                        </p>
                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-black group-hover:text-red-600 transition-colors">
                          {t("blog.readMore")} <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </div>
                    </LocaleLink>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
