// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PostArticle } from "~/components/post-article";
import { getPostBySlug } from "~/lib/posts";

describe("post article", () => {
  it("renders essay posts on the shared surface with reflective prose treatment", () => {
    const post = getPostBySlug("emotion-normalize");

    if (!post) {
      throw new Error("Expected emotion-normalize post to exist");
    }

    const { container } = render(<PostArticle post={post} />);
    const surface = container.querySelector(
      "[data-post-surface='standard']",
    );
    const reflectiveProse = container.querySelector(
      "[data-reflective-prose='true']",
    );

    expect(surface?.className ?? "").toContain("bg-[var(--canvas)]");
    expect(surface?.className ?? "").toContain("text-[var(--ink)]");
    expect(container.querySelector("[data-post-surface='essay']")).toBeNull();
    expect(container.querySelectorAll('[data-instant-photo="true"]').length).toBeGreaterThan(0);
    expect(screen.getByRole("navigation", { name: "目录" })).toBeTruthy();
    expect(
      container.querySelector("[data-post-table-of-contents='true']"),
    ).toBeTruthy();
    expect(reflectiveProse?.className ?? "").toContain("prose-semantic");
    expect(reflectiveProse?.className ?? "").toContain("prose-p:indent-6");
    expect(screen.getByText("感知与情绪归一化")).toBeTruthy();
  });

  it("renders technical posts on the shared surface without reflective prose", () => {
    const post = getPostBySlug("fp-ts-tap");

    if (!post) {
      throw new Error("Expected fp-ts-tap post to exist");
    }

    const { container } = render(<PostArticle post={post} />);
    const surface = container.querySelector(
      "[data-post-surface='standard']",
    );

    expect(surface?.className ?? "").toContain("bg-[var(--canvas)]");
    expect(surface?.className ?? "").toContain("text-[var(--ink)]");
    expect(
      container.querySelector("[data-reflective-prose='true']"),
    ).toBeNull();
    expect(container.querySelector(".prose")?.className ?? "").toContain(
      "prose-semantic",
    );
    expect(screen.getByText(/tap 系列副作用函数/)).toBeTruthy();
  });
});
