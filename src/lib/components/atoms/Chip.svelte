<script lang="ts">
  import Icon from './Icon.svelte';
  // Filter chip. Colour reflects STATE (selected = teal fill), never a
  // category hierarchy. The remove control is its own 28px button named
  // "Remove <label>" so screen readers hear what goes away.
  interface Props {
    label: string;
    /** Secondary figure after the label, e.g. a collection-wide count. */
    count?: number | string;
    selected?: boolean;
    /** Makes the chip itself a button. */
    onclick?: (e: MouseEvent) => void;
    /** Renders the remove control. */
    onremove?: () => void;
    /** Prefix for the remove control's accessible name. */
    removeLabel?: string;
  }

  let { label, count, selected = false, onclick, onremove, removeLabel = 'Remove' }: Props = $props();
</script>

<span data-wm="chip" data-selected={selected || undefined} data-interactive={onclick ? true : undefined}>
  {#if onclick}
    <button type="button" class="body" aria-pressed={selected} {onclick}>
      <span class="label">{label}</span>{#if count !== undefined}<span class="count">{count}</span>{/if}
    </button>
  {:else}
    <span class="body">
      <span class="label">{label}</span>{#if count !== undefined}<span class="count">{count}</span>{/if}
    </span>
  {/if}
  {#if onremove}
    <button type="button" class="remove" aria-label={`${removeLabel} ${label}`} onclick={onremove}>
      <Icon name="close" size={12} />
    </button>
  {/if}
</span>

<style>
  [data-wm='chip'] {
    display: inline-flex;
    align-items: stretch;
    min-height: 28px;
    box-sizing: border-box;
    border: 1px solid var(--wm-border-strong);
    border-radius: var(--wm-radius-sm);
    background: transparent;
    color: var(--wm-text);
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-sm);
    line-height: 1;
    transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease;
  }
  .body {
    display: inline-flex;
    align-items: center;
    gap: var(--wm-space-2);
    padding: 0 var(--wm-space-3);
    background: none;
    border: 0;
    border-radius: inherit;
    color: inherit;
    font: inherit;
    cursor: default;
  }
  button.body { cursor: pointer; }
  .count {
    font-family: var(--wm-font-mono);
    font-size: var(--wm-fs-xs);
    color: var(--wm-text-muted);
  }
  [data-interactive]:hover { background: var(--wm-surface-2); }
  [data-selected] {
    background: var(--wm-accent);
    border-color: var(--wm-accent);
    color: var(--wm-accent-ink);
  }
  [data-selected] .count { color: var(--wm-accent-ink); opacity: 0.8; }
  [data-selected][data-interactive]:hover { background: color-mix(in oklab, var(--wm-accent), var(--wm-mix-target) 12%); }
  .remove {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    margin: -1px -1px -1px 0;
    padding: 0;
    background: none;
    border: 0;
    border-left: 1px solid color-mix(in oklab, currentColor, transparent 70%);
    border-radius: 0 var(--wm-radius-sm) var(--wm-radius-sm) 0;
    color: inherit;
    font: inherit;
    font-size: var(--wm-fs-lg);
    cursor: pointer;
  }
  .remove:hover { background: color-mix(in oklab, currentColor, transparent 85%); }
  .body:focus-visible,
  .remove:focus-visible {
    outline: 2px solid var(--wm-accent);
    outline-offset: 2px;
    position: relative;
    z-index: 1;
  }
  [data-selected] .body:focus-visible,
  [data-selected] .remove:focus-visible { outline-color: var(--wm-text-strong); }
</style>
