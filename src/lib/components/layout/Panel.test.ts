import { render } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import { terrainSvg } from '../../assets/terrain.ts';
import Panel from './Panel.svelte';

describe('Panel terrain', () => {
  it('renders the shared decorative vector without inline styles', () => {
    const children = createRawSnippet(() => ({ render: () => '<p>Content</p>' }));
    const { container } = render(Panel, { props: { terrain: true, children } });
    const decoration = container.querySelector('.terrain-crop');
    expect(decoration).toHaveAttribute('aria-hidden', 'true');
    expect(decoration?.querySelectorAll('path')).toHaveLength(6);
    // Compiled SVG avoids raw HTML insertion and keeps paint in the stylesheet.
    expect(decoration?.querySelector('[style]')).toBeNull();
    expect(decoration?.querySelector('svg')).toHaveAttribute('focusable', 'false');
    expect(decoration?.querySelector('svg')).toHaveAttribute('preserveAspectRatio', 'xMidYMid slice');
    const master = document.createElement('div');
    master.innerHTML = terrainSvg;
    expect([...decoration!.querySelectorAll('path')].map((path) => path.getAttribute('d')))
      .toEqual([...master.querySelectorAll('path')].map((path) => path.getAttribute('d')));
  });
});
