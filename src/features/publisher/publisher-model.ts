import { z } from "zod";

export const WriterPublicationOptionsSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(80)
    .regex(
      /^[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*$/u,
      "Slug 只能包含文字、数字和连字符。",
    ),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  description: z.string().trim().min(1).max(240).optional(),
  draft: z.boolean().default(false),
});

export type WriterPublicationOptions = z.infer<
  typeof WriterPublicationOptionsSchema
>;

export const WriterPublicationFormOptionsSchema = z.object({
  slug: z
    .string()
    .trim()
    .max(80)
    .regex(
      /^(?:[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*)?$/u,
      "Slug 只能包含文字、数字和连字符。",
    ),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tags: z.array(z.string().trim().min(1).max(40)).max(12).default([]),
  description: z.string().trim().min(1).max(240).optional(),
  draft: z.boolean().default(false),
});

export type WriterPublicationFormOptions = z.infer<
  typeof WriterPublicationFormOptionsSchema
>;

export const PublishedPostSchema = z.object({
  path: z
    .string()
    .regex(/^content\/posts\/[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*\.mdx$/u),
  content: z.string().min(1).max(512 * 1024),
});

export type PublishedPost = z.infer<typeof PublishedPostSchema>;

export const PublishedImageSchema = z.object({
  path: z
    .string()
    .regex(
      /^public\/images\/[\p{L}\p{N}]+(?:-[\p{L}\p{N}]+)*\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(gif|jpg|png|webp)$/u,
    ),
  content: z.string().min(1).max(4 * 1024 * 1024),
  contentType: z.enum(["image/gif", "image/jpeg", "image/png", "image/webp"]),
});

export type PublishedImage = z.infer<typeof PublishedImageSchema>;

export const PublishRequestSchema = z.object({
  post: PublishedPostSchema,
  images: z.array(PublishedImageSchema).max(6),
  commitMessage: z.string().trim().min(1).max(180),
});

export type PublishRequest = z.infer<typeof PublishRequestSchema>;

export const PublishResponseSchema = z.object({
  commitSha: z.string().min(1),
  commitUrl: z.string().url(),
  postUrl: z.string().url().optional(),
});

export type PublishResponse = z.infer<typeof PublishResponseSchema>;

export const PublisherSessionSchema = z.object({
  login: z.string().min(1),
  expiresAt: z.string().datetime(),
});

export type PublisherSession = z.infer<typeof PublisherSessionSchema>;

export const PublisherSessionTokenSchema = z
  .string()
  .startsWith("publisher_session.");

export type PublisherSessionToken = z.infer<
  typeof PublisherSessionTokenSchema
>;

export const PublisherCallbackSchema = z.object({
  errorMessage: z.string().nullable(),
  receivedSession: z.boolean(),
});

export type PublisherCallback = z.infer<typeof PublisherCallbackSchema>;

const sanitizeFrontmatterValue = (value: string) =>
  value.replaceAll("\\", "\\\\").replaceAll('"', '\\"');

const getImageExtension = (contentType: string) =>
  ({
    "image/gif": "gif",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  })[contentType] ?? "image";

export const normalizePublicationSlug = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^\p{L}\p{N}]+/gu, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

export const createWriterPublicationFormOptions = ({
  date,
  title,
}: {
  date: string;
  title: string;
}): WriterPublicationFormOptions =>
  WriterPublicationFormOptionsSchema.parse({
    slug: normalizePublicationSlug(title),
    date,
    tags: [],
    draft: false,
  });

export const getPublishedImagePath = ({
  contentType,
  imageId,
  slug,
}: {
  contentType: string;
  imageId: string;
  slug: string;
}) => `public/images/${slug}/${imageId}.${getImageExtension(contentType)}`;

export const getPublishedImageUrl = (path: string) => `/${path.slice(7)}`;

export const createPublishedMdx = ({
  body,
  options,
  title,
}: {
  body: string;
  options: WriterPublicationOptions;
  title: string;
}) => {
  const frontmatter = [
    "---",
    `title: "${sanitizeFrontmatterValue(title.trim() || "无题")}"`,
    ...(options.description
      ? [`description: "${sanitizeFrontmatterValue(options.description)}"`]
      : []),
    `date: "${options.date}"`,
    `tags: [${options.tags.map((tag) => `"${sanitizeFrontmatterValue(tag)}"`).join(", ")}]`,
    `draft: ${options.draft}`,
    "---",
  ];

  return `${frontmatter.join("\n")}\n\n${body.trim()}\n`;
};

export const replaceWriterImageReferences = ({
  body,
  imageUrlsById,
}: {
  body: string;
  imageUrlsById: Readonly<Record<string, string>>;
}) =>
  body.replace(
    /writer-image:\/\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/giu,
    (reference, imageId: string) => imageUrlsById[imageId] ?? reference,
  );

export const createPublishCommitMessage = (title: string) =>
  `publish: ${title.trim() || "无题"}`;

export const getPublisherSessionStorageKey = () => "writer-publisher-session";
