# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

App developers and designers applying a reusable theme to web and desktop apps.

## Product Purpose

IRONMAW provides reusable components and theme foundations for app interfaces. The Application Assistant library and reader are an existing example of its use, not the limit of the product.

## Operating Context

The current implementation is a Svelte 5 component and token library with Storybook examples, a standalone Library gallery, and a React bridge for design sync. Web apps consume the components and CSS directly. Desktop apps receive IRONMAW as a native toolkit theme built from the exported design tokens, not as embedded web components. The first native consumer is the Application Assistant desktop app: Rust, eframe/egui 0.36.x, targeting one owner on Linux/KDE Wayland (decision record: `~/dev/projects/impeccable/plans/decisions/0001-native-runtime.md`). Its primary navigation is CV · Library · Evidence · Applications · Settings; the product title is Application Assistant, and IRONMAW is the theme name.

Real content mixes Icelandic and English: Icelandic prose, names and filenames (þ, ð, æ, ö) sit beside English interface copy.

In the Application Assistant, the Library helps the owner find CVs, letters, employer research and terminology for English and Icelandic applications. Its first workflow is to browse or search, inspect a passage and its source warnings, then copy it with a source reference. Drafting, editing, translation and submission belong to later application workflows.

## Capabilities and Constraints

- The current package exposes components, CSS and design tokens. Oxide is the default edition; Bone is an opt-in, proposed edition whose product approval is still open.
- The IRONMAW bear and lockup are optional in apps that use the theme.
- Review statuses describe different aspects of a source, not a confidence scale. Several can coexist. They use three tones (act, care, context). The interface never says "Verified" and never shows a fabricated count; an unknown stored status is shown as its raw value rather than hidden.
- In the Application Assistant, keep distinct documents, passages, exact-copy file locations and separate versions distinct in the interface. Show provenance and material cautions before reuse; retrieval rank does not establish factual confidence. Label metadata-only records and unavailable original previews honestly, and preserve search context when opening and closing a reader.
- Public examples use neutral prose and identify mock data; private source bodies and correspondence are not demo content.
- Typography and font subsets must render Icelandic correctly (Latin Extended-A).
- The egui theme has no CSS: colours, spacing, type sizes and fonts must be expressible from the exported tokens alone, with licensed fonts packaged in the app with Icelandic coverage.
- Open: how tokens are exported for egui (generated Rust module, JSON, or another format); product approval of the Bone edition.

## Brand Commitments

IRONMAW is the name on paper. IRONMAW or WORMIAN BONES may be used day to day; WORMIAN describes things belonging to the theme. IRONMAW and WORMIAN are exact anagrams. The bear represents the heavier, animal side of that identity. The supplied bear artwork and lockup remain optional in consuming apps.

"A system of uncommon parts" names the identity's structural idea. "I am worn bones" is a concealed phrase, not a control label. Anatomical language must not obscure ordinary component and interface names.

Voice: sentence case, plain verbs, name what the user controls.

## Evidence on Hand

- The package, components, token sources and examples in this repository show the current implementation.
- The owner-supplied brand vectors are under `assets/brand/`.
- The local 2026-10-13 Application Assistant handoff and UI-2 review under `.do-no-commit/` record that consumer's Library workflow and selected Sveinbjörn references. The review covers a PDF export, not tested runtime behavior, and its browser/backend assumptions predate the native runtime decision above.

## Product Principles

- Keep the theme reusable across applications and use cases.
- Let developers and designers compose interfaces from shared parts.
- Keep the IRONMAW identity optional in consuming apps.
- Be honest about what the system knows: label provenance and risk, never claim correctness.

## Accessibility & Inclusion

Every edition must pass automated contrast gates: text 4.5:1, boundaries 3:1, and warning visibly distinct from the main action. Icelandic content must render with correct glyphs. Web consumers target WCAG 2.2 AA with visible keyboard focus, named controls, cues beyond colour, reduced-motion support and readable reflow at narrow widths and high zoom. Test the implementation before claiming accessibility compliance.
