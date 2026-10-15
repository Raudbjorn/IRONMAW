import { fireEvent, render, screen } from '@testing-library/svelte';
import { describe, expect, it, vi } from 'vitest';
import Switch from './Switch.svelte';

describe('Switch', () => {
  it('is a switch reflecting checked', () => {
    render(Switch, { props: { label: 'Page numbers', checked: true } });
    expect(screen.getByRole('switch', { name: 'Page numbers' })).toHaveAttribute('aria-checked', 'true');
  });
  it('toggles on click and on label click, reporting the value', async () => {
    const onchange = vi.fn();
    render(Switch, { props: { label: 'Page numbers', onchange } });
    await fireEvent.click(screen.getByRole('switch'));
    expect(onchange).toHaveBeenLastCalledWith(true);
    await fireEvent.click(screen.getByText('Page numbers'));
    expect(onchange).toHaveBeenLastCalledWith(false);
  });
  it('describes via aria-describedby and honours disabled', async () => {
    const onchange = vi.fn();
    render(Switch, { props: { label: 'Links', description: 'Underline links', disabled: true, onchange } });
    const sw = screen.getByRole('switch');
    expect(sw).toHaveAccessibleDescription('Underline links');
    await fireEvent.click(sw);
    expect(onchange).not.toHaveBeenCalled();
  });
});
