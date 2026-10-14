// Mirrors src/stories/layout/Stack.stories.svelte
import * as React from 'react';
import { Chip, Stack, StatusLabel, Text } from '@svnbjrn/ironmaw';

export const Playground = () => (
  <Stack gap={4}>
    <Text>Showing 10 of 42 documents</Text>
    <Text tone="muted" size="sm">Title A–Z</Text>
    <Text tone="faint" size="xs">Counts cover the whole library; filtered results may differ.</Text>
  </Stack>
);

export const Row = () => (
  <Stack direction="row" gap={2} align="center" wrap>
    <Chip label="Language: Icelandic" selected onremove={() => {}} />
    <Chip label="Format: PDF" selected onremove={() => {}} />
    <StatusLabel status="known-errors" />
  </Stack>
);

export const GapScale = () => (
  <Stack gap={6}>
    {([1, 2, 3, 4, 6, 8] as const).map((g) => (
      <Stack key={g} direction="row" gap={g} align="center">
        <Text mono size="xs" tone="muted">gap {g}</Text>
        <Chip label="a" /><Chip label="b" /><Chip label="c" />
      </Stack>
    ))}
  </Stack>
);
