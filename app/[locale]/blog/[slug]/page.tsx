import { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts, getPost, getRelatedPosts } from "@/lib/blog/posts";
import { BlogPostContent } from "./BlogPostContent";
import {
  buildMetadata,
  articleJsonLd,
  breadcrumbJsonLd,
  faqJsonLd,
  JsonLd,
} from "@/lib/seo";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found — YTForge" };
  return buildMetadata({
    title: `${post.title} — YTForge Blog`,
    description: post.description,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    type: "article",
    publishedTime: post.date,
    authors: [post.author],
    image: post.image,
  });
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  const related = getRelatedPosts(slug);
  const toc = post.blocks
    .filter((b) => b.type === "h2")
    .map((b) => (b.type === "h2" ? { id: b.id, text: b.text } : null))
    .filter((x): x is { id: string; text: string } => x !== null);

  // Pull FAQ-style H2s (questions) and the paragraph that follows as the answer,
  // for FAQPage structured data.
  const faqBlocks: { q: string; a: string }[] = [];
  for (let i = 0; i < post.blocks.length; i++) {
    const b = post.blocks[i];
    if (b.type === "h2" && /^(how|what|why|when|where|can|do|does|is|are|should)/i.test(b.text)) {
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
  const relatedSerializable = related.map((rp) => ({
    slug: rp.slug,
    title: rp.title,
    description: rp.description,
    category: rp.category,
    readTime: rp.readTime,
    date: rp.date,
    accent: rp.accent,
  }));

  const jsonLd: object[] = [
    articleJsonLd({
      title: post.title,
      description: post.description,
      path: `/blog/${post.slug}`,
      image: post.image,
      datePublished: post.date,
      dateModified: post.date,
      author: post.author,
    }),
    breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Blog", path: "/blog" },
      { name: post.title, path: `/blog/${post.slug}` },
    ]),
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
