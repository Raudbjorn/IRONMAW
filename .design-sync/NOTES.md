# design-sync notes — @svnbjrn/ironmaw (IRONMAW)

## Repo shape (read first)

- **Svelte 5 library; the converter is React-only.** Same bridge as
  `@svnbjrn/design`: the sync ships the real compiled `dist/` behind a thin
  React adapter. `.design-sync/react-adapter/` (committed) builds
  `.design-sync/react-dist/` (gitignored) — a mini-package (`package.json` +
  compiled `index.js` + `index.css` + hand-authored React `index.d.ts`) that
  `cfg.entry` points at. Core: `wrap.js` mounts each dist component via
  Svelte 5 `mount()` with a `$state` props bag (`state.svelte.js` +
  `host.svelte`); React children / named-snippet props are adopted into
  `createRawSnippet`s via React portals into `display:contents` containers.
  `ThemeRoot` (the cfg.provider) reproduces the repo Storybook's frame:
  `data-theme="oxide"` + token background/ink/font.
- **Snippet-prop lists per component** (must mirror the Svelte Props):
  `children` — Text, Heading, Kicker, Button, Link, Stack, Panel, Notice,
  NavBar; `header`/`footer` — Panel; `brand` — NavBar; `action` — Notice;
  `excerpt`/`extra` — DocumentEntry. Everything else is scalar/callback.
- **camelCase aliases** in `wrap.js`: onClick, onChange, onInput, onClose,
  onSubmit, onRemove, onOpen, onCopy, onDismiss, onClear, readOnly.
- **Non-component exports pass through unwrapped**: `REVIEW_STATUS`,
  `reviewStatusCopy`, `sortReviewStatuses`, `contrastRatio`, `brand`, `oxide`,
  `bone`, `editions`, `bearMark`, `BEAR_MARK_WIDTH/HEIGHT`, `bearEmblem`,
  `BEAR_EMBLEM_WIDTH/HEIGHT`. Re-exported from
  dist in `index.js`, hand-typed in `index.d.ts`.
- **The adapter build is `cfg.buildCmd`'s second half** — `pnpm run build`
  (tokens, fonts, assets, svelte-package) then
  `node .design-sync/react-adapter/build.mjs` (vite lib build with the repo's
  own toolchain; also recreates the symlinks below). `pnpm run design-sync:build`
  is the same thing as one script.
- **Editions**: `oxide` (default, `:root`) and `bone` (`[data-theme="bone"]`
  only; no prefers-color-scheme media query by design — the owner selected the
  dark direction, Bone is a proposal). Chromium's light default therefore
  changes nothing; `cfg.provider` still pins `theme: "oxide"`.

## Environment gotchas

- `[GENERAL]` **--node-modules must be `.ds-sync/node_modules`**, not the repo's:
  this Svelte repo has no react; react@18.3.1 + react-dom@18.3.1 are installed
  into `.ds-sync/` for `_vendor/` UMD vendoring. Fresh clone:
  `(cd .ds-sync && npm i && npx playwright install chromium)`
  (`.ds-sync/package.json` is committed: @types/react, esbuild, playwright,
  react, react-dom, ts-morph).
- `[GENERAL]` **Self symlink** `.ds-sync/node_modules/@svnbjrn/ironmaw → ../../..`
  (repo root) makes `tokensPkg`/`tokensGlob` copy `dist/tokens/*.css`.
  `.design-sync/node_modules → ../.ds-sync/node_modules` gives
  `react-dist/index.d.ts` @types/react resolution for the ts-morph dts stage.
  Both are recreated by `build.mjs` (idempotent); both gitignored.
- `[GENERAL]` **pnpm 11 blocks esbuild's postinstall** unless
  `pnpm-workspace.yaml` has `allowBuilds: { esbuild: true }` (committed). The
  old `pnpm.onlyBuiltDependencies` package.json field is ignored by pnpm 11.
- `[GENERAL]` `! story parse failed: … .svelte` noise (one line per
  .stories.svelte) is expected: esbuild can't parse `.stories.svelte`, so
  pairing happens at compare time against the owned previews' export names.
  All 21 previews are owned (`.design-sync/previews/`); the generated tier
  never fires for this repo.
- `[GENERAL]` Foundations stories (Colors, Typography, Geometry) are
  showcase-only, not package exports — excluded via `titleMap` nulls.
  Overview is docs-only MDX and never enters title mapping.
- **Storybook static** (`.design-sync/sb-reference`, gitignored) is built by
  `pnpm exec storybook build -o .design-sync/sb-reference` **from the repo
  root** — the output path is cwd-relative, and a build started from a
  subdirectory lands under that subdirectory.
- `cfg.overrides.*.cardMode: "column"` for Text (long mono line), NavBar
  (full-width shell), SearchField, DocumentEntry and SourceEntry (row
  components that read wrong in a half-width grid cell).
