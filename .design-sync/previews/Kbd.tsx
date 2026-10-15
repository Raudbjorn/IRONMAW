// Mirrors src/stories/atoms/Kbd.stories.svelte
import * as React from 'react';
import { Kbd, Stack, Text } from '@svnbjrn/ironmaw';

export const Default = () => <Kbd keys={['Alt', '↑']} label="Alt plus Up" />;

export const InAHint = () => (
  <Stack direction="row" gap={2} align="center">
    <Text size="sm" tone="muted">Move a section</Text>
    <Kbd keys={['Alt', '↑', '↓']} label="Alt plus Up or Down" />
  </Stack>
);

export const SingleKey = () => <Kbd keys={['Esc']} label="Escape" />;
