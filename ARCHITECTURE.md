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

Writer Studio stores every document as an independent IndexedDB draft. A small
library record tracks the active draft; the existing `primary` draft remains
valid and becomes the initially selected document when the library first opens.
Deleting a draft also removes its snapshots in the same transaction.

## Reading Typography

Writer Studio, its Markdown preview, and public post titles and prose use a
locally bundled LXGW WenKai webfont. The font is referenced through
`@fontsource/lxgw-wenkai`, so readers do not depend on a third-party font
service. The required SIL Open Font License 1.1 notice is available at
`public/LXGW-WenKai-OFL.txt`.

Navigation, metadata, and controls retain the system sans-serif stack. Code and
preformatted content retain the existing monospace stack.
