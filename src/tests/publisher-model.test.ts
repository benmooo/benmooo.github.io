import { describe, expect, it } from "vitest";

import {
  PublishedImageSchema,
  createPublishedMdx,
  getPublishedImagePath,
  getPublishedImageUrl,
  normalizePublicationSlug,
  replaceWriterImageReferences,
} from "~/features/publisher/publisher-model";

const imageId = "f86f1f03-64ef-4b0c-92d6-a1616253f6bd";

describe("publisher model", () => {
  it("normalizes a Chinese slug and converts local image references", () => {
    const slug = normalizePublicationSlug(" 写作，与思考！ ");
    const path = getPublishedImagePath({
      contentType: "image/png",
      imageId,
      slug,
    });

    expect(slug).toBe("写作-与思考");
    expect(path).toBe(`public/images/${slug}/${imageId}.png`);
    expect(
      replaceWriterImageReferences({
        body: `![图片](writer-image://${imageId})`,
        imageUrlsById: { [imageId]: getPublishedImageUrl(path) },
      }),
    ).toBe(`![图片](/images/${slug}/${imageId}.png)`);
  });

  it("creates post content compatible with the post collection", () => {
    expect(
      createPublishedMdx({
        title: 'A "clear" thought',
        body: "正文",
        options: {
          slug: "clear-thought",
          date: "2026-07-26",
          tags: ["随笔"],
          description: "一段摘要",
          draft: false,
        },
      }),
    ).toBe(`---
title: "A \\"clear\\" thought"
description: "一段摘要"
date: "2026-07-26"
tags: ["随笔"]
draft: false
---

正文
`);
  });

  it("rejects paths outside the public image directory", () => {
    expect(() =>
      PublishedImageSchema.parse({
        path: `public/assets/${imageId}.png`,
        content: "aW1hZ2U=",
        contentType: "image/png",
      }),
    ).toThrow();
  });
});
