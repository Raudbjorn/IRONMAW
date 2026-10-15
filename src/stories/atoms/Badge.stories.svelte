<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Badge, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Badge',
    component: Badge,
    args: { value: 6, tone: 'neutral' },
    parameters: { docs: { description: { component: 'A short figure or tag riding on another control. Show only counts the data backs. Warning is amber: attention, not an action.' } } }
  });
</script>

<Story name="Default" />

<Story name="Tones" asChild>
  <Stack direction="row" gap={2} align="center">
    <Badge value={3} />
    <Badge value={3} tone="accent" />
    <Badge value={3} tone="warning" />
    <Badge value={3} tone="error" />
  </Stack>
</Story>

<Story name="With accessible label" args={{ value: 6, tone: 'warning', label: '6 checks to review' }} />

<Story name="Text tag" args={{ value: 'New', tone: 'accent' }} />
