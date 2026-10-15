<script lang="ts">
  import Icon from '../atoms/Icon.svelte';
  import type { Snippet } from 'svelte';

  // Compact branded shell: Mark at left, destinations with a rust active
  // underline (as in the supplied UI board), actions at right. Below 768px they collapse
  // behind a labelled toggle — never a clipped row.
  interface NavItem {
    href: string;
    label: string;
    active?: boolean;
  }

  interface Props {
    brand?: Snippet;
    items?: NavItem[];
    /** Right-aligned actions. */
    children?: Snippet;
    /** Accessible name of the nav landmark. */
    navLabel?: string;
    /** Accessible name of the collapsed-menu toggle. */
    menuLabel?: string;
    closeLabel?: string;
  }

  let { brand, items = [], children, navLabel = 'Primary', menuLabel = 'Menu', closeLabel = 'Close menu' }: Props = $props();
  let open = $state(false);
  const linksId = $props.id();
</script>

<nav aria-label={navLabel} data-wm="navbar">
  <div class="brand">{#if brand}{@render brand()}{/if}</div>
  <button type="button" class="toggle" aria-label={open ? closeLabel : menuLabel} aria-expanded={open} aria-controls={linksId} onclick={() => (open = !open)}>
    <Icon name={open ? 'close' : 'menu'} />
    <span class="toggle-text" aria-hidden="true">{menuLabel}</span>
  </button>
  <div id={linksId} class="links" data-open={open}>
    {#if items.length}
      <ul class="items">
        {#each items as item (item.href)}
          <li>
            <a href={item.href} data-wm="navitem" data-active={item.active || undefined} aria-current={item.active ? 'page' : undefined}>{item.label}</a>
          </li>
        {/each}
      </ul>
    {/if}
    {#if children}<div class="actions">{@render children()}</div>{/if}
  </div>
</nav>

<style>
  [data-wm='navbar'] {
    position: sticky;
    top: 0;
    z-index: var(--wm-z-sticky);
    display: flex;
    align-items: center;
    gap: var(--wm-space-4);
    padding: var(--wm-space-2) var(--wm-space-4);
    background: var(--wm-bg);
    border-bottom: 1px solid var(--wm-border);
    font-family: var(--wm-font-sans);
  }
  .brand { display: flex; align-items: center; min-width: 0; }
  .links { display: flex; align-items: center; gap: var(--wm-space-4); margin-inline-start: auto; min-width: 0; }
  .items { display: flex; gap: var(--wm-space-2); margin: 0; padding: 0; list-style: none; }
  .actions { display: flex; align-items: center; gap: var(--wm-space-2); }

  [data-wm='navitem'] {
    position: relative;
    isolation: isolate;
    display: inline-flex;
    align-items: center;
    min-height: var(--wm-control-sm);
    padding: 0 var(--wm-space-3);
    border: 1px solid transparent;
    color: var(--wm-text);
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    font-size: var(--wm-fs-sm);
    text-transform: uppercase;
    letter-spacing: var(--wm-tracking-display);
    text-decoration: none;
    white-space: nowrap;
    transition: color 0.12s ease, background-color 0.12s ease;
  }
  [data-wm='navitem']:hover { background: var(--wm-surface-2); color: var(--wm-text-strong); }
  [data-wm='navitem'][data-active] { color: var(--wm-text-strong); font-weight: var(--wm-display-weight-bold); }
  [data-wm='navitem'][data-active]::after {
    content: '';
    position: absolute;
    inset-inline: -1px;
    bottom: -1px;
    height: 3px;
    background: var(--wm-action);
  }
  [data-wm='navitem']:focus-visible { outline: 2px solid var(--wm-accent); outline-offset: 2px; }

  .toggle {
    display: none;
    align-items: center;
    gap: var(--wm-space-2);
    margin-inline-start: auto;
    min-height: var(--wm-control-sm);
    padding: 0 var(--wm-space-3);
    background: transparent;
    border: 1px solid var(--wm-border-strong);
    color: var(--wm-text);
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    font-size: var(--wm-fs-sm);
    text-transform: uppercase;
    letter-spacing: var(--wm-tracking-display);
    cursor: pointer;
  }
  .toggle:focus-visible { outline: 2px solid var(--wm-accent); outline-offset: 2px; }
  /* Below --wm-bp-md (768px): collapse destinations behind the toggle. */
  @media (max-width: 767px) {
    .toggle { display: inline-flex; }
    .links {
      display: none;
      position: absolute;
      inset-inline: 0;
      top: 100%;
      flex-direction: column;
      align-items: stretch;
      background: var(--wm-bg);
      border-bottom: 1px solid var(--wm-border);
      padding: var(--wm-space-3) var(--wm-space-4);
      z-index: var(--wm-z-dropdown);
    }
    .links[data-open='true'] { display: flex; }
    .items { flex-direction: column; }
    [data-wm='navitem'] { min-height: 44px; }
    [data-wm='navitem'][data-active]::after { inset-inline: auto; left: -1px; top: -1px; bottom: -1px; width: 3px; height: auto; }
  }
</style>
