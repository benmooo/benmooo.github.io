import { createPrivateKey, randomUUID } from "node:crypto";
import { execFile } from "node:child_process";
import { createServer } from "node:http";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const currentDirectory = dirname(fileURLToPath(import.meta.url));
const projectDirectory = resolve(currentDirectory, "..");
const credentialPath = resolve(
  projectDirectory,
  "services/publish-gateway/.github-app-credentials.json",
);

const getArgument = (name) => {
  const index = process.argv.indexOf(name);

  return index >= 0 ? process.argv[index + 1] : null;
};

const requireUrlOrigin = (name) => {
  const value = getArgument(name);

  if (!value) {
    throw new Error(`缺少参数：${name}`);
  }

  const url = new URL(value);

  if (!["http:", "https:"].includes(url.protocol) || url.pathname !== "/") {
    throw new Error(`${name} 必须是没有路径的 HTTP(S) 源地址。`);
  }

  return url.origin;
};

const toAppPrivateKey = (privateKey) =>
  createPrivateKey(privateKey)
    .export({ format: "pem", type: "pkcs8" })
    .toString();

const getRequiredString = (value, name) => {
  if (typeof value !== "string" || !value) {
    throw new Error(`GitHub 未返回 ${name}。`);
  }

  return value;
};

const convertManifest = async (code) => {
  const { stdout } = await execFileAsync("gh", [
    "api",
    "--method",
    "POST",
    `/app-manifests/${encodeURIComponent(code)}/conversions`,
  ]);

  return JSON.parse(stdout);
};

const createManifest = ({
  frontendOrigin,
  gatewayOrigin,
  localOrigin,
}) => ({
  name: "benmooo-writer-publisher",
  url: frontendOrigin,
  description: "Publish local Writer Studio drafts to benmooo.github.io.",
  public: false,
  redirect_url: `${localOrigin}/manifest/callback`,
  callback_urls: [`${gatewayOrigin}/auth/callback`],
  setup_url: `${localOrigin}/installation/callback`,
  request_oauth_on_install: false,
  default_permissions: {
    contents: "write",
  },
});

const createStartPage = ({ manifest, state }) => `<!doctype html>
<html lang="zh-CN">
  <meta charset="utf-8">
  <title>注册 GitHub App</title>
  <body>
    <p>正在打开 GitHub App 注册页…</p>
    <form id="manifest-form" action="https://github.com/settings/apps/new" method="post">
      <input name="manifest" type="hidden" value="${escapeHtml(JSON.stringify(manifest))}">
      <input name="state" type="hidden" value="${escapeHtml(state)}">
      <button type="submit">继续注册 GitHub App</button>
    </form>
    <script>document.getElementById("manifest-form").submit()</script>
  </body>
</html>`;

const escapeHtml = (value) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const createResultPage = (content) => `<!doctype html>
<html lang="zh-CN">
  <meta charset="utf-8">
  <title>GitHub App 配置</title>
  <body>${content}</body>
</html>`;

const writeCredentials = async (credentials) => {
  await mkdir(dirname(credentialPath), { recursive: true });
  await writeFile(
    credentialPath,
    `${JSON.stringify(credentials, null, 2)}\n`,
    { encoding: "utf8", mode: 0o600 },
  );
};

const startRegistration = async () => {
  const frontendOrigin = requireUrlOrigin("--frontend-origin");
  const gatewayOrigin = requireUrlOrigin("--gateway-origin");
  const state = randomUUID();
  const registration = {
    app: null,
    installationId: null,
  };
  const server = createServer(async (request, response) => {
    const url = new URL(request.url ?? "/", localOrigin);

    try {
      if (url.pathname === "/start") {
        response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        response.end(createStartPage({ manifest, state }));

        return;
      }

      if (url.pathname === "/manifest/callback") {
        const code = url.searchParams.get("code");
        const receivedState = url.searchParams.get("state");

        if (!code || receivedState !== state) {
          response.writeHead(400, { "content-type": "text/html; charset=utf-8" });
          response.end(createResultPage("<p>注册校验失败，请重新运行脚本。</p>"));

          return;
        }

        const converted = await convertManifest(code);
        const app = {
          appId: getRequiredString(converted.id?.toString(), "App ID"),
          clientId: getRequiredString(converted.client_id, "Client ID"),
          clientSecret: getRequiredString(converted.client_secret, "Client secret"),
          privateKey: toAppPrivateKey(getRequiredString(converted.pem, "private key")),
          slug: getRequiredString(converted.slug, "App slug"),
        };

        registration.app = app;
        await writeCredentials({
          ...app,
          installationId: null,
        });

        const installationUrl = `https://github.com/apps/${app.slug}/installations/new`;

        response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        response.end(
          createResultPage(
            `<p>GitHub App 已注册。请继续安装到目标仓库：</p><p><a href="${installationUrl}">${installationUrl}</a></p>`,
          ),
        );

        return;
      }

      if (url.pathname === "/installation/callback") {
        const installationId = url.searchParams.get("installation_id");

        if (!registration.app || !installationId) {
          response.writeHead(400, { "content-type": "text/html; charset=utf-8" });
          response.end(createResultPage("<p>未收到安装信息。</p>"));

          return;
        }

        registration.installationId = installationId;
        await writeCredentials({
          ...registration.app,
          installationId,
        });
        response.writeHead(200, { "content-type": "text/html; charset=utf-8" });
        response.end(
          createResultPage(
            `<p>安装完成。凭据已以仅本机权限保存到 <code>${credentialPath}</code>。</p><p>可以关闭此页面与终端。</p>`,
          ),
        );
        server.close();

        return;
      }

      response.writeHead(404);
      response.end();
    } catch (error) {
      const message = error instanceof Error ? error.message : "注册失败。";

      response.writeHead(500, { "content-type": "text/html; charset=utf-8" });
      response.end(createResultPage(`<p>${escapeHtml(message)}</p>`));
    }
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();

  if (!address || typeof address === "string") {
    throw new Error("无法创建本地注册回调服务。");
  }

  const localOrigin = `http://127.0.0.1:${address.port}`;
  const manifest = createManifest({
    frontendOrigin,
    gatewayOrigin,
    localOrigin,
  });

  console.log(`请在浏览器打开：${localOrigin}/start`);
  console.log("完成 GitHub App 注册后，脚本会保存凭据并等待安装回调。");
};

void startRegistration().catch((error) => {
  console.error(error instanceof Error ? error.message : "注册失败。");
  process.exitCode = 1;
});
