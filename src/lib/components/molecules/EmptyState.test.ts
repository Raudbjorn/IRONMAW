import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import EmptyState from './EmptyState.svelte';

const children = createRawSnippet(() => ({ render: () => '<p>Adapt a main CV to this job.</p>' }));
const actions = createRawSnippet(() => ({ render: () => '<button>Adapt main CV</button>' }));

describe('EmptyState', () => {
  it('renders a level 2 title, explanation and actions', () => {
    render(EmptyState, { props: { title: 'No CV yet', children, actions } });
    expect(screen.getByRole('heading', { level: 2, name: 'No CV yet' })).toBeInTheDocument();
    expect(screen.getByText('Adapt a main CV to this job.')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Adapt main CV' })).toBeInTheDocument();
  });
  it('omits actions and icon when not given', () => {
    const { container } = render(EmptyState, { props: { title: 'x', children } });
    expect(container.querySelector('.actions, .icon, .terrain-crop')).toBeNull();
  });
  it('shows a decorative icon and terrain', () => {
    const { container } = render(EmptyState, { props: { title: 'x', icon: 'file', terrain: true, children } });
    expect(container.querySelector('.icon')).toBeInTheDocument();
    expect(container.querySelector('.terrain-crop')).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelector('[data-wm="empty-state"]')).toHaveAttribute('data-terrain');
  });
});
