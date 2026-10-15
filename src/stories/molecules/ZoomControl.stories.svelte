<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { ZoomControl } from '../../lib/index';

  const { Story } = defineMeta({
    title: 'Molecules/ZoomControl',
    component: ZoomControl,
    args: { value: 'fit', pageCount: 2 },
    argTypes: { onchange: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'Floating zoom bar for the page canvas. The figure toggles between Fit and 100%; plus and minus step from 100 when fit. The consumer owns the value.' } } }
  });
</script>

<Story name="Fit" />

<Story name="Zoomed" args={{ value: 125, pageCount: 1 }} />

<Story name="At the limit" args={{ value: 400, pageCount: 3 }} />
