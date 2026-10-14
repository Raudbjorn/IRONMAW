<script lang="ts">
  // The reader's view switcher: Content · Sources · Technical. Rust active
  // underline (the non-colour cue is the weight + aria-selected), roving
  // tabindex, arrow/Home/End navigation. Panels are consumer-rendered.
  interface Tab {
    id: string;
    label: string;
    /** Secondary figure, e.g. the number of source locations. */
    count?: number | string;
    /** DOM id for this tab button. */
    tabId: string;
    /** DOM id of the consumer-rendered tabpanel. */
    panelId: string;
  }

  interface Props {
    tabs: Tab[];
    /** The active tab id (two-way). */
    value?: string;
    onchange?: (id: string) => void;
    /** Accessible name for the tab list. */
    'aria-label'?: string;
  }

  let { tabs, value = $bindable(), onchange, 'aria-label': ariaLabel = 'Views' }: Props = $props();

  const selectedId = $derived(tabs.some((tab) => tab.id === value) ? value : tabs[0]?.id);

  let lastInvalidValue: string | undefined;
  let lastSelectedId: string | undefined;
  let correctionNotified = false;

  $effect(() => {
    if (selectedId === undefined) return;
    if (selectedId === value) {
      correctionNotified = false;
      return;
    }
    if (!onchange) {
      value = selectedId;
      return;
    }
    if (correctionNotified && lastInvalidValue === value && lastSelectedId === selectedId) return;
    lastInvalidValue = value;
    lastSelectedId = selectedId;
    correctionNotified = true;
    onchange(selectedId);
  });

  function select(id: string) {
    value = id;
    onchange?.(id);
  }

  function keyNav(e: KeyboardEvent, i: number) {
    const n = tabs.length;
    let j = i;
    if (e.key === 'ArrowRight') j = (i + 1) % n;
    else if (e.key === 'ArrowLeft') j = (i - 1 + n) % n;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = n - 1;
    else return;
    e.preventDefault();
    const next = tabs[j];
    if (!next) return;
    select(next.id);
    const btns = (e.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('[data-wm="tab"]');
    btns?.[j]?.focus();
  }
</script>

<div data-wm="tabs" role="tablist" aria-label={ariaLabel}>
  {#each tabs as t, i (t.id)}
    <button
      type="button"
      role="tab"
      id={t.tabId}
      aria-controls={t.panelId}
      aria-selected={selectedId === t.id}
      tabindex={selectedId === t.id ? 0 : -1}
      data-wm="tab"
      data-active={selectedId === t.id}
      onclick={() => select(t.id)}
      onkeydown={(e) => keyNav(e, i)}
    >
      {t.label}{#if t.count !== undefined}<span class="count">· {t.count}</span>{/if}
    </button>
  {/each}
</div>

<style>
  [data-wm='tabs'] {
    display: flex;
    gap: var(--wm-space-2);
    border-bottom: 1px solid var(--wm-border);
    overflow-x: auto;
  }
  [data-wm='tab'] {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: var(--wm-space-2);
    background: none;
    border: none;
    cursor: pointer;
    min-height: var(--wm-control-md);
    padding: 0 var(--wm-space-3);
    margin-bottom: -1px;
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    font-size: var(--wm-fs-sm);
    text-transform: uppercase;
    letter-spacing: var(--wm-tracking-display);
    color: var(--wm-text-muted);
    border-bottom: 2px solid transparent;
    transition: color 0.12s ease, border-color 0.12s ease;
  }
  [data-wm='tab']:hover { color: var(--wm-text); }
  [data-active='true'] {
    color: var(--wm-text-strong);
    font-weight: var(--wm-display-weight-bold);
    border-bottom-color: var(--wm-action);
  }
  .count { font-family: var(--wm-font-mono); font-weight: 400; letter-spacing: 0; text-transform: none; color: var(--wm-text-faint); }
  [data-active='true'] .count { color: var(--wm-text-muted); }
  [data-wm='tab']:focus-visible {
    outline: 2px solid var(--wm-accent);
    outline-offset: -2px;
    border-radius: var(--wm-radius-sm);
  }
</style>
