// Mirrors src/stories/atoms/Icon.stories.svelte
import * as React from 'react';
import { Icon, Stack, Text, ICON_NAMES } from '@svnbjrn/ironmaw';

const tones = ['inherit', 'muted', 'accent', 'action', 'warning', 'error'] as const;

export const Default = () => <Icon name="check" size={16} />;

export const AllIcons = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 'var(--wm-space-4)' }}>
    {ICON_NAMES.map((name) => (
      <Stack key={name} direction="row" gap={2} align="center">
        <Icon name={name} size={20} />
        <Text size="xs" tone="muted">{name}</Text>
      </Stack>
    ))}
  </div>
);

export const Sizes = () => (
  <Stack direction="row" gap={4} align="center">
    <Icon name="search" size={12} />
    <Icon name="search" size={16} />
    <Icon name="search" size={20} />
    <Icon name="search" size={24} />
  </Stack>
);

export const Tones = () => (
  <Stack direction="row" gap={4} align="center">
    {tones.map((tone) => (
      <Icon key={tone} name="warning" size={20} tone={tone} />
    ))}
  </Stack>
);
