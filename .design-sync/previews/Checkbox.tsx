// Mirrors src/stories/atoms/Checkbox.stories.svelte
import * as React from 'react';
import { Checkbox, Stack } from '@svnbjrn/ironmaw';

export const Default = () => <Checkbox label="Include references" checked={false} />;

export const States = () => (
  <Stack gap={3}>
    <Checkbox label="Include references" checked />
    <Checkbox label="Show profile photo" description="Optional in Iceland; leave off if unsure." />
    <Checkbox label="All sections" indeterminate />
    <Checkbox label="Locked by the template" checked disabled />
  </Stack>
);

export const Group = () => (
  <Stack gap={3}>
    <Checkbox label="Starfsreynsla" checked />
    <Checkbox label="Menntun" checked />
    <Checkbox label="Tungumál" description="Íslenska, Enska" />
  </Stack>
);
