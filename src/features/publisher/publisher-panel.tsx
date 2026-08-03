import { useEffect, useMemo, useState } from "react";

import {
  beginPublisherLogin,
  getPublisherSession,
  publishPost,
} from "~/features/publisher/publisher-client";
import {
  PublishRequestSchema,
  WriterPublicationFormOptionsSchema,
  WriterPublicationOptionsSchema,
  createWriterPublicationFormOptions,
  createPublishCommitMessage,
  createPublishedMdx,
  getPublishedImagePath,
  getPublishedImageUrl,
  normalizePublicationSlug,
  replaceWriterImageReferences,
  type PublishResponse,
  type PublisherSession,
  type WriterPublicationFormOptions,
} from "~/features/publisher/publisher-model";
import {
  getWriterImageIds,
  type WriterDraft,
  type WriterImage,
} from "~/features/writer/writer-model";

type PublishState = "idle" | "loading" | "publishing" | "success" | "error";

type PublisherPanelProps = {
  callbackError: string | null;
  draft: WriterDraft;
  images: readonly WriterImage[];
  onClose: () => void;
  onPublished: (result: PublishResponse) => void;
};

const toToday = () => new Date().toISOString().slice(0, 10);

const splitTags = (value: string) =>
  value
    .split(/[，,]/)
    .map((tag) => tag.trim())
    .filter(Boolean);

const toBase64 = async (blob: Blob) => {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return window.btoa(binary);
};

const createInitialOptions = (
  draft: WriterDraft,
): WriterPublicationFormOptions =>
  createWriterPublicationFormOptions({
    date: toToday(),
    title: draft.title,
  });

const getMissingImageIds = ({
  body,
  images,
}: {
  body: string;
  images: readonly WriterImage[];
}) => {
  const availableImageIds = new Set(images.map((image) => image.id));

  return getWriterImageIds(body).filter((imageId) => !availableImageIds.has(imageId));
};

