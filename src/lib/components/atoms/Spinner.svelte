<script lang="ts">
  interface Props {
    size?: 'sm' | 'md' | 'lg';
    /** Accessible name for the busy state. */
    label?: string;
  }

  let { size = 'md', label = 'Loading' }: Props = $props();
</script>

<span data-wm="spinner" data-size={size} role="status" aria-label={label}></span>

<style>
  [data-wm='spinner'] {
    display: inline-block;
    box-sizing: border-box;
    border-radius: 50%;
    border: 2px solid var(--wm-structure);
    border-top-color: var(--wm-accent);
    animation: wm-spinner 0.8s linear infinite;
  }
  [data-size='sm'] { width: 16px; height: 16px; border-width: 2px; }
  [data-size='md'] { width: 24px; height: 24px; border-width: 3px; }
  [data-size='lg'] { width: 36px; height: 36px; border-width: 3px; }
  @keyframes wm-spinner { to { transform: rotate(360deg); } }
  @media (prefers-reduced-motion: reduce) {
    [data-wm='spinner'] { animation: none; }
  }
</style>
