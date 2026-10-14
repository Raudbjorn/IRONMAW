<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';

  const { Story } = defineMeta({
    title: 'Foundations/Geometry',
    parameters: {
      controls: { disable: true },
      docs: {
        description: {
          component:
            'Fitted shapes, visible seams, carefully differentiated parts. Radii are small (2/4/6px). The **chamfer** is one 10px clipped corner on primary controls and the active destination — ' +
            'one size, never scaled. The **tick** is the 18px rust dash under labels. The **suture** is the seam between parts. Spacing is a 4px scale in steps 1/2/3/4/6/8/12.'
        }
      }
    }
  });
</script>

<script lang="ts">
  import { Button, Kicker, Stack, Suture, Text } from '../../lib/index';
  const steps = [1, 2, 3, 4, 6, 8, 12] as const;
</script>

<Story name="Shapes" asChild>
  <Stack gap={6}>
    <Stack gap={3}>
      <Kicker tick>Chamfer</Kicker>
      <Stack direction="row" gap={3} align="center" wrap>
        <Button>Search</Button>
        <Button size="lg">Copy passage with source</Button>
        <Button chamfer={false}>No chamfer</Button>
      </Stack>
      <Text size="sm" tone="muted">Top-right corner, 10px, on the fill only — the focus ring stays rectangular and unclipped.</Text>
    </Stack>
    <Suture label="Spacing" />
    <Stack gap={2}>
      {#each steps as s (s)}
        <Stack direction="row" gap={3} align="center">
          <Text mono size="xs" tone="muted" as="span">space-{s}</Text>
          <span class="bar" style:width={`var(--wm-space-${s})`}></span>
          <Text size="xs" tone="faint" as="span">{s * 4}px</Text>
        </Stack>
      {/each}
    </Stack>
    <Suture label="Radius" />
    <Stack direction="row" gap={4} wrap>
      <span class="box" style:border-radius="var(--wm-radius-sm)"><Text size="xs" tone="muted">sm · 2px</Text></span>
      <span class="box" style:border-radius="var(--wm-radius-md)"><Text size="xs" tone="muted">md · 4px</Text></span>
      <span class="box" style:border-radius="var(--wm-radius-lg)"><Text size="xs" tone="muted">lg · 6px</Text></span>
    </Stack>
  </Stack>
</Story>

<style>
  .bar { display: inline-block; height: 12px; background: var(--wm-accent); }
  .box { display: inline-flex; align-items: center; justify-content: center; width: 96px; height: 64px; border: 1px solid var(--wm-border-strong); background: var(--wm-surface-2); }
</style>
