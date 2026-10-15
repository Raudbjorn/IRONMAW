import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import PageSheet from './PageSheet.svelte';

const children = createRawSnippet(() => ({ render: () => '<p>Ferilskrá</p>' }));

describe('PageSheet', () => {
  it('defaults to a bone A4 sheet with its label outside the paper', () => {
    const { container } = render(PageSheet, { props: { label: 'Page 1 · A4', children } });
    expect(screen.getByText('Page 1 · A4')).toBeInTheDocument();
    const sheet = container.querySelector('[data-part="sheet"]')!;
    expect(sheet).toHaveAttribute('data-theme', 'bone');
    expect(sheet).not.toContainElement(screen.getByText('Page 1 · A4'));
    expect(container.querySelector('[data-wm="page-sheet"]')).toHaveAttribute('data-size', 'a4');
  });
  it('can follow the surrounding edition and use letter size', () => {
    const { container } = render(PageSheet, { props: { edition: 'inherit', size: 'letter', 'aria-label': 'Résumé', children } });
    expect(container.querySelector('[data-part="sheet"]')).not.toHaveAttribute('data-theme');
    expect(container.querySelector('[data-wm="page-sheet"]')).toHaveAttribute('data-size', 'letter');
    expect(screen.getByRole('group', { name: 'Résumé' })).toBeInTheDocument();
  });
});
