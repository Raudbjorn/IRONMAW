<script lang="ts">
  // A numbered reference dot that ties a finding in a list to its place in a
  // document: the same figure appears on the IssueCard and on the page. Shape
  // and number carry the meaning, not colour alone. Warning is amber, never
  // rust: a finding is not an action.
  interface Props {
    value: number | string;
    tone?: 'warning' | 'error' | 'accent' | 'neutral';
    size?: 'sm' | 'md';
    /** Accessible text, e.g. "Issue 3". Without it the marker is decorative. */
    label?: string;
  }

  let { value, tone = 'warning', size = 'md', label }: Props = $props();
</script>

<span
  data-wm="marker"
  data-tone={tone}
  data-size={size}
  role={label ? 'img' : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : 'true'}>{value}</span
>

<style>
  [data-wm='marker'] {
    --tone: var(--wm-warning);
    display: inline-flex;
    flex: none;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    border-radius: 50%;
    background: var(--tone);
    color: var(--wm-bg);
    font-family: var(--wm-font-mono);
    font-weight: 700;
    font-variant-numeric: tabular-nums;
    line-height: 1;
  }
  [data-size='md'] { width: 20px; height: 20px; font-size: var(--wm-fs-xs); }
  [data-size='sm'] { width: 16px; height: 16px; font-size: 0.625rem; }
  [data-tone='error'] { --tone: var(--wm-error); }
  [data-tone='accent'] { --tone: var(--wm-accent); }
  [data-tone='neutral'] { --tone: var(--wm-structure); }
</style>
