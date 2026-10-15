import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import DocSection from './DocSection.svelte';

const children = createRawSnippet(() => ({ render: () => '<p>Efni</p>' }));

describe('DocSection', () => {
  it('renders the title as an h2 with its content, case unchanged', () => {
    render(DocSection, { props: { title: 'Starfsreynsla', children } });
    expect(screen.getByRole('heading', { level: 2, name: 'Starfsreynsla' })).toBeInTheDocument();
    expect(screen.getByText('Efni')).toBeInTheDocument();
  });
  it('defaults to one column and supports two', () => {
    const { container, rerender } = render(DocSection, { props: { title: 'T', children } });
    expect(container.querySelector('[data-wm="doc-section"]')).toHaveAttribute('data-columns', '1');
    rerender({ title: 'T', columns: 2, children });
    expect(container.querySelector('[data-wm="doc-section"]')).toHaveAttribute('data-columns', '2');
  });
});
