<script module lang="ts">
  export type DocContact = {
    kind: 'email' | 'phone' | 'location' | 'website' | 'profile' | 'other';
    value: string;
    href?: string;
  };
</script>

<script lang="ts">
  import Icon from '../atoms/Icon.svelte';
  import Suture from '../layout/Suture.svelte';
  import type { IconName } from '../../icons.ts';

  // The top of a CV page: name (the only h1), headline and contact line, then
  // a suture with the rust tick. All text is real text so a parser reads the
  // same words a person sees; icons are decorative and never carry meaning.
  interface Props {
    name: string;
    headline?: string;
    contacts?: DocContact[];
  }

  let { name, headline, contacts = [] }: Props = $props();

  const ICON: Record<DocContact['kind'], IconName> = {
    email: 'mail',
    phone: 'phone',
    location: 'location',
    website: 'globe',
    profile: 'link',
    other: 'link'
  };

  // mailto:/tel: are derived when no href is given. Whitespace is stripped from
  // phone numbers for the link only; the visible value is untouched.
  function hrefFor(c: DocContact): string | undefined {
    if (c.href) return c.href;
    if (c.kind === 'email') return `mailto:${c.value}`;
    if (c.kind === 'phone') return `tel:${c.value.replace(/[^\d+]/g, '')}`;
    return undefined;
  }
</script>

<header data-wm="doc-header">
  <h1>{name}</h1>
  {#if headline}<p class="headline">{headline}</p>{/if}
  {#if contacts.length}
    <ul class="contacts">
      {#each contacts as c, i (i)}
        {@const href = hrefFor(c)}
        <li data-kind={c.kind}>
          <Icon name={ICON[c.kind]} size={16} tone="accent" />
          {#if href}<a {href}>{c.value}</a>{:else}<span>{c.value}</span>{/if}
        </li>
      {/each}
    </ul>
  {/if}
  <div class="seam"><Suture /></div>
</header>

<style>
  [data-wm='doc-header'] { display: block; color: var(--wm-text); }
  h1 {
    margin: 0;
    font-family: var(--wm-font-sans);
    font-size: var(--wm-fs-3xl);
    font-weight: var(--wm-font-weight-semibold);
    line-height: var(--wm-lh-tight);
    color: var(--wm-text-strong);
    text-wrap: balance;
  }
  .headline {
    margin: var(--wm-space-1) 0 0;
    font-size: var(--wm-fs-lg);
    line-height: var(--wm-lh-normal);
    color: var(--wm-text-muted);
  }
  .contacts {
    display: flex;
    flex-wrap: wrap;
    gap: var(--wm-space-2) var(--wm-space-4);
    margin: var(--wm-space-3) 0 0;
    padding: 0;
    list-style: none;
  }
  li {
    display: inline-flex;
    align-items: center;
    gap: var(--wm-space-2);
    font-size: var(--wm-fs-sm);
    line-height: var(--wm-lh-normal);
    color: var(--wm-text);
  }
  a {
    color: var(--wm-text);
    text-decoration: underline;
    text-underline-offset: 3px;
    transition: color 0.12s ease;
  }
  a:hover { color: var(--wm-accent); }
  a:focus-visible { outline: 2px solid var(--wm-accent); outline-offset: 2px; }
  .seam { margin-block: var(--wm-space-4); }
  @media (prefers-reduced-motion: reduce) { a { transition: none; } }
  @media print { a { color: inherit; } }
</style>
