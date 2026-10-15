import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Kbd from './Kbd.svelte';

describe('Kbd', () => {
  it('renders each key in a kbd element', () => {
    const { container } = render(Kbd, { props: { keys: ['Alt', 'Up'] } });
    expect(container.querySelectorAll('kbd')).toHaveLength(2);
  });
  it('names the combination with label', () => {
    render(Kbd, { props: { keys: ['Alt', 'Up'], label: 'Alt plus Up or Down' } });
    expect(screen.getByRole('img', { name: 'Alt plus Up or Down' })).toBeInTheDocument();
  });
});
