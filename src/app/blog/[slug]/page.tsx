import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";
import Link from "next/link";

import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkCodeTitles from "remark-code-title";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";
import rehypeHighlightCodeLines from "rehype-highlight-code-lines";

import "@/styles/highlight-js/tokyo-night-dark.css";
import "katex/dist/katex.min.css";
import { Frontmatter } from "@/types/blog";
import { cn } from "@/utils";
import { BiliBili } from "@/components/bilibili";
import { ImageWithFallback } from "@/components/image-with-fallback";

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkCodeTitles, remarkMath],
    rehypePlugins: [rehypeKatex, rehypeHighlight, rehypeHighlightCodeLines],
  },
};

interface BlogPostProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const postsDir = path.join(process.cwd(), "src/app/posts");

  if (!fs.existsSync(postsDir)) {
    return [];
  }

  const filenames = fs.readdirSync(postsDir);

  return filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => ({
      slug: filename.replace(".mdx", ""),
    }));
}

async function getBlogPost(slug: string) {
  const filePath = path.join(process.cwd(), "src/app/posts", `${slug}.mdx`);

  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data: frontmatter, content } = matter(fileContent);

  return {
    frontmatter: frontmatter as Frontmatter,
    content,
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <article>
          {/* Cover Image */}
          {frontmatter.image && (
            <div className="relative w-full h-64 md:h-96 mb-8 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={frontmatter.image}
                alt={frontmatter.title}
                fill
                sizes="width: 100vw; height: auto"
                className="object-cover"
                priority
                fallbackSrc="/missing-image.svg"
              />
            </div>
          )}

          {/* Header */}
          <header className="mb-12">
            {/* Tags */}
            {frontmatter.tags && frontmatter.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {frontmatter.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs px-3 py-1 bg-pink-100 dark:bg-pink-800 text-pink-600 dark:text-pink-400 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-4xl text-gray-900 dark:text-gray-100 mb-6 leading-tight">
              {frontmatter.title}
            </h1>

            {/* Description */}
            {frontmatter.description && (
              <p className="font-light text-md text-gray-600 dark:text-gray-400 leading-relaxed mb-6 italic">
                {frontmatter.description}
              </p>
            )}

            {/* Meta */}
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
              <time dateTime={frontmatter.date}>
                {new Date(frontmatter.date).toLocaleDateString("zh-CN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>

            <div className="w-16 h-px bg-gray-300 dark:bg-gray-600 mt-8"></div>
          </header>

          {/* Content */}
          <article
            className={cn(
              "max-w-none prose prose-pink prose-img:rounded-lg prose-video:rounded-lg dark:prose-invert prose-a:text-foreground prose-a:decoration-6 prose-a:-underline-offset-2 prose-a:decoration-pink-300",
              {
                "font-serif leading-relaxed prose-p:indent-6 prose-headings:font-sans":
                  frontmatter.tags?.includes("随笔"),
              },
            )}
          >
            <MDXRemote
              source={content}
              options={options}
              components={{ BiliBili }}
            />
          </article>

          {/* Footer */}
          <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <Link
                href="/blog"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-pink-900 dark:hover:text-pink-100 transition-colors"
              >
                ← 返回博客列表
              </Link>

              {frontmatter.tags && frontmatter.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500 dark:text-gray-500">
                    标签:
                  </span>
                  <div className="flex gap-1">
                    {frontmatter.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-pink-100 dark:bg-pink-800 text-pink-600 dark:text-pink-400 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}

export async function generateMetadata({ params }: BlogPostProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  const { frontmatter } = post;

  return {
    title: `${frontmatter.title} | 格物致知`,
    description: frontmatter.description || frontmatter.title,
    keywords: frontmatter.keywords || frontmatter.tags || [],
    openGraph: {
      title: frontmatter.title,
      description: frontmatter.description || frontmatter.title,
      type: "article",
      publishedTime: frontmatter.date,
      images: frontmatter.image
        ? [
            {
              url: frontmatter.image,
              alt: frontmatter.title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: frontmatter.title,
      description: frontmatter.description || frontmatter.title,
      images: frontmatter.image ? [frontmatter.image] : undefined,
    },
  };
}
