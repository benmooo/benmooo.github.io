// @vitest-environment jsdom

import { cleanup, render, within } from "@testing-library/react";
import {
  RouterContextProvider,
  createMemoryHistory,
  createRouter,
} from "@tanstack/react-router";
import { afterEach, describe, expect, it } from "vitest";

import { routeTree } from "~/routeTree.gen";
import { Route } from "~/routes/index";

afterEach(cleanup);

describe("homepage", () => {
  it("renders the Quiet Journal introduction with theme-aware concept art", async () => {
    const router = createRouter({
      routeTree,
      history: createMemoryHistory({ initialEntries: ["/"] }),
    });
    await router.load();
    const HomePage = Route.options.component;

    if (!HomePage) {
      throw new Error("Expected the home route to define a component");
    }

    const { container } = render(
      <RouterContextProvider router={router}>
        <HomePage />
      </RouterContextProvider>,
    );

    expect(
      within(container).getByText(
        "探索从经验到抽象，再用抽象重组世界图景的思维艺术",
      ),
    ).toBeTruthy();
    expect(
      within(container).getByRole("link", { name: "Read the archive" }),
    ).toBeTruthy();
    expect(container.querySelector('a[href="/about"]')).toBeTruthy();
    expect(container.querySelector('a[href="/contact"]')).toBeTruthy();

    const illustration = container.querySelector(
      '[data-home-illustration="true"]',
    );

    expect(
      illustration?.querySelector('source[srcset="/paradigm1.svg"]'),
    ).toBeTruthy();
    expect(illustration?.querySelector('img[src="/paradigm.svg"]')).toBeTruthy();
  });
});
