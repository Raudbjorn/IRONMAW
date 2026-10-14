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

// Layout
export { default as Stack } from './components/layout/Stack.svelte';
export { default as Panel } from './components/layout/Panel.svelte';
export { default as Suture } from './components/layout/Suture.svelte';

// Molecules
export { default as SearchField } from './components/molecules/SearchField.svelte';
export { default as Tabs } from './components/molecules/Tabs.svelte';
export { default as Notice } from './components/molecules/Notice.svelte';
export { default as NavBar } from './components/molecules/NavBar.svelte';

// Library workflow
export { default as DocumentEntry } from './components/library/DocumentEntry.svelte';
export { default as SourceEntry } from './components/library/SourceEntry.svelte';
export { default as LoadMore } from './components/library/LoadMore.svelte';

// Vocabulary and tokens as data
export { REVIEW_STATUS, reviewStatusCopy, sortReviewStatuses } from './review-status.ts';
export type { ReviewStatus, ReviewStatusCopy, ReviewTone } from './review-status.ts';
export { contrastRatio } from './internal/contrast.ts';
export { brand, oxide, bone, editions } from './tokens/palette.ts';
export type { Palette, TokenName, EditionName } from './tokens/palette.ts';
export { bearMark, BEAR_MARK_WIDTH, BEAR_MARK_HEIGHT } from './assets/bear-mark.ts';
