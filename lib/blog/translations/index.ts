import type { Locale } from "@/lib/i18n/config";
import type { PostTranslation } from "../posts";
import { en as enPosts } from "./en";
import { es as esPosts } from "./es";
import { de as dePosts } from "./de";
import { fr as frPosts } from "./fr";
import { it as itPosts } from "./it";
import { ja as jaPosts } from "./ja";
import { ko as koPosts } from "./ko";
import { tr as trPosts } from "./tr";
import { zh as zhPosts } from "./zh";

/**
 * Per-post, per-locale translations. Outer key = post slug,
 * inner key = locale code. Only non-English locales are stored here —
 * English lives in posts.ts as the base.
 *
 * `en` is included too (re-exported) for symmetry and to make a complete
 * fallback map, but getPostLocalized reads the English base directly from
 * the Post object and never needs to look it up here.
 */
export const postTranslations: Record<string, Partial<Record<Locale, PostTranslation>>> = {
  "guide-to-yt-seo-grow": {
    es: esPosts["guide-to-yt-seo-grow"],
    de: dePosts["guide-to-yt-seo-grow"],
    fr: frPosts["guide-to-yt-seo-grow"],
    it: itPosts["guide-to-yt-seo-grow"],
    ja: jaPosts["guide-to-yt-seo-grow"],
    ko: koPosts["guide-to-yt-seo-grow"],
    tr: trPosts["guide-to-yt-seo-grow"],
    zh: zhPosts["guide-to-yt-seo-grow"],
  },
  "youtube-cpm-rates-by-country": {
    es: esPosts["youtube-cpm-rates-by-country"],
    de: dePosts["youtube-cpm-rates-by-country"],
    fr: frPosts["youtube-cpm-rates-by-country"],
    it: itPosts["youtube-cpm-rates-by-country"],
    ja: jaPosts["youtube-cpm-rates-by-country"],
    ko: koPosts["youtube-cpm-rates-by-country"],
    tr: trPosts["youtube-cpm-rates-by-country"],
    zh: zhPosts["youtube-cpm-rates-by-country"],
  },
  "ai-thumbnail-design-system": {
    es: esPosts["ai-thumbnail-design-system"],
    de: dePosts["ai-thumbnail-design-system"],
    fr: frPosts["ai-thumbnail-design-system"],
    it: itPosts["ai-thumbnail-design-system"],
    ja: jaPosts["ai-thumbnail-design-system"],
    ko: koPosts["ai-thumbnail-design-system"],
    tr: trPosts["ai-thumbnail-design-system"],
    zh: zhPosts["ai-thumbnail-design-system"],
  },
  "youtube-algorithm-2026": {
    es: esPosts["youtube-algorithm-2026"],
    de: dePosts["youtube-algorithm-2026"],
    fr: frPosts["youtube-algorithm-2026"],
    it: itPosts["youtube-algorithm-2026"],
    ja: jaPosts["youtube-algorithm-2026"],
    ko: koPosts["youtube-algorithm-2026"],
    tr: trPosts["youtube-algorithm-2026"],
    zh: zhPosts["youtube-algorithm-2026"],
  },
  "hashtag-strategy-2026": {
    es: esPosts["hashtag-strategy-2026"],
    de: dePosts["hashtag-strategy-2026"],
    fr: frPosts["hashtag-strategy-2026"],
    it: itPosts["hashtag-strategy-2026"],
    ja: jaPosts["hashtag-strategy-2026"],
    ko: koPosts["hashtag-strategy-2026"],
    tr: trPosts["hashtag-strategy-2026"],
    zh: zhPosts["hashtag-strategy-2026"],
  },
};

// Re-export the English set (used only for tooling/testing symmetry).
export { enPosts };
