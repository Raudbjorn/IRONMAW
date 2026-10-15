// Mirrors src/stories/molecules/SegmentedControl.stories.svelte
import * as React from 'react';
import { SegmentedControl, Stack } from '@svnbjrn/ironmaw';

const modes = [
  { id: 'write', label: 'Write', icon: 'write' },
  { id: 'design', label: 'Design', icon: 'design' },
  { id: 'check', label: 'Check', icon: 'checklist', count: 6, countTone: 'warning', countLabel: '6 checks to review' },
] as const;

export const ModesWithCount = () => (
  <SegmentedControl aria-label="Editor mode" options={[...modes]} value="check" size="md" />
);

export const Small = () => <SegmentedControl aria-label="Editor mode" options={[...modes]} value="write" size="sm" />;

export const IconOnly = () => <SegmentedControl aria-label="View" options={[...modes]} value="write" iconOnly />;

export const DisabledSegment = () => (
  <Stack gap={3}>
    <SegmentedControl
      aria-label="Preview"
      value="person"
      options={[
        { id: 'person', label: 'What a person sees' },
        { id: 'parser', label: 'What a parser reads', disabled: true },
      ]}
    />
  </Stack>
);
