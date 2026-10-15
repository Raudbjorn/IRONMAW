import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Marker from './Marker.svelte';

describe('Marker', () => {
  it('is decorative without a label', () => {
    const { container } = render(Marker, { props: { value: 2 } });
    expect(container.querySelector('[data-wm="marker"]')).toHaveAttribute('aria-hidden', 'true');
  });
  it('is an image with a label', () => {
    render(Marker, { props: { value: 2, label: 'Issue 2' } });
    expect(screen.getByRole('img', { name: 'Issue 2' })).toHaveTextContent('2');
  });
  it('defaults to warning tone, md size', () => {
    const { container } = render(Marker, { props: { value: 1 } });
    const el = container.querySelector('[data-wm="marker"]');
    expect(el).toHaveAttribute('data-tone', 'warning');
    expect(el).toHaveAttribute('data-size', 'md');
  });
});
