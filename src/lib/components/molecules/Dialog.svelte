<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { IconName } from '../../icons.ts';
  import Icon from '../atoms/Icon.svelte';
  import Button from '../atoms/Button.svelte';

  // A modal over the page, on the native <dialog> opened with showModal(): the
  // browser supplies the focus trap, inert background and top layer. We add
  // the return of focus to whatever opened it, light dismissal (Escape and a
  // click on the backdrop) unless `dismissible` is false, and the naming
  // (title -> aria-labelledby, description -> aria-describedby). Actions go in
  // `footer`, right-aligned; without one a single Close button is rendered.
  // Put the one main action (rust) last in the footer.
  interface Props {
    open?: boolean;
    title: string;
    description?: string;
    icon?: IconName;
    children?: Snippet;
    /** Actions row, right-aligned. Omit for a lone Close button. */
    footer?: Snippet;
    onclose?: () => void;
    closeLabel?: string;
    size?: 'sm' | 'md';
    /** Escape and backdrop click close it. False: only explicit actions do. */
    dismissible?: boolean;
  }

  const uid = $props.id();

  let {
    open = $bindable(false),
    title,
    description,
    icon,
    children,
    footer,
    onclose,
    closeLabel = 'Close',
    size = 'md',
    dismissible = true
  }: Props = $props();

  const titleId = $derived(`${uid}-title`);
  const descId = $derived(`${uid}-desc`);
  let el: HTMLDialogElement | undefined = $state();
  let opener: Element | null = null;

  $effect(() => {
    if (!el) return;
    if (open && !el.open) {
      opener = document.activeElement;
      if (typeof el.showModal === 'function') el.showModal();
      else el.setAttribute('open', '');
    } else if (!open && el.open) {
      if (typeof el.close === 'function') el.close();
      else {
        el.removeAttribute('open');
        restoreFocus();
        onclose?.();
      }
    }
  });

  function restoreFocus() {
    const target = opener;
    opener = null;
    if (target instanceof HTMLElement && target.isConnected) target.focus();
  }

  // Fires for every close path (Escape, el.close(), form method=dialog).
  function handleClose() {
    open = false;
    restoreFocus();
    onclose?.();
  }

  function handleCancel(e: Event) {
    if (!dismissible) e.preventDefault();
  }

  // The panel fills the dialog box, so a click that targets the dialog itself
  // landed on the backdrop.
  function handleClick(e: MouseEvent) {
    if (dismissible && e.target === el) open = false;
  }

  function closeFromButton() {
    open = false;
  }
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog
  bind:this={el}
  data-wm="dialog"
  data-size={size}
  aria-labelledby={titleId}
  aria-describedby={description ? descId : undefined}
  onclose={handleClose}
  oncancel={handleCancel}
  onclick={handleClick}
>
  <div class="panel">
    <header>
      <h2 id={titleId}>
        {#if icon}<span class="icon"><Icon name={icon} size={20} /></span>{/if}
        <span>{title}</span>
      </h2>
      {#if description}<p id={descId}>{description}</p>{/if}
    </header>
    {#if children}<div class="body">{@render children()}</div>{/if}
    <footer>
      {#if footer}
        {@render footer()}
      {:else}
        <Button variant="secondary" onclick={closeFromButton}>{closeLabel}</Button>
      {/if}
    </footer>
  </div>
</dialog>

<style>
  dialog {
    box-sizing: border-box;
    width: calc(100% - 2 * var(--wm-space-4));
    max-width: 560px;
    max-height: calc(100dvh - 2 * var(--wm-space-4));
    padding: 0;
    overflow: auto;
    background: var(--wm-surface-2);
    color: var(--wm-text);
    border: 1px solid var(--wm-border-strong);
    border-radius: var(--wm-radius-md);
    box-shadow: var(--wm-shadow-md);
  }
  dialog[data-size='sm'] { max-width: 420px; }
  dialog::backdrop { background: rgb(0 0 0 / 0.55); }
  @media (prefers-reduced-motion: no-preference) {
    dialog[open] { animation: wm-dialog-in 0.12s ease; }
  }
  @keyframes wm-dialog-in {
    from { opacity: 0; transform: translateY(4px); }
  }
  .panel {
    display: flex;
    flex-direction: column;
    gap: var(--wm-space-4);
    padding: var(--wm-space-6);
  }
  header { display: flex; flex-direction: column; gap: var(--wm-space-2); }
  h2 {
    display: flex;
    align-items: center;
    gap: var(--wm-space-2);
    margin: 0;
    font-family: var(--wm-font-display);
    font-weight: var(--wm-display-weight);
    font-size: var(--wm-fs-lg);
    line-height: var(--wm-lh-normal);
    text-transform: uppercase;
    letter-spacing: var(--wm-tracking-display);
    color: var(--wm-text-strong);
  }
  .icon { display: inline-flex; flex: none; color: var(--wm-accent); }
  p {
    margin: 0;
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-base);
    line-height: var(--wm-lh-normal);
    color: var(--wm-text-muted);
  }
  /* Extra air between the intro and the first group. */
  .body { min-width: 0; padding-top: var(--wm-space-2); }
  footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--wm-space-2);
  }
</style>
