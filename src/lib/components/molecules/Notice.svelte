<script lang="ts">
  import type { Snippet } from 'svelte';

  // Page-level and inline notices: service unavailable, index refreshed,
  // clipboard failure, known-issue context. Warning and error are amber and
  // red, never rust — a notice must not look like a routine action. The
  // action slot holds the recovery control (Retry); the message says what
  // happened and what is kept.
  interface Props {
    tone?: 'info' | 'success' | 'warning' | 'error' | 'status';
    title?: string;
    children: Snippet;
    /** Recovery action, e.g. a Retry button. */
    action?: Snippet;
    /** Renders a dismiss control with this accessible name. */
    dismissLabel?: string;
    ondismiss?: () => void;
  }

  let { tone = 'info', title, children, action, dismissLabel, ondismiss }: Props = $props();

  const marks = { info: 'i', success: '✓', warning: '▲', error: '▲', status: '↻' } as const;
  const live = $derived(tone === 'error' || tone === 'warning' ? 'alert' : 'status');
</script>

<div data-wm="notice" data-tone={tone} role={live}>
  <span class="mark" aria-hidden="true">{marks[tone]}</span>
  <div class="body">
    {#if title}<span class="title">{title}</span>{/if}
    <span class="text">{@render children()}</span>
  </div>
  {#if action}<div class="action">{@render action()}</div>{/if}
  {#if ondismiss}
    <button type="button" class="dismiss" aria-label={dismissLabel ?? 'Dismiss'} onclick={ondismiss}><span aria-hidden="true">×</span></button>
  {/if}
</div>

<style>
  [data-wm='notice'] {
    --tone: var(--wm-accent);
    display: flex;
    gap: var(--wm-space-3);
    align-items: center;
    flex-wrap: wrap;
    padding: var(--wm-space-3) var(--wm-space-4);
    border: 1px solid var(--tone);
    border-radius: var(--wm-radius-sm);
    background: color-mix(in oklab, var(--tone), var(--wm-surface-1) 90%);
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-base);
    line-height: var(--wm-lh-normal);
    color: var(--wm-text);
  }
  [data-tone='success'] { --tone: var(--wm-success); }
  [data-tone='warning'] { --tone: var(--wm-warning); }
  [data-tone='error'] { --tone: var(--wm-error); }
  [data-tone='status'] { --tone: var(--wm-structure); }
  .mark {
    flex: none;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 1.5px solid var(--tone);
    color: var(--tone);
    font-family: var(--wm-font-mono);
    font-size: var(--wm-fs-xs);
    font-weight: 700;
    line-height: 1;
  }
  [data-tone='warning'] .mark,
  [data-tone='error'] .mark { border: 0; font-size: var(--wm-fs-lg); }
  .body { flex: 1 1 24ch; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .title { color: var(--wm-text-strong); font-weight: var(--wm-font-weight-semibold); }
  .action { flex: none; margin-inline-start: auto; }
  .dismiss {
    flex: none;
    width: 28px;
    height: 28px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: 0;
    border-radius: var(--wm-radius-sm);
    color: var(--wm-text-muted);
    font-size: var(--wm-fs-lg);
    cursor: pointer;
  }
  .dismiss:hover { color: var(--wm-text-strong); background: color-mix(in oklab, var(--tone), transparent 85%); }
  .dismiss:focus-visible { outline: 2px solid var(--wm-accent); outline-offset: 2px; }
</style>
