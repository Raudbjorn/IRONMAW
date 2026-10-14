<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  // A fitted surface: charcoal tonal step, quiet border, small radius.
  // The reader, the category navigation and metadata blocks are Panels.
  // Give it a role/aria-label when it is a landmark (the reader is a
  // labelled nonmodal region).
  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    as?: 'div' | 'section' | 'article' | 'aside' | 'header' | 'footer' | 'nav' | 'li';
    surface?: 1 | 2 | 3;
    padding?: 0 | 2 | 3 | 4 | 6;
    elevated?: boolean;
    /** Reserved for brand headers and empty states, away from dense controls. */
    terrain?: boolean;
    header?: Snippet;
    footer?: Snippet;
    children: Snippet;
  }

  let { as = 'div', surface = 1, padding = 4, elevated = false, terrain = false, header, footer, children, ...rest }: Props = $props();
</script>

<svelte:element this={as} {...rest} data-wm="panel" data-surface={surface} data-padding={padding} data-elevated={elevated || undefined} data-terrain={terrain || undefined}>
  {#if terrain}
    <div class="terrain-crop" aria-hidden="true">
      <svg viewBox="0 0 800 160" preserveAspectRatio="xMidYMid slice" focusable="false">
        <g class="contours" fill="none" stroke="currentColor" stroke-width="1">
          <path d="M355 -18c68 4 75 52 146 49 68-4 75-39 141-24 47 11 57 43 116 38 32-2 49-13 70-20" />
          <path d="M340 5c69 6 82 57 154 53 72-4 86-38 147-20 43 13 53 45 112 43 35-2 52-13 75-19" />
          <path d="M326 30c73 6 90 59 164 57 77-3 90-38 151-18 45 15 55 45 113 45 34 0 54-11 78-17" />
          <path d="M310 55c76 8 95 61 172 60 82-2 99-37 161-15 45 17 56 43 115 46 38 2 56-8 77-14" />
        </g>
        <path class="ridge" d="M455 149l34-30 18 15 31-37 23 21 37-45 42 43 21-18 49 49" fill="none" stroke="currentColor" stroke-width="2" />
        <path class="pine" d="M690 145v-39m-12 30 12-21 12 21m-20-11 8-15 8 15m41 20v-28m-9 20 9-17 9 17" fill="none" stroke="currentColor" stroke-width="2" />
      </svg>
    </div>
  {/if}
  {#if header}<div class="header">{@render header()}</div>{/if}
  <div class="body">{@render children()}</div>
  {#if footer}<div class="footer">{@render footer()}</div>{/if}
</svelte:element>

<style>
  [data-wm='panel'] {
    display: flex;
    flex-direction: column;
    min-width: 0;
    box-sizing: border-box;
    border: 1px solid var(--wm-border);
    border-radius: var(--wm-radius-md);
    color: var(--wm-text);
    font-family: var(--wm-font-sans);
  }
  [data-terrain] { position: relative; isolation: isolate; }
  [data-terrain] > .terrain-crop { position: absolute; inset: 0; overflow: hidden; color: var(--wm-structure); opacity: 0.4; pointer-events: none; mask-image: linear-gradient(to right, transparent 20%, black 75%); }
  .terrain-crop svg { display: block; width: 100%; height: 100%; }
  .terrain-crop .contours { color: var(--wm-accent); opacity: 0.6; }
  [data-terrain] > .header,
  [data-terrain] > .body,
  [data-terrain] > .footer { position: relative; }
  li[data-wm='panel'] { list-style: none; }
  [data-surface='1'] { background: var(--wm-surface-1); }
  [data-surface='2'] { background: var(--wm-surface-2); }
  [data-surface='3'] { background: var(--wm-surface-3); }
  [data-elevated] { box-shadow: var(--wm-shadow-md); }
  .header { border-bottom: 1px solid var(--wm-border); }
  .footer { border-top: 1px solid var(--wm-border); }
  .body { min-width: 0; }
  [data-padding='2'] > * { padding: var(--wm-space-2); }
  [data-padding='3'] > * { padding: var(--wm-space-3); }
  [data-padding='4'] > * { padding: var(--wm-space-4); }
  [data-padding='6'] > * { padding: var(--wm-space-6); }
</style>
