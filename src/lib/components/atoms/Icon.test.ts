import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Icon from './Icon.svelte';
import { ICONS } from '../../icons.ts';

describe('Icon', () => {
  it('is decorative without a label', () => {
    const { container } = render(Icon, { props: { name: 'check' } });
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
  });
  it('is an image with a label', () => {
    render(Icon, { props: { name: 'check', label: 'Done' } });
    expect(screen.getByRole('img', { name: 'Done' })).toBeInTheDocument();
  });
  it('sizes the svg', () => {
    const { container } = render(Icon, { props: { name: 'plus', size: 24 } });
    expect(container.querySelector('svg')).toHaveAttribute('width', '24');
  });
  it('draws a path for every name', () => {
    for (const d of Object.values(ICONS)) expect(d.length).toBeGreaterThan(0);
  });
});
