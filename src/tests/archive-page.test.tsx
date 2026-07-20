// @vitest-environment jsdom

import { cleanup, render, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { listPostsByYear } from "~/lib/posts";
import { ArchivePage } from "~/routes/blog.index";

afterEach(cleanup);

describe("archive page", () => {
  it("renders the Quiet Journal introduction before the field notes timeline", () => {
    const { container } = render(
      <ArchivePage groups={listPostsByYear()} />,
    );

    const introduction = container.querySelector(
      "[data-archive-introduction='true']",
    );

    expect(introduction).toBeTruthy();
    expect(within(introduction as HTMLElement).getByText("Collected writings")).toBeTruthy();
    expect(
      within(introduction as HTMLElement).getByRole("heading", {
        level: 1,
        name: "Write to Think",
      }),
    ).toBeTruthy();
    expect(
      within(introduction as HTMLElement).getByText(
        /Notes on engineering, systems, games/,
      ),
    ).toBeTruthy();
    expect(
      container.querySelector("[data-archive-timeline='true']"),
    ).toBeTruthy();
  });
});
