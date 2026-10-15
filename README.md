# IRONMAW

**IRONMAW** on paper; **IRONMAW** or **Wormian Bones** day to day. *I am worn bones.*

A system of uncommon parts: charcoal, teal, rust and slate for the
Application Assistant library and reader. Svelte 5, token-first, dark-first,
with a React bridge so the same compiled components sync to a
[claude.ai/design](https://claude.ai/design) design system.

> Wormian bones are accessory bones inside the skull's sutures — unexpected
> pieces within an ordered structure. The system takes that literally:
> fitted shapes, visible seams, carefully differentiated parts. No skull
> illustrations.

| On paper | Day to day | Things of the theme |
|---|---|---|
| **IRONMAW** | IRONMAW or **WORMIAN BONES** | **Wormian** |

IRONMAW ⇄ WORMIAN is an exact anagram. IRONMAW is the bear: the heavier,
more animal side of the same design.

## Editions

- **Oxide** — charcoal, teal, rust and slate. Default; `data-theme="oxide"`.
- **Bone** — a proposed paper-toned expression for documents and reading. Opt-in only (`data-theme="bone"`); it never auto-switches on `prefers-color-scheme`.

Brand anchors from the identity board, verbatim: Charcoal `#0F1416`, Teal
`#3CA0A0`, Rust `#D0602B`, Slate `#5F7E8F`. Everything else is a semantic
role per edition, gated by WCAG contrast tests (`src/lib/tokens/palette.test.ts`).

## Use

```bash
pnpm add @svnbjrn/ironmaw   # once published; today: pnpm link from this repo
```

```svelte
<script>
  import '@svnbjrn/ironmaw/styles.css';
  import { Button, SearchField, DocumentEntry } from '@svnbjrn/ironmaw';
</script>

<svelte:html data-theme="oxide" />
<SearchField onsubmit={(q) => search(q)} />
<Button variant="primary">Copy passage with source</Button>
```

## Parts

| Group | Components |
|---|---|
| Atoms | `Text`, `Heading`, `Kicker`, `Button`, `Link`, `Chip`, `StatusLabel`, `Input`, `Select`, `Spinner`, `Mark` |
| Layout | `Stack`, `Panel`, `Suture` |
| Molecules | `SearchField`, `Tabs`, `Notice`, `NavBar` |
| Library | `DocumentEntry`, `SourceEntry`, `LoadMore` |
| Data | `REVIEW_STATUS`, `reviewStatusCopy`, `sortReviewStatuses`, `brand`, `oxide`, `bone`, `contrastRatio`, `bearMark`, `bearEmblem` |

Rules the parts enforce: teal is interactive emphasis; rust is the one action
and the active indicator; warnings are amber, never rust; display lettering
(Rajdhani) is for short labels only; review labels have three tones and no
"Verified"; the chamfer is one size. Contours and mountain lines belong on
brand headers and empty states; the suture marks actual joins in dense UI.

## From the supplied references

| Reference | System use |
|---|---|
| Full bear SVG and compact favicon SVG | `Mark` uses the full vector at every size, small lockups included; the favicon SVG is the browser icon only and never appears in UI; the artwork colours remain intact. |
| Topographic banner and cover-letter headers | `Panel terrain` draws quiet contour and mountain lines on brand headers, away from document text and controls. |
| Interface board | `NavBar` uses a rust active underline; primary buttons retain the single chamfer, and selected chips remain teal. |
| Identity board | The four anchor colours remain exact in the DTCG tokens. |
| Light and dark cover-letter previews | The existing Oxide/Bone split keeps prose in Inter and the mark in the header; the document copy stays outside the component library. |

The supplied alternate cyan/orange and pixel bear concepts remain visual
references; they are distinct marks, not automatic variants of the master.

## Develop

```bash
pnpm install
pnpm run build        # tokens + fonts + assets + svelte-package + publint
pnpm run check        # svelte-check
pnpm test             # vitest (jsdom) incl. palette contrast gates
pnpm dev              # the Library screen composed from the system
pnpm run storybook    # every part, both editions
```

To run Codex and the five `.codex/agents/` roles through MiniMax:

```bash
./scripts/codex-minimax.sh
./scripts/codex-minimax.sh exec 'Review Panel using ironmaw-reviewer'
```

The launcher uses an existing `OPENAI_API_KEY`, or finds `minimax-api-key` on
`PATH` when it is unset. It selects MiniMax's Responses endpoint and model
catalog. Subagents inherit the parent provider and model; their TOML files
set only reasoning effort.
A session started with plain `codex` keeps its normal provider.

Python Atomic Agents can use the same MiniMax credentials through the separate
`ironmaw_agents` package:

```bash
uv venv
uv pip install -e '.[test]'
source .venv/bin/activate
python - <<'PY'
from atomic_agents import BasicChatInputSchema
from ironmaw_agents import create_minimax_agent

agent = create_minimax_agent(reasoning_effort="medium")
print(agent.run(BasicChatInputSchema(chat_message="Summarize IRONMAW in one sentence.")))
PY
```

`minimax_client()` uses an explicitly set `OPENAI_API_KEY`, otherwise it runs
`minimax-api-key` from `PATH`. The client fixes the MiniMax endpoint, 60 second
timeout, two transport retries, and 16,384 completion tokens. The agent factory
accepts a `model` override and uses function tools for typed outputs; JSON
response modes are rejected before making a request. Run its checks with
`python -m pytest -q tests/test_minimax.py`.

Tokens are DTCG JSON in `src/lib/tokens/*.tokens.json`; `pnpm run tokens`
regenerates `colors.css`, `scale.css`, `palette.ts` and `resolved/*.json`.
Never hand-edit the generated files. Fonts (Inter, Iosevka Nerd, Rajdhani — all
OFL, full Icelandic coverage) are subset from `assets/fonts-src/` by
`pnpm run fonts`. The full bear and the favicon are owner-supplied vectors
in `assets/brand/`, inlined by `pnpm run assets`.

## Sync to claude.ai/design

The committed bridge in `.design-sync/` (config, React adapter, owned
previews, conventions) lets `/design-sync` push the real compiled components
as a design system. See `.design-sync/NOTES.md` for the shape and the gotchas.

## Provenance

Visual direction: the owner's four Sveinbjörn brand references (bear mark,
identity board, UI component board, wide banner) and the Application Assistant
designer handoff. Interaction patterns: Turbopuffer GUI (MIT, Mehmet Ali Peker)
for the dense table and persistent inspector.
