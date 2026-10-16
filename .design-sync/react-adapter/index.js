// Entry for the React adapter dist. Imports the library's REAL packaged
// components (dist/ — the same files any consumer's bundler compiles) and
// exposes each behind the wrap() adapter. Snippet-prop lists mirror each
// component's Props interface exactly.
import {
  AppHeader as SvAppHeader,
  Avatar as SvAvatar,
  Badge as SvBadge,
  Textarea as SvTextarea,
  StatusBar as SvStatusBar,
  EmptyState as SvEmptyState,
  Dialog as SvDialog,
  ChangeMark as SvChangeMark,
  Checkbox as SvCheckbox,
  Button as SvButton,
  Chip as SvChip,
  Disclosure as SvDisclosure,
  DocEntry as SvDocEntry,
  DocHeader as SvDocHeader,
  DocSection as SvDocSection,
  DocumentEntry as SvDocumentEntry,
  Heading as SvHeading,
  Icon as SvIcon,
  Input as SvInput,
  IssueCard as SvIssueCard,
  Kbd as SvKbd,
  Kicker as SvKicker,
  Link as SvLink,
  LoadMore as SvLoadMore,
  Mark as SvMark,
  Marker as SvMarker,
  Menu as SvMenu,
  NavBar as SvNavBar,
  Notice as SvNotice,
  PageAnnotation as SvPageAnnotation,
  PageCanvas as SvPageCanvas,
  PageSheet as SvPageSheet,
  Panel as SvPanel,
  ReorderList as SvReorderList,
  SaveStatus as SvSaveStatus,
  ScoreRing as SvScoreRing,
  SearchField as SvSearchField,
  SegmentedControl as SvSegmentedControl,
  Select as SvSelect,
  SourceEntry as SvSourceEntry,
  Spinner as SvSpinner,
  SplitButton as SvSplitButton,
  Stack as SvStack,
  StatusLabel as SvStatusLabel,
  Suture as SvSuture,
  SwatchPicker as SvSwatchPicker,
  Switch as SvSwitch,
  Tabs as SvTabs,
  Text as SvText,
  Workspace as SvWorkspace,
  ZoomControl as SvZoomControl,
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
export const Input = wrap('Input', SvInput, ['leading', 'trailing']);
export const Select = wrap('Select', SvSelect, []);
export const Spinner = wrap('Spinner', SvSpinner, []);
export const Mark = wrap('Mark', SvMark, []);
export const Icon = wrap('Icon', SvIcon, []);
export const Badge = wrap('Badge', SvBadge, []);
export const Marker = wrap('Marker', SvMarker, []);
export const Switch = wrap('Switch', SvSwitch, []);
export const Avatar = wrap('Avatar', SvAvatar, []);
export const Kbd = wrap('Kbd', SvKbd, []);
export const ScoreRing = wrap('ScoreRing', SvScoreRing, []);
export const SaveStatus = wrap('SaveStatus', SvSaveStatus, []);
export const SegmentedControl = wrap('SegmentedControl', SvSegmentedControl, []);
export const SwatchPicker = wrap('SwatchPicker', SvSwatchPicker, []);
export const Textarea = wrap('Textarea', SvTextarea, []);
export const Checkbox = wrap('Checkbox', SvCheckbox, []);
export const Dialog = wrap('Dialog', SvDialog, ['children', 'footer']);
export const EmptyState = wrap('EmptyState', SvEmptyState, ['children', 'actions']);
export const ChangeMark = wrap('ChangeMark', SvChangeMark, ['children']);
export const StatusBar = wrap('StatusBar', SvStatusBar, ['end']);
export const Menu = wrap('Menu', SvMenu, []);
export const SplitButton = wrap('SplitButton', SvSplitButton, []);
export const ZoomControl = wrap('ZoomControl', SvZoomControl, []);
export const Disclosure = wrap('Disclosure', SvDisclosure, ['leading', 'actions', 'children']);
export const ReorderList = wrap('ReorderList', SvReorderList, ['detail']);

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

// Editor shell, page canvas and findings
export const AppHeader = wrap('AppHeader', SvAppHeader, ['heading', 'status', 'center', 'end']);
export const IssueCard = wrap('IssueCard', SvIssueCard, ['children', 'actions']);
export const Workspace = wrap('Workspace', SvWorkspace, ['header', 'sidebar', 'children']);
export const PageCanvas = wrap('PageCanvas', SvPageCanvas, ['children', 'toolbar', 'overlay']);
export const PageSheet = wrap('PageSheet', SvPageSheet, ['children']);
export const PageAnnotation = wrap('PageAnnotation', SvPageAnnotation, ['children']);

// Document (CV and letter pages; Bone inside a PageSheet)
export const DocHeader = wrap('DocHeader', SvDocHeader, []);
export const DocSection = wrap('DocSection', SvDocSection, ['children']);
export const DocEntry = wrap('DocEntry', SvDocEntry, ['children']);

// Vocabulary + tokens as data — pure pass-through of the compiled library.
export { REVIEW_STATUS, reviewStatusCopy, sortReviewStatuses } from '../../dist/review-status.js';
export { contrastRatio } from '../../dist/internal/contrast.js';
export { brand, oxide, bone, editions } from '../../dist/tokens/palette.js';
export { bearMark, BEAR_MARK_WIDTH, BEAR_MARK_HEIGHT } from '../../dist/assets/bear-mark.js';
export { ICONS, ICON_NAMES, iconStroke } from '../../dist/icons.js';
