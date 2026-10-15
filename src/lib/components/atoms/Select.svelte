<script lang="ts">
  import Icon from './Icon.svelte';
  import type { HTMLSelectAttributes } from 'svelte/elements';

  // Native select in the outlined-field dress. Used for the five library
  // filters (Category, Employer, Language, Format, Review status) — one
  // value each, matching the backend's AND behaviour.
  interface Option {
    value: string;
    label: string;
  }

  interface Props extends Omit<HTMLSelectAttributes, 'value' | 'onchange' | 'children' | 'multiple'> {
    value?: string;
    options: Option[];
    label?: string;
    onchange?: (e: Event) => void;
  }

  const uid = $props.id();

  let { value = $bindable(), options, id = `wm-select-${uid}`, label, disabled = false, onchange, ...rest }: Props = $props();

  $effect(() => {
    const first = options[0];
    if (value === undefined && first) value = first.value;
  });
</script>

<div data-wm="field">
  {#if label}<label data-wm="field-label" for={id}>{label}</label>{/if}
  <div data-wm="select-wrap">
    <select {...rest} {id} {disabled} data-wm="select" bind:value {onchange}>
      {#each options as o (o.value)}
        <option value={o.value}>{o.label}</option>
      {/each}
    </select>
    <span data-wm="select-caret"><Icon name="chevron-down" /></span>
  </div>
</div>

<style>
  [data-wm='field'] { display: flex; flex-direction: column; gap: var(--wm-space-2); min-width: 0; }
  [data-wm='field-label'] {
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    font-size: var(--wm-fs-sm);
    text-transform: uppercase;
    letter-spacing: var(--wm-tracking-display);
    color: var(--wm-text-muted);
  }
  [data-wm='select-wrap'] { position: relative; }
  [data-wm='select'] {
    width: 100%;
    min-height: var(--wm-control-md);
    box-sizing: border-box;
    appearance: none;
    background: var(--wm-surface-1);
    border: 1px solid var(--wm-border-strong);
    border-radius: var(--wm-radius-sm);
    color: var(--wm-text);
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-base);
    padding: 0 var(--wm-space-8) 0 var(--wm-space-3);
    outline: none;
    cursor: pointer;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
  }
  [data-wm='select']:focus-visible {
    border-color: var(--wm-accent);
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--wm-accent), transparent 70%);
  }
  [data-wm='select']:disabled { opacity: 0.5; cursor: not-allowed; }
  [data-wm='select-caret'] {
    position: absolute;
    right: var(--wm-space-3);
    top: 50%;
    transform: translateY(-50%);
    color: var(--wm-structure-text);
    display: inline-flex;
    pointer-events: none;
  }
</style>
