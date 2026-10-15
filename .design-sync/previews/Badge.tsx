// Mirrors src/stories/atoms/Badge.stories.svelte
import * as React from 'react';
import { Badge, Stack } from '@svnbjrn/ironmaw';

export const Default = () => <Badge value={6} tone="neutral" />;

export const Tones = () => (
  <Stack direction="row" gap={2} align="center">
    <Badge value={3} />
    <Badge value={3} tone="accent" />
    <Badge value={3} tone="warning" />
    <Badge value={3} tone="error" />
  </Stack>
);

export const WithAccessibleLabel = () => <Badge value={6} tone="warning" label="6 checks to review" />;

export const TextTag = () => <Badge value="New" tone="accent" />;
