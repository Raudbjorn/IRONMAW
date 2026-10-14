// React-surface types for @svnbjrn/ironmaw — the Svelte 5 library consumed
// through its React adapter (see .design-sync/react-adapter/). Props mirror
// each component's Svelte Props interface 1:1; snippet props (children,
// header, footer, brand, action, excerpt, extra) accept React nodes.
// Lowercase Svelte event names remain canonical; matching React camelCase
// aliases (onClick, onSubmit, onRemove, onOpen, onCopy, onDismiss, onClear,
// onChange, onInput) are also accepted.
import * as React from 'react';

/** Edition frame: sets data-theme and paints the token canvas. */
export interface ThemeRootProps {
  /** "oxide" (default — charcoal, teal, rust, slate) or "bone" (proposed paper-toned reading edition). */
  theme?: 'oxide' | 'bone';
  children?: React.ReactNode;
}
export declare const ThemeRoot: React.FC<ThemeRootProps>;

/** Body text. Inter for interface and prose; mono = Iosevka for paths and locators. */
export interface TextProps {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
  tone?: 'default' | 'strong' | 'muted' | 'faint' | 'accent' | 'action';
  mono?: boolean;
  /** Reading measure: 68ch, 16px, relaxed leading. For extracted-text bodies. */
  prose?: boolean;
  as?: 'p' | 'span' | 'div';
  children: React.ReactNode;
}
export declare const Text: React.FC<TextProps>;

/** Heading ramp h1–h4. display = Rajdhani uppercase tracked (section titles like LIBRARY, never document titles). */
export interface HeadingProps {
  level?: 1 | 2 | 3 | 4;
  display?: boolean;
  children: React.ReactNode;
}
export declare const Heading: React.FC<HeadingProps>;

/** Small uppercase display label (the brand boards' "COLOR PALETTE"). Short labels only. */
export interface KickerProps {
  as?: 'span' | 'div' | 'label' | 'h2' | 'h3' | 'h4';
  tone?: 'muted' | 'strong' | 'accent' | 'action';
  /** The short rust tick beneath the label. */
  tick?: boolean;
  /** When as="label": the control it names. */
  for?: string;
  children: React.ReactNode;
}
export declare const Kicker: React.FC<KickerProps>;

/**
 * Button — rust fill, charcoal label and one clipped corner for primary.
 * Labels are the display face, uppercase, tracked: short verbs only.
 * Renders an anchor when href is set.
 */
export interface ButtonProps {
  /** primary = rust fill (chamfered), secondary = slate outline, ghost = text only, danger = error fill. */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  /** Busy state: aria-busy + disabled, small ring before the label. */
  loading?: boolean;
  /** The clipped corner. Defaults on for primary and danger, off otherwise. */
  chamfer?: boolean;
  /** Icon-only button: children are the glyph; label is the accessible name. */
  label?: string;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  /** Svelte 5 callback prop — lowercase. */
  onclick?: (e: MouseEvent) => void;
  children: React.ReactNode;
}
export declare const Button: React.FC<ButtonProps>;

/** Inline teal link. quiet = muted until hovered (secondary in-row actions). */
export interface LinkProps {
  href: string;
  external?: boolean;
  quiet?: boolean;
  onclick?: (e: MouseEvent) => void;
  children: React.ReactNode;
}
export declare const Link: React.FC<LinkProps>;

/** Filter chip. selected = teal fill (state, never hierarchy). onremove renders "Remove <label>". */
export interface ChipProps {
  label: string;
  count?: number | string;
  selected?: boolean;
  /** Makes the chip itself a button (aria-pressed = selected). */
  onclick?: (e: MouseEvent) => void;
  onremove?: () => void;
  removeLabel?: string;
}
export declare const Chip: React.FC<ChipProps>;

/**
 * Review-status label. Three tones only: act (filled rust + triangle, "Known
 * issues"), care (rust outline), context (slate outline). Text stays in
 * --wm-text. Unknown stored values render raw in the context tone.
 */
