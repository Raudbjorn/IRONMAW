// React-surface types for @svnbjrn/ironmaw — the Svelte 5 library consumed
// through its React adapter (see .design-sync/react-adapter/). Props mirror
// each component's Svelte Props interface 1:1; snippet props (children,
// header, footer, brand, action, excerpt, extra) accept React nodes.
// Lowercase Svelte event names remain canonical; matching React camelCase
// aliases (onClick, onSubmit, onRemove, onOpen, onCopy, onDismiss, onClear,
// onChange, onInput, onSelect, onMove, onVisibility, onExpand, onMenu) are
// also accepted.
import * as React from 'react';

/** Edition frame: sets data-theme and paints the token canvas. */
export interface ThemeRootProps {
  /** "oxide" (default — charcoal, teal, rust, slate) or "bone" (proposed paper-toned reading edition). */
  theme?: 'oxide' | 'bone';
  children?: React.ReactNode;
}
export declare const ThemeRoot: React.FC<ThemeRootProps>;

/** Every icon in the IRONMAW set (24-unit grid, one stroke weight). */
export type IconName =
  'arrow-left' | 'chevron-down' | 'chevron-up' | 'chevron-left' | 'chevron-right' | 'more' |
  'menu' | 'grip' | 'plus' | 'minus' | 'close' | 'check' | 'search' | 'write' | 'design' |
  'checklist' | 'history' | 'assist' | 'share' | 'download' | 'copy' | 'trash' | 'zoom-fit' |
  'heading' | 'eye' | 'eye-off' | 'saved' | 'unsaved' | 'warning' | 'info' | 'error' | 'success' |
  'refresh' | 'file' | 'code' | 'image' | 'camera' | 'tag' | 'mail' | 'phone' | 'location' |
  'external' | 'link' | 'globe' | 'user' | 'users' | 'summary' | 'experience' | 'education' | 'skills' |
  'projects' | 'awards' | 'certifications' | 'publications' | 'volunteer' | 'languages' |
  'interests' | 'references' | 'profiles' | 'mountain';
/** Icon path data, shared with native consumers. Render stroke-only: fill="none" stroke="currentColor". */
export declare const ICONS: Record<IconName, string>;
export declare const ICON_NAMES: IconName[];
/** Stroke width in grid units for a pixel size (heavier at 12/16px). */
export declare function iconStroke(size: number): number;

/** One drawn line icon. Decorative unless label is set. */
export interface IconProps {
  name: IconName;
  size?: 12 | 16 | 20 | 24;
  /** Accessible name; without it the icon is aria-hidden. */
  label?: string;
  tone?: 'inherit' | 'muted' | 'accent' | 'action' | 'warning' | 'error' | 'success';
}
export declare const Icon: React.FC<IconProps>;

/** Short figure or tag riding on a control (a count of open checks, "New"). Numbers are Iosevka, tabular. Never a placeholder count. */
export interface BadgeProps {
  value: number | string;
  tone?: 'neutral' | 'accent' | 'warning' | 'error';
  /** Accessible text when the bare value is ambiguous, e.g. "6 checks to review". */
  label?: string;
}
export declare const Badge: React.FC<BadgeProps>;

/** Numbered finding dot tying a list item to its place on the page. Warning = amber (never rust). */
export interface MarkerProps {
  value: number | string;
  tone?: 'warning' | 'error' | 'accent' | 'neutral';
  size?: 'sm' | 'md';
  /** Accessible text, e.g. "Finding 3"; without it the marker is decorative. */
  label?: string;
}
export declare const Marker: React.FC<MarkerProps>;

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
  /** primary = rust fill (chamfered), secondary = slate outline, ghost = text only, danger = error fill, dashed = empty slot inviting an addition ("Add section"). */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dashed';
  /** xs = 28px in-row controls. */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  href?: string;
  type?: 'button' | 'submit';
  disabled?: boolean;
  /** Busy state: aria-busy + disabled, small ring before the label. */
  loading?: boolean;
  /** The clipped corner. Defaults on for primary and danger, off otherwise. */
  chamfer?: boolean;
  /** Icon-only button: set label (accessible name) + icon, no children. */
  label?: string;
  /** Leading icon from the IRONMAW set. */
  icon?: IconName;
  /** Trailing icon, e.g. chevron-down on a menu trigger. */
  iconEnd?: IconName;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
  'aria-haspopup'?: 'menu' | 'listbox' | 'dialog' | boolean;
  'aria-pressed'?: boolean;
  /** Svelte 5 callback prop — lowercase. */
  onclick?: (e: MouseEvent) => void;
  children?: React.ReactNode;
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
  type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel' | 'number';
  placeholder?: string;
  mono?: boolean;
  /** Unit after the value inside the outline, e.g. "pt" or "×". */
  unit?: string;
  /** Decorative icon at the end of the field. */
  icon?: IconName;
  /** Content before the value, e.g. a colour swatch. */
  leading?: React.ReactNode;
  /** Control after the value, e.g. a reveal button. */
  trailing?: React.ReactNode;
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
 * The identity. bear = the full supplied vector (used at every size);
 * wordmark = IRONMAW in the display face; lockup = both.
 * plate seats the bear on its charcoal plate (brand-board treatment).
 */
