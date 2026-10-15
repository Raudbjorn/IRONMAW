---
name: IRONMAW
description: Wormian Bones — a system of uncommon parts in charcoal, teal, rust and slate.
colors:
  charcoal: "#0F1416"
  teal: "#3CA0A0"
  rust: "#D0602B"
  slate: "#5F7E8F"
  surface-1: "#141B1E"
  surface-2: "#192327"
  surface-3: "#1F2B30"
  border: "#2A3940"
  text: "#D9E1E4"
  text-strong: "#F3F6F7"
  text-muted: "#9EB1BA"
  text-faint: "#86999F"
  structure-text: "#8EA6B3"
  rust-hover: "#DB7343"
  selected: "#17262A"
  mark-plate: "#101715"
  success: "#5CB38B"
  warning: "#E2A33B"
  error: "#E86052"
typography:
  display:
    fontFamily: "Rajdhani, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.14em"
  headline:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.75rem"
    fontWeight: 600
    lineHeight: 1.15
  title:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.15
  body:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  prose:
    fontFamily: "Inter, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.65
  label:
    fontFamily: "Rajdhani, system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.14em"
  mono:
    fontFamily: "Iosevka, ui-monospace, 'Courier New', monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  sm: "2px"
  md: "4px"
  lg: "6px"
spacing:
  "1": "0.25rem"
  "2": "0.5rem"
  "3": "0.75rem"
  "4": "1rem"
  "6": "1.5rem"
  "8": "2rem"
  "12": "3rem"
components:
  button-primary:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.charcoal}"
    typography: "{typography.label}"
    height: "40px"
    padding: "0 16px"
  button-primary-hover:
    backgroundColor: "{colors.rust-hover}"
  button-secondary:
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 16px"
  button-secondary-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text-strong}"
  button-ghost:
    textColor: "{colors.text-muted}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 16px"
  chip:
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    height: "28px"
    padding: "0 12px"
  chip-selected:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.charcoal}"
  input:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text}"
    rounded: "{rounded.sm}"
    height: "40px"
    padding: "0 12px"
  status-act:
    backgroundColor: "{colors.rust}"
    textColor: "{colors.charcoal}"
    rounded: "{rounded.sm}"
    height: "22px"
    padding: "2px 8px"
  panel:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "16px"
  document-row-selected:
    backgroundColor: "{colors.selected}"
    height: "48px"
  button-xs:
    rounded: "{rounded.sm}"
    height: "28px"
    padding: "0 8px"
  button-dashed:
    textColor: "{colors.teal}"
    rounded: "{rounded.sm}"
    height: "40px"
    width: "100%"
  button-dashed-hover:
    backgroundColor: "{colors.surface-1}"
  segmented-control:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text-muted}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    height: "32px"
    padding: "2px 12px"
  segmented-control-hover:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
  segmented-control-selected:
    backgroundColor: "{colors.teal}"
    textColor: "{colors.charcoal}"
  switch:
    backgroundColor: "{colors.surface-2}"
    rounded: "10px"
    width: "36px"
    height: "20px"
  switch-on:
    backgroundColor: "{colors.teal}"
  badge:
    textColor: "{colors.text-muted}"
    rounded: "{rounded.sm}"
    height: "18px"
    padding: "0 5px"
  marker:
    backgroundColor: "{colors.warning}"
    textColor: "{colors.charcoal}"
    typography: "{typography.mono}"
    size: "20px"
  marker-sm:
    size: "16px"
  avatar:
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.text-strong}"
    size: "32px"
  kbd:
    textColor: "{colors.text-muted}"
    typography: "{typography.mono}"
    rounded: "{rounded.sm}"
    height: "18px"
    padding: "0 4px"
  score-ring:
    textColor: "{colors.text-strong}"
    size: "64px"
  score-ring-lg:
    size: "88px"
  menu:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "4px"
  menu-item:
    rounded: "{rounded.sm}"
    height: "32px"
    padding: "0 8px"
  menu-item-hover:
    backgroundColor: "{colors.surface-3}"
    textColor: "{colors.text-strong}"
  zoom-control:
    backgroundColor: "{colors.surface-2}"
    textColor: "{colors.text}"
    rounded: "{rounded.md}"
    padding: "4px"
  issue-card:
    backgroundColor: "{colors.surface-1}"
    textColor: "{colors.text-muted}"
    rounded: "{rounded.md}"
    padding: "12px 14px"
  issue-card-active:
    backgroundColor: "{colors.selected}"
  app-header:
    backgroundColor: "{colors.charcoal}"
    height: "56px"
    padding: "8px 12px"
  workspace-sidebar:
    backgroundColor: "{colors.surface-1}"
    width: "320px"
    padding: "12px"
  page-sheet-a4:
    width: "794px"
    height: "1123px"
    padding: "56px"
  page-sheet-letter:
    width: "816px"
    height: "1056px"
    padding: "56px"
