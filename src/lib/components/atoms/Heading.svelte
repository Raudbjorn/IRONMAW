<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    level?: 1 | 2 | 3 | 4;
    /** Brand moment: Rajdhani, uppercase, tracked. For section titles like LIBRARY — never for document titles. */
    display?: boolean;
    children: Snippet;
  }

  let { level = 1, display = false, children }: Props = $props();
  const tag = $derived(`h${level}` as const);
</script>

<svelte:element this={tag} data-wm="heading" data-level={level} data-display={display || undefined}>
  {@render children()}
</svelte:element>

<style>
  [data-wm='heading'] {
    margin: 0;
    font-family: var(--wm-font-sans);
    color: var(--wm-text-strong);
    line-height: var(--wm-lh-tight);
    font-weight: var(--wm-font-weight-semibold);
    text-wrap: balance;
    overflow-wrap: anywhere;
  }
  [data-level='1'] { font-size: var(--wm-fs-3xl); }
  [data-level='2'] { font-size: var(--wm-fs-2xl); }
  [data-level='3'] { font-size: var(--wm-fs-xl); }
  [data-level='4'] { font-size: var(--wm-fs-lg); }
  [data-display] {
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight-bold);
    text-transform: uppercase;
    letter-spacing: var(--wm-tracking-display);
    line-height: 1;
  }
  [data-display][data-level='1'] { font-size: var(--wm-fs-display); }
  [data-display][data-level='2'] { font-size: var(--wm-fs-3xl); }
  [data-display][data-level='3'] { font-size: var(--wm-fs-2xl); }
  [data-display][data-level='4'] { font-size: var(--wm-fs-xl); }
</style>