export interface MarkProps {
  variant?: 'bear' | 'wordmark' | 'lockup';
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

/** A contact line item in a document header. email/phone get mailto:/tel: links when href is absent. */
export type DocContact = {
  kind: 'email' | 'phone' | 'location' | 'website' | 'profile' | 'other';
  value: string;
  href?: string;
};
/** Document title block: name (h1), headline, contact list with icons, rust-ticked rule below. Renders inside a PageSheet. */
export interface DocHeaderProps {
  name: string;
  headline?: string;
  contacts?: DocContact[];
}
export declare const DocHeader: React.FC<DocHeaderProps>;
/** Document section: h2 in the display face with a rust tick; columns=2 lays children in a two-column grid. */
export interface DocSectionProps {
  title: string;
  columns?: 1 | 2;
  children?: React.ReactNode;
}
export declare const DocSection: React.FC<DocSectionProps>;
/** One document entry (role, school, skill group): title/subtitle left, date/location right, optional body. */
export interface DocEntryProps {
  title: string;
  subtitle?: string;
  date?: string;
  location?: string;
  children?: React.ReactNode;
}
export declare const DocEntry: React.FC<DocEntryProps>;

/** Editor top bar: back, document title (or a heading snippet such as a Menu), status line, centre switch, end actions. Centre drops to its own row below 768px. */
export interface AppHeaderProps {
  back?: { label: string; href?: string; onclick?: () => void };
  title?: string;
  heading?: React.ReactNode;
  status?: React.ReactNode;
  center?: React.ReactNode;
  end?: React.ReactNode;
}
export declare const AppHeader: React.FC<AppHeaderProps>;
/** One finding: numbered Marker, small category label, title, explanation, actions. active = the finding shown on the page (teal border, selected fill). */
export interface IssueCardProps {
  index: number | string;
  category?: string;
  title: string;
  tone?: 'warning' | 'error' | 'accent';
  active?: boolean;
  children: React.ReactNode;
  actions?: React.ReactNode;
}
export declare const IssueCard: React.FC<IssueCardProps>;
/** Editor shell: header row, scrolling sidebar (surface-1) and main canvas. fill = 100dvh with internal scrolling. Stacks below 1024px. */
export interface WorkspaceProps {
  header?: React.ReactNode;
  sidebar: React.ReactNode;
  children: React.ReactNode;
  sidebarLabel: string;
  /** CSS length; default var(--wm-sidebar) (320px). */
  sidebarWidth?: string;
  fill?: boolean;
}
export declare const Workspace: React.FC<WorkspaceProps>;
/** Scrolling preview area for page sheets. zoom in percent or 'fit' (fits pageWidth to the available width). Needs a parent with a definite height. */
export interface PageCanvasProps {
  children: React.ReactNode;
  /** Sticky top-centre control, e.g. a SegmentedControl. */
  toolbar?: React.ReactNode;
  /** Floating bottom-centre control, e.g. a ZoomControl. */
  overlay?: React.ReactNode;
  zoom?: number | 'fit';
  pageWidth?: number;
  'aria-label'?: string;
}
export declare const PageCanvas: React.FC<PageCanvasProps>;
/** A physical page (A4 or Letter at 96 dpi) with page-margin padding. Defaults to the Bone edition: the paper. label shows above the sheet, e.g. "Page 1 · A4". */
export interface PageSheetProps {
  size?: 'a4' | 'letter';
  label?: string;
  edition?: 'bone' | 'oxide' | 'inherit';
  'aria-label'?: string;
  children: React.ReactNode;
}
export declare const PageSheet: React.FC<PageSheetProps>;
/** Marks a finding on the page without changing its text: numbered Marker in the left page margin + wavy underline. Hidden in print. Place at the sheet's content edge. */
export interface PageAnnotationProps {
  index: number | string;
  label: string;
  tone?: 'warning' | 'error' | 'accent';
  active?: boolean;
  as?: 'div' | 'span';
  children: React.ReactNode;
}
export declare const PageAnnotation: React.FC<PageAnnotationProps>;

/** On/off setting (role=switch). Teal track when on. Clicking the label toggles. */
export interface SwitchProps {
  checked?: boolean;
  label: string;
  description?: string;
  disabled?: boolean;
  onchange?: (checked: boolean) => void;
  id?: string;
}
export declare const Switch: React.FC<SwitchProps>;
/** Person initials (Icelandic letters kept) or photo; falls back to initials if the photo fails. */
export interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
}
export declare const Avatar: React.FC<AvatarProps>;
/** Keyboard keys, e.g. ['⌥', '↑', '↓'] for a move hint. */
export interface KbdProps {
  keys: string[];
  /** Spoken form, e.g. "Alt plus Up or Down". */
  label?: string;
}
export declare const Kbd: React.FC<KbdProps>;
/** Circular meter (role=meter): teal arc, figure in the centre. Pass only scores the data can back. */
export interface ScoreRingProps {
  value: number;
  max?: number;
  label: string;
  size?: 'md' | 'lg';
  tone?: 'accent' | 'warning' | 'error';
}
export declare const ScoreRing: React.FC<ScoreRingProps>;
/** Save state line: Saved / Saving… / Not saved / Couldn't save (role=status). */
export interface SaveStatusProps {
  state: 'saved' | 'saving' | 'unsaved' | 'error';
  label?: string;
}
export declare const SaveStatus: React.FC<SaveStatusProps>;
export type SegmentOption = {
  id: string;
  label: string;
  icon?: IconName;
  count?: number;
  countTone?: 'neutral' | 'warning' | 'accent';
  countLabel?: string;
  disabled?: boolean;
};
/** Mode switch (radiogroup): teal-filled selected segment, icon + tracked label, optional count badge. */
export interface SegmentedControlProps {
  options: SegmentOption[];
  value?: string;
  onchange?: (id: string) => void;
  'aria-label': string;
  size?: 'sm' | 'md';
  /** Labels become accessible names only. */
  iconOnly?: boolean;
}
export declare const SegmentedControl: React.FC<SegmentedControlProps>;
export type Swatch = { value: string; label: string };
/** Colour choice grid (radiogroup, 2-D arrow keys). Values are any CSS colour. */
export interface SwatchPickerProps {
  colors: Swatch[];
  value?: string;
  onchange?: (value: string) => void;
  'aria-label': string;
  columns?: number;
}
export declare const SwatchPicker: React.FC<SwatchPickerProps>;

