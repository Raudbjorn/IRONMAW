// Mirrors src/stories/atoms/Kicker.stories.svelte
import * as React from 'react';
import { Kicker, Stack } from '@svnbjrn/ironmaw';

export const Default = () => <Kicker>Search library</Kicker>;

export const WithTick = () => (
  <Stack gap={4}>
    <Kicker tick>Categories</Kicker>
    <Kicker tick tone="strong">Active filters</Kicker>
    <Kicker tick tone="accent">Extracted text</Kicker>
  </Stack>
);

export const Tones = () => (
  <Stack direction="row" gap={6} wrap>
    <Kicker tone="muted">Muted</Kicker>
    <Kicker tone="strong">Strong</Kicker>
    <Kicker tone="accent">Accent</Kicker>
    <Kicker tone="action">Action</Kicker>
  </Stack>
);
