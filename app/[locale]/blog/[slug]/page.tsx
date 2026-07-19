import { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts, getPostLocalized, getRelatedPostsLocalized } from "@/lib/blog/posts";
import { BlogPostContent } from "./BlogPostContent";
import {
  buildLocalizedMetadata,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  JsonLd,
} from "@/lib/seo";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";

export function generateStaticParams() {
  // Emit (locale, slug) pairs for every locale × every post so the whole
  // matrix is prerendered.
  const out: { locale: string; slug: string }[] = [];
  for (const locale of locales) {
    for (const p of posts) out.push({ locale, slug: p.slug });
  }
  return out;
}

type Params = { params: Promise<{ locale: string; slug: string }> };

function resolveLocale(locale: string | undefined): Locale {
  return (locales as readonly string[]).includes(locale ?? "")
    ? (locale as Locale)
    : defaultLocale;
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locale, slug } = await params;
  const resolved = resolveLocale(locale);
  const post = getPostLocalized(slug, resolved);
  if (!post) return { title: "Article not found" };
  return buildLocalizedMetadata({
    locale: resolved,
    routeKey: `blogPosts.${slug}`,
    path: `/blog/${post.slug}`,
    type: "article",
    image: post.image,
    publishedTime: post.date,
    modifiedTime: post.date,
    authors: [post.author],
  });
}

// Question-word prefixes per locale, used to detect which <h2> headings should
// also be emitted as FAQ entries. English is the historical default; each
// non-English locale gets its own set so FAQPage JSON-LD keeps generating.
const FAQ_PREFIXES: Record<Locale, RegExp> = {
  en: /^(how|what|why|when|where|can|do|does|is|are|should)/i,
  es: /^(c[oó]mo|qu[eé]|por qu[eé]|cu[aá]ndo|d[oó]nde|puede|pueden|hace|es|son|deber[ií])/i,
  de: /^(wie|was|warum|wann|wo|kann|k[oö]nnen|macht|ist|sind|sollte)/i,
  fr: /^(comment|quel|quelle|pourquoi|quand|o[uù]|peut|peuvent|est|sont|faut)/i,
  it: /^(come|cosa|perch[eé]|quando|dove|pu[oò]|f[aà]|e|sono|si dovrebbe)/i,
  ja: /^(どの|何|なぜ|いつ|どこ|できる|します|です|ます|べき)/,
  ko: /^(어떻게|무엇|왜|언제|어디|할 수|합니까|입니다|있습니까|해야)/,
  tr: /^(nas[iı]l|ne|neden|ne zaman|nerede|yapabilir|yapar|m[iı]|d[iı]r|dir|olmal[iı])/i,
  zh: /^(如何|什么|为什么|什么时候|哪里|能|可以|是|应该)/,
};

export default async function BlogPostPage({ params }: Params) {
  const { locale, slug } = await params;
  const resolved = resolveLocale(locale);
  const post = getPostLocalized(slug, resolved);
  if (!post) notFound();
  const related = getRelatedPostsLocalized(slug, resolved);
  const toc = post.blocks
    .filter((b) => b.type === "h2")
    .map((b) => (b.type === "h2" ? { id: b.id, text: b.text } : null))
    .filter((x): x is { id: string; text: string } => x !== null);

  const faqRegex = FAQ_PREFIXES[resolved];
  const faqBlocks: { q: string; a: string }[] = [];
  for (let i = 0; i < post.blocks.length; i++) {
    const b = post.blocks[i];
    if (b.type === "h2" && faqRegex.test(b.text)) {
      const next = post.blocks[i + 1];
      if (next && next.type === "p") faqBlocks.push({ q: b.text, a: next.text });
    }
  }

  const serializable = {
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    author: post.author,
    date: post.date,
    readTime: post.readTime,
    accent: post.accent,
    image: post.image,
    keywords: post.keywords,
    blocks: post.blocks,
  };

  // ✅ FIX: include `image` so the "Keep reading" cards render the actual thumbnail
  const relatedSerializable = related.map((rp) => ({
    slug: rp.slug,
    title: rp.title,
    description: rp.description,
    category: rp.category,
    readTime: rp.readTime,
    date: rp.date,
    accent: rp.accent,
    image: rp.image,
  }));

  const jsonLd: object[] = [
    articleJsonLd({
      title: post.title,
      description: post.description,
      path: `/blog/${post.slug}`,
      locale: resolved,
      image: post.image,
      datePublished: post.date,
      dateModified: post.date,
      author: post.author,
    }),
    breadcrumbJsonLd(
      [
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ],
      resolved,
    ),
  ];
  if (faqBlocks.length > 0) jsonLd.push(faqJsonLd(faqBlocks));

  return (
    <>
      <BlogPostContent
        post={serializable}
        related={relatedSerializable}
        toc={toc}
        iconName={post.iconName}
      />
      <JsonLd data={jsonLd} />
    </>
  );
}
