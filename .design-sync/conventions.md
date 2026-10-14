# IRONMAW — build conventions

**IRONMAW** on paper; **Wormian Bones** day to day; things of the theme are
**Wormian**. (IRONMAW ⇄ WORMIAN is an exact anagram; *I am worn bones* is the
hidden line.) A Svelte 5 design system consumed here through React wrappers:
every component on `window.Ironmaw` is the library's real compiled code.

The idea: Wormian bones are accessory bones inside the skull's sutures —
**unexpected pieces within an ordered structure**. The system reads that as
fitted shapes, visible seams and carefully differentiated parts. No skull
illustrations. Four brand anchors from the owner's identity board: Charcoal
`#0F1416`, Teal `#3CA0A0`, Rust `#D0602B`, Slate `#5F7E8F`.

## Wrapping and editions

Wrap every app root in `<ThemeRoot>`: it sets the library's theming contract
(`data-theme` on an ancestor) and paints the token background/ink/font.

```jsx
<ThemeRoot theme="oxide">   {/* "oxide" (default: charcoal, teal, rust, slate) or "bone" (proposed paper-toned reading edition) */}
  …your design…
</ThemeRoot>
```

## Rules the components encode

- **Teal** = interactive emphasis: focus, selection, filter state, links. Solid teal fills take a charcoal label.
- **Rust** = the main action and the active indicator (primary Button, active tab and NavBar underlines, selected-row edge). One filled rust control per view.
- **Warnings are amber, never rust.** A `Notice` must not look like an action.
- **Display lettering** (Rajdhani, uppercase, tracked) is for short labels only: `Kicker`, `Button`, `Tabs`, `NavBar`, `Heading display`. Document titles, excerpts, warnings and Icelandic prose stay in Inter sentence case (`Text`, `Heading`).
- **Review labels have three tones** (`StatusLabel`): act (filled rust + ▲, "Known issues"), care (rust outline), context (slate outline). No green, no "Verified". Unknown stored values render raw.
- **The chamfer** is one 10px clipped corner on primary controls — one size, never scaled. **The suture** (`Suture`) marks real joins. `Panel terrain` carries quiet contours, a mountain ridge and pines only on brand headers and empty states.
- Copy is sentence case, plain verbs, named by what the user controls: "Search library", "Copy passage with source", "Back to results". Counts: "N file locations" and "N more matches" are different things and are never summed.

## Styling idiom — tokens and props, never CSS classes

There is **no utility-class vocabulary**. Components style themselves via
their props (`variant`, `tone`, `size`, `padding`, `surface`). For your own
layout glue use inline styles with the `--wm-*` tokens, and prefer `Stack`
(the only layout primitive — `gap` takes scale *steps*, not pixels).

| Family | Real names |
|---|---|
| Canvas / surfaces | `--wm-bg`, `--wm-surface-1/2/3`, `--wm-selected`, `--wm-mark-bg` |
| Boundaries | `--wm-border` (quiet), `--wm-border-strong` (fields), `--wm-structure`, `--wm-structure-text` |
| Ink | `--wm-text`, `--wm-text-strong`, `--wm-text-muted`, `--wm-text-faint` |
| Interactive | `--wm-accent` + `--wm-accent-ink` (teal), `--wm-action` + `--wm-action-hover` + `--wm-action-ink` (rust) |
| Semantic | `--wm-success`, `--wm-warning` (amber), `--wm-error` |
| Brand anchors (edition-independent) | `--wm-brand-charcoal/teal/rust/slate` |
| Space (Stack gap steps) | `--wm-space-0/1/2/3/4/6/8/12` |
| Geometry | `--wm-radius-sm/md/lg`, `--wm-chamfer`, `--wm-tick`, `--wm-control-sm/md/lg`, `--wm-row`, `--wm-measure` |
| Type | `--wm-font-sans/mono/display`, `--wm-fs-xs…3xl/display`, `--wm-lh-tight/normal/relaxed`, `--wm-display-weight(-bold)`, `--wm-tracking-display/wide` |
| Z / breakpoints | `--wm-z-base/elevated/sticky/dropdown/overlay`, `--wm-bp-sm/md/lg/xl` |

Gotchas that matter:
- **Event callbacks use Svelte's lowercase names**: `onclick`, `onsubmit`, `onremove`, `onopen`, `oncopy`, `ondismiss` (camelCase aliases are accepted).
- `children`, Panel's `header`/`footer`, NavBar's `brand`, Notice's `action`, DocumentEntry's `excerpt`/`extra` take normal React nodes.
- `StatusLabel` takes the **stored** status value (`"known-errors"`), not display copy; `REVIEW_STATUS` / `reviewStatusCopy` expose the mapping.
- `Mark variant="bear"` is the owner's full vector master; `variant="emblem"` is the supplied small-format bear. Small lockups use the emblem automatically. Add `plate` to seat either on charcoal.

## Where the truth lives

Read before styling: `styles.css` (imports `tokens/index.css` →
`tokens/colors.css` + `tokens/scale.css` + `tokens/fonts.css`, then
`_ds_bundle.css` — the compiled component styles). Per-component API:
`<Name>.d.ts`; usage: `<Name>.prompt.md`.

## Idiomatic example — the Library

```jsx
<ThemeRoot theme="oxide">
  <NavBar items={[{ href: '#library', label: 'Library', active: true }]} brand={<Mark variant="lockup" size="sm" name="IRONMAW" tagline="Application Assistant" />} />
  <Stack gap={4}>
    <Heading level={1} display>Library</Heading>
    <SearchField value="ferilskrá" onsubmit={(q) => {}} />
    <Stack direction="row" gap={2} align="center" wrap>
      <Kicker>Active filters</Kicker>
      <Chip label="Language: Icelandic" selected onremove={() => {}} />
    </Stack>
    <Suture />
    <Stack as="ul" gap={0}>
      <DocumentEntry title="cv-sveinbjorn-geirsson.is.pdf" context="02-applications/landsnet/landsnet-2025-06"
        language="Icelandic" format="PDF" statuses={['snapshot']} locations={6} selected onopen={() => {}}
        excerpt={<><mark>Ferilskrá</mark> Sveinbjörn Geirsson …</>} />
    </Stack>
    <Panel as="aside" aria-label="Reader" footer={<Button variant="primary">Copy passage with source</Button>}>
      <Text prose>…extracted text…</Text>
    </Panel>
  </Stack>
</ThemeRoot>
```
