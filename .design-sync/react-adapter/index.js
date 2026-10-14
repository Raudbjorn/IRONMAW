// Entry for the React adapter dist. Imports the library's REAL packaged
// components (dist/ — the same files any consumer's bundler compiles) and
// exposes each behind the wrap() adapter. Snippet-prop lists mirror each
// component's Props interface exactly.
import {
  Button as SvButton,
  Chip as SvChip,
  DocumentEntry as SvDocumentEntry,
  Heading as SvHeading,
  Input as SvInput,
  Kicker as SvKicker,
  Link as SvLink,
  LoadMore as SvLoadMore,
  Mark as SvMark,
  NavBar as SvNavBar,
  Notice as SvNotice,
  Panel as SvPanel,
  SearchField as SvSearchField,
  Select as SvSelect,
  SourceEntry as SvSourceEntry,
  Spinner as SvSpinner,
  Stack as SvStack,
  StatusLabel as SvStatusLabel,
  Suture as SvSuture,
  Tabs as SvTabs,
  Text as SvText,
} from '../../dist/index.js';
import { wrap } from './wrap.js';

export { ThemeRoot } from './wrap.js';

// Atoms
export const Text = wrap('Text', SvText, ['children']);
export const Heading = wrap('Heading', SvHeading, ['children']);
export const Kicker = wrap('Kicker', SvKicker, ['children']);
export const Button = wrap('Button', SvButton, ['children']);
export const Link = wrap('Link', SvLink, ['children']);
export const Chip = wrap('Chip', SvChip, []);
export const StatusLabel = wrap('StatusLabel', SvStatusLabel, []);
export const Input = wrap('Input', SvInput, []);
export const Select = wrap('Select', SvSelect, []);
export const Spinner = wrap('Spinner', SvSpinner, []);
export const Mark = wrap('Mark', SvMark, []);

// Layout
export const Stack = wrap('Stack', SvStack, ['children']);
export const Panel = wrap('Panel', SvPanel, ['children', 'header', 'footer']);
export const Suture = wrap('Suture', SvSuture, []);

// Molecules
export const SearchField = wrap('SearchField', SvSearchField, []);
export const Tabs = wrap('Tabs', SvTabs, []);
export const Notice = wrap('Notice', SvNotice, ['children', 'action']);
export const NavBar = wrap('NavBar', SvNavBar, ['children', 'brand']);

// Library workflow
export const DocumentEntry = wrap('DocumentEntry', SvDocumentEntry, ['excerpt', 'extra']);
export const SourceEntry = wrap('SourceEntry', SvSourceEntry, []);
export const LoadMore = wrap('LoadMore', SvLoadMore, []);

// Vocabulary + tokens as data — pure pass-through of the compiled library.
export { REVIEW_STATUS, reviewStatusCopy, sortReviewStatuses } from '../../dist/review-status.js';
export { contrastRatio } from '../../dist/internal/contrast.js';
export { brand, oxide, bone, editions } from '../../dist/tokens/palette.js';
export { bearMark, BEAR_MARK_WIDTH, BEAR_MARK_HEIGHT } from '../../dist/assets/bear-mark.js';
