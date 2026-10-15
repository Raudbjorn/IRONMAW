import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import PageCanvas from './PageCanvas.svelte';

const snip = (html: string) => createRawSnippet(() => ({ render: () => html }));

describe('PageCanvas', () => {
  it('is a focusable, named region with toolbar and overlay slots', () => {
    render(PageCanvas, { props: { children: snip('<div>sheet</div>'), toolbar: snip('<div>bar</div>'), overlay: snip('<div>zoom</div>') } });
    const region = screen.getByRole('region', { name: 'Document preview' });
    expect(region).toHaveAttribute('tabindex', '0');
    expect(screen.getByText('bar')).toBeInTheDocument();
    expect(screen.getByText('zoom')).toBeInTheDocument();
    expect(screen.getByText('sheet')).toBeInTheDocument();
  });
  it('applies a numeric zoom as a scale', () => {
    const { container } = render(PageCanvas, { props: { zoom: 150, 'aria-label': 'Preview', children: snip('<i>p</i>') } });
    expect(screen.getByRole('region', { name: 'Preview' })).toBeInTheDocument();
    expect((container.querySelector('[data-part="stack"]') as HTMLElement).dataset.scale).toBe('1.5');
  });
});
