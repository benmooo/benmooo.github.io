import {
  PublishRequestSchema,
  type PublishRequest,
} from "../../../src/features/publisher/publisher-model";

type PublishGatewayEnvironment = {
  FRONTEND_ORIGIN: string;
  GITHUB_APP_ID: string;
  GITHUB_APP_CLIENT_ID: string;
  GITHUB_APP_CLIENT_SECRET: string;
  GITHUB_APP_INSTALLATION_ID: string;
  GITHUB_APP_PRIVATE_KEY: string;
  GITHUB_BRANCH: string;
  GITHUB_OWNER: string;
  GITHUB_REPOSITORY: string;
  PUBLIC_SITE_URL?: string;
  PUBLISHER_GITHUB_LOGIN: string;
  PUBLISHER_SESSION_SECRET: string;
};

type WorkerModule<Environment> = {
  fetch: (
    request: Request,
    environment: Environment,
  ) => Response | Promise<Response>;
};

type PublisherSession = {
  expiresAt: string;
  login: string;
};

type CorsHeaders = Record<string, string>;

type GitHubReference = {
  object: {
    sha: string;
  };
};

type GitHubCommit = {
  tree: {
    sha: string;
  };
};

type GitHubBlob = {
  sha: string;
};

type GitHubTree = {
  sha: string;
};

type GitHubCreatedCommit = {
  sha: string;
};

type GitHubUserAccessToken = {
  access_token: string;
};

type GitHubUser = {
  login: string;
};

class PublishConflictError extends Error {}

const githubApiUrl = "https://api.github.com";
const githubAuthorizationUrl = "https://github.com/login/oauth";
const githubApiVersion = "2022-11-28";
const maximumPublishBodyBytes = 25 * 1024 * 1024;
const maximumPublishedImageBytes = 3 * 1024 * 1024;
const maximumPublishedImagesBytes = 18 * 1024 * 1024;
const sessionDurationMilliseconds = 8 * 60 * 60 * 1000;
const authorizationStateDurationSeconds = 10 * 60;
const sessionTokenPrefix = "publisher_session";
const authorizationStateCookieName = "publisher_authorization_state";

const toBase64Url = (value: ArrayBuffer | string) => {
  const bytes =
    typeof value === "string"
      ? new TextEncoder().encode(value)
      : new Uint8Array(value);
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
};

