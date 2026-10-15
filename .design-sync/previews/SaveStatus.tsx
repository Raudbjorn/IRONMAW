// Mirrors src/stories/atoms/SaveStatus.stories.svelte
import * as React from 'react';
import { SaveStatus, Stack } from '@svnbjrn/ironmaw';

export const Saved = () => <SaveStatus state="saved" />;

export const EveryState = () => (
  <Stack gap={2}>
    <SaveStatus state="saved" />
    <SaveStatus state="saving" />
    <SaveStatus state="unsaved" />
    <SaveStatus state="error" />
  </Stack>
);

export const CustomLabel = () => <SaveStatus state="saved" label="Saved at 14:32" />;
