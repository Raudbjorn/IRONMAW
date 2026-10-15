<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { SaveStatus, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/SaveStatus',
    component: SaveStatus,
    args: { state: 'saved' },
    parameters: { docs: { description: { component: 'Quiet save feedback for a header. A polite live region. Saved is faint, not saved is amber, couldn\'t save is error.' } } }
  });
</script>

<Story name="Saved" />

<Story name="Every state" asChild>
  <Stack gap={2}>
    <SaveStatus state="saved" />
    <SaveStatus state="saving" />
    <SaveStatus state="unsaved" />
    <SaveStatus state="error" />
  </Stack>
</Story>

<Story name="Custom label" args={{ state: 'saved', label: 'Saved at 14:32' }} />
