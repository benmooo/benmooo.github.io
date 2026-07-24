import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(
  fileURLToPath(new URL("../styles/app.css", import.meta.url)),
  "utf8",
);

describe("site system theme", () => {
  it("defines semantic tokens for browser-preferred dark mode", () => {
    expect(stylesheet).toContain("color-scheme: light dark");
    expect(stylesheet).toContain("@media (prefers-color-scheme: dark)");
    expect(stylesheet).toContain("--canvas: #181412");
    expect(stylesheet).toContain("--paper: #211c18");
    expect(stylesheet).toContain("--ink: #f4ece2");
    expect(stylesheet).toContain("--border: rgba(244, 236, 226, 0.14)");
  });

  it("self-hosts LXGW WenKai for writing and reading surfaces", () => {
    expect(stylesheet).toContain('font-family: "LXGW WenKai"');
    expect(stylesheet).toContain(
      '@fontsource/lxgw-wenkai/files/lxgw-wenkai-latin-500-normal.woff2',
    );
    expect(stylesheet).toContain("--font-reading: \"LXGW WenKai\"");
    expect(stylesheet).toContain("--writer-font: var(--font-reading)");
    expect(stylesheet).toContain(".reflective-prose");
    expect(stylesheet).toContain(".post-prose");
  });

  it("maps Typography prose variables to the semantic site palette", () => {
    expect(stylesheet).toContain(".prose-semantic");
    expect(stylesheet).toContain("--tw-prose-body: var(--ink)");
    expect(stylesheet).toContain("--tw-prose-headings: var(--ink)");
    expect(stylesheet).toContain("--tw-prose-bullets: var(--muted)");
    expect(stylesheet).toContain("--tw-prose-th-borders: var(--border-strong)");
    expect(stylesheet).toContain("--tw-prose-td-borders: var(--border)");
  });
});
