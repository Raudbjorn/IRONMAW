<script lang="ts">
  import Button from '../atoms/Button.svelte';

  // Continuation control for the result list. No page numbers or totals
  // until the API returns a reliable count. Loading keeps the button in
  // the tab order (aria-busy, not disabled). Failure keeps the loaded rows
  // and offers Retry where the failure happened. End is a plain statement.
  interface Props {
    state?: 'idle' | 'loading' | 'failed' | 'end';
    label?: string;
    loadingLabel?: string;
    failedText?: string;
    retryLabel?: string;
    endText?: string;
    onclick?: () => void;
  }

  let {
    state = 'idle',
    label = 'Load 20 more documents',
    loadingLabel = 'Loading…',
    failedText = 'Couldn’t load more documents.',
    retryLabel = 'Retry loading more',
    endText = 'End of results',
    onclick
  }: Props = $props();
</script>

<div data-wm="loadmore" data-state={state}>
  {#if state === 'end'}
    <span class="end">{endText}</span>
  {:else if state === 'failed'}
    <span class="failed" role="alert">{failedText}</span>
    <Button variant="secondary" {onclick}>{retryLabel}</Button>
  {:else}
    <Button variant="secondary" loading={state === 'loading'} {onclick}>{state === 'loading' ? loadingLabel : label}</Button>
  {/if}
</div>

<style>
  [data-wm='loadmore'] {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--wm-space-4);
    flex-wrap: wrap;
    padding: var(--wm-space-4);
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-sm);
  }
  .end {
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    text-transform: uppercase;
    letter-spacing: var(--wm-tracking-display);
    color: var(--wm-text-faint);
  }
  .failed { color: var(--wm-error); }
</style>
