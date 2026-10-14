<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Select, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Select',
    component: Select,
    args: {
      label: 'Language',
      options: [
        { value: '', label: 'Any language' },
        { value: 'en', label: 'English' },
        { value: 'is', label: 'Icelandic' },
        { value: 'mixed', label: 'Mixed' },
        { value: 'unknown', label: 'Unknown' }
      ]
    },
    argTypes: { onchange: { table: { disable: true } } }
  });

  const employers = [
    { value: '', label: 'Any employer' },
    { value: 'sedlabanki', label: 'Seðlabanki Íslands' },
    { value: 'landsnet', label: 'Landsnet' },
    { value: 'reitun', label: 'Reitun' },
    { value: 'general', label: 'general (raw value)' }
  ];
</script>

<Story name="Default" />

<Story name="Filter row" asChild>
  <Stack direction="row" gap={3} wrap>
    <Select label="Employer" options={employers} />
    <Select label="Format" options={[{ value: '', label: 'Any format' }, { value: 'pdf', label: 'PDF' }, { value: 'text', label: 'Plain text' }, { value: 'conversation', label: 'Conversation' }, { value: 'asset', label: 'Image / asset' }]} />
    <Select label="Review status" options={[{ value: '', label: 'Any review status' }, { value: 'known-errors', label: 'Known issues' }, { value: 'review-required', label: 'Review before reuse' }]} />
  </Stack>
</Story>
