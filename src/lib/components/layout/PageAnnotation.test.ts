import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import PageAnnotation from './PageAnnotation.svelte';

const children = createRawSnippet(() => ({ render: () => '<span>Reynsla í vefforritun</span>' }));

describe('PageAnnotation', () => {
  it('keeps the wrapped text and names the finding on the marker', () => {
    render(PageAnnotation, { props: { index: 2, label: 'Vague claim', children } });
    expect(screen.getByText('Reynsla í vefforritun')).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Finding 2: Vague claim' })).toBeInTheDocument();
  });
  it('reflects tone, active state and element', () => {
    const { container } = render(PageAnnotation, { props: { index: 1, label: 'x', tone: 'error', active: true, as: 'span', children } });
    const el = container.querySelector('[data-wm="page-annotation"]')!;
    expect(el.tagName).toBe('SPAN');
    expect(el).toHaveAttribute('data-tone', 'error');
    expect(el).toHaveAttribute('data-active');
  });
  it('marks inline use so the marker leads the text instead of the margin', () => {
    const { container } = render(PageAnnotation, { props: { index: 'a', label: 'x', as: 'span', children } });
    expect(container.querySelector('[data-wm="page-annotation"]')).toHaveAttribute('data-inline');
    const div = render(PageAnnotation, { props: { index: 'b', label: 'y', children } });
    expect(div.container.querySelector('[data-wm="page-annotation"]')).not.toHaveAttribute('data-inline');
  });
});
