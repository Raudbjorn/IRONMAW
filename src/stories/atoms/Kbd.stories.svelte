<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Kbd, Stack, Text } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Kbd',
    component: Kbd,
    args: { keys: ['Alt', '↑'], label: 'Alt plus Up' },
    parameters: { docs: { description: { component: 'A keyboard hint. Pass a label that spells out the combination for assistive technology.' } } }
  });
</script>

<Story name="Default" />

<Story name="In a hint" asChild>
  <Stack direction="row" gap={2} align="center">
    <Text size="sm" tone="muted">Move a section</Text>
    <Kbd keys={['Alt', '↑', '↓']} label="Alt plus Up or Down" />
  </Stack>
</Story>

<Story name="Single key" args={{ keys: ['Esc'], label: 'Escape' }} />
