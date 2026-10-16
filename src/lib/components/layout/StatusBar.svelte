<script lang="ts">
  import type { Snippet } from 'svelte';

  // The app's bottom bar: a quiet label for where the work lives, the current
  // status in a polite live region, and optional extras at the end. Tone only
  // colours the status text; the words carry the meaning.
  interface Props {
    /** Where the work lives, e.g. "Local workspace". */
    label?: string;
    status: string;
    tone?: 'neutral' | 'warning' | 'error';
    end?: Snippet;
  }

  let { label, status, tone = 'neutral', end }: Props = $props();
</script>

<footer data-wm="status-bar" data-tone={tone}>
  {#if label}<span data-part="label">{label}</span>{/if}
  <span data-part="status" role="status" aria-live="polite">{status}</span>
  {#if end}<div data-part="end">{@render end()}</div>{/if}
</footer>

<style>
  [data-wm='status-bar'] {
    display: flex;
    align-items: center;
    gap: var(--wm-space-3);
    box-sizing: border-box;
    min-height: 40px;
    padding: var(--wm-space-2) var(--wm-space-4);
    background: var(--wm-bg);
    border-top: 1px solid var(--wm-border);
    font-family: var(--wm-font-sans);
  }
  [data-part='label'] {
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    font-size: var(--wm-fs-xs);
    letter-spacing: var(--wm-tracking-wide);
    text-transform: uppercase;
    color: var(--wm-text-faint);
    white-space: nowrap;
  }
  [data-part='status'] {
    min-width: 0;
    font-size: var(--wm-fs-sm);
    line-height: var(--wm-lh-normal);
    color: var(--wm-text);
    overflow-wrap: anywhere;
  }
  [data-tone='warning'] > [data-part='status'] { color: var(--wm-warning); }
  [data-tone='error'] > [data-part='status'] { color: var(--wm-error); }
  [data-part='end'] {
    display: flex;
    align-items: center;
    gap: var(--wm-space-3);
    margin-inline-start: auto;
    font-size: var(--wm-fs-xs);
    color: var(--wm-text-muted);
  }
</style>
