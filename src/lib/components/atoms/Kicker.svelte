<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLAttributes } from 'svelte/elements';

  // The small uppercase display label from the brand boards ("ICON SYSTEM /",
  // "COLOR PALETTE"). Short labels only; long labels, warnings and reading
  // text stay in Inter sentence case.
  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
    as?: 'span' | 'div' | 'label' | 'h2' | 'h3' | 'h4';
    tone?: 'muted' | 'strong' | 'accent' | 'action';
    /** The short rust tick beneath the label (B2's accent dash). */
    tick?: boolean;
    /** When as="label": the control it names. */
    for?: string;
    children: Snippet;
  }

  let { as = 'span', tone = 'muted', tick = false, for: htmlFor, children, ...rest }: Props = $props();
</script>

<svelte:element this={as} {...rest} for={as === 'label' ? htmlFor : undefined} data-wm="kicker" data-tone={tone} data-tick={tick || undefined}>
  {@render children()}
</svelte:element>

<style>
  [data-wm='kicker'] {
    display: inline-block;
    margin: 0;
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    font-size: var(--wm-fs-sm);
    line-height: 1.2;
    text-transform: uppercase;
    letter-spacing: var(--wm-tracking-display);
    color: var(--wm-text-muted);
  }
  [data-tone='strong'] { color: var(--wm-text-strong); }
  [data-tone='accent'] { color: var(--wm-accent); }
  [data-tone='action'] { color: var(--wm-action); }
  [data-tick]::after {
    content: '';
    display: block;
    width: var(--wm-tick);
    height: 2px;
    margin-top: var(--wm-space-2);
    background: var(--wm-action);
  }
</style>
