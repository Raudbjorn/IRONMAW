<script module lang="ts">
  /** One row in a reorderable list of sections. */
  export type ReorderItem = {
    id: string;
    label: string;
    count?: number;
    hidden?: boolean;
    expanded?: boolean;
    meta?: string;
  };
</script>

<script lang="ts">
  // The sortable section list of the editor sidebar. Controlled: it never
  // reorders `items`; it reports `onmove(id, toIndex)` and the consumer
  // re-renders. Move with the handle by pointer drag or Alt+Up / Alt+Down;
  // each move is announced politely. The drop line is teal, never rust.
  import type { Snippet } from 'svelte';
  import Button from '../atoms/Button.svelte';
  import Icon from '../atoms/Icon.svelte';
  import Menu, { type MenuEntry } from './Menu.svelte';

  interface Props {
    items: ReorderItem[];
    'aria-label': string;
    onmove?: (id: string, toIndex: number) => void;
    onvisibility?: (id: string, hidden: boolean) => void;
    onexpand?: (id: string, expanded: boolean) => void;
    menu?: MenuEntry[];
    onmenu?: (itemId: string, actionId: string) => void;
    detail?: Snippet<[ReorderItem]>;
    /** Visually hidden instructions the handles are described by. */
    moveHint?: string;
  }

  let {
    items,
    'aria-label': ariaLabel,
    onmove,
    onvisibility,
    onexpand,
    menu,
    onmenu,
    detail,
    moveHint = 'Press Alt with Up or Down to move.'
  }: Props = $props();

  const uid = $props.id();
  const hintId = `${uid}-hint`;

  let list: HTMLOListElement | undefined = $state();
  let announcement = $state('');
  let drag: { id: string; from: number; to: number } | undefined = $state();
  let pendingFocus: string | undefined;

  // Items without the dragged row; the drop index is a position in this list.
  const others = $derived(drag ? items.filter((i) => i.id !== drag!.id) : items);
  const lineBefore = $derived(drag && drag.to < others.length ? others[drag.to]?.id : undefined);
  const lineAfter = $derived(drag && drag.to >= others.length ? others[others.length - 1]?.id : undefined);

  function handleFor(id: string): HTMLElement | null | undefined {
    const li = Array.from(list?.querySelectorAll<HTMLElement>(':scope > li') ?? []).find((el) => el.dataset.itemId === id);
    return li?.querySelector<HTMLElement>('[data-handle]');
  }

  // Focus follows the moved item once the consumer has re-rendered.
  $effect(() => {
    void items;
    if (!pendingFocus) return;
    const id = pendingFocus;
    pendingFocus = undefined;
    handleFor(id)?.focus();
  });

  function announce(item: ReorderItem, to: number) {
    announcement = `Moved ${item.label} to position ${to + 1} of ${items.length}.`;
  }

  function handleKey(e: KeyboardEvent, item: ReorderItem, index: number) {
    if (e.key === 'Escape' && drag) {
      drag = undefined;
      return;
    }
    if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
    e.preventDefault();
    const to = Math.min(items.length - 1, Math.max(0, index + (e.key === 'ArrowUp' ? -1 : 1)));
    if (to === index) return;
    pendingFocus = item.id;
    announce(item, to);
    onmove?.(item.id, to);
  }

  function dropIndex(y: number, dragId: string): number {
    if (!list) return 0;
    const rows = Array.from(list.querySelectorAll<HTMLElement>(':scope > li')).filter((li) => li.dataset.itemId !== dragId);
    let n = 0;
    for (const li of rows) {
      const r = li.getBoundingClientRect();
      if (y > r.top + r.height / 2) n += 1;
    }
    return n;
  }

  function down(e: PointerEvent, item: ReorderItem, index: number) {
    if (e.button !== undefined && e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    drag = { id: item.id, from: index, to: index };
  }

  function move(e: PointerEvent) {
    if (!drag) return;
    drag = { ...drag, to: dropIndex(e.clientY, drag.id) };
  }

  function up(e: PointerEvent) {
    const d = drag;
    drag = undefined;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
    if (!d || d.to === d.from) return;
    const item = items[d.from];
    if (!item) return;
    pendingFocus = item.id;
    announce(item, d.to);
    onmove?.(item.id, d.to);
  }

  function cancel() {
    drag = undefined;
  }
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && drag && cancel()} />