---

# Design System: IRONMAW

## Overview

**Creative North Star: "The Uncommon Parts"**

Wormian bones are accessory bones inside the skull's sutures: unexpected pieces within an ordered structure. IRONMAW takes that literally. Interfaces are built from fitted parts with visible seams, each part carefully differentiated, held in a dark charcoal ground. The structure is quiet and orderly; the character lives in a small number of precise, deliberate details: one chamfered corner, a rust tick, a tracked uppercase label, a suture line where two regions actually join.

Components are machined and quiet. Radii are small, borders are hairlines, surfaces step by tone rather than float on shadow, and colour is assigned by job rather than decoration. Teal means "you can act on this", rust means "this is the one action" or "you are here", amber means "be careful", and slate holds the structure together. Density suits long working sessions over documents in Icelandic and English, so legibility outranks expression everywhere except brand headers and empty states.

Two editions share every part. **Oxide** (the values in this file) is the default. **Bone** is an opt-in, paper-toned proposal for documents and reading, selected only with `data-theme="bone"` and never by `prefers-color-scheme`; its values live in `src/lib/tokens/bone.tokens.json`. The skull is the metaphor, never the picture: no skull illustrations.

The editor parts extend the same discipline to authoring. An Oxide shell (header, sidebar, canvas) holds the work; the document itself sits on a sheet of Bone paper inside it, so what you edit looks like what you print. Findings about the document are amber, numbered and pinned in the page margin; they annotate the text without touching it.

**Key Characteristics:**
- Dark charcoal ground with three tonal surface steps; one shadow, used only for genuinely raised panels.
- Colour by job: teal interactive, rust the single action and active indicator, amber warnings, slate structure.
- Rajdhani display lettering, uppercase and tracked, for short labels only; Inter for everything people read; Iosevka for paths and identifiers.
- One chamfer size, on the primary action. Small radii (2–6px) everywhere else.
- Seams are real: sutures mark actual joins, terrain lines belong to brand headers and empty states.
- Authored line icons on a 24 grid, never unicode glyphs.
- Documents are Bone paper inside the Oxide shell; findings are amber margin markers, never rust.

## Colors

Four anchor colours from the identity board, kept exact, around which every semantic role is derived and contrast-tested per edition.

### Primary
- **Rust**: the one main action per view (filled primary button), the active indicator (navigation and tab underline, selected-row bar, kicker and suture ticks), and the `act` review tone ("Known issues"). Hover lightens to **Rust hover**.
- **Teal**: interactive emphasis: focus rings, selected chips and filters, links, link-like titles on hover, and the contour lines in brand terrain.

### Secondary
- **Slate**: structure. Strong borders on controls, the `context` review-status outline, neutral notices, the mountain lines in terrain. **Structure text** is its readable companion for provenance lines (folder paths, document context).

### Neutral
- **Charcoal**: the page ground, and the ink on rust and teal fills.
- **Surface 1 / 2 / 3**: tonal steps for panels, inputs, hover fills and nested regions; each step is a little lighter.
- **Border**: hairline dividers between rows, panel headers and footers, the navigation bar's bottom edge.
- **Text strong / Text / Text muted / Text faint**: titles and headings; body copy; secondary metadata and labels; hints and placeholders.
- **Selected**: the quiet fill behind a selected document row, paired with the rust bar.
- **Mark plate**: the charcoal seat behind the bear mark, kept dark in both editions.