export type MenuEntry =
  | { id: string; label: string; icon?: IconName; hint?: string; danger?: boolean; disabled?: boolean; wide?: boolean; submenu?: boolean }
  | { separator: true; id?: string };
/** Trigger button + popup menu (role=menu). columns=2 for a grid of choices (e.g. "Add section"); wide items span the row. Popup is position:fixed (avoid transformed ancestors). */
export interface MenuProps {
  /** Trigger accessible name. */
  label: string;
  /** Visible trigger text; omit for icon-only. */
  text?: string;
  /** Default 'more'. */
  icon?: IconName;
  iconEnd?: IconName;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dashed';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  items: MenuEntry[];
  columns?: 1 | 2;
  /** Small heading inside the popup. */
  title?: string;
  open?: boolean;
  disabled?: boolean;
  placement?: 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';
  chamfer?: boolean;
  onselect?: (id: string) => void;
}
export declare const Menu: React.FC<MenuProps>;
/** Main action with an attached options menu, one unit; chamfer on the outer corner. */
export interface SplitButtonProps {
  label: string;
  icon?: IconName;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  onclick?: (e: MouseEvent) => void;
  /** Accessible name of the menu half, e.g. "More download options". */
  menuLabel: string;
  items: MenuEntry[];
  onselect?: (id: string) => void;
  loading?: boolean;
  disabled?: boolean;
}
export declare const SplitButton: React.FC<SplitButtonProps>;
/** Zoom toolbar: out / value (Fit or %) / in, optional page count. Floating = raised surface for canvas overlays. */
export interface ZoomControlProps {
  value: number | 'fit';
  min?: number;
  max?: number;
  step?: number;
  onchange?: (value: number | 'fit') => void;
  pageCount?: number;
  floating?: boolean;
}
export declare const ZoomControl: React.FC<ZoomControlProps>;
/** Collapsible group. section = plain header row; card = bordered surface-1 panel (e.g. a profile card with an Avatar in leading). Content stays mounted when closed. */
export interface DisclosureProps {
  title: string;
  open?: boolean;
  onchange?: (open: boolean) => void;
  meta?: string;
  leading?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  variant?: 'section' | 'card';
  headingLevel?: 2 | 3 | 4;
}
export declare const Disclosure: React.FC<DisclosureProps>;
export type ReorderItem = { id: string; label: string; count?: number; hidden?: boolean; expanded?: boolean; meta?: string };
/** Ordered, controlled list of sections: grip (drag or Alt+Up/Down), label, count, show/hide, expand, row menu. The consumer reorders items in onmove. */
export interface ReorderListProps {
  items: ReorderItem[];
  'aria-label': string;
  onmove?: (id: string, toIndex: number) => void;
  onvisibility?: (id: string, hidden: boolean) => void;
  onexpand?: (id: string, expanded: boolean) => void;
  menu?: MenuEntry[];
  onmenu?: (itemId: string, actionId: string) => void;
  /** Rendered under an expanded row. */
  detail?: (item: ReorderItem) => React.ReactNode;
  moveHint?: string;
}
export declare const ReorderList: React.FC<ReorderListProps>;

