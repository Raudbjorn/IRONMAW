// Mirrors src/stories/atoms/StatusLabel.stories.svelte
import * as React from 'react';
import { REVIEW_STATUS, Stack, StatusLabel } from '@svnbjrn/ironmaw';

export const Default = () => <StatusLabel status="known-errors" />;

export const ThreeTones = () => (
  <Stack direction="row" gap={2} wrap>
    <StatusLabel status="known-errors" />
    <StatusLabel status="review-required" />
    <StatusLabel status="snapshot" />
  </Stack>
);

export const EveryStoredStatus = () => (
  <Stack direction="row" gap={2} wrap>
    {Object.keys(REVIEW_STATUS).map((s) => <StatusLabel key={s} status={s} />)}
  </Stack>
);

export const UnknownValue = () => (
  <Stack direction="row" gap={2} wrap>
    <StatusLabel status="some-new-status" />
    <StatusLabel status="private-browser-capture" />
  </Stack>
);