### Status
- **Success**, **Warning** (amber) and **Error** drive notices, field errors and the danger button. They are never used decoratively.

### Named Rules
**The One Rust Rule.** One filled rust control per view. Rust also marks "you are here", so a second filled rust button makes two things claim the same meaning.

**The Amber Is Not Rust Rule.** Warnings are amber and must not look like the main action. The contrast tests enforce that warning and action stay distinct in every edition.

**The No Green Tick Rule.** Review statuses have three tones: `act` (filled rust with the warning icon), `care` (rust outline) and `context` (slate outline). There is no green status and no "Verified" label, because the index cannot establish correctness.

**The Paper Edition Rule.** A document being written renders on a page sheet in the Bone edition, scoped to the sheet, while the shell around it stays Oxide. The sheet is the one place an app may mix editions; set it to inherit only when the reader asked for the app's edition.

**The Amber Finding Rule.** A finding about the document is amber: a numbered amber marker in the page margin, a 4px amber wavy underline under the passage it concerns, and the same number on its issue card in the sidebar. Rust never marks a finding; error red is for findings that block parsing.

**The Teal Selection Rule.** Choosing one of several states fills teal with charcoal ink: the selected segment, the switch track when on, the selected chip. Rust stays the action and the "you are here" mark, so selection and position never share a colour.

**The Measured Contrast Rule.** Anchor hexes are brand colours, not proof of accessibility. Every edition's derived pairs must pass text 4.5:1 and boundaries 3:1 (`src/lib/tokens/palette.test.ts`) before they ship.

## Typography

**Display Font:** Rajdhani (with system-ui, sans-serif)
**Body Font:** Inter (with system-ui, sans-serif)
**Label/Mono Font:** Iosevka (with ui-monospace, Courier New, monospace)

**Character:** A narrow, engineered display face for the system's few spoken labels, set against a neutral, highly legible sans for everything people actually read, with a monospace for the provenance that must be exact.

### Hierarchy
- **Display**: Rajdhani bold, uppercase, tracked 0.14em, line height 1. Brand headers and section names such as "LIBRARY"; scales down one step per heading level.
- **Headline**: Inter semibold, balanced wrap, tight line height. Page and document titles (heading level 1; level 2 at 1.375rem).
- **Title**: Inter semibold at 1.125rem (level 3) and 1rem (level 4). Panel and group titles; document-row titles use Inter medium at 1rem.
- **Body**: Inter regular, 1.5 line height. Interface copy, excerpts, notices.
- **Prose**: Inter regular at 1rem with 1.65 line height, held to a 68ch measure, preserving source line breaks. Reader text.
- **Label**: Rajdhani semibold, uppercase, tracked 0.14em (buttons track 0.08em). Kickers, field labels, navigation items, tabs, button text, suture labels.
- **Mono**: Iosevka. File paths, identifiers, folder context, chip and tab counts, input units, keycaps, zoom values, page labels ("Page 1 · A4"), entry dates and marker numerals.
- **Document**: inside a page sheet the name is Inter semibold at 1.75rem with balanced wrap, the headline Inter at 1rem muted, entry titles Inter semibold at 0.875rem, entry body Inter at 0.8125rem with 1.65 line height. Section headings are the one display use on the page (see the Doc section entry).
- **Score figure**: Rajdhani bold, tabular, 1.375rem in the 64px ring and 1.75rem in the 88px ring.

### Named Rules
**The Short Label Rule.** Rajdhani is for short uppercase labels only. Titles, excerpts, warnings and Icelandic prose stay in Inter, in sentence case.

**The Name Is Not A Label Rule.** Names, document titles and anything the user typed are never uppercased or tracked. A button whose text is a name or title uses the plain style: Inter semibold, sentence case, no tracking.

