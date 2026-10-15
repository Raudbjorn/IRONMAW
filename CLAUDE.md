# CLAUDE.md

`@svnbjrn/ironmaw` — **IRONMAW**, the Wormian Bones design system. Svelte 5
(runes + snippets) component and token library for the Application Assistant
library/reader: 21 components, two editions (oxide default, bone opt-in), DTCG
tokens with WCAG gates, self-hosted subset fonts, a committed React bridge for
`/design-sync`. No utility classes — style with component props and `--wm-*`
tokens.

Vernacular: IRONMAW on paper; WORMIAN BONES day to day; things of the theme
are "Wormian". Teal = interactive, rust = the one action/active indicator,
amber = warning (never rust), slate = structure. Display face (Rajdhani) for
short uppercase labels only.

## Commands

Node `>=22`, pinned `pnpm@11.3.0`. `pnpm install` (esbuild build scripts are
allowed via `pnpm-workspace.yaml`).

```bash
pnpm run check            # svelte-check (strict) — the type gate
pnpm test                 # vitest unit (jsdom) + palette contrast gates
pnpm run build            # tokens + fonts + assets + svelte-package + publint
pnpm run tokens           # regenerate token outputs from DTCG source
pnpm run fonts            # subset fonts (needs pyftsubset / FontTools)
pnpm run assets           # inline the bear SVG master
pnpm dev                  # standalone Library gallery (src/Dev.svelte)
pnpm run storybook        # Storybook dev, port 6006
pnpm run design-sync:build  # build + React adapter dist (what /design-sync runs)
```

Single test: `pnpm exec vitest run src/lib/components/atoms/Button.test.ts`.
jsdom prints harmless `Could not parse CSS stylesheet` noise — judge the summary.
`pnpm run build` prints expected `PfEd/FFTM NOT subset` warnings; publint must end `All good`.

## Architecture

**Tokens are the source of truth; generated outputs are committed.** DTCG
sources: `src/lib/tokens/{primitives,scale,oxide,bone}.tokens.json` +
`themes.ts` registry. `scripts/build-tokens.mjs` emits `scale.css`
(`@layer wm.base`, includes `--wm-brand-*` anchors), `colors.css`
(`@layer wm.theme`, `:root` = oxide, `[data-theme="…"]` per edition),
`palette.ts`, `resolved/*.json`. Never hand-edit outputs. Adding an edition =
one token file + one registry entry. `palette.test.ts` gates every edition
(text 4.5:1, boundaries 3:1, warning ≠ action).

Cascade layers: `wm.base < wm.theme < wm.user`; unlayered consumer CSS wins.

`src/lib/`:
- `components/{atoms,layout,molecules,library}` — `data-wm="<name>"` attribute contract; colocated `*.test.ts`. `index.ts` is the public barrel.
- `review-status.ts` — stored status → display copy + tone (act/care/context). Unknown values render raw.
- `assets/bear-mark.ts` — generated data URL of the owner's SVG master.
- `fonts/` — generated woff2 subsets (Inter, Iosevka Nerd PUA, Rajdhani Latin+Ext-A).

**Stories** in `src/stories/*` cover both editions (addon-themes, `data-theme` on `html`). Foundations stories are showcase-only (excluded from the sync via `titleMap`).

**React bridge.** `.design-sync/react-adapter` + `.design-sync/previews` are
committed and hand-maintained — nothing regenerates them. Any public
component/prop/snippet change must update `index.js` (wrap call + snippet
list), `index.d.ts` (Props), and the owned preview. Camelcase aliases in
`wrap.js` must map to the Svelte lowercase props. See `.design-sync/NOTES.md`.

## Conventions

- Svelte 5 patterns, lowercase callback props (`onclick`, `onsubmit`), `$props.id()` for SSR-stable ids. `Stack` for layout.
- Errors as values; no throws in library code.
- Copy: sentence case, plain verbs, name what the user controls. Never "Verified", never a fabricated count.
- Brand terrain is reserved for headers and empty states; `Panel terrain` uses contour and mountain lines. `Mark` uses the full bear at every size; the compact favicon (`assets/brand/bear-emblem.svg`) never appears in UI. Active NavBar items use a rust underline.
- Brand references live in `.do-no-commit/` (gitignored) — read them, never copy them into the repo except via `assets/brand/`.
