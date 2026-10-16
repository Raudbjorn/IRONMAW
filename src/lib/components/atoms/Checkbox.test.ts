import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Checkbox from './Checkbox.svelte';

describe('Checkbox', () => {
  it('is a native checkbox named by its label', () => {
    render(Checkbox, { props: { label: 'Include references', checked: true } });
    const box = screen.getByRole('checkbox', { name: 'Include references' }) as HTMLInputElement;
    expect(box.type).toBe('checkbox');
    expect(box.checked).toBe(true);
  });
  it('toggles from the label text and reports the value', async () => {
    const onchange = vi.fn();
    render(Checkbox, { props: { label: 'Include references', onchange } });
    await fireEvent.click(screen.getByText('Include references'));
    expect(onchange).toHaveBeenLastCalledWith(true);
    await fireEvent.click(screen.getByRole('checkbox'));
    expect(onchange).toHaveBeenLastCalledWith(false);
  });
  it('shows indeterminate and clears it on toggle', async () => {
    render(Checkbox, { props: { label: 'All sections', indeterminate: true } });
    const box = screen.getByRole('checkbox') as HTMLInputElement;
    expect(box.indeterminate).toBe(true);
    await fireEvent.click(box);
    expect(box.indeterminate).toBe(false);
  });
  it('describes via aria-describedby and honours disabled', async () => {
    const onchange = vi.fn();
    render(Checkbox, { props: { label: 'Photo', description: 'Optional in Iceland.', disabled: true, onchange, name: 'photo' } });
    const box = screen.getByRole('checkbox');
    expect(box).toHaveAccessibleDescription('Optional in Iceland.');
    expect(box).toHaveAttribute('name', 'photo');
    await fireEvent.click(box);
    expect(onchange).not.toHaveBeenCalled();
  });
});
