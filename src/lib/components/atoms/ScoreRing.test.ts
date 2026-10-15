import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import ScoreRing from './ScoreRing.svelte';

describe('ScoreRing', () => {
  it('is a meter with value, bounds and name', () => {
    render(ScoreRing, { props: { value: 72, label: 'Parse readability' } });
    const m = screen.getByRole('meter', { name: 'Parse readability' });
    expect(m).toHaveAttribute('aria-valuenow', '72');
    expect(m).toHaveAttribute('aria-valuemin', '0');
    expect(m).toHaveAttribute('aria-valuemax', '100');
    expect(m).toHaveTextContent('72');
  });
  it('clamps to the range', () => {
    render(ScoreRing, { props: { value: 140, label: 'Score' } });
    expect(screen.getByRole('meter')).toHaveAttribute('aria-valuenow', '100');
  });
  it('shows a dash and value text when there is no score', () => {
    render(ScoreRing, { props: { value: Number.NaN, label: 'Score' } });
    const m = screen.getByRole('meter');
    expect(m).toHaveTextContent('—');
    expect(m).toHaveAttribute('aria-valuetext', 'No score yet');
    expect(m).not.toHaveAttribute('aria-valuenow');
  });
});
