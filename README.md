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
