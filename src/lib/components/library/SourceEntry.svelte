<script lang="ts">
  import Button from '../atoms/Button.svelte';

  // One recorded file location. Compact by default: an index, the path in
  // mono, a copy-path action. Expanding reveals the complete provenance;
  // every field is always listed and a missing one says "Not recorded" in
  // the muted tone rather than disappearing. Paths are copyable text,
  // never file:// links.
  interface Field {
    label: string;
    value?: string;
    mono?: boolean;
  }

  interface Props {
    path: string;
    /** Position in the location list (1-based). */
    index?: number;
    /** Short distinguishing label beside the path, e.g. "Applications · Landsnet". */
    summary?: string;
    fields?: Field[];
    notRecorded?: string;
    copyLabel?: string;
    copiedText?: string;
    detailsLabel?: string;
    hideDetailsLabel?: string;
    /** Set by the consumer after the clipboard write succeeds. */
    copied?: boolean;
    expanded?: boolean;
    oncopy?: (path: string) => void;
  }

  const uid = $props.id();
  let {
    path,
    index,
    summary,
    fields = [],
    notRecorded = 'Not recorded',
    copyLabel = 'Copy path',
    copiedText = 'Copied the path.',
    detailsLabel = 'Details',
    hideDetailsLabel = 'Hide details',
    copied = false,
    expanded = $bindable(false),
    oncopy
  }: Props = $props();

  const detailsId = `wm-source-${uid}`;
</script>

<div data-wm="source" data-expanded={expanded || undefined}>
  <div class="row">
    {#if index !== undefined}<span class="index" aria-hidden="true">{index}</span>{/if}
    <div class="ident">
      <code class="path">{path}</code>
      {#if summary}<span class="summary">{summary}</span>{/if}
    </div>
    <div class="actions">
      <!-- Details first, Copy path last: Copy path keeps one column across rows with and without details. -->
      {#if fields.length}
        <Button variant="secondary" size="sm" onclick={() => (expanded = !expanded)} aria-expanded={expanded} aria-controls={detailsId}>
          {expanded ? hideDetailsLabel : detailsLabel}
        </Button>
      {/if}
      {#if oncopy}
        <Button variant="ghost" size="sm" chamfer={false} onclick={() => oncopy(path)}>{copyLabel}</Button>
      {/if}
    </div>
  </div>
  <span class="status" role="status">{copied ? copiedText : ''}</span>
  {#if fields.length}
    <dl class="details" id={detailsId} hidden={!expanded}>
      {#each fields as f (f.label)}
        <dt>{f.label}</dt>
        <dd data-missing={f.value ? undefined : true} data-mono={f.mono || undefined}>{f.value ?? notRecorded}</dd>
      {/each}
    </dl>
  {/if}
</div>

<style>
  [data-wm='source'] {
    display: flex;
    flex-direction: column;
    gap: var(--wm-space-2);
    padding: var(--wm-space-3) 0;
    border-bottom: 1px solid var(--wm-border);
    font-family: var(--wm-font-sans);
    color: var(--wm-text);
  }
  .row { display: flex; gap: var(--wm-space-3); align-items: flex-start; flex-wrap: wrap; }
  .index {
    flex: none;
    width: 22px;
    height: 22px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--wm-structure);
    border-radius: var(--wm-radius-sm);
    font-family: var(--wm-font-mono);
    font-size: var(--wm-fs-xs);
    color: var(--wm-structure-text);
  }
  .ident { flex: 1 1 24ch; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
  .path {
    font-family: var(--wm-font-mono);
    font-size: var(--wm-fs-sm);
    color: var(--wm-text-strong);
    overflow-wrap: anywhere;
    user-select: all;
  }
  .summary { font-size: var(--wm-fs-xs); color: var(--wm-text-muted); }
  .actions { display: flex; gap: var(--wm-space-2); flex: none; margin-inline-start: auto; }
  .status { font-size: var(--wm-fs-xs); color: var(--wm-success); min-height: 1em; }
  .status:empty { display: none; }
  .details {
    display: grid;
    grid-template-columns: minmax(8ch, 12ch) minmax(0, 1fr);
    gap: var(--wm-space-1) var(--wm-space-4);
    margin: 0;
    padding: var(--wm-space-3) var(--wm-space-3) var(--wm-space-2);
    background: var(--wm-surface-1);
    border: 1px solid var(--wm-border);
    border-radius: var(--wm-radius-sm);
    font-size: var(--wm-fs-sm);
  }
  .details[hidden] { display: none; }
  dt { color: var(--wm-text-muted); }
  dd { margin: 0; overflow-wrap: anywhere; }
  dd[data-mono] { font-family: var(--wm-font-mono); font-size: var(--wm-fs-xs); }
  dd[data-missing] { color: var(--wm-text-faint); font-style: italic; }
  @media (max-width: 639px) {
    .details { grid-template-columns: 1fr; }
    dt { margin-top: var(--wm-space-2); }
  }
</style>