export function PublisherPanel({
  callbackError,
  draft,
  images,
  onClose,
  onPublished,
}: PublisherPanelProps) {
  const [options, setOptions] = useState(() => createInitialOptions(draft));
  const [tagsInput, setTagsInput] = useState("");
  const [session, setSession] = useState<PublisherSession | null>(null);
  const [state, setState] = useState<PublishState>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(
    callbackError,
  );
  const [result, setResult] = useState<PublishResponse | null>(null);

  const usedImageIds = useMemo(() => getWriterImageIds(draft.body), [draft.body]);
  const imagesById = useMemo(
    () => new Map(images.map((image) => [image.id, image])),
    [images],
  );
  const missingImageIds = useMemo(
    () => getMissingImageIds({ body: draft.body, images }),
    [draft.body, images],
  );

  useEffect(() => {
    let isMounted = true;

    void getPublisherSession()
      .then((nextSession) => {
        if (!isMounted) {
          return;
        }

        setSession(nextSession);
        setState("idle");
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setState("error");
          setErrorMessage(
            error instanceof Error ? error.message : "无法连接发布网关。",
          );
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setErrorMessage(callbackError);
  }, [callbackError]);

  const updateOptions = (changes: Partial<WriterPublicationFormOptions>) =>
    setOptions((currentOptions) =>
      WriterPublicationFormOptionsSchema.parse({
        ...currentOptions,
        ...changes,
      }),
    );

  const publish = async () => {
    setState("publishing");
    setErrorMessage(null);

    try {
      const parsedOptions = WriterPublicationOptionsSchema.parse({
        ...options,
        tags: splitTags(tagsInput),
      });
      const publishedImages = usedImageIds.map((imageId) => {
        const image = imagesById.get(imageId);

        if (!image) {
          throw new Error("有图片尚未保存到本地图片库。");
        }

        const path = getPublishedImagePath({
          contentType: image.contentType,
          imageId: image.id,
          slug: parsedOptions.slug,
        });

        return {
          image,
          path,
        };
      });
      const imageUrlsById = Object.fromEntries(
        publishedImages.map(({ image, path }) => [
          image.id,
          getPublishedImageUrl(path),
        ]),
      );
      const request = PublishRequestSchema.parse({
        post: {
          path: `content/posts/${parsedOptions.slug}.mdx`,
          content: createPublishedMdx({
            title: draft.title,
            body: replaceWriterImageReferences({
              body: draft.body,
              imageUrlsById,
            }),
            options: parsedOptions,
          }),
        },
        images: await Promise.all(
          publishedImages.map(async ({ image, path }) => ({
            path,
            content: await toBase64(image.blob),
            contentType: image.contentType,
          })),
        ),
        commitMessage: createPublishCommitMessage(draft.title),
      });
      const publishResult = await publishPost(request);

      setResult(publishResult);
      setState("success");
      onPublished(publishResult);
    } catch (error) {
      setState("error");
      setErrorMessage(error instanceof Error ? error.message : "发布失败。");
    }
  };

  const isPublishDisabled =
    state === "publishing" ||
    !session ||
    !draft.title.trim() ||
    !draft.body.trim() ||
    !options.slug ||
    missingImageIds.length > 0;

  return (
    <aside aria-label="发布文章" className="writer-publisher">
      <header className="writer-publisher-header">
        <div>
          <p>发布到博客</p>
          <small>将文章与图片作为一个提交写入 main</small>
        </div>
        <button className="writer-action" onClick={onClose} type="button">
          关闭
        </button>
      </header>

      {state === "loading" ? <p>正在检查发布授权…</p> : null}

      {state !== "loading" && !session ? (
        <section className="writer-publisher-auth">
          <p>登录 GitHub 后即可一键发布到已授权的博客仓库。</p>
          <button
            className="writer-publisher-primary"
            onClick={() => void beginPublisherLogin()}
            type="button"
          >
            连接 GitHub
          </button>
        </section>
      ) : null}

      {session ? (
        <div className="writer-publisher-form">
          <p className="writer-publisher-account">已连接：@{session.login}</p>
          <label>
            Slug
            <input
              onChange={(event) =>
                updateOptions({
                  slug: normalizePublicationSlug(event.target.value),
                })
              }
              value={options.slug}
            />
          </label>
          <label>
            日期
            <input
              onChange={(event) => updateOptions({ date: event.target.value })}
              type="date"
              value={options.date}
            />
          </label>
          <label>
            标签
            <input
              onChange={(event) => setTagsInput(event.target.value)}
              placeholder="随笔, 写作"
              value={tagsInput}
            />
          </label>
          <label>
            摘要（可选）
            <textarea
              maxLength={240}
              onChange={(event) =>
                updateOptions({
                  description: event.target.value.trim() || undefined,
                })
              }
              value={options.description ?? ""}
            />
          </label>
          <label className="writer-toggle">
            <input
              checked={options.draft}
              onChange={(event) => updateOptions({ draft: event.target.checked })}
              type="checkbox"
            />
            <span>作为草稿提交（不在博客公开显示）</span>
          </label>
          <p className="writer-publisher-summary">
            本次提交：1 篇文章，{usedImageIds.length} 张图片。
          </p>
          {missingImageIds.length > 0 ? (
            <p className="writer-publisher-error">
              有 {missingImageIds.length} 张图片缺失，无法安全发布。
            </p>
          ) : null}
          <button
            className="writer-publisher-primary"
            disabled={isPublishDisabled}
            onClick={() => void publish()}
            type="button"
          >
            {state === "publishing" ? "正在创建提交…" : "发布到博客"}
          </button>
        </div>
      ) : null}

      {errorMessage ? (
        <p className="writer-publisher-error">{errorMessage}</p>
      ) : null}

      {state === "success" && result ? (
        <section className="writer-publisher-success">
          <p>已提交，GitHub Actions 正在构建并部署。</p>
          <a href={result.commitUrl} rel="noreferrer" target="_blank">
            查看提交
          </a>
          {result.postUrl ? (
            <a href={result.postUrl} rel="noreferrer" target="_blank">
              查看文章
            </a>
          ) : null}
        </section>
      ) : null}
    </aside>
  );
}
