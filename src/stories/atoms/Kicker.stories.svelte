<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Kicker, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Kicker',
    component: Kicker,
    args: { tone: 'muted', tick: false, as: 'span' },
    argTypes: {
      tone: { control: 'inline-radio', options: ['muted', 'strong', 'accent', 'action'] },
      as: { control: 'select', options: ['span', 'div', 'label', 'h2', 'h3', 'h4'] },
      children: { table: { disable: true } }
    },
    parameters: { docs: { description: { component: 'The short uppercase display label from the brand boards. Short labels only; warnings and reading text stay in Inter sentence case.' } } }
  });
</script>

<Story name="Default">
  {#snippet template({ children: _, ...args })}
    <Kicker {...args}>Search library</Kicker>
  {/snippet}
</Story>

<Story name="With tick" asChild>
  <Stack gap={4}>
    <Kicker tick>Categories</Kicker>
    <Kicker tick tone="strong">Active filters</Kicker>
    <Kicker tick tone="accent">Extracted text</Kicker>
  </Stack>
</Story>

<Story name="Tones" asChild>
  <Stack direction="row" gap={6} wrap>
    <Kicker tone="muted">Muted</Kicker>
    <Kicker tone="strong">Strong</Kicker>
    <Kicker tone="accent">Accent</Kicker>
    <Kicker tone="action">Action</Kicker>
  </Stack>
</Story>
