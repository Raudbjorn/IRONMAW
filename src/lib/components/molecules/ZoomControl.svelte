<script lang="ts">
  // Floating zoom bar for the page canvas: out, a value toggle (Fit <-> 100%
  // and back), in, and an optional page count. Reports the next value; the
  // consumer owns the zoom. Left/Right move focus between the buttons.
  import Button from '../atoms/Button.svelte';

  interface Props {
    /** Percent, or 'fit'. */
    value: number | 'fit';
    min?: number;
    max?: number;
    step?: number;
    onchange?: (value: number | 'fit') => void;
    pageCount?: number;
    floating?: boolean;
  }

  let { value, min = 25, max = 400, step = 25, onchange, pageCount, floating = true }: Props = $props();

  const FIT_BASE_PERCENT = 100;
  const base = $derived(value === 'fit' ? FIT_BASE_PERCENT : value);
  const atMin = $derived(value !== 'fit' && value <= min);
  const atMax = $derived(value !== 'fit' && value >= max);

  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  function nudge(dir: 1 | -1) {
    onchange?.(clamp(base + dir * step));
  }

  function toggle() {
    onchange?.(value === 'fit' ? FIT_BASE_PERCENT : 'fit');
  }

  function keys(e: KeyboardEvent) {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
    const bar = e.currentTarget as HTMLElement;
    const list = Array.from(bar.querySelectorAll<HTMLElement>('button:not([disabled])'));
    const i = list.indexOf(document.activeElement as HTMLElement);
    if (!list.length) return;
    e.preventDefault();
    const j = e.key === 'ArrowRight' ? (i + 1) % list.length : (i - 1 + list.length) % list.length;
    list[j]?.focus();
  }
</script>

<div data-wm="zoom-control" data-floating={floating || undefined} role="toolbar" aria-label="Zoom" tabindex="-1" onkeydown={keys}>
  <Button variant="ghost" size="xs" icon="minus" label="Zoom out" disabled={atMin} onclick={() => nudge(-1)} />
  <Button variant="ghost" size="xs" onclick={toggle}>
    <span class="figure">{value === 'fit' ? 'Fit' : `${value}%`}</span>
    <span class="sr">{value === 'fit' ? 'Set zoom to 100%' : 'Fit to width'}</span>
  </Button>
  <Button variant="ghost" size="xs" icon="plus" label="Zoom in" disabled={atMax} onclick={() => nudge(1)} />
  {#if pageCount !== undefined}
    <span class="rule" aria-hidden="true"></span>
    <span class="pages">{pageCount} {pageCount === 1 ? 'page' : 'pages'}</span>
  {/if}
</div>

<style>
  [data-wm='zoom-control'] {
    display: inline-flex;
    align-items: center;
    gap: var(--wm-space-1);
    box-sizing: border-box;
    padding: var(--wm-space-1);
    outline: none;
  }
  [data-floating] {
    background: var(--wm-surface-2);
    border: 1px solid var(--wm-border-strong);
    border-radius: var(--wm-radius-md);
    box-shadow: var(--wm-shadow-md);
  }
  /* The value reads as a figure, not a label: mono, sentence case. */
  .figure {
    font-family: var(--wm-font-mono);
    font-size: var(--wm-fs-xs);
    font-variant-numeric: tabular-nums;
    text-transform: none;
    letter-spacing: 0;
    min-width: 4ch;
    text-align: center;
  }
  .rule { align-self: stretch; width: 1px; margin: var(--wm-space-1) var(--wm-space-1); background: var(--wm-border); }
  .pages { padding-inline: var(--wm-space-2); font-family: var(--wm-font-mono); font-size: var(--wm-fs-xs); font-variant-numeric: tabular-nums; color: var(--wm-text-muted); white-space: nowrap; }
  .sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
</style>
