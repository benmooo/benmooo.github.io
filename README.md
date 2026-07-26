# Write To Think

## Commit workflow

Run `bun run prepare` after cloning to install the repository hooks. The
pre-commit hook runs ESLint only on staged JavaScript and TypeScript files,
applying safe fixes before the commit proceeds.

Configure an AI provider once with `bunx aicommits setup`. Afterwards, use
`git commit` without `-m` to generate a message from the staged diff, then
review or edit it in Git's commit-message editor. Choose the Conventional
format during setup when that format is preferred. Explicit
messages such as `git commit -m "docs: update readme"` are left unchanged.

`bun run commit` is also available for the interactive AICoMmits flow.

## 一键发布

写作页的“发布”按钮会把 MDX 和引用的图片作为一个 Git 提交写入 `main`；
现有 GitHub Actions 随后会构建并部署到 GitHub Pages。草稿和图片仍只保存在
浏览器 IndexedDB，GitHub App 私钥不会进入浏览器或仓库。

### 1. 注册并安装 GitHub App

GitHub App 同时负责两件事：用户授权用于确认发布者身份，安装令牌用于写入仓库；
不需要创建独立 OAuth App。它只申请 Repository Contents 的写入权限。

先重新登录 GitHub CLI：

```sh
gh auth login -h github.com -w
```

然后执行以下命令。脚本会启动一个仅监听本机的回调服务，并打印一个浏览器地址：

```sh
bun run publish-app:register -- \
  --frontend-origin https://benmooo.github.io \
  --gateway-origin https://<你的 Worker 域名>
```

在浏览器确认注册后，将 App 仅安装到 `benmooo/benmooo.github.io`。脚本会把 App ID、
Client ID、Client Secret、PKCS#8 私钥与安装 ID 以本机仅读权限保存到
`services/publish-gateway/.github-app-credentials.json`；该文件已被忽略。

### 2. 配置并部署 Worker

复制 `services/publish-gateway/.dev.vars.example` 为
`services/publish-gateway/.dev.vars`，填写本地调试所需 Secret。生产环境使用
Wrangler Secret，不要提交 `.dev.vars` 或任何 PEM 文件：

```sh
bunx wrangler secret put GITHUB_APP_ID -c services/publish-gateway/wrangler.jsonc
bunx wrangler secret put GITHUB_APP_CLIENT_ID -c services/publish-gateway/wrangler.jsonc
bunx wrangler secret put GITHUB_APP_CLIENT_SECRET -c services/publish-gateway/wrangler.jsonc
bunx wrangler secret put GITHUB_APP_INSTALLATION_ID -c services/publish-gateway/wrangler.jsonc
bunx wrangler secret put GITHUB_APP_PRIVATE_KEY -c services/publish-gateway/wrangler.jsonc
bunx wrangler secret put PUBLISHER_GITHUB_LOGIN -c services/publish-gateway/wrangler.jsonc
bunx wrangler secret put PUBLISHER_SESSION_SECRET -c services/publish-gateway/wrangler.jsonc
bun run publish-gateway:deploy
```

`PUBLISHER_SESSION_SECRET` 应为一个独立、随机且至少 32 字符的值。

### 3. 配置前端

默认网关已经写入前端和部署工作流，无需额外配置即可使用。若将来迁移到其他
Worker，可在 GitHub 仓库的 Actions variables 中设置以下公开变量，然后推送一次
提交触发重新构建：

```text
PUBLISH_GATEWAY_URL=https://<你的 Worker 域名>
```

Worker 的 `FRONTEND_ORIGIN` 必须等于站点实际源（例如
`https://benmooo.github.io`）。`wrangler.jsonc` 中的仓库、分支和站点地址也应
与实际部署保持一致。
