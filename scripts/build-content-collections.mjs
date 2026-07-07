import path from "node:path";
import { fileURLToPath } from "node:url";

import { createBuilder } from "@content-collections/core";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirectory = path.dirname(currentFilePath);
const configurationPath = path.resolve(
  currentDirectory,
  "../content-collections.ts",
);

const builder = await createBuilder(configurationPath);

await builder.build();
