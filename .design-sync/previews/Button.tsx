// Mirrors src/stories/atoms/Button.stories.svelte
import * as React from 'react';
import { Button, Stack } from '@svnbjrn/ironmaw';

export const Primary = () => <Button variant="primary">Copy passage with source</Button>;

export const Variants = () => (
  <Stack direction="row" gap={3} align="center" wrap>
    <Button variant="primary">Search</Button>
    <Button variant="secondary">Copy text only</Button>
    <Button variant="ghost">Close</Button>
    <Button variant="danger">Discard draft</Button>
  </Stack>
);

export const Sizes = () => (
  <Stack direction="row" gap={3} align="center" wrap>
    <Button size="sm">Retry</Button>
    <Button size="md">Retry</Button>
    <Button size="lg">Retry</Button>
  </Stack>
);

export const States = () => (
  <Stack direction="row" gap={3} align="center" wrap>
    <Button disabled>Search</Button>
    <Button loading>Searching…</Button>
    <Button variant="secondary" loading>Loading…</Button>
  </Stack>
);

export const IconOnly = () => (
  <Stack direction="row" gap={3} align="center" wrap>
    <Button variant="ghost" label="Close reader">×</Button>
    <Button variant="secondary" label="Expand reader">⤢</Button>
    <Button variant="primary" label="Submit search">→</Button>
  </Stack>
);

export const AsLink = () => <Button href="#library" variant="secondary">Back to results</Button>;
