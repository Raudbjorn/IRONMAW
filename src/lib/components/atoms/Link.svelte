<script lang="ts">
  import Icon from './Icon.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    href: string;
    /** External link: arrow suffix + safe rel. */
    external?: boolean;
    /** Muted until hovered — for secondary in-row actions like "2 more matches". */
    quiet?: boolean;
    onclick?: (e: MouseEvent) => void;
    children: Snippet;
  }

  let { href, external = false, quiet = false, onclick, children }: Props = $props();
</script>

<a
  {href}
  data-wm="link"
  data-quiet={quiet || undefined}
  rel={external ? 'noopener noreferrer' : undefined}
  target={external ? '_blank' : undefined}
  {onclick}
>
  {@render children()}{#if external}<span class="ext"><Icon name="external" size={12} /></span>{/if}
</a>

<style>
  [data-wm='link'] {
    color: var(--wm-accent);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.2em;
    text-decoration-color: color-mix(in oklab, var(--wm-accent), transparent 50%);
    border-radius: var(--wm-radius-sm);
    transition: text-decoration-color 0.12s ease, color 0.12s ease;
  }
  [data-wm='link']:hover { text-decoration-color: currentColor; }
  [data-quiet] { color: var(--wm-text-muted); }
  [data-quiet]:hover { color: var(--wm-accent); }
  [data-wm='link']:focus-visible {
    outline: 2px solid var(--wm-accent);
    outline-offset: 2px;
  }
  .ext { display: inline-flex; margin-inline-start: 0.2em; vertical-align: -0.05em; }
</style>
