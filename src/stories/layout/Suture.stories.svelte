<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Stack, Suture, Text } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Layout/Suture',
    component: Suture,
    args: { tick: true, orientation: 'horizontal' },
    argTypes: { orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] } },
    parameters: { docs: { description: { component: 'The seam — the system\'s signature. A thin slate line that admits a short rust tick and, optionally, a display label. It always marks a real join between parts.' } } }
  });
</script>

<Story name="Default" />

<Story name="Labelled" asChild>
  <Stack gap={4}>
    <Text size="sm">5 documents match “ferilskrá” · 8 matching passages</Text>
    <Suture label="Categories" />
    <Text size="sm" tone="muted">All documents · CVs · Applications · Writing and translation</Text>
    <Suture label="Active filters" />
    <Text size="sm" tone="muted">Language: Icelandic</Text>
  </Stack>
</Story>

<Story name="Plain" asChild>
  <Stack gap={4}>
    <Text size="sm">Above the seam</Text>
    <Suture tick={false} />
    <Text size="sm">Below the seam</Text>
  </Stack>
</Story>

<Story name="Vertical" asChild>
  <Stack direction="row" gap={4} align="stretch" style="height: 120px">
    <Text size="sm">Results</Text>
    <Suture orientation="vertical" />
    <Text size="sm">Reader</Text>
  </Stack>
</Story>
