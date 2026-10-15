<script lang="ts">
  import type { Snippet } from 'svelte';

  // The scrolling ground the page sheets sit on. In Oxide this is the darkest
  // surface, so the paper reads against it. Zoom uses CSS `zoom` on the sheet
  // stack so layout follows the scale; 'fit' measures the canvas and scales the
  // page to its width (never above 125%). The toolbar floats at top centre and
  // the overlay (e.g. a zoom bar) at bottom centre. The scroller is focusable
  // so the keyboard can scroll it.
  const FIT_MAX = 1.25;
  const GUTTER_PX = 64;

  interface Props {
    children: Snippet;
    toolbar?: Snippet;
    overlay?: Snippet;
    /** Percent, or 'fit' to match the canvas width. */
    zoom?: number | 'fit';
    /** Page width in px, used to compute 'fit'. */
    pageWidth?: number;
    'aria-label'?: string;
  }

  let { children, toolbar, overlay, zoom = 'fit', pageWidth = 794, 'aria-label': ariaLabel = 'Document preview' }: Props = $props();

  let width = $state(0);
  let scroller: HTMLDivElement | undefined = $state();

  $effect(() => {
    if (!scroller) return;
    width = scroller.clientWidth;
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver((entries) => {
      const w = entries[0]?.contentRect.width;
      if (typeof w === 'number') width = w;
    });
    ro.observe(scroller);
    return () => ro.disconnect();
  });

  const scale = $derived.by(() => {
    if (zoom !== 'fit') return Number.isFinite(zoom) && zoom > 0 ? zoom / 100 : 1;
    if (!width || pageWidth <= 0) return 1;
    return Math.min(FIT_MAX, Math.max(0.1, (width - GUTTER_PX) / pageWidth));
  });
</script>

<div data-wm="page-canvas">
  {#if toolbar}<div data-part="toolbar">{@render toolbar()}</div>{/if}
  <!-- svelte-ignore a11y_no_noninteractive_tabindex -- a scroll region must be keyboard-reachable -->
  <div bind:this={scroller} data-part="scroller" role="region" aria-label={ariaLabel} tabindex="0">
    <div data-part="stack" data-scale={scale} style:zoom={scale}>
      {@render children()}
    </div>
  </div>
  {#if overlay}<div data-part="overlay">{@render overlay()}</div>{/if}
</div>

<style>
  [data-wm='page-canvas'] {
    position: relative;
    display: flex;
    flex-direction: column;
    min-width: 0;
    min-height: 0;
    height: 100%;
    background: var(--wm-bg);
  }
  [data-part='scroller'] {
    flex: 1;
    min-height: 0;
    overflow: auto;
    padding: var(--wm-space-6) var(--wm-space-8);
    scrollbar-width: thin;
    scrollbar-color: var(--wm-border-strong) transparent;
  }
  [data-part='scroller']:focus-visible {
    outline: 2px solid var(--wm-accent);
    outline-offset: -2px;
  }
  [data-part='stack'] {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: var(--wm-space-6);
    width: max-content;
    min-width: 100%;
    /* Room for the floating overlay. */
    padding-bottom: var(--wm-space-12);
  }
  /* A fixed row above the scrolling pages, so the control never covers them. */
  [data-part='toolbar'] {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: var(--wm-space-3) var(--wm-space-4) 0;
  }
  [data-part='overlay'] {
    position: absolute;
    bottom: var(--wm-space-4);
    left: 50%;
    transform: translateX(-50%);
    z-index: var(--wm-z-sticky);
  }
  @media (max-width: 767px) {
    [data-part='scroller'] { padding: var(--wm-space-3) var(--wm-space-2); }
  }
  @media print {
    [data-part='toolbar'], [data-part='overlay'] { display: none; }
    [data-part='scroller'] { overflow: visible; padding: 0; }
    [data-part='stack'] { zoom: 1 !important; gap: 0; padding: 0; }
  }
</style>