export interface StatusLabelProps {
  /** Stored value, e.g. "known-errors", "review-required", "snapshot". */
  status: string;
  label?: string;
  tone?: 'act' | 'care' | 'context';
}
export declare const StatusLabel: React.FC<StatusLabelProps>;

/** Outlined dark field: slate outline, teal focus, display-face label. */
export interface InputProps {
  value?: string;
  id?: string;
  name?: string;
  label?: string;
  hint?: string;
  error?: string | boolean;
  type?: 'text' | 'email' | 'password' | 'search' | 'url';
  placeholder?: string;
  mono?: boolean;
  disabled?: boolean;
  readonly?: boolean;
  oninput?: (e: Event) => void;
}
export declare const Input: React.FC<InputProps>;

/** Native select in the outlined-field dress — the five library filters. */
export interface SelectOption {
  value: string;
  label: string;
}
export interface SelectProps {
  value?: string;
  options: SelectOption[];
  id?: string;
  name?: string;
  label?: string;
  disabled?: boolean;
  onchange?: (e: Event) => void;
}
export declare const Select: React.FC<SelectProps>;

/** Busy ring (slate track, teal arc). Static under reduced motion. */
export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
}
export declare const Spinner: React.FC<SpinnerProps>;

/**
 * The identity. bear = the full supplied vector; emblem = the compact mark;
 * wordmark = IRONMAW in the display face; small lockups use the emblem.
 * plate seats the bear on its charcoal plate (brand-board treatment).
 */
export interface MarkProps {
  variant?: 'bear' | 'emblem' | 'wordmark' | 'lockup';
  /** The name on paper. Default "IRONMAW". */
  name?: string;
  /** Second line, e.g. "Wormian Bones" or the product name. */
  tagline?: string;
  size?: 'sm' | 'md' | 'lg';
  plate?: boolean;
  alt?: string;
  href?: string;
}
export declare const Mark: React.FC<MarkProps>;

/** The only layout primitive. gap takes scale steps (4px units: 1,2,3,4,6,8,12), not pixels. */
export interface StackProps {
  as?: 'div' | 'section' | 'article' | 'nav' | 'header' | 'footer' | 'main' | 'aside' | 'form' | 'ul' | 'ol';
  direction?: 'column' | 'row';
  gap?: 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12;
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between';
  wrap?: boolean;
  style?: string;
  'aria-label'?: string;
  children: React.ReactNode;
}
export declare const Stack: React.FC<StackProps>;

/** A fitted surface: tonal step, quiet border, small radius. The reader and navigation are Panels. */
export interface PanelProps {
  as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'nav' | 'li';
  surface?: 1 | 2 | 3;
  padding?: 0 | 2 | 3 | 4 | 6;
  elevated?: boolean;
  /** Contour and mountain treatment for brand headers and empty states. */
  terrain?: boolean;
  'aria-label'?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
}
export declare const Panel: React.FC<PanelProps>;

/** The seam — the signature. Thin slate line with a rust tick and optional display label. */
export interface SutureProps {
  label?: string;
  tick?: boolean;
  orientation?: 'horizontal' | 'vertical';
}
export declare const Suture: React.FC<SutureProps>;

/** "Search library": labelled search landmark, explicit submit, obvious clear, never disabled. */
export interface SearchFieldProps {
  value?: string;
  label?: string;
  placeholder?: string;
  submitLabel?: string;
  busyLabel?: string;
  clearLabel?: string;
  /** A search is in flight; the field stays editable. */
  busy?: boolean;
  maxlength?: number;
  hint?: string;
  /** Rejected input; keeps the field editable. */
  error?: string;
  name?: string;
  id?: string;
  onsubmit?: (value: string) => void;
  onclear?: () => void;
}
export declare const SearchField: React.FC<SearchFieldProps>;

/** The reader's view switcher. Rust underline, roving tabindex. Panels are consumer-rendered. */
export interface TabItem {
  id: string;
  label: string;
  count?: number | string;
  tabId: string;
  panelId: string;
}
export interface TabsProps {
  tabs: TabItem[];
  value?: string;
  onchange?: (id: string) => void;
  'aria-label'?: string;
}
export declare const Tabs: React.FC<TabsProps>;

