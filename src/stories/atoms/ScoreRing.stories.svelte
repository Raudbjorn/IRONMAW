<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ScoreRing, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/ScoreRing',
    component: ScoreRing,
    args: { value: 82, label: 'Parse readability', size: 'md', tone: 'accent' },
    parameters: { docs: { description: { component: 'A circular gauge with the figure in the centre. Starts at 12 o\'clock, runs clockwise. Without a value it shows a dash. Show only a score the data backs.' } } }
  });
</script>

<Story name="Default" />

<Story name="Large" args={{ size: 'lg', value: 64, tone: 'warning' }} />

<Story name="Tones" asChild>
  <Stack direction="row" gap={4} align="center">
    <ScoreRing value={90} label="Readable" tone="accent" />
    <ScoreRing value={55} label="Needs review" tone="warning" />
    <ScoreRing value={20} label="Hard to read" tone="error" />
  </Stack>
</Story>

<Story name="No score yet" args={{ value: Number.NaN, label: 'Parse readability' }} />
