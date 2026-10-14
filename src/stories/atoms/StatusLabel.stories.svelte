<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { REVIEW_STATUS, Stack, StatusLabel } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/StatusLabel',
    component: StatusLabel,
    args: { status: 'known-errors' },
    argTypes: {
      status: { control: 'select', options: Object.keys(REVIEW_STATUS) },
      tone: { control: 'inline-radio', options: ['act', 'care', 'context'] }
    },
    parameters: { docs: { description: { component: 'Three tones only. Filled rust with a triangle = act before using; rust outline = take care; slate outline = context. Text is always `--wm-text`, so labels stay readable on every surface. No green, no "Verified".' } } }
  });

  const all = Object.keys(REVIEW_STATUS);
</script>

<Story name="Default" />

<Story name="Three tones" asChild>
  <Stack direction="row" gap={2} wrap>
    <StatusLabel status="known-errors" />
    <StatusLabel status="review-required" />
    <StatusLabel status="snapshot" />
  </Stack>
</Story>

<Story name="Every stored status" asChild>
  <Stack direction="row" gap={2} wrap>
    {#each all as s (s)}<StatusLabel status={s} />{/each}
  </Stack>
</Story>

<Story name="Unknown value" asChild>
  <Stack direction="row" gap={2} wrap>
    <StatusLabel status="some-new-status" />
    <StatusLabel status="private-browser-capture" />
  </Stack>
</Story>
