// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const writerBrowserMocks = vi.hoisted(() => ({
  downloadWriterDraftOnClient: vi.fn(),
  loadWriterDraftOnClient: vi.fn(),
  saveWriterDraftOnClient: vi.fn(),
  saveWriterSnapshotOnClient: vi.fn(),
}));

vi.mock("~/features/writer/writer-browser", () => writerBrowserMocks);

vi.mock("~/features/writer/writer-editor", () => ({
  WriterEditor: ({
    onChange,
    placeholder,
    value,
  }: {
    onChange: (value: string) => void;
    placeholder: string;
    value: string;
  }) => (
    <textarea
      aria-label="Markdown 正文"
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      value={value}
    />
  ),
}));

import { WriterStudio } from "~/features/writer/writer-studio";
import { Route } from "~/routes/studio";

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

beforeEach(() => {
  writerBrowserMocks.loadWriterDraftOnClient.mockResolvedValue(null);
  writerBrowserMocks.saveWriterDraftOnClient.mockResolvedValue("primary");
  writerBrowserMocks.saveWriterSnapshotOnClient.mockResolvedValue(
    "primary:snapshot",
  );
  writerBrowserMocks.downloadWriterDraftOnClient.mockResolvedValue(undefined);
});

describe("writer studio", () => {
  it("declares the private route as noindex", () => {
    const head = Route.options.head;

    if (!head) {
      throw new Error("Expected the studio route to define head metadata");
    }

    expect(head({} as never)).toEqual({
      meta: [
        { title: "写作空间 | 格物致知" },
        { name: "robots", content: "noindex, nofollow" },
      ],
    });
  });

  it("keeps a minimal writing surface and enters browser fullscreen Zen mode", async () => {
    let fullscreenElement: Element | null = null;
    const requestFullscreen = vi.fn().mockImplementation(async () => {
      fullscreenElement = document.querySelector(
        '[data-writer-studio="true"]',
      );
      document.dispatchEvent(new Event("fullscreenchange"));
    });

    Object.defineProperty(document, "fullscreenElement", {
      configurable: true,
      get: () => fullscreenElement,
    });
    Object.defineProperty(Element.prototype, "requestFullscreen", {
      configurable: true,
      value: requestFullscreen,
    });

    const { container } = render(<WriterStudio />);
    const title = await screen.findByRole("textbox", { name: "文章标题" });
    const studio = container.querySelector<HTMLElement>(
      '[data-writer-studio="true"]',
    );

    if (!studio) {
      throw new Error("Expected a writer studio surface");
    }

    expect(screen.queryByText("Write to Think")).toBeNull();
    expect(
      screen.getByPlaceholderText("写下去，直到想法变得清晰。"),
    ).toBeTruthy();

    fireEvent.change(title, { target: { value: "一篇清晰的文章" } });
    fireEvent.change(screen.getByRole("textbox", { name: "Markdown 正文" }), {
      target: { value: "写下去，直到想法变得清晰。" },
    });
    fireEvent.click(screen.getByRole("button", { name: "进入 Zen" }));

    await waitFor(() => {
      expect(requestFullscreen).toHaveBeenCalledWith();
      expect(studio.dataset.zenMode).toBe("true");
    });

    expect(screen.getByText("11 字")).toBeTruthy();
  });
});