**The Small Numeral Exception.** The 16px marker and the 24px avatar set their figures at 10px (0.625rem), below the 0.75rem floor of the type scale, because two characters must fit a small circle. Nothing else uses 10px.

**The Icelandic Glyph Rule.** Every shipped face is subset to cover Latin Extended-A, so þ, ð, æ and ö render in the intended face, never in a fallback.

## Layout

A 4px-based spacing scale (0.25rem steps through 1, 2, 3, 4, then 1.5rem, 2rem and 3rem) composed with `Stack` rather than ad-hoc margins. Controls come in three heights (32, 40 and 48px). Document rows have a 48px minimum and grow with their excerpt, which is clamped to three lines and held to the 68ch measure.

Breakpoints are 640, 768, 1024 and 1440px. Below 768px the navigation collapses its destinations behind a labelled toggle rather than scrolling them sideways. The navigation bar is sticky at the top on the charcoal ground with a hairline bottom border.

Controls gain a fourth, extra-small height (28px) for row tools, icon buttons in lists and keycap-sized affordances. Icons come in 12, 16, 20 and 24px; buttons carry 16px icons (20px on large).

**Workspace.** Editing surfaces use a three-part shell: a 56px-minimum app header (a three-column grid of start, centre and end; below 768px the centre drops to its own row), a 320px sidebar on surface 1 with a hairline right edge and its own thin scroll, and a main canvas on the charcoal ground. Below 1024px the sidebar stacks above the canvas and the shell returns to natural height.

**Page canvas.** Sheets stack in a centred column with 24px gaps inside 24/32px padding. Zoom applies to the whole stack; "fit" scales to the available width and is capped at 125%. A view switch may sit sticky at the top centre and a zoom bar floats at the bottom centre.

**Page sheet.** Exact paper sizes: A4 at 794 × 1123px and Letter at 816 × 1056px (minimum height; content may run on), with 56px margins. The margin is working space: finding markers sit in it, 16px from the paper edge, aligned with the first line of the passage they annotate. Document sections are spaced 24px apart with 12px between entries; two-column sections use a 32px column gap and collapse to one column below 480px.

## Elevation & Depth

Depth comes from tonal layering, not shadow. The ground is charcoal; panels, inputs and nested regions step up through surfaces 1, 2 and 3, and hairline borders define the edges. Two shadows exist: a small one (0 1px 2px at 35% black) and a raised one (0 6px 16px at 40% black) applied only to panels explicitly marked `elevated` and to things that genuinely float: menus, the floating zoom bar, and the page sheet lifted off the canvas ground. Print drops the sheet's shadow. The stacking order runs base, elevated, sticky, dropdown, overlay.

### Named Rules
**The Flat-By-Default Rule.** Surfaces sit flat at rest. Reach for a lighter surface step before a shadow; a shadow means the panel genuinely floats above its neighbours.

## Shapes

Small, almost-square corners: 2px on controls, chips and status labels, 4px on panels, 6px at most. The signature silhouette is a single 10px chamfer clipped from the top-right corner of the primary button; its fill sits on a pseudo-element so the clip never cuts the focus ring. Two recurring marks of joinery: the **suture**, a hairline divider that may lead with an 18px rust tick, and the **tick**, the same 18px rust bar under a kicker. Brand **terrain** draws faint teal contours and slate mountain lines, masked in from the right, behind header content only.

### Named Rules
Round forms are reserved for things that are a point or a person: the numbered marker, the avatar, the score ring and the switch knob. Pages have no radius at all; they are paper. A dashed slate outline means an empty slot waiting for an addition ("Add section"), never a disabled state. The wavy underline (an 8 × 4px wave, 4px tall) is the finding's mark on the page and appears nowhere else.

**The One Chamfer Rule.** The chamfer is one size (10px) and belongs to the primary action. It is not a general corner style.

**The Pill Track Exception.** The switch track (36 × 20px) is the one pill in the system: its 10px radius is half its height, outside the 2–6px corner scale by design. Nothing else rounds a rectangle that far.

