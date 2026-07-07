import { existsSync, readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

describe("legacy nextjs cleanup", () => {
  it("removes obsolete nextjs files and config references", () => {
    expect(existsSync("next-env.d.ts")).toBe(false);
    expect(existsSync("eslint.config.mjs")).toBe(false);
    expect(existsSync(".next")).toBe(false);
    expect(existsSync("out")).toBe(false);
    expect(existsSync("src/app")).toBe(false);

    const eslintConfig = readFileSync("eslint.config.js", "utf8");
    const gitignore = readFileSync(".gitignore", "utf8");

    expect(eslintConfig.includes(".next/**")).toBe(false);
    expect(eslintConfig.includes("next/core-web-vitals")).toBe(false);
    expect(eslintConfig.includes("next/typescript")).toBe(false);
    expect(gitignore.includes("/.next/")).toBe(false);
    expect(gitignore.includes("/out/")).toBe(false);
    expect(gitignore.includes("next-env.d.ts")).toBe(false);
  });
});
