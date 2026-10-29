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
  `excerpt`/`extra` — DocumentEntry; `children`/`footer` — Dialog;
  `children`/`actions` — EmptyState; `children` — ChangeMark; `end` —
  StatusBar. Everything else is scalar/callback. (Round-1 editor parts list
  theirs in `react-adapter/index.js`.)
- **camelCase aliases** in `wrap.js`: onClick, onChange, onInput, onClose,
  onSubmit, onRemove, onOpen, onCopy, onDismiss, onClear, readOnly.
- **Non-component exports pass through unwrapped**: `REVIEW_STATUS`,
  `reviewStatusCopy`, `sortReviewStatuses`, `contrastRatio`, `brand`, `oxide`,
  `bone`, `editions`, `bearMark`, `BEAR_MARK_WIDTH/HEIGHT`, `ICONS`,
  `ICON_NAMES`, `iconStroke`. Re-exported from
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
  `.ds-sync/` is gitignored (nothing in it is committed), so a fresh clone
  recreates it: stage the scripts (skill §2.4 `cp -r` line), then
  `(cd .ds-sync && echo '{"name":"ds-sync-deps","private":true}' > package.json && npm i esbuild ts-morph @types/react playwright react@18.3.1 react-dom@18.3.1 && npx playwright install chromium)`.
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
- `[GENERAL]` `[TITLE_UNMAPPED] … dropped: CVeditor` is expected: the
  "CV editor" showcase story is excluded on purpose (`titleMap` null), and
  the converter reports the squashed title before applying the map.
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
  "Metadata only" → `MetadataOnly`, "Identical content, three locations" →
  `IdenticalContentThreeLocations`, "Partial record" → `PartialRecord`,
  "All states" → `AllStates`, "Three tones" → `ThreeTones`.
- The `Mark` full bear is a base64 SVG data URL baked into the bundle (the
  favicon emblem was removed from the library on 2026-10-15) —
  `[ASSETS_BLOCKED]` has nothing to fire on; no story loads a remote image.
- `.design-sync/tsconfig.json` exists purely for the EDITOR (quarantines
  previews/*.tsx onto the React types via paths); the pipeline compiles
  previews with esbuild and never reads it.

## Fixes log

- **2026-10-29 (later) re-adopted the original project.** After
  `/design-login`, `ba980cbf-…` resolves again and `1dff7fc2-…` 404s — the
  two projects live under **different claude.ai accounts**, and which one a
  sync sees depends on the session's login. On the owner's call, re-pinned
  `ba980cbf` (it holds owner content outside the sync folders: `uploads/`,
  `scraps/`, `github.md`, `_adherence.oxlintrc.json` — never in the plan's
  deletes). Its Oct 13 anchor covered 21 components: 12 verified-by-upload,
  9 changed + 30 new captured and graded **39/39 match** (4-agent fan-out, no
  fixes, no learnings). Atomic upload 273 files + anchor; nothing deleted.
  `1dff7fc2` is now an orphan under the other account — delete it there.
  **If a get_project 404s on the pinned id, check the login account before
  creating a new project.**

- **2026-10-29 re-sync** (bundle + styling only: Button `--_fill` rename,
  lh/z token kind tags). 51/51 unchanged, full render check clean, atomic
  upload of 273 files, anchor refreshed. The old project `ba980cbf-…` still
  returns 404 under this login; 1dff7fc2 stays pinned. Conventions header
  validates against the build; open suggestion: spell the type scale as
  `--wm-fs-xs/sm/base/lg/xl/2xl/3xl/display` (there is no `fs-md`).

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

- **All 51 components synced and graded** (editor parts by 2026-10-16;
  workspace parts Dialog/Textarea/Checkbox/ChangeMark/StatusBar/EmptyState on
  2026-10-17). Owned previews mirror the stories by hand: any story edit
  needs the matching `.design-sync/previews/<Name>.tsx` edit
  (`[STORY_CHANGED]` flags it).
- **Story-local pseudo-class CSS doesn't survive inline styles.** Dialog's
  `OpenACV` story styles its choice buttons in a `<style>` block
  (`:hover`, `:focus-visible` teal outline); the owned preview carries them
  as a scoped `<style>` + `dialog-preview-choice` class. Without it the
  auto-focused first option showed Chromium's white focus ring. Check any
  new owned preview whose story has a `<style>` block with pseudo-classes.
- **Dialog** is `cardMode: "single"` (`primaryStory: OpenACV`): stories open
  a native `<dialog>` via showModal, top layer escapes the grid
  (`[GRID_OVERFLOW] escape`). **ChangeMark** is `cardMode: "column"`: the
  margin flags sit outside the PageSheet (`[GRID_OVERFLOW] wide`).
- ChangeMark sheets: storybook captures the whole A4 page (taller shot), the
  preview crops at 700px — framing only, graded match.
- Menu popup is `position: fixed` (Menu is `cardMode: "single"`);
  PageCanvas needs a definite-height parent (its previews wrap it);
  Workspace `fill` uses 100dvh (column card); ReorderList `detail` is a
  render-function snippet; wrap.js maps Textarea `onChange` to `oninput`.
- `[TITLE_UNMAPPED] … CVeditor` in the build log is expected: the
  `Examples/CV editor` showcase (`src/examples/`, not packaged) is dropped
  either way; `titleMap: {"CV editor": null}` documents the intent.
