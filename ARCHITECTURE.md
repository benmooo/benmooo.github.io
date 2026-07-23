# Architecture Notes

## Writer Studio

`/studio` is a private, browser-local writing surface. It intentionally bypasses
the public `SiteShell`, is marked `noindex`, and does not appear in navigation.

The writer uses an immutable Zod-validated draft model. IndexedDB is the
persistence boundary; pure draft updates, word counting, snapshots, and MDX
serialization live in `src/features/writer/writer-model.ts`.

Publishing remains explicit: the writer exports an MDX file that can be added to
`content/posts`. This preserves the existing build-time MDX publication pipeline
and avoids an unauthenticated production write API.

Zen mode uses the browser Fullscreen API. It removes browser-visible page chrome
and fades the remaining writer controls until the user intentionally reaches
them.
