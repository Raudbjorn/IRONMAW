<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { LoadMore, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Library/LoadMore',
    component: LoadMore,
    args: { state: 'idle' },
    argTypes: { state: { control: 'inline-radio', options: ['idle', 'loading', 'failed', 'end'] }, onclick: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'Continuation for the result list. No page numbers or totals until the API returns a reliable count. Loading keeps the button focusable; failure keeps loaded rows and offers Retry; end is a plain statement.' } } }
  });
</script>

<Story name="Idle" />

<Story name="All states" asChild>
  <Stack gap={2}>
    <LoadMore state="idle" />
    <LoadMore state="loading" />
    <LoadMore state="failed" />
    <LoadMore state="end" endText="End of results · 37 documents shown" />
  </Stack>
</Story>
