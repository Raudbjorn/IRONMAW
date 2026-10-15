<script module lang="ts">
  import type { IconName } from '../../icons.ts';

  /** One row of a menu: an action, or a separator between groups. */
  export type MenuEntry =
    | {
        id: string;
        label: string;
        icon?: IconName;
        /** Right-aligned shortcut or secondary figure (Iosevka). */
        hint?: string;
        danger?: boolean;
        disabled?: boolean;
        /** Spans every column in a two-column menu. */
        wide?: boolean;
        /** Shows a trailing chevron; still fires `onselect`, the consumer opens what follows. */
        submenu?: boolean;
      }
    | { separator: true; id?: string };
</script>

<script lang="ts">
  // A trigger button and its popup of actions (WAI-ARIA menu button). The
  // popup is fixed-positioned from the trigger's rect, flips when it would run
  // out of room, and follows scroll and resize. Teal marks focus; danger rows
  // use the error colour, never rust. Selection is reported, never mutated.
  import Button from '../atoms/Button.svelte';
  import Icon from '../atoms/Icon.svelte';

  type Placement = 'bottom-start' | 'bottom-end' | 'top-start' | 'top-end';

  interface Props {
    /** Accessible name of the trigger. */
    label: string;
    /** Visible trigger text. Omitted = icon-only. */
    text?: string;
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
    placement?: Placement;
    chamfer?: boolean;
    /** Trigger text in Inter sentence case (names, document titles). */
    plain?: boolean;
    onselect?: (id: string) => void;
  }

  let {
    label,
    text,
    icon = 'more',
    iconEnd,
    variant = 'ghost',
    size = 'sm',
    items,
    columns = 1,
    title,
    open = $bindable(false),
    disabled = false,
    placement = 'bottom-start',
    chamfer,
    plain = false,
    onselect
  }: Props = $props();

  const uid = $props.id();
  const menuId = `${uid}-menu`;
  const titleId = `${uid}-title`;

  const VIEWPORT_MARGIN_PX = 8;
  const TRIGGER_GAP_PX = 4;
  const MAX_HEIGHT_PX = 384;

  let root: HTMLSpanElement | undefined = $state();
  let popup: HTMLDivElement | undefined = $state();
  let pos: { left: number; top: number; maxHeight: number } | undefined = $state();
  let focusTarget: 'first' | 'last' | 'popup' = 'popup';

  const isEntry = (e: MenuEntry): e is Exclude<MenuEntry, { separator: true }> => !('separator' in e);

  function enabledItems(): HTMLElement[] {
    if (!popup) return [];
    return Array.from(popup.querySelectorAll<HTMLElement>('[role="menuitem"]:not([aria-disabled="true"])'));
  }

  function triggerButton(): HTMLElement | null | undefined {
    return root?.querySelector<HTMLElement>('[data-wm="button"]');
  }

  function place() {
    if (!root || !popup) return;
    const r = root.getBoundingClientRect();
    const w = popup.offsetWidth;
    const h = Math.min(popup.scrollHeight, MAX_HEIGHT_PX);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const below = vh - r.bottom - TRIGGER_GAP_PX - VIEWPORT_MARGIN_PX;
    const above = r.top - TRIGGER_GAP_PX - VIEWPORT_MARGIN_PX;
    let wantTop = placement.startsWith('top');
    if (!wantTop && h > below && above > below) wantTop = true;
    else if (wantTop && h > above && below > above) wantTop = false;
    const room = Math.max(wantTop ? above : below, 0);
    const height = Math.min(h, room);
    const top = wantTop ? r.top - TRIGGER_GAP_PX - height : r.bottom + TRIGGER_GAP_PX;
    let left = placement.endsWith('end') ? r.right - w : r.left;
    left = Math.max(VIEWPORT_MARGIN_PX, Math.min(left, vw - w - VIEWPORT_MARGIN_PX));
    pos = { left, top, maxHeight: Math.min(MAX_HEIGHT_PX, room) };
  }

  $effect(() => {
    if (!open || !popup) {
      pos = undefined;
      return;
    }
    place();
    const target = focusTarget;
    focusTarget = 'popup';
    const list = enabledItems();
    const el = target === 'first' ? list[0] : target === 'last' ? list[list.length - 1] : popup;
    (el ?? popup).focus({ preventScroll: true });
    const again = () => place();
    window.addEventListener('scroll', again, true);
    window.addEventListener('resize', again);
    return () => {
      window.removeEventListener('scroll', again, true);
      window.removeEventListener('resize', again);
    };
  });

  function close(refocus: boolean) {
    open = false;
    if (refocus) triggerButton()?.focus();
  }

  function choose(entry: Exclude<MenuEntry, { separator: true }>) {
    if (entry.disabled) return;
    close(true);
    onselect?.(entry.id);
  }

  function toggle(e: MouseEvent) {
    if (open) return close(false);
    // detail === 0 is a keyboard activation: move into the menu.
    focusTarget = e.detail === 0 ? 'first' : 'popup';
    open = true;
  }

  function triggerKey(e: KeyboardEvent) {
    if (disabled || open) return;
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      focusTarget = e.key === 'ArrowDown' ? 'first' : 'last';
      open = true;
    }
  }

  function menuKey(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      e.preventDefault();
      return close(true);
    }
    if (e.key === 'Tab') return close(true);
    const list = enabledItems();
    const i = list.indexOf(document.activeElement as HTMLElement);
    const n = list.length;
    if (!n) return;
    let j: number | undefined;
    const fwd = e.key === 'ArrowDown' || (columns === 2 && e.key === 'ArrowRight');
    const back = e.key === 'ArrowUp' || (columns === 2 && e.key === 'ArrowLeft');
    if (fwd) j = i < 0 ? 0 : (i + 1) % n;
    else if (back) j = i < 0 ? n - 1 : (i - 1 + n) % n;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = n - 1;
    if (j === undefined) return;
    e.preventDefault();
    list[j]?.focus();
  }

  function itemKey(e: KeyboardEvent, entry: Exclude<MenuEntry, { separator: true }>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(entry);
    }
  }

  function outside(e: PointerEvent) {
    if (!open) return;
    if (root?.contains(e.target as Node) || popup?.contains(e.target as Node)) return;
    open = false;
  }
