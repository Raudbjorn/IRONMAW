<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Button, Stack } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Button',
    component: Button,
    args: { variant: 'primary', size: 'md', disabled: false, loading: false },
    argTypes: {
      variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
      size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
      chamfer: { control: 'boolean' },
      href: { control: 'text' },
      label: { control: 'text' },
      children: { table: { disable: true } },
      onclick: { table: { disable: true } }
    },
    parameters: {
      docs: {
        description: {
          component:
            'Rust fill, charcoal label and one clipped corner for the main action (component board B3). ' +
            'Labels are the display face, uppercase and tracked — short verbs only. Renders an `<a>` when `href` is set.'
        }
      }
    }
  });
</script>

<Story name="Primary">
  {#snippet template({ children: _, ...args })}
    <Button {...args}>Copy passage with source</Button>
  {/snippet}
</Story>

<Story name="Variants" asChild>
  <Stack direction="row" gap={3} align="center" wrap>
    <Button variant="primary">Search</Button>
    <Button variant="secondary">Copy text only</Button>
    <Button variant="ghost">Close</Button>
    <Button variant="danger">Discard draft</Button>
  </Stack>
</Story>

<Story name="Sizes" asChild>
  <Stack direction="row" gap={3} align="center" wrap>
    <Button size="sm">Retry</Button>
    <Button size="md">Retry</Button>
    <Button size="lg">Retry</Button>
  </Stack>
</Story>

<Story name="States" asChild>
  <Stack direction="row" gap={3} align="center" wrap>
    <Button disabled>Search</Button>
    <Button loading>Searching…</Button>
    <Button variant="secondary" loading>Loading…</Button>
  </Stack>
</Story>

<Story name="Icon only" asChild>
  <Stack direction="row" gap={3} align="center" wrap>
    <Button variant="ghost" label="Close reader">×</Button>
    <Button variant="secondary" label="Expand reader">⤢</Button>
    <Button variant="primary" label="Submit search">→</Button>
  </Stack>
</Story>

<Story name="As link" args={{ href: '#library', variant: 'secondary' }}>
  {#snippet template({ children: _, ...args })}
    <Button {...args}>Back to results</Button>
  {/snippet}
</Story>
