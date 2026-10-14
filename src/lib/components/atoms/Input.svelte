<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  // Dark outlined field from component board B3: slate outline, charcoal
  // well, teal focus. The label is a display kicker; hint and error are
  // readable Inter sentence case.
  interface Props extends Omit<HTMLInputAttributes, 'value' | 'type' | 'oninput'> {
    value?: string;
    label?: string;
    hint?: string;
    error?: string | boolean;
    type?: 'text' | 'email' | 'password' | 'search' | 'url';
    mono?: boolean;
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
    disabled = false,
    readonly = false,
    oninput,
    'aria-describedby': ariaDescribedby,
    ...rest
  }: Props = $props();

  const hasError = $derived(!!error);
  const message = $derived(typeof error === 'string' ? error : '');
  const descId = $derived(message || hint ? `${id}-desc` : undefined);
  const describedBy = $derived([ariaDescribedby, descId].filter(Boolean).join(' ') || undefined);
</script>

<div data-wm="field">
  {#if label}<label data-wm="field-label" for={id}>{label}</label>{/if}
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
