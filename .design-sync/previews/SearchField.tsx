// Mirrors src/stories/molecules/SearchField.stories.svelte
import * as React from 'react';
import { SearchField, Stack } from '@svnbjrn/ironmaw';

export const VisibleLabel = () => <SearchField />;

export const Filled = () => <SearchField value="ferilskrá" />;

export const Searching = () => <SearchField value="umsókn" busy hint="Previous results remain while this search runs." />;

export const Rejected = () => (
  <Stack gap={6}>
    <SearchField value="f" error="Search needs at least 2 characters. Add a letter or two and search again." />
    <SearchField value="ferilskrá" error="The library service rejected this search: “unknown query parameter”. Change the search or clear the filters." />
  </Stack>
);
