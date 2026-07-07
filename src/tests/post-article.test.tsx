// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PostArticle } from "~/components/post-article";
import { getPostBySlug } from "~/lib/posts";

describe("post article", () => {
  it("renders essay posts with instant-photo treatment and a table of contents", () => {
    const post = getPostBySlug("emotion-normalize");

    if (!post) {
      throw new Error("Expected emotion-normalize post to exist");
    }

    const { container } = render(<PostArticle post={post} />);

    expect(container.querySelector('[data-post-mode="essay"]')).toBeTruthy();
    expect(container.querySelectorAll('[data-instant-photo="true"]').length).toBeGreaterThan(0);
    expect(screen.getByRole("navigation", { name: "目录" })).toBeTruthy();
    expect(screen.getByText("感知与情绪归一化")).toBeTruthy();
  });

  it("renders technical posts in standard mode", () => {
    const post = getPostBySlug("fp-ts-tap");

    if (!post) {
      throw new Error("Expected fp-ts-tap post to exist");
    }

    const { container } = render(<PostArticle post={post} />);

    expect(container.querySelector('[data-post-mode="standard"]')).toBeTruthy();
    expect(screen.getByText(/tap 系列副作用函数/)).toBeTruthy();
  });
});
