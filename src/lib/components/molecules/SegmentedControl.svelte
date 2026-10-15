<script module lang="ts">
  import type { IconName } from '../../icons.ts';

  export type SegmentOption = {
    id: string;
    label: string;
    icon?: IconName;
    count?: number;
    countTone?: 'neutral' | 'warning' | 'accent';
    /** Accessible text for the count, e.g. "6 checks to review". */
    countLabel?: string;
    disabled?: boolean;
  };
</script>

<script lang="ts">
  import Icon from '../atoms/Icon.svelte';
  import Badge from '../atoms/Badge.svelte';

  // A single-choice mode switch (Write · Design · Check). The selected segment
  // is a filled teal block: selection is interactive state, so teal, not rust.
  // Radiogroup semantics with a roving tabindex; arrows move and select,
  // skipping disabled segments, and wrap.
  interface Props {
    options: SegmentOption[];
    /** The selected option id (two-way). */
    value?: string;
    onchange?: (id: string) => void;
    'aria-label': string;
    size?: 'sm' | 'md';
    /** Show only icons; labels become accessible names and tooltips. */
    iconOnly?: boolean;
  }

  let { options, value = $bindable(), onchange, 'aria-label': ariaLabel, size = 'md', iconOnly = false }: Props = $props();

  const selectedId = $derived(
    options.some((o) => o.id === value && !o.disabled) ? value : options.find((o) => !o.disabled)?.id
  );

  let lastInvalidValue: string | undefined;
  let lastSelectedId: string | undefined;
  let correctionNotified = false;

  $effect(() => {
    if (selectedId === undefined) return;
    if (selectedId === value) {
      correctionNotified = false;
      return;
    }
    if (!onchange) {
      value = selectedId;
      return;
    }
    if (correctionNotified && lastInvalidValue === value && lastSelectedId === selectedId) return;
    lastInvalidValue = value;
    lastSelectedId = selectedId;
    correctionNotified = true;
    onchange(selectedId);
  });

  function select(id: string) {
    value = id;
    onchange?.(id);
  }

  function keyNav(e: KeyboardEvent, i: number) {
    const n = options.length;
    let step = 0;
    let j = i;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') step = 1;
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') step = -1;
    else if (e.key === 'Home') { j = -1; step = 1; }
    else if (e.key === 'End') { j = n; step = -1; }
    else return;
    e.preventDefault();
    for (let k = 0; k < n; k++) {
      j = (j + step + n) % n;
      if (!options[j]?.disabled) break;
    }
    const next = options[j];
    if (!next || next.disabled) return;
    select(next.id);
    const btns = (e.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('[role="radio"]');
    btns?.[j]?.focus();
  }
</script>

<div data-wm="segmented-control" data-size={size} role="radiogroup" aria-label={ariaLabel}>
  {#each options as o, i (o.id)}
    <button
      type="button"
      role="radio"
      aria-checked={selectedId === o.id}
      aria-label={iconOnly ? o.label : undefined}
      title={iconOnly ? o.label : undefined}
      tabindex={selectedId === o.id ? 0 : -1}
      disabled={o.disabled}
      data-selected={selectedId === o.id || undefined}
      onclick={() => select(o.id)}
      onkeydown={(e) => keyNav(e, i)}
    >
      {#if o.icon}<Icon name={o.icon} size={16} />{/if}
      {#if !iconOnly}<span class="label">{o.label}</span>{/if}
      {#if o.count !== undefined && !iconOnly}
        <span class="count" data-tone={o.countTone ?? 'neutral'}>
          <Badge value={o.count} tone={o.countTone ?? 'neutral'} label={o.countLabel} />
        </span>
      {/if}
    </button>
  {/each}
</div>

<style>
  [data-wm='segmented-control'] {
    display: inline-flex;
    width: fit-content;
    max-width: 100%;
    box-sizing: border-box;
    border: 1px solid var(--wm-border-strong);
    border-radius: var(--wm-radius-sm);
    background: var(--wm-surface-1);
    overflow: hidden;
  }
  button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--wm-space-2);
    box-sizing: border-box;
    flex: 0 1 auto;
    min-width: 32px;
    padding: 2px var(--wm-space-3);
    border: none;
    border-radius: 0;
    background: none;
    color: var(--wm-text-muted);
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    font-size: var(--wm-fs-sm);
    text-transform: uppercase;
    letter-spacing: var(--wm-tracking-display);
    text-align: center;
    line-height: 1.1;
    cursor: pointer;
    transition: background-color 0.12s ease, color 0.12s ease;
  }
  button + button { border-left: 1px solid var(--wm-border); }
  [data-size='sm'] button { min-height: var(--wm-control-sm); }
  [data-size='md'] button { min-height: var(--wm-control-md); }
  button:hover:not(:disabled):not([data-selected]) {
    background: var(--wm-surface-2);
    color: var(--wm-text);
  }
  button[data-selected] {
    background: var(--wm-accent);
    color: var(--wm-accent-ink);
    font-weight: var(--wm-display-weight-bold);
  }
  button:disabled { opacity: 0.5; cursor: not-allowed; }
  button:focus-visible {
    outline: 2px solid var(--wm-accent);
    outline-offset: 2px;
    position: relative;
  }
  button[data-selected]:focus-visible { outline-offset: -4px; outline-color: var(--wm-accent-ink); }
  .count { display: inline-flex; }
  /* On the filled teal segment, keep the badge on a readable surface. */
  [data-selected] .count :global([data-wm='badge']) {
    background: var(--wm-surface-1);
    border-color: var(--wm-surface-1);
    color: var(--wm-text-strong);
  }
  @media (prefers-reduced-motion: reduce) {
    button { transition: none; }
  }
</style>