/** Page-level or inline notice. warning/error are amber/red (never rust) and role=alert. */
export interface NoticeProps {
  tone?: 'info' | 'success' | 'warning' | 'error' | 'status';
  title?: string;
  /** Recovery control, e.g. a Retry button. */
  action?: React.ReactNode;
  dismissLabel?: string;
  ondismiss?: () => void;
  children: React.ReactNode;
}
export declare const Notice: React.FC<NoticeProps>;

/** Compact branded shell. Active item = rust fill with the chamfer. Collapses behind a labelled toggle below 768px. */
export interface NavBarItem {
  href: string;
  label: string;
  active?: boolean;
}
export interface NavBarProps {
  brand?: React.ReactNode;
  items?: NavBarItem[];
  navLabel?: string;
  menuLabel?: string;
  closeLabel?: string;
  /** Right-aligned actions. */
  children?: React.ReactNode;
}
export declare const NavBar: React.FC<NavBarProps>;

/**
 * One row per document. Title is the focusable control; the row supplements it.
 * selected = tonal fill + rust edge + aria-current. "Known issues" sorts first.
 */
export interface DocumentEntryProps {
  as?: 'li' | 'article' | 'div';
  title: string;
  /** Distinguishing context: category, employer/session or short location. */
  context?: string;
  language?: string;
  format?: string;
  /** Stored review-status values. */
  statuses?: string[];
  /** Exact-copy file locations; shown only when greater than one. */
  locations?: number;
  /** "{n} file locations" */
  locationsLabel?: string;
  selected?: boolean;
  href?: string;
  onopen?: () => void;
  /** Up to three readable lines; use <mark> for hits. */
  excerpt?: React.ReactNode;
  /** Secondary row content, e.g. "2 more matches in this document". */
  extra?: React.ReactNode;
}
export declare const DocumentEntry: React.FC<DocumentEntryProps>;

/** One recorded file location: compact row, expandable provenance, copy-path action. Missing fields say "Not recorded". */
export interface SourceField {
  label: string;
  value?: string;
  mono?: boolean;
}
export interface SourceEntryProps {
  path: string;
  index?: number;
  summary?: string;
  fields?: SourceField[];
  notRecorded?: string;
  copyLabel?: string;
  copiedText?: string;
  detailsLabel?: string;
  hideDetailsLabel?: string;
  /** Set after the clipboard write succeeds. */
  copied?: boolean;
  expanded?: boolean;
  oncopy?: (path: string) => void;
}
export declare const SourceEntry: React.FC<SourceEntryProps>;

/** Result-list continuation. No totals until the API returns a reliable count. */
export interface LoadMoreProps {
  state?: 'idle' | 'loading' | 'failed' | 'end';
  label?: string;
  loadingLabel?: string;
  failedText?: string;
  retryLabel?: string;
  endText?: string;
  onclick?: () => void;
}
export declare const LoadMore: React.FC<LoadMoreProps>;

// Vocabulary + tokens as data
export type ReviewTone = 'act' | 'care' | 'context';
export interface ReviewStatusCopy {
  label: string;
  tone: ReviewTone;
}
export declare const REVIEW_STATUS: Record<string, ReviewStatusCopy>;
export declare function reviewStatusCopy(status: string): ReviewStatusCopy;
export declare function sortReviewStatuses(statuses: readonly string[]): string[];
export declare function contrastRatio(a: string, b: string): number;
export declare const brand: { teal: string; slate: string; rust: string; charcoal: string };
export declare const oxide: Record<string, string>;
export declare const bone: Record<string, string>;
export declare const editions: { oxide: Record<string, string>; bone: Record<string, string> };
export declare const bearMark: string;
export declare const BEAR_MARK_WIDTH: number;
export declare const BEAR_MARK_HEIGHT: number;
export declare const bearEmblem: string;
export declare const BEAR_EMBLEM_WIDTH: number;
export declare const BEAR_EMBLEM_HEIGHT: number;
