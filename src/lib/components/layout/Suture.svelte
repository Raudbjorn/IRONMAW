<script lang="ts">
  // The seam — the system's signature. Wormian bones sit inside the skull's
  // sutures; here a suture is a thin slate line that admits a short rust
  // tick and, optionally, a display label. It marks a real join between parts;
  // terrain art is reserved for brand headers and empty states.
  interface Props {
    /** Uppercase display label set into the line. */
    label?: string;
    /** The rust tick. On by default. */
    tick?: boolean;
    orientation?: 'horizontal' | 'vertical';
  }

  let { label, tick = true, orientation = 'horizontal' }: Props = $props();
</script>

{#if label}
  <div data-wm="suture" data-orientation={orientation} data-tick={tick || undefined} role="separator" aria-orientation={orientation}>
    <span class="label">{label}</span>
  </div>
{:else}
  <hr data-wm="suture" data-orientation={orientation} data-tick={tick || undefined} aria-orientation={orientation} />
{/if}

<style>
  /* `hr` carries overflow:hidden + a border in the UA stylesheet; both are
     reset so the pseudo-element tick and line can paint. */
  [data-wm='suture'] {
    --line: var(--wm-border);
    display: flex;
    align-items: center;
    gap: var(--wm-space-3);
    margin: 0;
    padding: 0;
    border: 0;
    min-width: 0;
    overflow: visible;
    box-sizing: border-box;
  }
  [data-orientation='horizontal'] { width: 100%; height: 2px; }
  [data-orientation='vertical'] { flex-direction: column; width: 2px; min-height: var(--wm-space-8); align-self: stretch; }

  /* Tick, then line. */
  [data-wm='suture']::before,
  [data-wm='suture']::after { content: ''; display: block; background: var(--line); }
  [data-orientation='horizontal']::before { width: var(--wm-tick); height: 2px; flex: none; }
  [data-orientation='horizontal']::after { flex: 1; height: 1px; }
  [data-orientation='vertical']::before { width: 2px; height: var(--wm-tick); flex: none; }
  [data-orientation='vertical']::after { flex: 1; width: 1px; }
  [data-tick]::before { background: var(--wm-action); }
  [data-wm='suture']:not([data-tick])::before { display: none; }

  .label {
    flex: none;
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    font-size: var(--wm-fs-xs);
    text-transform: uppercase;
    letter-spacing: var(--wm-tracking-display);
    color: var(--wm-text-muted);
    white-space: nowrap;
  }
  [data-orientation='vertical'] .label { writing-mode: vertical-rl; }
</style>
