<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { SegmentedControl, Stack } from '../../lib/index';

  const modes = [
    { id: 'write', label: 'Write', icon: 'write' },
    { id: 'design', label: 'Design', icon: 'design' },
    { id: 'check', label: 'Check', icon: 'checklist', count: 6, countTone: 'warning', countLabel: '6 checks to review' }
  ] as const;

  const { Story } = defineMeta({
    title: 'Molecules/SegmentedControl',
    component: SegmentedControl,
    args: { options: [...modes], value: 'write', 'aria-label': 'Editor mode', size: 'md' },
    argTypes: { onchange: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'Single-choice mode switch. Selected segment is filled teal (selection is interactive state, not the rust action). Radiogroup with roving tabindex; arrows skip disabled segments and wrap.' } } }
  });
</script>

<Story name="Modes with count" args={{ value: 'check' }} />

<Story name="Small" args={{ size: 'sm' }} />

<Story name="Icon only" args={{ iconOnly: true, 'aria-label': 'View' }} />

<Story name="Disabled segment" asChild>
  <Stack gap={3}>
    <SegmentedControl
      aria-label="Preview"
      value="person"
      options={[
        { id: 'person', label: 'What a person sees' },
        { id: 'parser', label: 'What a parser reads', disabled: true }
      ]}
    />
  </Stack>
</Story>
