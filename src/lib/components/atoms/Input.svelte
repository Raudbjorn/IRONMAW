<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { HTMLInputAttributes } from 'svelte/elements';
  import type { IconName } from '../../icons.ts';
  import Icon from './Icon.svelte';

  // Dark outlined field from component board B3: slate outline, charcoal
  // well, teal focus. The label is a display kicker; hint and error are
  // readable Inter sentence case. Affixes sit inside the outline: a unit
  // ("pt", "×"), a leading swatch or glyph, a trailing icon or control.
  interface Props extends Omit<HTMLInputAttributes, 'value' | 'type' | 'oninput'> {
    value?: string;
    label?: string;
    hint?: string;
    error?: string | boolean;
    type?: 'text' | 'email' | 'password' | 'search' | 'url' | 'tel' | 'number';
    mono?: boolean;
    /** Unit shown after the value, e.g. "pt" or "×". Read with the label via aria-describedby. */
    unit?: string;
    /** Decorative icon at the end of the field. */
    icon?: IconName;
    /** Content before the value, e.g. a colour swatch. */
    leading?: Snippet;
    /** Control after the value, e.g. a clear or reveal button. */
    trailing?: Snippet;
    oninput?: (e: Event) => void;
  }

  const uid = $props.id();

  let {
    value = $bindable(''),
    id = `wm-input-${uid}`,
    label,
    hint,
    error = false,
    placeholder,
    type = 'text',
    mono = false,
    unit,
    icon,
    leading,
    trailing,
    disabled = false,
    readonly = false,
    oninput,
    'aria-describedby': ariaDescribedby,
    ...rest
  }: Props = $props();

  const hasError = $derived(!!error);
  const message = $derived(typeof error === 'string' ? error : '');
  const descId = $derived(message || hint ? `${id}-desc` : undefined);
  const unitId = $derived(unit ? `${id}-unit` : undefined);
  const describedBy = $derived([ariaDescribedby, unitId, descId].filter(Boolean).join(' ') || undefined);
  const affixed = $derived(!!(unit || icon || leading || trailing));
</script>

<div data-wm="field">
  {#if label}<label data-wm="field-label" for={id}>{label}</label>{/if}
  {#if affixed}
    <div data-wm="input-shell" data-error={hasError || undefined} data-disabled={disabled || undefined}>
      {#if leading}<span class="affix">{@render leading()}</span>{/if}
      <input
        {...rest}
        {id}
        {type}
        {placeholder}
        {disabled}
        {readonly}
        data-wm="input"
        data-affixed={affixed || undefined}
        data-mono={mono || undefined}
        data-error={hasError || undefined}
        aria-invalid={hasError || undefined}
        aria-describedby={describedBy}
        bind:value
        {oninput}
      />
      {#if unit}<span class="unit" id={unitId}>{unit}</span>{/if}
      {#if icon}<span class="affix icon"><Icon name={icon} /></span>{/if}
      {#if trailing}<span class="affix">{@render trailing()}</span>{/if}
    </div>
  {:else}
    <input
      {...rest}
      {id}
      {type}
      {placeholder}
      {disabled}
      {readonly}
      data-wm="input"
      data-mono={mono || undefined}
      data-error={hasError || undefined}
      aria-invalid={hasError || undefined}
      aria-describedby={describedBy}
      bind:value
      {oninput}
    />
  {/if}
  {#if message}
    <span data-wm="field-msg" id={descId}>{message}</span>
  {:else if hint}
    <span data-wm="field-hint" id={descId}>{hint}</span>
  {/if}
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
  [data-wm='input'] {
    width: 100%;
    min-height: var(--wm-control-md);
    box-sizing: border-box;
    background: var(--wm-surface-1);
    border: 1px solid var(--wm-border-strong);
    border-radius: var(--wm-radius-sm);
    color: var(--wm-text);
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-base);
    padding: 0 var(--wm-space-3);
    outline: none;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
  }
  [data-mono] { font-family: var(--wm-font-mono); }
  [data-wm='input-shell'] {
    display: flex;
    align-items: center;
    gap: var(--wm-space-2);
    min-height: var(--wm-control-md);
    box-sizing: border-box;
    padding: 0 var(--wm-space-3);
    background: var(--wm-surface-1);
    border: 1px solid var(--wm-border-strong);
    border-radius: var(--wm-radius-sm);
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
  }
  [data-wm='input-shell']:focus-within {
    border-color: var(--wm-accent);
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--wm-accent), transparent 70%);
  }
  [data-wm='input-shell'][data-error] { border-color: var(--wm-error); }
  [data-wm='input-shell'][data-error]:focus-within { box-shadow: 0 0 0 2px color-mix(in oklab, var(--wm-error), transparent 70%); }
  [data-wm='input-shell'][data-disabled] { opacity: 0.5; }
  [data-wm='input'][data-affixed] {
    flex: 1;
    min-width: 0;
    min-height: calc(var(--wm-control-md) - 2px);
    padding: 0;
    border: 0;
    background: transparent;
    box-shadow: none;
  }
  [data-wm='input'][data-affixed]:focus-visible,
  [data-wm='input'][data-affixed][data-error]:focus-visible { box-shadow: none; }
  [data-wm='input'][type='number'] { font-variant-numeric: tabular-nums; }
  .unit {
    flex: none;
    font-family: var(--wm-font-mono);
    font-size: var(--wm-fs-xs);
    color: var(--wm-text-faint);
  }
  .affix { display: inline-flex; flex: none; align-items: center; }
  .icon { color: var(--wm-text-muted); }
  [data-wm='input']::placeholder { color: var(--wm-text-faint); }
  [data-wm='input']:focus-visible {
    border-color: var(--wm-accent);
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--wm-accent), transparent 70%);
  }
  [data-wm='input'][data-error] { border-color: var(--wm-error); }
  [data-wm='input'][data-error]:focus-visible { box-shadow: 0 0 0 2px color-mix(in oklab, var(--wm-error), transparent 70%); }
  [data-wm='input']:disabled { opacity: 0.5; cursor: not-allowed; }
  [data-wm='field-hint'] { font-family: var(--wm-font-sans); font-size: var(--wm-fs-xs); color: var(--wm-text-faint); }
  [data-wm='field-msg'] { font-family: var(--wm-font-sans); font-size: var(--wm-fs-xs); color: var(--wm-error); }
</style>
