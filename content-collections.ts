import { defineCollection, defineConfig } from "@content-collections/core";
import { compileMDX } from "@content-collections/mdx";
import GithubSlugger from "github-slugger";
import remarkCodeTitle from "remark-code-title";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import { z } from "zod";

import { estimateReadingMinutes } from "./src/lib/reading-time";

type Heading = {
  id: string;
  text: string;
  level: number;
};

const headingLevels = new Set([2, 3]);

const normalizeDate = (value: string | Date) => {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new Error(`Invalid date value: ${String(value)}`);
  }

  return date.toISOString().slice(0, 10);
};

const slugFromMetaPath = (path: string) => path.replace(/^\/+/, "");

const createExcerpt = (content: string, description?: string) => {
  if (description) {
    return description;
  }

  const normalized = content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]+`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]+\]\([^)]+\)/g, " ")
    .replace(/[#>*_~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return normalized.slice(0, 140);
};

const extractHeadings = (content: string): Heading[] => {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let isInsideFence = false;

  for (const line of content.split("\n")) {
    if (line.trimStart().startsWith("```")) {
      isInsideFence = !isInsideFence;
      continue;
    }

    if (isInsideFence) {
      continue;
    }

    const match = /^(#{2,3})\s+(.*)$/.exec(line.trim());

    if (!match) {
      continue;
    }

    const level = match[1].length;
    const text = match[2].trim();

    if (!headingLevels.has(level) || !text) {
      continue;
    }

    headings.push({
        id: slugger.slug(text),
        text,
        level,
    });
  }

  return headings;
};

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "**/*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    date: z.union([z.string(), z.date()]),
    tags: z.array(z.string()).optional().default([]),
    image: z.string().optional(),
    draft: z.boolean().optional().default(false),
    keywords: z.array(z.string()).nullish(),
    category: z.string().optional(),
    featured: z.boolean().optional(),
    readingTime: z.string().optional(),
    lastModified: z.union([z.string(), z.date()]).optional(),
    content: z.string(),
  }),
  transform: async (document, context) => {
    const publishedAt = normalizeDate(document.date);
    const slug = slugFromMetaPath(document._meta.path);
    const headings = extractHeadings(document.content);

    const mdx = await compileMDX(context, document, {
      remarkPlugins: [remarkGfm, remarkCodeTitle, remarkMath],
      rehypePlugins: [rehypeSlug, rehypeKatex, rehypePrettyCode],
    });

    return {
      ...document,
      date: publishedAt,
      slug,
      year: Number.parseInt(publishedAt.slice(0, 4), 10),
      isEssay: document.tags.includes("随笔"),
      excerpt: createExcerpt(document.content, document.description),
      readingMinutes: estimateReadingMinutes(document.content),
      headings,
      keywords: document.keywords ?? [],
      lastModified: document.lastModified
        ? normalizeDate(document.lastModified)
        : undefined,
      mdx,
    };
  },
});

export default defineConfig({
  content: [posts],
});
