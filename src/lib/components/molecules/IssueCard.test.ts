import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import IssueCard from './IssueCard.svelte';

const snip = (html: string) => createRawSnippet(() => ({ render: () => html }));

describe('IssueCard', () => {
  it('is an article named by its title', () => {
    render(IssueCard, { props: { index: 3, category: 'Parsing', title: 'Dates are ambiguous', children: snip('<p>Use month and year.</p>'), actions: snip('<button>Fix</button>') } });
    expect(screen.getByRole('article', { name: 'Dates are ambiguous' })).toBeInTheDocument();
    expect(screen.getByText('Parsing')).toBeInTheDocument();
    expect(screen.getByText('Use month and year.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Fix' })).toBeInTheDocument();
  });
  it('keeps the marker decorative and reflects tone and active', () => {
    const { container } = render(IssueCard, { props: { index: 1, title: 't', tone: 'error', active: true, children: snip('x') } });
    expect(container.querySelector('[data-wm="marker"]')).toHaveAttribute('aria-hidden', 'true');
    const card = container.querySelector('[data-wm="issue-card"]')!;
    expect(card).toHaveAttribute('data-tone', 'error');
    expect(card).toHaveAttribute('data-active');
  });
});
