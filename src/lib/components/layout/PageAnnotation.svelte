<script lang="ts">
  import type { Snippet } from 'svelte';
  import Marker from '../atoms/Marker.svelte';

  // Ties a finding to its place on the page. It wraps document content without
  // changing its text: a numbered Marker sits in the left page margin beside
  // the first line, and a wavy underline runs under the block. As a span it is inline: the marker
  // leads the text, since there is no margin beside a run of words. Number and wave
  // carry the meaning, not colour alone. Warning is amber, never rust. Both
  // marks are hidden in print. Active adds a faint tint and a scroll margin so
  // consumers can scrollIntoView the block.
  interface Props {
    index: number | string;
    /** The finding's title, used in the marker's accessible name. */
    label: string;
    tone?: 'warning' | 'error' | 'accent';
    active?: boolean;
    as?: 'div' | 'span';
    children: Snippet;
  }

  let { index, label, tone = 'warning', active = false, as = 'div', children }: Props = $props();
</script>

<svelte:element this={as} data-wm="page-annotation" data-tone={tone} data-active={active || undefined} data-inline={as === 'span' || undefined}>
  <span data-part="marker"><Marker value={index} {tone} size="sm" label={`Finding ${index}: ${label}`} /></span>{@render children()}
</svelte:element>

<style>
  [data-wm='page-annotation'] {
    --tone: var(--wm-warning);
    --wave: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='4' viewBox='0 0 8 4'%3E%3Cpath d='M0 3 Q2 0 4 2 T8 2' fill='none' stroke='black' stroke-width='1.2'/%3E%3C/svg%3E"); /* @kind other */
    position: relative;
    scroll-margin: var(--wm-space-8);
    padding-bottom: 4px;
    border-radius: var(--wm-radius-sm);
    transition: background-color 0.12s ease;
  }
  [data-tone='error'] { --tone: var(--wm-error); }
  [data-tone='accent'] { --tone: var(--wm-accent); }
  [data-wm='page-annotation']::after {
    content: '';
    position: absolute;
    inset: auto 0 0 0;
    height: 4px;
    background: var(--tone);
    -webkit-mask-image: var(--wave);
    mask-image: var(--wave);
    -webkit-mask-repeat: repeat-x;
    mask-repeat: repeat-x;
    -webkit-mask-size: 8px 4px;
    mask-size: 8px 4px;
    pointer-events: none;
  }
  [data-part='marker'] {
    position: absolute;
    top: 0.2em;
    left: calc(var(--wm-space-4) - var(--wm-page-margin));
    line-height: 1;
    user-select: none;
  }
  /* Inline use has no margin to sit in: the marker leads the text instead. */
  [data-inline] > [data-part='marker'] {
    position: static;
    display: inline-block;
    vertical-align: middle;
    margin-inline-end: var(--wm-space-1);
  }
  [data-active] {
    background: color-mix(in srgb, var(--tone) 10%, transparent);
  }
  @media (prefers-reduced-motion: reduce) {
    [data-wm='page-annotation'] { transition: none; }
  }
  @media print {
    [data-part='marker'], [data-wm='page-annotation']::after { display: none; }
    [data-active] { background: none; }
  }
</style>
