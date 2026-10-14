<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
    tone?: 'default' | 'strong' | 'muted' | 'faint' | 'accent' | 'action';
    /** Iosevka — paths, locators, technical values. */
    mono?: boolean;
    /** Reading measure: 68ch, 16px, relaxed leading. For extracted-text bodies. */
    prose?: boolean;
    as?: 'p' | 'span' | 'div';
    children: Snippet;
  }

  let { size = 'base', tone = 'default', mono = false, prose = false, as = 'p', children }: Props = $props();
</script>

<svelte:element this={as} data-wm="text" data-size={size} data-tone={tone} data-mono={mono || undefined} data-prose={prose || undefined}>
  {@render children()}
</svelte:element>

<style>
  [data-wm='text'] {
    margin: 0;
    font-family: var(--wm-font-sans);
    line-height: var(--wm-lh-normal);
    color: var(--wm-text);
    text-wrap: pretty;
  }
  [data-mono] { font-family: var(--wm-font-mono); }
  [data-size='xs'] { font-size: var(--wm-fs-xs); }
  [data-size='sm'] { font-size: var(--wm-fs-sm); }
  [data-size='base'] { font-size: var(--wm-fs-base); }
  [data-size='lg'] { font-size: var(--wm-fs-lg); }
  [data-size='xl'] { font-size: var(--wm-fs-xl); }
  [data-tone='strong'] { color: var(--wm-text-strong); }
  [data-tone='muted'] { color: var(--wm-text-muted); }
  [data-tone='faint'] { color: var(--wm-text-faint); }
  [data-tone='accent'] { color: var(--wm-accent); }
  [data-tone='action'] { color: var(--wm-action); }
  [data-prose] {
    max-width: var(--wm-measure);
    font-size: var(--wm-fs-lg);
    line-height: var(--wm-lh-relaxed);
    white-space: pre-wrap;
    overflow-wrap: anywhere;
  }
</style>
