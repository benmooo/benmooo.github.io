import { z } from "zod";

export const WriterSettingsSchema = z.object({
  focusMode: z.boolean().default(false),
  typewriterMode: z.boolean().default(true),
  fontScale: z.number().min(0.85).max(1.3).default(1),
  lineHeight: z.number().min(1.5).max(2.2).default(1.85),
});

export type WriterSettings = z.infer<typeof WriterSettingsSchema>;

export const WriterDraftSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  body: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  settings: WriterSettingsSchema,
});

export type WriterDraft = z.infer<typeof WriterDraftSchema>;

export const WriterSnapshotSchema = z.object({
  id: z.string().min(1),
  draftId: z.string().min(1),
  savedAt: z.string().datetime(),
  draft: WriterDraftSchema,
});

export type WriterSnapshot = z.infer<typeof WriterSnapshotSchema>;

export const MdxExportOptionsSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().default(true),
});

export type MdxExportOptions = z.infer<typeof MdxExportOptionsSchema>;

export type CreateWriterDraftInput = {
  id: string;
  now: string;
};

export type WriterDraftChanges = Pick<WriterDraft, "title" | "body"> & {
  settings: WriterSettings;
};

export type UpdateWriterDraftInput = {
  draft: WriterDraft;
  changes: Partial<WriterDraftChanges>;
  now: string;
};

const defaultWriterSettings: WriterSettings = {
  focusMode: false,
  typewriterMode: true,
  fontScale: 1,
  lineHeight: 1.85,
};

const sanitizeFrontmatterValue = (value: string) =>
  value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');

const normalizeTitleForFilename = (title: string) =>
  title
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "untitled";

const createFrontmatter = (
  draft: WriterDraft,
  options: MdxExportOptions,
) => [
  "---",
  `title: "${sanitizeFrontmatterValue(draft.title || "Untitled")}"`,
  `date: "${options.date}"`,
  `tags: [${options.tags.map((tag) => `"${sanitizeFrontmatterValue(tag)}"`).join(", ")}]`,
  `draft: ${options.draft}`,
  "---",
].join("\n");

export const createWriterDraft = ({
  id,
  now,
}: CreateWriterDraftInput): WriterDraft =>
  WriterDraftSchema.parse({
    id,
    title: "",
    body: "",
    createdAt: now,
    updatedAt: now,
    settings: defaultWriterSettings,
  });

export const updateWriterDraft = ({
  draft,
  changes,
  now,
}: UpdateWriterDraftInput): WriterDraft =>
  WriterDraftSchema.parse({
    ...draft,
    ...changes,
    settings: changes.settings
      ? WriterSettingsSchema.parse(changes.settings)
      : draft.settings,
    updatedAt: now,
  });

export const createWriterSnapshot = (
  draft: WriterDraft,
  savedAt: string,
): WriterSnapshot =>
  WriterSnapshotSchema.parse({
    id: `${draft.id}:${savedAt}`,
    draftId: draft.id,
    savedAt,
    draft,
  });

export const countWritingUnits = (content: string) => {
  const cjkCharacterCount = (
    content.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu) ??
    []
  ).length;
  const wordCount = (
    content
      .replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu, " ")
      .match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) ?? []
  ).length;

  return cjkCharacterCount + wordCount;
};

export const toMdx = (
  draft: WriterDraft,
  options: MdxExportOptions,
) => `${createFrontmatter(draft, MdxExportOptionsSchema.parse(options))}\n\n${draft.body.trim()}\n`;

export const getMdxExportFilename = (draft: WriterDraft) =>
  `${normalizeTitleForFilename(draft.title)}.mdx`;

export const shouldCreateWriterSnapshot = ({
  lastSnapshotAt,
  now,
  minimumIntervalMilliseconds = 5 * 60 * 1000,
}: {
  lastSnapshotAt: string | null;
  now: string;
  minimumIntervalMilliseconds?: number;
}) =>
  !lastSnapshotAt ||
  new Date(now).getTime() - new Date(lastSnapshotAt).getTime() >=
    minimumIntervalMilliseconds;
