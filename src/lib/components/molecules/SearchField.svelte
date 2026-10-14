<script lang="ts">
  import Button from '../atoms/Button.svelte';

  // "Search library" — explicit submit, obvious clear. Never disabled: it
  // stays editable through outages and while a search is running (a newer
  // query cancels the older one upstream). Keyword search only; the copy
  // must not promise semantic matching.
  interface Props {
    value?: string;
    label?: string;
    placeholder?: string;
    submitLabel?: string;
    busyLabel?: string;
    clearLabel?: string;
    /** A search is in flight: the submit shows busyLabel; the field stays editable. */
    busy?: boolean;
    /** Client-side limit (the API caps queries at 512 characters). */
    maxlength?: number;
    hint?: string;
    /** Rejected input (too long, or a 400 from the service). Keeps the input editable. */
    error?: string;
    name?: string;
    id?: string;
    onsubmit?: (value: string) => void;
    onclear?: () => void;
  }

  const uid = $props.id();
  let {
    value = $bindable(''),
    label = 'Search library',
    placeholder = 'Search CVs, letters, and reference material',
    submitLabel = 'Search',
    busyLabel = 'Searching…',
    clearLabel = 'Clear search',
    busy = false,
    maxlength = 512,
    hint,
    error,
    name = 'q',
    id = `wm-search-${uid}`,
    onsubmit,
    onclear
  }: Props = $props();

  let input: HTMLInputElement | undefined = $state();
  const descId = $derived(error || hint ? `${id}-desc` : undefined);

  function submit(e: SubmitEvent) {
    e.preventDefault();
    onsubmit?.(value);
  }
  function clear() {
    value = '';
    onclear?.();
    input?.focus();
  }
</script>

<form data-wm="search" role="search" onsubmit={submit} novalidate>
  <label data-wm="search-label" for={id}>{label}</label>
  <div class="row">
    <div class="well" data-error={error ? true : undefined}>
      <svg class="glass" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
        <circle cx="6.5" cy="6.5" r="4.5" fill="none" stroke="currentColor" stroke-width="1.6" />
        <path d="M10 10l4.2 4.2" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      </svg>
      <input
        bind:this={input}
        {id}
        {name}
        type="search"
        {placeholder}
        {maxlength}
        autocomplete="off"
        spellcheck="false"
        aria-invalid={error ? true : undefined}
        aria-describedby={descId}
        bind:value
      />
      {#if value}
        <button type="button" class="clear" aria-label={clearLabel} onclick={clear}><span aria-hidden="true">×</span></button>
      {/if}
    </div>
    <Button type="submit" variant="primary" loading={busy}>{busy ? busyLabel : submitLabel}</Button>
  </div>
  {#if error}
    <span class="msg" id={descId} role="alert">{error}</span>
  {:else if hint}
    <span class="hint" id={descId}>{hint}</span>
  {/if}
</form>

<style>
  [data-wm='search'] { display: flex; flex-direction: column; gap: var(--wm-space-2); min-width: 0; }
  [data-wm='search-label'] {
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    font-size: var(--wm-fs-sm);
    text-transform: uppercase;
    letter-spacing: var(--wm-tracking-display);
    color: var(--wm-text-muted);
  }
  .row { display: flex; gap: var(--wm-space-2); align-items: stretch; min-width: 0; }
  .well {
    flex: 1;
    display: flex;
    align-items: center;
    gap: var(--wm-space-2);
    min-width: 0;
    min-height: var(--wm-control-md);
    box-sizing: border-box;
    padding: 0 var(--wm-space-1) 0 var(--wm-space-3);
    background: var(--wm-surface-1);
    border: 1px solid var(--wm-border-strong);
    border-radius: var(--wm-radius-sm);
    color: var(--wm-text);
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
  }
  .well:focus-within {
    border-color: var(--wm-accent);
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--wm-accent), transparent 70%);
  }
  .well[data-error] { border-color: var(--wm-error); }
  .glass { flex: none; width: 16px; height: 16px; color: var(--wm-structure-text); }
  .well:focus-within .glass { color: var(--wm-accent); }
  input {
    flex: 1;
    min-width: 0;
    background: none;
    border: 0;
    outline: none;
    color: inherit;
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-lg);
    padding: 0;
  }
  input::placeholder { color: var(--wm-text-faint); }
  input::-webkit-search-cancel-button { display: none; }
  .clear {
    flex: none;
    width: 32px;
    height: 32px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: 0;
    border-radius: var(--wm-radius-sm);
    color: var(--wm-text-muted);
    font-size: var(--wm-fs-xl);
    line-height: 1;
    cursor: pointer;
  }
  .clear:hover { color: var(--wm-text-strong); background: var(--wm-surface-2); }
  .clear:focus-visible { outline: 2px solid var(--wm-accent); outline-offset: -2px; }
  .hint { font-size: var(--wm-fs-xs); color: var(--wm-text-faint); }
  .msg { font-size: var(--wm-fs-xs); color: var(--wm-error); }
  @media (max-width: 639px) {
    .row { flex-direction: column; }
  }
</style>
