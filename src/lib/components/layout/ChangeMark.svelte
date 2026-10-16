<script lang="ts">
  import type { Snippet } from 'svelte';

  // Marks a passage on the page that differs from the saved document. An edit
  // is yours: teal wash with a solid outline. A suggestion is unreviewed: amber
  // wash with a dashed outline, so the two differ in more than colour. The
  // content text is never altered; a visually hidden "(label)" follows it so
  // the state is announced.
  //
  // Flag placement assumes the passage spans the sheet's content width inside a
  // PageSheet: `margin` pins the label to the right of the sheet, outside the
  // page (left: 100% + page margin + 8px); `edge` draws a 3px bar on the
  // sheet's right edge at the passage's height, for narrow windows; `none`
  // shows only the wash. The flag ink is --wm-accent-ink on teal and --wm-bg on
  // amber, both >= 4.5:1 in Bone and Oxide. Wash, outline and flag are hidden
  // in print.
  interface Props {
    kind: 'edit' | 'suggestion';
    /** Defaults to "Your edit · not saved" / "Suggested · unreviewed". */
    label?: string;
    flag?: 'margin' | 'edge' | 'none';
    as?: 'div' | 'span';
    children: Snippet;
  }

  let { kind, label, flag = 'margin', as = 'div', children }: Props = $props();
  const text = $derived(label ?? (kind === 'edit' ? 'Your edit · not saved' : 'Suggested · unreviewed'));
</script>

<svelte:element this={as} data-wm="change-mark" data-kind={kind} data-flag={flag}>
  {@render children()}
  <span data-part="sr">({text})</span>
  {#if flag === 'margin'}<span data-part="flag" aria-hidden="true">{text}</span>{/if}
  {#if flag === 'edge'}<span data-part="edge" aria-hidden="true"></span>{/if}
</svelte:element>

<style>
  [data-wm='change-mark'] {
    --tone: var(--wm-accent);
    --tone-ink: var(--wm-accent-ink);
    --wash: 14%;
    position: relative;
    border-radius: var(--wm-radius-sm);
    background: color-mix(in srgb, var(--tone) var(--wash), transparent);
    outline: 1.5px solid var(--tone);
    outline-offset: 3px;
    /* Text keeps 10px / 12px from the box. The inline padding is pulled back out so the
       content column does not move; the flag offsets below account for it. */
    --pad-x: var(--wm-space-3);
    padding: 10px var(--pad-x);
    margin-inline: calc(var(--pad-x) * -1);
  }
  [data-kind='suggestion'] {
    --tone: var(--wm-warning);
    --tone-ink: var(--wm-bg);
    --wash: 18%;
    outline-style: dashed;
  }
  [data-part='sr'] {
    position: absolute;
    width: 1px;
    height: 1px;
    margin: -1px;
    padding: 0;
    overflow: hidden;
    clip-path: inset(50%);
    white-space: nowrap;
  }
  [data-part='flag'] {
    position: absolute;
    top: 10px;
    left: calc(100% - var(--pad-x) + var(--wm-page-margin) + var(--wm-space-2));
    padding: var(--wm-space-1) var(--wm-space-2);
    border-radius: var(--wm-radius-sm);
    background: var(--tone);
    color: var(--tone-ink);
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    font-size: var(--wm-fs-xs);
    line-height: var(--wm-lh-normal);
    letter-spacing: var(--wm-tracking-wide);
    text-transform: uppercase;
    white-space: nowrap;
    user-select: none;
    pointer-events: none;
  }
  [data-part='edge'] {
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(100% - var(--pad-x) + var(--wm-page-margin) - 3px);
    width: 3px;
    background: var(--tone);
    pointer-events: none;
  }
  @media print {
    [data-wm='change-mark'] { background: none; outline: none; padding: 0; margin-inline: 0; }
    [data-part='flag'], [data-part='edge'] { display: none; }
  }
</style>
