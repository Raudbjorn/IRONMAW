<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Checkbox, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Checkbox',
    component: Checkbox,
    args: { label: 'Include references', checked: false, disabled: false },
    argTypes: { onchange: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'A yes/no choice applied later. Teal fill when checked, a minus when partly chosen. The whole row, label included, toggles it. For a setting that applies at once use Switch.' } } }
  });
</script>

<Story name="Default" />

<Story name="States" asChild>
  <Stack gap={3}>
    <Checkbox label="Include references" checked />
    <Checkbox label="Show profile photo" description="Optional in Iceland; leave off if unsure." />
    <Checkbox label="All sections" indeterminate />
    <Checkbox label="Locked by the template" checked disabled />
  </Stack>
</Story>

<Story name="Group" asChild>
  <Stack gap={3}>
    <Checkbox label="Starfsreynsla" checked />
    <Checkbox label="Menntun" checked />
    <Checkbox label="Tungumál" description="Íslenska, Enska" />
  </Stack>
</Story>
