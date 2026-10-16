import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import ChangeMark from './ChangeMark.svelte';

const children = createRawSnippet(() => ({ render: () => '<span>Þróaði innri vefþjónustu.</span>' }));
const mark = (c: HTMLElement) => c.querySelector('[data-wm="change-mark"]')!;

describe('ChangeMark', () => {
  it('keeps the content and announces the default edit label', () => {
    const { container } = render(ChangeMark, { props: { kind: 'edit', children } });
    expect(screen.getByText('Þróaði innri vefþjónustu.')).toBeInTheDocument();
    expect(container.querySelector('[data-part="sr"]')).toHaveTextContent('(Your edit · not saved)');
    expect(container.querySelector('[data-part="flag"]')).toHaveTextContent('Your edit · not saved');
  });
  it('uses the suggestion default and a custom label', () => {
    const a = render(ChangeMark, { props: { kind: 'suggestion', children } });
    expect(mark(a.container)).toHaveAttribute('data-kind', 'suggestion');
    expect(a.container.querySelector('[data-part="sr"]')).toHaveTextContent('(Suggested · unreviewed)');
    const b = render(ChangeMark, { props: { kind: 'edit', label: 'Changed today', children } });
    expect(b.container.querySelector('[data-part="sr"]')).toHaveTextContent('(Changed today)');
  });
  it('renders the flag per mode, hidden from assistive tech', () => {
    const margin = render(ChangeMark, { props: { kind: 'edit', children } });
    expect(margin.container.querySelector('[data-part="flag"]')).toHaveAttribute('aria-hidden', 'true');
    const edge = render(ChangeMark, { props: { kind: 'edit', flag: 'edge', children } });
    expect(edge.container.querySelector('[data-part="edge"]')).toBeInTheDocument();
    expect(edge.container.querySelector('[data-part="flag"]')).toBeNull();
    const none = render(ChangeMark, { props: { kind: 'edit', flag: 'none', children } });
    expect(none.container.querySelector('[data-part="flag"], [data-part="edge"]')).toBeNull();
  });
  it('can render as a span', () => {
    const { container } = render(ChangeMark, { props: { kind: 'edit', as: 'span', children } });
    expect(mark(container).tagName).toBe('SPAN');
  });
});
