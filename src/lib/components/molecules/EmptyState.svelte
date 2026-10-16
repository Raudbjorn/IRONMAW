<script lang="ts">
  import type { Snippet } from 'svelte';
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
      <svg viewBox="0 0 800 160" preserveAspectRatio="xMidYMid slice" focusable="false">
        <g class="contours" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M-20 40c68 4 75 52 146 49 68-4 75-39 141-24 47 11 57 43 116 38 32-2 49-13 70-20" />
          <path d="M-35 63c69 6 82 57 154 53 72-4 86-38 147-20 43 13 53 45 112 43 35-2 52-13 75-19" />
          <path d="M310 30c73 6 90 59 164 57 77-3 90-38 151-18 45 15 55 45 113 45 34 0 54-11 78-17" />
          <path d="M310 55c76 8 95 61 172 60 82-2 99-37 161-15 45 17 56 43 115 46 38 2 56-8 77-14" />
        </g>
        <path class="ridge" d="M120 149l34-30 18 15 31-37 23 21 37-45 42 43 21-18 49 49" fill="none" stroke="currentColor" stroke-width="2" />
      </svg>
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
    color: var(--wm-structure);
    opacity: 0.3;
    pointer-events: none;
    mask-image: linear-gradient(to right, black 0%, transparent 28%, transparent 72%, black 100%);
  }
  .terrain-crop svg { display: block; width: 100%; height: 100%; }
  .terrain-crop .contours { color: var(--wm-accent); opacity: 0.6; }
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
