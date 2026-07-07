import path from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

const rootDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      "~": path.resolve(rootDirectory, "src"),
      "content-collections": path.resolve(
        rootDirectory,
        ".content-collections/generated/index.js",
      ),
    },
  },
  test: {
    environment: "node",
    include: ["src/tests/**/*.{test,spec}.{ts,tsx}"],
  },
});