/** Modal dialog (native <dialog>, showModal). Focus moves in and returns on close; Escape and backdrop close unless dismissible=false. 24px padding, display-face title. */
export interface DialogProps {
  open?: boolean;
  title: string;
  description?: string;
  icon?: IconName;
  children?: React.ReactNode;
  /** Right-aligned action row; a Close button is rendered when omitted. */
  footer?: React.ReactNode;
  onclose?: () => void;
  closeLabel?: string;
  size?: 'sm' | 'md';
  dismissible?: boolean;
}
export declare const Dialog: React.FC<DialogProps>;
/** Multi-line field: Input's sibling. 10×12px padding, line-height 1.65. With maxlength shows "n of max characters" (amber from 90%). readonly is visibly read-only. */
export interface TextareaProps {
  value?: string;
  id?: string;
  name?: string;
  label?: string;
  hint?: string;
  error?: string | boolean;
  rows?: number;
  maxlength?: number;
  readonly?: boolean;
  readonlyHint?: string;
  disabled?: boolean;
  placeholder?: string;
  oninput?: (e: Event) => void;
}
export declare const Textarea: React.FC<TextareaProps>;
/** Checkbox with a visible label (and optional description). Teal when checked; indeterminate shows a minus. */
export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  label: string;
  description?: string;
  disabled?: boolean;
  onchange?: (checked: boolean) => void;
  id?: string;
  name?: string;
}
export declare const Checkbox: React.FC<CheckboxProps>;
/** Marks a passage on the page that differs from the saved document: edit = teal wash + solid outline, suggestion = amber wash + dashed outline; flag in the right margin, or a tick on the page edge when narrow. Announced via hidden text; hidden in print. Place inside a PageSheet at the content edge. */
export interface ChangeMarkProps {
  kind: 'edit' | 'suggestion';
  label?: string;
  flag?: 'margin' | 'edge' | 'none';
  as?: 'div' | 'span';
  children?: React.ReactNode;
}
export declare const ChangeMark: React.FC<ChangeMarkProps>;
/** The app's bottom bar: small display label, a live status message, optional end content. */
export interface StatusBarProps {
  label?: string;
  status: string;
  tone?: 'neutral' | 'warning' | 'error';
  end?: React.ReactNode;
}
export declare const StatusBar: React.FC<StatusBarProps>;
/** Centred empty-area block: optional icon, title, explanation (≤46ch), actions; optional quiet terrain behind. */
export interface EmptyStateProps {
  title: string;
  icon?: IconName;
  terrain?: boolean;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}
export declare const EmptyState: React.FC<EmptyStateProps>;