<span id={hintId} class="sr">{moveHint}</span>
<ol bind:this={list} data-wm="reorder-list" aria-label={ariaLabel} data-dragging={drag ? true : undefined}>
  {#each items as item, index (item.id)}
    {@const detailId = `${uid}-detail-${item.id}`}
    <li
      data-item-id={item.id}
      data-hidden={item.hidden || undefined}
      data-dragged={drag?.id === item.id || undefined}
      data-drop={lineBefore === item.id ? 'before' : lineAfter === item.id ? 'after' : undefined}
    >
      <div class="row">
        <button
          type="button"
          data-handle
          class="handle"
          aria-label={`Move ${item.label}`}
          aria-describedby={hintId}
          onkeydown={(e) => handleKey(e, item, index)}
          onpointerdown={(e) => down(e, item, index)}
          onpointermove={move}
          onpointerup={up}
          onpointercancel={cancel}
        >
          <Icon name="grip" size={16} />
        </button>
        <span class="words">
          <span class="label">{item.label}</span>
          {#if item.meta}<span class="meta">{item.meta}</span>{/if}
        </span>
        {#if item.count !== undefined}<span class="count">{item.count}</span>{/if}
        <Button
          variant="ghost"
          size="xs"
          icon={item.hidden ? 'eye-off' : 'eye'}
          label={item.hidden ? `Show ${item.label}` : `Hide ${item.label}`}
          onclick={() => onvisibility?.(item.id, !item.hidden)}
        />
        <Button
          variant="ghost"
          size="xs"
          icon={item.expanded ? 'chevron-up' : 'chevron-down'}
          label={item.expanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
          aria-expanded={!!item.expanded}
          aria-controls={item.expanded && detail ? detailId : undefined}
          onclick={() => onexpand?.(item.id, !item.expanded)}
        />
        {#if menu}
          <Menu
            label={`More actions for ${item.label}`}
            size="xs"
            items={menu}
            placement="bottom-end"
            onselect={(actionId) => onmenu?.(item.id, actionId)}
          />
        {/if}
      </div>
      {#if item.expanded && detail}
        <div id={detailId} class="detail">{@render detail(item)}</div>
      {/if}
    </li>
  {/each}
</ol>
<div class="sr" role="status" aria-live="polite">{announcement}</div>

<style>
  [data-wm='reorder-list'] { list-style: none; margin: 0; padding: 0; font-family: var(--wm-font-sans); color: var(--wm-text); }
  li { position: relative; border-radius: var(--wm-radius-sm); }
  li[data-dragged] { opacity: 0.5; }
  .row { display: flex; align-items: center; gap: var(--wm-space-1); min-height: calc(var(--wm-control-sm) + var(--wm-space-1)); padding-inline: var(--wm-space-1); border-radius: var(--wm-radius-sm); transition: background-color 0.12s ease; }
  .row:hover { background: var(--wm-surface-2); }
  .handle {
    display: inline-flex; align-items: center; justify-content: center;
    flex: none; width: var(--wm-control-xs); height: var(--wm-control-xs);
    padding: 0; border: 0; border-radius: var(--wm-radius-sm);
    background: transparent; color: var(--wm-text-faint);
    cursor: grab; touch-action: none;
  }
  .handle:hover { color: var(--wm-text); }
  [data-dragging] .handle { cursor: grabbing; }
  .handle:focus-visible { outline: 2px solid var(--wm-accent); outline-offset: 2px; }
  .words { flex: 1; min-width: 0; display: flex; flex-direction: column; }
  .label { display: inline-flex; align-items: center; gap: var(--wm-space-1); font-size: var(--wm-fs-sm); color: var(--wm-text); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  li[data-hidden] .label { color: var(--wm-text-faint); }
  .meta { font-size: var(--wm-fs-xs); color: var(--wm-text-muted); }
  .count { font-family: var(--wm-font-mono); font-size: var(--wm-fs-xs); color: var(--wm-text-faint); font-variant-numeric: tabular-nums; padding-inline: var(--wm-space-1); }
  .detail { padding: var(--wm-space-2) var(--wm-space-2) var(--wm-space-3) var(--wm-control-xs); }
  li[data-drop]::before { content: ''; position: absolute; inset-inline: 0; height: 2px; background: var(--wm-accent); border-radius: var(--wm-radius-sm); pointer-events: none; z-index: var(--wm-z-elevated); }
  li[data-drop='before']::before { top: -1px; }
  li[data-drop='after']::before { bottom: -1px; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
  @media (prefers-reduced-motion: reduce) { .row { transition: none; } }
</style>
