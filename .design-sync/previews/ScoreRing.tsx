// Mirrors src/stories/atoms/ScoreRing.stories.svelte
import * as React from 'react';
import { ScoreRing, Stack } from '@svnbjrn/ironmaw';

export const Default = () => <ScoreRing value={82} label="Parse readability" size="md" tone="accent" />;

export const Large = () => <ScoreRing value={64} label="Parse readability" size="lg" tone="warning" />;

export const Tones = () => (
  <Stack direction="row" gap={4} align="center">
    <ScoreRing value={90} label="Readable" tone="accent" />
    <ScoreRing value={55} label="Needs review" tone="warning" />
    <ScoreRing value={20} label="Hard to read" tone="error" />
  </Stack>
);

export const NoScoreYet = () => <ScoreRing value={Number.NaN} label="Parse readability" />;
