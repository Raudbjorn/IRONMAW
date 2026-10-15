<script lang="ts">
  import type { Snippet } from 'svelte';

  // The editor's frame: an optional header across the top, a fixed-width
  // sidebar that scrolls on its own, and a main canvas. With fill (default) it
  // takes the full viewport height and each pane scrolls internally; without
  // it the workspace grows with its content. Below 1024px it becomes a single
  // column, sidebar first, at natural height.
  interface Props {
    header?: Snippet;
    sidebar: Snippet;
    children: Snippet;
    /** Accessible name of the sidebar landmark. */
    sidebarLabel: string;
    sidebarWidth?: string;
    fill?: boolean;
  }

  let { header, sidebar, children, sidebarLabel, sidebarWidth = 'var(--wm-sidebar)', fill = true }: Props = $props();
</script>

<div data-wm="workspace" data-fill={fill || undefined} style:--sidebar-w={sidebarWidth}>
  {#if header}<div data-part="header">{@render header()}</div>{/if}
  <aside data-part="sidebar" aria-label={sidebarLabel}>{@render sidebar()}</aside>
  <main data-part="main">{@render children()}</main>
</div>

<style>
  [data-wm='workspace'] {
    display: grid;
    grid-template-columns: var(--sidebar-w) minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
    background: var(--wm-bg);
    color: var(--wm-text);
  }
  [data-fill] { height: 100dvh; }
  [data-part='header'] { grid-column: 1 / -1; }
  [data-part='sidebar'] {
    grid-column: 1;
    grid-row: 2;
    box-sizing: border-box;
    min-height: 0;
    overflow-y: auto;
    padding: var(--wm-space-3);
    background: var(--wm-surface-1);
    border-right: 1px solid var(--wm-border);
    scrollbar-width: thin;
    scrollbar-color: var(--wm-border-strong) transparent;
  }
  [data-part='main'] {
    grid-column: 2;
    grid-row: 2;
    min-width: 0;
    min-height: 0;
    overflow: auto;
    background: var(--wm-bg);
  }
  @media (max-width: 1023px) {
    [data-wm='workspace'] {
      grid-template-columns: minmax(0, 1fr);
      grid-template-rows: none;
    }
    [data-fill] { height: auto; }
    [data-part='sidebar'], [data-part='main'] { grid-column: 1; grid-row: auto; overflow: visible; }
    [data-part='sidebar'] { border-right: 0; border-bottom: 1px solid var(--wm-border); }
  }
</style>
