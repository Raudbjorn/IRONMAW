<script lang="ts">
  import type { Snippet } from 'svelte';
  import Button from '../atoms/Button.svelte';

  // The editor's top bar: back, the document's name (or a menu in its place)
  // with a status line beneath, a centre slot for the mode switch, and actions
  // at the end. Three columns where there is room; below 768px the centre
  // drops to its own row so nothing is squeezed.
  interface Props {
    back?: { label: string; href?: string; onclick?: () => void };
    title?: string;
    /** Replaces the title, e.g. a Menu for document actions. */
    heading?: Snippet;
    /** Under the title, e.g. a SaveStatus. */
    status?: Snippet;
    center?: Snippet;
    end?: Snippet;
  }

  let { back, title, heading, status, center, end }: Props = $props();
</script>

<header data-wm="app-header">
  <div data-part="start">
    {#if back}
      <Button variant="ghost" size="sm" icon="arrow-left" label={back.label} href={back.href} onclick={back.onclick} />
    {/if}
    {#if heading || title || status}
      <div data-part="identity">
        {#if heading}{@render heading()}{:else if title}<span data-part="title">{title}</span>{/if}
        {#if status}<div data-part="status">{@render status()}</div>{/if}
      </div>
    {/if}
  </div>
  {#if center}<div data-part="center">{@render center()}</div>{/if}
  {#if end}<div data-part="end">{@render end()}</div>{/if}
</header>

<style>
  [data-wm='app-header'] {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
    align-items: center;
    column-gap: var(--wm-space-3);
    box-sizing: border-box;
    min-height: 56px;
    padding: var(--wm-space-2) var(--wm-space-3);
    background: var(--wm-bg);
    border-bottom: 1px solid var(--wm-border);
  }
  [data-part='start'] {
    grid-column: 1;
    display: flex;
    align-items: center;
    gap: var(--wm-space-2);
    min-width: 0;
  }
  [data-part='identity'] { display: flex; flex-direction: column; min-width: 0; }
  [data-part='title'] {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-sm);
    font-weight: var(--wm-font-weight-semibold);
    color: var(--wm-text-strong);
  }
  [data-part='center'] { grid-column: 2; display: flex; justify-content: center; min-width: 0; }
  [data-part='end'] {
    grid-column: 3;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: var(--wm-space-2);
    min-width: 0;
  }
  /* Narrow: identity and actions share a row while they fit, then the
     actions wrap under it; the centre control always takes its own row. */
  @media (max-width: 767px) {
    [data-wm='app-header'] { display: flex; flex-wrap: wrap; row-gap: var(--wm-space-2); }
    [data-part='start'] { flex: 1 1 12rem; }
    [data-part='end'] { flex: 0 1 auto; flex-wrap: wrap; margin-inline-start: auto; }
    [data-part='center'] { order: 3; flex: 1 1 100%; }
  }
</style>
