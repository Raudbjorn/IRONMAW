import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import Workspace from './Workspace.svelte';

const snip = (html: string) => createRawSnippet(() => ({ render: () => html }));

describe('Workspace', () => {
  it('renders header, a labelled sidebar and main', () => {
    render(Workspace, { props: { sidebarLabel: 'Editor', header: snip('<p>top</p>'), sidebar: snip('<p>side</p>'), children: snip('<p>canvas</p>') } });
    expect(screen.getByRole('complementary', { name: 'Editor' })).toHaveTextContent('side');
    expect(screen.getByRole('main')).toHaveTextContent('canvas');
    expect(screen.getByText('top')).toBeInTheDocument();
  });
  it('fills by default and can opt out; width is configurable', () => {
    const { container, rerender } = render(Workspace, { props: { sidebarLabel: 'x', sidebarWidth: '400px', sidebar: snip('a'), children: snip('b') } });
    const root = container.querySelector('[data-wm="workspace"]') as HTMLElement;
    expect(root).toHaveAttribute('data-fill');
    expect(root.style.getPropertyValue('--sidebar-w')).toBe('400px');
    rerender({ fill: false });
    expect(root).not.toHaveAttribute('data-fill');
  });
});
