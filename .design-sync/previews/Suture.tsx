// Mirrors src/stories/layout/Suture.stories.svelte
import * as React from 'react';
import { Stack, Suture, Text } from '@svnbjrn/ironmaw';

export const Default = () => <Suture />;

export const Labelled = () => (
  <Stack gap={4}>
    <Text size="sm">5 documents match “ferilskrá” · 8 matching passages</Text>
    <Suture label="Categories" />
    <Text size="sm" tone="muted">All documents · CVs · Applications · Writing and translation</Text>
    <Suture label="Active filters" />
    <Text size="sm" tone="muted">Language: Icelandic</Text>
  </Stack>
);

export const Plain = () => (
  <Stack gap={4}>
    <Text size="sm">Above the seam</Text>
    <Suture tick={false} />
    <Text size="sm">Below the seam</Text>
  </Stack>
);

export const Vertical = () => (
  <Stack direction="row" gap={4} align="stretch" style="height: 120px">
    <Text size="sm">Results</Text>
    <Suture orientation="vertical" />
    <Text size="sm">Reader</Text>
  </Stack>
);
