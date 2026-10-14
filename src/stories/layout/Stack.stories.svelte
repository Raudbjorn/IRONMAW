<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Chip, Stack, StatusLabel, Text } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Layout/Stack',
    component: Stack,
    args: { direction: 'column', gap: 4, align: 'stretch', justify: 'start', wrap: false },
    argTypes: {
      direction: { control: 'inline-radio', options: ['column', 'row'] },
      gap: { control: 'select', options: [0, 1, 2, 3, 4, 6, 8, 12] },
      align: { control: 'select', options: ['start', 'center', 'end', 'stretch', 'baseline'] },
      justify: { control: 'select', options: ['start', 'center', 'end', 'between'] },
      children: { table: { disable: true } }
    },
    parameters: { docs: { description: { component: 'The only layout primitive. `gap` takes scale steps, not pixels.' } } }
  });
</script>

<Story name="Playground">
  {#snippet template({ children: _, ...args })}
    <Stack {...args}>
      <Text>Showing 10 of 42 documents</Text>
      <Text tone="muted" size="sm">Title A–Z</Text>
      <Text tone="faint" size="xs">Counts cover the whole library; filtered results may differ.</Text>
    </Stack>
  {/snippet}
</Story>

<Story name="Row" asChild>
  <Stack direction="row" gap={2} align="center" wrap>
    <Chip label="Language: Icelandic" selected onremove={() => {}} />
    <Chip label="Format: PDF" selected onremove={() => {}} />
    <StatusLabel status="known-errors" />
  </Stack>
</Story>

<Story name="Gap scale" asChild>
  <Stack gap={6}>
    {#each [1, 2, 3, 4, 6, 8] as g (g)}
      <Stack direction="row" gap={g as 1 | 2 | 3 | 4 | 6 | 8} align="center">
        <Text mono size="xs" tone="muted">gap {g}</Text>
        <Chip label="a" /><Chip label="b" /><Chip label="c" />
      </Stack>
    {/each}
  </Stack>
</Story>
