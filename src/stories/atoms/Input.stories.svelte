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

<Story name="Affixes" asChild>
  <Stack gap={4}>
    <Input label="Font size" type="number" value="11" unit="pt" />
    <Input label="Line height" type="number" value="1.5" />
    <Input label="Website" type="url" placeholder="https://" icon="link" />
    <Input label="Primary colour" mono value="#1A6E6E">
      {#snippet leading()}<span style="display:block;width:16px;height:16px;border-radius:2px;background:#1A6E6E"></span>{/snippet}
    </Input>
  </Stack>
</Story>
