<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';
  import StatusLabel from '../atoms/StatusLabel.svelte';
  import { sortReviewStatuses } from '../../review-status.ts';

  // One row per document. The title is the focusable control; the whole row
  // is a click target that supplements it. Selected = tonal fill + a rust
  // edge (the board's sidebar selection) + aria-current. "Known issues" is
  // the only filled label, sorted first. "N file locations" and "N more
  // matches" are different things and are never summed.
  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children' | 'title'> {
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
    locationsLabel?: string;
    selected?: boolean;
    href?: string;
    onopen?: () => void;
    /** Up to three readable lines of matching text, with <mark> for hits. */
    excerpt?: Snippet;
    /** Secondary row content, e.g. a "2 more matches in this document" link. */
    extra?: Snippet;
  }

  let {
    as = 'li',
    title,
    context,
    language,
    format,
    statuses = [],
    locations,
    locationsLabel = '{n} file locations',
    selected = false,
    href,
    onopen,
    excerpt,
    extra,
    ...rest
  }: Props = $props();

  const meta = $derived([language, format].filter(Boolean).join(' · '));
  const ordered = $derived(sortReviewStatuses(statuses));
  const locationsText = $derived(locations && locations > 1 ? locationsLabel.replace('{n}', String(locations)) : '');

  function rowClick(e: MouseEvent) {
    // The row supplements the title control; ignore clicks on nested controls
    // and text selection drags.
    const t = e.target as HTMLElement;
    if (t.closest('a, button')) return;
    if (window.getSelection()?.toString()) return;
    onopen?.();
  }
</script>

<svelte:element this={as} {...rest} data-wm="entry" data-selected={selected || undefined} aria-current={selected ? 'true' : undefined} onclick={onopen ? rowClick : undefined}>
  <div class="head">
    <div class="ident">
      {#if href}
        <a class="title" {href} onclick={onopen ? (e) => { e.preventDefault(); onopen(); } : undefined}>{title}</a>
      {:else if onopen}
        <button type="button" class="title" onclick={onopen}>{title}</button>
      {:else}
        <span class="title">{title}</span>
      {/if}
      {#if context}<span class="context">{context}</span>{/if}
    </div>
    <div class="meta">
      {#if meta}<span class="kind">{meta}</span>{/if}
      {#if ordered.length}
        <span class="statuses">
          {#each ordered as s (s)}<StatusLabel status={s} />{/each}
        </span>
      {/if}
    </div>
  </div>
  {#if excerpt}<div class="excerpt">{@render excerpt()}</div>{/if}
  {#if locationsText || extra}
    <div class="foot">
      {#if locationsText}<span class="locations">{locationsText}</span>{/if}
      {#if extra}<span class="extra">{@render extra()}</span>{/if}
    </div>
  {/if}
</svelte:element>

<style>
  [data-wm='entry'] {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: var(--wm-space-2);
    min-height: var(--wm-row);
    box-sizing: border-box;
    padding: var(--wm-space-3) var(--wm-space-4) var(--wm-space-3) calc(var(--wm-space-4) + 3px);
    border-bottom: 1px solid var(--wm-border);
    font-family: var(--wm-font-sans);
    color: var(--wm-text);
    list-style: none;
    transition: background-color 0.12s ease;
  }
  [data-wm='entry']::before {
    content: '';
    position: absolute;
    inset-block: 0;
    left: 0;
    width: 3px;
    background: transparent;
    transition: background-color 0.12s ease;
  }
  [data-wm='entry']:hover { background: var(--wm-surface-1); }
  [data-wm='entry']:has(.title:is(a, button)) { cursor: pointer; }
  [data-selected] { background: var(--wm-selected); }
  [data-selected]::before { background: var(--wm-action); }

  .head { display: flex; gap: var(--wm-space-4); align-items: flex-start; justify-content: space-between; flex-wrap: wrap; }
  .ident { display: flex; flex-direction: column; gap: 2px; min-width: 0; flex: 1 1 28ch; }
  .title {
    display: inline;
    padding: 0;
    background: none;
    border: 0;
    border-radius: var(--wm-radius-sm);
    text-align: left;
    color: var(--wm-text-strong);
    font: inherit;
    font-weight: var(--wm-font-weight-medium);
    font-size: var(--wm-fs-lg);
    line-height: var(--wm-lh-tight);
    text-decoration: none;
    overflow-wrap: anywhere;
    cursor: pointer;
  }
  span.title { cursor: default; }
  .title:hover { color: var(--wm-accent); }
  .title:focus-visible { outline: 2px solid var(--wm-accent); outline-offset: 2px; }
  .context {
    font-family: var(--wm-font-mono);
    font-size: var(--wm-fs-xs);
    color: var(--wm-structure-text);
    overflow-wrap: anywhere;
  }
  .meta { display: flex; flex-direction: column; align-items: flex-end; gap: var(--wm-space-1); flex: none; }
  .kind { font-size: var(--wm-fs-xs); color: var(--wm-text-muted); white-space: nowrap; }
  .statuses { display: flex; gap: var(--wm-space-1); flex-wrap: wrap; justify-content: flex-end; }
  .excerpt {
    font-size: var(--wm-fs-base);
    line-height: var(--wm-lh-normal);
    color: var(--wm-text);
    max-width: var(--wm-measure);
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    line-clamp: 3;
    overflow: hidden;
  }
  .excerpt :global(mark) {
    background: color-mix(in oklab, var(--wm-accent), transparent 72%);
    color: var(--wm-text-strong);
    border-bottom: 1px solid var(--wm-accent);
    padding: 0 1px;
  }
  .foot { display: flex; gap: var(--wm-space-3); align-items: center; flex-wrap: wrap; font-size: var(--wm-fs-xs); }
  .locations {
    display: inline-flex;
    align-items: center;
    min-height: 22px;
    padding: 0 8px;
    border: 1px solid var(--wm-border);
    border-radius: var(--wm-radius-sm);
    color: var(--wm-text-muted);
  }
  @media (max-width: 639px) {
    .meta { align-items: flex-start; }
    .statuses { justify-content: flex-start; }
  }
</style>
