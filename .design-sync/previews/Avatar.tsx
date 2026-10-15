// Mirrors src/stories/atoms/Avatar.stories.svelte
import * as React from 'react';
import { Avatar, Stack } from '@svnbjrn/ironmaw';

export const Initials = () => <Avatar name="Sveinbjörn Geirsson" size="md" />;

export const Sizes = () => (
  <Stack direction="row" gap={3} align="center">
    <Avatar name="Sveinbjörn Geirsson" size="sm" />
    <Avatar name="Sveinbjörn Geirsson" size="md" />
    <Avatar name="Sveinbjörn Geirsson" size="lg" />
  </Stack>
);

export const IcelandicNames = () => (
  <Stack direction="row" gap={3} align="center">
    <Avatar name="Þórunn Ægisdóttir" size="lg" />
    <Avatar name="Ögmundur Ðalsson" size="lg" />
    <Avatar name="Björk" size="lg" />
  </Stack>
);

export const BrokenImageFallsBack = () => <Avatar name="Katrín Jónsdóttir" src="/missing.png" size="lg" />;