**The Real Seam Rule.** A suture marks an actual join in dense UI. Contour and mountain lines are reserved for brand headers and empty states and never run behind document text or controls.

## Components

### Icons
Authored line drawings on a 24-unit grid, stroke-only in the current colour with round caps and joins, stored as path data so the same drawings serve Svelte, the React bridge and native consumers. Stroke weight thickens as icons shrink so they hold up: 2.25 at 12px, 2 at 16px, 1.75 at 20 and 24px. An icon with meaning carries an accessible label; otherwise it is hidden from assistive tech.

**The No Glyph Rule.** Icons come from the IRONMAW set, never from unicode symbols or emoji. Arrows and symbols may appear as text only where they are the content itself, such as the "↑" on a keycap.

### Buttons
Machined, uppercase, tracked labels in Rajdhani.
- **Shape:** 2px corners; primary adds the 10px top-right chamfer.
- **Primary:** rust fill, charcoal ink, bold label; four sizes at 28/32/40/48px with 8/12/16/24px side padding. Hover lightens the rust.
- **Secondary:** transparent with a slate border and body-text ink; hover fills with surface 2 and brightens the text.
- **Ghost:** muted text, no border; hover fills with surface 2.
- **Danger:** error fill, bold label; hover mixes 12% toward white.
- **Dashed:** full width, teal text, dashed slate outline; hover fills surface 1 and turns the outline teal. For "add another" slots.
- **Icons:** an optional leading and trailing icon (16px, 20px on large). With only an accessible label the button becomes a square icon button at its control height.
- **Plain:** Inter semibold, sentence case, untracked, for triggers whose text is a name or document title.
- **Pressed:** toggle buttons fill with the selected tone and strong text.
- **Focus / Disabled / Busy:** 2px teal outline offset 2px; disabled at 50% opacity; busy shows a spinning ring and a progress cursor. Motion drops to none under reduced motion.

### Split button
The main action and its alternatives as one unit: shared height, square inner corners, a 1px divider (action ink at 30% on primary, strong border on secondary). The chamfer moves to the outer top-right of the menu half. A primary split button is the view's one rust control ("Download PDF").

### Segmented control
A single choice among two to five modes or views. A 1px slate frame on surface 1 with 2px corners and hairline separators; segments in Rajdhani label style, muted, 32 or 40px tall, with an optional icon and count badge. Hover fills surface 2. The selected segment fills teal with charcoal ink in bold; its badge sits on a surface 1 backing so it stays readable. Icon-only segments keep their labels as accessible names. Arrow keys move and select, skipping disabled segments.

### Chips
- **Style:** 28px tall, slate border, transparent background, Inter at 0.8125rem; optional monospace count.
- **State:** interactive chips fill with surface 2 on hover; selected chips fill teal with charcoal ink. Removable chips split off a 28px remove target with a hairline divider.

### Cards / Containers (Panel)
- **Corner Style:** 4px.
- **Background:** surface 1, 2 or 3 by nesting depth.
- **Shadow Strategy:** none, unless `elevated` (see Elevation & Depth).
- **Border:** hairline border; header and footer separated by hairlines.
- **Internal Padding:** 8, 12, 16 or 24px.
- **Terrain:** brand headers may draw the terrain field behind their content.

### Inputs / Fields
- **Style:** 40px tall, surface 1 background, slate border, 2px corners, Inter body text (Iosevka when `mono`). Labels above in Rajdhani label style, muted.
- **Affixes:** a leading icon in muted text, a trailing unit in Iosevka at 0.75rem faint ("pt", "mm"), or custom leading and trailing content, all inside the one bordered field. Numbers set tabular.
- **Focus:** border turns teal with a soft 2px teal halo.
- **Error / Disabled:** error border and halo with an error message beneath; disabled at 50% opacity.

### Switch
An on/off setting with its label beside it. A 36 × 20px track (see The Pill Track Exception): off is surface 2 with a slate border and a muted 12px knob; on is a teal track with a charcoal knob that slides 16px. The label is Inter at 0.8125rem and toggles the switch; an optional description sits below in faint 0.75rem text. The hit area extends past the drawn track.

