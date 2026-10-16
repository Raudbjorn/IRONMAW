// IRONMAW — the Wormian Bones design system. Public barrel.
// Every public change here must be mirrored in .design-sync/react-adapter/
// (index.js + index.d.ts) and given an owned preview — see .design-sync/NOTES.md.

// Atoms (the ossicles)
export { default as Text } from './components/atoms/Text.svelte';
export { default as Heading } from './components/atoms/Heading.svelte';
export { default as Kicker } from './components/atoms/Kicker.svelte';
export { default as Button } from './components/atoms/Button.svelte';
export { default as Link } from './components/atoms/Link.svelte';
export { default as Chip } from './components/atoms/Chip.svelte';
export { default as StatusLabel } from './components/atoms/StatusLabel.svelte';
export { default as Input } from './components/atoms/Input.svelte';
export { default as Select } from './components/atoms/Select.svelte';
export { default as Spinner } from './components/atoms/Spinner.svelte';
export { default as Mark } from './components/atoms/Mark.svelte';
export { default as Icon } from './components/atoms/Icon.svelte';
export { default as Badge } from './components/atoms/Badge.svelte';
export { default as Marker } from './components/atoms/Marker.svelte';
export { default as Switch } from './components/atoms/Switch.svelte';
export { default as Avatar } from './components/atoms/Avatar.svelte';
export { default as Kbd } from './components/atoms/Kbd.svelte';
export { default as ScoreRing } from './components/atoms/ScoreRing.svelte';
export { default as SaveStatus } from './components/atoms/SaveStatus.svelte';
export { default as Textarea } from './components/atoms/Textarea.svelte';
export { default as Checkbox } from './components/atoms/Checkbox.svelte';

// Layout
export { default as Stack } from './components/layout/Stack.svelte';
export { default as Panel } from './components/layout/Panel.svelte';
export { default as Suture } from './components/layout/Suture.svelte';
export { default as Workspace } from './components/layout/Workspace.svelte';
export { default as PageCanvas } from './components/layout/PageCanvas.svelte';
export { default as PageSheet } from './components/layout/PageSheet.svelte';
export { default as PageAnnotation } from './components/layout/PageAnnotation.svelte';
export { default as ChangeMark } from './components/layout/ChangeMark.svelte';
export { default as StatusBar } from './components/layout/StatusBar.svelte';

// Molecules
export { default as SearchField } from './components/molecules/SearchField.svelte';
export { default as Tabs } from './components/molecules/Tabs.svelte';
export { default as Notice } from './components/molecules/Notice.svelte';
export { default as NavBar } from './components/molecules/NavBar.svelte';
export { default as SegmentedControl } from './components/molecules/SegmentedControl.svelte';
export type { SegmentOption } from './components/molecules/SegmentedControl.svelte';
export { default as SwatchPicker } from './components/molecules/SwatchPicker.svelte';
export type { Swatch } from './components/molecules/SwatchPicker.svelte';
export { default as Menu } from './components/molecules/Menu.svelte';
export type { MenuEntry } from './components/molecules/Menu.svelte';
export { default as SplitButton } from './components/molecules/SplitButton.svelte';
export { default as ZoomControl } from './components/molecules/ZoomControl.svelte';
export { default as Disclosure } from './components/molecules/Disclosure.svelte';
export { default as ReorderList } from './components/molecules/ReorderList.svelte';
export type { ReorderItem } from './components/molecules/ReorderList.svelte';
export { default as IssueCard } from './components/molecules/IssueCard.svelte';
export { default as AppHeader } from './components/molecules/AppHeader.svelte';
export { default as Dialog } from './components/molecules/Dialog.svelte';
export { default as EmptyState } from './components/molecules/EmptyState.svelte';

// Library workflow
export { default as DocumentEntry } from './components/library/DocumentEntry.svelte';
export { default as SourceEntry } from './components/library/SourceEntry.svelte';
export { default as LoadMore } from './components/library/LoadMore.svelte';

// Document (styled pages: CVs, letters — Bone inside a PageSheet)
export { default as DocHeader } from './components/document/DocHeader.svelte';
export { default as DocSection } from './components/document/DocSection.svelte';
export { default as DocEntry } from './components/document/DocEntry.svelte';
export type { DocContact } from './components/document/DocHeader.svelte';

// Icons as data (shared with native consumers)
export { ICONS, ICON_NAMES, iconStroke } from './icons.ts';
export type { IconName } from './icons.ts';

// Vocabulary and tokens as data
export { REVIEW_STATUS, reviewStatusCopy, sortReviewStatuses } from './review-status.ts';
export type { ReviewStatus, ReviewStatusCopy, ReviewTone } from './review-status.ts';
export { contrastRatio } from './internal/contrast.ts';
export { brand, oxide, bone, editions } from './tokens/palette.ts';
export type { Palette, TokenName, EditionName } from './tokens/palette.ts';
export { bearMark, BEAR_MARK_WIDTH, BEAR_MARK_HEIGHT } from './assets/bear-mark.ts';
