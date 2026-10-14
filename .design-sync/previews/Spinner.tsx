// Mirrors src/stories/atoms/Spinner.stories.svelte
import * as React from 'react';
import { Spinner, Stack } from '@svnbjrn/ironmaw';

export const Default = () => <Spinner />;

export const Sizes = () => (
  <Stack direction="row" gap={4} align="center">
    <Spinner size="sm" />
    <Spinner size="md" />
    <Spinner size="lg" />
  </Stack>
);
