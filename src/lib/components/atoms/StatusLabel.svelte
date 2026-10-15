<script lang="ts">
  import Icon from './Icon.svelte';
  import { reviewStatusCopy, type ReviewTone } from '../../review-status.ts';

  // Three tones only. Text stays in --wm-text (never rust) so the label is
  // readable on every surface; the tone lives in the fill, the border and the
  // triangle. "Known issues" is the only filled label.
  interface Props {
    /** Stored status value, e.g. "known-errors". Unknown values render raw in the plain tone. */
    status: string;
    /** Override the display copy. */
    label?: string;
    /** Override the derived tone. */
    tone?: ReviewTone;
  }

  let { status, label, tone }: Props = $props();
  const copy = $derived(reviewStatusCopy(status));
  const resolvedTone = $derived(tone ?? copy.tone);
  const text = $derived(label ?? copy.label);
</script>

<span data-wm="status" data-tone={resolvedTone} data-status={status}>
  {#if resolvedTone === 'act'}<span class="mark"><Icon name="warning" size={12} /></span>{/if}
  {text}
</span>

<style>
  [data-wm='status'] {
    display: inline-flex;
    align-items: center;
    gap: 0.35em;
    padding: 2px 8px;
    box-sizing: border-box;
    min-height: 22px;
    border: 1px solid var(--wm-structure);
    border-radius: var(--wm-radius-sm);
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-xs);
    line-height: 1.4;
    color: var(--wm-text);
    white-space: nowrap;
  }
  [data-tone='care'] { border-color: var(--wm-action); }
  [data-tone='act'] {
    background: var(--wm-action);
    border-color: var(--wm-action);
    color: var(--wm-action-ink);
    font-weight: var(--wm-font-weight-medium);
  }
  .mark { display: inline-flex; }
</style>
