import { render, screen } from '@testing-library/svelte';
import { createRawSnippet } from 'svelte';
import { describe, expect, it } from 'vitest';
import StatusBar from './StatusBar.svelte';

describe('StatusBar', () => {
  it('is a footer with the label and a polite status region', () => {
    const { container } = render(StatusBar, { props: { label: 'Local workspace', status: 'Saved on this device.' } });
    expect(container.querySelector('footer[data-wm="status-bar"]')).toBeInTheDocument();
    expect(screen.getByText('Local workspace')).toBeInTheDocument();
    const status = screen.getByRole('status');
    expect(status).toHaveTextContent('Saved on this device.');
    expect(status).toHaveAttribute('aria-live', 'polite');
  });
  it('reflects tone and omits the label when absent', () => {
    const { container } = render(StatusBar, { props: { status: 'Couldn’t save.', tone: 'error' } });
    expect(container.querySelector('[data-wm="status-bar"]')).toHaveAttribute('data-tone', 'error');
    expect(container.querySelector('[data-part="label"]')).toBeNull();
  });
  it('renders the end snippet', () => {
    const end = createRawSnippet(() => ({ render: () => '<span>Page 1 of 2</span>' }));
    render(StatusBar, { props: { status: 'x', end } });
    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
  });
});
