// @vitest-environment jsdom

import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArchiveList } from "~/components/archive-list";
import { listPostsByYear } from "~/lib/posts";

describe("archive list", () => {
  it("renders year-grouped field notes timeline entries without search chrome", () => {
    const { container } = render(<ArchiveList groups={listPostsByYear()} />);

    expect(
      container.querySelector("[data-archive-timeline='true']"),
    ).toBeTruthy();
    expect(
      container.querySelector("[data-archive-year='2026']"),
    ).toBeTruthy();
    expect(screen.getByRole("heading", { level: 2, name: "2026" })).toBeTruthy();

    const article = container.querySelector(
      "[data-archive-entry='fp-ts-tap']",
    );

    expect(article?.tagName).toBe("ARTICLE");
    expect(
      screen.getByRole("link", { name: /fp-ts 进阶指南：深度解析 tap 系列副作用函数/i }),
    ).toBeTruthy();
    expect(
      screen.queryByText(/深入探讨 fp-ts 中 TaskEither 的 tap 系列函数/),
    ).toBeNull();
    expect(within(article as HTMLElement).getByText("fp-ts")).toBeTruthy();
    expect(screen.getByText("2026.01.28")).toBeTruthy();
    expect(screen.queryByPlaceholderText(/搜索|search/i)).toBeNull();
  });
});