### Swatch picker
A grid of 24px colour squares (2px corners, default eight columns) with a faint inset border so pale colours still read on paper. The selected swatch gets a 2px strong-text outline and a check mark whose colour is chosen for contrast against the swatch. Arrow keys move in two dimensions.

### Badge, Marker, Kbd, Avatar
- **Badge:** an 18px count or tag, 2px corners, slate border, muted text; numbers in Iosevka, words in Rajdhani. Warning and error badges add a 15% tint of their tone.
- **Marker:** a numbered circle, 20px (16px small), filled with its tone and inked with the ground colour, Iosevka bold numerals. Amber by default; error, teal and slate tones exist.
- **Kbd:** keycaps in Iosevka at 0.75rem, 18px tall, slate border, 2px corners, one cap per key.
- **Avatar:** a circle (24/32/40px) on surface 3 with a slate border and Rajdhani initials from the first and last word, keeping Þ, Ð, Æ and Ö. A photo replaces the initials when it loads.

### Score ring
A circular meter, 64 or 88px: a track in the border colour and an arc in its tone (6 or 8px stroke, round caps) running clockwise from 12 o'clock, with the figure in the centre.

**The Computed Score Rule.** A score ring shows only a score the system computed. With no score it shows "—" and says "No score yet". The ring is teal while the verdict is positive and turns amber when it is negative; it never turns rust.

### Save status
Small 0.75rem status text with a 12px icon: "Saved" faint, "Saving…" muted with a spinning ring, "Not saved" amber, "Couldn't save" error. Announced politely.

### Menu
A trigger button opening a floating list. Surface 2, slate border, 4px corners, the medium shadow, 4px inner padding; optionally titled in small muted Rajdhani and laid out in two columns. Items are 32px rows with a 16px muted icon, Inter label and an optional Iosevka hint at the right; hover and keyboard focus fill surface 3 with strong text. Destructive items are error red; disabled items sit at 50%.

### Disclosure
A collapsible group with the title (Inter semibold, strong) inside the heading's toggle button and a chevron at the end; actions sit beside the toggle, never inside it. The section style is a plain row with a hairline below when open; the card style is a bordered surface 1 panel with 4px corners. Closed content stays mounted.

### Reorder list
An ordered list of sections, each row at least 36px: grip handle in faint text, label, Iosevka count, show/hide and expand toggles, and an optional row menu. Hidden sections fade to faint text with a crossed eye. Rows move by dragging the handle or with Alt plus the arrow keys; a 2px teal line shows where the row will land. Rust is not used: reordering is selection work, not position.

### Zoom control
A floating toolbar on surface 2 with the medium shadow: zoom out, the value in Iosevka ("Fit" or "125%"), zoom in, then an optional page count after a hairline. 25% steps between 25% and 400%.

### Issue card (signature)
One finding in the sidebar. A surface 1 card with a hairline border, 4px corners and 12/14px padding; the finding's marker in a left column (its number matches the marker on the page), an optional small category label, the title in Inter semibold strong, the explanation in muted 0.8125rem text and an action row below. The active card takes a teal border and the selected fill.

### App header
The editing shell's top bar on the charcoal ground with a hairline bottom edge: back and document title (Inter semibold, strong, ellipsised, with save status under it) at the start, a segmented mode switch in the centre, icon buttons and actions at the end.

### Page sheet and page annotation (signature)
A page sheet is exact-size paper with 56px margins, no corners and the medium shadow, labelled above in Iosevka ("Page 1 · A4"). It defaults to the Bone edition (see The Paper Edition Rule). A page annotation wraps a passage without changing its text: a small marker in the left margin and a wavy underline in the finding's tone; when active, a 10% tint of the tone behind the passage. Print hides markers, underlines, labels and shadows.

