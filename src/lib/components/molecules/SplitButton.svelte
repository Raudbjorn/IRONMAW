<script lang="ts">
  // One visual unit: the main action plus a menu of alternatives ("Download
  // PDF" and its other formats). Halves share height and an inner divider;
  // only the trigger's outer top-right carries the chamfer. Primary stays the
  // one rust action of the view.
  import Button from '../atoms/Button.svelte';
  import Menu, { type MenuEntry } from './Menu.svelte';
  import type { IconName } from '../../icons.ts';

  interface Props {
    label: string;
    icon?: IconName;
    variant?: 'primary' | 'secondary';
    size?: 'sm' | 'md' | 'lg';
    onclick?: (e: MouseEvent) => void;
    /** Accessible name of the menu trigger, e.g. "More download options". */
    menuLabel: string;
    items: MenuEntry[];
    onselect?: (id: string) => void;
    loading?: boolean;
    disabled?: boolean;
  }

  let {
    label,
    icon,
    variant = 'primary',
    size = 'sm',
    onclick,
    menuLabel,
    items,
    onselect,
    loading = false,
    disabled = false
  }: Props = $props();
</script>

<div data-wm="split-button" data-variant={variant} role="group" aria-label={label}>
  <Button {variant} {size} {icon} {onclick} {loading} {disabled} chamfer={false}>{label}</Button>
  <span class="divider" aria-hidden="true"></span>
  <Menu
    label={menuLabel}
    icon="chevron-down"
    {variant}
    {size}
    {items}
    disabled={disabled || loading}
    placement="bottom-end"
    chamfer={variant === 'primary'}
    {onselect}
  />
</div>

<style>
  [data-wm='split-button'] { display: inline-flex; align-items: stretch; }
  [data-wm='split-button'] > :global([data-wm='button']) {
    border-start-end-radius: 0;
    border-end-end-radius: 0;
    border-inline-end-width: 0;
  }
  [data-wm='split-button'] :global([data-wm='menu']) { display: inline-flex; }
  [data-wm='split-button'] :global([data-wm='menu'] > [data-wm='button']) {
    border-start-start-radius: 0;
    border-end-start-radius: 0;
    border-inline-start-width: 0;
  }
  .divider { flex: none; width: 1px; background: var(--wm-border-strong); }
  [data-variant='primary'] .divider {
    background:
      linear-gradient(color-mix(in oklab, var(--wm-action-ink), transparent 70%), color-mix(in oklab, var(--wm-action-ink), transparent 70%)),
      var(--wm-action);
  }
</style>
