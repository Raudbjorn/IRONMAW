<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Input, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Input',
    component: Input,
    args: { label: 'Employer display name', placeholder: 'Seðlabanki Íslands', value: '', mono: false, disabled: false },
    argTypes: { oninput: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'Dark outlined field from component board B3: slate outline, teal focus. Label is a display kicker; hint and error stay in sentence case.' } } }
  });
</script>

<Story name="Default" />

<Story name="States" asChild>
  <Stack gap={4}>
    <Input label="With hint" hint="Shown as the employer name in filters and entries." placeholder="Seðlabanki Íslands" />
    <Input label="With error" value="sedlabanki" error="Use the reviewed Icelandic spelling, not the folder slug." />
    <Input label="Mono" mono value="02-applications/sedlabanki/sedlabanki-2025-01/inputs" />
    <Input label="Disabled" value="Not editable in this slice" disabled />
  </Stack>
</Story>
