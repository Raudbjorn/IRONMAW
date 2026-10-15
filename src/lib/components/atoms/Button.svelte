<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { IconName } from '../../icons.ts';
  import Icon from './Icon.svelte';

  // Primary = rust fill, charcoal label, one clipped corner (the chamfer from
  // component board B3). Secondary = slate outline. Ghost = text only.
  // Danger = error fill. Dashed = an empty slot inviting an addition ("Add
  // section"): dashed slate outline, full width of its container. Labels are display face, uppercase, tracked — short
  // verbs only ("Search", "Copy passage with source").
  interface Props {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'dashed';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    /** When set, renders an anchor. */
    href?: string;
    type?: 'button' | 'submit';
    disabled?: boolean;
    /** Busy state: aria-busy + disabled, with a small ring before the label. */
    loading?: boolean;
    /** The clipped corner. Defaults on for primary and danger, off otherwise. */
    chamfer?: boolean;
    /** Icon-only button: children are the glyph; label is the accessible name. */
    label?: string;
    /** Disclosure state, for toggles that reveal a region. */
    'aria-expanded'?: boolean;
    'aria-controls'?: string;
    /** Leading icon from the IRONMAW set. With `label` and no children, renders icon-only. */
    icon?: IconName;
    /** Trailing icon, e.g. chevron-down on a menu trigger. */
    iconEnd?: IconName;
    /** Inter, sentence case, untracked: for names and document titles used as triggers. Never uppercases user text. */
    plain?: boolean;
    'aria-haspopup'?: 'menu' | 'listbox' | 'dialog' | boolean;
    'aria-pressed'?: boolean;
    onclick?: (e: MouseEvent) => void;
    children?: Snippet;
  }

  let {
    variant = 'primary',
    size = 'md',
    href,
    type = 'button',
    disabled = false,
    loading = false,
    chamfer,
    label,
    'aria-expanded': ariaExpanded,
    'aria-controls': ariaControls,
    'aria-haspopup': ariaHaspopup,
    'aria-pressed': ariaPressed,
    icon,
    iconEnd,
    plain = false,
    onclick,
    children
  }: Props = $props();

  const iconSize = $derived(size === 'lg' ? 20 : 16);

  const clipped = $derived(chamfer ?? (variant === 'primary' || variant === 'danger'));
</script>

