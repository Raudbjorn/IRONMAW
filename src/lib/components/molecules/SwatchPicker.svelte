<script module lang="ts">
  export type Swatch = { value: string; label: string };

  // Relative luminance for #rgb/#rrggbb and rgb()/rgba(); undefined otherwise.
  export function luminanceOf(css: string): number | undefined {
    const s = css.trim().toLowerCase();
    let rgb: number[] | undefined;
    const hex = /^#([0-9a-f]{3}|[0-9a-f]{6})$/.exec(s)?.[1];
    if (hex) {
      const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
      rgb = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16));
    } else {
      const m = /^rgba?\(\s*(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)[\s,]+(\d+(?:\.\d+)?)/.exec(s);
      if (m) rgb = [Number(m[1]), Number(m[2]), Number(m[3])];
    }
    if (!rgb) return undefined;
    const [r, g, b] = rgb.map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    }) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
</script>

<script lang="ts">
  import Icon from '../atoms/Icon.svelte';

  // A grid of colours to choose from (e.g. an accent for the document). One
  // choice, radiogroup semantics, roving tabindex, 2-D arrow navigation. The
  // tick contrasts with the swatch when its luminance is knowable; otherwise
  // it is white with a subtle dark stroke.
  interface Props {
    colors: Swatch[];
    value?: string;
    onchange?: (value: string) => void;
    'aria-label': string;
    columns?: number;
  }

  let { colors, value = $bindable(), onchange, 'aria-label': ariaLabel, columns = 8 }: Props = $props();

  const cols = $derived(Math.max(1, Math.floor(columns)));
  const selectedIndex = $derived(colors.findIndex((c) => c.value === value));
  const tabbableIndex = $derived(selectedIndex >= 0 ? selectedIndex : 0);

  /** 'light' | 'dark' tick, or 'dot' when luminance is unknown. */
  function tickKind(css: string): 'light' | 'dark' | 'dot' {
    const l = luminanceOf(css);
    if (l === undefined) return 'dot';
    return l > 0.4 ? 'dark' : 'light';
  }

  function select(i: number) {
    const c = colors[i];
    if (!c) return;
    value = c.value;
    onchange?.(c.value);
  }

  function keyNav(e: KeyboardEvent, i: number) {
    const n = colors.length;
    let j = i;
    if (e.key === 'ArrowRight') j = Math.min(i + 1, n - 1);
    else if (e.key === 'ArrowLeft') j = Math.max(i - 1, 0);
    else if (e.key === 'ArrowDown') j = i + cols < n ? i + cols : i;
    else if (e.key === 'ArrowUp') j = i - cols >= 0 ? i - cols : i;
    else if (e.key === 'Home') j = 0;
    else if (e.key === 'End') j = n - 1;
    else return;
    e.preventDefault();
    select(j);
    const btns = (e.currentTarget as HTMLElement).parentElement?.querySelectorAll<HTMLElement>('[role="radio"]');
    btns?.[j]?.focus();
  }
</script>

<div
  data-wm="swatch-picker"
  role="radiogroup"
  aria-label={ariaLabel}
  style:grid-template-columns="repeat({cols}, max-content)"
>
  {#each colors as c, i (c.value + i)}
    {@const checked = selectedIndex === i}
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      aria-label={c.label}
      title={c.label}
      tabindex={tabbableIndex === i ? 0 : -1}
      data-selected={checked || undefined}
      style:--swatch={c.value}
      onclick={() => select(i)}
      onkeydown={(e) => keyNav(e, i)}
    >
      {#if checked}
        <span class="tick" data-kind={tickKind(c.value)}><Icon name="check" size={12} /></span>
      {/if}
    </button>
  {/each}
</div>

<style>
  [data-wm='swatch-picker'] {
    display: grid;
    gap: var(--wm-space-2);
    padding: 3px;
  }
  button {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 24px;
    height: 24px;
    padding: 0;
    border: none;
    border-radius: var(--wm-radius-sm);
    background: var(--swatch);
    box-shadow: inset 0 0 0 1px color-mix(in oklab, var(--wm-text), transparent 80%);
    cursor: pointer;
  }
  button[data-selected] {
    outline: 2px solid var(--wm-text-strong);
    outline-offset: 2px;
  }
  button:focus-visible {
    outline: 2px solid var(--wm-accent);
    outline-offset: 2px;
  }
  .tick { display: inline-flex; align-items: center; justify-content: center; }
  /* Fixed ink, not theme tokens: the swatch colour does not change with the edition. */
  .tick[data-kind='light'] { color: white; }
  .tick[data-kind='dark'] { color: black; }
  /* Unknown colour: white tick with a subtle dark stroke, no disc. */
  .tick[data-kind='dot'] { color: white; filter: drop-shadow(0 0 1px black) drop-shadow(0 0 1px black); }
</style>
