import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import SegmentedControl from './SegmentedControl.svelte';

const options = [
  { id: 'write', label: 'Write', icon: 'write' as const },
  { id: 'design', label: 'Design', icon: 'design' as const, disabled: true },
  { id: 'check', label: 'Check', icon: 'checklist' as const, count: 6, countLabel: '6 checks to review' }
];

describe('SegmentedControl', () => {
  it('is a radiogroup with a roving tabindex', () => {
    render(SegmentedControl, { props: { options, value: 'check', 'aria-label': 'Mode' } });
    expect(screen.getByRole('radiogroup', { name: 'Mode' })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /Check/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('radio', { name: /Check/ })).toHaveAttribute('tabindex', '0');
    expect(screen.getByRole('radio', { name: 'Write' })).toHaveAttribute('tabindex', '-1');
  });
  it('arrows skip disabled and wrap; Home and End work', async () => {
    const onchange = vi.fn();
    render(SegmentedControl, { props: { options, value: 'write', onchange, 'aria-label': 'Mode' } });
    await fireEvent.keyDown(screen.getByRole('radio', { name: 'Write' }), { key: 'ArrowRight' });
    expect(onchange).toHaveBeenLastCalledWith('check');
    await fireEvent.keyDown(screen.getByRole('radio', { name: /Check/ }), { key: 'ArrowRight' });
    expect(onchange).toHaveBeenLastCalledWith('write');
    await fireEvent.keyDown(screen.getByRole('radio', { name: 'Write' }), { key: 'End' });
    expect(onchange).toHaveBeenLastCalledWith('check');
    await fireEvent.keyDown(screen.getByRole('radio', { name: /Check/ }), { key: 'Home' });
    expect(onchange).toHaveBeenLastCalledWith('write');
  });
  it('falls back to the first enabled option for an unknown value', () => {
    render(SegmentedControl, { props: { options, value: 'nope', 'aria-label': 'Mode' } });
    expect(screen.getByRole('radio', { name: 'Write' })).toHaveAttribute('aria-checked', 'true');
  });
  it('exposes the count label', () => {
    render(SegmentedControl, { props: { options, value: 'write', 'aria-label': 'Mode' } });
    expect(screen.getByRole('radio', { name: /6 checks to review/ })).toBeInTheDocument();
  });
  it('uses labels as names in icon-only mode', () => {
    render(SegmentedControl, { props: { options, value: 'write', iconOnly: true, 'aria-label': 'Mode' } });
    expect(screen.getByRole('radio', { name: 'Write' })).toHaveAttribute('title', 'Write');
  });
});
