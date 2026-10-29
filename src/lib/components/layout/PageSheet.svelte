<script lang="ts">
  import type { Snippet } from 'svelte';

  // One sheet of paper: the document the person is writing, at true page size.
  // It defaults to the Bone edition so the paper stays pale and print-like even
  // when the app around it is Oxide; set edition="inherit" to follow the app.
  // The label ("Page 1 · A4") sits above the sheet and is not part of it.
  // Printing: the shadow, label and margin drop away. The consumer sets the
  // page size once with `@page { size: A4; margin: 0 }` (or `size: letter`).
  interface Props {
    size?: 'a4' | 'letter';
    label?: string;
    edition?: 'bone' | 'oxide' | 'inherit';
    'aria-label'?: string;
    children: Snippet;
  }

  let { size = 'a4', label, edition = 'bone', 'aria-label': ariaLabel, children }: Props = $props();
</script>

<figure data-wm="page-sheet" data-size={size}>
  {#if label}<figcaption data-part="label">{label}</figcaption>{/if}
  <div
    data-part="sheet"
    data-theme={edition === 'inherit' ? undefined : edition}
    role={ariaLabel ? 'group' : undefined}
    aria-label={ariaLabel}
  >
    {@render children()}
  </div>
</figure>

<style>
  [data-wm='page-sheet'] {
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: var(--wm-space-2);
    align-items: flex-start;
    width: max-content;
    max-width: none;
  }
  [data-part='label'] {
    font-family: var(--wm-font-mono);
    font-size: var(--wm-fs-xs);
    color: var(--wm-text-muted);
  }
  [data-part='sheet'] {
    box-sizing: border-box;
    width: var(--wm-page-a4-width);
    min-height: var(--wm-page-a4-height);
    padding: var(--wm-page-margin);
    background: var(--wm-bg);
    color: var(--wm-text);
    font-family: var(--wm-font-sans);
    box-shadow: var(--wm-shadow-md);
    border-radius: 0;
  }
  [data-size='letter'] [data-part='sheet'] {
    width: var(--wm-page-letter-width);
    min-height: var(--wm-page-letter-height);
  }
  @media print {
    [data-wm='page-sheet'] { gap: 0; }
    [data-part='label'] { display: none; }
    [data-part='sheet'] {
      box-shadow: none;
      margin: 0;
    }
  }
</style>
