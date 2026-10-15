<script lang="ts">
  // A person's picture, or their initials when there is none (or it fails to
  // load). Initials come from the first and last word of the name and keep
  // Icelandic letters (Þ, Ð, Æ, Ö). Named as an image for assistive tech.
  interface Props {
    name: string;
    src?: string;
    size?: 'sm' | 'md' | 'lg';
  }

  let { name, src, size = 'md' }: Props = $props();

  let failedSrc = $state<string | undefined>(undefined);

  const initials = $derived.by(() => {
    const words = name.trim().split(/\s+/).filter(Boolean);
    const first = words[0];
    if (!first) return '';
    const last = words.length > 1 ? words[words.length - 1] : undefined;
    const pick = (w: string) => (Array.from(w)[0] ?? '').toLocaleUpperCase('is');
    return pick(first) + (last ? pick(last) : '');
  });
  const showImage = $derived(Boolean(src) && failedSrc !== src);
</script>

<span data-wm="avatar" data-size={size} role="img" aria-label={name}>
  {#if showImage}
    <img {src} alt={name} onerror={() => (failedSrc = src)} />
  {:else}
    <span aria-hidden="true">{initials}</span>
  {/if}
</span>

<style>
  [data-wm='avatar'] {
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 50%;
    border: 1px solid var(--wm-border-strong);
    background: var(--wm-surface-3);
    color: var(--wm-text-strong);
    font-family: var(--wm-font-display);
    font-weight: var(--wm-font-weight-semibold);
    letter-spacing: var(--wm-tracking-wide);
    line-height: 1;
    user-select: none;
  }
  [data-size='sm'] { width: 24px; height: 24px; font-size: 0.625rem; }
  [data-size='md'] { width: 32px; height: 32px; font-size: var(--wm-fs-xs); }
  [data-size='lg'] { width: 40px; height: 40px; font-size: var(--wm-fs-sm); }
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
</style>
