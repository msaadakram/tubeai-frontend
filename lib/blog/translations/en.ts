import type { PostTranslation } from "../posts";

/**
 * English translations. Provided for symmetry — getPostLocalized reads
 * English directly from the Post object in posts.ts, so these are only used
 * as a complete-fallback map by tooling. Left empty intentionally; populate
 * only if the English source-of-truth moves out of posts.ts.
 */
export const en: Record<string, PostTranslation> = {};
