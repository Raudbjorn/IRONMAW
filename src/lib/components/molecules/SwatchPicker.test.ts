import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import SwatchPicker, { luminanceOf } from './SwatchPicker.svelte';

const colors = [
  { value: '#0f766e', label: 'Teal' },
  { value: '#b7410e', label: 'Rust' },
  { value: '#fafafa', label: 'Paper' },
  { value: 'oklch(0.7 0.1 80)', label: 'Sand' }
];

describe('SwatchPicker', () => {
  it('is a radiogroup of named swatches with roving tabindex', () => {
    render(SwatchPicker, { props: { colors, value: '#b7410e', 'aria-label': 'Accent colour' } });
    expect(screen.getByRole('radiogroup', { name: 'Accent colour' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: 'Rust' })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: 'Rust' })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Teal' })).toHaveAttribute('tabindex', '-1');
  });
  it('moves in two dimensions', async () => {
    const onchange = vi.fn();
    render(SwatchPicker, { props: { colors, value: '#0f766e', columns: 2, onchange, 'aria-label': 'c' } });
    await fireEvent.keyDown(screen.getByRole('radio', { name: 'Teal' }), { key: 'ArrowDown' });
    expect(onchange).toHaveBeenLastCalledWith('#fafafa');
    await fireEvent.keyDown(screen.getByRole('radio', { name: 'Paper' }), { key: 'ArrowRight' });
    expect(onchange).toHaveBeenLastCalledWith('oklch(0.7 0.1 80)');
    await fireEvent.keyDown(screen.getByRole('radio', { name: 'Sand' }), { key: 'Home' });
    expect(onchange).toHaveBeenLastCalledWith('#0f766e');
    await fireEvent.keyDown(screen.getByRole('radio', { name: 'Teal' }), { key: 'End' });
    expect(onchange).toHaveBeenLastCalledWith('oklch(0.7 0.1 80)');
  });
  it('computes luminance for hex and rgb only', () => {
    expect(luminanceOf('#fff')).toBeCloseTo(1, 1);
    expect(luminanceOf('rgb(0, 0, 0)')).toBe(0);
    expect(luminanceOf('oklch(0.7 0.1 80)')).toBeUndefined();
  });
});
