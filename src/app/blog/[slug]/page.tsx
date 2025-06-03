import matter from "gray-matter";
import fs from "fs";
import path from "path";
import { MDXRemote } from "next-mdx-remote/rsc";
import { notFound } from "next/navigation";

import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeHighlight from "rehype-highlight";

import "@/styles/highlight-js/tokyo-night-dark.css";
import "katex/dist/katex.min.css";

const options = {
  mdxOptions: {
    remarkPlugins: [remarkGfm, remarkMath],
    rehypePlugins: [rehypeKatex, rehypeHighlight],
  },
};

interface BlogPostProps {
  params: {
    slug: string;
  };
}

interface FrontMatter {
  title: string;
  date: string;
  description?: string;
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
    frontmatter: frontmatter as FrontMatter,
    content,
  };
}

export default async function BlogPost({ params }: BlogPostProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const { frontmatter, content } = post;

  return (
    <article className="max-w-2xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-4">{frontmatter.title}</h1>
        <p className="text-gray-600">发布时间: {frontmatter.date.toString()}</p>
        {frontmatter.description && (
          <p className="text-lg text-gray-700 mt-2">
            {frontmatter.description}
          </p>
        )}
      </header>

      <div className="prose max-w-none">
        <MDXRemote source={content} options={options} />
      </div>
    </article>
  );
}

export async function generateMetadata({ params }: BlogPostProps) {
  const post = await getBlogPost(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.frontmatter.title,
    description: post.frontmatter.description || post.frontmatter.title,
  };
}
