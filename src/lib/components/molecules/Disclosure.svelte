<script lang="ts">
  // A collapsible group: heading with a toggle button, content that stays
  // mounted (so form state survives) and is hidden when closed. `actions`
  // sit beside the toggle, never inside it. "section" is a plain row with a
  // hairline; "card" is a bordered panel.
  import type { Snippet } from 'svelte';
  import Icon from '../atoms/Icon.svelte';

  interface Props {
    title: string;
    open?: boolean;
    onchange?: (open: boolean) => void;
    /** Second line under the title. */
    meta?: string;
    leading?: Snippet;
    actions?: Snippet;
    children: Snippet;
    variant?: 'section' | 'card';
    headingLevel?: 2 | 3 | 4;
  }

  let {
    title,
    open = $bindable(false),
    onchange,
    meta,
    leading,
    actions,
    children,
    variant = 'section',
    headingLevel = 3
  }: Props = $props();

  const uid = $props.id();
  const buttonId = `${uid}-toggle`;
  const regionId = `${uid}-region`;

  function toggle() {
    open = !open;
    onchange?.(open);
  }
</script>

<div data-wm="disclosure" data-variant={variant} data-open={open || undefined}>
  <div class="head">
    {#if leading}<div class="leading">{@render leading()}</div>{/if}
    <svelte:element this={`h${headingLevel}`} class="heading">
      <button type="button" id={buttonId} aria-expanded={open} aria-controls={regionId} onclick={toggle}>
        <span class="words">
          <span class="title">{title}</span>
          {#if meta}<span class="meta">{meta}</span>{/if}
        </span>
        {#if !actions}<Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} />{/if}
      </button>
    </svelte:element>
    {#if actions}
      <div class="actions">{@render actions()}</div>
      <!-- Decorative chevron at the far right; clicking it toggles, the real toggle stays the heading button. -->
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_static_element_interactions -->
      <span class="chevron" aria-hidden="true" onclick={toggle}><Icon name={open ? 'chevron-up' : 'chevron-down'} size={16} /></span>
    {/if}
  </div>
  <div id={regionId} class="body" role="region" aria-labelledby={buttonId} hidden={!open}>
    {@render children()}
  </div>
</div>

<style>
  [data-wm='disclosure'] { box-sizing: border-box; color: var(--wm-text); font-family: var(--wm-font-sans); }
  [data-variant='section'][data-open] { border-bottom: 1px solid var(--wm-border); }
  [data-variant='card'] { background: var(--wm-surface-1); border: 1px solid var(--wm-border); border-radius: var(--wm-radius-md); }
  .head { display: flex; align-items: center; gap: var(--wm-space-2); }
  [data-variant='card'] .head { padding-inline: var(--wm-space-3); }
  .leading, .actions { flex: none; display: inline-flex; align-items: center; gap: var(--wm-space-1); }
  .chevron { flex: none; display: inline-flex; align-items: center; justify-content: center; min-width: var(--wm-control-xs); min-height: var(--wm-control-md); color: var(--wm-text-muted); cursor: pointer; }
  .chevron:hover { color: var(--wm-text); }
  .heading { flex: 1; min-width: 0; margin: 0; font: inherit; }
  button {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--wm-space-2);
    width: 100%;
    min-height: var(--wm-control-md);
    padding: var(--wm-space-2) 0;
    border: 0;
    border-radius: var(--wm-radius-sm);
    background: transparent;
    color: var(--wm-text-muted);
    font: inherit;
    text-align: start;
    cursor: pointer;
    transition: color 0.12s ease;
  }
  button:hover { color: var(--wm-text); }
  button:focus-visible { outline: 2px solid var(--wm-accent); outline-offset: 2px; }
  .words { display: flex; flex-direction: column; min-width: 0; }
  .title { font-size: var(--wm-fs-base); font-weight: var(--wm-font-weight-semibold); color: var(--wm-text-strong); }
  .meta { font-size: var(--wm-fs-xs); color: var(--wm-text-muted); }
  .body { padding: var(--wm-space-1) 0 var(--wm-space-4); }
  [data-variant='card'] .body { padding: var(--wm-space-1) var(--wm-space-3) var(--wm-space-3); }
  .body[hidden] { display: none; }
  @media (prefers-reduced-motion: reduce) { button { transition: none; } }
</style>
