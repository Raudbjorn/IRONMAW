<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  // The only layout primitive. `gap` takes scale steps, not pixels.
  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    as?: 'div' | 'section' | 'article' | 'nav' | 'header' | 'footer' | 'main' | 'aside' | 'form' | 'ul' | 'ol';
    direction?: 'column' | 'row';
    gap?: 0 | 1 | 2 | 3 | 4 | 6 | 8 | 12;
    align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
    justify?: 'start' | 'center' | 'end' | 'between';
    wrap?: boolean;
    children: Snippet;
  }

  let { as = 'div', direction = 'column', gap = 4, align = 'stretch', justify = 'start', wrap = false, children, ...rest }: Props = $props();

  const map = { start: 'flex-start', center: 'center', end: 'flex-end', stretch: 'stretch', between: 'space-between', baseline: 'baseline' } as const;
</script>

<svelte:element
  this={as}
  {...rest}
  data-wm="stack"
  data-direction={direction}
  style:display="flex"
  style:flex-direction={direction}
  style:gap={`var(--wm-space-${gap})`}
  style:align-items={map[align]}
  style:justify-content={map[justify]}
  style:flex-wrap={wrap ? 'wrap' : 'nowrap'}
>
  {@render children()}
</svelte:element>

<style>
  [data-wm='stack'] { display: flex; min-width: 0; }
  :where(ul, ol)[data-wm='stack'] { margin: 0; padding: 0; list-style: none; }
</style>
