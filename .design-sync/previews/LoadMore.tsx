// Mirrors src/stories/library/LoadMore.stories.svelte
import * as React from 'react';
import { LoadMore, Stack } from '@svnbjrn/ironmaw';

export const Idle = () => <LoadMore />;

export const AllStates = () => (
  <Stack gap={2}>
    <LoadMore state="idle" />
    <LoadMore state="loading" />
    <LoadMore state="failed" />
    <LoadMore state="end" endText="End of results · 37 documents shown" />
  </Stack>
);
