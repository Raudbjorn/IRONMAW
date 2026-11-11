<script lang="ts">
  import type { Snippet } from 'svelte';
  import Terrain from '../../assets/Terrain.svelte';
  import type { IconName } from '../../icons';
  import Heading from '../atoms/Heading.svelte';
  import Icon from '../atoms/Icon.svelte';

  // Centred block for an empty area: what is missing, why, and the next step.
  // Put the one rust action in `actions` when there is one. Terrain is the
  // quiet contour and mountain field the brand allows in empty states; it is
  // decorative and never interactive.
  interface Props {
    title: string;
    icon?: IconName;
    terrain?: boolean;
    actions?: Snippet;
    children: Snippet;
  }

  let { title, icon, terrain = false, actions, children }: Props = $props();
</script>

<section data-wm="empty-state" data-terrain={terrain || undefined}>
  {#if terrain}
    <div class="terrain-crop" aria-hidden="true">
      <div class="terrain-edge left"><Terrain preserveAspectRatio="xMidYMax meet" /></div>
      <div class="terrain-edge right"><Terrain preserveAspectRatio="xMidYMax meet" /></div>
    </div>
  {/if}
  <div class="content">
    {#if icon}<span class="icon"><Icon name={icon} size={24} /></span>{/if}
    <Heading level={2}>{title}</Heading>
    <div class="text">{@render children()}</div>
    {#if actions}<div class="actions">{@render actions()}</div>{/if}
  </div>
</section>

<style>
  [data-wm='empty-state'] {
    position: relative;
    isolation: isolate;
    box-sizing: border-box;
    padding: var(--wm-space-8) var(--wm-space-6);
    text-align: center;
    font-family: var(--wm-font-sans);
  }
  .terrain-crop {
    position: absolute;
    inset: 0;
    z-index: -1;
    overflow: hidden;
    opacity: 0.3;
    pointer-events: none;
    mask-image: linear-gradient(to right, black 0%, transparent 28%, transparent 72%, black 100%);
  }
  .terrain-crop :global(svg) { display: block; width: 100%; height: 100%; }
  .terrain-edge { position: absolute; inset-block: 0; width: 50%; }
  .left { left: 0; transform: scaleX(-1); }
  .right { right: 0; }
  .content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-inline: auto;
    max-width: 46ch;
  }
  .icon { display: inline-flex; margin-bottom: var(--wm-space-3); color: var(--wm-text-faint); }
  .text {
    margin-top: var(--wm-space-2);
    font-size: var(--wm-fs-base);
    line-height: var(--wm-lh-relaxed);
    color: var(--wm-text-muted);
    text-wrap: pretty;
  }
  .text :global(p) { margin: 0; }
  .text :global(p + p) { margin-top: var(--wm-space-3); }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: var(--wm-space-2);
    margin-top: var(--wm-space-4);
  }
</style>
