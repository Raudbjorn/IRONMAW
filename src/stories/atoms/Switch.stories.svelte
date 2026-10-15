<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Switch, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Switch',
    component: Switch,
    args: { label: 'Show page numbers', checked: false },
    argTypes: { onchange: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'An on/off setting that applies at once. Teal track when on. The label toggles it too; an optional description sits under the label.' } } }
  });
</script>

<Story name="Default" />

<Story name="On with description" args={{ label: 'Underline links', description: 'Links stay recognisable when printed.', checked: true }} />

<Story name="Settings group" asChild>
  <Stack gap={3}>
    <Switch label="Show page numbers" checked />
    <Switch label="Show profile photo" description="Optional in Iceland; leave off if unsure." />
    <Switch label="Compact spacing" disabled />
  </Stack>
</Story>
