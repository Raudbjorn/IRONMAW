<script lang="ts">
  // An on/off setting that takes effect at once (e.g. "Show page numbers").
  // A button with role="switch" so keyboard and screen readers get the native
  // press behaviour; the visible label is a real <label>, so clicking it
  // toggles too. Teal track when on: it is interactive state, not the one
  // main action, so never rust.
  interface Props {
    checked?: boolean;
    /** Visible label naming the setting. */
    label: string;
    /** Optional helper line under the label. */
    description?: string;
    disabled?: boolean;
    onchange?: (checked: boolean) => void;
    id?: string;
  }

  let { checked = $bindable(false), label, description, disabled = false, onchange, id }: Props = $props();

  const uid = $props.id();
  const controlId = $derived(id ?? `${uid}-switch`);
  const labelId = $derived(`${uid}-label`);
  const descId = $derived(`${uid}-desc`);

  function toggle() {
    if (disabled) return;
    checked = !checked;
    onchange?.(checked);
  }
</script>

<div data-wm="switch" data-disabled={disabled || undefined}>
  <button
    type="button"
    role="switch"
    id={controlId}
    aria-checked={checked}
    aria-labelledby={labelId}
    aria-describedby={description ? descId : undefined}
    {disabled}
    onclick={toggle}
  >
    <span class="knob"></span>
  </button>
  <span class="text">
    <label id={labelId} for={controlId}>{label}</label>
    {#if description}<span class="desc" id={descId}>{description}</span>{/if}
  </span>
</div>

<style>
  [data-wm='switch'] {
    display: flex;
    align-items: flex-start;
    gap: var(--wm-space-3);
  }
  button {
    flex: none;
    position: relative;
    box-sizing: border-box;
    width: 36px;
    height: 20px;
    padding: 0;
    border: 1px solid var(--wm-border-strong);
    border-radius: 10px;
    background: var(--wm-surface-2);
    cursor: pointer;
    transition: background-color 0.12s ease, border-color 0.12s ease;
  }
  /* Enlarge the hit area to 24px+ without changing the drawn track. */
  button::before {
    content: '';
    position: absolute;
    inset: -4px -2px;
  }
  .knob {
    position: absolute;
    top: 3px;
    left: 3px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--wm-text-muted);
    transition: transform 0.12s ease, background-color 0.12s ease;
  }
  button[aria-checked='true'] {
    background: var(--wm-accent);
    border-color: var(--wm-accent);
  }
  button[aria-checked='true'] .knob {
    background: var(--wm-accent-ink);
    transform: translateX(16px);
  }
  button:focus-visible {
    outline: 2px solid var(--wm-accent);
    outline-offset: 2px;
  }
  .text {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
  }
  label {
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-sm);
    line-height: var(--wm-lh-normal);
    color: var(--wm-text);
    cursor: pointer;
  }
  .desc {
    font-size: var(--wm-fs-xs);
    color: var(--wm-text-faint);
  }
  [data-disabled] { opacity: 0.5; }
  [data-disabled] button,
  [data-disabled] label { cursor: not-allowed; }
  @media (prefers-reduced-motion: reduce) {
    button, .knob { transition: none; }
  }
</style>
