<script lang="ts">
  import Icon from './Icon.svelte';

  // Quiet save feedback for a header: "Saved" is faint on purpose, "Not saved"
  // is amber (needs attention, never rust), "Couldn't save" is error. A polite
  // live region, so changes are announced without stealing focus.
  interface Props {
    state: 'saved' | 'saving' | 'unsaved' | 'error';
    /** Overrides the default text. */
    label?: string;
  }

  let { state, label }: Props = $props();

  const COPY = {
    saved: 'Saved',
    saving: 'Saving…',
    unsaved: 'Not saved',
    error: "Couldn't save"
  } as const;
  const ICON = { saved: 'saved', unsaved: 'unsaved', error: 'error' } as const;
</script>

<span data-wm="save-status" data-state={state} role="status" aria-live="polite">
  {#if state === 'saving'}
    <span class="ring" aria-hidden="true"></span>
  {:else}
    <Icon name={ICON[state]} size={12} />
  {/if}
  <span>{label ?? COPY[state]}</span>
</span>

<style>
  [data-wm='save-status'] {
    display: inline-flex;
    align-items: center;
    gap: var(--wm-space-1);
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-xs);
    line-height: var(--wm-lh-normal);
    color: var(--wm-text-faint);
  }
  [data-state='saving'] { color: var(--wm-text-muted); }
  [data-state='unsaved'] { color: var(--wm-warning); }
  [data-state='error'] { color: var(--wm-error); }
  .ring {
    flex: none;
    box-sizing: border-box;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 2px solid var(--wm-structure);
    border-top-color: var(--wm-text-muted);
    animation: wm-save-spin 0.8s linear infinite;
  }
  @keyframes wm-save-spin { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
    .ring { animation: none; border-top-color: var(--wm-text-muted); }
  }
</style>
