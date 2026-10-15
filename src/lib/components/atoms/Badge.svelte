<script lang="ts">
  // A short figure or tag riding on another control: the count of open
  // checks beside "Check", a "New" tag. Counts are monospace with tabular
  // figures. Show only numbers the data can back; never a placeholder count.
  // Tones follow the colour jobs: warning = needs attention (amber),
  // accent = interactive emphasis (teal), neutral = plain quantity.
  interface Props {
    /** The figure or short tag text. */
    value: number | string;
    tone?: 'neutral' | 'accent' | 'warning' | 'error';
    /** Accessible text when the bare value would be ambiguous, e.g. "6 checks to review". */
    label?: string;
  }

  let { value, tone = 'neutral', label }: Props = $props();

  const numeric = $derived(typeof value === 'number' || /^\d+$/.test(String(value)));
</script>

<span data-wm="badge" data-tone={tone} data-numeric={numeric || undefined}>
  {#if label}<span class="vh">{label}</span><span aria-hidden="true">{value}</span>{:else}{value}{/if}
</span>

<style>
  [data-wm='badge'] {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    padding: 0 5px;
    box-sizing: border-box;
    border: 1px solid var(--wm-border-strong);
    border-radius: var(--wm-radius-sm);
    color: var(--wm-text-muted);
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    font-size: var(--wm-fs-xs);
    letter-spacing: var(--wm-tracking-wide);
    text-transform: uppercase;
    line-height: 1;
    white-space: nowrap;
  }
  [data-numeric] {
    font-family: var(--wm-font-mono);
    font-weight: var(--wm-font-weight-normal);
    letter-spacing: 0;
    font-variant-numeric: tabular-nums;
  }
  [data-tone='accent'] { border-color: var(--wm-accent); color: var(--wm-accent); }
  [data-tone='warning'] {
    border-color: var(--wm-warning);
    background: color-mix(in oklab, var(--wm-warning), transparent 85%);
    color: var(--wm-text-strong);
  }
  [data-tone='error'] {
    border-color: var(--wm-error);
    background: color-mix(in oklab, var(--wm-error), transparent 85%);
    color: var(--wm-text-strong);
  }
  .vh {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
</style>
