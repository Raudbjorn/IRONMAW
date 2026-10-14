<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Button, Link, Notice, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Molecules/Notice',
    component: Notice,
    args: { tone: 'info', title: undefined },
    argTypes: {
      tone: { control: 'select', options: ['info', 'success', 'warning', 'error', 'status'] },
      children: { table: { disable: true } },
      action: { table: { disable: true } },
      ondismiss: { table: { disable: true } }
    },
    parameters: { docs: { description: { component: 'Page-level and inline notices. Warning and error are amber and red, never rust: a notice must not look like a routine action. The action slot holds the recovery control; the copy says what happened and what is kept.' } } }
  });
</script>

<Story name="Info">
  {#snippet template({ children: _, ...args })}
    <Notice {...args}>Icelandic shows documents tagged Icelandic only. Documents that mix both languages are under Mixed.</Notice>
  {/snippet}
</Story>

<Story name="Service unavailable" asChild>
  <Notice tone="error" title="Can’t reach the library service.">
    Your search, filters and open document are kept. What you see was loaded before the connection dropped.
    {#snippet action()}<Button variant="secondary" size="sm">Retry</Button>{/snippet}
  </Notice>
</Story>

<Story name="Known issues" asChild>
  <Notice tone="warning" title="Known issues: read the context before quoting.">
    The source package records corrections for this document. They aren’t in the index yet; they’re in this file: <Link href="#context">sources/unpacked/landsnet-2025-06/README.md</Link>
  </Notice>
</Story>

<Story name="Index refreshed" asChild>
  <Notice tone="status" dismissLabel="Dismiss" ondismiss={() => {}}>Index updated 2026-10-13 14:02. Results were refreshed; your search and filters are kept.</Notice>
</Story>

<Story name="Clipboard" asChild>
  <Stack gap={3}>
    <Notice tone="success">Copied the passage with its source and the known-issues caution.</Notice>
    <Notice tone="error">Could not copy. Select the text and copy it manually.</Notice>
  </Stack>
</Story>