const fromBase64 = (value: string) => {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

const fromBase64Url = (value: string) => {
  const paddingLength = (4 - (value.length % 4)) % 4;
  const paddedValue =
    value.replaceAll("-", "+").replaceAll("_", "/") +
    "=".repeat(paddingLength);
  const binary = atob(paddedValue);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

const encodeJson = (value: unknown) => toBase64Url(JSON.stringify(value));

const decodeJson = <Value>(value: string): Value =>
  JSON.parse(new TextDecoder().decode(fromBase64Url(value))) as Value;

const getCookieValue = (request: Request, name: string) =>
  request.headers
    .get("cookie")
    ?.split(";")
    .map((part) => part.trim().split("="))
    .find(([cookieName]) => cookieName === name)
    ?.slice(1)
    .join("=") ?? null;

const createCookie = ({
  maxAge,
  name,
  value,
}: {
  maxAge: number;
  name: string;
  value: string;
}) =>
  [
    `${name}=${value}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    "SameSite=Lax",
    `Max-Age=${maxAge}`,
  ].join("; ");

const getCorsHeaders = (
  request: Request,
  environment: PublishGatewayEnvironment,
): CorsHeaders | null => {
  const origin = request.headers.get("origin");

  if (origin && origin !== environment.FRONTEND_ORIGIN) {
    return null;
  }

  return origin
    ? {
        "access-control-allow-headers": "authorization, content-type",
        "access-control-allow-methods": "GET, POST, OPTIONS",
        "access-control-allow-origin": origin,
        vary: "Origin",
      }
      : {};
};

const createJsonResponse = ({
  body,
  environment,
  request,
  status = 200,
}: {
  body: unknown;
  environment: PublishGatewayEnvironment;
  request: Request;
  status?: number;
}) => {
  const corsHeaders = getCorsHeaders(request, environment);

  if (!corsHeaders) {
    return new Response(null, { status: 403 });
  }

  return Response.json(body, {
    headers: corsHeaders,
    status,
  });
};

const createErrorResponse = ({
  environment,
  message,
  request,
  status,
}: {
  environment: PublishGatewayEnvironment;
  message: string;
  request: Request;
  status: number;
}) =>
  createJsonResponse({
    body: { message },
    environment,
    request,
    status,
  });

const createFrontendRedirect = ({
  environment,
  key,
  value,
}: {
  environment: PublishGatewayEnvironment;
  key: string;
  value: string;
}) => {
  const url = new URL("/studio", environment.FRONTEND_ORIGIN);

  url.hash = new URLSearchParams([[key, value]]).toString();

  return url;
};

const getSessionSigningKey = async (environment: PublishGatewayEnvironment) =>
  crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(environment.PUBLISHER_SESSION_SECRET),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"],
  );

const signSessionPayload = async ({
  environment,
  payload,
}: {
  environment: PublishGatewayEnvironment;
  payload: PublisherSession;
}) => {
  const encodedPayload = encodeJson(payload);
  const signature = await crypto.subtle.sign(
    "HMAC",
    await getSessionSigningKey(environment),
    new TextEncoder().encode(encodedPayload),
  );

  return `${sessionTokenPrefix}.${encodedPayload}.${toBase64Url(signature)}`;
};

const readPublisherSession = async ({
  environment,
  request,
}: {
  environment: PublishGatewayEnvironment;
  request: Request;
}): Promise<PublisherSession | null> => {
  const authorization = request.headers.get("authorization");
  const token = authorization?.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : null;

  if (!token) {
    return null;
  }

  const [prefix, encodedPayload, encodedSignature, ...extraParts] =
    token.split(".");

  if (
    prefix !== sessionTokenPrefix ||
    !encodedPayload ||
    !encodedSignature ||
    extraParts.length > 0
  ) {
    return null;
  }

  try {
    const isValid = await crypto.subtle.verify(
      "HMAC",
      await getSessionSigningKey(environment),
      fromBase64Url(encodedSignature),
      new TextEncoder().encode(encodedPayload),
    );

    if (!isValid) {
      return null;
    }

    const session = decodeJson<PublisherSession>(encodedPayload);
    const isAuthorizedPublisher =
      session.login === environment.PUBLISHER_GITHUB_LOGIN;
    const isExpired = new Date(session.expiresAt).getTime() <= Date.now();

    return !isAuthorizedPublisher || isExpired ? null : session;
  } catch {
    return null;
  }
};

const createGitHubAppJwt = async (environment: PublishGatewayEnvironment) => {
  const now = Math.floor(Date.now() / 1000);
  const unsignedToken = [
    encodeJson({ alg: "RS256", typ: "JWT" }),
    encodeJson({
      exp: now + 9 * 60,
      iat: now - 60,
      iss: environment.GITHUB_APP_ID,
    }),
  ].join(".");
  const privateKey = environment.GITHUB_APP_PRIVATE_KEY.replaceAll("\\n", "\n");

  if (
    !privateKey.includes("-----BEGIN PRIVATE KEY-----") ||
    !privateKey.includes("-----END PRIVATE KEY-----")
  ) {
    throw new Error("GitHub App 私钥必须使用 PKCS#8 PEM 格式。");
  }

  const encodedPrivateKey = privateKey
    .replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----/gu, "")
    .replace(/\s/gu, "");
  const signature = await crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    await crypto.subtle.importKey(
      "pkcs8",
      fromBase64(encodedPrivateKey),
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    ),
    new TextEncoder().encode(unsignedToken),
  );

  return `${unsignedToken}.${toBase64Url(signature)}`;
};

const getInstallationToken = async (environment: PublishGatewayEnvironment) => {
  const response = await fetch(
    `${githubApiUrl}/app/installations/${environment.GITHUB_APP_INSTALLATION_ID}/access_tokens`,
    {
      method: "POST",
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${await createGitHubAppJwt(environment)}`,
        "user-agent": "benmooo-publish-gateway",
        "x-github-api-version": githubApiVersion,
      },
    },
  );

  if (!response.ok) {
    throw new Error("无法获取 GitHub App 安装令牌。");
  }

  const payload = (await response.json()) as { token: string };

  return payload.token;
};

