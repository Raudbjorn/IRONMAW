<script lang="ts">
  import type { Snippet } from 'svelte';

  // One CV entry (a job, a degree, a skill group): title and subtitle on the
  // left, date and place on the right, optional body below. Plain text in
  // reading order, so a parser sees title, subtitle, date, location, body.
  interface Props {
    title: string;
    subtitle?: string;
    date?: string;
    location?: string;
    children?: Snippet;
  }

  let { title, subtitle, date, location, children }: Props = $props();
</script>

<article data-wm="doc-entry">
  <div class="head">
    <div class="left">
      <h3>{title}</h3>
      {#if subtitle}<p class="subtitle">{subtitle}</p>{/if}
    </div>
    {#if date || location}
      <div class="right">
        {#if date}<p class="date">{date}</p>{/if}
        {#if location}<p class="location">{location}</p>{/if}
      </div>
    {/if}
  </div>
  {#if children}<div class="body">{@render children()}</div>{/if}
</article>

<style>
  [data-wm='doc-entry'] { display: block; color: var(--wm-text); break-inside: avoid; }
  .head {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--wm-space-1) var(--wm-space-4);
  }
  .left { min-width: 0; flex: 1 1 auto; }
  .right { text-align: right; margin-left: auto; }
  h3 {
    margin: 0;
    font-size: var(--wm-fs-base);
    font-weight: var(--wm-font-weight-semibold);
    line-height: var(--wm-lh-normal);
    color: var(--wm-text-strong);
  }
  p { margin: 0; }
  .subtitle { font-size: var(--wm-fs-sm); line-height: var(--wm-lh-normal); color: var(--wm-text); }
  .date {
    font-family: var(--wm-font-mono);
    font-size: var(--wm-fs-xs);
    font-variant-numeric: tabular-nums;
    color: var(--wm-text-muted);
  }
  .location { font-size: var(--wm-fs-xs); color: var(--wm-text-muted); }
  .body {
    margin-top: var(--wm-space-1);
    font-size: var(--wm-fs-sm);
    line-height: var(--wm-lh-relaxed);
  }
  .body :global(ul), .body :global(ol) { margin: 0; padding-left: 1.1em; }
  .body :global(p) { margin: 0; }
</style>
