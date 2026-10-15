import { fireEvent, render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it, vi } from 'vitest';
import AppHeader from './AppHeader.svelte';

const snip = (html: string) => createRawSnippet(() => ({ render: () => html }));

describe('AppHeader', () => {
  it('renders a banner with title, status, centre and end slots', () => {
    render(AppHeader, { props: { title: 'Ferilskrá 2026', status: snip('<span>Saved</span>'), center: snip('<span>modes</span>'), end: snip('<span>actions</span>') } });
    expect(screen.getByRole('banner')).toBeInTheDocument();
    for (const t of ['Ferilskrá 2026', 'Saved', 'modes', 'actions']) expect(screen.getByText(t)).toBeInTheDocument();
  });
  it('heading replaces the title', () => {
    render(AppHeader, { props: { title: 'Hidden', heading: snip('<button>Menu</button>') } });
    expect(screen.queryByText('Hidden')).toBeNull();
    expect(screen.getByRole('button', { name: 'Menu' })).toBeInTheDocument();
  });
  it('back is an icon-only button with an accessible name', async () => {
    const onclick = vi.fn();
    render(AppHeader, { props: { back: { label: 'Back to library', onclick } } });
    await fireEvent.click(screen.getByRole('button', { name: 'Back to library' }));
    expect(onclick).toHaveBeenCalled();
  });
  it('back can be a link', () => {
    render(AppHeader, { props: { back: { label: 'Back', href: '/library' } } });
    expect(screen.getByRole('link', { name: 'Back' })).toHaveAttribute('href', '/library');
  });
});
