<script lang="ts">
  import { BEAR_MARK_HEIGHT, BEAR_MARK_WIDTH, bearMark } from '../../assets/bear-mark.ts';

  // The identity. "bear" is the owner's traced vector master (reference B1,
  // transparent ground, true cut-outs). "wordmark" is the typographic form
  // for compact chrome (IRONMAW set in the display face with the rust tick).
  // "lockup" puts both together. The full bear is used at every size; the
  // compact favicon artwork never appears in UI.
  // `plate` seats the mark on charcoal, including in the Bone edition.
  interface Props {
    variant?: 'bear' | 'wordmark' | 'lockup';
    /** The name on paper. */
    name?: string;
    /** Second line under the name in a lockup, e.g. "Wormian Bones" or the product name. */
    tagline?: string;
    size?: 'sm' | 'md' | 'lg';
    /** Seat the bear on its charcoal plate. */
    plate?: boolean;
    alt?: string;
    href?: string;
  }

  let {
    variant = 'lockup',
    name = 'IRONMAW',
    tagline,
    size = 'md',
    plate = false,
    alt,
    href
  }: Props = $props();

</script>

{#snippet bear()}
  <span class="bear" data-plate={plate || undefined}><img src={bearMark} width={BEAR_MARK_WIDTH} height={BEAR_MARK_HEIGHT} alt={alt ?? (variant === 'bear' ? 'Sveinbjörn bear mark with mountains, trees and water' : '')} decoding="async" /></span>
{/snippet}

{#snippet word()}
  <span class="word">
    <span class="name">{name}</span>
    {#if tagline}<span class="tagline">{tagline}</span>{/if}
  </span>
{/snippet}

{#snippet body()}
  {#if variant === 'bear'}{@render bear()}{:else if variant === 'wordmark'}{@render word()}{:else}{@render bear()}{@render word()}{/if}
{/snippet}

{#if href}
  <a {href} data-wm="mark" data-variant={variant} data-size={size}>{@render body()}</a>
{:else}
  <span data-wm="mark" data-variant={variant} data-size={size}>{@render body()}</span>
{/if}

<style>
  [data-wm='mark'] {
    display: inline-flex;
    align-items: center;
    gap: var(--wm-space-4);
    color: var(--wm-text-strong);
    text-decoration: none;
    border-radius: var(--wm-radius-sm);
  }
  a[data-wm='mark']:focus-visible { outline: 2px solid var(--wm-accent); outline-offset: 4px; }
  .bear { display: inline-block; line-height: 0; }
  .bear[data-plate] {
    background: var(--wm-mark-bg);
    border-radius: var(--wm-radius-sm);
    padding: var(--wm-space-2) var(--wm-space-3);
  }
  .bear img { display: block; width: auto; }
  [data-size='sm'] .bear img { height: 56px; }
  [data-variant='lockup'][data-size='sm'] .bear img { height: 40px; }
  [data-size='md'] .bear img { height: 88px; }
  [data-size='lg'] .bear img { height: 168px; }
  .word { display: inline-flex; flex-direction: column; gap: var(--wm-space-1); }
  .name {
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight-bold);
    text-transform: uppercase;
    letter-spacing: 0.22em;
    line-height: 1;
  }
  .name::after {
    content: '';
    display: block;
    width: var(--wm-tick);
    height: 2px;
    margin-top: var(--wm-space-2);
    background: var(--wm-action);
  }
  [data-size='sm'] .name { font-size: var(--wm-fs-lg); }
  [data-size='md'] .name { font-size: var(--wm-fs-2xl); }
  [data-size='lg'] .name { font-size: var(--wm-fs-display); }
  .tagline {
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    font-size: var(--wm-fs-xs);
    text-transform: uppercase;
    letter-spacing: var(--wm-tracking-display);
    color: var(--wm-text-muted);
  }
  [data-size='lg'] .tagline { font-size: var(--wm-fs-sm); }
</style>
