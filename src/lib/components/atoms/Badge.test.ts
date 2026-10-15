import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Badge from './Badge.svelte';

describe('Badge', () => {
  it('shows the value', () => {
    render(Badge, { props: { value: 6 } });
    expect(screen.getByText('6')).toBeInTheDocument();
  });
  it('gives an accessible label for the bare figure', () => {
    render(Badge, { props: { value: 6, label: '6 checks to review' } });
    expect(screen.getByText('6 checks to review')).toBeInTheDocument();
    expect(screen.getByText('6')).toHaveAttribute('aria-hidden', 'true');
  });
  it('marks numeric values and carries tone', () => {
    const { container } = render(Badge, { props: { value: 3, tone: 'warning' } });
    const el = container.querySelector('[data-wm="badge"]');
    expect(el).toHaveAttribute('data-tone', 'warning');
    expect(el).toHaveAttribute('data-numeric');
  });
});
