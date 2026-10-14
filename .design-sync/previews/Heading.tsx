// Mirrors src/stories/atoms/Heading.stories.svelte
import * as React from 'react';
import { Heading, Stack } from '@svnbjrn/ironmaw';

export const Default = () => <Heading level={1}>cv-sveinbjorn-geirsson.is.pdf</Heading>;

export const Ramp = () => (
  <Stack gap={3}>
    <Heading level={1}>Level 1 — 28px</Heading>
    <Heading level={2}>Level 2 — 22px</Heading>
    <Heading level={3}>Level 3 — 18px</Heading>
    <Heading level={4}>Level 4 — 16px</Heading>
  </Stack>
);

export const Display = () => (
  <Stack gap={3}>
    <Heading level={1} display>Library</Heading>
    <Heading level={2} display>Wormian Bones</Heading>
    <Heading level={3} display>Sources</Heading>
  </Stack>
);
