<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { SearchField, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Molecules/SearchField',
    component: SearchField,
    args: { value: '', busy: false, label: 'Search library', placeholder: 'Search CVs, letters, and reference material' },
    argTypes: { onsubmit: { table: { disable: true } }, onclear: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'Explicit submit, obvious clear, never disabled. Keyword search of titles, file paths and extracted text — the copy promises nothing semantic.' } } }
  });
</script>

<Story name="Visible label" />

<Story name="Filled" args={{ value: 'ferilskrá' }} />

<Story name="Searching" args={{ value: 'umsókn', busy: true, hint: 'Previous results remain while this search runs.' }} />

<Story name="Rejected" asChild>
  <Stack gap={6}>
    <SearchField value="f" error="Search needs at least 2 characters. Add a letter or two and search again." />
    <SearchField value="ferilskrá" error="The library service rejected this search: “unknown query parameter”. Change the search or clear the filters." />
  </Stack>
</Story>
