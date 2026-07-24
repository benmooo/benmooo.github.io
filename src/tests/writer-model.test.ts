import { describe, expect, it } from "vitest";

import {
  countWritingUnits,
  createWriterLibraryState,
  createWriterDraft,
  getWriterDraftLabel,
  getMdxExportFilename,
  removeWriterDraftSummary,
  resolveWriterLibrary,
  shouldCreateWriterSnapshot,
  sortWriterDraftsByUpdatedAt,
  toMdx,
  toWriterDraftSummary,
  upsertWriterDraftSummary,
  updateWriterDraft,
} from "~/features/writer/writer-model";

const createdAt = "2026-07-23T08:00:00.000Z";

describe("writer model", () => {
  it("creates immutable drafts with focused defaults", () => {
    const draft = createWriterDraft({
      id: "primary",
      now: createdAt,
    });

    expect(draft).toEqual({
      id: "primary",
      title: "",
      body: "",
      createdAt,
      updatedAt: createdAt,
      settings: {
        focusMode: false,
        typewriterMode: true,
        fontScale: 1,
        lineHeight: 1.85,
      },
    });
  });

  it("updates draft content without mutating the prior draft", () => {
    const draft = createWriterDraft({
      id: "primary",
      now: createdAt,
    });
    const updatedDraft = updateWriterDraft({
      draft,
      changes: {
        title: "写作空间",
        body: "写下去，直到想法变得清晰。",
      },
      now: "2026-07-23T08:01:00.000Z",
    });

    expect(draft.title).toBe("");
    expect(updatedDraft.title).toBe("写作空间");
    expect(updatedDraft.updatedAt).toBe("2026-07-23T08:01:00.000Z");
  });

  it("counts CJK characters and alphabetic words", () => {
    expect(countWritingUnits("你好 world, 写作 matters.")).toBe(6);
  });

  it("creates a sorted writer library and preserves the legacy primary draft", () => {
    const primaryDraft = createWriterDraft({
      id: "primary",
      now: "2026-07-23T08:00:00.000Z",
    });
    const laterDraft = createWriterDraft({
      id: "later",
      now: "2026-07-23T09:00:00.000Z",
    });
    const summaries = [
      toWriterDraftSummary(primaryDraft),
      toWriterDraftSummary(laterDraft),
    ];

    expect(
      sortWriterDraftsByUpdatedAt(summaries).map((draft) => draft.id),
    ).toEqual(["later", "primary"]);
    expect(
      resolveWriterLibrary({
        library: { activeDraftId: null },
        drafts: [laterDraft, primaryDraft],
      }),
    ).toEqual({ activeDraftId: "primary" });
    expect(
      createWriterLibraryState({
        activeDraftId: "later",
        drafts: summaries,
      }),
    ).toEqual({
      activeDraftId: "later",
      drafts: [toWriterDraftSummary(laterDraft), toWriterDraftSummary(primaryDraft)],
    });
  });

  it("updates immutable draft summaries and provides a fallback label", () => {
    const emptyDraft = createWriterDraft({
      id: "empty",
      now: createdAt,
    });
    const completeDraft = updateWriterDraft({
      draft: createWriterDraft({
        id: "complete",
        now: createdAt,
      }),
      changes: {
        title: "完成的文章",
        body: "你好 world",
      },
      now: "2026-07-23T09:00:00.000Z",
    });
    const emptySummary = toWriterDraftSummary(emptyDraft);
    const completeSummary = toWriterDraftSummary(completeDraft);
    const summaries = upsertWriterDraftSummary({
      draft: completeDraft,
      drafts: [emptySummary],
    });

    expect(getWriterDraftLabel(emptySummary)).toBe("无题");
    expect(completeSummary.writingUnits).toBe(3);
    expect(summaries.map((draft) => draft.id)).toEqual(["complete", "empty"]);
    expect(
      removeWriterDraftSummary({
        draftId: "complete",
        drafts: summaries,
      }),
    ).toEqual([emptySummary]);
  });

  it("serializes an export compatible with the post collection", () => {
    const draft = updateWriterDraft({
      draft: createWriterDraft({
        id: "primary",
        now: createdAt,
      }),
      changes: {
        title: 'A "clear" thought',
        body: "正文",
      },
      now: "2026-07-23T08:01:00.000Z",
    });

    expect(
      toMdx(draft, {
        date: "2026-07-23",
        tags: ["随笔", "writing"],
        draft: true,
      }),
    ).toBe(`---
title: "A \\"clear\\" thought"
date: "2026-07-23"
tags: ["随笔", "writing"]
draft: true
---

正文
`);
    expect(getMdxExportFilename(draft)).toBe("a-clear-thought.mdx");
  });

  it("creates snapshots only after the configured interval", () => {
    expect(
      shouldCreateWriterSnapshot({
        lastSnapshotAt: "2026-07-23T08:00:00.000Z",
        now: "2026-07-23T08:04:59.000Z",
      }),
    ).toBe(false);
    expect(
      shouldCreateWriterSnapshot({
        lastSnapshotAt: "2026-07-23T08:00:00.000Z",
        now: "2026-07-23T08:05:00.000Z",
      }),
    ).toBe(true);
  });
});