</script>

<svelte:window onpointerdown={outside} />

<span data-wm="menu" bind:this={root} onkeydown={triggerKey} role="presentation">
  <Button
    {variant}
    {size}
    {chamfer}
    {plain}
    {icon}
    {iconEnd}
    {disabled}
    label={text ? undefined : label}
    aria-haspopup="menu"
    aria-expanded={open}
    aria-controls={open ? menuId : undefined}
    onclick={toggle}
  >
    {#if text}{text}{/if}
  </Button>

  {#if open}
    <div
      bind:this={popup}
      id={menuId}
      data-wm="menu-popup"
      role="menu"
      tabindex="-1"
      aria-label={title ? undefined : label}
      aria-labelledby={title ? titleId : undefined}
      data-placed={pos ? true : undefined}
      style:left={pos ? `${pos.left}px` : undefined}
      style:top={pos ? `${pos.top}px` : undefined}
      style:max-height={pos ? `${pos.maxHeight}px` : undefined}
      style:min-width={root ? `${root.offsetWidth}px` : undefined}
      onkeydown={menuKey}
    >
      {#if title}<div id={titleId} class="title" role="presentation">{title}</div>{/if}
      <div class="grid" data-columns={columns} role="presentation">
        {#each items as entry, i (entry.id ?? `sep-${i}`)}
          {#if isEntry(entry)}
            <div
              role="menuitem"
              tabindex="-1"
              class="item"
              data-danger={entry.danger || undefined}
              data-wide={entry.wide || undefined}
              aria-disabled={entry.disabled || undefined}
              aria-haspopup={entry.submenu ? 'menu' : undefined}
              onclick={() => choose(entry)}
              onkeydown={(e) => itemKey(e, entry)}
            >
              {#if entry.icon}<Icon name={entry.icon} size={16} />{/if}
              <span class="text">{entry.label}</span>
              {#if entry.hint}<span class="hint">{entry.hint}</span>{/if}
              {#if entry.submenu}<Icon name="chevron-right" size={16} />{/if}
            </div>
          {:else}
            <div role="separator" class="sep"></div>
          {/if}
        {/each}
      </div>
    </div>
  {/if}
</span>

<style>
  [data-wm='menu'] { display: inline-flex; }
  [data-wm='menu-popup'] {
    position: fixed;
    z-index: var(--wm-z-dropdown);
    box-sizing: border-box;
    overflow-y: auto;
    padding: var(--wm-space-1);
    background: var(--wm-surface-2);
    border: 1px solid var(--wm-border-strong);
    border-radius: var(--wm-radius-md);
    box-shadow: var(--wm-shadow-md);
    color: var(--wm-text);
    font-family: var(--wm-font-sans);
    visibility: hidden;
    top: 0;
    left: 0;
  }
  [data-wm='menu-popup'][data-placed] { visibility: visible; }
  [data-wm='menu-popup']:focus { outline: none; }
  .title {
    padding: var(--wm-space-2) var(--wm-space-2) var(--wm-space-1);
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    font-size: var(--wm-fs-xs);
    letter-spacing: var(--wm-tracking-wide);
    text-transform: uppercase;
    color: var(--wm-text-muted);
  }
  .grid { display: grid; grid-template-columns: minmax(0, 1fr); gap: var(--wm-space-0); }
  .grid[data-columns='2'] { grid-template-columns: repeat(2, minmax(0, 1fr)); }
  .item {
    display: flex;
    align-items: center;
    gap: var(--wm-space-2);
    box-sizing: border-box;
    min-height: var(--wm-control-sm);
    padding: 0 var(--wm-space-2);
    border-radius: var(--wm-radius-sm);
    font-size: var(--wm-fs-sm);
    color: var(--wm-text);
    cursor: pointer;
    white-space: nowrap;
    transition: background-color 0.12s ease, color 0.12s ease;
  }
  .item :global([data-wm='icon']) { color: var(--wm-text-muted); flex: none; }
  .item[data-wide] { grid-column: 1 / -1; }
  .text { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; }
  .hint { font-family: var(--wm-font-mono); font-size: var(--wm-fs-xs); color: var(--wm-text-faint); margin-inline-start: auto; padding-inline-start: var(--wm-space-4); }
  .item:hover, .item:focus { background: var(--wm-surface-3); color: var(--wm-text-strong); }
  .item:focus-visible, .item:focus { outline: 2px solid var(--wm-accent); outline-offset: -2px; }
  .item[data-danger], .item[data-danger] :global([data-wm='icon']) { color: var(--wm-error); }
  .item[aria-disabled='true'] { opacity: 0.5; cursor: not-allowed; }
  .item[aria-disabled='true']:hover { background: transparent; }
  .sep { grid-column: 1 / -1; height: 1px; margin: var(--wm-space-1) var(--wm-space-0); background: var(--wm-border); }
  @media (prefers-reduced-motion: reduce) { .item { transition: none; } }
</style>
