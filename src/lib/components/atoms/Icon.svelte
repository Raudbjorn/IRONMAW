<script lang="ts">
  import { ICONS, iconStroke, type IconName } from '../../icons.ts';

  // One drawn line icon from the IRONMAW set. Decorative by default
  // (aria-hidden); pass `label` when the icon is the only thing naming its
  // meaning. Colour follows the text (currentColor) unless `tone` is set.
  interface Props {
    name: IconName;
    size?: 12 | 16 | 20 | 24;
    /** Accessible name. Without it the icon is hidden from assistive tech. */
    label?: string;
    tone?: 'inherit' | 'muted' | 'accent' | 'action' | 'warning' | 'error' | 'success';
  }

  let { name, size = 16, label, tone = 'inherit' }: Props = $props();

  const d = $derived(ICONS[name] ?? '');
</script>

<svg
  data-wm="icon"
  data-tone={tone === 'inherit' ? undefined : tone}
  viewBox="0 0 24 24"
  width={size}
  height={size}
  fill="none"
  stroke="currentColor"
  stroke-width={iconStroke(size)}
  stroke-linecap="round"
  stroke-linejoin="round"
  role={label ? 'img' : undefined}
  aria-label={label}
  aria-hidden={label ? undefined : 'true'}
  focusable="false"
>
  <path {d} />
</svg>

<style>
  [data-wm='icon'] {
    display: inline-block;
    flex: none;
    vertical-align: middle;
  }
  [data-tone='muted'] { color: var(--wm-text-muted); }
  [data-tone='accent'] { color: var(--wm-accent); }
  [data-tone='action'] { color: var(--wm-action); }
  [data-tone='warning'] { color: var(--wm-warning); }
  [data-tone='error'] { color: var(--wm-error); }
  [data-tone='success'] { color: var(--wm-success); }
</style>
