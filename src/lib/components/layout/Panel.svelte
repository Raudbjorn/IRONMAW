<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  // A fitted surface: charcoal tonal step, quiet border, small radius.
  // The reader, the category navigation and metadata blocks are Panels.
  // Give it a role/aria-label when it is a landmark (the reader is a
  // labelled nonmodal region).
  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'nav' | 'li';
    surface?: 1 | 2 | 3;
    padding?: 0 | 2 | 3 | 4 | 6;
    elevated?: boolean;
    header?: Snippet;
    footer?: Snippet;
    children: Snippet;
  }

  let { as = 'div', surface = 1, padding = 4, elevated = false, header, footer, children, ...rest }: Props = $props();
</script>

<svelte:element this={as} {...rest} data-wm="panel" data-surface={surface} data-padding={padding} data-elevated={elevated || undefined}>
  {#if header}<div class="header">{@render header()}</div>{/if}
  <div class="body">{@render children()}</div>
  {#if footer}<div class="footer">{@render footer()}</div>{/if}
</svelte:element>

<style>
  [data-wm='panel'] {
    display: flex;
    flex-direction: column;
    min-width: 0;
    box-sizing: border-box;
    border: 1px solid var(--wm-border);
    border-radius: var(--wm-radius-md);
    color: var(--wm-text);
    font-family: var(--wm-font-sans);
  }
  li[data-wm='panel'] { list-style: none; }
  [data-surface='1'] { background: var(--wm-surface-1); }
  [data-surface='2'] { background: var(--wm-surface-2); }
  [data-surface='3'] { background: var(--wm-surface-3); }
  [data-elevated] { box-shadow: var(--wm-shadow-md); }
  .header { border-bottom: 1px solid var(--wm-border); }
  .footer { border-top: 1px solid var(--wm-border); }
  .body { min-width: 0; }
  [data-padding='2'] > * { padding: var(--wm-space-2); }
  [data-padding='3'] > * { padding: var(--wm-space-3); }
  [data-padding='4'] > * { padding: var(--wm-space-4); }
  [data-padding='6'] > * { padding: var(--wm-space-6); }
</style>