### Document parts
Parts that set the CV itself, as real semantic text a parser can read.
- **Doc header:** the name as the page heading, an optional headline, a wrapping row of contacts each led by a 12–16px teal icon (links underlined, teal on hover), then a suture with its rust tick.
- **Doc section:** a heading in Rajdhani semibold at 0.875rem, uppercase, tracked 0.14em, strong, with an 18 × 2px rust tick beneath it; one or two columns of content. The tick is drawn decoration with no text.
- **Doc entry:** title and subtitle at the left, date (Iosevka, tabular) and location in muted 0.75rem at the right; wraps on narrow pages; body text at 1.65 line height.

A full composition of these parts lives in `src/examples/CvEditor.svelte` (not packaged). It is a reference for how the parts combine, not a source of layout rules.

### Navigation
- **Style:** sticky bar on charcoal with a hairline bottom border; brand at left, destinations and actions at right.
- **Items:** Rajdhani label style, 32px tall. Hover fills surface 2. The active item goes bold and strong with a 3px rust underline sitting on the bar's bottom edge. Tabs use the same rust underline.
- **Mobile:** below 768px, destinations collapse behind a bordered, labelled toggle.

### Review status label (signature)
Compact 22px labels in Inter at 0.75rem with 2px corners, in three tones: `act` filled rust with the 12px warning icon and medium weight, `care` rust outline, `context` slate outline. They sort `act`, then `care`, then `context`, so "Known issues" leads a row. An unknown stored value renders as its raw text in the context tone.

### Document row (signature)
A 48px-minimum row with a hairline bottom border: title in Inter medium (teal on hover), monospace folder context in structure text, kind and statuses aligned right, excerpt clamped to three lines. Hover fills surface 1; selection fills the selected tone and lights a 3px rust bar on the left edge.

### Notice
Tinted surface (10% of the tone over surface 1) with a 1px tone border and a 20px line icon from the set; tones are accent, success, warning, error and neutral slate. Warnings and errors carry an icon and text, never colour alone.

## Do's and Don'ts

### Do:
- **Do** keep exactly one filled rust control per view, and use rust for "you are here" (3px underline, 3px row bar, 18px tick).
- **Do** use teal for every focus ring (2px outline, 2px offset) and for selection state on chips and filters.
- **Do** step surfaces (surface 1 → 2 → 3) to show nesting before reaching for a shadow.
- **Do** set file paths, identifiers and counts in Iosevka, and everything people read in Inter sentence case.
- **Do** style through component props and `--wm-*` tokens; unlayered consumer CSS overrides the `wm.base` and `wm.theme` layers.
- **Do** keep the Bone edition opt-in through `data-theme="bone"`; the page sheet is the one part that opts in by default.
- **Do** render documents on a page sheet (A4 794 × 1123px or Letter 816 × 1056px, 56px margins) and keep their text real and parseable.
- **Do** mark findings with an amber numbered marker in the page margin, a wavy underline, and a matching issue card.
- **Do** use the plain button style for names and document titles, and fill selected segments and switches teal.
- **Do** draw every icon from the IRONMAW set at 12, 16, 20 or 24px.

### Don't:
- **Don't** colour a warning rust; warnings are amber and must not look like an action.
- **Don't** add a green status or a "Verified" label, and never show a count the data cannot back.
- **Don't** set titles, excerpts, warnings or Icelandic prose in Rajdhani or in uppercase.
- **Don't** use the chamfer at any size other than 10px, or on anything but the primary action.
- **Don't** run terrain contours behind document text or controls; they belong to brand headers and empty states.
- **Don't** illustrate skulls; the Wormian idea lives in the structure, not the imagery.
- **Don't** hand-edit generated token outputs; change the DTCG sources and rebuild.
- **Don't** use unicode symbols or emoji as icons.
- **Don't** mark a finding in rust, or turn a score ring rust; findings and negative verdicts are amber.
- **Don't** show a score ring without a computed score; show "—" instead.
- **Don't** uppercase or track a person's name, a document title or user-entered text.
- **Don't** add a second rust control beside the primary split button; header actions around it are ghost or secondary.
- **Don't** reuse 10px numerals or the 10px pill radius outside the small marker, small avatar and switch track.
