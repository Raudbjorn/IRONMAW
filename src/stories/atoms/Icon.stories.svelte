<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { Icon, Stack, Text, ICON_NAMES } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Atoms/Icon',
    component: Icon,
    args: { name: 'check', size: 16 },
    parameters: { docs: { description: { component: 'The IRONMAW line icon set: one stroke weight, round joins, colour follows the text. Decorative unless given a label.' } } }
  });
  const tones = ['inherit', 'muted', 'accent', 'action', 'warning', 'error'] as const;
</script>

<Story name="Default" />

<Story name="All icons" asChild>
  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: var(--wm-space-4);">
    {#each ICON_NAMES as name (name)}
      <Stack direction="row" gap={2} align="center">
        <Icon {name} size={20} />
        <Text size="xs" tone="muted">{name}</Text>
      </Stack>
    {/each}
  </div>
</Story>

<Story name="Sizes" asChild>
  <Stack direction="row" gap={4} align="center">
    <Icon name="search" size={12} />
    <Icon name="search" size={16} />
    <Icon name="search" size={20} />
    <Icon name="search" size={24} />
  </Stack>
</Story>

<Story name="Tones" asChild>
  <Stack direction="row" gap={4} align="center">
    {#each tones as tone (tone)}
      <Icon name="warning" size={20} {tone} />
    {/each}
  </Stack>
</Story>
