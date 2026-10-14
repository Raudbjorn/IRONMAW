<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Heading, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Heading',
    component: Heading,
    args: { level: 1, display: false },
    argTypes: { level: { control: 'inline-radio', options: [1, 2, 3, 4] }, children: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'Inter semibold by default. `display` switches to the condensed uppercase brand face — for section titles like LIBRARY, never for document titles.' } } }
  });
</script>

<Story name="Default">
  {#snippet template({ children: _, ...args })}
    <Heading {...args}>cv-sveinbjorn-geirsson.is.pdf</Heading>
  {/snippet}
</Story>

<Story name="Ramp" asChild>
  <Stack gap={3}>
    <Heading level={1}>Level 1 — 28px</Heading>
    <Heading level={2}>Level 2 — 22px</Heading>
    <Heading level={3}>Level 3 — 18px</Heading>
    <Heading level={4}>Level 4 — 16px</Heading>
  </Stack>
</Story>

<Story name="Display" asChild>
  <Stack gap={3}>
    <Heading level={1} display>Library</Heading>
    <Heading level={2} display>Wormian Bones</Heading>
    <Heading level={3} display>Sources</Heading>
  </Stack>
</Story>
