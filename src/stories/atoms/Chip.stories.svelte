<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Chip, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Chip',
    component: Chip,
    args: { label: 'Language: Icelandic', selected: false, removeLabel: 'Remove' },
    argTypes: { onclick: { table: { disable: true } }, onremove: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'Filter chip. Colour reflects state (teal = selected), never a category hierarchy. The remove control is its own button named "Remove <label>".' } } }
  });
</script>

<Story name="Default" />

<Story name="Active filters" asChild>
  <Stack direction="row" gap={2} wrap>
    <Chip label="Employer: Seðlabanki Íslands" selected onremove={() => {}} />
    <Chip label="Language: Icelandic" selected onremove={() => {}} />
    <Chip label="Format: PDF" selected onremove={() => {}} />
  </Stack>
</Story>

<Story name="Selectable with counts" asChild>
  <Stack direction="row" gap={2} wrap>
    <Chip label="All documents" count={356} selected onclick={() => {}} />
    <Chip label="CVs" count={42} onclick={() => {}} />
    <Chip label="Applications" count={124} onclick={() => {}} />
    <Chip label="Templates" count={9} onclick={() => {}} />
  </Stack>
</Story>

<Story name="Static" asChild>
  <Stack direction="row" gap={2} wrap>
    <Chip label="6 file locations" />
    <Chip label="Matched document metadata" />
  </Stack>
</Story>
