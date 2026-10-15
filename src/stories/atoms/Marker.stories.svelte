<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Marker, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Marker',
    component: Marker,
    args: { value: 1, tone: 'warning', size: 'md', label: 'Finding 1' },
    parameters: { docs: { description: { component: 'A numbered dot tying a finding in a list to its place on the page. Number and shape carry the meaning, not colour alone. Warning is amber, never rust.' } } }
  });
</script>

<Story name="Default" />

<Story name="Tones" asChild>
  <Stack direction="row" gap={2} align="center">
    <Marker value={1} tone="warning" />
    <Marker value={2} tone="error" />
    <Marker value={3} tone="accent" />
    <Marker value={4} tone="neutral" />
  </Stack>
</Story>

<Story name="Sizes" asChild>
  <Stack direction="row" gap={2} align="center">
    <Marker value={7} size="sm" />
    <Marker value={7} size="md" />
  </Stack>
</Story>
