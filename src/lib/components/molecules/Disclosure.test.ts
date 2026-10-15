import { createRawSnippet } from 'svelte';
import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Disclosure from './Disclosure.svelte';

const children = createRawSnippet(() => ({ render: () => '<p>Spacing controls</p>' }));
const actions = createRawSnippet(() => ({ render: () => '<button type="button">Reset</button>' }));

describe('Disclosure', () => {
  it('wires heading, button and region', () => {
    render(Disclosure, { props: { title: 'Page', children } });
    const btn = screen.getByRole('button', { name: 'Page' });
    expect(screen.getByRole('heading', { level: 3 })).toContainElement(btn);
    expect(btn).toHaveAttribute('aria-expanded', 'false');
    expect(btn.getAttribute('aria-controls')).toBeTruthy();
  });
  it('keeps content mounted but hidden when closed', () => {
    const { container } = render(Disclosure, { props: { title: 'Page', children } });
    expect(screen.getByText('Spacing controls')).not.toBeVisible();
    expect(container.querySelector('[role="region"]')).toHaveAttribute('hidden');
  });
  it('toggles and reports', async () => {
    const onchange = vi.fn();
    render(Disclosure, { props: { title: 'Page', onchange, children } });
    await fireEvent.click(screen.getByRole('button', { name: 'Page' }));
    expect(onchange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('region', { name: 'Page' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Page' })).toHaveAttribute('aria-expanded', 'true');
  });
  it('honours headingLevel and puts actions outside the toggle', () => {
    render(Disclosure, { props: { title: 'Profile', meta: 'Kópavogur', headingLevel: 2, actions, children, open: true } });
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' }).closest('h2')).toBeNull();
    expect(screen.getByText('Kópavogur')).toBeInTheDocument();
  });
});
