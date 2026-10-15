<script lang="ts">
  // A keyboard hint: "Alt" "↑" as separate keycaps. Use `label` to spell out
  // the combination for assistive tech ("Alt plus Up or Down"); the keycaps
  // themselves are then hidden from it.
  interface Props {
    keys: string[];
    /** Accessible text for the whole combination. */
    label?: string;
  }

  let { keys, label }: Props = $props();
</script>

<span data-wm="kbd" role={label ? 'img' : undefined} aria-label={label}>
  {#each keys as key, i (i)}<kbd aria-hidden={label ? 'true' : undefined}>{key}</kbd>{/each}
</span>

<style>
  [data-wm='kbd'] {
    display: inline-flex;
    align-items: center;
    gap: 2px;
  }
  kbd {
    display: inline-flex;
    align-items: center;
    box-sizing: border-box;
    padding: 0 4px;
    min-width: 18px;
    height: 18px;
    justify-content: center;
    border: 1px solid var(--wm-border-strong);
    border-radius: var(--wm-radius-sm);
    color: var(--wm-text-muted);
    font-family: var(--wm-font-mono);
    font-size: var(--wm-fs-xs);
    line-height: 1;
  }
</style>
