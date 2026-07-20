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
});
