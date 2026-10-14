<script lang="ts">
  import { Text } from '../../lib/index';

  // Reads computed --wm-* values off the document root so the chips show
  // whichever edition the toolbar has selected.
  interface Props {
    names: string[];
    title: string;
  }
  let { names, title }: Props = $props();

  let hex = $state<Record<string, string>>({});
  $effect(() => {
    const cs = getComputedStyle(document.documentElement);
    const next: Record<string, string> = {};
    for (const n of names) next[n] = cs.getPropertyValue(`--wm-${n}`).trim();
    hex = next;
    const obs = new MutationObserver(() => {
      const c = getComputedStyle(document.documentElement);
      const again: Record<string, string> = {};
      for (const n of names) again[n] = c.getPropertyValue(`--wm-${n}`).trim();
      hex = again;
    });
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => obs.disconnect();
  });
</script>

<div class="group">
  <Text size="xs" tone="muted">{title}</Text>
  <div class="chips">
    {#each names as n (n)}
      <div class="chip">
        <span class="swatch" style:background={`var(--wm-${n})`}></span>
        <span class="name">--wm-{n}</span>
        <span class="hex">{hex[n]}</span>
      </div>
    {/each}
  </div>
</div>

<style>
  .group { display: flex; flex-direction: column; gap: var(--wm-space-2); }
  .chips { display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: var(--wm-space-2); }
  .chip { display: flex; align-items: center; gap: var(--wm-space-2); padding: var(--wm-space-2); border: 1px solid var(--wm-border); border-radius: var(--wm-radius-sm); background: var(--wm-surface-1); }
  .swatch { flex: none; width: 28px; height: 28px; border-radius: var(--wm-radius-sm); border: 1px solid var(--wm-border); }
  .name { font-family: var(--wm-font-mono); font-size: var(--wm-fs-xs); color: var(--wm-text); }
  .hex { margin-inline-start: auto; font-family: var(--wm-font-mono); font-size: var(--wm-fs-xs); color: var(--wm-text-muted); text-transform: uppercase; }
</style>
