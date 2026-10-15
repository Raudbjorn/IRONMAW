<script lang="ts">
  import type { Snippet } from 'svelte';

  // A titled CV section. The title is a real h2 set in the display face by
  // text-transform only (the source text keeps its case for parsers), with the
  // rust tick beneath it. Content flows in one or two columns.
  interface Props {
    title: string;
    columns?: 1 | 2;
    children: Snippet;
  }

  let { title, columns = 1, children }: Props = $props();
</script>

<section data-wm="doc-section" data-columns={columns === 2 ? 2 : 1}>
  <h2>{title}</h2>
  <div class="body">{@render children()}</div>
</section>

<style>
  [data-wm='doc-section'] { display: block; margin-top: var(--wm-space-6); }
  h2 {
    margin: 0 0 var(--wm-space-3);
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    font-size: var(--wm-fs-base);
    line-height: 1.2;
    text-transform: uppercase;
    letter-spacing: var(--wm-tracking-display);
    color: var(--wm-text-strong);
  }
  /* The tick is decoration only: no text, so nothing for a parser to misread. */
  h2::after {
    content: '';
    display: block;
    width: var(--wm-tick);
    height: 2px;
    margin-top: 2px;
    background: var(--wm-action);
  }
  .body { display: grid; gap: var(--wm-space-3); }
  [data-columns='2'] .body {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    column-gap: var(--wm-space-8);
    row-gap: var(--wm-space-3);
  }
  @media (max-width: 480px) { [data-columns='2'] .body { grid-template-columns: minmax(0, 1fr); } }
  @media print { [data-wm='doc-section'] { break-inside: avoid-page; } }
</style>
