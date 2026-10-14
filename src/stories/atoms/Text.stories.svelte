<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Stack, Text } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Text',
    component: Text,
    args: { size: 'base', tone: 'default', mono: false, prose: false, as: 'p' },
    argTypes: {
      size: { control: 'inline-radio', options: ['xs', 'sm', 'base', 'lg', 'xl'] },
      tone: { control: 'select', options: ['default', 'strong', 'muted', 'faint', 'accent', 'action'] },
      as: { control: 'inline-radio', options: ['p', 'span', 'div'] },
      children: { table: { disable: true } }
    },
    parameters: { docs: { description: { component: 'Inter for interface and prose; Iosevka for paths and locators. `prose` sets the reading measure for extracted text.' } } }
  });
</script>

<Story name="Default">
  {#snippet template({ children: _, ...args })}
    <Text {...args}>Yfirlit yfir starfsreynslu, menntun og tæknikunnáttu, raðað frá nýjasta starfi til hins elsta.</Text>
  {/snippet}
</Story>

<Story name="Tones" asChild>
  <Stack gap={2}>
    <Text tone="strong">Strong — document titles and the reader heading.</Text>
    <Text>Default — body copy and excerpts.</Text>
    <Text tone="muted">Muted — language · format, secondary metadata.</Text>
    <Text tone="faint">Faint — hints and placeholders, still AA on surface-1.</Text>
    <Text tone="accent">Accent — teal, for links and matched emphasis.</Text>
    <Text tone="action">Action — rust, sparingly, for an active indicator in text.</Text>
  </Stack>
</Story>

<Story name="Sizes" asChild>
  <Stack gap={2}>
    <Text size="xs">xs — 12px labels inside chips and status pills</Text>
    <Text size="sm">sm — 13px helper text</Text>
    <Text size="base">base — 14px list text</Text>
    <Text size="lg">lg — 16px reading text</Text>
    <Text size="xl">xl — 18px lead</Text>
  </Stack>
</Story>

<Story name="Mono" asChild>
  <Stack gap={2}>
    <Text mono size="sm">library/02-applications/landsnet/landsnet-2025-06/cv-sveinbjorn-geirsson.pdf</Text>
    <Text mono size="xs" tone="muted">Passage 2 · Page 1 · from line 34</Text>
  </Stack>
</Story>

<Story name="Prose" asChild>
  <Text prose>Starfsreynsla

Hver færsla tilgreinir starfsheiti, vinnustað og tímabil, ásamt stuttri lýsingu á helstu verkefnum. Extracted text keeps paragraphs, not the original layout.</Text>
</Story>
