// Mirrors src/stories/atoms/Marker.stories.svelte
import * as React from 'react';
import { Marker, Stack } from '@svnbjrn/ironmaw';

export const Default = () => <Marker value={1} tone="warning" size="md" label="Finding 1" />;

export const Tones = () => (
  <Stack direction="row" gap={2} align="center">
    <Marker value={1} tone="warning" />
    <Marker value={2} tone="error" />
    <Marker value={3} tone="accent" />
    <Marker value={4} tone="neutral" />
  </Stack>
);

export const Sizes = () => (
  <Stack direction="row" gap={2} align="center">
    <Marker value={7} size="sm" />
    <Marker value={7} size="md" />
  </Stack>
);
