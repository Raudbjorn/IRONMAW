<script lang="ts">
  // A circular gauge with its figure in the centre, e.g. how readable a
  // document is to a parser. The arc starts at 12 o'clock and runs clockwise.
  // Not a verdict: show only a score the data backs. No value renders "—".
  interface Props {
    value: number;
    max?: number;
    /** Accessible name, e.g. "Parse readability". */
    label: string;
    size?: 'md' | 'lg';
    tone?: 'accent' | 'warning' | 'error';
  }

  let { value, max = 100, label, size = 'md', tone = 'accent' }: Props = $props();

  const safeMax = $derived(Number.isFinite(max) && max > 0 ? max : 100);
  const known = $derived(Number.isFinite(value));
  const clamped = $derived(known ? Math.min(Math.max(value, 0), safeMax) : 0);
  const px = $derived(size === 'lg' ? 88 : 64);
  const stroke = $derived(size === 'lg' ? 8 : 6);
  const radius = $derived((px - stroke) / 2);
  const circumference = $derived(2 * Math.PI * radius);
  const offset = $derived(circumference * (1 - clamped / safeMax));
  const figure = $derived(known ? String(Math.round(clamped)) : '—');
</script>

<div
  data-wm="score-ring"
  data-size={size}
  data-tone={tone}
  role="meter"
  aria-label={label}
  aria-valuemin={0}
  aria-valuemax={safeMax}
  aria-valuenow={known ? clamped : undefined}
  aria-valuetext={known ? undefined : 'No score yet'}
>
  <svg width={px} height={px} viewBox="0 0 {px} {px}" aria-hidden="true" focusable="false">
    <circle class="track" cx={px / 2} cy={px / 2} r={radius} fill="none" stroke-width={stroke} />
    {#if known}
      <circle
        class="arc"
        cx={px / 2}
        cy={px / 2}
        r={radius}
        fill="none"
        stroke-width={stroke}
        stroke-linecap="round"
        stroke-dasharray={circumference}
        stroke-dashoffset={offset}
        transform="rotate(-90 {px / 2} {px / 2})"
      />
    {/if}
  </svg>
  <span class="figure" aria-hidden="true">{figure}</span>
</div>

<style>
  [data-wm='score-ring'] {
    --tone: var(--wm-accent);
    position: relative;
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
  }
  [data-tone='warning'] { --tone: var(--wm-warning); }
  [data-tone='error'] { --tone: var(--wm-error); }
  svg { display: block; }
  .track { stroke: var(--wm-border); }
  .arc {
    stroke: var(--tone);
    transition: stroke-dashoffset 240ms ease;
  }
  .figure {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight-bold);
    font-variant-numeric: tabular-nums;
    line-height: 1;
    color: var(--wm-text-strong);
  }
  [data-size='md'] .figure { font-size: var(--wm-fs-2xl); }
  [data-size='lg'] .figure { font-size: var(--wm-fs-3xl); }
  @media (prefers-reduced-motion: reduce) {
    .arc { transition: none; }
  }
</style>
