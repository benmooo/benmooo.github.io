// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const writerBrowserMocks = vi.hoisted(() => ({
  deleteWriterDraftOnClient: vi.fn(),
  downloadWriterDraftOnClient: vi.fn(),
  loadWriterDraftOnClient: vi.fn(),
  loadWriterLibraryStateOnClient: vi.fn(),
  saveWriterDraftOnClient: vi.fn(),
  saveWriterSnapshotOnClient: vi.fn(),
  selectWriterDraftOnClient: vi.fn(),
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
  const primaryDraft = {
    id: "primary",
    title: "",
    body: "",
    createdAt: "2026-07-24T00:00:00.000Z",
    updatedAt: "2026-07-24T00:00:00.000Z",
    settings: {
      focusMode: false,
      typewriterMode: true,
      fontScale: 1,
      lineHeight: 1.85,
    },
  };

  writerBrowserMocks.loadWriterLibraryStateOnClient.mockResolvedValue({
    activeDraftId: "primary",
    drafts: [
      {
        id: "primary",
        title: "",
        createdAt: primaryDraft.createdAt,
        updatedAt: primaryDraft.updatedAt,
        writingUnits: 0,
      },
    ],
  });
  writerBrowserMocks.loadWriterDraftOnClient.mockResolvedValue(primaryDraft);
  writerBrowserMocks.saveWriterDraftOnClient.mockResolvedValue("primary");
  writerBrowserMocks.saveWriterSnapshotOnClient.mockResolvedValue(
    "primary:snapshot",
  );
  writerBrowserMocks.selectWriterDraftOnClient.mockResolvedValue(primaryDraft);
  writerBrowserMocks.deleteWriterDraftOnClient.mockResolvedValue({
    activeDraftId: null,
    drafts: [],
  });
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

  it("saves the current draft before selecting another local draft", async () => {
    const secondDraft = {
      id: "draft-second",
      title: "第二篇",
      body: "另一段文字",
      createdAt: "2026-07-24T01:00:00.000Z",
      updatedAt: "2026-07-24T01:00:00.000Z",
      settings: {
        focusMode: false,
        typewriterMode: true,
        fontScale: 1,
        lineHeight: 1.85,
      },
    };

    writerBrowserMocks.loadWriterLibraryStateOnClient.mockResolvedValue({
      activeDraftId: "primary",
      drafts: [
        {
          id: "primary",
          title: "",
          createdAt: "2026-07-24T00:00:00.000Z",
          updatedAt: "2026-07-24T00:00:00.000Z",
          writingUnits: 0,
        },
        {
          id: secondDraft.id,
          title: secondDraft.title,
          createdAt: secondDraft.createdAt,
          updatedAt: secondDraft.updatedAt,
          writingUnits: 5,
        },
      ],
    });
    writerBrowserMocks.selectWriterDraftOnClient.mockResolvedValueOnce(
      secondDraft,
    );
    render(<WriterStudio />);

    await screen.findByRole("textbox", { name: "文章标题" });
    fireEvent.click(screen.getByRole("button", { name: "文稿" }));
    fireEvent.click(screen.getByRole("button", { name: "打开 第二篇" }));

    await waitFor(() => {
      expect(writerBrowserMocks.saveWriterDraftOnClient).toHaveBeenCalled();
      expect(writerBrowserMocks.selectWriterDraftOnClient).toHaveBeenCalledWith(
        secondDraft.id,
      );
    });

    expect(
      (screen.getByRole("textbox", {
        name: "文章标题",
      }) as HTMLInputElement).value,
    ).toBe(secondDraft.title);
    expect(screen.queryByRole("complementary", { name: "文稿库" })).toBeNull();
  });

  it("creates a separate local draft from the library", async () => {
    render(<WriterStudio />);

    await screen.findByRole("textbox", { name: "文章标题" });
    fireEvent.click(screen.getByRole("button", { name: "文稿" }));
    fireEvent.click(screen.getByRole("button", { name: "新建文章" }));

    await waitFor(() => {
      const selectedDraftId =
        writerBrowserMocks.selectWriterDraftOnClient.mock.calls.at(-1)?.[0];

      expect(selectedDraftId).toBeTruthy();
      expect(selectedDraftId).not.toBe("primary");
    });
  });
});
