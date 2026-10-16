<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  // The Input field's multi-line sibling: same slate outline and teal focus,
  // roomier padding and a relaxed line height so paragraphs are readable while
  // editing. With `maxlength` it shows a visible count ("983 of 1000
  // characters") that turns amber from 90% — a warning, never rust — and is
  // part of the accessible description. `readonly` reads as read-only (raised
  // fill, muted text) and can carry its own hint via `readonlyHint`.
  interface Props extends Omit<HTMLTextareaAttributes, 'value' | 'oninput'> {
    value?: string;
    label?: string;
    hint?: string;
    error?: string | boolean;
    rows?: number;
    maxlength?: number;
    /** Hint shown instead of `hint` while the field is read-only. */
    readonlyHint?: string;
    oninput?: (e: Event) => void;
  }

  const uid = $props.id();
  const WARN_RATIO = 0.9;

  let {
    value = $bindable(''),
    id = `wm-textarea-${uid}`,
    label,
    hint,
    error = false,
    rows = 4,
    maxlength,
    readonly = false,
    readonlyHint,
    disabled = false,
    placeholder,
    oninput,
    'aria-describedby': ariaDescribedby,
    ...rest
  }: Props = $props();

  const hasError = $derived(!!error);
  const message = $derived(typeof error === 'string' ? error : '');
  const shownHint = $derived(readonly && readonlyHint ? readonlyHint : hint);
  const descId = $derived(message || shownHint ? `${id}-desc` : undefined);
  const countId = $derived(maxlength ? `${id}-count` : undefined);
  const describedBy = $derived([ariaDescribedby, descId, countId].filter(Boolean).join(' ') || undefined);
  const length = $derived(value.length);
  const nearLimit = $derived(!!maxlength && length >= maxlength * WARN_RATIO);
</script>

<div data-wm="field">
  {#if label}<label data-wm="field-label" for={id}>{label}</label>{/if}
  <textarea
    {...rest}
    {id}
    {rows}
    {maxlength}
    {placeholder}
    {disabled}
    {readonly}
    data-wm="textarea"
    data-error={hasError || undefined}
    data-readonly={readonly || undefined}
    aria-invalid={hasError || undefined}
    aria-describedby={describedBy}
    bind:value
    {oninput}
  ></textarea>
  {#if message || shownHint || maxlength}
    <div class="foot">
      {#if message}
        <span data-wm="field-msg" id={descId}>{message}</span>
      {:else if shownHint}
        <span data-wm="field-hint" id={descId}>{shownHint}</span>
      {/if}
      {#if maxlength}
        <span class="count" id={countId} data-near={nearLimit || undefined}>{length} of {maxlength} characters</span>
      {/if}
    </div>
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
  [data-wm='textarea'] {
    display: block;
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    padding: 10px var(--wm-space-3);
    background: var(--wm-surface-1);
    border: 1px solid var(--wm-border-strong);
    border-radius: var(--wm-radius-sm);
    color: var(--wm-text);
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-base);
    line-height: var(--wm-lh-relaxed);
    resize: vertical;
    outline: none;
    transition: border-color 0.12s ease, box-shadow 0.12s ease;
  }
  [data-wm='textarea']::placeholder { color: var(--wm-text-faint); }
  [data-wm='textarea']:focus-visible {
    border-color: var(--wm-accent);
    box-shadow: 0 0 0 2px color-mix(in oklab, var(--wm-accent), transparent 70%);
  }
  [data-wm='textarea'][data-error] { border-color: var(--wm-error); }
  [data-wm='textarea'][data-error]:focus-visible { box-shadow: 0 0 0 2px color-mix(in oklab, var(--wm-error), transparent 70%); }
  [data-wm='textarea'][data-readonly] {
    background: var(--wm-surface-2);
    color: var(--wm-text-muted);
  }
  [data-wm='textarea'][data-readonly]:focus-visible {
    border-color: var(--wm-border-strong);
    box-shadow: none;
    outline: 2px solid var(--wm-accent);
    outline-offset: 2px;
  }
  [data-wm='textarea']:disabled { opacity: 0.5; cursor: not-allowed; }
  .foot { display: flex; gap: var(--wm-space-3); justify-content: space-between; align-items: baseline; }
  [data-wm='field-hint'], [data-wm='field-msg'] {
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-xs);
    line-height: var(--wm-lh-normal);
  }
  [data-wm='field-hint'] { color: var(--wm-text-faint); }
  [data-wm='field-msg'] { color: var(--wm-error); }
  .count {
    margin-left: auto;
    flex: none;
    font-family: var(--wm-font-mono);
    font-size: var(--wm-fs-xs);
    line-height: var(--wm-lh-normal);
    font-variant-numeric: tabular-nums;
    color: var(--wm-text-faint);
  }
  .count[data-near] { color: var(--wm-warning); }
</style>
