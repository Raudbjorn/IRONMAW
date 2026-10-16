<script lang="ts">
  import type { Snippet } from 'svelte';
  import Marker from '../atoms/Marker.svelte';
  import Kicker from '../atoms/Kicker.svelte';

  // One finding about the document: the same number as on the page, a title,
  // a plain explanation, and the actions that resolve it. The card is an
  // article named by its title, so the marker stays decorative. Findings are
  // amber (or error), never rust. Active ties the card to the highlighted
  // block on the page.
  interface Props {
    index: number | string;
    category?: string;
    title: string;
    tone?: 'warning' | 'error' | 'accent';
    active?: boolean;
    children: Snippet;
    actions?: Snippet;
  }

  let { index, category, title, tone = 'warning', active = false, children, actions }: Props = $props();
  const uid = $props.id();
  const titleId = `${uid}-title`;
</script>

<article data-wm="issue-card" data-tone={tone} data-active={active || undefined} aria-labelledby={titleId}>
  <div data-part="marker"><Marker value={index} {tone} size="md" /></div>
  <div data-part="body">
    <div data-part="head">
      <h3 id={titleId} data-part="title">{title}</h3>
      {#if category}<Kicker>{category}</Kicker>{/if}
    </div>
    <div data-part="text">{@render children()}</div>
    {#if actions}<div data-part="actions">{@render actions()}</div>{/if}
  </div>
</article>

<style>
  [data-wm='issue-card'] {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: var(--wm-space-3);
    box-sizing: border-box;
    padding: var(--wm-space-3) 14px;
    background: var(--wm-surface-1);
    border: 1px solid var(--wm-border);
    border-radius: var(--wm-radius-md);
    transition: border-color 0.12s ease, background-color 0.12s ease;
  }
  [data-active] { border-color: var(--wm-accent); background: var(--wm-selected); }
  [data-part='marker'] { padding-top: 2px; }
  [data-part='body'] { display: flex; flex-direction: column; gap: var(--wm-space-1); min-width: 0; }
  /* The category sits beside the title, never above it; it wraps under a long title. */
  [data-part='head'] {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: var(--wm-space-1) var(--wm-space-2);
  }
  [data-part='head'] > :global(*) { margin: 0; }
  [data-part='title'] {
    margin: 0;
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-base);
    font-weight: var(--wm-font-weight-semibold);
    line-height: var(--wm-lh-tight);
    color: var(--wm-text-strong);
  }
  [data-part='text'] {
    font-size: var(--wm-fs-sm);
    line-height: var(--wm-lh-normal);
    color: var(--wm-text-muted);
  }
  [data-part='actions'] { display: flex; flex-wrap: wrap; gap: var(--wm-space-2); margin-top: var(--wm-space-3); }
  @media (prefers-reduced-motion: reduce) {
    [data-wm='issue-card'] { transition: none; }
  }
</style>
