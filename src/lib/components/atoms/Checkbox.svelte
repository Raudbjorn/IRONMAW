<script lang="ts">
  import Icon from './Icon.svelte';

  // A yes/no choice that is submitted or applied later (contrast Switch,
  // which acts at once). A real <input type="checkbox"> restyled: slate box,
  // teal fill when checked, a minus when `indeterminate` (a parent of a
  // partly-chosen group). The whole row is one <label>, so clicking the text
  // toggles. Teal because it is interactive state, never rust.
  interface Props {
    checked?: boolean;
    /** Partly chosen; shown until the next toggle. */
    indeterminate?: boolean;
    /** Visible label naming the choice. */
    label: string;
    /** Optional helper line under the label. */
    description?: string;
    disabled?: boolean;
    onchange?: (checked: boolean) => void;
    id?: string;
    name?: string;
  }

  const uid = $props.id();

  let {
    checked = $bindable(false),
    indeterminate = $bindable(false),
    label,
    description,
    disabled = false,
    onchange,
    id,
    name
  }: Props = $props();

  const controlId = $derived(id ?? `${uid}-checkbox`);
  const descId = $derived(`${uid}-desc`);
  let input: HTMLInputElement | undefined = $state();

  $effect(() => {
    if (input) input.indeterminate = indeterminate;
  });

  function handle(e: Event) {
    const el = e.currentTarget as HTMLInputElement;
    if (disabled) {
      el.checked = checked;
      return;
    }
    checked = el.checked;
    indeterminate = false;
    onchange?.(checked);
  }
</script>

<label data-wm="checkbox" data-disabled={disabled || undefined} for={controlId}>
  <span class="box">
    <input
      bind:this={input}
      type="checkbox"
      id={controlId}
      {name}
      {checked}
      {disabled}
      aria-describedby={description ? descId : undefined}
      onchange={handle}
    />
    <span class="glyph">
      {#if indeterminate}<Icon name="minus" size={12} />{:else if checked}<Icon name="check" size={12} />{/if}
    </span>
  </span>
  <span class="text">
    <span class="label">{label}</span>
    {#if description}<span class="desc" id={descId}>{description}</span>{/if}
  </span>
</label>

<style>
  [data-wm='checkbox'] {
    display: flex;
    align-items: flex-start;
    gap: var(--wm-space-2);
    min-height: 24px;
    cursor: pointer;
  }
  .box {
    position: relative;
    flex: none;
    width: 18px;
    height: 18px;
    /* Centre the box on the first label line (fs-sm * lh-normal). */
    margin-top: calc((var(--wm-fs-sm) * var(--wm-lh-normal) - 18px) / 2);
  }
  /* The real input fills a 24px hit area around the drawn 18px box. */
  input {
    appearance: none;
    position: absolute;
    inset: 0;
    box-sizing: border-box;
    margin: 0;
    border: 1px solid var(--wm-border-strong);
    border-radius: var(--wm-radius-sm);
    background: var(--wm-surface-1);
    cursor: inherit;
    transition: background-color 0.12s ease, border-color 0.12s ease;
  }
  input::before {
    content: '';
    position: absolute;
    inset: -3px;
  }
  input:checked,
  input:indeterminate {
    background: var(--wm-accent);
    border-color: var(--wm-accent);
  }
  input:focus-visible {
    outline: 2px solid var(--wm-accent);
    outline-offset: 2px;
  }
  .glyph {
    position: absolute;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--wm-accent-ink);
    pointer-events: none;
  }
  .text { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .label {
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-sm);
    line-height: var(--wm-lh-normal);
    color: var(--wm-text);
  }
  .desc {
    font-size: var(--wm-fs-xs);
    line-height: var(--wm-lh-normal);
    color: var(--wm-text-faint);
  }
  [data-disabled] { opacity: 0.5; cursor: not-allowed; }
  @media (prefers-reduced-motion: reduce) {
    input { transition: none; }
  }
</style>
