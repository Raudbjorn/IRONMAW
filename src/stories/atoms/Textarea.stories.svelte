<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Textarea, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Textarea',
    component: Textarea,
    args: { label: 'Summary', placeholder: 'Two or three sentences about your work.', value: '', rows: 4, disabled: false, readonly: false },
    argTypes: { oninput: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'The Input field\'s multi-line sibling. Relaxed line height for reading while editing; an optional visible character count that turns amber from 90%.' } } }
  });

  const summary = 'Hugbúnaðarsérfræðingur með reynslu af vefforritun og gagnagrunnum. Hef unnið í litlum teymum og stærri verkefnum, bæði í opinbera geiranum og einkageiranum.';
</script>

<Story name="Default" />

<Story name="With count" asChild>
  <Stack gap={4}>
    <Textarea label="Summary" maxlength={1000} value={summary} hint="Shown at the top of the CV." />
    <Textarea label="Summary, near the limit" maxlength={165} value={summary} />
  </Stack>
</Story>

<Story name="States" asChild>
  <Stack gap={4}>
    <Textarea label="With error" value="Short" error="Write at least two sentences." />
    <Textarea label="Read-only" readonly readonlyHint="Edit this in the main CV." value={summary} />
    <Textarea label="Disabled" disabled value="Not editable in this slice" />
  </Stack>
</Story>
