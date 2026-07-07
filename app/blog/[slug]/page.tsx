import { Metadata } from "next";
import { notFound } from "next/navigation";
import { posts, getPost, getRelatedPosts } from "@/lib/blog/posts";
import { BlogPostContent } from "./BlogPostContent";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return { title: "Article not found — YTForge" };
  return {
    title: `${post.title} — YTForge Blog`,
    description: post.description,
    keywords: post.keywords,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
    },
    robots: { index: true, follow: true },
  };
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

  // Serialize post data for the client component (icons/functions can't cross
  // the server->client boundary).
  const serializable = {
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    author: post.author,
    date: post.date,
    readTime: post.readTime,
    accent: post.accent,
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

  return (
    <BlogPostContent
      post={serializable}
      related={relatedSerializable}
      toc={toc}
      iconName={post.iconName}
    />
  );
}
