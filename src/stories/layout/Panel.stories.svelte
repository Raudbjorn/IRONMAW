<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Heading, Kicker, Panel, Stack, StatusLabel, Text } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Layout/Panel',
    component: Panel,
    args: { surface: 1, padding: 4, elevated: false },
    argTypes: {
      surface: { control: 'inline-radio', options: [1, 2, 3] },
      padding: { control: 'inline-radio', options: [0, 2, 3, 4, 6] },
      children: { table: { disable: true } },
      header: { table: { disable: true } },
      footer: { table: { disable: true } }
    },
    parameters: { docs: { description: { component: 'A fitted surface: tonal step, quiet border, small radius. The reader, the category navigation and metadata blocks are Panels.' } } }
  });
</script>

<Story name="Basic">
  {#snippet template({ children: _, ...args })}
    <Panel {...args}>
      <Text>Select a document to read its content and sources.</Text>
    </Panel>
  {/snippet}
</Story>

<Story name="Reader header" asChild>
  <Panel as="section" aria-label="Reader" padding={4}>
    {#snippet header()}
      <Stack gap={2}>
        <Kicker>CVs · Applications · Landsnet</Kicker>
        <Heading level={2}>cv-sveinbjorn-geirsson.is.pdf</Heading>
        <Stack direction="row" gap={2} align="center" wrap>
          <Text size="sm" tone="muted" as="span">Icelandic · PDF · 6 extracted passages</Text>
          <StatusLabel status="snapshot" />
        </Stack>
      </Stack>
    {/snippet}
    <Text prose>Ferilskrá
Sveinbjörn Geirsson

Yfirlit yfir starfsreynslu, menntun og tæknikunnáttu, raðað frá nýjasta starfi til hins elsta.</Text>
    {#snippet footer()}
      <Text size="xs" tone="faint">Extracted text keeps paragraphs, not the original layout. Original preview is not available yet.</Text>
    {/snippet}
  </Panel>
</Story>

<Story name="Surfaces" asChild>
  <Stack direction="row" gap={3} wrap>
    <Panel surface={1}><Text>surface-1</Text></Panel>
    <Panel surface={2}><Text>surface-2</Text></Panel>
    <Panel surface={3}><Text>surface-3</Text></Panel>
    <Panel surface={2} elevated><Text>elevated</Text></Panel>
  </Stack>
</Story>
