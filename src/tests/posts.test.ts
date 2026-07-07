import { describe, expect, it } from "vitest";

import {
  getPostBySlug,
  listPostsByYear,
  listPublishedPosts,
} from "~/lib/posts";

describe("posts query layer", () => {
  it("lists published posts newest first and excludes drafts", () => {
    const posts = listPublishedPosts();

    expect(posts.length).toBeGreaterThan(0);
    expect(posts.some((post) => post.slug === "xzkn")).toBe(false);
    expect(posts[0]?.slug).toBe("fp-ts-tap");
  });

  it("derives essay metadata and headings from the content source", () => {
    const post = getPostBySlug("gardening0");

    expect(post).toBeDefined();
    expect(post?.isEssay).toBe(true);
    expect(post?.readingMinutes).toBeGreaterThan(0);
    expect(
      post?.headings.map((heading: { text: string }) => heading.text),
    ).toEqual(
      expect.arrayContaining(["缘起", "偏爱", "Plan"]),
    );
  });

  it("groups published posts by year", () => {
    const groups = listPostsByYear();

    expect(groups[0]?.year).toBe(2026);
    expect(groups[0]?.posts.map((post) => post.slug)).toContain("fp-ts-tap");
    expect(groups.some((group) => group.year === 2025)).toBe(true);
  });
});
