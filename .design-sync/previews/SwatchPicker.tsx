// Mirrors src/stories/molecules/SwatchPicker.stories.svelte
import * as React from 'react';
import { SwatchPicker } from '@svnbjrn/ironmaw';

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
  { value: '#ffffff', label: 'Paper' },
];

export const Default = () => (
  <SwatchPicker colors={colors} value="#0f766e" aria-label="Document accent colour" columns={6} />
);

export const PaleSelected = () => (
  <SwatchPicker colors={colors} value="#ffffff" aria-label="Document accent colour" columns={6} />
);

export const EightColumns = () => (
  <SwatchPicker colors={colors} value="oklch(0.75 0.12 80)" aria-label="Document accent colour" columns={8} />
);
