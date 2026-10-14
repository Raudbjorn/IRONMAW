// Mirrors src/stories/atoms/Mark.stories.svelte
import * as React from 'react';
import { Mark, Stack } from '@svnbjrn/ironmaw';

export const Lockup = () => <Mark variant="lockup" name="IRONMAW" tagline="Wormian Bones" />;

export const Bear = () => (
  <Stack direction="row" gap={6} align="center" wrap>
    <Mark variant="bear" size="sm" />
    <Mark variant="bear" size="md" />
    <Mark variant="bear" size="lg" />
  </Stack>
);

export const OnPlate = () => <Mark variant="bear" size="lg" plate />;

export const Emblem = () => (
  <Stack direction="row" gap={4} align="center" wrap>
    <Mark variant="emblem" size="sm" />
    <Mark variant="emblem" size="md" />
    <Mark variant="lockup" size="sm" name="IRONMAW" tagline="Application Assistant" />
  </Stack>
);

export const Wordmark = () => (
  <Stack gap={6}>
    <Mark variant="wordmark" size="sm" name="IRONMAW" />
    <Mark variant="wordmark" size="md" name="IRONMAW" tagline="Application Assistant" />
    <Mark variant="wordmark" size="lg" name="Wormian Bones" tagline="A system of uncommon parts" />
  </Stack>
);

export const AsLink = () => <Mark href="#library" variant="lockup" size="sm" name="IRONMAW" tagline="Application Assistant" />;