{#if href}
  <a
    {href}
    data-wm="button"
    data-variant={variant}
    data-size={size}
    data-chamfer={clipped || undefined}
    data-icon-only={label ? true : undefined}
    data-plain={plain || undefined}
    aria-label={label}
    aria-disabled={disabled || undefined}
    aria-busy={loading || undefined}
    {onclick}
  >
    {#if loading}<span class="ring" aria-hidden="true"></span>{:else if icon}<Icon name={icon} size={iconSize} />{/if}
    {@render children?.()}
    {#if iconEnd}<Icon name={iconEnd} size={iconSize} />{/if}
  </a>
{:else}
  <button
    {type}
    data-wm="button"
    data-variant={variant}
    data-size={size}
    data-chamfer={clipped || undefined}
    data-icon-only={label ? true : undefined}
    data-plain={plain || undefined}
    aria-label={label}
    aria-expanded={ariaExpanded}
    aria-controls={ariaControls}
    aria-haspopup={ariaHaspopup}
    aria-pressed={ariaPressed}
    disabled={disabled || loading}
    aria-busy={loading || undefined}
    {onclick}
  >
    {#if loading}<span class="ring" aria-hidden="true"></span>{:else if icon}<Icon name={icon} size={iconSize} />{/if}
    {@render children?.()}
    {#if iconEnd}<Icon name={iconEnd} size={iconSize} />{/if}
  </button>
{/if}

<style>
  [data-wm='button'] {
    position: relative;
    isolation: isolate;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--wm-space-2);
    box-sizing: border-box;
    border: 1px solid transparent;
    border-radius: var(--wm-radius-sm);
    background: transparent;
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    text-transform: uppercase;
    letter-spacing: var(--wm-tracking-wide);
    line-height: 1;
    cursor: pointer;
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.12s ease, border-color 0.12s ease, background-color 0.12s ease;
  }
  /* The fill lives on a pseudo-element so the chamfer clip never eats the focus ring. */
  [data-wm='button']::before {
    content: '';
    position: absolute;
    inset: -1px;
    z-index: -1;
    border-radius: inherit;
    background: var(--fill, transparent);
    transition: background-color 0.12s ease;
  }
  [data-chamfer]::before {
    border-radius: 0;
    clip-path: polygon(0 0, calc(100% - var(--wm-chamfer)) 0, 100% var(--wm-chamfer), 100% 100%, 0 100%);
  }
  [data-chamfer] { border-radius: 0; }

  [data-size='xs'] { min-height: var(--wm-control-xs); font-size: var(--wm-fs-xs); padding: 0 var(--wm-space-2); gap: var(--wm-space-1); }
  [data-size='sm'] { min-height: var(--wm-control-sm); font-size: var(--wm-fs-sm); padding: 0 var(--wm-space-3); }
  [data-size='md'] { min-height: var(--wm-control-md); font-size: var(--wm-fs-base); padding: 0 var(--wm-space-4); }
  [data-size='lg'] { min-height: var(--wm-control-lg); font-size: var(--wm-fs-lg); padding: 0 var(--wm-space-6); }
  [data-icon-only][data-size='xs'] { width: var(--wm-control-xs); padding: 0; }
  [data-icon-only][data-size='sm'] { width: var(--wm-control-sm); padding: 0; }
  [data-icon-only][data-size='md'] { width: var(--wm-control-md); padding: 0; }
  [data-icon-only][data-size='lg'] { width: var(--wm-control-lg); padding: 0; }

  [data-plain] {
    font-family: var(--wm-font-sans);
    font-weight: var(--wm-font-weight-semibold);
    text-transform: none;
    letter-spacing: 0;
  }
  [data-variant='primary'] { --fill: var(--wm-action); color: var(--wm-action-ink); font-weight: var(--wm-display-weight-bold); }
  [data-variant='primary']:hover { --fill: var(--wm-action-hover); }
  [data-variant='secondary'] { color: var(--wm-text); border-color: var(--wm-border-strong); }
  [data-variant='secondary']:hover { --fill: var(--wm-surface-2); color: var(--wm-text-strong); }
  [data-variant='ghost'] { color: var(--wm-text-muted); }
  [data-variant='ghost']:hover { --fill: var(--wm-surface-2); color: var(--wm-text); }
  [data-variant='dashed'] {
    width: 100%;
    color: var(--wm-accent);
    border: 1px dashed var(--wm-border-strong);
  }
  [data-variant='dashed']:hover { --fill: var(--wm-surface-1); border-color: var(--wm-accent); }
  [aria-pressed='true'] { --fill: var(--wm-selected); color: var(--wm-text-strong); }
  [data-variant='danger'] { --fill: var(--wm-error); color: var(--wm-action-ink); font-weight: var(--wm-display-weight-bold); }
  [data-variant='danger']:hover { --fill: color-mix(in oklab, var(--wm-error), var(--wm-mix-target) 12%); }

  [data-wm='button']:focus-visible {
    outline: 2px solid var(--wm-accent);
    outline-offset: 2px;
  }
  button[disabled] { opacity: 0.5; cursor: not-allowed; }
  [aria-disabled='true'] { opacity: 0.5; pointer-events: none; }
  [aria-busy='true'] { cursor: progress; }

  .ring {
    width: 0.9em;
    height: 0.9em;
    box-sizing: border-box;
    border-radius: 50%;
    border: 2px solid color-mix(in oklab, currentColor, transparent 60%);
    border-top-color: currentColor;
    animation: wm-ring 0.8s linear infinite;
  }
  @keyframes wm-ring { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
    [data-wm='button'] { transition: none; }
    .ring { animation: none; }
  }
</style>