const requestGitHub = async <Result>({
  accessToken,
  body,
  method,
  path,
}: {
  accessToken: string;
  body?: unknown;
  method: "GET" | "PATCH" | "POST";
  path: string;
}): Promise<Result> => {
  const response = await fetch(`${githubApiUrl}${path}`, {
    method,
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${accessToken}`,
      ...(body ? { "content-type": "application/json" } : {}),
      "user-agent": "benmooo-publish-gateway",
      "x-github-api-version": githubApiVersion,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    if (response.status === 422 && method === "PATCH") {
      throw new PublishConflictError();
    }

    throw new Error(`GitHub 写入失败（${response.status}）。`);
  }

  return (await response.json()) as Result;
};

const getRepositoryPath = (environment: PublishGatewayEnvironment) =>
  `/repos/${environment.GITHUB_OWNER}/${environment.GITHUB_REPOSITORY}`;

const getPostSlug = (path: string) =>
  path.slice("content/posts/".length, -".mdx".length);

const imageContentTypeExtensions = {
  "image/gif": "gif",
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

const assertPublishRequest = (request: PublishRequest) => {
  const slug = getPostSlug(request.post.path);
  const imagePathPrefix = `public/images/${slug}/`;
  const paths = [request.post.path, ...request.images.map((image) => image.path)];
  const uniquePaths = new Set(paths);

  if (uniquePaths.size !== paths.length) {
    throw new Error("发布文件路径不能重复。");
  }

  if (!request.images.every((image) => image.path.startsWith(imagePathPrefix))) {
    throw new Error("图片路径必须属于当前文章。");
  }

  if (
    !request.images.every((image) =>
      image.path.endsWith(`.${imageContentTypeExtensions[image.contentType]}`),
    )
  ) {
    throw new Error("图片扩展名与内容类型不一致。");
  }

  const imageByteSizes = request.images.map((image) => {
    let bytes: Uint8Array;

    try {
      bytes = fromBase64(image.content);
    } catch {
      throw new Error("图片内容不是有效的 Base64 数据。");
    }

    if (bytes.byteLength > maximumPublishedImageBytes) {
      throw new Error("单张图片超过 3 MB 限制。");
    }

    return bytes.byteLength;
  });

  if (
    imageByteSizes.reduce((total, size) => total + size, 0) >
    maximumPublishedImagesBytes
  ) {
    throw new Error("图片总大小超过 18 MB 限制。");
  }
};

const createCommitAtHead = async ({
  accessToken,
  environment,
  request,
}: {
  accessToken: string;
  environment: PublishGatewayEnvironment;
  request: PublishRequest;
}) => {
  const repositoryPath = getRepositoryPath(environment);
  const reference = await requestGitHub<GitHubReference>({
    accessToken,
    method: "GET",
    path: `${repositoryPath}/git/ref/heads/${environment.GITHUB_BRANCH}`,
  });
  const parentCommit = await requestGitHub<GitHubCommit>({
    accessToken,
    method: "GET",
    path: `${repositoryPath}/git/commits/${reference.object.sha}`,
  });
  const postBlob = await requestGitHub<GitHubBlob>({
    accessToken,
    body: {
      content: request.post.content,
      encoding: "utf-8",
    },
    method: "POST",
    path: `${repositoryPath}/git/blobs`,
  });
  const imageBlobs = await Promise.all(
    request.images.map(async (image) => ({
      image,
      blob: await requestGitHub<GitHubBlob>({
        accessToken,
        body: {
          content: image.content,
          encoding: "base64",
        },
        method: "POST",
        path: `${repositoryPath}/git/blobs`,
      }),
    })),
  );
  const tree = await requestGitHub<GitHubTree>({
    accessToken,
    body: {
      base_tree: parentCommit.tree.sha,
      tree: [
        {
          mode: "100644",
          path: request.post.path,
          sha: postBlob.sha,
          type: "blob",
        },
        ...imageBlobs.map(({ blob, image }) => ({
          mode: "100644",
          path: image.path,
          sha: blob.sha,
          type: "blob",
        })),
      ],
    },
    method: "POST",
    path: `${repositoryPath}/git/trees`,
  });
  const commit = await requestGitHub<GitHubCreatedCommit>({
    accessToken,
    body: {
      message: request.commitMessage,
      parents: [reference.object.sha],
      tree: tree.sha,
    },
    method: "POST",
    path: `${repositoryPath}/git/commits`,
  });

  await requestGitHub<GitHubReference>({
    accessToken,
    body: {
      force: false,
      sha: commit.sha,
    },
    method: "PATCH",
    path: `${repositoryPath}/git/refs/heads/${environment.GITHUB_BRANCH}`,
  });

  return commit.sha;
};

const publishToGitHub = async ({
  environment,
  request,
}: {
  environment: PublishGatewayEnvironment;
  request: PublishRequest;
}) => {
  const accessToken = await getInstallationToken(environment);

  for (const attempt of [0, 1]) {
    try {
      return await createCommitAtHead({
        accessToken,
        environment,
        request,
      });
    } catch (error) {
      if (!(error instanceof PublishConflictError) || attempt === 1) {
        throw error;
      }
    }
  }

  throw new Error("无法创建发布提交。");
};

const handleGitHubAppLogin = (
  request: Request,
  environment: PublishGatewayEnvironment,
) => {
  const state = crypto.randomUUID();
  const redirectUrl = new URL(`${githubAuthorizationUrl}/authorize`);

  redirectUrl.search = new URLSearchParams({
    client_id: environment.GITHUB_APP_CLIENT_ID,
    redirect_uri: new URL("/auth/callback", request.url).toString(),
    state,
  }).toString();

  return new Response(null, {
    headers: {
      location: redirectUrl.toString(),
      "set-cookie": createCookie({
        maxAge: authorizationStateDurationSeconds,
        name: authorizationStateCookieName,
        value: state,
      }),
    },
    status: 302,
  });
};

const handleGitHubAppCallback = async (
  request: Request,
  environment: PublishGatewayEnvironment,
) => {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const expectedState = getCookieValue(request, authorizationStateCookieName);
  const clearStateCookie = createCookie({
    maxAge: 0,
    name: authorizationStateCookieName,
    value: "",
  });

  if (!code || !state || state !== expectedState) {
    return new Response(null, {
      headers: {
        location: createFrontendRedirect({
          environment,
          key: "publisher_error",
          value: "github-app-state",
        }).toString(),
        "set-cookie": clearStateCookie,
      },
      status: 302,
    });
  }

  const tokenResponse = await fetch(
    `${githubAuthorizationUrl}/access_token`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({
        client_id: environment.GITHUB_APP_CLIENT_ID,
        client_secret: environment.GITHUB_APP_CLIENT_SECRET,
        code,
      }),
    },
  );

  if (!tokenResponse.ok) {
    return new Response(null, {
      headers: {
        location: createFrontendRedirect({
          environment,
          key: "publisher_error",
          value: "github-app-token",
        }).toString(),
        "set-cookie": clearStateCookie,
      },
      status: 302,
    });
  }

  const token = (await tokenResponse.json()) as GitHubUserAccessToken;
  const userResponse = await fetch(`${githubApiUrl}/user`, {
    headers: {
      accept: "application/vnd.github+json",
      authorization: `Bearer ${token.access_token}`,
      "user-agent": "benmooo-publish-gateway",
      "x-github-api-version": githubApiVersion,
    },
  });

  if (!userResponse.ok) {
    return new Response(null, {
      headers: {
        location: createFrontendRedirect({
          environment,
          key: "publisher_error",
          value: "github-app-user",
        }).toString(),
        "set-cookie": clearStateCookie,
      },
      status: 302,
    });
  }

  const user = (await userResponse.json()) as GitHubUser;

  if (user.login !== environment.PUBLISHER_GITHUB_LOGIN) {
    return new Response(null, {
      headers: {
        location: createFrontendRedirect({
          environment,
          key: "publisher_error",
          value: "not-authorized",
        }).toString(),
        "set-cookie": clearStateCookie,
      },
      status: 302,
    });
  }

  const session = {
    expiresAt: new Date(Date.now() + sessionDurationMilliseconds).toISOString(),
    login: user.login,
  };
  const sessionToken = await signSessionPayload({
    environment,
    payload: session,
  });

  return new Response(null, {
    headers: {
      location: createFrontendRedirect({
        environment,
        key: "publisher_session",
        value: sessionToken,
      }).toString(),
      "set-cookie": clearStateCookie,
    },
    status: 302,
  });
};

const handleRequest = async (
  request: Request,
  environment: PublishGatewayEnvironment,
) => {
  const url = new URL(request.url);
  const corsHeaders = getCorsHeaders(request, environment);

  if (!corsHeaders) {
    return new Response(null, { status: 403 });
  }

  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  if (request.method === "GET" && url.pathname === "/auth/login") {
    return handleGitHubAppLogin(request, environment);
  }

  if (request.method === "GET" && url.pathname === "/auth/callback") {
    return handleGitHubAppCallback(request, environment);
  }

  if (request.method === "GET" && url.pathname === "/session") {
    const session = await readPublisherSession({ environment, request });

    return createJsonResponse({
      body: session,
      environment,
      request,
    });
  }

  if (request.method === "POST" && url.pathname === "/publish") {
    const contentLength = Number(request.headers.get("content-length") ?? 0);

    if (contentLength > maximumPublishBodyBytes) {
      return createErrorResponse({
        environment,
        message: "文章和图片总大小超过发布限制。",
        request,
        status: 413,
      });
    }

    const session = await readPublisherSession({ environment, request });

    if (!session) {
      return createErrorResponse({
        environment,
        message: "发布授权已过期，请重新连接 GitHub。",
        request,
        status: 401,
      });
    }

    try {
      const requestBody = await request.text();
      const requestBytes = new TextEncoder().encode(requestBody).byteLength;

      if (requestBytes > maximumPublishBodyBytes) {
        return createErrorResponse({
          environment,
          message: "文章和图片总大小超过发布限制。",
          request,
          status: 413,
        });
      }

      const publishRequest = PublishRequestSchema.parse(JSON.parse(requestBody));

      assertPublishRequest(publishRequest);

      const commitSha = await publishToGitHub({
        environment,
        request: publishRequest,
      });
      const postUrl = environment.PUBLIC_SITE_URL
        ? new URL(
            `/blog/${getPostSlug(publishRequest.post.path)}`,
            environment.PUBLIC_SITE_URL,
          ).toString()
        : undefined;

      return createJsonResponse({
        body: {
          commitSha,
          commitUrl: `https://github.com/${environment.GITHUB_OWNER}/${environment.GITHUB_REPOSITORY}/commit/${commitSha}`,
          postUrl,
        },
        environment,
        request,
        status: 201,
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "无法创建发布提交。";
      const status = error instanceof PublishConflictError ? 409 : 400;

      return createErrorResponse({
        environment,
        message,
        request,
        status,
      });
    }
  }

  return createErrorResponse({
    environment,
    message: "找不到请求的发布接口。",
    request,
    status: 404,
  });
};

export default {
  fetch: (request, environment) => handleRequest(request, environment),
} satisfies WorkerModule<PublishGatewayEnvironment>;
