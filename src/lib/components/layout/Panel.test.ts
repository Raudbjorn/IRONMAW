import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import { terrainSvg } from '../../assets/terrain.ts';
import Panel from './Panel.svelte';

describe('Panel terrain', () => {
  it('renders the shared decorative vector with its token colors', () => {
    const children = createRawSnippet(() => ({ render: () => '<p>Content</p>' }));
    const { container } = render(Panel, { props: { terrain: true, children } });
    const decoration = container.querySelector('.terrain-crop');
    expect(decoration).toHaveAttribute('aria-hidden', 'true');
    expect(decoration?.querySelectorAll('path')).toHaveLength(6);
    expect(decoration?.querySelector('svg')?.getAttribute('style')).toContain('var(--wm-structure)');
    expect(decoration?.querySelector('.contours')?.getAttribute('style')).toContain('var(--wm-accent)');
    expect(terrainSvg).toContain('focusable="false"');
  });
});
