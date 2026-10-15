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
    <Button variant="ghost" label="Close reader" icon="close" />
    <Button variant="secondary" label="Expand reader" icon="zoom-fit" />
    <Button variant="primary" label="Submit search" icon="chevron-right" />
    <Button variant="ghost" size="xs" label="Hide section" icon="eye" />
  </Stack>
);

export const WithIcons = () => (
  <Stack direction="row" gap={3} align="center" wrap>
    <Button icon="download">Download PDF</Button>
    <Button variant="secondary" icon="share">Share</Button>
    <Button variant="secondary" size="sm" icon="heading">Use the standard heading</Button>
    <Button variant="ghost" size="sm" iconEnd="chevron-down">Sveinbjörn Geirsson</Button>
  </Stack>
);

export const Dashed = () => (
  <div style={{ maxWidth: 320 }}>
    <Button variant="dashed" icon="plus">Add section</Button>
  </div>
);

export const AsLink = () => <Button href="#library" variant="secondary">Back to results</Button>;
