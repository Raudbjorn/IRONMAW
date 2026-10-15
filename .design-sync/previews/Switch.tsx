// Mirrors src/stories/atoms/Switch.stories.svelte
import * as React from 'react';
import { Switch, Stack } from '@svnbjrn/ironmaw';

export const Default = () => <Switch label="Show page numbers" checked={false} />;

export const OnWithDescription = () => (
  <Switch label="Underline links" description="Links stay recognisable when printed." checked />
);

export const SettingsGroup = () => (
  <Stack gap={3}>
    <Switch label="Show page numbers" checked />
    <Switch label="Show profile photo" description="Optional in Iceland; leave off if unsure." />
    <Switch label="Compact spacing" disabled />
  </Stack>
);
