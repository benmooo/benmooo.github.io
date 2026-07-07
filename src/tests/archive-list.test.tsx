// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ArchiveList } from "~/components/archive-list";
import { listPostsByYear } from "~/lib/posts";

describe("archive list", () => {
  it("renders year-grouped editorial rows without search chrome", () => {
    render(<ArchiveList groups={listPostsByYear()} />);

    expect(screen.getByText("2026")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: /fp-ts 进阶指南：深度解析 tap 系列副作用函数/i }),
    ).toBeTruthy();
    expect(
      screen.getByText(/深入探讨 fp-ts 中 TaskEither 的 tap 系列函数/),
    ).toBeTruthy();
    expect(screen.queryByPlaceholderText(/搜索|search/i)).toBeNull();
  });
});
