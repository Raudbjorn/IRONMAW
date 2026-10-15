import { render, screen } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import { createRawSnippet } from 'svelte';
import Button from './Button.svelte';

const text = (s: string) => createRawSnippet(() => ({ render: () => `<span>${s}</span>` }));

describe('Button', () => {
  it('renders a chamfered primary button by default', () => {
    render(Button, { props: { children: text('Search') } });
    const b = screen.getByRole('button', { name: 'Search' });
    expect(b).toHaveAttribute('data-variant', 'primary');
    expect(b).toHaveAttribute('data-chamfer');
  });
  it('drops the chamfer for secondary and ghost', () => {
    render(Button, { props: { variant: 'ghost', children: text('Close') } });
    expect(screen.getByRole('button', { name: 'Close' })).not.toHaveAttribute('data-chamfer');
  });
  it('loading sets aria-busy and disables the element', () => {
    render(Button, { props: { loading: true, children: text('Searching…') } });
    const b = screen.getByRole('button');
    expect(b).toHaveAttribute('aria-busy', 'true');
    expect(b).toBeDisabled();
  });
  it('icon-only buttons take their name from label', () => {
    render(Button, { props: { label: 'Close reader', children: text('×') } });
    expect(screen.getByRole('button', { name: 'Close reader' })).toHaveAttribute('data-icon-only');
  });
  it('renders leading and trailing icons as decoration', () => {
    const { container } = render(Button, { props: { icon: 'download', iconEnd: 'chevron-down', children: text('Download PDF') } });
    expect(screen.getByRole('button', { name: 'Download PDF' })).toBeInTheDocument();
    const icons = container.querySelectorAll('[data-wm="icon"]');
    expect(icons).toHaveLength(2);
    icons.forEach((i) => expect(i).toHaveAttribute('aria-hidden', 'true'));
  });
  it('icon-only works without children', () => {
    render(Button, { props: { label: 'Hide section', icon: 'eye', variant: 'ghost', size: 'xs' } });
    const b = screen.getByRole('button', { name: 'Hide section' });
    expect(b).toHaveAttribute('data-size', 'xs');
    expect(b).toHaveAttribute('data-icon-only');
  });
  it('dashed is unchamfered and reports pressed state', () => {
    render(Button, { props: { variant: 'dashed', 'aria-pressed': true, children: text('Add section') } });
    const b = screen.getByRole('button', { name: 'Add section' });
    expect(b).not.toHaveAttribute('data-chamfer');
    expect(b).toHaveAttribute('aria-pressed', 'true');
  });
  it('renders an anchor when href is set', () => {
    render(Button, { props: { href: '#back', children: text('Back to results') } });
    expect(screen.getByRole('link', { name: 'Back to results' })).toHaveAttribute('href', '#back');
  });
});
