// Mirrors src/stories/atoms/Chip.stories.svelte
import * as React from 'react';
import { Chip, Stack } from '@svnbjrn/ironmaw';

export const Default = () => <Chip label="Language: Icelandic" />;

export const ActiveFilters = () => (
  <Stack direction="row" gap={2} wrap>
    <Chip label="Employer: Seðlabanki Íslands" selected onremove={() => {}} />
    <Chip label="Language: Icelandic" selected onremove={() => {}} />
    <Chip label="Format: PDF" selected onremove={() => {}} />
  </Stack>
);

export const SelectableWithCounts = () => (
  <Stack direction="row" gap={2} wrap>
    <Chip label="All documents" count={356} selected onclick={() => {}} />
    <Chip label="CVs" count={42} onclick={() => {}} />
    <Chip label="Applications" count={124} onclick={() => {}} />
    <Chip label="Templates" count={9} onclick={() => {}} />
  </Stack>
);

export const Static = () => (
  <Stack direction="row" gap={2} wrap>
    <Chip label="6 file locations" />
    <Chip label="Matched document metadata" />
  </Stack>
);
