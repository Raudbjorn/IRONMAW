<script module lang="ts">
  import { defineMeta } from '@storybook/addon-svelte-csf';
  import { SwatchPicker } from '../../lib/index';

  const colors = [
    { value: '#0f766e', label: 'Teal' },
    { value: '#b7410e', label: 'Rust' },
    { value: '#334155', label: 'Slate' },
    { value: '#1e3a8a', label: 'Navy' },
    { value: '#6b21a8', label: 'Plum' },
    { value: '#166534', label: 'Fir' },
    { value: '#a16207', label: 'Ochre' },
    { value: '#f1f5f9', label: 'Mist' },
    { value: '#111827', label: 'Charcoal' },
    { value: 'rgb(120, 113, 108)', label: 'Stone' },
    { value: 'oklch(0.75 0.12 80)', label: 'Sand' },
    { value: '#ffffff', label: 'Paper' }
  ];

  const { Story } = defineMeta({
    title: 'Molecules/SwatchPicker',
    component: SwatchPicker,
    args: { colors, value: '#0f766e', 'aria-label': 'Document accent colour', columns: 6 },
    argTypes: { onchange: { table: { disable: true } } },
    parameters: { docs: { description: { component: 'A grid of colours, one choice. Radiogroup with 2-D arrow navigation. The tick picks light or dark ink from the swatch luminance; colours it cannot measure get a dark backing dot.' } } }
  });
</script>

<Story name="Default" />

<Story name="Pale selected" args={{ value: '#ffffff' }} />

<Story name="Eight columns" args={{ columns: 8, value: 'oklch(0.75 0.12 80)' }} />
