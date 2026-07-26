import {
  PublisherCallbackSchema,
  PublishResponseSchema,
  PublisherSessionSchema,
  PublisherSessionTokenSchema,
  getPublisherSessionStorageKey,
  type PublisherCallback,
  type PublishRequest,
  type PublishResponse,
  type PublisherSession,
} from "~/features/publisher/publisher-model";
import { getPublishGatewayUrl } from "~/features/publisher/publisher-config";

const getGatewayUrl = (path: string) => `${getPublishGatewayUrl()}${path}`;

const getPublisherSessionToken = () => {
  const token = window.sessionStorage.getItem(getPublisherSessionStorageKey());

  return token ? PublisherSessionTokenSchema.safeParse(token).data ?? null : null;
};

const requestPublisher = async <Result>({
  body,
  method,
  path,
  schema,
}: {
  body?: unknown;
  method: "GET" | "POST";
  path: string;
  schema: { parse: (value: unknown) => Result };
}): Promise<Result> => {
  const sessionToken = getPublisherSessionToken();
  const response = await fetch(getGatewayUrl(path), {
    method,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...(sessionToken ? { authorization: `Bearer ${sessionToken}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const payload: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "message" in payload &&
      typeof payload.message === "string"
        ? payload.message
        : "发布请求失败。";

    throw new Error(message);
  }

  return schema.parse(payload);
};

export const getPublisherSession = () =>
  requestPublisher<PublisherSession | null>({
    method: "GET",
    path: "/session",
    schema: {
      parse: (value) => (value ? PublisherSessionSchema.parse(value) : null),
    },
  });

export const beginPublisherLogin = () => {
  window.location.assign(getGatewayUrl("/auth/login"));
};

const publisherCallbackMessages: Readonly<Record<string, string>> = {
  "github-app-state": "GitHub App 登录验证已失效，请重新连接。",
  "github-app-token": "无法获取 GitHub App 授权，请重新连接。",
  "github-app-user": "无法验证 GitHub 账号，请重新连接。",
  "not-authorized": "当前 GitHub 账号没有发布权限。",
};

export const consumePublisherCallback = (): PublisherCallback | null => {
  const callback = new URLSearchParams(window.location.hash.slice(1));
  const sessionToken = callback.get("publisher_session");
  const errorCode = callback.get("publisher_error");

  if (!sessionToken && !errorCode) {
    return null;
  }

  const parsedSessionToken = sessionToken
    ? PublisherSessionTokenSchema.safeParse(sessionToken)
    : null;

  if (parsedSessionToken?.success) {
    window.sessionStorage.setItem(
      getPublisherSessionStorageKey(),
      parsedSessionToken.data,
    );
  }

  window.history.replaceState(
    window.history.state,
    "",
    `${window.location.pathname}${window.location.search}`,
  );

  return PublisherCallbackSchema.parse({
    errorMessage: errorCode
      ? publisherCallbackMessages[errorCode] ?? "GitHub 授权未完成。"
      : sessionToken && !parsedSessionToken?.success
        ? "发布会话无效，请重新连接 GitHub。"
        : null,
    receivedSession: parsedSessionToken?.success ?? false,
  });
};

export const publishPost = (request: PublishRequest) =>
  requestPublisher<PublishResponse>({
    body: request,
    method: "POST",
    path: "/publish",
    schema: PublishResponseSchema,
  });