- Story-name → export-name squash: "Icon only" → `IconOnly`, "As link" →
  `AsLink`, "With tick" → `WithTick`, "Active filters" → `ActiveFilters`,
  "Selectable with counts" → `SelectableWithCounts`, "Every stored status" →
  `EveryStoredStatus`, "Unknown value" → `UnknownValue`, "Filter row" →
  `FilterRow`, "On plate" → `OnPlate`, "Gap scale" → `GapScale`,
  "Reader header" → `ReaderHeader`, "Visible label" → `VisibleLabel`,
  "Sources selected" → `SourcesSelected`, "Service unavailable" →
  `ServiceUnavailable`, "Known issues" → `KnownIssues`, "Index refreshed" →
  `IndexRefreshed`, "Wordmark only" → `WordmarkOnly`, "Search, selected" →
  `SearchSelected`, "Same title, long name" → `SameTitleLongName`,
  "Metadata only" → `MetadataOnly`, "Identical content, six locations" →
  `IdenticalContentSixLocations`, "Partial record" → `PartialRecord`,
  "All states" → `AllStates`, "Three tones" → `ThreeTones`.
- The `Mark` full bear and compact emblem are base64 SVG data URLs baked into the bundle —
  `[ASSETS_BLOCKED]` has nothing to fire on; no story loads a remote image.
- `.design-sync/tsconfig.json` exists purely for the EDITOR (quarantines
  previews/*.tsx onto the React types via paths); the pipeline compiles
  previews with esbuild and never reads it.

## Fixes log

- **2026-10-15 re-sync into a NEW project**: the pinned project
  `ba980cbf-…` returned 404 under the current login (deleted, or the first
  sync ran under a different account). On the owner's call, created a fresh
  **IRONMAW** (`1dff7fc2-dd42-4e4d-a56b-0c480c101b40`) and re-pinned. If the
  old project turns up under another account, it's an orphan — delete it.
  Reference storybook rebuilt; Mark/NavBar/Panel re-graded after their
  2026-10-14 story edits (owned previews already mirrored them), Heading and
  StatusLabel spot-checked; 16 carried forward. 21/21 match, receipt clean,
  anchor uploaded.

- **2026-10-14 resource reconciliation**: the supplied compact bear emblem is
  used in small lockups; `Panel terrain` adds the contour and mountain treatment
  for brand surfaces; active NavBar items use the reference's rust underline.
  Added matching owned previews for the new Mark and Panel stories. Re-sync
  and compare are still needed before claiming parity in claude.ai/design.

- **2026-10-13 first sync** into project **IRONMAW**
  (`ba980cbf-2ac8-4f57-90f9-8feabda6459c`, incremental path). 21 components /
  21 owned previews / 70 stories graded `match` from images; nothing skipped,
  nothing `close`.
- `[FONT_MISSING]` on the first validate named the display stack's system
  fallbacks (Bahnschrift, DIN Alternate, Franklin Gothic Medium, Arial
  Narrow) — Rajdhani itself ships. Resolved at the source: `font-display` is
  now `Rajdhani, system-ui, sans-serif` (scale.tokens.json); generic families
  don't trip the check and the fallbacks were decorative.
- **Suture `Default`/`Plain` rendered an invisible seam on BOTH sides**
  (`sb-error: no storybook root content` for Default). Root cause: the plain
  variant is an `<hr>`, whose UA stylesheet sets `overflow: hidden` + a
  border, and the component forced `height: 0`, so the pseudo-element tick
  and line were clipped. Fixed in `Suture.svelte` (`overflow: visible`,
  `height: 2px` / vertical `width: 2px; min-height`). A matching-but-broken
  pair is the compare oracle's blind spot — read the raw render, not just
  the diff, for any component whose whole point is a thin line.
- No overlay components (no Modal/Sheet) — no fixed-position sizing fixes needed.

## Re-sync risks

- **2026-10-15 editor parts (not yet synced).** 24 new components (Icon, Badge,
  Marker, Switch, Avatar, Kbd, ScoreRing, SaveStatus, SegmentedControl,
  SwatchPicker, Menu, SplitButton, ZoomControl, Disclosure, ReorderList,
  IssueCard, AppHeader, Workspace, PageCanvas, PageSheet, PageAnnotation,
  DocHeader, DocSection, DocEntry) plus Button/Input extensions and drawn icons
  replacing unicode glyphs in Notice/StatusLabel/Chip/SearchField/NavBar. All
  have owned previews and adapter entries; none are graded yet. Expect every
  touched component to re-grade. Watch: Menu popup is `position: fixed`
  (overlay → likely `cardMode: "single"` for Menu/SplitButton stories that open
  it); PageCanvas needs a definite-height parent (its previews wrap it);
  Workspace `fill` uses 100dvh (column card); ReorderList `detail` is a
  render-function snippet.
- `Examples/CV editor` is a showcase composition (`src/examples/`, not
  packaged) — excluded via `titleMap: {"CV editor": null}`.

- **Adapter drift**: a new component added to `src/lib/index.ts` must ALSO be
  added to `.design-sync/react-adapter/index.js` (wrap call + snippet-prop
  list) and `index.d.ts` (Props interface), plus an owned preview authored —
  nothing regenerates these. Same for non-component exports. Diff
  `src/lib/index.ts` against the adapter's export list on every re-sync.
- **Snippet-prop drift**: a new Snippet prop on an existing component must be
  added to the wrap() snippetProps list and typed as React.ReactNode —
  otherwise the raw React node is passed to Svelte as a scalar and renders nothing.
- **Owned previews go stale silently when a story is rewritten.** Diff each
  owned preview against its story whenever the story file changes.
- **Token changes** flow through `pnpm run build` (colors.css/scale.css are
  regenerated and copied by `tokensGlob`); the compare oracle catches drift.
- `dist/` and `react-dist/` are gitignored — `buildCmd` must run before the
  converter on every fresh clone.
